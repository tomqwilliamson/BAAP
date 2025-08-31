import { API_BASE_URL } from './api';

class BusinessContextService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/BusinessContext`;
  }

  // Get all business context data for an assessment
  async getBusinessContext(assessmentId) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get business context: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting business context:', error);
      throw error;
    }
  }

  // Budget Allocation Methods
  async getBudgetAllocation(assessmentId) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}/budget`);
      
      if (!response.ok) {
        throw new Error(`Failed to get budget allocation: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting budget allocation:', error);
      throw error;
    }
  }

  async saveBudgetAllocation(assessmentId, budgetData) {
    try {
      // Try PUT first (update), then POST (create) if it fails
      let response = await fetch(`${this.baseUrl}/${assessmentId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentCost: budgetData.assessment || budgetData.assessmentCost || 0,
          implementation: budgetData.implementation || 0,
          maintenance: budgetData.maintenance || 0,
          training: budgetData.training || 0,
          contingency: budgetData.contingency || 0,
          notes: budgetData.notes || ''
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save budget allocation: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving budget allocation:', error);
      throw error;
    }
  }

  // Project Timeline Methods
  async getProjectTimeline(assessmentId) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}/timeline`);
      
      if (!response.ok) {
        throw new Error(`Failed to get project timeline: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting project timeline:', error);
      throw error;
    }
  }

  async createTimelineItem(assessmentId, timelineData) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}/timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timelineData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create timeline item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating timeline item:', error);
      throw error;
    }
  }

  async updateTimelineItem(timelineId, timelineData) {
    try {
      const response = await fetch(`${this.baseUrl}/timeline/${timelineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timelineData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update timeline item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating timeline item:', error);
      throw error;
    }
  }

  async deleteTimelineItem(timelineId) {
    try {
      const response = await fetch(`${this.baseUrl}/timeline/${timelineId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete timeline item: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      throw error;
    }
  }

  // Business Risk Methods
  async getBusinessRisks(assessmentId) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}/risks`);
      
      if (!response.ok) {
        throw new Error(`Failed to get business risks: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting business risks:', error);
      throw error;
    }
  }

  async createBusinessRisk(assessmentId, riskData) {
    try {
      const response = await fetch(`${this.baseUrl}/${assessmentId}/risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create business risk: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating business risk:', error);
      throw error;
    }
  }

  async updateBusinessRisk(riskId, riskData) {
    try {
      const response = await fetch(`${this.baseUrl}/risks/${riskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update business risk: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating business risk:', error);
      throw error;
    }
  }

  async deleteBusinessRisk(riskId) {
    try {
      const response = await fetch(`${this.baseUrl}/risks/${riskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete business risk: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting business risk:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const businessContextService = new BusinessContextService();
export default businessContextService;