import { GET_BASE_URL } from './../data/constants';
import { useCallback } from 'react';
import { useBaseHttp } from './base-http';

type HookReturnType = {
  errorText: Nullable<string>;
  isLoadding: boolean;
  clearError: () => void;
  register: (name: string, email: string, password: string) => Promise<string>;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    accessToken: string;
  }>;
};
export const useAuth = (): HookReturnType => {
  const { errorText, isLoadding, clearError, postRequest } = useBaseHttp();

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const endpoint = GET_BASE_URL() + '/api/users/register';
      const body = {
        name,
        email,
        password,
      };
      return postRequest<{ data: string }>(endpoint, body).then((res) => res.data);
    },
    [postRequest],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const endpoint = GET_BASE_URL() + '/api/users/login';
      const body = {
        email,
        password,
      };
      return postRequest<{ accessToken: string }>(endpoint, body);
    },
    [postRequest],
  );
  return {
    errorText,
    isLoadding,
    register,
    login,
    clearError,
  };
};
