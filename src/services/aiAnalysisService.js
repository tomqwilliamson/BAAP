import { API_BASE_URL } from './api';

class AIAnalysisService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/Intelligence`;
    this.statusCache = null;
    this.statusCacheTime = 0;
    this.statusCacheDuration = 5 * 60 * 1000; // 5 minutes
    this.endpointRetryDelay = 60 * 1000; // 1 minute before retry
    this.storageKey = 'baap_ai_service_unavailable';
    
    // Initialize unavailable state flags
    this.endpointUnavailable = false;
    this.endpointUnavailableTime = 0;
    
    // Check localStorage for persistent unavailable state
    this.loadUnavailableState();
    
    console.log(`AI Service initialized. endpointUnavailable: ${this.endpointUnavailable}`);
  }
  
  loadUnavailableState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        const timeSinceFailure = now - data.timestamp;
        console.log(`AI Service: Checking localStorage cache. Time since last failure: ${timeSinceFailure}ms (threshold: ${this.endpointRetryDelay}ms)`);
        
        // If stored timestamp is within retry delay, mark as unavailable
        if (timeSinceFailure < this.endpointRetryDelay) {
          this.endpointUnavailable = true;
          this.endpointUnavailableTime = data.timestamp;
          this.statusCache = {
            serviceAvailable: false,
            mode: 'simulation',
            capabilities: {
              businessAnalysis: true,
              documentProcessing: false,
              realTimeAnalysis: false
            }
          };
          this.statusCacheTime = data.timestamp;
          console.log('AI Analysis service marked as unavailable from localStorage cache - NO API CALLS will be made');
        } else {
          console.log('AI Service: localStorage cache expired, will retry API calls');
          // Clear the localStorage entry since it's expired
          localStorage.removeItem(this.storageKey);
        }
      }
    } catch (error) {
      console.warn('Failed to load AI service unavailable state from localStorage:', error);
    }
  }
  
  saveUnavailableState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        timestamp: this.endpointUnavailableTime
      }));
    } catch (error) {
      console.warn('Failed to save AI service unavailable state to localStorage:', error);
    }
  }

  async analyzeBusinessContext(request) {
    try {
      // Use recommendations endpoint with assessment ID
      const assessmentId = request.assessmentId || 'default';
      const response = await fetch(`${this.baseUrl}/recommendations/${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
      const assessmentId = request.assessmentId || 'default';
      const response = await fetch(`${this.baseUrl}/recommendations/${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
      const assessmentId = request.assessmentId || 'default';
      const response = await fetch(`${this.baseUrl}/recommendations/${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
      const assessmentId = request.assessmentId || 'default';
      const response = await fetch(`${this.baseUrl}/recommendations/${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
      formData.append('File', file);

      // Use the Files controller endpoint for uploads
      const response = await fetch(`${API_BASE_URL}/Files/upload`, {
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
    const now = Date.now();
    console.log(`AI Service getStatus() called. endpointUnavailable: ${this.endpointUnavailable}, timeSinceUnavailable: ${this.endpointUnavailableTime ? now - this.endpointUnavailableTime : 'N/A'}ms`);
    
    // ALWAYS check localStorage on every call in case another instance marked it unavailable
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const timeSinceFailure = now - data.timestamp;
        if (timeSinceFailure < this.endpointRetryDelay) {
          console.warn(`AI Service: Found localStorage unavailable flag (${timeSinceFailure}ms ago), skipping API call`);
          return this.getUnavailableStatus();
        } else {
          console.log('AI Service: localStorage cache expired, removing and proceeding with API call');
          localStorage.removeItem(this.storageKey);
        }
      } catch (error) {
        console.warn('Invalid localStorage data, proceeding with API call');
      }
    }
    
    // Check if we have a recent cache hit
    if (this.statusCache && (now - this.statusCacheTime) < this.statusCacheDuration) {
      console.log('AI Service: Returning recent cache hit, no API call needed');
      return this.statusCache;
    }
    
    // Check if endpoint was recently unavailable and still in retry delay (backup check)
    if (this.endpointUnavailable && (now - this.endpointUnavailableTime) < this.endpointRetryDelay) {
      console.warn('AI Analysis endpoint recently unavailable, using cached unavailable status - NO API CALL');
      return this.getUnavailableStatus();
    }
    
    console.log('AI Service: Making API call to /status endpoint...');
    
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        // If health endpoint doesn't exist (404), mark as unavailable and cache
        if (response.status === 404) {
          console.warn('AI Analysis health endpoint not available, falling back to simulation mode');
          this.markEndpointUnavailable();
          return this.getUnavailableStatus();
        }
        throw new Error(`Health check failed: ${response.status}`);
      }

      const health = await response.json();
      
      // Transform health response to status format
      const status = {
        serviceAvailable: health.Status === 'Healthy',
        mode: health.Status === 'Healthy' ? 'production' : 'simulation',
        capabilities: {
          businessAnalysis: true,
          documentProcessing: health.Status === 'Healthy',
          realTimeAnalysis: health.Status === 'Healthy'
        }
      };
      
      // Cache successful response and reset unavailable flag
      this.statusCache = status;
      this.statusCacheTime = now;
      this.endpointUnavailable = false;
      
      return status;
    } catch (error) {
      // If network error or endpoint doesn't exist, mark as unavailable and cache
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('404') || 
          error.name === 'TypeError' ||
          error.message.includes('ERR_ABORTED')) {
        console.warn('AI Analysis service not available, falling back to simulation mode');
        this.markEndpointUnavailable();
        return this.getUnavailableStatus();
      }
      console.error('Status check error:', error);
      throw error;
    }
  }
  
  markEndpointUnavailable() {
    this.endpointUnavailable = true;
    this.endpointUnavailableTime = Date.now();
    const unavailableStatus = this.getUnavailableStatus();
    this.statusCache = unavailableStatus;
    this.statusCacheTime = Date.now();
    this.saveUnavailableState();
  }
  
  getUnavailableStatus() {
    return {
      serviceAvailable: false,
      mode: 'simulation',
      capabilities: {
        businessAnalysis: true,
        documentProcessing: false,
        realTimeAnalysis: false
      }
    };
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
  
  // Helper method to check if we should skip API calls (for debugging)
  shouldSkipAPICalls() {
    const now = Date.now();
    return this.endpointUnavailable && (now - this.endpointUnavailableTime) < this.endpointRetryDelay;
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