// src/components/Dashboard/RecentActivity.js - Recent assessments activity
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function RecentActivity({ assessments }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'InProgress':
      case 'Analyzing':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'InProgress':
      case 'Analyzing':
        return 'text-blue-600 bg-blue-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {assessments.map((assessment, index) => (
              <li key={assessment.id}>
                <div className="relative pb-8">
                  {index !== assessments.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                        {getStatusIcon(assessment.status)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <Link 
                            to={`/app/assessments/${assessment.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {assessment.name}
                          </Link>
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(assessment.status)}`}>
                            {assessment.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {assessment.applicationCount} applications
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Link
            to="/app/assessments"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            View all assessments →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;