// src/services/assessmentService.js - API service layer
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

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
    // Add development bypass header for mock auth
    config.headers['X-Auth-Bypass'] = 'development';
  }
  return config;
});

// Handle API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const assessmentService = {
  // Assessment endpoints
  async getAssessments() {
    const response = await apiClient.get('/assessments');
    return response.data;
  },

  async getAssessment(id) {
    const response = await apiClient.get(`/assessments/${id}`);
    return response.data;
  },

  async createAssessment(data) {
    const response = await apiClient.post('/assessments', data);
    return response.data;
  },

  async updateAssessment(id, data) {
    const response = await apiClient.put(`/assessments/${id}`, data);
    return response.data;
  },

  async updateAiAnalysisTimestamp(assessmentId, module, timestamp = null) {
    const response = await apiClient.post(`/assessments/${assessmentId}/ai-analysis-timestamp`, {
      module,
      timestamp: timestamp || new Date().toISOString()
    });
    return response.data;
  },

  async deleteAssessment(id) {
    const response = await apiClient.delete(`/assessments/${id}`);
    return response.data;
  },

  async startAssessment(id) {
    const response = await apiClient.post(`/assessments/${id}/start`);
    return response.data;
  },

  async completeAssessment(id) {
    const response = await apiClient.post(`/assessments/${id}/complete`);
    return response.data;
  },

  // Dashboard endpoints
  async getDashboardOverview() {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },

  async getPortfolioSummary(assessmentId = null) {
    const url = assessmentId 
      ? `/dashboard/portfolio?assessmentId=${assessmentId}`
      : '/dashboard/portfolio';
    const response = await apiClient.get(url);
    return response.data;
  },

  // Application endpoints
  async getApplications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/applications?${queryParams}` : '/applications';
    const response = await apiClient.get(url);
    // API returns {data: [...], pagination: {...}}, we need just the data array
    return response.data.data || response.data;
  },

  async getApplication(id) {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  async createApplication(data) {
    const response = await apiClient.post('/applications', data);
    return response.data;
  },

  async updateApplication(id, data) {
    const response = await apiClient.put(`/applications/${id}`, data);
    return response.data;
  },

  async deleteApplication(id) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },

  async analyzeApplication(id) {
    const response = await apiClient.post(`/applications/${id}/analyze`);
    return response.data;
  },

  async getSecurityFindings(applicationId) {
    const response = await apiClient.get(`/applications/${applicationId}/security-findings`);
    return response.data;
  },

  async getCodeMetrics(applicationId) {
    const response = await apiClient.get(`/applications/${applicationId}/code-metrics`);
    return response.data;
  },

  // Recommendations endpoints
  async getRecommendations(assessmentId) {
    const response = await apiClient.get(`/recommendations/assessment/${assessmentId}`);
    return response.data;
  },

  async generateRecommendations(assessmentId) {
    const response = await apiClient.post(`/recommendations/assessment/${assessmentId}/generate`);
    return response.data;
  },

  async updateRecommendation(id, data) {
    const response = await apiClient.put(`/recommendations/${id}`, data);
    return response.data;
  },

  async acceptRecommendation(id) {
    const response = await apiClient.post(`/recommendations/${id}/accept`);
    return response.data;
  },

  async rejectRecommendation(id) {
    const response = await apiClient.post(`/recommendations/${id}/reject`);
    return response.data;
  },

  // Security endpoints
  async getSecurityOverview(assessmentId) {
    const response = await apiClient.get(`/security/assessment/${assessmentId}/overview`);
    return response.data;
  },

  async getSecurityFindingsByAssessment(assessmentId) {
    const response = await apiClient.get(`/security/assessment/${assessmentId}/findings`);
    return response.data;
  },

  async updateSecurityFinding(id, data) {
    const response = await apiClient.put(`/security/findings/${id}`, data);
    return response.data;
  },

  // Cloud Readiness endpoints
  async getCloudReadiness(assessmentId) {
    const response = await apiClient.get(`/assessments/${assessmentId}/cloud-readiness`);
    return response.data;
  },

  async updateCloudReadiness(assessmentId, data) {
    const response = await apiClient.put(`/assessments/${assessmentId}/cloud-readiness`, data);
    return response.data;
  },

  async analyzeCloudReadiness(assessmentId) {
    const response = await apiClient.post(`/assessments/${assessmentId}/cloud-readiness/analyze`);
    return response.data;
  },

  async getCloudReadinessOverview(assessmentId) {
    const response = await apiClient.get(`/cloud-readiness/assessment/${assessmentId}/overview`);
    return response.data;
  },

  // Business Drivers endpoints
  async getBusinessDrivers(assessmentId) {
    const response = await apiClient.get(`/business-drivers/assessment/${assessmentId}`);
    return response.data;
  },

  async updateBusinessDrivers(assessmentId, data) {
    const response = await apiClient.put(`/business-drivers/assessment/${assessmentId}`, data);
    return response.data;
  },

  // Stakeholders endpoints
  async getStakeholders(assessmentId) {
    const response = await apiClient.get(`/stakeholders/assessment/${assessmentId}`);
    return response.data;
  },

  async addStakeholder(assessmentId, data) {
    const response = await apiClient.post(`/stakeholders/assessment/${assessmentId}`, data);
    return response.data;
  },

  async updateStakeholder(id, data) {
    const response = await apiClient.put(`/stakeholders/${id}`, data);
    return response.data;
  },

  async deleteStakeholder(id) {
    const response = await apiClient.delete(`/stakeholders/${id}`);
    return response.data;
  },

  // Files endpoints
  async uploadFile(file, assessmentId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assessmentId', assessmentId);
    
    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFiles(assessmentId) {
    const response = await apiClient.get(`/files/assessment/${assessmentId}`);
    return response.data;
  },

  async deleteFile(id) {
    const response = await apiClient.delete(`/files/${id}`);
    return response.data;
  },

  async downloadFile(id) {
    const response = await apiClient.get(`/files/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reports endpoints
  async generateReport(assessmentId, reportType = 'comprehensive') {
    const response = await apiClient.post(`/reports/assessment/${assessmentId}/generate`, {
      reportType
    });
    return response.data;
  },

  async getReports(assessmentId) {
    const response = await apiClient.get(`/reports/assessment/${assessmentId}`);
    return response.data;
  },

  async downloadReport(reportId) {
    const response = await apiClient.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Search endpoints
  async search(query, filters = {}) {
    const params = new URLSearchParams({ query, ...filters }).toString();
    const response = await apiClient.get(`/search?${params}`);
    return response.data;
  },

  // Auth endpoints
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  // Generic assessment data endpoint
  async getAssessmentData(assessmentId, domain = 'all') {
    const response = await apiClient.get(`/assessments/${assessmentId}/data?domain=${domain}`);
    return response.data;
  },

  // Generic HTTP methods for configuration service
  async get(url) {
    const response = await apiClient.get(url);
    return response;
  },

  async post(url, data) {
    const response = await apiClient.post(url, data);
    return response;
  },

  async put(url, data) {
    const response = await apiClient.put(url, data);
    return response;
  },

  async delete(url) {
    const response = await apiClient.delete(url);
    return response;
  }
};