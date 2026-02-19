// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API, { ENDPOINTS } from '../lib/api-configs';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Memoized checkUser to prevent unnecessary re-renders in other hooks
  const checkUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // This now hits your unified profile controller via /auth/me
      const { data } = await API.get(ENDPOINTS.AUTH.ME);
      setUser(data);
    } catch (error) {
      console.error("Auth verification failed:", error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    // userData now includes 'username' from our updated authController
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: Redirect to login on logout
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // Exported so components can update local state
      login, 
      logout, 
      loading, 
      checkUser // Exported so you can "refresh" the user data manually
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);