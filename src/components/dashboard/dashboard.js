// src/components/Dashboard/Dashboard.js - Main dashboard component
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import MetricsOverview from './metricsoverview';
import PortfolioSummary from './portfoliosummary';
import RecentActivity from './recentactivity';
import TrendAnalysis from './trendanalysis';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import toast from 'react-hot-toast';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { assessments, currentAssessment, loadAssessment } = useAssessment();

  useEffect(() => {
    loadDashboardData();
  }, [currentAssessment]);

  const generateCategoryScores = (assessmentId) => {
    // E-Commerce Platform (Assessment 1)
    if (assessmentId === 1) {
      return {
        codeQuality: 82,
        security: 75,
        infrastructure: 88,
        devOpsMaturity: 78,
        databaseOptimization: 85,
        documentation: 72
      };
    }
    // Financial Services Security (Assessment 2) 
    else if (assessmentId === 2) {
      return {
        codeQuality: 70,
        security: 58, // Lower due to legacy systems
        infrastructure: 65, // Mainframe challenges
        devOpsMaturity: 62, // Conservative approach
        databaseOptimization: 68,
        documentation: 85 // Strong compliance docs
      };
    }
    // Cloud Migration Readiness (Assessment 3)
    else {
      return {
        codeQuality: 95,
        security: 88,
        infrastructure: 92,
        devOpsMaturity: 94, // Excellent CI/CD
        databaseOptimization: 90,
        documentation: 87
      };
    }
  };

  const generateTrendsData = (assessmentId) => {
    // E-Commerce Platform (Assessment 1)
    if (assessmentId === 1) {
      return [
        { month: 'Sep', score: 68, readiness: 65, issues: 32 },
        { month: 'Oct', score: 72, readiness: 68, issues: 28 },
        { month: 'Nov', score: 75, readiness: 72, issues: 24 },
        { month: 'Dec', score: 78, readiness: 76, issues: 20 },
        { month: 'Jan', score: 82, readiness: 80, issues: 15 }
      ];
    }
    // Financial Services Security (Assessment 2)
    else if (assessmentId === 2) {
      return [
        { month: 'Sep', score: 45, readiness: 35, issues: 65 },
        { month: 'Oct', score: 48, readiness: 38, issues: 58 },
        { month: 'Nov', score: 52, readiness: 42, issues: 52 },
        { month: 'Dec', score: 55, readiness: 45, issues: 48 },
        { month: 'Jan', score: 58, readiness: 47, issues: 44 }
      ];
    }
    // Cloud Migration Readiness (Assessment 3)
    else {
      return [
        { month: 'Sep', score: 88, readiness: 85, issues: 12 },
        { month: 'Oct', score: 90, readiness: 87, issues: 10 },
        { month: 'Nov', score: 92, readiness: 90, issues: 8 },
        { month: 'Dec', score: 94, readiness: 92, issues: 6 },
        { month: 'Jan', score: 95, readiness: 94, issues: 4 }
      ];
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (currentAssessment?.id) {
        // Load assessment-specific data
        console.log('DASHBOARD: Loading data for assessment ID:', currentAssessment.id);
        
        // Generate assessment-specific portfolio data
        const portfolioData = generateAssessmentSpecificData(currentAssessment, 'portfolio');
        
        // Load applications for this assessment (with fallback to generated data)
        let applications;
        try {
          applications = await apiService.getApplications({ assessmentId: currentAssessment.id });
        } catch (error) {
          console.log('Using generated portfolio data as fallback');
          applications = portfolioData?.applications?.map(app => ({
            id: Math.floor(Math.random() * 1000),
            name: app.name,
            criticalIssues: app.complexity === 'High' || app.complexity === 'Very High' ? 2 : 0,
            securityIssues: app.criticality === 'Critical' ? 3 : 1
          })) || [];
        }
        
        // Calculate assessment-specific metrics using portfolio data
        const assessmentMetrics = {
          totalApplications: portfolioData?.metrics?.totalApplications || applications.length || currentAssessment.applicationCount || 0,
          averageScore: Math.round((portfolioData?.applications?.reduce((sum, app) => sum + app.cloudReadiness, 0) || 0) / (portfolioData?.applications?.length || 1)) || currentAssessment.overallScore || 0,
          criticalIssues: applications.reduce((sum, app) => sum + (app.criticalIssues || 0), 0) || portfolioData?.metrics?.criticalApps || 0,
          potentialSavings: currentAssessment.potentialSavings || 0,
          assessmentProgress: currentAssessment.status === 'Completed' ? 100 : currentAssessment.status === 'InProgress' ? 75 : 25,
          securityIssues: applications.reduce((sum, app) => sum + (app.securityIssues || 0), 0),
          cloudReadiness: currentAssessment.cloudReadinessScore || 0
        };

        // Generate assessment-specific category scores
        const categoryScores = generateCategoryScores(currentAssessment.id);

        const dashboardWithExtras = {
          metrics: assessmentMetrics,
          applications: applications,
          categoryScores: categoryScores,
          trends: portfolioData?.trends || generateTrendsData(currentAssessment.id),
          currentAssessment: currentAssessment,
          recentAssessments: assessments.map(assessment => ({
            id: assessment.id,
            name: assessment.name,
            status: assessment.status,
            applicationCount: assessment.applicationCount || 0,
            createdAt: assessment.createdDate
          }))
        };
        
        setDashboardData(dashboardWithExtras);
      } else {
        // No assessment selected - show general overview
        console.log('DASHBOARD: No assessment selected, showing general overview');
        const data = await apiService.getDashboardOverview();
        
        const dashboardWithExtras = {
          ...data,
          categoryScores: {
            codeQuality: 85,
            security: 78,
            infrastructure: 92,
            devOpsMaturity: 74,
            databaseOptimization: 81,
            documentation: 69
          },
          recentAssessments: assessments.map(assessment => ({
            id: assessment.id,
            name: assessment.name,
            status: assessment.status,
            applicationCount: assessment.applicationCount || 0,
            createdAt: assessment.createdDate
          }))
        };
        
        setDashboardData(dashboardWithExtras);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to empty data
      const fallbackData = {
        metrics: { 
          totalApplications: 0, 
          averageScore: 0, 
          criticalIssues: 0, 
          potentialSavings: 0, 
          assessmentProgress: 0, 
          securityIssues: 0, 
          cloudReadiness: 0 
        },
        trends: [],
        categoryScores: {
          codeQuality: 0,
          security: 0,
          infrastructure: 0,
          devOpsMaturity: 0,
          databaseOptimization: 0,
          documentation: 0
        },
        recentAssessments: []
      };
      setDashboardData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Assessment Selection */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-blue-100 mt-1">
              {currentAssessment 
                ? "Assessment-specific metrics and portfolio data" 
                : "Select an assessment to view detailed metrics and portfolio data"
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{assessments.length}</div>
            <div className="text-blue-100 text-sm">Total Assessments</div>
          </div>
        </div>

        {/* Assessment Selection */}
        <div className="border-t border-blue-500 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Select Assessment for Detailed View
              </label>
              <select
                value={currentAssessment?.id || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    loadAssessment(parseInt(e.target.value));
                    toast.success(`Assessment "${assessments.find(a => a.id === parseInt(e.target.value))?.name}" selected`);
                  }
                }}
                className="bg-white text-gray-900 px-3 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">View all assessments (general overview)</option>
                {assessments.map(assessment => (
                  <option key={assessment.id} value={assessment.id}>
                    {assessment.name} ({assessment.status})
                  </option>
                ))}
              </select>
            </div>
            {currentAssessment && (
              <div className="text-right ml-6">
                <p className="text-sm text-blue-100">Assessment Details:</p>
                <p className="font-semibold text-sm">Status: {currentAssessment.status}</p>
                <p className="text-xs text-blue-200">ID: {currentAssessment.id}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      {dashboardData && <MetricsOverview data={dashboardData.metrics} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PortfolioSummary />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity assessments={dashboardData?.recentAssessments || []} />
        </div>
      </div>

      {/* Trend Analysis */}
      {dashboardData && <TrendAnalysis data={dashboardData} />}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/app/assessments/new"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-blue-600 font-medium">Start New Assessment</div>
            <div className="text-gray-500 text-sm mt-1">
              Create a comprehensive application portfolio assessment
            </div>
          </Link>
          
          <Link
            to="/app/security"
            className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-red-600 font-medium">Security Assessment</div>
            <div className="text-gray-500 text-sm mt-1">
              Analyze security posture and vulnerabilities
            </div>
          </Link>
          
          <Link
            to="/app/infrastructure"
            className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-green-600 font-medium">Infrastructure Assessment</div>
            <div className="text-gray-500 text-sm mt-1">
              Evaluate server readiness and cloud migration potential
            </div>
          </Link>
          
          <Link
            to="/app/devops"
            className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-purple-600 font-medium">DevOps Assessment</div>
            <div className="text-gray-500 text-sm mt-1">
              Assess CI/CD pipeline maturity and automation
            </div>
          </Link>
          
          <Link
            to="/app/cloud-readiness"
            className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-indigo-600 font-medium">Cloud Readiness</div>
            <div className="text-gray-500 text-sm mt-1">
              Comprehensive cloud migration readiness analysis
            </div>
          </Link>
          
          <Link
            to="/app/data"
            className="block p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-yellow-600 font-medium">Data Assessment</div>
            <div className="text-gray-500 text-sm mt-1">
              Analyze data architecture and migration strategy
            </div>
          </Link>
          
          <Link
            to="/app/architecture"
            className="block p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-pink-600 font-medium">Architecture Review</div>
            <div className="text-gray-500 text-sm mt-1">
              Review application architecture and dependencies
            </div>
          </Link>
          
          <Link
            to="/app/recommendations"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="text-blue-600 font-medium">Results & Insights</div>
            <div className="text-gray-500 text-sm mt-1">
              View comprehensive recommendations and business case
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;