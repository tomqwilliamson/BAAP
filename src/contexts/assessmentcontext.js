// src/contexts/AssessmentContext.js - Global state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AssessmentContext = createContext();

const initialState = {
  assessments: [],
  currentAssessment: null,
  applications: [],
  recommendations: [],
  loading: false,
  error: null,
  selectedAssessmentId: null
};

function assessmentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ASSESSMENTS':
      return { ...state, assessments: action.payload, loading: false };
    case 'SET_CURRENT_ASSESSMENT':
      return { ...state, currentAssessment: action.payload, loading: false };
    case 'CLEAR_CURRENT_ASSESSMENT':
      return { ...state, currentAssessment: null, applications: [], loading: false };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SELECT_ASSESSMENT':
      return { ...state, selectedAssessmentId: action.payload };
    case 'ADD_ASSESSMENT':
      return { ...state, assessments: [...state.assessments, action.payload] };
    case 'UPDATE_ASSESSMENT':
      return {
        ...state,
        assessments: state.assessments.map(assessment =>
          assessment.id === action.payload.id ? action.payload : assessment
        ),
        currentAssessment: state.currentAssessment?.id === action.payload.id 
          ? action.payload 
          : state.currentAssessment
      };
    default:
      return state;
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  const loadAssessments = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const assessments = await apiService.getAssessments();
      dispatch({ type: 'SET_ASSESSMENTS', payload: assessments });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadAssessment = async (id) => {
    try {
      console.log('ASSESSMENT CONTEXT: Loading assessment with ID:', id);
      dispatch({ type: 'SET_LOADING', payload: true });
      const assessment = await apiService.getAssessment(id);
      console.log('ASSESSMENT CONTEXT: Loaded assessment:', assessment?.name);
      dispatch({ type: 'SET_CURRENT_ASSESSMENT', payload: assessment });
      
      // Load applications for this assessment
      const applications = await apiService.getApplications({ assessmentId: id });
      console.log('ASSESSMENT CONTEXT: Loaded applications for assessment:', applications?.length, 'applications');
      dispatch({ type: 'SET_APPLICATIONS', payload: applications });
    } catch (error) {
      console.error('ASSESSMENT CONTEXT: Error loading assessment:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createAssessment = async (assessmentData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newAssessment = await apiService.createAssessment(assessmentData);
      dispatch({ type: 'ADD_ASSESSMENT', payload: newAssessment });
      return newAssessment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const startAssessment = async (id) => {
    try {
      const updatedAssessment = await apiService.startAssessment(id);
      dispatch({ type: 'UPDATE_ASSESSMENT', payload: updatedAssessment });
      return updatedAssessment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearCurrentAssessment = () => {
    dispatch({ type: 'CLEAR_CURRENT_ASSESSMENT' });
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const value = {
    ...state,
    loadAssessments,
    loadAssessment,
    createAssessment,
    startAssessment,
    clearCurrentAssessment,
    dispatch
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}