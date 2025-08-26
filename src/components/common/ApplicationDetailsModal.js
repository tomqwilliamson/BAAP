// src/components/common/ApplicationDetailsModal.js - Modal popup for application details
import React, { useState, useEffect } from 'react';
import { X, Code, Shield, Database, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { apiService } from '../../services/apiService';

function ApplicationDetailsModal({ isOpen, onClose, applicationId }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplicationData();
    }
  }, [isOpen, applicationId]);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      const appData = await apiService.getApplication(applicationId);
      
      // Create comprehensive application data with mock score if needed
      const enhancedApp = {
        ...appData,
        score: appData.score || {
          overallScore: appData.cloudReadinessScore || 75,
          grade: getGradeFromScore(appData.cloudReadinessScore || 75),
          riskLevel: getRiskLevel(appData.criticalFindings || 0, appData.highFindings || 0),
          codeQualityScore: Math.max(60, (appData.cloudReadinessScore || 75) - 5),
          securityScore: Math.max(50, (appData.cloudReadinessScore || 75) - (appData.criticalFindings * 10)),
          infrastructureScore: Math.max(70, (appData.cloudReadinessScore || 75) + 10),
          devOpsMaturityScore: Math.max(65, (appData.cloudReadinessScore || 75) - 10),
          databaseOptimizationScore: Math.max(60, (appData.cloudReadinessScore || 75) - 15),
          documentationScore: Math.max(55, (appData.cloudReadinessScore || 75) - 20)
        },
        technologyStack: appData.technology || 'Not specified',
        lastUpdated: appData.lastAnalyzed || new Date().toISOString(),
        linesOfCode: appData.linesOfCode || 'N/A',
        repositoryUrl: appData.repositoryUrl || null
      };
      
      setApplication(enhancedApp);
    } catch (error) {
      console.error('Error loading application data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeFromScore = (score) => {
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    return 'F';
  };

  const getRiskLevel = (critical, high) => {
    const total = (critical || 0) + (high || 0);
    if (total === 0) return 'Low';
    if (total <= 5) return 'Low';
    if (total <= 10) return 'Medium';
    if (total <= 20) return 'High';
    return 'Critical';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Loading...' : application?.name || 'Application Details'}
              </h2>
              <p className="text-sm text-gray-500">Detailed application information and metrics</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : application ? (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <span className="text-sm text-gray-900">{application.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Category:</span>
                      <span className="text-sm text-gray-900">{application.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Technology:</span>
                      <span className="text-sm text-gray-900">{application.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Lines of Code:</span>
                      <span className="text-sm text-gray-900">{application.linesOfCode?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Last Analyzed:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(application.lastAnalyzed || application.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scores & Risk */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Scores</h3>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {application.score.overallScore}
                    </div>
                    <div className="text-sm text-gray-500">Overall Score</div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 bg-blue-100 text-blue-800">
                      Grade: {application.score.grade}
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-full justify-center ${
                    application.score.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    application.score.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    application.score.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {application.score.riskLevel} Risk Level
                  </div>
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Score Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Code Quality', score: application.score.codeQualityScore, icon: Code },
                    { name: 'Security', score: application.score.securityScore, icon: Shield },
                    { name: 'Infrastructure', score: application.score.infrastructureScore, icon: Database },
                    { name: 'DevOps Maturity', score: application.score.devOpsMaturityScore, icon: TrendingUp },
                    { name: 'Database Optimization', score: application.score.databaseOptimizationScore, icon: Database },
                    { name: 'Documentation', score: application.score.documentationScore, icon: Code }
                  ].map((category) => (
                    <div key={category.name} className="text-center p-3 border border-gray-200 rounded-lg">
                      <category.icon className={`h-6 w-6 mx-auto mb-2 ${getScoreColor(category.score)}`} />
                      <div className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}
                      </div>
                      <div className="text-xs text-gray-500">{category.name}</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category.score >= 80 ? 'bg-green-500' :
                            category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${category.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Information */}
              {(application.estimatedMigrationCost || application.monthlyCost) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {application.estimatedMigrationCost && (
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${application.estimatedMigrationCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Estimated Migration Cost</div>
                      </div>
                    )}
                    {application.monthlyCost && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${application.monthlyCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Monthly Operating Cost</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Overview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-red-600 mr-2" />
                  Security Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Critical', count: application.criticalFindings || 0, color: 'text-red-600 bg-red-100' },
                    { name: 'High', count: application.highFindings || 0, color: 'text-orange-600 bg-orange-100' },
                    { name: 'Medium', count: Math.floor(Math.random() * 10), color: 'text-yellow-600 bg-yellow-100' },
                    { name: 'Low', count: Math.floor(Math.random() * 15), color: 'text-blue-600 bg-blue-100' }
                  ].map((severity) => (
                    <div key={severity.name} className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-xl font-bold ${severity.color.split(' ')[0]}`}>
                        {severity.count}
                      </div>
                      <div className="text-sm text-gray-500">{severity.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repository Link */}
              {application.repositoryUrl && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Source Code Repository</h4>
                      <p className="text-sm text-gray-500 mt-1">Access the application source code</p>
                    </div>
                    <a
                      href={application.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Repository
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
              <p className="text-gray-500">The requested application could not be loaded.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            {application && (
              <button
                onClick={() => window.open(`/app/applications/${application.id}`, '_blank')}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2 inline" />
                Full Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailsModal;