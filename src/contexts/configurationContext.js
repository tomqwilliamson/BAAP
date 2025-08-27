// src/contexts/configurationContext.js - React context for configuration management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { configurationService } from '../services/configurationService';

// Configuration Context
const ConfigurationContext = createContext();

// Configuration actions
const CONFIG_ACTIONS = {
  LOADING: 'LOADING',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
  REFRESH: 'REFRESH',
  UPDATE_FEATURE: 'UPDATE_FEATURE'
};

// Configuration reducer
const configurationReducer = (state, action) => {
  switch (action.type) {
    case CONFIG_ACTIONS.LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CONFIG_ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        config: action.payload.config,
        features: action.payload.features,
        lastUpdated: new Date()
      };

    case CONFIG_ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CONFIG_ACTIONS.REFRESH:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CONFIG_ACTIONS.UPDATE_FEATURE:
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload.feature]: action.payload.value
        }
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  config: null,
  features: null,
  loading: true,
  error: null,
  lastUpdated: null
};

// Configuration Provider Component
export const ConfigurationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(configurationReducer, initialState);

  // Load initial configuration
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    dispatch({ type: CONFIG_ACTIONS.LOADING });
    
    try {
      const [config, features] = await Promise.all([
        configurationService.getClientConfiguration(),
        configurationService.getFeatureFlags()
      ]);

      dispatch({
        type: CONFIG_ACTIONS.LOAD_SUCCESS,
        payload: { config, features }
      });
    } catch (error) {
      dispatch({
        type: CONFIG_ACTIONS.LOAD_ERROR,
        payload: error.message
      });
    }
  };

  const refreshConfiguration = async () => {
    dispatch({ type: CONFIG_ACTIONS.REFRESH });
    await loadConfiguration();
  };

  const isFeatureEnabled = (featureName) => {
    return state.features?.[featureName] || false;
  };

  const getConfigValue = (path, defaultValue = null) => {
    if (!state.config) return defaultValue;
    
    const keys = path.split('.');
    let value = state.config;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        return defaultValue;
      }
    }
    
    return value;
  };

  const updateFeature = (feature, value) => {
    dispatch({
      type: CONFIG_ACTIONS.UPDATE_FEATURE,
      payload: { feature, value }
    });
  };

  const contextValue = {
    ...state,
    loadConfiguration,
    refreshConfiguration,
    isFeatureEnabled,
    getConfigValue,
    updateFeature
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};

// Custom hook to use configuration
export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  
  return context;
};

// Higher-order component to provide configuration
export const withConfiguration = (Component) => {
  return function ConfigurationWrappedComponent(props) {
    return (
      <ConfigurationProvider>
        <Component {...props} />
      </ConfigurationProvider>
    );
  };
};

// Hook for feature flags
export const useFeatureFlag = (featureName, defaultValue = false) => {
  const { isFeatureEnabled, loading } = useConfiguration();
  
  if (loading) {
    return defaultValue;
  }
  
  return isFeatureEnabled(featureName);
};

// Hook for configuration values
export const useConfigValue = (path, defaultValue = null) => {
  const { getConfigValue, loading } = useConfiguration();
  
  if (loading) {
    return defaultValue;
  }
  
  return getConfigValue(path, defaultValue);
};

// Component to conditionally render based on feature flags
export const FeatureFlag = ({ feature, children, fallback = null }) => {
  const isEnabled = useFeatureFlag(feature);
  
  return isEnabled ? children : fallback;
};

// Component to show configuration debug info (dev only)
export const ConfigurationDebug = () => {
  const { config, features, loading, error, lastUpdated } = useConfiguration();
  const isDebugMode = useConfigValue('UI.EnableDebugMode', false);
  
  if (!isDebugMode || process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Configuration Debug</h4>
      <p><strong>Loading:</strong> {loading.toString()}</p>
      <p><strong>Error:</strong> {error || 'None'}</p>
      <p><strong>Last Updated:</strong> {lastUpdated?.toLocaleTimeString() || 'Never'}</p>
      <p><strong>Environment:</strong> {config?.Environment || 'Unknown'}</p>
      <p><strong>Use API:</strong> {features?.UseApi?.toString() || 'Unknown'}</p>
      <details>
        <summary>Full Config</summary>
        <pre style={{ fontSize: '10px', maxHeight: '200px', overflow: 'auto' }}>
          {JSON.stringify({ config, features }, null, 2)}
        </pre>
      </details>
    </div>
  );
};