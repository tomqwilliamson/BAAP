// src/services/configurationService.js - Service for managing app configuration
import { assessmentService } from './assessmentservice';

class ConfigurationService {
  constructor() {
    this.config = null;
    this.features = null;
    this.isLoading = false;
    this.lastFetchTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Get client configuration from the API
   * @returns {Promise<Object>} Configuration object
   */
  async getClientConfiguration() {
    // Return cached config if still valid
    if (this.config && this.lastFetchTime && 
        (Date.now() - this.lastFetchTime) < this.cacheTimeout) {
      return this.config;
    }

    if (this.isLoading) {
      // Wait for ongoing request
      await this.waitForLoading();
      return this.config;
    }

    this.isLoading = true;

    try {
      const response = await assessmentService.get('/api/configuration/client');
      this.config = response.data;
      this.lastFetchTime = Date.now();
      console.log('✅ Configuration loaded from API:', this.config);
      return this.config;
    } catch (error) {
      console.warn('⚠️ Failed to load configuration from API, using defaults:', error.message);
      
      // Fallback configuration
      this.config = {
        Environment: 'Development',
        ApiBaseUrl: window.location.origin.replace('3000', '5000'), // Assume API on port 5000
        WebAppUrl: window.location.origin,
        ApplicationInsights: {
          InstrumentationKey: ''
        },
        Features: {
          UseApi: process.env.REACT_APP_USE_API === 'true',
          EnableAnalytics: true,
          EnableChatAssistant: false
        },
        UI: {
          Theme: 'light',
          DefaultPageSize: 25,
          EnableDebugMode: false
        }
      };
      
      this.lastFetchTime = Date.now();
      return this.config;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get feature flags from the API
   * @returns {Promise<Object>} Feature flags object
   */
  async getFeatureFlags() {
    try {
      const response = await assessmentService.get('/api/configuration/features');
      this.features = response.data;
      console.log('✅ Feature flags loaded from API:', this.features);
      return this.features;
    } catch (error) {
      console.warn('⚠️ Failed to load feature flags from API, using defaults:', error.message);
      
      // Fallback feature flags
      this.features = {
        UseApi: process.env.REACT_APP_USE_API === 'true',
        EnableAnalytics: true,
        EnableChatAssistant: false,
        EnableAdvancedReporting: false,
        EnableCloudRecommendations: true,
        EnableSecurityScanning: true
      };
      
      return this.features;
    }
  }

  /**
   * Check if a feature is enabled
   * @param {string} featureName - Name of the feature
   * @returns {Promise<boolean>} Whether the feature is enabled
   */
  async isFeatureEnabled(featureName) {
    if (!this.features) {
      await this.getFeatureFlags();
    }
    return this.features[featureName] || false;
  }

  /**
   * Get a configuration value
   * @param {string} path - Configuration path (e.g., 'UI.Theme', 'Features.UseApi')
   * @returns {Promise<any>} Configuration value
   */
  async getConfigValue(path) {
    if (!this.config) {
      await this.getClientConfiguration();
    }

    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        break;
      }
    }
    
    return value;
  }

  /**
   * Get application health status
   * @returns {Promise<Object>} Health status object
   */
  async getHealthStatus() {
    try {
      const response = await assessmentService.get('/api/configuration/health');
      console.log('✅ Health status loaded from API:', response.data);
      return response.data;
    } catch (error) {
      console.warn('⚠️ Failed to load health status from API:', error.message);
      return {
        Status: 'Unknown',
        Timestamp: new Date().toISOString(),
        Version: '1.0.0',
        Environment: 'Development',
        Database: { Connected: false, Name: '' },
        ExternalServices: {
          AppConfiguration: false,
          KeyVault: false,
          ApplicationInsights: false
        }
      };
    }
  }

  /**
   * Refresh configuration cache
   * @returns {Promise<Object>} Updated configuration
   */
  async refreshConfiguration() {
    this.config = null;
    this.features = null;
    this.lastFetchTime = null;
    return await this.getClientConfiguration();
  }

  /**
   * Wait for ongoing loading to complete
   * @returns {Promise<void>}
   */
  async waitForLoading() {
    while (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get environment-specific settings
   * @returns {Promise<Object>} Environment settings
   */
  async getEnvironmentSettings() {
    const config = await this.getClientConfiguration();
    return {
      isDevelopment: config.Environment === 'Development',
      isStaging: config.Environment === 'staging',
      isProduction: config.Environment === 'prod',
      debugMode: config.UI?.EnableDebugMode === 'true' || config.UI?.EnableDebugMode === true,
      apiBaseUrl: config.ApiBaseUrl,
      webAppUrl: config.WebAppUrl
    };
  }
}

// Export singleton instance
export const configurationService = new ConfigurationService();

// Export class for testing
export { ConfigurationService };

// Note: React hooks are now provided in configurationContext.js
// This service focuses on the core configuration logic