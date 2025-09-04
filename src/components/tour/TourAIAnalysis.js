// src/components/tour/TourAIAnalysis.js - AI Analysis tour page
import React from 'react';
import { Brain, Zap, Target, TrendingUp, CheckCircle, ArrowRight, Sparkles, BarChart3, Database, Cloud } from 'lucide-react';
import TourLayout from './TourLayout';

const TourAIAnalysis = () => {
  return (
    <TourLayout 
      currentStep="ai-analysis" 
      nextPath="/tour/technical"
      prevPath="/tour/welcome"
      onSkip={() => window.location.href = '/signup'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI-Powered</span> Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how our advanced AI engine analyzes your application portfolio and delivers 
            intelligent insights that would take human experts weeks to compile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* AI Analysis Process */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How AI Analysis Works</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Ingestion</h3>
                    <p className="text-gray-600">
                      AI scans application code, documentation, and infrastructure configurations 
                      to build a comprehensive understanding of your portfolio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pattern Recognition</h3>
                    <p className="text-gray-600">
                      Machine learning identifies architectural patterns, dependencies, 
                      and potential modernization opportunities across applications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Recommendations</h3>
                    <p className="text-gray-600">
                      AI generates specific, actionable recommendations based on industry 
                      best practices and your organization's unique context.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mock AI Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">AI Analysis Results</h3>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Analysis Complete
              </div>
            </div>

            {/* Mock Analysis Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Cloud Readiness Score</span>
                  <span className="text-2xl font-bold text-green-600">87%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Security Score</span>
                  <span className="text-2xl font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Modernization Priority</span>
                  <span className="text-2xl font-bold text-yellow-600">High</span>
                </div>
                <p className="text-xs text-yellow-700">15 applications identified for immediate modernization</p>
              </div>
            </div>

            {/* AI Recommendations Preview */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Recommendations
              </h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Migrate 8 applications to serverless architecture
                </p>
                <p className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Consolidate 3 legacy databases to reduce costs
                </p>
                <p className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Implement container orchestration for 12 apps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Capabilities Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced AI Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automated Code Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep code scanning identifies technical debt, security vulnerabilities, 
                and modernization opportunities automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictive Modeling</h3>
              <p className="text-gray-600 leading-relaxed">
                AI predicts future performance, scaling requirements, and potential issues 
                before they impact your business operations.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent cost analysis identifies savings opportunities and optimizes 
                cloud spending across your entire application portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Industry-Specific Intelligence */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Industry-Specific Intelligence</h2>
              <p className="text-indigo-100 text-lg leading-relaxed mb-6">
                Our AI is trained on industry-specific patterns and best practices, 
                delivering recommendations tailored to your sector's unique requirements.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <BarChart3 className="h-6 w-6 text-white mb-2" />
                  <div className="text-sm font-medium">Financial Services</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Database className="h-6 w-6 text-white mb-2" />
                  <div className="text-sm font-medium">Healthcare</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Cloud className="h-6 w-6 text-white mb-2" />
                  <div className="text-sm font-medium">Manufacturing</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Sparkles className="h-6 w-6 text-white mb-2" />
                  <div className="text-sm font-medium">Retail & E-commerce</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Real Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Applications Analyzed</span>
                  <span className="font-bold text-2xl">50,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Cost Savings Identified</span>
                  <span className="font-bold text-2xl">$2.3B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Security Issues Found</span>
                  <span className="font-bold text-2xl">15,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TourLayout>
  );
};

export default TourAIAnalysis;