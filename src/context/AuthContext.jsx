import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('findit_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('findit_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getCurrentUser();
          setUser(res.data);
          localStorage.setItem('findit_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed, clearing session", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: jwt, ...userData } = res.data;
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('findit_token', jwt);
    localStorage.setItem('findit_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { token: jwt, ...userData } = res.data;
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('findit_token', jwt);
    localStorage.setItem('findit_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('findit_token');
    localStorage.removeItem('findit_user');
  };

  const switchDemoAccount = async (email) => {
    return login(email, 'password123');
  };

  const isSecurityOrAdmin = user && (user.role === 'ROLE_SECURITY' || user.role === 'ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchDemoAccount,
      isSecurityOrAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
