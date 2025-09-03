import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ArchitectureService {
  constructor() {
    this.baseUrl = '/architecture';
    this.useDatabaseCrud = true; // Feature flag for database operations
  }

  // Get architecture review for an assessment
  async getArchitectureReview(assessmentId) {
    if (!this.useDatabaseCrud) {
      // Return null to use mock data fallback
      return null;
    }

    try {
      const response = await apiClient.get(`${this.baseUrl}/assessment/${assessmentId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // No architecture review found - this is expected for new assessments
        console.log(`No architecture review found for assessment ${assessmentId} - will use mock data`);
        return null;
      }
      console.error('Error fetching architecture review:', error);
      throw error;
    }
  }

  // Create architecture review for an assessment
  async createArchitectureReview(assessmentId, architectureData) {
    if (!this.useDatabaseCrud) {
      console.log('Database CRUD disabled - architecture data not saved');
      return architectureData;
    }

    try {
      const dto = this.mapToDto(architectureData, assessmentId);
      const response = await apiClient.post(`${this.baseUrl}/assessment/${assessmentId}`, dto);
      return this.mapFromDto(response.data);
    } catch (error) {
      console.error('Error creating architecture review:', error);
      throw error;
    }
  }

  // Update architecture review for an assessment
  async updateArchitectureReview(assessmentId, architectureData) {
    if (!this.useDatabaseCrud) {
      console.log('Database CRUD disabled - architecture data not saved');
      return architectureData;
    }

    try {
      const dto = this.mapToDto(architectureData, assessmentId);
      await apiClient.put(`${this.baseUrl}/assessment/${assessmentId}`, dto);
      return architectureData;
    } catch (error) {
      if (error.response?.status === 404) {
        // Architecture review doesn't exist yet, create it
        return await this.createArchitectureReview(assessmentId, architectureData);
      }
      console.error('Error updating architecture review:', error);
      throw error;
    }
  }

  // Delete architecture review for an assessment
  async deleteArchitectureReview(assessmentId) {
    if (!this.useDatabaseCrud) {
      console.log('Database CRUD disabled - architecture data not deleted');
      return;
    }

    try {
      await apiClient.delete(`${this.baseUrl}/assessment/${assessmentId}`);
    } catch (error) {
      console.error('Error deleting architecture review:', error);
      throw error;
    }
  }

  // Save or update architecture review (convenience method)
  async saveArchitectureReview(assessmentId, architectureData) {
    if (!this.useDatabaseCrud) {
      console.log('Database CRUD disabled - architecture data not saved');
      return architectureData;
    }

    try {
      // Try to update first, if not found then create
      return await this.updateArchitectureReview(assessmentId, architectureData);
    } catch (error) {
      if (error.response?.status === 404) {
        return await this.createArchitectureReview(assessmentId, architectureData);
      }
      throw error;
    }
  }

  // Map frontend data structure to API DTO
  mapToDto(architectureData, assessmentId) {
    return {
      id: architectureData.id || 0,
      assessmentId: assessmentId,
      healthMetrics: {
        maintainability: architectureData.healthMetrics?.maintainability || 0,
        complexity: architectureData.healthMetrics?.complexity || 0,
        coupling: architectureData.healthMetrics?.coupling || 0,
        cohesion: architectureData.healthMetrics?.cohesion || 0,
        testCoverage: architectureData.healthMetrics?.testCoverage || 0,
        technicalDebt: architectureData.healthMetrics?.technicalDebt || 0
      },
      codeQuality: {
        codeSmells: architectureData.codeQuality?.codeSmells || 0,
        duplicatedLines: architectureData.codeQuality?.duplicatedLines || 0,
        vulnerabilities: architectureData.codeQuality?.vulnerabilities || 0,
        bugs: architectureData.codeQuality?.bugs || 0,
        securityHotspots: architectureData.codeQuality?.securityHotspots || 0
      },
      repositoryInfo: {
        url: architectureData.repositoryInfo?.url || '',
        type: architectureData.repositoryInfo?.type || 'github',
        status: architectureData.repositoryInfo?.status || 'disconnected',
        lastCommitHash: architectureData.repositoryInfo?.lastCommitHash || '',
        lastCommitDate: architectureData.repositoryInfo?.lastCommitDate || null
      },
      analysis: {
        architectureAnalysis: architectureData.analysis?.architectureAnalysis || '',
        healthAnalysis: architectureData.analysis?.healthAnalysis || '',
        patternsAnalysis: architectureData.analysis?.patternsAnalysis || '',
        technologyAnalysis: architectureData.analysis?.technologyAnalysis || '',
        maintainabilityAnalysis: architectureData.analysis?.maintainabilityAnalysis || '',
        recommendationsAnalysis: architectureData.analysis?.recommendationsAnalysis || ''
      },
      architecturePatterns: (architectureData.architecturePatterns || []).map(pattern => ({
        id: pattern.id || 0,
        patternName: pattern.pattern || pattern.patternName || '',
        usage: pattern.usage || 0,
        quality: pattern.quality || 'Unknown',
        recommendation: pattern.recommendation || '',
        maturity: pattern.maturity || 'Unknown'
      })),
      technologyStack: (architectureData.technologyStack || []).map(tech => ({
        id: tech.id || 0,
        category: tech.category || '',
        technology: tech.technology || '',
        version: tech.version || '',
        status: tech.status || 'Unknown',
        risk: tech.risk || 'Unknown',
        recommendation: tech.recommendation || ''
      })),
      codebaseStats: (architectureData.codebaseStats?.languages || []).map(lang => ({
        id: lang.id || 0,
        language: lang.name || lang.language || '',
        linesOfCode: lang.lines || lang.linesOfCode || 0,
        percentage: lang.percentage || 0,
        fileCount: lang.files || lang.fileCount || 0
      }))
    };
  }

  // Map API DTO to frontend data structure
  mapFromDto(dto) {
    return {
      id: dto.id,
      repositoryInfo: {
        url: dto.repositoryInfo?.url || '',
        type: dto.repositoryInfo?.type || 'github',
        status: dto.repositoryInfo?.status || 'disconnected',
        lastCommitHash: dto.repositoryInfo?.lastCommitHash || '',
        lastCommitDate: dto.repositoryInfo?.lastCommitDate || null,
        branches: [],
        commits: 0,
        contributors: 0,
        lastCommit: null
      },
      healthMetrics: {
        maintainability: dto.healthMetrics?.maintainability || 0,
        complexity: dto.healthMetrics?.complexity || 0,
        coupling: dto.healthMetrics?.coupling || 0,
        cohesion: dto.healthMetrics?.cohesion || 0,
        testCoverage: dto.healthMetrics?.testCoverage || 0,
        technicalDebt: dto.healthMetrics?.technicalDebt || 0
      },
      codeQuality: {
        codeSmells: dto.codeQuality?.codeSmells || 0,
        duplicatedLines: dto.codeQuality?.duplicatedLines || 0,
        vulnerabilities: dto.codeQuality?.vulnerabilities || 0,
        bugs: dto.codeQuality?.bugs || 0,
        securityHotspots: dto.codeQuality?.securityHotspots || 0
      },
      architecturePatterns: (dto.architecturePatterns || []).map(pattern => ({
        pattern: pattern.patternName,
        usage: pattern.usage,
        quality: pattern.quality,
        recommendation: pattern.recommendation,
        maturity: pattern.maturity
      })),
      technologyStack: dto.technologyStack || [],
      codebaseStats: {
        languages: (dto.codebaseStats || []).map(stats => ({
          name: stats.language,
          lines: stats.linesOfCode,
          percentage: stats.percentage,
          files: stats.fileCount
        })),
        linesOfCode: (dto.codebaseStats || []).reduce((sum, stats) => sum + stats.linesOfCode, 0),
        totalFiles: (dto.codebaseStats || []).reduce((sum, stats) => sum + stats.fileCount, 0),
        totalLines: (dto.codebaseStats || []).reduce((sum, stats) => sum + stats.linesOfCode, 0),
        frameworks: [], // Will be populated from mock data if needed
        lastCommit: null
      },
      applications: [], // Will be populated from mock data
      dependencies: [], // Will be populated from mock data
      analysis: {
        architectureAnalysis: dto.analysis?.architectureAnalysis || '',
        healthAnalysis: dto.analysis?.healthAnalysis || '',
        patternsAnalysis: dto.analysis?.patternsAnalysis || '',
        technologyAnalysis: dto.analysis?.technologyAnalysis || '',
        maintainabilityAnalysis: dto.analysis?.maintainabilityAnalysis || '',
        recommendationsAnalysis: dto.analysis?.recommendationsAnalysis || ''
      },
      createdDate: dto.createdDate,
      lastUpdatedDate: dto.lastUpdatedDate
    };
  }

  // Enable or disable database CRUD operations
  setDatabaseCrudEnabled(enabled) {
    this.useDatabaseCrud = enabled;
    console.log(`Architecture database CRUD operations ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Check if database CRUD is enabled
  isDatabaseCrudEnabled() {
    return this.useDatabaseCrud;
  }
}

export const architectureService = new ArchitectureService();