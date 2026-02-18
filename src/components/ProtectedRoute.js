import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;
  if (!user) {
    return <Navigate to="/membership" replace state={{ redirectTo: location.pathname }} />;
  }
  return children;
}

export default ProtectedRoute;
