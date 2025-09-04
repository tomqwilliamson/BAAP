// src/components/Dashboard/Dashboard.js - Main dashboard component
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, X, Phone, Mail, User, Clock } from 'lucide-react';
import { apiService } from '../../services/apiService';
import MetricsOverview from './metricsoverview';
import PortfolioSummary from './portfoliosummary';
import AssessmentProgress from './assessmentprogress';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import toast from 'react-hot-toast';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleDemo, setShowScheduleDemo] = useState(false);
  const [demoRequestData, setDemoRequestData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredTime: '',
    message: ''
  });
  const { assessments, currentAssessment, loadAssessment, clearCurrentAssessment, loading: assessmentsLoading } = useAssessment();

  useEffect(() => {
    loadDashboardData();
  }, [currentAssessment, assessments]); // Add assessments as dependency

  // DISABLED MOCK DATA - using database-only mode
  const generateCategoryScores = (assessmentId) => {
    // Return empty scores - these should come from database
    return {
      codeQuality: 0,
      security: 0,
      infrastructure: 0,
      devOpsMaturity: 0,
      databaseOptimization: 0,
      documentation: 0
    };
  };

  const generateTrendsData = (assessmentId) => {
    // DISABLED MOCK DATA - return empty trends data
    return [];
  };

  const loadDashboardData = async () => {
    try {
      console.log('DASHBOARD: Starting loadDashboardData', { 
        currentAssessmentId: currentAssessment?.id,
        assessmentsLoading, 
        assessmentsCount: assessments.length 
      });
      setLoading(true);
      
      // Wait for assessments to be loaded before proceeding
      if (assessmentsLoading) {
        console.log('DASHBOARD: Waiting for assessments to load...');
        return;
      }

      // Handle empty assessments case
      if (assessments.length === 0) {
        console.log('DASHBOARD: No assessments found in database');
        setDashboardData({
          portfolio: null,
          applications: [],
          assessmentMetrics: {
            totalApplications: 0,
            averageScore: 0,
            criticalIssues: 0,
            potentialSavings: 0,
            assessmentProgress: 0,
            securityIssues: 0,
            complianceScore: 0,
            cloudReadiness: 0
          },
          categoryScores: generateCategoryScores(null),
          trendsData: generateTrendsData(null)
        });
        setLoading(false);
        return;
      }
      
      if (currentAssessment?.id) {
        // Load assessment-specific data
        console.log('DASHBOARD: Loading data for assessment ID:', currentAssessment.id);
        
        // DISABLED MOCK DATA - skip portfolio data generation
        const portfolioData = null;
        
        // Load applications for this assessment (database only, no fallback)
        let applications = [];
        try {
          console.log('DASHBOARD: Fetching applications for assessment:', currentAssessment.id);
          const result = await apiService.getApplications({ assessmentId: currentAssessment.id });
          
          // Ensure we always have an array
          applications = Array.isArray(result) ? result : [];
          console.log('DASHBOARD: Loaded applications:', applications.length, 'applications');
          console.log('DASHBOARD: Applications type:', typeof result, 'isArray:', Array.isArray(result));
        } catch (error) {
          console.error('DASHBOARD: Failed to load applications from database:', error);
          console.warn('DASHBOARD: Using empty array for applications');
          applications = [];
        }
        
        // Calculate assessment-specific metrics using database data only
        let assessmentMetrics;
        try {
          console.log('DASHBOARD: Calculating metrics with:', { 
            applicationsCount: applications?.length || 0,
            currentAssessment: {
              id: currentAssessment.id,
              name: currentAssessment.name,
              overallScore: currentAssessment.overallScore,
              status: currentAssessment.status
            }
          });
          
          // Ensure applications is always an array for reduce operations
          const safeApplications = Array.isArray(applications) ? applications : [];
          
          assessmentMetrics = {
            totalApplications: safeApplications.length || 0,
            averageScore: currentAssessment?.overallScore || 0,
            criticalIssues: safeApplications.reduce((sum, app) => sum + (app?.criticalIssues || app?.criticalFindings || 0), 0),
            potentialSavings: currentAssessment?.potentialSavings || 0,
            assessmentProgress: currentAssessment?.status === 'Completed' ? 100 : currentAssessment?.status === 'InProgress' ? 75 : 25,
            securityIssues: safeApplications.reduce((sum, app) => sum + (app?.securityIssues || ((app?.criticalFindings || 0) + (app?.highFindings || 0))), 0),
            cloudReadiness: currentAssessment?.cloudReadinessScore || 0,
            totalMigrationCost: safeApplications.reduce((sum, app) => sum + (app?.estimatedMigrationCost || 0), 0)
          };
          
          console.log('DASHBOARD: Calculated metrics:', assessmentMetrics);
        } catch (error) {
          console.error('DASHBOARD: Error calculating metrics:', error);
          assessmentMetrics = {
            totalApplications: 0,
            averageScore: 0,
            criticalIssues: 0,
            potentialSavings: 0,
            assessmentProgress: 0,
            securityIssues: 0,
            cloudReadiness: 0,
            totalMigrationCost: 0
          };
        }

        // Get assessment-specific category scores from database
        let categoryScores;
        try {
          categoryScores = {
            codeQuality: currentAssessment?.codeQualityScore || 0,
            security: currentAssessment?.securityScore || 0,
            infrastructure: currentAssessment?.infrastructureScore || 0,
            devOpsMaturity: currentAssessment?.devOpsMaturityScore || 0,
            databaseOptimization: currentAssessment?.databaseOptimizationScore || 0,
            documentation: currentAssessment?.documentationScore || 0
          };
          
          console.log('DASHBOARD: Category scores:', categoryScores);
        } catch (error) {
          console.error('DASHBOARD: Error getting category scores:', error);
          categoryScores = {
            codeQuality: 0,
            security: 0,
            infrastructure: 0,
            devOpsMaturity: 0,
            databaseOptimization: 0,
            documentation: 0
          };
        }

        const dashboardWithExtras = {
          metrics: assessmentMetrics,
          applications: applications,
          categoryScores: categoryScores,
          trends: generateTrendsData(currentAssessment.id), // Will return empty array
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
        // No assessment selected - show general overview with aggregated data from all assessments
        console.log('DASHBOARD: No assessment selected, showing general overview');
        console.log('DASHBOARD: Available assessments:', assessments);
        
        // Get all applications across all assessments
        const allApplicationsData = await apiService.getPortfolioSummary();
        console.log('DASHBOARD: All applications data:', allApplicationsData);
        
        // Calculate aggregated metrics from all assessments
        const totalApplications = assessments.reduce((sum, assessment) => {
          console.log(`Assessment ${assessment.name}: ${assessment.applicationCount || 0} apps`);
          return sum + (assessment.applicationCount || 0);
        }, 0);
        
        const totalPotentialSavings = assessments.reduce((sum, assessment) => sum + (assessment.potentialSavings || 0), 0);
        const totalMigrationCost = allApplicationsData.reduce((sum, app) => sum + (app.estimatedMigrationCost || 0), 0);
        const averageScore = assessments.length > 0 ? Math.round(assessments.reduce((sum, assessment) => sum + (assessment.overallScore || 0), 0) / assessments.length) : 0;
        
        // Calculate security metrics from actual application data
        const criticalIssues = allApplicationsData.reduce((sum, app) => sum + (app.criticalFindings || 0), 0);
        const securityIssues = allApplicationsData.reduce((sum, app) => sum + ((app.criticalFindings || 0) + (app.highFindings || 0)), 0);
        const avgCloudReadiness = allApplicationsData.length > 0 ? Math.round(allApplicationsData.reduce((sum, app) => sum + (app.cloudReadinessScore || 0), 0) / allApplicationsData.length) : 0;
        
        // Calculate assessment progress
        const completedCount = assessments.filter(a => a.status === 'Completed').length;
        const assessmentProgress = assessments.length > 0 ? Math.round((completedCount / assessments.length) * 100) : 0;

        console.log('DASHBOARD: Calculated metrics:', {
          totalApplications,
          averageScore,
          criticalIssues,
          totalPotentialSavings,
          assessmentProgress,
          securityIssues,
          avgCloudReadiness,
          totalMigrationCost
        });

        const dashboardWithExtras = {
          metrics: {
            totalApplications: totalApplications || allApplicationsData.length || 0,
            averageScore: averageScore || 0,
            criticalIssues: criticalIssues || 0,
            potentialSavings: totalPotentialSavings || 0,
            assessmentProgress: assessmentProgress || 0,
            securityIssues: securityIssues || 0,
            cloudReadiness: avgCloudReadiness || 0,
            totalMigrationCost: totalMigrationCost || 0
          },
          categoryScores: {
            codeQuality: 0,
            security: 0,
            infrastructure: 0,
            devOpsMaturity: 0,
            databaseOptimization: 0,
            documentation: 0
          },
          recentAssessments: assessments.map(assessment => ({
            id: assessment.id,
            name: assessment.name,
            status: assessment.status,
            applicationCount: assessment.applicationCount || 0,
            createdAt: assessment.createdDate
          })),
          trends: []
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
          cloudReadiness: 0,
          totalMigrationCost: 0
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

  const handleScheduleDemo = async (e) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would send to your email API
      // For now, we'll simulate sending a notification email
      const emailData = {
        to: 'tom.williamson@quisitive.com',
        subject: `BAAP Demo Request from ${demoRequestData.name}`,
        body: `
          New demo request received:
          
          Name: ${demoRequestData.name}
          Email: ${demoRequestData.email}
          Company: ${demoRequestData.company}
          Phone: ${demoRequestData.phone}
          Preferred Time: ${demoRequestData.preferredTime}
          Message: ${demoRequestData.message}
          
          Please reach out to schedule the demo.
        `
      };
      
      console.log('Sending demo request email:', emailData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Demo request sent! Tom will contact you at ${demoRequestData.email} to schedule.`);
      setShowScheduleDemo(false);
      setDemoRequestData({
        name: '',
        email: '',
        company: '',
        phone: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending demo request:', error);
      toast.error('Failed to send demo request. Please try again.');
    }
  };

  if (loading || assessmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-gray-600">
          {assessmentsLoading ? 'Loading assessments...' : 'Loading dashboard...'}
        </div>
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

      </div>

      {/* Metrics Overview */}
      {dashboardData && <MetricsOverview data={dashboardData.metrics} showAllAssessments={!currentAssessment} />}

      {/* Application Portfolio - Full Width */}
      <div>
        <PortfolioSummary />
      </div>

      {/* Assessment Progress Overview */}
      <AssessmentProgress assessments={assessments} />

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
      
      {/* Floating Schedule Demo Button */}
      <button
        onClick={() => setShowScheduleDemo(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-50"
      >
        <Calendar className="h-6 w-6" />
      </button>
      
      {/* Schedule Demo Modal */}
      {showScheduleDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Schedule a Demo</h3>
                </div>
                <button
                  onClick={() => setShowScheduleDemo(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                Get a personalized demo of BAAP's AI-powered assessment capabilities. Our team will show you how to accelerate your cloud transformation journey.
              </p>
              
              <form onSubmit={handleScheduleDemo} className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 mr-1" />
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={demoRequestData.name}
                    onChange={(e) => setDemoRequestData({...demoRequestData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={demoRequestData.email}
                    onChange={(e) => setDemoRequestData({...demoRequestData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={demoRequestData.company}
                    onChange={(e) => setDemoRequestData({...demoRequestData, company: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={demoRequestData.phone}
                    onChange={(e) => setDemoRequestData({...demoRequestData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Next week, weekdays 2-4 PM EST"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={demoRequestData.preferredTime}
                    onChange={(e) => setDemoRequestData({...demoRequestData, preferredTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Additional Message
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your assessment needs..."
                    value={demoRequestData.message}
                    onChange={(e) => setDemoRequestData({...demoRequestData, message: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleDemo(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Request Demo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;