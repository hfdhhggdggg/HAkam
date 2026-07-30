import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import PendingReview from './pages/PendingReview';
import RefereeProfile from './pages/RefereeProfile';
import { useAuth } from './utils/AuthContext';

function ProtectedRoute({ children, requireAdmin }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/profile" replace />;
  return children;
}

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/pending" element={<PendingReview />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RefereeProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
}

export default App;
