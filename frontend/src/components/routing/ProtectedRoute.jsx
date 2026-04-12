import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import Loader from '../ui/Loader';

/**
 * Protected Route Component
 * Redirects to auth page if user is not authenticated
 * Shows loader while checking auth status
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
