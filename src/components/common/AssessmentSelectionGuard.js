// src/components/common/AssessmentSelectionGuard.js - Assessment selection requirement guard
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Calendar, BarChart3, Users } from 'lucide-react';
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
    if (pathname.includes('/security')) return { name: 'Security Assessment', icon: BarChart3, color: 'red' };
    if (pathname.includes('/infrastructure')) return { name: 'Infrastructure Review', icon: BarChart3, color: 'blue' };
    if (pathname.includes('/data')) return { name: 'Data Architecture', icon: BarChart3, color: 'purple' };
    if (pathname.includes('/devops')) return { name: 'DevOps Assessment', icon: BarChart3, color: 'green' };
    if (pathname.includes('/business')) return { name: 'Business Context', icon: Users, color: 'indigo' };
    if (pathname.includes('/architecture')) return { name: 'Architecture Review', icon: BarChart3, color: 'orange' };
    if (pathname.includes('/cloud-readiness')) return { name: 'Cloud Readiness', icon: BarChart3, color: 'cyan' };
    if (pathname.includes('/recommendations')) return { name: 'Recommendations', icon: BarChart3, color: 'teal' };
    if (pathname.includes('/applications')) return { name: 'Application Details', icon: BarChart3, color: 'violet' };
    if (pathname.includes('/assessments')) return { name: 'Assessment Details', icon: ClipboardList, color: 'slate' };
    return { name: 'Assessment Tool', icon: BarChart3, color: 'gray' };
  };

  const pageContext = getPageContext();
  const IconComponent = pageContext.icon;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'InProgress':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'Analyzing':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Analyzing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${pageContext.color}-100 mb-4`}>
              <IconComponent className={`h-8 w-8 text-${pageContext.color}-600`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {assessments.length === 1 ? 'Loading Assessment' : 'Select Assessment'}
            </h1>
            <p className="text-gray-600 mt-2">
              {assessments.length === 1 
                ? `Automatically loading your assessment to access ${pageContext.name}`
                : `Choose an assessment to access ${pageContext.name}`
              }
            </p>
          </div>

          {/* Assessment Grid */}
          {assessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {assessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => handleAssessmentSelect(assessment.id)}
                  className={`text-left p-6 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(assessment.status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {assessment.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {assessment.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        {assessment.applicationCount || 0} apps
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(assessment.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Available</h3>
              <p className="text-gray-500">Use the "+ New Assessment" button in the sidebar to create your first assessment</p>
            </div>
          )}

          {/* Footer Actions */}
          {assessments.length > 0 && (
            <div className="border-t border-gray-200 pt-6 flex items-center justify-center">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentSelectionGuard;