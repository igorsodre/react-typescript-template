import { IUser } from './../data/models/user-interface';
import { GET_BASE_URL } from './../data/constants';
import { useHttp, __ } from './base.http';

type AuthService = {
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
export const useAuth = (): AuthService => {
  const { errorText, isLoadding, clearError, post, get } = useHttp();

  const register: AuthService['register'] = __(async (name, email, password) => {
    const endpoint = GET_BASE_URL() + '/api/users/register';
    const body = {
      name,
      email,
      password,
    };
    return post<{ data: string }>(endpoint, body).then((res) => res.data);
  });

  const updateUser: AuthService['updateUser'] = __(async (name, email, password, newpassword) => {
    const endpoint = GET_BASE_URL() + '/api/users/update';
    const body = {
      name,
      email,
      password,
      newpassword,
    };
    return post<{ data: IUser }>(endpoint, body).then((res) => res.data);
  });

  const login: AuthService['login'] = __(async (email, password) => {
    const endpoint = GET_BASE_URL() + '/api/users/login';
    const body = {
      email,
      password,
    };
    return post<{ data: { accessToken: string; user: IUser } }>(endpoint, body).then((res) => res.data);
  });

  const logout: AuthService['logout'] = __(async () => {
    const endpoint = GET_BASE_URL() + '/api/users/logout';

    return post<{ data: string }>(endpoint, {}).then((res) => res.data);
  });

  const refreshToken: AuthService['refreshToken'] = __(async () => {
    const endpoint = GET_BASE_URL() + '/api/users/refresh_token';
    return post<{ data: { accessToken: string; user: IUser } }>(endpoint, {}).then((res) => res.data);
  });

  const getLoggedUser: AuthService['getLoggedUser'] = __(async () => {
    const endpoint = GET_BASE_URL() + '/api/users';

    return get<{ data: IUser }>(endpoint).then((res) => res.data);
  });

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
