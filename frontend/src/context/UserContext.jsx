import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = localStorage.getItem('accessToken');
        
        if (storedUser && token) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Register new user
  const register = useCallback(async (email, password, firstName, lastName) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: newUser } = await authService.register(
        email,
        password,
        firstName,
        lastName
      );
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: loginUser } = await authService.login(email, password);
      setUser(loginUser);
      setIsAuthenticated(true);
      return loginUser;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile locally
  const updateUserProfile = useCallback((updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        ...updatedData,
      })
    );
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateUserProfile,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook to use UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

export default UserContext;
