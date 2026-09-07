import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminHeader from './components/AdminHeader.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import AdminDashboard from './pages/AdminDashboard.jsx';
import EditorDashboard from './pages/EditorDashboard.jsx';
import JournalistDashboard from './pages/JournalistDashboard.jsx';
import AdvertiserDashboard from './pages/AdvertiserDashboard.jsx';

// Sends a logged-in staff member to the dashboard that matches their role.
const RoleHome = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'Admin' || user?.role === 'Super Admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'Editor') return <Navigate to="/editor" replace />;
  if (user?.role === 'Journalist') return <Navigate to="/journalist" replace />;
  if (user?.role === 'Advertiser') return <Navigate to="/advertiser" replace />;

  // Reader / Guest accounts have no place in the admin panel.
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-grow bg-slate-50 dark:bg-slate-950">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RoleHome />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute allowedRoles={['Editor', 'Admin', 'Super Admin']}>
                  <EditorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journalist"
              element={
                <ProtectedRoute allowedRoles={['Journalist', 'Editor', 'Admin', 'Super Admin']}>
                  <JournalistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advertiser"
              element={
                <ProtectedRoute allowedRoles={['Advertiser', 'Admin', 'Super Admin']}>
                  <AdvertiserDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
