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
import { NotificationProvider } from './contexts/notificationcontext';
import TourWelcome from './components/tour/TourWelcome';
import TourAIAnalysis from './components/tour/TourAIAnalysis';
import TourTechnical from './components/tour/TourTechnical';
import TourInsights from './components/tour/TourInsights';
import TourGetStarted from './components/tour/TourGetStarted';
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
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UnifiedLoginPage />} />
            
            {/* Tour Routes */}
            <Route path="/tour" element={<Navigate to="/tour/welcome" replace />} />
            <Route path="/tour/welcome" element={<TourWelcome />} />
            <Route path="/tour/ai-analysis" element={<TourAIAnalysis />} />
            <Route path="/tour/technical" element={<TourTechnical />} />
            <Route path="/tour/insights" element={<TourInsights />} />
            <Route path="/tour/get-started" element={<TourGetStarted />} />
            
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
                    <NotificationProvider>
                      <Layout />
                    </NotificationProvider>
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