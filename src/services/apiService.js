// src/services/apiService.js - Direct API service (Database Mode Only)
import { assessmentService } from './assessmentservice';
import { configurationService } from './configurationService';

console.log('🔧 FORCED DATABASE MODE - No mock data fallbacks');

// Service wrapper that handles API calls directly (no mock fallback)
export const apiService = {
  // Dashboard services
  async getDashboardOverview() {
    const data = await assessmentService.getDashboardOverview();
    console.log('✅ Dashboard data loaded from API:', data);
    return data;
  },

  async getPortfolioSummary(assessmentId = null) {
    const data = await assessmentService.getPortfolioSummary(assessmentId);
    console.log('✅ Portfolio data loaded from API:', data);
    return data;
  },

  // Assessment services
  async getAssessments() {
    const data = await assessmentService.getAssessments();
    console.log('✅ Assessments loaded from API:', data);
    return data;
  },

  async getAssessment(id) {
    return await assessmentService.getAssessment(id);
  },

  async createAssessment(data) {
    const newAssessment = await assessmentService.createAssessment(data);
    console.log('✅ Assessment created via API:', newAssessment);
    return newAssessment;
  },

  async startAssessment(id) {
    const updatedAssessment = await assessmentService.startAssessment(id);
    console.log('✅ Assessment started via API:', updatedAssessment);
    return updatedAssessment;
  },

  async loadAssessment(id) {
    const assessment = await assessmentService.getAssessment(id);
    console.log('✅ Assessment loaded via API:', assessment?.name);
    return assessment;
  },

  async clearCurrentAssessment() {
    // This is a client-side operation, no API call needed
    return null;
  },

  // Application services
  async getApplications(params = {}) {
    return await assessmentService.getApplications(params);
  },

  async getApplication(id) {
    return await assessmentService.getApplication(id);
  },

  async cloneApplication(id, data) {
    return await assessmentService.cloneApplication(id, data);
  },

  async deleteApplication(id) {
    return await assessmentService.deleteApplication(id);
  },

  // Recommendations services
  async getRecommendations(assessmentId) {
    return await assessmentService.getRecommendations(assessmentId);
  },

  // Security services
  async getSecurityOverview(assessmentId) {
    return await assessmentService.getSecurityOverview(assessmentId);
  },

  // Cloud Readiness services
  async getCloudReadiness(assessmentId) {
    return await assessmentService.getCloudReadiness(assessmentId);
  },

  // Direct passthrough to assessmentService methods
  updateAssessment: assessmentService.updateAssessment,
  updateAiAnalysisTimestamp: assessmentService.updateAiAnalysisTimestamp,
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
  updateProfile: assessmentService.updateProfile,

  // Configuration services
  async getConfiguration() {
    return await configurationService.getClientConfiguration();
  },

  async getFeatureFlags() {
    return await configurationService.getFeatureFlags();
  },

  async getHealthStatus() {
    return await configurationService.getHealthStatus();
  },

  async isFeatureEnabled(featureName) {
    return await configurationService.isFeatureEnabled(featureName);
  },

  async refreshConfiguration() {
    return await configurationService.refreshConfiguration();
  },

  // AI Analysis Results services
  getAIAnalysisResults: assessmentService.getAIAnalysisResults,
  saveAIAnalysisResults: assessmentService.saveAIAnalysisResults,
  getAllAIAnalysisResults: assessmentService.getAllAIAnalysisResults,
  deleteAIAnalysisResults: assessmentService.deleteAIAnalysisResults
};

export default apiService;