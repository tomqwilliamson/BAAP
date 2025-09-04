// src/components/tour/TourLayout.js - Tour layout with progress indicator
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Eye, Sparkles } from 'lucide-react';

const tourSteps = [
  { key: 'welcome', title: 'Welcome', path: '/tour/welcome' },
  { key: 'ai-analysis', title: 'AI Analysis', path: '/tour/ai-analysis' },
  { key: 'technical', title: 'Technical', path: '/tour/technical' },
  { key: 'insights', title: 'Insights', path: '/tour/insights' },
  { key: 'get-started', title: 'Get Started', path: '/tour/get-started' }
];

const TourLayout = ({ currentStep, children, nextPath, prevPath, onSkip }) => {
  const navigate = useNavigate();
  const currentIndex = tourSteps.findIndex(step => step.key === currentStep);
  const progress = ((currentIndex + 1) / tourSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img className="h-8 w-8" src="/logo192.png" alt="BAAP" />
              <span className="ml-2 text-xl font-bold text-gray-900">BAAP</span>
              <span className="ml-2 text-sm text-gray-500">Tour</span>
            </Link>

            {/* Progress Indicator */}
            <div className="flex-1 max-w-md mx-8">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Step {currentIndex + 1} of {tourSteps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Step indicators */}
              <div className="flex justify-between mt-2">
                {tourSteps.map((step, index) => (
                  <div 
                    key={step.key}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index <= currentIndex 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {onSkip && (
                <button 
                  onClick={onSkip}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Skip Tour
                </button>
              )}
              <Link 
                to="/"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Navigation Footer */}
      <footer className="bg-white border-t sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Previous Button */}
            <div className="w-32">
              {prevPath ? (
                <Link 
                  to={prevPath}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Link>
              ) : (
                <Link 
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              )}
            </div>

            {/* Center Info */}
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-2" />
              <span className="font-medium">{tourSteps[currentIndex]?.title}</span>
              <span className="mx-2">•</span>
              <span>{currentIndex + 1} of {tourSteps.length}</span>
            </div>

            {/* Next Button */}
            <div className="w-32 flex justify-end">
              {nextPath ? (
                <Link 
                  to={nextPath}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <Link 
                  to="/signup"
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TourLayout;