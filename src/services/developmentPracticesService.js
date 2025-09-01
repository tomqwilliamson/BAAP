// Development Practices Service - API operations for development practices data
import { API_BASE_URL } from './api';

class DevelopmentPracticesService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/DevelopmentPractices`;
  }

  // Get all development practices
  async getAll() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all development practices:', error);
      throw error;
    }
  }

  // Get development practices by ID
  async getById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching development practices ${id}:`, error);
      throw error;
    }
  }

  // Get development practices by assessment ID
  async getByAssessmentId(assessmentId) {
    try {
      const response = await fetch(`${this.baseUrl}/assessment/${assessmentId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Return null if no practices found for this assessment (this is expected)
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      // If the error was thrown from the response.ok check above, re-throw it
      if (error.message && error.message.startsWith('HTTP error!')) {
        console.error(`Error fetching development practices for assessment ${assessmentId}:`, error);
        throw error;
      }
      // For network errors (fetch failures), log and re-throw
      console.error(`Network error fetching development practices for assessment ${assessmentId}:`, error);
      throw error;
    }
  }

  // Create new development practices
  async create(practices) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(practices)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating development practices:', error);
      throw error;
    }
  }

  // Update existing development practices
  async update(id, practices) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(practices)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.status === 204 ? {} : await response.json();
    } catch (error) {
      console.error(`Error updating development practices ${id}:`, error);
      throw error;
    }
  }

  // Create or update development practices for an assessment
  async createOrUpdateForAssessment(assessmentId, practices) {
    try {
      const response = await fetch(`${this.baseUrl}/assessment/${assessmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...practices,
          assessmentId: assessmentId,
          updatedBy: 'User'
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error saving development practices for assessment ${assessmentId}:`, error);
      throw error;
    }
  }

  // Delete development practices
  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.status === 204 ? {} : await response.json();
    } catch (error) {
      console.error(`Error deleting development practices ${id}:`, error);
      throw error;
    }
  }

  // Get summary statistics
  async getSummary() {
    try {
      const response = await fetch(`${this.baseUrl}/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching development practices summary:', error);
      throw error;
    }
  }

  // Helper method to create default/empty practices object
  createDefault(assessmentId) {
    return {
      assessmentId: assessmentId,
      // Development Methodology
      primaryMethodology: '',
      sprintLength: '',
      releaseFrequency: '',
      
      // Quality Assurance
      hasDedicatedQA: false,
      manualTesting: false,
      automatedTesting: false,
      unitTesting: false,
      integrationTesting: false,
      e2ETesting: false,
      performanceTesting: false,
      codeCoverageTarget: '',
      
      // Team Structure
      totalTeamSize: 0,
      numberOfScrumTeams: 0,
      
      // Role counts
      softwareDevelopers: 0,
      seniorLeadDevelopers: 0,
      qaEngineers: 0,
      databaseEngineers: 0,
      devOpsEngineers: 0,
      businessAnalysts: 0,
      productManagers: 0,
      projectManagers: 0,
      scrumMasters: 0,
      uiuxDesigners: 0,
      architects: 0,
      
      // Development practices
      codeReviews: false,
      pairProgramming: false,
      testDrivenDevelopment: false,
      behaviorDrivenDevelopment: false,
      continuousIntegration: false,
      continuousDeployment: false,
      featureFlags: false,
      abTesting: false,
      codeDocumentationStandards: false,
      apiDocumentation: false,
      technicalDebtManagement: false,
      performanceMonitoring: false,
      
      // Communication tools
      microsoftTeams: false,
      slack: false,
      discord: false,
      email: false,
      otherCommunicationTools: false,
      
      // Project management tools
      azureDevOps: false,
      jira: false,
      gitHubProjects: false,
      trello: false,
      asana: false,
      mondayCom: false,
      otherProjectManagementTools: false,
      
      // Meeting cadence
      dailyStandups: false,
      sprintPlanning: false,
      sprintReviews: false,
      retrospectives: false,
      backlogGrooming: false,
      architectureReviews: false,
      
      // Technology
      primaryProgrammingLanguages: '',
      visualStudio: false,
      vsCode: false,
      intellijIDEA: false,
      eclipse: false,
      otherIDEs: false,
      
      createdBy: 'User'
    };
  }
}

export const developmentPracticesService = new DevelopmentPracticesService();