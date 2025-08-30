import { API_BASE_URL } from './api';

class AIAnalysisService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/AIAnalysis`;
  }

  async analyzeBusinessContext(request) {
    try {
      const response = await fetch(`${this.baseUrl}/business-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Business context analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Business context analysis error:', error);
      throw error;
    }
  }

  async analyzeArchitecture(request) {
    try {
      const response = await fetch(`${this.baseUrl}/architecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Architecture analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Architecture analysis error:', error);
      throw error;
    }
  }

  async analyzeInfrastructure(request) {
    try {
      const response = await fetch(`${this.baseUrl}/infrastructure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Infrastructure analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Infrastructure analysis error:', error);
      throw error;
    }
  }

  async analyzeDataArchitecture(request) {
    try {
      const response = await fetch(`${this.baseUrl}/data-architecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Data architecture analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Data architecture analysis error:', error);
      throw error;
    }
  }

  async analyzeDevOps(request) {
    try {
      const response = await fetch(`${this.baseUrl}/devops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`DevOps analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('DevOps analysis error:', error);
      throw error;
    }
  }

  async analyzeSecurity(request) {
    try {
      const response = await fetch(`${this.baseUrl}/security`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Security analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Security analysis error:', error);
      throw error;
    }
  }

  async analyzeCloudReadiness(request) {
    try {
      const response = await fetch(`${this.baseUrl}/cloud-readiness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Cloud readiness analysis failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Cloud readiness analysis error:', error);
      throw error;
    }
  }

  async generateRecommendations(request) {
    try {
      const response = await fetch(`${this.baseUrl}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Recommendations generation failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Recommendations generation error:', error);
      throw error;
    }
  }

  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${this.baseUrl}/upload-document`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Document upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  // Helper method to transform assessment data to infrastructure analysis request
  transformInfrastructureData(assessmentData) {
    const assets = [];

    // Transform server data
    if (assessmentData.azureMigrate?.servers) {
      assessmentData.azureMigrate.servers.forEach(server => {
        assets.push({
          name: server.name || server.hostname,
          type: server.type || 'Server',
          specifications: {
            os: server.os,
            cpu: server.cpu,
            memory: server.memory,
            storage: server.storage,
            readiness: server.readiness
          },
          performanceMetrics: {
            cpuUtilization: server.cpu || 0,
            memoryUtilization: server.memory || 0,
            storageUtilization: server.storage || 0,
            readinessScore: server.readiness || 0
          }
        });
      });
    }

    // Add network equipment if present
    if (assessmentData.networkInventory) {
      assessmentData.networkInventory.forEach(device => {
        assets.push({
          name: device.name,
          type: device.type,
          specifications: device.specifications || {},
          performanceMetrics: device.metrics || {}
        });
      });
    }

    return {
      assets,
      azureMigrateData: JSON.stringify(assessmentData.azureMigrate || {}),
      performanceMetrics: assessmentData.performanceData || [],
      uploadedDocuments: assessmentData.uploadedDocuments || []
    };
  }

  // Helper method to format AI response for display
  formatAnalysisResponse(response) {
    // The AI returns markdown-formatted text, so we can display it directly
    // You might want to add additional formatting or parsing here
    return response;
  }

  // Helper method to check if AI service is available
  async isAIAvailable() {
    try {
      const status = await this.getStatus();
      return status.serviceAvailable;
    } catch (error) {
      console.warn('AI service availability check failed:', error);
      return false;
    }
  }

  // Helper method to get AI service capabilities
  async getCapabilities() {
    try {
      const status = await this.getStatus();
      return {
        available: status.serviceAvailable,
        mode: status.mode,
        capabilities: status.capabilities
      };
    } catch (error) {
      console.warn('AI service capabilities check failed:', error);
      return {
        available: false,
        mode: 'Unavailable',
        capabilities: []
      };
    }
  }
}

// Export singleton instance
export const aiAnalysisService = new AIAnalysisService();
export default aiAnalysisService;