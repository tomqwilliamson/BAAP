// src/components/Assessment/AssessmentDetail.js - Assessment detail view with CRUD operations
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, Clock, AlertTriangle, FileText, Settings, Edit2, Trash2, Copy, Plus } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import { assessmentService } from '../../services/assessmentservice';
import ApplicationEditModal from '../application/ApplicationEditModal';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';

function AssessmentDetail() {
  const { id } = useParams();
  const { currentAssessment, loadAssessment, startAssessment } = useAssessment();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingAppId, setDeletingAppId] = useState(null);
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadAssessment(id);
      loadRecommendations();
      loadApplications();
    }
  }, [id]);

  useEffect(() => {
    if (currentAssessment?.applications) {
      setApplications(currentAssessment.applications);
    }
  }, [currentAssessment]);

  const loadRecommendations = async () => {
    try {
      const recs = await assessmentService.getRecommendations(id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const apps = await assessmentService.getApplications({ assessmentId: id });
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleEditApplication = (app) => {
    setEditingApp(app);
    setIsEditModalOpen(true);
  };

  const handleSaveApplication = (updatedApp) => {
    setApplications(prev => 
      prev.map(app => app.id === updatedApp.id ? updatedApp : app)
    );
    setIsEditModalOpen(false);
    setEditingApp(null);
  };

  const handleDeleteApplication = (app) => {
    setAppToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteApplication = async () => {
    if (!appToDelete) return;
    
    setDeletingAppId(appToDelete.id);
    try {
      await assessmentService.deleteApplication(appToDelete.id);
      setApplications(prev => prev.filter(app => app.id !== appToDelete.id));
      toast.success('Application deleted successfully!');
      setIsDeleteDialogOpen(false);
      setAppToDelete(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    } finally {
      setDeletingAppId(null);
    }
  };

  const handleCloneApplication = async (app) => {
    try {
      const clonedApp = await assessmentService.post(`/applications/${app.id}/clone`, {
        newName: `${app.name} (Copy)`,
        assessmentId: id
      });
      setApplications(prev => [...prev, clonedApp.data]);
      toast.success('Application cloned successfully!');
    } catch (error) {
      console.error('Error cloning application:', error);
      toast.error('Failed to clone application');
    }
  };

  const handleStartAssessment = async () => {
    setLoading(true);
    try {
      await startAssessment(id);
      toast.success('Assessment started successfully!');
    } catch (error) {
      toast.error('Failed to start assessment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
      case 'Analyzing':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'InProgress':
      case 'Analyzing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'Failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!currentAssessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentAssessment.name}</h1>
            <p className="text-gray-600 mt-1">{currentAssessment.description}</p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center">
                {getStatusIcon(currentAssessment.status)}
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAssessment.status)}`}>
                  {currentAssessment.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(currentAssessment.createdAt).toLocaleDateString()}
              </div>
              {currentAssessment.completedAt && (
                <div className="text-sm text-gray-500">
                  Completed: {new Date(currentAssessment.completedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          {currentAssessment.status === 'Created' && (
            <button
              onClick={handleStartAssessment}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Start Assessment
            </button>
          )}
        </div>
      </div>

      {/* Assessment Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentAssessment.applications?.filter(app => app.score).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentAssessment.applications?.filter(app => app.score?.riskLevel === 'Critical').length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Applications in Assessment</h3>
            <Link
              to={`/app/assessments/new`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criticality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.description || 'No description'}</div>
                    <div className="flex items-center mt-1 space-x-2">
                      {app.deploymentModel && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          app.deploymentModel === 'Cloud' ? 'bg-blue-100 text-blue-800' :
                          app.deploymentModel === 'Hybrid' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.deploymentModel}
                        </span>
                      )}
                      {app.tags && (
                        <span className="text-xs text-gray-400">
                          {app.tags.replace(/[\[\]"]/g, '').split(',').slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.businessDomain || app.category || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.businessCriticality === 'Critical' ? 'bg-red-100 text-red-800' :
                      app.businessCriticality === 'Important' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {app.businessCriticality || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        app.modernizationPriority === 1 ? 'bg-red-100 text-red-800' :
                        app.modernizationPriority === 2 ? 'bg-orange-100 text-orange-800' :
                        app.modernizationPriority === 3 ? 'bg-yellow-100 text-yellow-800' :
                        app.modernizationPriority === 4 ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        P{app.modernizationPriority || 3}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.cloudReadinessScore ? (
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              app.cloudReadinessScore >= 80 ? 'bg-green-500' :
                              app.cloudReadinessScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${app.cloudReadinessScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{app.cloudReadinessScore}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditApplication(app)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit Application"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCloneApplication(app)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Clone Application"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteApplication(app)}
                        disabled={deletingAppId === app.id}
                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                        title="Delete Application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No applications added yet</p>
                      <p className="text-gray-500 mb-4">Add applications to start your assessment</p>
                      <Link
                        to={`/app/assessments/new`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Application
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Recommendations</h3>
              <Link 
                to="/recommendations" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span>Impact: {rec.impact}</span>
                        <span>Effort: {rec.effort}</span>
                        <span>Timeline: {rec.timeline}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rec.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Application Edit Modal */}
      <ApplicationEditModal
        application={editingApp}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApplication}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setAppToDelete(null);
        }}
        onConfirm={confirmDeleteApplication}
        title="Delete Application"
        message={`Are you sure you want to delete "${appToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingAppId === appToDelete?.id}
      />
    </div>
  );
}

export default AssessmentDetail;