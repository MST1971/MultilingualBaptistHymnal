import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/membership" replace state={{ redirectTo: location.pathname }} />;
  }
  return children;
}

export default ProtectedRoute;
