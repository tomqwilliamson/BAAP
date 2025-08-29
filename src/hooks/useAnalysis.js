import { useState, useCallback } from 'react';
import { useNotifications } from '../contexts/notificationcontext';
import { useAssessment } from '../contexts/assessmentcontext';

export const useAnalysis = () => {
  const [analysisStates, setAnalysisStates] = useState({});
  const { addAnalysisNotification, addSystemNotification } = useNotifications();
  const { currentAssessment } = useAssessment();

  // Start analysis for a specific module
  const startAnalysis = useCallback(async (module, customOptions = {}) => {
    const analysisId = `${module}_${Date.now()}`;
    
    // Set analysis state to running
    setAnalysisStates(prev => ({
      ...prev,
      [module]: {
        id: analysisId,
        status: 'running',
        startTime: Date.now(),
        progress: 0
      }
    }));

    // Get module-specific analysis duration and steps
    const moduleConfig = getModuleAnalysisConfig(module);
    const totalDuration = customOptions.duration || moduleConfig.duration;
    const steps = moduleConfig.steps;

    try {
      // Simulate analysis progress
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepDuration = (totalDuration * step.percentage) / 100;
        
        // Update progress
        setAnalysisStates(prev => ({
          ...prev,
          [module]: {
            ...prev[module],
            progress: step.percentage,
            currentStep: step.name
          }
        }));

        // Wait for step completion
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        // Check if analysis was cancelled
        const currentState = analysisStates[module];
        if (currentState?.status === 'cancelled') {
          return;
        }
      }

      // Analysis completed successfully
      const endTime = Date.now();
      const duration = formatDuration(endTime - analysisStates[module]?.startTime);
      
      setAnalysisStates(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          status: 'completed',
          progress: 100,
          endTime,
          duration
        }
      }));

      // Add completion notification
      addAnalysisNotification(
        module,
        currentAssessment?.name,
        duration
      );

      return {
        success: true,
        analysisId,
        duration,
        module
      };

    } catch (error) {
      // Analysis failed
      setAnalysisStates(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          status: 'failed',
          error: error.message
        }
      }));

      addSystemNotification(
        `${moduleConfig.displayName} Analysis Failed`,
        `Analysis encountered an error: ${error.message}`,
        'error'
      );

      throw error;
    }
  }, [addAnalysisNotification, addSystemNotification, currentAssessment, analysisStates]);

  // Cancel analysis
  const cancelAnalysis = useCallback((module) => {
    setAnalysisStates(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        status: 'cancelled'
      }
    }));
  }, []);

  // Get analysis state for a module
  const getAnalysisState = useCallback((module) => {
    return analysisStates[module] || { status: 'idle', progress: 0 };
  }, [analysisStates]);

  // Check if analysis is running for a module
  const isAnalysisRunning = useCallback((module) => {
    return analysisStates[module]?.status === 'running';
  }, [analysisStates]);

  // Get all running analyses
  const getRunningAnalyses = useCallback(() => {
    return Object.entries(analysisStates)
      .filter(([_, state]) => state.status === 'running')
      .map(([module, state]) => ({ module, ...state }));
  }, [analysisStates]);

  return {
    startAnalysis,
    cancelAnalysis,
    getAnalysisState,
    isAnalysisRunning,
    getRunningAnalyses,
    analysisStates
  };
};

// Module-specific analysis configurations
const getModuleAnalysisConfig = (module) => {
  const configs = {
    'infrastructure': {
      displayName: 'Infrastructure & Compute',
      duration: 8000, // 8 seconds for demo
      steps: [
        { name: 'Discovering servers and resources', percentage: 20 },
        { name: 'Analyzing performance metrics', percentage: 40 },
        { name: 'Evaluating cloud readiness', percentage: 70 },
        { name: 'Calculating cost estimates', percentage: 90 },
        { name: 'Generating recommendations', percentage: 100 }
      ]
    },
    'security': {
      displayName: 'Security Assessment',
      duration: 12000, // 12 seconds for demo
      steps: [
        { name: 'Scanning for vulnerabilities', percentage: 25 },
        { name: 'Analyzing security configurations', percentage: 50 },
        { name: 'Evaluating compliance status', percentage: 75 },
        { name: 'Generating security report', percentage: 100 }
      ]
    },
    'devops': {
      displayName: 'DevOps & Development',
      duration: 6000, // 6 seconds for demo
      steps: [
        { name: 'Analyzing build pipelines', percentage: 30 },
        { name: 'Evaluating deployment processes', percentage: 60 },
        { name: 'Assessing automation maturity', percentage: 85 },
        { name: 'Generating improvement plan', percentage: 100 }
      ]
    },
    'data-architecture': {
      displayName: 'Data Architecture',
      duration: 10000, // 10 seconds for demo
      steps: [
        { name: 'Discovering database instances', percentage: 20 },
        { name: 'Analyzing data schemas', percentage: 45 },
        { name: 'Evaluating data governance', percentage: 70 },
        { name: 'Assessing migration readiness', percentage: 90 },
        { name: 'Finalizing recommendations', percentage: 100 }
      ]
    },
    'cloud-readiness': {
      displayName: 'Cloud Readiness',
      duration: 15000, // 15 seconds for demo
      steps: [
        { name: 'Collecting cross-domain data', percentage: 15 },
        { name: 'Analyzing infrastructure readiness', percentage: 30 },
        { name: 'Evaluating application compatibility', percentage: 50 },
        { name: 'Assessing security posture', percentage: 70 },
        { name: 'Calculating readiness scores', percentage: 85 },
        { name: 'Generating strategic roadmap', percentage: 100 }
      ]
    },
    'architecture': {
      displayName: 'Architecture Review',
      duration: 9000, // 9 seconds for demo
      steps: [
        { name: 'Analyzing application portfolio', percentage: 25 },
        { name: 'Evaluating architectural patterns', percentage: 50 },
        { name: 'Assessing modernization opportunities', percentage: 75 },
        { name: 'Creating transformation plan', percentage: 100 }
      ]
    },
    'business-context': {
      displayName: 'Business Context',
      duration: 5000, // 5 seconds for demo
      steps: [
        { name: 'Processing business requirements', percentage: 40 },
        { name: 'Analyzing stakeholder priorities', percentage: 70 },
        { name: 'Aligning technical recommendations', percentage: 100 }
      ]
    },
    'recommendations': {
      displayName: 'AI Recommendations',
      duration: 20000, // 20 seconds for demo - longest as it's the most complex
      steps: [
        { name: 'Aggregating assessment data', percentage: 15 },
        { name: 'Running AI analysis models', percentage: 35 },
        { name: 'Generating strategic recommendations', percentage: 55 },
        { name: 'Creating tactical action items', percentage: 75 },
        { name: 'Calculating ROI projections', percentage: 90 },
        { name: 'Finalizing comprehensive report', percentage: 100 }
      ]
    }
  };

  return configs[module] || {
    displayName: module,
    duration: 5000,
    steps: [
      { name: 'Initializing analysis', percentage: 50 },
      { name: 'Processing results', percentage: 100 }
    ]
  };
};

// Helper function to format duration
const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
};