// src/components/Assessment/CreateAssessment.js - Create new assessment form
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ClipboardList, Building, Code, Database, Globe, Smartphone, Server, Zap, Settings } from 'lucide-react';
import { useAssessment } from '../../contexts/assessmentcontext';
import toast from 'react-hot-toast';

const applicationTypes = [
  { value: 'WebApplication', label: 'Web Application', icon: Globe, color: 'text-blue-600' },
  { value: 'MobileApp', label: 'Mobile App', icon: Smartphone, color: 'text-green-600' },
  { value: 'DesktopApplication', label: 'Desktop Application', icon: Server, color: 'text-purple-600' },
  { value: 'Service', label: 'Service', icon: Zap, color: 'text-yellow-600' },
  { value: 'Database', label: 'Database', icon: Database, color: 'text-indigo-600' },
  { value: 'API', label: 'API', icon: Code, color: 'text-orange-600' },
  { value: 'Microservice', label: 'Microservice', icon: Settings, color: 'text-teal-600' },
  { value: 'LegacySystem', label: 'Legacy System', icon: Building, color: 'text-gray-600' },
  { value: 'COTS', label: 'COTS', icon: Building, color: 'text-red-600' }
];

const applicationCategories = [
  { value: 'Customer-Facing', label: 'Customer-Facing', color: 'bg-blue-100 text-blue-800' },
  { value: 'Internal', label: 'Internal', color: 'bg-green-100 text-green-800' },
  { value: 'Financial', label: 'Financial', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Analytics', label: 'Analytics', color: 'bg-purple-100 text-purple-800' },
  { value: 'Integration', label: 'Integration', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'Infrastructure', label: 'Infrastructure', color: 'bg-gray-100 text-gray-800' },
  { value: 'Security', label: 'Security', color: 'bg-red-100 text-red-800' },
  { value: 'Compliance', label: 'Compliance', color: 'bg-orange-100 text-orange-800' }
];

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
  { value: 'Critical', label: 'Critical', color: 'bg-red-100 text-red-800', priority: 1 },
  { value: 'Important', label: 'Important', color: 'bg-yellow-100 text-yellow-800', priority: 2 },
  { value: 'Standard', label: 'Standard', color: 'bg-green-100 text-green-800', priority: 3 }
];

const deploymentModels = [
  'OnPremise',
  'Cloud', 
  'Hybrid'
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
        businessDomain: 'Customer Experience',
        businessCriticality: 'Standard',
        deploymentModel: 'OnPremise',
        modernizationPriority: 3,
        technologyStack: '',
        repositoryUrl: '',
        tags: ''
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
          businessDomain: 'Customer Experience',
          businessCriticality: 'Standard',
          deploymentModel: 'OnPremise',
          modernizationPriority: 3,
          technologyStack: '',
          repositoryUrl: '',
          tags: ''
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
      navigate(`/app/assessments/${assessment.id}`);
    } catch (error) {
      toast.error('Failed to create assessment');
      console.error('Error creating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center">
            <ClipboardList className="h-10 w-10 mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Create New Assessment</h1>
              <p className="text-blue-100 mt-2 text-lg">
                Set up a comprehensive AI-powered application portfolio assessment
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ClipboardList className="h-6 w-6 mr-2 text-blue-600" />
                Assessment Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Q4 2024 Portfolio Assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe the scope and objectives of this assessment..."
                  />
                </div>
              </div>
            </div>

            {/* Applications Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Building className="h-6 w-6 mr-2 text-green-600" />
                  Applications to Assess
                </h3>
                <button
                  type="button"
                  onClick={addApplication}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Application
                </button>
              </div>

              <div className="space-y-6">
                {formData.applications.map((app, index) => {
                  const selectedType = applicationTypes.find(t => t.value === app.type);
                  const TypeIcon = selectedType?.icon || Building;
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <TypeIcon className={`h-8 w-8 mr-3 ${selectedType?.color || 'text-gray-600'}`} />
                          <h4 className="text-lg font-semibold text-gray-900">
                            Application {index + 1}
                          </h4>
                          {app.name && (
                            <span className="ml-3 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {app.name}
                            </span>
                          )}
                        </div>
                        {formData.applications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeApplication(index)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
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
                          <option key={type.value} value={type.value}>{type.label}</option>
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
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Domain
                      </label>
                      <select
                        value={app.businessDomain}
                        onChange={(e) => handleApplicationChange(index, 'businessDomain', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {businessDomains.map(domain => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Criticality
                      </label>
                      <select
                        value={app.businessCriticality}
                        onChange={(e) => handleApplicationChange(index, 'businessCriticality', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {businessCriticality.map(criticality => (
                          <option key={criticality.value} value={criticality.value}>{criticality.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Deployment Model
                      </label>
                      <select
                        value={app.deploymentModel}
                        onChange={(e) => handleApplicationChange(index, 'deploymentModel', e.target.value)}
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
                        value={app.modernizationPriority}
                        onChange={(e) => handleApplicationChange(index, 'modernizationPriority', parseInt(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>1 - Highest Priority</option>
                        <option value={2}>2 - High Priority</option>
                        <option value={3}>3 - Medium Priority</option>
                        <option value={4}>4 - Low Priority</option>
                        <option value={5}>5 - Lowest Priority</option>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={app.tags}
                        onChange={(e) => handleApplicationChange(index, 'tags', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="legacy, critical, cloud-ready (comma separated)"
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
                  );
                })}
            </div>
          </div>

            {/* Form Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Ready to create your assessment?</p>
                  <p>This will set up AI-powered analysis across all application domains.</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/app/dashboard')}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-5 w-5 mr-2" />
                    )}
                    Create Assessment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAssessment;