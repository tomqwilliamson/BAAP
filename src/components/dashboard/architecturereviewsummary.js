// src/components/Dashboard/ArchitectureReviewSummary.js - Architecture review summary for executive dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, Code, Database, Shield, Monitor, GitBranch, 
  ArrowRight, AlertCircle, CheckCircle, ExternalLink, TrendingUp, TrendingDown
} from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';

function ArchitectureReviewSummary() {
  const { currentAssessment } = useAssessment();
  const [architectureData, setArchitectureData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchitectureData();
  }, [currentAssessment]);

  const loadArchitectureData = () => {
    try {
      // Generate assessment-specific architecture data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'architecture');
      
      // Create summary data structure
      const summaryData = {
        healthMetrics: {
          maintainability: assessmentSpecificData?.healthMetrics?.maintainability || 78,
          complexity: assessmentSpecificData?.healthMetrics?.complexity || 65,
          testCoverage: assessmentSpecificData?.healthMetrics?.testCoverage || 72,
          technicalDebt: assessmentSpecificData?.healthMetrics?.technicalDebt || 42,
          overall: assessmentSpecificData?.healthMetrics?.overall || 71
        },
        codebaseStats: {
          totalFiles: assessmentSpecificData?.codebaseStats?.totalFiles || 2847,
          linesOfCode: assessmentSpecificData?.codebaseStats?.linesOfCode || 347582,
          languages: assessmentSpecificData?.codebaseStats?.languages || [
            { name: 'JavaScript', percentage: 45 },
            { name: 'TypeScript', percentage: 28 },
            { name: 'C#', percentage: 15 },
            { name: 'SQL', percentage: 8 },
            { name: 'Other', percentage: 4 }
          ]
        },
        codeQuality: {
          codeSmells: assessmentSpecificData?.codeQuality?.codeSmells || 156,
          bugs: assessmentSpecificData?.codeQuality?.bugs || 23,
          vulnerabilities: assessmentSpecificData?.codeQuality?.vulnerabilities || 8,
          securityHotspots: assessmentSpecificData?.codeQuality?.securityHotspots || 12
        },
        architecturePatterns: assessmentSpecificData?.architecturePatterns || [
          { name: 'Microservices', coverage: 65, status: 'Partial' },
          { name: 'API Gateway', coverage: 80, status: 'Implemented' },
          { name: 'Event Sourcing', coverage: 30, status: 'Limited' },
          { name: 'CQRS', coverage: 45, status: 'Partial' }
        ],
        technologyStack: assessmentSpecificData?.technologyStack || [
          { name: 'React', version: '18.2.0', status: 'Current' },
          { name: 'Node.js', version: '16.14.0', status: 'Outdated' },
          { name: '.NET Core', version: '6.0', status: 'Current' },
          { name: 'SQL Server', version: '2019', status: 'Current' }
        ]
      };

      setArchitectureData(summaryData);
    } catch (error) {
      console.error('Error loading architecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Implemented':
      case 'Current': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Limited':
      case 'Outdated': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading || !architectureData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Layers className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Architecture Review</h3>
        </div>
        <Link
          to="/app/architecture-review"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          View Details
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Health Metrics Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Health</span>
            {getScoreIcon(architectureData?.healthMetrics?.overall || 0)}
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {architectureData?.healthMetrics?.overall || 0}%
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Test Coverage</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {architectureData?.healthMetrics?.testCoverage || 0}%
          </div>
        </div>
      </div>

      {/* Code Quality Indicators */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Code className="h-4 w-4 text-gray-600 mr-2" />
          Code Quality
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Code Smells</span>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{architectureData?.codeQuality?.codeSmells || 0}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bugs</span>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium">{architectureData?.codeQuality?.bugs || 0}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vulnerabilities</span>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm font-medium">{architectureData?.codeQuality?.vulnerabilities || 0}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Security Hotspots</span>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium">{architectureData?.codeQuality?.securityHotspots || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Patterns */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Architecture Patterns</h4>
        <div className="space-y-2">
          {(architectureData?.architecturePatterns || []).slice(0, 3).map((pattern, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">{pattern.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{pattern.coverage}%</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pattern.status)}`}>
                  {pattern.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Database className="h-4 w-4 text-gray-600 mr-2" />
          Technology Stack
        </h4>
        <div className="space-y-2">
          {(architectureData?.technologyStack || []).slice(0, 3).map((tech, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="text-gray-700">{tech.name}</span>
                <span className="text-gray-500 ml-2 text-xs">{tech.version}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tech.status)}`}>
                {tech.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Codebase Stats */}
      <div className="mb-6 bg-gray-50 p-3 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Files:</span>
            <span className="font-medium ml-2">{(architectureData?.codebaseStats?.totalFiles || 0).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Lines of Code:</span>
            <span className="font-medium ml-2">{(architectureData?.codebaseStats?.linesOfCode || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="pt-4 border-t border-gray-200">
        <Link
          to="/app/architecture-review"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Review Architecture
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default ArchitectureReviewSummary;