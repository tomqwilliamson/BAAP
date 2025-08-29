// src/components/Dashboard/BusinessContextSummary.js - Business context summary for executive dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Target, TrendingUp, DollarSign, Users, Calendar, 
  ArrowRight, AlertCircle, CheckCircle, ExternalLink 
} from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';

function BusinessContextSummary() {
  const { currentAssessment } = useAssessment();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessContextData();
  }, [currentAssessment]);

  const loadBusinessContextData = () => {
    try {
      // Generate assessment-specific business context data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'business');
      
      // Create summary data structure
      const summaryData = {
        businessDrivers: assessmentSpecificData?.businessDrivers || [
          { name: 'Digital Transformation', priority: 'Critical', impact: 90 },
          { name: 'Cost Optimization', priority: 'High', impact: 85 },
          { name: 'Customer Experience', priority: 'Critical', impact: 88 },
          { name: 'Operational Efficiency', priority: 'Medium', impact: 75 }
        ],
        stakeholderGroups: assessmentSpecificData?.stakeholderGroups || [
          { name: 'Executive Leadership', influence: 'High', interest: 'High' },
          { name: 'Development Team', influence: 'Medium', interest: 'High' },
          { name: 'Operations Team', influence: 'Medium', interest: 'High' }
        ],
        projectTimeline: assessmentSpecificData?.projectTimeline || [
          { phase: 'Discovery & Planning', status: 'Planned', duration: '6 weeks' },
          { phase: 'Infrastructure Setup', status: 'Planned', duration: '8 weeks' },
          { phase: 'Application Migration', status: 'Planned', duration: '12 weeks' }
        ],
        businessMetrics: {
          estimatedROI: assessmentSpecificData?.businessCase?.roi || 285,
          paybackPeriod: assessmentSpecificData?.businessCase?.paybackPeriod || '14 months',
          totalInvestment: assessmentSpecificData?.businessCase?.totalInvestment || 850000,
          projectedSavings: assessmentSpecificData?.businessCase?.projectedSavings || 2400000
        }
      };

      setBusinessData(summaryData);
    } catch (error) {
      console.error('Error loading business context data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Planned': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading || !businessData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Business Context</h3>
        </div>
        <Link
          to="/app/business-context"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          View Details
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Business Metrics Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Estimated ROI</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {businessData?.businessMetrics?.estimatedROI || 0}%
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Payback Period</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {businessData?.businessMetrics?.paybackPeriod || 'N/A'}
          </div>
        </div>
      </div>

      {/* Top Business Drivers */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Target className="h-4 w-4 text-gray-600 mr-2" />
          Top Business Drivers
        </h4>
        <div className="space-y-2">
          {(businessData?.businessDrivers || []).slice(0, 3).map((driver, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{driver.name}</p>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(driver.priority)}`}>
                  {driver.priority}
                </span>
                <span className="text-sm text-gray-500">{driver.impact}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Users className="h-4 w-4 text-gray-600 mr-2" />
          Key Stakeholders
        </h4>
        <div className="space-y-1">
          {(businessData?.stakeholderGroups || []).slice(0, 3).map((group, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{group.name}</span>
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${group.influence === 'High' ? 'bg-red-400' : group.influence === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                <span className="text-gray-500 text-xs">{group.influence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Timeline Status */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Project Timeline</h4>
        <div className="space-y-2">
          {(businessData?.projectTimeline || []).slice(0, 3).map((phase, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 flex-1">{phase.phase}</span>
              <div className="flex items-center space-x-2">
                <span className={`${getStatusColor(phase.status)}`}>
                  {phase.status === 'Completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{phase.duration}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/app/business-context"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Manage Business Context
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default BusinessContextSummary;