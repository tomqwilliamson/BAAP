// src/components/Layout/Header.js - Top header component
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, Settings } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import UnifiedSignOutButton from '../auth/UnifiedSignOutButton';

const pageTitle = {
  '/app': 'Dashboard Overview',
  '/app/dashboard': 'Dashboard Overview',
  '/app/business-context': 'Business Context Analysis',
  '/app/architecture-review': 'Architecture Review',
  '/app/infrastructure': 'Infrastructure & Compute Design Lab',
  '/app/data-architecture': 'Data Architecture Review',
  '/app/devops': 'DevOps & Development Practices',
  '/app/security': 'Security Design Lab',
  '/app/cloud-readiness': 'Cloud Readiness Analysis',
  '/app/recommendations': 'AI-Generated Recommendations'
};

function Header() {
  const location = useLocation();
  const { currentAssessment, loading } = useAssessment();
  
  // For now, use a placeholder user until auth context is resolved
  const user = {
    name: 'Demo User',
    username: 'demo.user',
    idTokenClaims: {
      jobTitle: 'Solution Architect'
    }
  };
  
  const title = pageTitle[location.pathname] || 'Application Design Lab';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          {/* Center Section - Current Assessment */}
          <div className="flex-1 flex justify-center">
            {currentAssessment ? (
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Current Assessment</p>
                    <p className="text-xs text-blue-700">{currentAssessment.name}</p>
                  </div>
                  {loading && (
                    <span className="ml-3 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">No Assessment Selected</p>
                    <p className="text-xs text-gray-500">Select from Dashboard to begin</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search design labs using AI..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.idTokenClaims?.jobTitle || 'Solution Architect'}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <User className="h-6 w-6" />
              </button>
              <UnifiedSignOutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;