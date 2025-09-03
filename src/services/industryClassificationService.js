// Industry Classification Service - Phase 4
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests or development bypass
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
    config.headers['X-Auth-Bypass'] = 'development';
  }
  return config;
});

const INDUSTRY_CLASSIFICATION_BASE = '/industry';

class IndustryClassificationService {
  // Get all industry classifications
  async getIndustries() {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/classifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }

  // Classify an assessment to determine its industry
  async classifyAssessment(assessmentId) {
    try {
      const response = await apiClient.post(`${INDUSTRY_CLASSIFICATION_BASE}/classify/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error classifying assessment:', error);
      throw error;
    }
  }

  // Get industry-specific analysis for an assessment
  async getIndustryAnalysis(assessmentId) {
    try {
      // This endpoint doesn't exist in the controller, return placeholder data
      console.warn('Industry analysis endpoint not implemented, returning placeholder');
      return {
        analysisContent: `<p>Industry-specific analysis for assessment ${assessmentId} is being generated...</p>`,
        keyFindings: ['Analysis in progress', 'Please check back later']
      };
    } catch (error) {
      console.error('Error fetching industry analysis:', error);
      throw error;
    }
  }

  // Get industry-specific recommendations
  async getIndustryRecommendations(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/recommendations/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry recommendations:', error);
      throw error;
    }
  }

  // Get industry benchmarks
  async getIndustryBenchmarks(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/benchmarks/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry benchmarks:', error);
      throw error;
    }
  }

  // Get compliance requirements for an assessment (not industry ID)
  async getComplianceRequirements(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/compliance/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance requirements:', error);
      throw error;
    }
  }

  // Get industry intelligence report
  async getIndustryIntelligence(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/intelligence-report/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry intelligence:', error);
      throw error;
    }
  }

  // Get cross-assessment patterns for similar industries
  async getCrossAssessmentPatterns(assessmentId) {
    try {
      // This endpoint doesn't exist in the controller, return placeholder data
      console.warn('Cross-assessment patterns endpoint not implemented, returning placeholder');
      return [
        {
          patternType: 'Similar Architecture',
          description: 'Cross-assessment pattern analysis is being developed...',
          confidence: 0.8,
          assessmentCount: 3
        }
      ];
    } catch (error) {
      console.error('Error fetching cross-assessment patterns:', error);
      throw error;
    }
  }

  // Update industry classification for an assessment
  async updateIndustryClassification(assessmentId, industryId, confidence = null, reason = '') {
    try {
      const response = await apiClient.put(`${INDUSTRY_CLASSIFICATION_BASE}/classify/${assessmentId}`, {
        industryClassificationId: industryId,
        isVerified: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating industry classification:', error);
      throw error;
    }
  }

  // Get industry-specific security recommendations
  async getSecurityRecommendations(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/security/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security recommendations:', error);
      throw error;
    }
  }

  // Get industry best practices
  async getBestPractices(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/bestpractices/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching best practices:', error);
      throw error;
    }
  }
}

export default new IndustryClassificationService();