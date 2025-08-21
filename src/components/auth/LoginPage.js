import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';
import SignInButton from './SignInButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center">
          <img className="h-12 w-12" src="/logo192.png" alt="BAAP" />
          <span className="ml-3 text-2xl font-bold text-gray-900 flex items-center">BAAP</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your application assessment dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <SignInButton className="w-full justify-center text-base py-3" />
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure Azure B2C Authentication</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Multi-factor authentication</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 text-green-500 mr-2" />
                  <span>Single sign-on (SSO) ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Why Choose BAAP?</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Comprehensive Analysis</p>
                <p className="text-xs text-blue-700">360° application assessment with AI insights</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Security First</p>
                <p className="text-xs text-blue-700">Advanced vulnerability detection and compliance</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Enterprise Ready</p>
                <p className="text-xs text-blue-700">Trusted by 500+ global organizations</p>
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

export default LoginPage;