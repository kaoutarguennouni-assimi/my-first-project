import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/api/axios';

const AuthContext = createContext();

const PUBLIC_PAGES = ['/', '/Home', '/Reservation', '/Receipt'];

const isPublicPage = () => {
  return PUBLIC_PAGES.some(p =>
    window.location.pathname === p ||
    window.location.pathname.startsWith(p)
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError]         = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        if (!isPublicPage()) {
          setAuthError({ type: 'auth_required' });
        }
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/AdminLogin';
  };

  const navigateToLogin = () => {
    window.location.href = '/AdminLogin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authError,
      login,
      logout,
      navigateToLogin,
      checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};