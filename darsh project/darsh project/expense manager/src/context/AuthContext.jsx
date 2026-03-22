import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi, clearSession, saveSession } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('expenseManagerUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('expenseManagerToken');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await authApi.me();
        setUser(response.user);
      } catch (err) {
        console.error(err);
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const authenticate = useCallback(async (mode, payload) => {
    setError('');
    try {
      const response = mode === 'login' ? await authApi.login(payload) : await authApi.register(payload);
      saveSession(response);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to complete request';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login: payload => authenticate('login', payload),
      register: payload => authenticate('register', payload),
      logout,
      clearError: () => setError(''),
    }),
    [user, loading, error, authenticate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

