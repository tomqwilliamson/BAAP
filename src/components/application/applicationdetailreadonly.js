// src/components/Application/ApplicationDetailReadOnly.js - Read-only application detail view
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code, Shield, Database, Activity, AlertTriangle, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { assessmentService } from '../../services/assessmentservice';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ApplicationDetailReadOnly() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [securityFindings, setSecurityFindings] = useState([]);
  const [codeMetrics, setCodeMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicationData();
  }, [id]);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      const [appData, findings, metrics] = await Promise.all([
        assessmentService.getApplication(id),
        assessmentService.getSecurityFindings(id),
        assessmentService.getCodeMetrics(id)
      ]);
      
      setApplication(appData);
      setSecurityFindings(findings);
      setCodeMetrics(metrics);
    } catch (error) {
      console.error('Error loading application data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreData = () => {
    if (!application?.score) return [];
    
    const score = application.score;
    return [
      { subject: 'Code Quality', A: score.codeQualityScore, fullMark: 100 },
      { subject: 'Security', A: score.securityScore, fullMark: 100 },
      { subject: 'Infrastructure', A: score.infrastructureScore, fullMark: 100 },
      { subject: 'DevOps', A: score.devOpsMaturityScore, fullMark: 100 },
      { subject: 'Database', A: score.databaseOptimizationScore, fullMark: 100 },
      { subject: 'Documentation', A: score.documentationScore, fullMark: 100 },
    ];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Database className="h-4 w-4 mr-1" />
            Read-Only View
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{application.name}</h1>
            <p className="text-gray-600 mt-1">{application.description}</p>
            <div className="flex items-center mt-3 space-x-4">
              <span className="text-sm text-gray-500">Type: {application.type}</span>
              <span className="text-sm text-gray-500">Category: {application.category}</span>
              <span className="text-sm text-gray-500">
                Last Updated: {new Date(application.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            {application.technologyStack && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">Tech Stack: </span>
                <span className="text-sm text-gray-700">{application.technologyStack}</span>
              </div>
            )}
          </div>
          
          {application.score && (
            <div className="text-center ml-6">
              <div className="text-4xl font-bold text-blue-600">{application.score.overallScore}</div>
              <div className="text-lg font-medium text-gray-700">{application.score.grade}</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                application.score.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                application.score.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                application.score.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {application.score.riskLevel} Risk
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Summary */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{application.linesOfCode || 'N/A'}</div>
            <div className="text-sm text-gray-500">Lines of Code</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{application.cloudReadinessScore || 'N/A'}%</div>
            <div className="text-sm text-gray-500">Cloud Readiness</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{application.complexityScore || 'N/A'}</div>
            <div className="text-sm text-gray-500">Complexity Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{securityFindings.length}</div>
            <div className="text-sm text-gray-500">Security Findings</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {application.score && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getScoreData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Scores</h3>
            <div className="space-y-4">
              {[
                { name: 'Code Quality', score: application.score.codeQualityScore },
                { name: 'Security', score: application.score.securityScore },
                { name: 'Infrastructure', score: application.score.infrastructureScore },
                { name: 'DevOps Maturity', score: application.score.devOpsMaturityScore },
                { name: 'Database Optimization', score: application.score.databaseOptimizationScore },
                { name: 'Documentation', score: application.score.documentationScore },
              ].map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>{category.name}</span>
                    <span>{category.score}/100</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
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
        </div>
      )}

      {/* Security Findings - Condensed Read-Only View */}
      {securityFindings.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Security Findings Summary</h3>
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {securityFindings.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            {/* Security Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['Critical', 'High', 'Medium', 'Low'].map(severity => {
                const count = securityFindings.filter(f => f.severity === severity).length;
                const colorClass = severity === 'Critical' ? 'text-red-600 bg-red-100' :
                                 severity === 'High' ? 'text-orange-600 bg-orange-100' :
                                 severity === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                                 'text-blue-600 bg-blue-100';
                return (
                  <div key={severity} className="text-center p-3 rounded-lg border">
                    <div className={`text-2xl font-bold ${colorClass.split(' ')[0]}`}>{count}</div>
                    <div className="text-sm text-gray-500">{severity}</div>
                  </div>
                );
              })}
            </div>
            
            {/* Top 5 Critical/High Findings */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Top Priority Issues</h4>
              {securityFindings
                .filter(f => f.severity === 'Critical' || f.severity === 'High')
                .slice(0, 5)
                .map((finding) => (
                <div key={finding.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h5 className="font-medium text-gray-900 text-sm">{finding.title}</h5>
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{finding.description}</p>
                      {finding.category && (
                        <div className="mt-1 text-xs text-gray-500">
                          Category: {finding.category}
                        </div>
                      )}
                    </div>
                    {finding.isResolved ? (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Quality Metrics - Condensed */}
      {codeMetrics.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Code className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Code Quality Metrics</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {codeMetrics.slice(0, 8).map((metric) => (
                <div key={metric.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{metric.metricName}</h4>
                    {metric.passesThreshold ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                    <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Repository Information */}
      {application.repositoryUrl && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Repository Information</h3>
              <p className="text-sm text-gray-500 mt-1">Source code location and details</p>
            </div>
            <a
              href={application.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Repository
            </a>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <strong>URL:</strong> {application.repositoryUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetailReadOnly;