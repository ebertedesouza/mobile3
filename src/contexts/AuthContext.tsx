import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { api } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem('@santanapizzaria');
      const hasUser: UserProps | null = JSON.parse(userInfo || 'null');

      if (hasUser) {
        api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
        setUser(hasUser);
      }
      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post('/session', { email, password });

      const { id, name, token } = response.data;

      const data = { id, name, email, token };
      await AsyncStorage.setItem('@santanapizzaria', JSON.stringify(data));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data);
      setLoadingAuth(false);
    } catch (err) {
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, loading, loadingAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
