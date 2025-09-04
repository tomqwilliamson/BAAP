// src/components/common/AssessmentSelectionGuard.js - Assessment selection requirement guard
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Calendar, BarChart3, Users, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import toast from 'react-hot-toast';

function AssessmentSelectionGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAssessment, assessments, loadAssessment, loading: assessmentsLoading } = useAssessment();
  const [autoSelecting, setAutoSelecting] = useState(false);

  // Pages that don't require assessment selection
  const publicPages = [
    '/app',
    '/app/dashboard',
    '/app/assessments/new'
  ];

  const isPublicPage = publicPages.includes(location.pathname);

  // Auto-select single assessment if available
  useEffect(() => {
    const shouldAutoSelect = !isPublicPage && 
                            !currentAssessment && 
                            !assessmentsLoading && 
                            assessments.length === 1 && 
                            !autoSelecting;

    if (shouldAutoSelect) {
      setAutoSelecting(true);
      const singleAssessment = assessments[0];
      console.log('Auto-selecting single assessment:', singleAssessment.name);
      
      loadAssessment(singleAssessment.id)
        .then(() => {
          toast.success(`Auto-selected: ${singleAssessment.name}`);
        })
        .catch((error) => {
          console.error('Failed to auto-select assessment:', error);
          toast.error('Failed to load assessment');
        })
        .finally(() => {
          setAutoSelecting(false);
        });
    }
  }, [isPublicPage, currentAssessment, assessmentsLoading, assessments, loadAssessment, autoSelecting]);

  // If on dashboard or public page, show content normally
  if (isPublicPage) {
    return children;
  }

  // If assessment is selected, show content normally  
  if (currentAssessment) {
    return children;
  }

  // If we're still loading assessments or auto-selecting, show loading
  if (assessmentsLoading || autoSelecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {autoSelecting ? 'Loading assessment...' : 'Loading assessments...'}
          </p>
        </div>
      </div>
    );
  }

  // No assessment selected on a protected page - show selection interface
  const handleAssessmentSelect = async (assessmentId) => {
    try {
      await loadAssessment(parseInt(assessmentId));
      toast.success(`Assessment selected: ${assessments.find(a => a.id === parseInt(assessmentId))?.name}`);
    } catch (error) {
      toast.error('Failed to load assessment');
      console.error('Error loading assessment:', error);
    }
  };

  const getPageContext = () => {
    const pathname = location.pathname;
    if (pathname.includes('/security')) return { 
      name: 'Security Assessment', 
      icon: BarChart3, 
      bgColor: 'bg-red-100', 
      iconColor: 'text-red-600' 
    };
    if (pathname.includes('/infrastructure')) return { 
      name: 'Infrastructure Review', 
      icon: BarChart3, 
      bgColor: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    };
    if (pathname.includes('/data')) return { 
      name: 'Data Architecture', 
      icon: BarChart3, 
      bgColor: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    };
    if (pathname.includes('/devops')) return { 
      name: 'DevOps Assessment', 
      icon: BarChart3, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    };
    if (pathname.includes('/business')) return { 
      name: 'Business Context', 
      icon: Users, 
      bgColor: 'bg-indigo-100', 
      iconColor: 'text-indigo-600' 
    };
    if (pathname.includes('/architecture')) return { 
      name: 'Architecture Review', 
      icon: BarChart3, 
      bgColor: 'bg-orange-100', 
      iconColor: 'text-orange-600' 
    };
    if (pathname.includes('/cloud-readiness')) return { 
      name: 'Cloud Readiness', 
      icon: BarChart3, 
      bgColor: 'bg-cyan-100', 
      iconColor: 'text-cyan-600' 
    };
    if (pathname.includes('/recommendations')) return { 
      name: 'Recommendations', 
      icon: BarChart3, 
      bgColor: 'bg-teal-100', 
      iconColor: 'text-teal-600' 
    };
    if (pathname.includes('/applications')) return { 
      name: 'Application Details', 
      icon: BarChart3, 
      bgColor: 'bg-violet-100', 
      iconColor: 'text-violet-600' 
    };
    if (pathname.includes('/assessments')) return { 
      name: 'Assessment Details', 
      icon: ClipboardList, 
      bgColor: 'bg-slate-100', 
      iconColor: 'text-slate-600' 
    };
    return { 
      name: 'Assessment Tool', 
      icon: BarChart3, 
      bgColor: 'bg-gray-100', 
      iconColor: 'text-gray-600' 
    };
  };

  const pageContext = getPageContext();
  const IconComponent = pageContext.icon;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'border-green-300 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 hover:from-green-100 hover:via-emerald-100 hover:to-green-200 shadow-2xl shadow-green-100/50';
      case 'InProgress':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:from-blue-100 hover:via-indigo-100 hover:to-blue-200 shadow-2xl shadow-blue-100/50';
      case 'Analyzing':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 hover:from-yellow-100 hover:via-amber-100 hover:to-yellow-200 shadow-2xl shadow-yellow-100/50';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 hover:from-gray-100 hover:via-slate-100 hover:to-gray-200 shadow-2xl shadow-gray-100/50';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-lg';
      case 'InProgress':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300 shadow-lg';
      case 'Analyzing':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-lg';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-6xl w-full">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mr-4`}>
                  <IconComponent className={`h-10 w-10 text-white`} />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold">
                    {assessments.length === 1 ? 'Loading Assessment' : 'Select Assessment'}
                  </h1>
                  <div className="flex items-center mt-2 text-blue-100">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span className="text-lg">AI-Powered Assessment Platform</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-lg leading-relaxed">
                  {assessments.length === 1 
                    ? `Automatically loading your assessment to access ${pageContext.name}`
                    : `Choose an assessment to access ${pageContext.name} with comprehensive AI analysis`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="p-8">
              {/* Assessment Grid */}
              {assessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {assessments.map((assessment, index) => (
                    <button
                      key={assessment.id}
                      onClick={() => handleAssessmentSelect(assessment.id)}
                      className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105 hover:shadow-2xl ${getStatusColor(assessment.status)}`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${assessment.status === 'Completed' ? 'bg-green-100' : assessment.status === 'InProgress' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                            {assessment.status === 'Completed' ? (
                              <Target className={`h-6 w-6 ${assessment.status === 'Completed' ? 'text-green-600' : assessment.status === 'InProgress' ? 'text-blue-600' : 'text-gray-600'}`} />
                            ) : assessment.status === 'InProgress' ? (
                              <TrendingUp className="h-6 w-6 text-blue-600" />
                            ) : (
                              <ClipboardList className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(assessment.status)} mb-2`}>
                              {assessment.status}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                      
                      {/* Card Content */}
                      <div className="flex-1 mb-4">
                        <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-blue-900 transition-colors">
                          {assessment.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {assessment.description || 'Comprehensive application portfolio assessment with AI-powered analysis'}
                        </p>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center">
                              <ClipboardList className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="font-medium">{assessment.applicationCount || 0}</span>
                              <span className="ml-1">apps</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                              <span>{new Date(assessment.createdDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              assessment.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-green-600 w-full' :
                              assessment.status === 'InProgress' ? 'bg-gradient-to-r from-blue-500 to-blue-600 w-3/4' :
                              assessment.status === 'Analyzing' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 w-1/2' :
                              'bg-gradient-to-r from-gray-400 to-gray-500 w-1/4'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                    <ClipboardList className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Assessments Available</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Create your first AI-powered assessment to get started with comprehensive application portfolio analysis</p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-lg mx-auto">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Use the "+ New Assessment" button to begin</span>
                    </div>
                  </div>
                </div>
          )}

              {/* Enhanced Footer Actions */}
              {assessments.length > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Need help choosing?</p>
                        <p>Each assessment provides comprehensive AI-powered analysis across multiple domains.</p>
                      </div>
                      <button
                        onClick={() => navigate('/app/dashboard')}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
                        Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentSelectionGuard;