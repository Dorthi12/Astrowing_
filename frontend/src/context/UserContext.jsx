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
        console.log('[UserContext] 🔍 Checking existing session from localStorage...');
        const storedUser = authService.getStoredUser();
        const token = localStorage.getItem('accessToken');
        
        console.log('[UserContext] 📦 Found in localStorage - token:', !!token, 'user:', !!storedUser, 'email:', storedUser?.email);
        
        if (storedUser && token) {
          console.log('[UserContext] ✅ Session found! Setting authenticated state...');
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          console.log('[UserContext] ❌ No session found in localStorage');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('[UserContext] ❌ Session check error:', err);
        setIsAuthenticated(false);
      } finally {
        console.log('[UserContext] ✅ Session check complete, setting isLoading to false');
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
      // Ensure user data is set before marking as authenticated
      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return newUser;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Registration failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: loginUser } = await authService.login(email, password);
      // Ensure user data is set before marking as authenticated
      setUser(loginUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return loginUser;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Login failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
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
      setIsLoading(false);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if logout API fails
      setUser(null);
      setIsAuthenticated(false);
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

  // Refresh auth state from localStorage (for when tokens are stored externally)
  const refreshAuthState = useCallback(() => {
    console.log('[UserContext] 🔄 refreshAuthState called - reading localStorage...');
    const storedUser = authService.getStoredUser();
    const token = localStorage.getItem('accessToken');
    console.log('[UserContext] 📦 After refresh - token:', !!token, 'user:', !!storedUser, 'email:', storedUser?.email);
    
    if (storedUser && token) {
      console.log('[UserContext] ✅ Tokens found! Setting authenticated state...');
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    refreshAuthState,
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
