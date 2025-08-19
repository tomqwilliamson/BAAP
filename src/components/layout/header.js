// src/components/Layout/Header.js - Top header component
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, Settings } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';

const pageTitle = {
  '/dashboard': 'Dashboard Overview',
  '/business-context': 'Business Context Analysis',
  '/architecture-review': 'Architecture Review',
  '/infrastructure': 'Infrastructure & Compute Assessment',
  '/data-architecture': 'Data Architecture Review',
  '/devops': 'DevOps & Development Practices',
  '/security': 'Security Assessment',
  '/cloud-readiness': 'Cloud Readiness Analysis',
  '/recommendations': 'AI-Generated Recommendations'
};

function Header() {
  const location = useLocation();
  const { currentAssessment, loading } = useAssessment();
  
  const title = pageTitle[location.pathname] || 'Application Assessment';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title and Breadcrumb */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {currentAssessment && (
              <p className="text-sm text-gray-500 mt-1">
                Assessment: {currentAssessment.name}
                {loading && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Processing...
                  </span>
                )}
              </p>
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
                placeholder="Search assessments..."
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
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Solution Architect</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;