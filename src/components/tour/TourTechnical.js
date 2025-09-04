// src/components/tour/TourTechnical.js - Technical Assessment tour page
import React from 'react';
import { Shield, Database, Cloud, GitBranch, Server, Lock, CheckCircle, AlertTriangle, TrendingUp, Layers } from 'lucide-react';
import TourLayout from './TourLayout';

const TourTechnical = () => {
  return (
    <TourLayout 
      currentStep="technical" 
      nextPath="/tour/insights"
      prevPath="/tour/ai-analysis"
      onSkip={() => window.location.href = '/signup'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-blue-600 mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Technical</span> Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive technical analysis covering security, infrastructure, data architecture, 
            and DevOps practices to ensure your applications are ready for the modern cloud.
          </p>
        </div>

        {/* Assessment Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {/* Security Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 mr-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Security Assessment</h3>
                <p className="text-sm text-gray-600">Zero Trust & Vulnerability Analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-800">Critical Vulnerabilities</span>
                  <span className="text-lg font-bold text-red-600">3</span>
                </div>
                <p className="text-xs text-red-700">Immediate attention required</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Medium Risk Issues</span>
                  <span className="text-lg font-bold text-yellow-600">12</span>
                </div>
                <p className="text-xs text-yellow-700">Recommended for next sprint</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Security Score</span>
                  <span className="text-lg font-bold text-green-600">87%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>✓ OWASP compliance check</p>
              <p>✓ Dependency vulnerability scan</p>
              <p>✓ Authentication & authorization review</p>
            </div>
          </div>

          {/* Infrastructure Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mr-4">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Infrastructure</h3>
                <p className="text-sm text-gray-600">Cloud Readiness & Performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Cloud Readiness</span>
                  <span className="text-lg font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">Scalability Index</span>
                  <span className="text-lg font-bold text-purple-600">High</span>
                </div>
                <p className="text-xs text-purple-700">Ready for auto-scaling</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Cost Optimization</span>
                  <span className="text-lg font-bold text-green-600">$124K</span>
                </div>
                <p className="text-xs text-green-700">Annual savings potential</p>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>✓ Container compatibility check</p>
              <p>✓ Load balancing analysis</p>
              <p>✓ Disaster recovery planning</p>
            </div>
          </div>

          {/* Data Architecture */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 mr-4">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Data Architecture</h3>
                <p className="text-sm text-gray-600">Storage & Integration Patterns</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Data Quality Score</span>
                  <span className="text-lg font-bold text-indigo-600">94%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-800">Integration Points</span>
                  <span className="text-lg font-bold text-cyan-600">23</span>
                </div>
                <p className="text-xs text-cyan-700">APIs and data connections</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-teal-800">Migration Complexity</span>
                  <span className="text-lg font-bold text-teal-600">Medium</span>
                </div>
                <p className="text-xs text-teal-700">6-8 week timeline estimate</p>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>✓ Data flow mapping</p>
              <p>✓ Backup & retention analysis</p>
              <p>✓ Compliance requirement check</p>
            </div>
          </div>

          {/* DevOps Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 mr-4">
                <GitBranch className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">DevOps Maturity</h3>
                <p className="text-sm text-gray-600">CI/CD & Automation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-800">Automation Level</span>
                  <span className="text-lg font-bold text-orange-600">78%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Pipeline Health</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-lg font-bold text-green-600">Good</span>
                  </div>
                </div>
                <p className="text-xs text-green-700">94% successful deployments</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Testing Coverage</span>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-lg font-bold text-yellow-600">67%</span>
                  </div>
                </div>
                <p className="text-xs text-yellow-700">Recommend increasing to 85%+</p>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>✓ CI/CD pipeline analysis</p>
              <p>✓ Test automation review</p>
              <p>✓ Deployment strategy assessment</p>
            </div>
          </div>
        </div>

        {/* Technical Recommendations */}
        <div className="bg-gradient-to-r from-slate-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Priority Technical Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Security Hardening</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Address 3 critical vulnerabilities in authentication system. 
                  Implement Zero Trust architecture patterns.
                </p>
                <div className="flex items-center text-sm">
                  <span className="bg-red-500/20 px-2 py-1 rounded text-red-300">High Priority</span>
                  <span className="ml-3 text-gray-400">2-3 weeks</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">Container Migration</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Modernize 12 applications using containerization. 
                  Implement Kubernetes orchestration for improved scalability.
                </p>
                <div className="flex items-center text-sm">
                  <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-300">Medium Priority</span>
                  <span className="ml-3 text-gray-400">6-8 weeks</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Database Optimization</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Consolidate 3 legacy databases to reduce operational overhead. 
                  Implement automated backup and disaster recovery.
                </p>
                <div className="flex items-center text-sm">
                  <span className="bg-green-500/20 px-2 py-1 rounded text-green-300">Medium Priority</span>
                  <span className="ml-3 text-gray-400">4-6 weeks</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                    4
                  </div>
                  <h3 className="text-xl font-semibold">DevOps Enhancement</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Increase test coverage to 85%+. Implement automated 
                  code quality gates and security scanning in CI/CD.
                </p>
                <div className="flex items-center text-sm">
                  <span className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">Low Priority</span>
                  <span className="ml-3 text-gray-400">3-4 weeks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Expected Cost Savings: <strong>$847K annually</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Process */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Technical Assessment Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600 text-sm">
                Automated scanning of infrastructure, code repositories, and configuration files
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis</h3>
              <p className="text-gray-600 text-sm">
                Deep technical analysis using industry best practices and security standards
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scoring</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive scoring across security, performance, and modernization readiness
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Prioritized action items with timelines, costs, and expected business impact
              </p>
            </div>
          </div>
        </div>
      </div>
    </TourLayout>
  );
};

export default TourTechnical;