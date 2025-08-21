import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useMockAuth } from './MockAuth';

const MockLoginPage = () => {
  const { login } = useMockAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login().then(() => {
      navigate('/app/dashboard');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center">
          <img className="h-12 w-12" src="/logo192.png" alt="BAAP" />
          <span className="ml-3 text-2xl font-bold text-gray-900 flex items-center">BAAP</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Development Mode Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Click below to sign in as demo user
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={handleLogin}
                className="w-full justify-center text-base py-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In as Demo User
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Development Environment</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Development Mode Active
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This is a mock authentication system for development. 
                      Configure Azure B2C for production use.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Demo user: Demo User (demo@example.com)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Role: Solution Architect</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Session persisted in localStorage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Demo Features</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Full Application Access</p>
                <p className="text-xs text-blue-700">Access all assessment tools and dashboards</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Mock Data</p>
                <p className="text-xs text-blue-700">Pre-populated with sample assessments</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">User Profile</p>
                <p className="text-xs text-blue-700">Test user management features</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MockLoginPage;