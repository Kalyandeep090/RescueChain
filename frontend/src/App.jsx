
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { useAppContext } from './context/AppContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LiveMapPage from './pages/LiveMapPage';
import CreateAlertPage from './pages/CreateAlertPage';
import ResponseManagementPage from './pages/ResponseManagementPage';
import ReportsPage from './pages/ReportsPage';
import AdminControlPanel from './pages/AdminControlPanel';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const NotFoundPage = () => (
  <div className={styles.pageContent}>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

// Protected application layout
const ProtectedLayout = () => {
  const { currentUser, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>
          Checking authentication...
        </p>
      </div>
    );
  }


  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.appContainer}>
      <Sidebar />

      <div className={styles.mainWrapper}>
        <Navbar />

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Main application
const App = () => {
  const { currentUser, authLoading } = useAppContext();

  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route
  path="/login"
  element={
    authLoading ? (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>
          Checking authentication...
        </p>
      </div>
    ) : currentUser ? (
      <Navigate to="/" replace />
    ) : (
      <LoginPage />
    )
  }
/>

<Route
  path="/signup"
  element={
    authLoading ? (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>
          Checking authentication...
        </p>
      </div>
    ) : currentUser ? (
      <Navigate to="/" replace />
    ) : (
      <SignUpPage />
    )
  }
/>

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>

          <Route path="/" element={<HomePage />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/alerts/new" element={<CreateAlertPage />} />

          <Route path="/map" element={<LiveMapPage />} />

          {/* Admin routes */}
          <Route
            path="/responses"
            element={
              currentUser?.role === 'Admin'
                ? <ResponseManagementPage />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/reports"
            element={
              currentUser?.role === 'Admin'
                ? <ReportsPage />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/admin"
            element={
              currentUser?.role === 'Admin'
                ? <AdminControlPanel />
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* Unknown routes */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>

      </Routes>
    </Router>
  );
};

export default App;
