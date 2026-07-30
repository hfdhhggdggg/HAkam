import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import PendingReview from './pages/PendingReview';
import RefereeProfile from './pages/RefereeProfile';
import ForgotPassword from './pages/ForgotPassword';
import TrainerDashboard from './pages/TrainerDashboard';
import { useAuth } from './utils/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (user.role === 'trainer') return <Navigate to="/trainer" replace />;
    return <Navigate to="/profile" replace />;
  }
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pending" element={<PendingReview />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer"
          element={
            <ProtectedRoute roles={['trainer']}>
              <TrainerDashboard />
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
