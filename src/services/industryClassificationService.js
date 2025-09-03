// Industry Classification Service - Phase 4
import { apiService } from './apiService';

const INDUSTRY_CLASSIFICATION_BASE = '/api/industryclassification';

class IndustryClassificationService {
  // Get all industry classifications
  async getIndustries() {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/industries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }

  // Classify an assessment to determine its industry
  async classifyAssessment(assessmentId) {
    try {
      const response = await apiService.post(`${INDUSTRY_CLASSIFICATION_BASE}/classify/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error classifying assessment:', error);
      throw error;
    }
  }

  // Get industry-specific analysis for an assessment
  async getIndustryAnalysis(assessmentId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/analysis/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry analysis:', error);
      throw error;
    }
  }

  // Get industry-specific recommendations
  async getIndustryRecommendations(assessmentId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/recommendations/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry recommendations:', error);
      throw error;
    }
  }

  // Get industry benchmarks
  async getIndustryBenchmarks(industryId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/benchmarks/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry benchmarks:', error);
      throw error;
    }
  }

  // Get compliance requirements for an industry
  async getComplianceRequirements(industryId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/compliance/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance requirements:', error);
      throw error;
    }
  }

  // Get industry intelligence report
  async getIndustryIntelligence(assessmentId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/intelligence/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry intelligence:', error);
      throw error;
    }
  }

  // Get cross-assessment patterns for similar industries
  async getCrossAssessmentPatterns(assessmentId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/patterns/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cross-assessment patterns:', error);
      throw error;
    }
  }

  // Update industry classification for an assessment
  async updateIndustryClassification(assessmentId, industryId, confidence = null, reason = '') {
    try {
      const response = await apiService.put(`${INDUSTRY_CLASSIFICATION_BASE}/update/${assessmentId}`, {
        industryClassificationId: industryId,
        classificationConfidence: confidence,
        classificationReason: reason,
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
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/security/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security recommendations:', error);
      throw error;
    }
  }

  // Get industry best practices
  async getBestPractices(industryId) {
    try {
      const response = await apiService.get(`${INDUSTRY_CLASSIFICATION_BASE}/bestpractices/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching best practices:', error);
      throw error;
    }
  }
}

export default new IndustryClassificationService();