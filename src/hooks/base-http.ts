/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { AppContext, IAppContext } from '../data/app-context';
import { GET_BASE_URL } from '../data/constants';

const JSON_HEADER = { 'Content-Type': 'application/json' };

const isValidToken = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token);
  if (!exp || Date.now() >= exp * 1000) return false;
  return true;
};

type TMethod = 'POST' | 'GET' | 'PATCH' | 'DELETE';

type TObjectMap = { [key: string]: string };

type HookReturnType = {
  errorText: Nullable<string>;
  isLoadding: boolean;
  clearError: () => void;
  postRequest: <T>(endpoint: string, body: any) => Promise<T>;
  getRequest: <T>(endpoint: string) => Promise<T>;
  patchRequest: <T>(endpoint: string, body: any) => Promise<T>;
  deleteRequest: <T>(endpoint: string, body?: any) => Promise<T>;
  multipartRequest: <T>(endpoint: string, body: any) => Promise<T>;
};

export const useBaseHttp = (): HookReturnType => {
  const { token, setAccessToken } = useContext(AppContext) as IAppContext;
  const [errorText, setErrorText] = useState<Nullable<string>>();
  const [isLoadding, setIsloading] = useState(false);
  const activeHttpRequests = useRef<AbortController[]>([]);

  // interceptor that refreshes the access token in case it expired
  const getAuthHeader = useCallback(async () => {
    let accessToken = token;
    const header: TObjectMap = {};
    if (accessToken) {
      if (!isValidToken(accessToken)) {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const endpoint = GET_BASE_URL() + '/api/users/refresh_token';
          const result = await fetch(endpoint, {
            method: 'POST',
            signal: httpAbortCtrl.signal,
            credentials: 'include',
          });
          const responseData = await result.json();
          activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);

          if (!result.ok || !responseData.data.accessToken) {
            return header;
          }
          accessToken = responseData.data.accessToken;
          setAccessToken(responseData.data.accessToken);
        } catch (err) {
          console.log(err);
        }
      }
      header.authorization = 'Bearer ' + accessToken;
    }
    return header;
  }, [setAccessToken, token]);

  // Base http function with default config for the app
  const httpRequest = useCallback(
    async <T>(endpoint: string, method: TMethod, body: any = null, headers: any = {}): Promise<T> => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const result = await fetch(endpoint, {
          method: method,
          headers: { ...(await getAuthHeader()), ...headers },
          body,
          signal: httpAbortCtrl.signal,
          credentials: 'include',
        });

        activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);
        const responseData = await result.json();
        if (!result.ok) {
          throw new Error(responseData.message);
        }
        setIsloading(false);
        return responseData;
      } catch (err) {
        setErrorText(err.message);
        setIsloading(false);
        throw err;
      }
    },
    [getAuthHeader],
  );

  const getRequest = useCallback(
    async <T>(endpoint: string): Promise<T> => {
      return httpRequest(endpoint, 'GET');
    },
    [httpRequest],
  );

  const postRequest = useCallback(
    async <T>(endpoint: string, body: any): Promise<T> => {
      return httpRequest(endpoint, 'POST', JSON.stringify(body), JSON_HEADER);
    },
    [httpRequest],
  );

  const multipartRequest = useCallback(
    async <T>(endpoint: string, body: FormData): Promise<T> => {
      return httpRequest(endpoint, 'POST', body);
    },
    [httpRequest],
  );

  const patchRequest = useCallback(
    async <T>(endpoint: string, body: any): Promise<T> => {
      return httpRequest(endpoint, 'PATCH', JSON.stringify(body), JSON_HEADER);
    },
    [httpRequest],
  );

  const deleteRequest = useCallback(
    async <T>(endpoint: string, body: any = null): Promise<T> => {
      return httpRequest(endpoint, 'DELETE', JSON.stringify(body), JSON_HEADER);
    },
    [httpRequest],
  );

  const clearError = (): void => {
    setErrorText(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    errorText,
    isLoadding,
    getRequest,
    postRequest,
    multipartRequest,
    patchRequest,
    deleteRequest,
    clearError,
  };
};
