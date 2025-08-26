// src/components/Dashboard/AssessmentProgress.js - Assessment progress overview widget
import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, Users } from 'lucide-react';

function ProgressBar({ progress, status }) {
  const getProgressColor = () => {
    if (status === 'Completed') return 'bg-green-500';
    if (status === 'InProgress') return 'bg-blue-500';
    if (status === 'Analyzing') return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );
}

function StatusIcon({ status }) {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'InProgress':
      return <PlayCircle className="h-5 w-5 text-blue-600" />;
    case 'Analyzing':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
}

function AssessmentProgress({ assessments = [] }) {
  // Calculate progress for each assessment based on status and mock timeline
  const getAssessmentProgress = (assessment) => {
    const createdDate = new Date(assessment.createdDate);
    const currentDate = new Date();
    const daysSinceCreated = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
    
    // Assume 8-week assessment timeline (56 days)
    const timelineProgress = Math.min((daysSinceCreated / 56) * 100, 100);
    
    switch (assessment.status) {
      case 'Completed':
        return 100;
      case 'InProgress':
        return Math.min(Math.max(timelineProgress, 25), 85); // Between 25-85%
      case 'Analyzing':
        return Math.min(Math.max(timelineProgress, 10), 60); // Between 10-60%
      default:
        return Math.min(timelineProgress, 15); // Max 15% for new assessments
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'InProgress':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Analyzing':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getEstimatedCompletion = (assessment) => {
    const createdDate = new Date(assessment.createdDate);
    const estimatedCompletion = new Date(createdDate);
    estimatedCompletion.setDate(createdDate.getDate() + 56); // 8 weeks
    
    if (assessment.status === 'Completed') {
      return 'Completed';
    }
    
    return estimatedCompletion.toLocaleDateString();
  };

  // Summary stats
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'Completed').length;
  const inProgressAssessments = assessments.filter(a => a.status === 'InProgress').length;
  const totalApplications = assessments.reduce((sum, assessment) => sum + (assessment.applicationCount || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assessment Progress</h3>
          <p className="text-sm text-gray-500 mt-1">Current status of all assessment engagements</p>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>8-week timeline</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{totalAssessments}</div>
          <div className="text-xs text-gray-500">Total Assessments</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{inProgressAssessments}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedAssessments}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{totalApplications}</div>
          <div className="text-xs text-gray-500">Total Apps</div>
        </div>
      </div>

      {/* Assessment List */}
      <div className="space-y-4">
        {assessments.map((assessment) => {
          const progress = getAssessmentProgress(assessment);
          const estimatedCompletion = getEstimatedCompletion(assessment);
          
          return (
            <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <StatusIcon status={assessment.status} />
                    <h4 className="font-medium text-gray-900 ml-2 truncate">
                      {assessment.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {assessment.applicationCount || 0} apps
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Est. completion: {estimatedCompletion}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                  {assessment.status}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} status={assessment.status} />
              </div>
            </div>
          );
        })}
      </div>

      {assessments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No assessments found</p>
        </div>
      )}
    </div>
  );
}

export default AssessmentProgress;