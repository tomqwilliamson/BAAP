// src/components/Layout/Header.js - Top header component
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, Settings, ChevronDown } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import UnifiedSignOutButton from '../auth/UnifiedSignOutButton';
import NotificationDropdown from '../notifications/NotificationDropdown';
import toast from 'react-hot-toast';

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
  const { assessments, currentAssessment, loading, loadAssessment, clearCurrentAssessment } = useAssessment();
  
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

          {/* Center Section - Assessment Selector */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <select
                value={currentAssessment?.id || 'all'}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    clearCurrentAssessment();
                    toast.success('Switched to all assessments view');
                  } else {
                    loadAssessment(parseInt(e.target.value));
                    toast.success(`Assessment "${assessments.find(a => a.id === parseInt(e.target.value))?.name}" selected`);
                  }
                }}
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm min-w-[280px] text-sm font-medium text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all">🌐 View All Assessments</option>
                {assessments.map(assessment => (
                  <option key={assessment.id} value={assessment.id}>
                    📊 {assessment.name} ({assessment.status})
                  </option>
                ))}
              </select>
              {loading && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${currentAssessment ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            </div>
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
            <NotificationDropdown />

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