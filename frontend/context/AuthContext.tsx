import React, { createContext, useState, useEffect, useContext } from 'react';
import storage from '../utils/storage';
import STORAGE_KEYS from '../constants/storage';
import authService from '../services/authService';
import { User } from '../types/User';
import { AuthState } from '../types/Auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          setState({
            token,
            user: JSON.parse(userData),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const { token, user } = response.data;
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        setState({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.register(fullName, email, password);
      setState(prev => ({ ...prev, isLoading: false }));
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      // Registration successful! We can now prompt user to login with their credentials.
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
