// src/components/Assessment/CreateAssessment.js - Create new assessment form
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import toast from 'react-hot-toast';

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

function CreateAssessment() {
  const navigate = useNavigate();
  const { createAssessment } = useAssessment();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: 'current-user@company.com', // Would be from auth context
    applications: [
      {
        name: '',
        description: '',
        type: 'WebApplication',
        category: 'Customer-Facing',
        technologyStack: '',
        repositoryUrl: ''
      }
    ]
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplicationChange = (index, field, value) => {
    const updatedApplications = formData.applications.map((app, i) => 
      i === index ? { ...app, [field]: value } : app
    );
    setFormData({
      ...formData,
      applications: updatedApplications
    });
  };

  const addApplication = () => {
    setFormData({
      ...formData,
      applications: [
        ...formData.applications,
        {
          name: '',
          description: '',
          type: 'WebApplication',
          category: 'Customer-Facing',
          technologyStack: '',
          repositoryUrl: ''
        }
      ]
    });
  };

  const removeApplication = (index) => {
    if (formData.applications.length > 1) {
      setFormData({
        ...formData,
        applications: formData.applications.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assessment = await createAssessment(formData);
      toast.success('Assessment created successfully!');
      navigate(`/assessments/${assessment.id}`);
    } catch (error) {
      toast.error('Failed to create assessment');
      console.error('Error creating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Assessment</h2>
          <p className="text-sm text-gray-500 mt-1">
            Set up a comprehensive application portfolio assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assessment Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Q4 2024 Portfolio Assessment"
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
                placeholder="Describe the scope and objectives of this assessment..."
              />
            </div>
          </div>

          {/* Applications Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Applications to Assess</h3>
              <button
                type="button"
                onClick={addApplication}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Application
              </button>
            </div>

            <div className="space-y-6">
              {formData.applications.map((app, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Application {index + 1}
                    </h4>
                    {formData.applications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApplication(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Application Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={app.name}
                        onChange={(e) => handleApplicationChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Customer Portal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Application Type
                      </label>
                      <select
                        value={app.type}
                        onChange={(e) => handleApplicationChange(index, 'type', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {applicationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        value={app.category}
                        onChange={(e) => handleApplicationChange(index, 'category', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {applicationCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Repository URL
                      </label>
                      <input
                        type="url"
                        value={app.repositoryUrl}
                        onChange={(e) => handleApplicationChange(index, 'repositoryUrl', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://github.com/company/app"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Technology Stack
                      </label>
                      <input
                        type="text"
                        value={app.technologyStack}
                        onChange={(e) => handleApplicationChange(index, 'technologyStack', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., React, .NET Core, Azure SQL, Redis"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={app.description}
                        onChange={(e) => handleApplicationChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the application..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAssessment;