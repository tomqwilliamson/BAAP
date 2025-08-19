import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, TrendingUp, Users, ChevronRight, Star, Award, BarChart3, Clock, Zap, Globe } from 'lucide-react';
import UnifiedSignInButton from '../auth/UnifiedSignInButton';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img className="h-8 w-8" src="/logo192.png" alt="BAAP" />
              <span className="ml-2 text-xl font-bold text-gray-900">BAAP</span>
              <span className="ml-1 text-sm text-gray-500">Application Assessment Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <UnifiedSignInButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Transform Your</span>
                <span className="block text-blue-200">Application Portfolio</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 leading-relaxed">
                AI-powered enterprise application assessment platform that delivers comprehensive insights, 
                risk analysis, and modernization roadmaps to optimize your digital transformation journey.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <UnifiedSignInButton className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
                  Get Started Today
                  <ChevronRight className="ml-2 h-5 w-5" />
                </UnifiedSignInButton>
                <p className="mt-3 text-sm text-blue-200">
                  Free trial • No credit card required • Setup in minutes
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-900">94%</p>
                    <p className="text-sm text-green-700">Accuracy Rate</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-900">85%</p>
                    <p className="text-sm text-blue-700">Time Savings</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-900">99.9%</p>
                    <p className="text-sm text-purple-700">Security Score</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-orange-900">500+</p>
                    <p className="text-sm text-orange-700">Enterprise Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Leading Enterprises Choose BAAP
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive application assessment powered by AI to drive your digital transformation strategy
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                360° Application Analysis
              </h3>
              <p className="text-gray-600">
                Complete assessment covering architecture, security, performance, and cloud readiness 
                with detailed scoring and recommendations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Machine learning algorithms analyze your applications and provide intelligent 
                recommendations for modernization and optimization strategies.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600">
                Advanced security assessments with compliance checking, vulnerability analysis, 
                and risk scoring aligned with industry standards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cloud Migration Planning
              </h3>
              <p className="text-gray-600">
                Detailed cloud readiness assessment with migration strategies, cost analysis, 
                and step-by-step transformation roadmaps.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ROI Optimization
              </h3>
              <p className="text-gray-600">
                Track and measure the impact of your modernization efforts with detailed 
                ROI calculations and performance metrics.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Executive Reporting
              </h3>
              <p className="text-gray-600">
                Professional dashboards and reports designed for C-level executives 
                with clear metrics and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Accelerate Your Digital Transformation
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Make data-driven decisions about your application portfolio with our comprehensive assessment platform.
              </p>
              
              <div className="mt-8 space-y-4">
                {[
                  "Reduce assessment time by 85% with automated analysis",
                  "Identify cost savings opportunities worth millions",
                  "Eliminate security vulnerabilities before they impact business",
                  "Create detailed modernization roadmaps with timeline and budget",
                  "Track progress with real-time dashboards and reporting"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1" />
                    <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
                
                <div className="space-y-6">
                  <blockquote className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">
                      "BAAP helped us assess 150+ applications and saved $2.3M in cloud migration costs."
                    </p>
                    <footer className="mt-3 text-sm text-gray-600">
                      — CTO, Fortune 500 Financial Services
                    </footer>
                  </blockquote>
                  
                  <blockquote className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">
                      "The security insights alone justified the entire platform cost."
                    </p>
                    <footer className="mt-3 text-sm text-gray-600">
                      — CISO, Global Manufacturing Company
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Transform Your Applications?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join 500+ enterprise customers who trust BAAP for their application assessment needs.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <UnifiedSignInButton className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </UnifiedSignInButton>
              <button className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                Schedule Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              No setup fees • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img className="h-8 w-8" src="/logo192.png" alt="BAAP" />
              <span className="ml-2 text-xl font-bold text-white">BAAP</span>
            </div>
            <p className="text-gray-400">
              © 2024 Business Application Assessment Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;