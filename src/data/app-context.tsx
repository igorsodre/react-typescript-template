import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth-service';
import { IUser } from './models/user-interface';

export interface IAppContext {
  logout: () => void;
  setAccessToken: (token: string) => void;
  token: Nullable<string>;
  currentUser: Nullable<IUser>;
  setCurrentUser: (user: IUser) => void;
  wholeAppIsLoading: boolean;
}

const AppContext = createContext<IAppContext | Record<string, unknown>>({});

const AppContextProvider: React.FC = (props) => {
  const [token, setAccessToken] = useState<Nullable<string>>(null);
  const [currentUser, setCurrentUser] = useState<Nullable<IUser>>();
  const { refreshToken, logout: doLogout } = useAuth();
  const [wholeAppIsLoading, setWholeAppIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await doLogout();
      setAccessToken('');
    } catch (err) {
      console.log(err);
    }
  }, [doLogout]);

  useEffect(() => {
    refreshToken()
      .then((res) => {
        setWholeAppIsLoading(false);
        if (res.accessToken) {
          setAccessToken(res.accessToken);
          setCurrentUser(res.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshToken]);

  return (
    <AppContext.Provider value={{ token, logout, setAccessToken, currentUser, setCurrentUser, wholeAppIsLoading }}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
