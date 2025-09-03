// src/components/application/ApplicationEditModal.js - Modal for editing application details
import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { assessmentService } from '../../services/assessmentservice';
import toast from 'react-hot-toast';

const businessDomains = [
  'Finance',
  'Sales & Marketing', 
  'Operations',
  'Human Resources',
  'Customer Experience',
  'Analytics & BI',
  'Security & Compliance',
  'IT Infrastructure',
  'Supply Chain',
  'Research & Development'
];

const businessCriticality = [
  'Critical',
  'Important',
  'Standard'
];

const deploymentModels = [
  'OnPremise',
  'Cloud', 
  'Hybrid'
];

const applicationTypes = [
  'WebApplication',
  'MobileApp',
  'DesktopApplication',
  'Service',
  'Database',
  'API',
  'Microservice',
  'LegacySystem',
  'COTS'
];

const applicationCategories = [
  'Customer-Facing',
  'Internal',
  'Financial',
  'Analytics',
  'Integration',
  'Infrastructure',
  'Security',
  'Compliance'
];

function ApplicationEditModal({ application, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'WebApplication',
    category: 'Customer-Facing',
    businessDomain: 'Customer Experience',
    businessCriticality: 'Standard',
    deploymentModel: 'OnPremise',
    modernizationPriority: 3,
    technologyStack: '',
    repositoryUrl: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name || '',
        description: application.description || '',
        type: application.type || 'WebApplication',
        category: application.category || 'Customer-Facing',
        businessDomain: application.businessDomain || 'Customer Experience',
        businessCriticality: application.businessCriticality || 'Standard',
        deploymentModel: application.deploymentModel || 'OnPremise',
        modernizationPriority: application.modernizationPriority || 3,
        technologyStack: application.technologyStack || '',
        repositoryUrl: application.repositoryUrl || '',
        tags: application.tags || ''
      });
    }
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'modernizationPriority' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await assessmentService.updateApplication(application.id, formData);
      toast.success('Application updated successfully!');
      onSave({ ...application, ...formData });
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Application Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Application Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {applicationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Categories and Business Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {applicationCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Domain
              </label>
              <select
                name="businessDomain"
                value={formData.businessDomain}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {businessDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Criticality and Deployment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Criticality
              </label>
              <select
                name="businessCriticality"
                value={formData.businessCriticality}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {businessCriticality.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deployment Model
              </label>
              <select
                name="deploymentModel"
                value={formData.deploymentModel}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {deploymentModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Modernization Priority
              </label>
              <select
                name="modernizationPriority"
                value={formData.modernizationPriority}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1 - Highest Priority</option>
                <option value={2}>2 - High Priority</option>
                <option value={3}>3 - Medium Priority</option>
                <option value={4}>4 - Low Priority</option>
                <option value={5}>5 - Lowest Priority</option>
              </select>
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Technology Stack
            </label>
            <input
              type="text"
              name="technologyStack"
              value={formData.technologyStack}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., React, .NET Core, Azure SQL, Redis"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Repository URL
            </label>
            <input
              type="url"
              name="repositoryUrl"
              value={formData.repositoryUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/company/repo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="legacy, critical, cloud-ready (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the application"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationEditModal;