// src/components/Dashboard/PortfolioSummary.js - Portfolio overview table
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, ExternalLink, Eye, Edit, Copy } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import ApplicationDetailsModal from '../common/ApplicationDetailsModal';
import ApplicationEditModal from '../application/ApplicationEditModal';

function PortfolioSummary() {
  const { currentAssessment, assessments } = useAssessment();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState(null);
  const [assessmentFilter, setAssessmentFilter] = useState('all');

  useEffect(() => {
    loadPortfolioData();
    // Reset filter when switching assessment views
    setAssessmentFilter('all');
  }, [currentAssessment]);

  // Filter applications when the filter changes
  useEffect(() => {
    if (!currentAssessment) {
      if (assessmentFilter === 'all') {
        setFilteredApplications(applications);
      } else {
        setFilteredApplications(applications.filter(app => app.assessmentName === assessmentFilter));
      }
    } else {
      setFilteredApplications(applications);
    }
  }, [applications, assessmentFilter, currentAssessment]);

  const loadPortfolioData = async () => {
    try {
      console.log('PORTFOLIO: Loading data for assessment:', currentAssessment?.id);
      
      if (currentAssessment?.id) {
        // Generate assessment-specific data for selected assessment
        const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'portfolio');
        
        if (assessmentSpecificData?.applications) {
          // Use assessment-specific portfolio data
          const transformedData = assessmentSpecificData.applications.map((app, index) => ({
            id: `${currentAssessment.id}-${index + 1}`,
            name: app.name,
            type: 'Application',
            category: app.criticality,
            score: app.cloudReadiness,
            grade: calculateGrade(app.cloudReadiness),
            riskLevel: calculateRiskLevel(app.complexity === 'Very High' ? 5 : app.complexity === 'High' ? 3 : 1, 0),
            assessmentName: currentAssessment.name
          }));
          setApplications(transformedData);
          return;
        }
      }

      // Load all applications (either no assessment selected or fallback)
      console.log('PORTFOLIO: Loading ALL applications from ALL assessments');
      const data = await apiService.getPortfolioSummary();
      console.log('PORTFOLIO: Raw portfolio data:', data);
      
      // Transform API data to match component expectations
      let transformedData = data.map(app => ({
        id: app.id,
        name: app.name,
        type: app.type,
        category: app.category,
        score: app.cloudReadinessScore,
        grade: calculateGrade(app.cloudReadinessScore),
        riskLevel: calculateRiskLevel(app.criticalFindings, app.highFindings),
        assessmentName: app.assessment?.name || 'Unknown Assessment'
      }));

      // Show actual applications from database without artificial padding
      console.log('PORTFOLIO: Showing actual applications from database, count:', transformedData.length);
      
      console.log('PORTFOLIO: Final transformed applications:', transformedData);
      setApplications(transformedData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    return 'F';
  };

  const calculateRiskLevel = (criticalFindings, highFindings) => {
    const totalCriticalAndHigh = (criticalFindings || 0) + (highFindings || 0);
    if (totalCriticalAndHigh === 0) return 'Low';
    if (totalCriticalAndHigh <= 5) return 'Low';
    if (totalCriticalAndHigh <= 10) return 'Medium';
    if (totalCriticalAndHigh <= 20) return 'High';
    return 'Critical';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleEditApplication = (appId) => {
    setEditingAppId(appId);
    setIsEditModalOpen(true);
  };

  const handleCloneApplication = async (appId, appName) => {
    if (!confirm(`Are you sure you want to clone "${appName}"?`)) {
      return;
    }

    try {
      const newName = prompt(`Enter a name for the cloned application:`, `${appName} (Copy)`);
      if (!newName) return;

      await apiService.cloneApplication(appId, {
        newName,
        assessmentId: currentAssessment?.id
      });

      // Refresh the portfolio data
      await loadPortfolioData();
      console.log(`✅ Application "${appName}" cloned successfully as "${newName}"`);
    } catch (error) {
      console.error('Error cloning application:', error);
      alert('Error cloning application. Please try again.');
    }
  };

  const handleEditComplete = () => {
    setIsEditModalOpen(false);
    setEditingAppId(null);
    // Refresh portfolio data after edit
    loadPortfolioData();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Custom scrollbar styles
  const scrollbarStyles = `
    .scrollable-table::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .scrollable-table::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 4px;
    }
    .scrollable-table::-webkit-scrollbar-thumb {
      background: #9ca3af;
      border-radius: 4px;
    }
    .scrollable-table::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Portfolio</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentAssessment 
                  ? `${filteredApplications.length} applications in ${currentAssessment.name}` 
                  : `Showing ${filteredApplications.length} of ${applications.length} total applications`
                }
              </p>
            </div>
            {!currentAssessment && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter by Assessment:</label>
                <select
                  value={assessmentFilter}
                  onChange={(e) => setAssessmentFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Assessments ({applications.length})</option>
                  {assessments.map(assessment => {
                    const count = applications.filter(app => app.assessmentName === assessment.name).length;
                    return (
                      <option key={assessment.id} value={assessment.name}>
                        {assessment.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
        <div 
          className="overflow-x-auto max-h-80 overflow-y-scroll border border-gray-200 rounded-b-lg scrollable-table" 
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: '#9CA3AF #F3F4F6',
            scrollbarGutter: 'stable'
          }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                {!currentAssessment && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Code className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.type}</div>
                      </div>
                    </div>
                  </td>
                  {!currentAssessment && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-xs text-gray-600 truncate max-w-32" title={app.assessmentName}>
                        {app.assessmentName}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(app.score)}`}>
                      {app.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(app.riskLevel)}`}>
                      {app.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center transition-colors px-2 py-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditApplication(app.id)}
                        className="text-green-600 hover:text-green-900 flex items-center transition-colors px-2 py-1 rounded hover:bg-green-50"
                        title="Edit Application"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleCloneApplication(app.id, app.name)}
                        className="text-purple-600 hover:text-purple-900 flex items-center transition-colors px-2 py-1 rounded hover:bg-purple-50"
                        title="Clone Application"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Clone
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={currentAssessment ? 6 : 7} className="px-6 py-8 text-center text-sm text-gray-500">
                    {applications.length === 0 ? 'No applications found' : 'No applications match the selected filter'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Application Details Modal */}
      <ApplicationDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppId(null);
        }}
        applicationId={selectedAppId}
      />

      {/* Application Edit Modal */}
      <ApplicationEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAppId(null);
        }}
        applicationId={editingAppId}
        onSave={handleEditComplete}
      />
    </>
  );
}

export default PortfolioSummary;