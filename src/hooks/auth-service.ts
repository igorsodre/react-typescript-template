import { IUser } from './../data/models/user-interface';
import { GET_BASE_URL } from './../data/constants';
import { useCallback } from 'react';
import { useBaseHttp } from './base-http';

type HookReturnType = {
  errorText: Nullable<string>;
  isLoadding: boolean;
  clearError: () => void;
  refreshToken: () => Promise<{ accessToken: string; user: IUser }>;
  register: (name: string, email: string, password: string) => Promise<string>;
  updateUser: (name: string, email: string, password: string, newpassword: string) => Promise<IUser>;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    accessToken: string;
    user: IUser;
  }>;
  logout: () => Promise<string>;
  getLoggedUser: () => Promise<IUser>;
};
export const useAuth = (): HookReturnType => {
  const { errorText, isLoadding, clearError, postRequest, getRequest } = useBaseHttp();

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

  const updateUser = useCallback(
    async (name: string, email: string, password: string, newpassword: string) => {
      const endpoint = GET_BASE_URL() + '/api/users/update';
      const body = {
        name,
        email,
        password,
        newpassword,
      };
      return postRequest<{ data: IUser }>(endpoint, body).then((res) => res.data);
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
      return postRequest<{ data: { accessToken: string; user: IUser } }>(endpoint, body).then((res) => res.data);
    },
    [postRequest],
  );

  const logout = useCallback(async () => {
    const endpoint = GET_BASE_URL() + '/api/users/logout';

    return postRequest<{ data: string }>(endpoint, {}).then((res) => res.data);
  }, [postRequest]);

  const refreshToken = useCallback(() => {
    const endpoint = GET_BASE_URL() + '/api/users/refresh_token';
    return postRequest<{ data: { accessToken: string; user: IUser } }>(endpoint, {}).then((res) => res.data);
  }, [postRequest]);

  const getLoggedUser = useCallback(async () => {
    const endpoint = GET_BASE_URL() + '/api/users';

    return getRequest<{ data: IUser }>(endpoint).then((res) => res.data);
  }, [getRequest]);

  return {
    errorText,
    isLoadding,
    register,
    updateUser,
    login,
    clearError,
    getLoggedUser,
    refreshToken,
    logout,
  };
};
