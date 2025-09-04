// src/components/tour/TourWelcome.js - Welcome tour page
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Sparkles, Shield, TrendingUp, Target, Clock, Users, CheckCircle } from 'lucide-react';
import TourLayout from './TourLayout';
import { formatCurrency } from '../../utils/currency';

const TourWelcome = () => {
  return (
    <TourLayout 
      currentStep="welcome" 
      nextPath="/tour/ai-analysis"
      onSkip={() => window.location.href = '/signup'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">BAAP</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The AI-powered Business Application Assessment Platform that transforms how enterprises 
            evaluate, modernize, and optimize their application portfolios.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
            <div className="text-sm text-gray-600">Assessment Accuracy</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
            <div className="text-sm text-gray-600">Time Reduction</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-sm text-gray-600">Enterprise Clients</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 mb-4">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(2.3, 'M')}</div>
            <div className="text-sm text-gray-600">Avg. Savings</div>
          </div>
        </div>

        {/* What You'll Discover */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Discover in This Tour</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how BAAP revolutionizes application portfolio management with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  See how machine learning analyzes your applications and provides intelligent 
                  recommendations for modernization strategies.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Assessment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced security analysis with vulnerability detection, compliance checking, 
                  and risk scoring aligned with industry standards.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Dashboards</h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional reporting designed for C-level executives with clear metrics, 
                  ROI calculations, and actionable insights.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex-shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Migration Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Detailed cloud readiness assessment with step-by-step transformation roadmaps, 
                  timeline planning, and budget optimization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Success Story */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-blue-100 text-lg">
              See how BAAP helped transform their application portfolio
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <CheckCircle key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-white/90 italic mb-4 leading-relaxed">
              "BAAP's AI-powered assessment helped us evaluate 150+ applications and identify 
              {formatCurrency(2300000)} in potential cloud migration cost savings. The detailed 
              security insights alone justified the entire platform investment."
            </blockquote>
            <footer className="text-blue-200">
              — Chief Technology Officer, Fortune 500 Financial Services Company
            </footer>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore?</h3>
          <p className="text-lg text-gray-600 mb-8">
            This tour will take approximately 5 minutes and show you the key features that make BAAP essential for enterprise transformation.
          </p>
          <Link 
            to="/tour/ai-analysis"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start the Tour
            <Sparkles className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </TourLayout>
  );
};

export default TourWelcome;