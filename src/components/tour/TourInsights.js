// src/components/tour/TourInsights.js - Business Intelligence & Insights tour page
import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Users, Calendar, Award, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import TourLayout from './TourLayout';
import { formatCurrency } from '../../utils/currency';

const TourInsights = () => {
  return (
    <TourLayout 
      currentStep="insights" 
      nextPath="/tour/get-started"
      prevPath="/tour/technical"
      onSkip={() => window.location.href = '/signup'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-red-600 mb-8">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Business</span> Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform technical assessments into executive-ready insights with comprehensive 
            dashboards, ROI analysis, and strategic recommendations.
          </p>
        </div>

        {/* Executive Dashboard Preview */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Executive Dashboard</h2>
              <p className="text-gray-600 mt-2">Real-time portfolio overview for leadership</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-semibold text-gray-900">2 minutes ago</div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +24%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(2.4, 'M')}</div>
              <div className="text-sm text-gray-600">Projected Savings</div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
              <div className="text-sm text-gray-600">Portfolio Health</div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  -31%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">4.2</div>
              <div className="text-sm text-gray-600">Months to Cloud</div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mock Portfolio Health Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Health Over Time</h3>
              <div className="h-48 flex items-end justify-between space-x-2">
                {[65, 70, 74, 78, 82, 87, 89, 91].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">Q{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Cost Analysis */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Optimization Opportunities</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Infrastructure Rightsizing</span>
                  <span className="font-semibold text-green-600">{formatCurrency(890000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">License Optimization</span>
                  <span className="font-semibold text-green-600">{formatCurrency(650000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Optimization</span>
                  <span className="font-semibold text-green-600">{formatCurrency(430000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Network Efficiency</span>
                  <span className="font-semibold text-green-600">{formatCurrency(280000)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Annual Savings</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(2250000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-xl p-8 text-white mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">ROI Analysis & Business Case</h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Comprehensive financial modeling to justify your modernization investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Investment */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                <DollarSign className="h-6 w-6 text-red-300" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(1.8, 'M')}</div>
              <div className="text-indigo-200 text-sm font-medium mb-4">Total Investment</div>
              <div className="text-xs text-indigo-300">
                Modernization, training, infrastructure
              </div>
            </div>

            {/* Annual Savings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                <TrendingUp className="h-6 w-6 text-green-300" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(2.4, 'M')}</div>
              <div className="text-indigo-200 text-sm font-medium mb-4">Annual Savings</div>
              <div className="text-xs text-indigo-300">
                Operational cost reduction
              </div>
            </div>

            {/* Payback Period */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                <Calendar className="h-6 w-6 text-blue-300" />
              </div>
              <div className="text-3xl font-bold mb-2">9 Months</div>
              <div className="text-indigo-200 text-sm font-medium mb-4">Payback Period</div>
              <div className="text-xs text-indigo-300">
                Break-even timeline
              </div>
            </div>
          </div>

          {/* 3-Year Projection */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-center">3-Year Financial Projection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(600, 'K')}</div>
                <div className="text-indigo-200 text-sm">Year 1 Net Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(2.4, 'M')}</div>
                <div className="text-indigo-200 text-sm">Year 2 Net Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(2.6, 'M')}</div>
                <div className="text-indigo-200 text-sm">Year 3 Net Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Strategic Recommendations</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud-First Migration Strategy</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Prioritize 23 applications for immediate cloud migration based on technical readiness 
                    and business impact scoring. Expected completion: 6 months.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      <Target className="h-3 w-3 mr-1" />
                      ROI: 340%
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      6 months
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Hardening Initiative</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Address critical security vulnerabilities across 15 high-priority applications. 
                    Implement Zero Trust architecture and automated security monitoring.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
                      <Award className="h-3 w-3 mr-1" />
                      High Priority
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      3 months
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Platform Consolidation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Modernize data architecture by consolidating 8 legacy databases into a unified 
                    cloud-native platform with improved analytics capabilities.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      <Target className="h-3 w-3 mr-1" />
                      ROI: 280%
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      8 months
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CTO View */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">CTO Dashboard</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Technical Debt Score</span>
                  <span className="text-xl font-bold">Medium</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Security Posture</span>
                  <span className="text-xl font-bold text-green-300">Strong</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Cloud Readiness</span>
                  <span className="text-xl font-bold">87%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CFO View */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">CFO Dashboard</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Annual Savings</span>
                  <span className="text-xl font-bold">{formatCurrency(2.4, 'M')}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Investment Required</span>
                  <span className="text-xl font-bold">{formatCurrency(1.8, 'M')}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Payback Period</span>
                  <span className="text-xl font-bold text-yellow-300">9 Months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TourLayout>
  );
};

export default TourInsights;