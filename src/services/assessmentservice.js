// src/services/assessmentService.js - API service layer
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

  async startAssessment(id) {
    const response = await apiClient.post(`/assessments/${id}/start`);
    return response.data;
  },

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

  async getApplication(id) {
    const response = await apiClient.get(`/applications/${id}`);
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

  async getRecommendations(assessmentId) {
    const response = await apiClient.get(`/recommendations/assessment/${assessmentId}`);
    return response.data;
  },

  async generateRecommendations(assessmentId) {
    const response = await apiClient.post(`/recommendations/assessment/${assessmentId}/generate`);
    return response.data;
  }
};