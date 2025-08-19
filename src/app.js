// src/App.js - Main application component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './components/auth/AuthProvider';
import Layout from './components/layout/layout';
import LandingPage from './components/landing/LandingPage';
import UnifiedLoginPage from './components/auth/UnifiedLoginPage';
import UnifiedProtectedRoute from './components/auth/UnifiedProtectedRoute';
import { AssessmentProvider } from './contexts/assessmentcontext';
import './app.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UnifiedLoginPage />} />
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