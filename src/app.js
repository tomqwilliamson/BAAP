// src/App.js - Main application component
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/layout';
import { AssessmentProvider } from './contexts/assessmentcontext';
import './app.css';

function App() {
  return (
    <Router>
      <AssessmentProvider>
        <div className="App">
          <Layout />
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
      </AssessmentProvider>
    </Router>
  );
}

export default App;