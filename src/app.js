// src/App.js - Main application component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './components/auth/AuthProvider';
import Layout from './components/layout/layout';
import LandingPage from './components/landing/LandingPage';
import UnifiedLoginPage from './components/auth/UnifiedLoginPage';
import UnifiedProtectedRoute from './components/auth/UnifiedProtectedRoute';
import { AssessmentProvider } from './contexts/assessmentcontext';
import './app.css';

// Redirect component for assessment routes with parameters
const AssessmentRedirect = () => {
  const { id } = useParams();
  if (id) {
    return <Navigate to={`/app/assessments/${id}`} replace />;
  }
  return <Navigate to="/app/assessments" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UnifiedLoginPage />} />
            
            {/* Redirect old routes to new app structure */}
            <Route path="/assessments/new" element={<Navigate to="/app/assessments/new" replace />} />
            <Route path="/assessments/:id" element={<AssessmentRedirect />} />
            <Route path="/assessments" element={<Navigate to="/app/assessments" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/security" element={<Navigate to="/app/security" replace />} />
            <Route path="/infrastructure" element={<Navigate to="/app/infrastructure" replace />} />
            <Route path="/devops" element={<Navigate to="/app/devops" replace />} />
            <Route path="/cloud-readiness" element={<Navigate to="/app/cloud-readiness" replace />} />
            <Route path="/data" element={<Navigate to="/app/data" replace />} />
            <Route path="/architecture" element={<Navigate to="/app/architecture" replace />} />
            <Route path="/recommendations" element={<Navigate to="/app/recommendations" replace />} />
            
            <Route 
              path="/app/*" 
              element={
                <UnifiedProtectedRoute>
                  <AssessmentProvider>
                    <Layout />
                  </AssessmentProvider>
                </UnifiedProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;