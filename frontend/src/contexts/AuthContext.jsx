/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('bowen_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await apiRequest('/auth/me', { token });
        setUser(profile);
      } catch {
        localStorage.removeItem('bowen_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      async login(credentials) {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: credentials,
        });

        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('bowen_token', data.accessToken);
      },
      async register(payload) {
        return apiRequest('/auth/register', {
          method: 'POST',
          body: payload,
        });
      },
      logout() {
        setToken('');
        setUser(null);
        localStorage.removeItem('bowen_token');
      },
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
