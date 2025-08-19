// src/contexts/AssessmentContext.js - Global state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { assessmentService } from '../services/assessmentservice';

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
      const assessments = await assessmentService.getAssessments();
      dispatch({ type: 'SET_ASSESSMENTS', payload: assessments });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadAssessment = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const assessment = await assessmentService.getAssessment(id);
      dispatch({ type: 'SET_CURRENT_ASSESSMENT', payload: assessment });
      dispatch({ type: 'SET_APPLICATIONS', payload: assessment.applications || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createAssessment = async (assessmentData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newAssessment = await assessmentService.createAssessment(assessmentData);
      dispatch({ type: 'ADD_ASSESSMENT', payload: newAssessment });
      return newAssessment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const startAssessment = async (id) => {
    try {
      const updatedAssessment = await assessmentService.startAssessment(id);
      dispatch({ type: 'UPDATE_ASSESSMENT', payload: updatedAssessment });
      return updatedAssessment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
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