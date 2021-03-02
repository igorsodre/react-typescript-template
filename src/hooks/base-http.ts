/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

type HookReturnType = {
  errorText: Nullable<string>;
  isLoadding: boolean;
  clearError: () => void;
  postRequest: <T>(endpoint: string, body: any) => Promise<T>;
  getRequest: <T>(endpoint: string) => Promise<T>;
  patchRequest: <T>(endpoint: string, body: any) => Promise<T>;
  deleteRequest: <T>(endpoint: string, body?: any) => Promise<T>;
};
type TMethod = 'POST' | 'GET' | 'MULTIPART' | 'PATCH' | 'DELETE';
const JSON_HEADER = { 'Content-Type': 'application/json' };
export const useBaseHttp = (): HookReturnType => {
  const [errorText, setErrorText] = useState<Nullable<string>>();
  const [isLoadding, setIsloading] = useState(false);
  const activeHttpRequests = useRef<AbortController[]>([]);

  const httpRequest = useCallback(
    async <T>(
      endpoint: string,
      method: TMethod,
      body: any = null,
      headers: any = {},
      includeCredentials = true,
    ): Promise<T> => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const result = await fetch(endpoint, {
          method: method,
          headers,
          body,
          signal: httpAbortCtrl.signal,
          credentials: includeCredentials ? 'include' : 'omit',
        });

        const responseData = await result.json();
        activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);

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
    [],
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
    postRequest,
    getRequest,
    patchRequest,
    deleteRequest,
    clearError,
  };
};
