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
import RegistrationRequests from './pages/RegistrationRequests';
import Stats from './pages/Stats';
import RefereesTabs from './pages/RefereesTabs';
import RefereesTiles from './pages/RefereesTiles';
import FitnessKanban from './pages/FitnessKanban';
import FitnessList from './pages/FitnessList';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import StatsPage from './pages/StatsPage';
import RefereesTabs from './pages/RefereesTabs';
import RefereesTiles from './pages/RefereesTiles';
import FitnessKanban from './pages/FitnessKanban';
import FitnessList from './pages/FitnessList';
import Messages from './pages/Messages';
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
          path="/inbox"
          element={
          path="/dashboard/stats"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referees/tabs"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <RefereesTabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referees/tiles"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <RefereesTiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/kanban"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <FitnessKanban />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/list"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <FitnessList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute roles={['admin', 'trainer']}>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
            <ProtectedRoute roles={['admin']}>
              <RegistrationRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stats"
          element={
        <Route path="*" element={<NotFound />} />
            <ProtectedRoute roles={['admin']}>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referees/tabs"
          element={
            <ProtectedRoute roles={['admin']}>
              <RefereesTabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referees/tiles"
          element={
            <ProtectedRoute roles={['admin']}>
              <RefereesTiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/kanban"
          element={
            <ProtectedRoute roles={['admin']}>
              <FitnessKanban />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/list"
          element={
            <ProtectedRoute roles={['admin']}>
              <FitnessList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute roles={['admin']}>
              <Messages />
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
