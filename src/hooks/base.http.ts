/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, CancelTokenSource, Method } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext, IAppContext } from '../data/app-context';
import { GET_BASE_URL } from '../data/constants';

/**
 * Whenever error.message is accessed we want to see the full API error message (JSON) if it's present
 * not just some generic http status code + message
 * see https://github.com/axios/axios/issues/960 for context
 *
 * @param axios
 */
axios.interceptors.response.use(undefined, function (error: AxiosError) {
  (error as any).originalMessage = error.message;
  Object.defineProperty(error, 'message', {
    get: function () {
      if (!error.response) {
        return (error as any).originalMessage;
      }
      if (typeof error.response.data.message === 'string') return error.response.data.message;
      return JSON.stringify(error.response.data.message);
    },
  });
  return Promise.reject(error);
});

const isValidToken = (token: Nullable<string>): boolean => {
  if (!token) return false;
  const { exp } = jwtDecode<JwtPayload>(token);
  if (!exp || Date.now() >= exp * 1000) return false;
  return true;
};

export const __ = <T extends (...args: never[]) => unknown>(callBack: T): T => useCallback(callBack, []);

type TObjectMap = { [key: string]: string };

type HttpService = {
  errorText: Nullable<string>;
  isLoadding: boolean;
  clearError: () => void;
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  get: <T>(endpoint: string) => Promise<T>;
  patch: <T>(endpoint: string, body: unknown) => Promise<T>;
  _delete: <T>(endpoint: string) => Promise<T>;
};

export const useHttp = (): HttpService => {
  const { token, setAccessToken } = useContext(AppContext) as IAppContext;
  const [errorText, setErrorText] = useState<Nullable<string>>();
  const [isLoadding, setIsloading] = useState(false);
  const activeHttpRequests = useRef<CancelTokenSource[]>([]);

  const clearError: HttpService['clearError'] = __(() => {
    setErrorText('');
  });

  const getCancelTokenSource = () => {
    const cancelToken = axios.CancelToken.source();
    activeHttpRequests.current.push(cancelToken);
    return cancelToken;
  };

  const removeCancelTokenSource = (cancelToken: CancelTokenSource) => {
    activeHttpRequests.current = activeHttpRequests.current.filter((t) => t !== cancelToken);
  };

  const getAccessToken = async () => {
    let accessToken = '';
    const tokenSource = getCancelTokenSource();
    try {
      const endpoint = GET_BASE_URL() + '/api/users/refresh_token';
      const result = await axios.post<{ data: { accessToken: string } }>(endpoint, null, {
        cancelToken: tokenSource.token,
        withCredentials: true,
      });
      accessToken = result.data.data.accessToken;
      setAccessToken(accessToken);
    } catch (err) {
      console.log(err);
    } finally {
      removeCancelTokenSource(tokenSource);
    }
    return accessToken;
  };

  const getAuthHeader = async () => {
    let accessToken = token;
    const header: TObjectMap = {};
    if (token && !isValidToken(accessToken)) {
      accessToken = await getAccessToken();
    }
    header.authorization = 'Bearer ' + accessToken;
    return header;
  };

  const request = async <T>(
    endpoint: string,
    method: Method,
    body: Nullable<unknown> = null,
    headers: TObjectMap = {},
  ): Promise<T> => {
    setIsloading(true);
    const tokenSource = getCancelTokenSource();
    try {
      const authHeader = await getAuthHeader();
      const result = await axios.request<T>({
        method: method,
        url: endpoint,
        data: body,
        cancelToken: tokenSource.token,
        withCredentials: true,
        headers: { ...authHeader, ...headers },
      });
      return result.data;
    } catch (err) {
      setErrorText(err.message);
      throw err;
    } finally {
      removeCancelTokenSource(tokenSource);
      setIsloading(false);
    }
  };

  const get = __(
    async <T>(endpoint: string): Promise<T> => {
      const result = await request<T>(endpoint, 'GET');
      return result;
    },
  );

  const post = __(
    async <T>(endpoint: string, body: unknown): Promise<T> => {
      const result = await request<T>(endpoint, 'POST', body);
      return result;
    },
  );

  const patch: HttpService['patch'] = __(
    async <T>(endpoint: string, body: unknown): Promise<T> => {
      const result = await request<T>(endpoint, 'PATCH', body);
      return result;
    },
  );

  const _delete: HttpService['_delete'] = __(
    async <T>(endpoint: string): Promise<T> => {
      const result = await request<T>(endpoint, 'DELETE');
      return result;
    },
  );

  useEffect(() => {
    const { current } = activeHttpRequests;
    return () => {
      current.forEach((t) => {
        t.cancel('Unmouting component');
      });
    };
  });

  return {
    errorText,
    isLoadding,
    clearError,
    get,
    post,
    patch,
    _delete,
  };
};
