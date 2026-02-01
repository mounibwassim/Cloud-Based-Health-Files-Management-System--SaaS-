import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StatesList from './pages/StatesList';
import StateDetail from './pages/StateDetail';
import FileRecords from './pages/FileRecords';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <main>
          <Routes>
            <Route path="/" element={<StatesList />} />
            <Route path="/states/:id" element={<StateDetail />} />
            <Route path="/states/:stateId/files/:fileType/records" element={<FileRecords />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback for unknown routes inside protected area */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<Layout />} />
            </Route>

            {/* Catch all redirect to login if not matched above */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}
