// src/services/apiService.js - Service wrapper with mock data fallback
import { assessmentService } from './assessmentservice';

const USE_API = process.env.REACT_APP_USE_API === 'true';

// Mock data definitions
const mockData = {
  dashboardOverview: {
    metrics: {
      totalApplications: 8,
      averageScore: 76,
      criticalIssues: 23,
      potentialSavings: 1240000,
      assessmentProgress: 75,
      securityIssues: 142,
      cloudReadiness: 72
    },
    trends: [
      { month: 'Jan', score: 68 },
      { month: 'Feb', score: 72 },
      { month: 'Mar', score: 75 },
      { month: 'Apr', score: 78 },
      { month: 'May', score: 74 },
      { month: 'Jun', score: 82 },
      { month: 'Jul', score: 85 },
      { month: 'Aug', score: 88 },
      { month: 'Sep', score: 84 },
      { month: 'Oct', score: 89 },
      { month: 'Nov', score: 91 },
      { month: 'Dec', score: 87 }
    ]
  },

  portfolioSummary: [
    {
      id: 1,
      name: 'Customer Portal Web App',
      type: 'React SPA',
      category: 'Customer-Facing',
      technology: 'React',
      linesOfCode: 45000,
      complexityScore: 7.2,
      securityRating: 'B+',
      cloudReadinessScore: 85,
      estimatedMigrationCost: 125000,
      monthlyCost: 2400,
      lastAnalyzed: '2024-12-20T10:30:00Z',
      criticalFindings: 2,
      highFindings: 5,
      assessment: {
        id: 1,
        name: 'Q4 2024 Portfolio Assessment',
        status: 'Completed'
      }
    },
    {
      id: 2,
      name: 'Internal ERP System',
      type: '.NET Core API',
      category: 'Business Critical',
      technology: '.NET Core',
      linesOfCode: 89000,
      complexityScore: 8.5,
      securityRating: 'C+',
      cloudReadinessScore: 72,
      estimatedMigrationCost: 275000,
      monthlyCost: 5200,
      lastAnalyzed: '2024-12-19T14:15:00Z',
      criticalFindings: 5,
      highFindings: 12,
      assessment: {
        id: 1,
        name: 'Q4 2024 Portfolio Assessment',
        status: 'Completed'
      }
    },
    {
      id: 3,
      name: 'Mobile Banking App',
      type: 'React Native',
      category: 'Customer-Facing',
      technology: 'React Native',
      linesOfCode: 62000,
      complexityScore: 6.8,
      securityRating: 'A-',
      cloudReadinessScore: 91,
      estimatedMigrationCost: 85000,
      monthlyCost: 1800,
      lastAnalyzed: '2024-12-18T09:45:00Z',
      criticalFindings: 1,
      highFindings: 2,
      assessment: {
        id: 2,
        name: 'Security Compliance Review',
        status: 'InProgress'
      }
    },
    {
      id: 4,
      name: 'Legacy Payment Gateway',
      type: 'Java Spring',
      category: 'Business Critical',
      technology: 'Java',
      linesOfCode: 125000,
      complexityScore: 9.2,
      securityRating: 'D+',
      cloudReadinessScore: 58,
      estimatedMigrationCost: 450000,
      monthlyCost: 8500,
      lastAnalyzed: '2024-12-17T16:20:00Z',
      criticalFindings: 15,
      highFindings: 23,
      assessment: {
        id: 3,
        name: 'Cloud Migration Readiness',
        status: 'Analyzing'
      }
    }
  ],

  assessments: [
    {
      id: 1,
      name: 'Q4 2024 Portfolio Assessment',
      status: 'Completed',
      createdDate: '2024-12-15T10:30:00Z',
      lastModifiedDate: '2024-12-20T15:45:00Z',
      applicationCount: 8,
      overallScore: 76,
      potentialSavings: 1240000,
      description: 'Comprehensive assessment of the application portfolio for cloud migration readiness and optimization opportunities.'
    },
    {
      id: 2,
      name: 'Security Compliance Review',
      status: 'InProgress',
      createdDate: '2024-12-18T14:45:00Z',
      lastModifiedDate: '2024-12-22T09:30:00Z',
      applicationCount: 5,
      overallScore: 68,
      potentialSavings: 850000,
      description: 'Security-focused assessment to identify vulnerabilities and compliance gaps across key applications.'
    },
    {
      id: 3,
      name: 'Cloud Migration Readiness',
      status: 'Analyzing',
      createdDate: '2024-12-20T09:15:00Z',
      lastModifiedDate: '2024-12-22T11:20:00Z',
      applicationCount: 12,
      overallScore: 82,
      potentialSavings: 2100000,
      description: 'Evaluation of legacy systems for cloud migration potential and modernization strategies.'
    }
  ]
};

// Service wrapper that handles API calls with mock fallback
export const apiService = {
  // Dashboard services
  async getDashboardOverview() {
    if (USE_API) {
      try {
        const data = await assessmentService.getDashboardOverview();
        console.log('✅ Dashboard data loaded from API:', data);
        return data;
      } catch (error) {
        console.warn('⚠️ API call failed, falling back to mock data:', error.message);
        return mockData.dashboardOverview;
      }
    }
    console.log('📄 Using mock dashboard data (API disabled)');
    return mockData.dashboardOverview;
  },

  async getPortfolioSummary(assessmentId = null) {
    if (USE_API) {
      try {
        const data = await assessmentService.getPortfolioSummary(assessmentId);
        console.log('✅ Portfolio data loaded from API:', data);
        return data;
      } catch (error) {
        console.warn('⚠️ Portfolio API call failed, falling back to mock data:', error.message);
        return mockData.portfolioSummary;
      }
    }
    console.log('📄 Using mock portfolio data (API disabled)');
    return mockData.portfolioSummary;
  },

  // Assessment services
  async getAssessments() {
    if (USE_API) {
      try {
        const data = await assessmentService.getAssessments();
        console.log('✅ Assessments loaded from API:', data);
        return data;
      } catch (error) {
        console.warn('⚠️ Assessments API call failed, falling back to mock data:', error.message);
        return mockData.assessments;
      }
    }
    console.log('📄 Using mock assessments data (API disabled)');
    return mockData.assessments;
  },

  async getAssessment(id) {
    if (USE_API) {
      try {
        return await assessmentService.getAssessment(id);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return mockData.assessments.find(a => a.id === parseInt(id)) || null;
      }
    }
    return mockData.assessments.find(a => a.id === parseInt(id)) || null;
  },

  async createAssessment(data) {
    if (USE_API) {
      try {
        return await assessmentService.createAssessment(data);
      } catch (error) {
        console.warn('API call failed, simulating with mock data:', error);
        const newAssessment = {
          id: Date.now(),
          ...data,
          status: 'Draft',
          createdDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
          applicationCount: 0,
          overallScore: 0,
          potentialSavings: 0
        };
        return newAssessment;
      }
    }
    const newAssessment = {
      id: Date.now(),
      ...data,
      status: 'Draft',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      applicationCount: 0,
      overallScore: 0,
      potentialSavings: 0
    };
    return newAssessment;
  },

  async startAssessment(id) {
    if (USE_API) {
      try {
        return await assessmentService.startAssessment(id);
      } catch (error) {
        console.warn('API call failed, simulating with mock data:', error);
        const assessment = mockData.assessments.find(a => a.id === parseInt(id));
        return assessment ? { ...assessment, status: 'InProgress' } : null;
      }
    }
    const assessment = mockData.assessments.find(a => a.id === parseInt(id));
    return assessment ? { ...assessment, status: 'InProgress' } : null;
  },

  // Application services
  async getApplications(params = {}) {
    if (USE_API) {
      try {
        return await assessmentService.getApplications(params);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return mockData.portfolioSummary;
      }
    }
    return mockData.portfolioSummary;
  },

  async getApplication(id) {
    if (USE_API) {
      try {
        return await assessmentService.getApplication(id);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return mockData.portfolioSummary.find(a => a.id === parseInt(id)) || null;
      }
    }
    return mockData.portfolioSummary.find(a => a.id === parseInt(id)) || null;
  },

  // Recommendations services
  async getRecommendations(assessmentId) {
    if (USE_API) {
      try {
        return await assessmentService.getRecommendations(assessmentId);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return [];
      }
    }
    return [];
  },

  // Security services
  async getSecurityOverview(assessmentId) {
    if (USE_API) {
      try {
        return await assessmentService.getSecurityOverview(assessmentId);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return {
          totalFindings: 142,
          criticalFindings: 23,
          highFindings: 45,
          mediumFindings: 52,
          lowFindings: 22,
          overallRisk: 'Medium'
        };
      }
    }
    return {
      totalFindings: 142,
      criticalFindings: 23,
      highFindings: 45,
      mediumFindings: 52,
      lowFindings: 22,
      overallRisk: 'Medium'
    };
  },

  // Cloud Readiness services
  async getCloudReadiness(assessmentId) {
    if (USE_API) {
      try {
        return await assessmentService.getCloudReadiness(assessmentId);
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error);
        return {
          overallScore: 72,
          categories: {
            infrastructure: 85,
            security: 68,
            application: 75,
            data: 70,
            operations: 74
          }
        };
      }
    }
    return {
      overallScore: 72,
      categories: {
        infrastructure: 85,
        security: 68,
        application: 75,
        data: 70,
        operations: 74
      }
    };
  },

  // Pass-through methods for API service methods that don't need mock fallback
  updateAssessment: assessmentService.updateAssessment,
  deleteAssessment: assessmentService.deleteAssessment,
  completeAssessment: assessmentService.completeAssessment,
  analyzeApplication: assessmentService.analyzeApplication,
  getSecurityFindings: assessmentService.getSecurityFindings,
  getCodeMetrics: assessmentService.getCodeMetrics,
  generateRecommendations: assessmentService.generateRecommendations,
  updateRecommendation: assessmentService.updateRecommendation,
  acceptRecommendation: assessmentService.acceptRecommendation,
  rejectRecommendation: assessmentService.rejectRecommendation,
  updateCloudReadiness: assessmentService.updateCloudReadiness,
  analyzeCloudReadiness: assessmentService.analyzeCloudReadiness,
  getBusinessDrivers: assessmentService.getBusinessDrivers,
  updateBusinessDrivers: assessmentService.updateBusinessDrivers,
  getStakeholders: assessmentService.getStakeholders,
  addStakeholder: assessmentService.addStakeholder,
  updateStakeholder: assessmentService.updateStakeholder,
  deleteStakeholder: assessmentService.deleteStakeholder,
  uploadFile: assessmentService.uploadFile,
  getFiles: assessmentService.getFiles,
  deleteFile: assessmentService.deleteFile,
  downloadFile: assessmentService.downloadFile,
  generateReport: assessmentService.generateReport,
  getReports: assessmentService.getReports,
  downloadReport: assessmentService.downloadReport,
  search: assessmentService.search,
  getCurrentUser: assessmentService.getCurrentUser,
  updateProfile: assessmentService.updateProfile
};