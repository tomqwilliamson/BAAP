// src/components/DevOps/DevOpsAssessment.js - DevOps practices assessment
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Play, Zap, Monitor, Package, Gauge, Upload, Download, Save, FileText, Image,
  Shield, Brain, RefreshCw, Clock, Users, Code, AlertTriangle, CheckCircle, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';

function DevOpsAssessment() {
  const { currentAssessment } = useAssessment();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  const [devopsData, setDevopsData] = useState({
    github: {
      repositories: [],
      pullRequests: {},
      workflows: [],
      codeQuality: {}
    },
    azureDevOps: {
      pipelines: [],
      releases: {},
      workItems: {},
      testResults: {}
    },
    maturity: [],
    cicd: {},
    automation: [],
    monitoring: {},
    uploadedFiles: [],
    analysis: {
      devopsAnalysis: '',
      pipelineAnalysis: '',
      qualityAnalysis: '',
      modernizationRecommendations: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDevOpsData();
  }, [currentAssessment]);

  const loadDevOpsData = async () => {
    try {
      setLoading(true);
      console.log('DEVOPS: Loading data for assessment:', currentAssessment?.id);
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'devops');
      
      const mockData = {
        github: {
          repositories: [
            { name: 'frontend-app', language: 'React', stars: 142, forks: 28, issues: 12, lastCommit: '2 hours ago' },
            { name: 'backend-api', language: 'Node.js', stars: 89, forks: 15, issues: 8, lastCommit: '1 day ago' },
            { name: 'mobile-app', language: 'React Native', stars: 67, forks: 12, issues: 5, lastCommit: '3 hours ago' },
            { name: 'infrastructure', language: 'Terraform', stars: 23, forks: 8, issues: 3, lastCommit: '1 week ago' }
          ],
          pullRequests: {
            open: 15,
            merged: 142,
            avgReviewTime: '4.2 hours',
            mergeRate: 94
          },
          workflows: [
            { name: 'CI/CD Pipeline', status: 'passing', runs: 245, successRate: 92 },
            { name: 'Security Scan', status: 'passing', runs: 189, successRate: 88 },
            { name: 'Code Quality', status: 'failing', runs: 156, successRate: 75 }
          ],
          codeQuality: {
            coverage: 78,
            maintainability: 85,
            reliability: 82,
            security: 71
          }
        },
        azureDevOps: {
          pipelines: [
            { name: 'Build Pipeline', status: 'succeeded', runs: 189, duration: '8.5 min', successRate: 94 },
            { name: 'Release Pipeline', status: 'succeeded', runs: 156, duration: '12.3 min', successRate: 89 },
            { name: 'Test Pipeline', status: 'partiallySucceeded', runs: 134, duration: '6.2 min', successRate: 91 }
          ],
          releases: {
            total: 45,
            successful: 42,
            failed: 3,
            avgDeployTime: '15.2 minutes'
          },
          workItems: {
            active: 23,
            completed: 156,
            bugs: 8,
            features: 12
          },
          testResults: {
            totalTests: 1247,
            passed: 1156,
            failed: 91,
            coverage: 82
          }
        },
        maturity: [
          { category: 'Source Control', score: 95 },
          { category: 'CI/CD Pipeline', score: 78 },
          { category: 'Automated Testing', score: 65 },
          { category: 'Infrastructure as Code', score: 58 },
          { category: 'Monitoring & Alerting', score: 72 },
          { category: 'Security Integration', score: 55 }
        ],
        cicd: {
          pipelineCount: 23,
          successRate: 87,
          avgBuildTime: 8.5,
          deploymentFrequency: 'Daily',
          leadTime: '2.3 hours',
          mttr: '45 minutes'
        },
        automation: [
          { process: 'Build Process', automated: 90, manual: 10 },
          { process: 'Testing', automated: 65, manual: 35 },
          { process: 'Deployment', automated: 78, manual: 22 },
          { process: 'Infrastructure Provisioning', automated: 45, manual: 55 },
          { process: 'Monitoring Setup', automated: 60, manual: 40 }
        ],
        monitoring: {
          coverage: 82,
          alertsConfigured: 156,
          dashboards: 12,
          uptime: 99.2
        },
        uploadedFiles: [
          { name: 'github-export.json', type: 'github', size: '4.2 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'azure-devops-data.json', type: 'azure-devops', size: '6.8 MB', uploadDate: '2024-01-14', status: 'Processed' }
        ],
        analysis: assessmentSpecificData?.analysis || {
          devopsAnalysis: '',
          pipelineAnalysis: '',
          qualityAnalysis: '',
          modernizationRecommendations: ''
        }
      };
      setDevopsData(mockData);
    } catch (error) {
      console.error('Error loading DevOps data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event, fileType) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const newFile = {
        name: file.name,
        type: fileType,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Processing'
      };
      
      setDevopsData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, newFile]
      }));

      // Simulate processing
      setTimeout(() => {
        setDevopsData(prev => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles.map(f => 
            f.name === file.name ? { ...f, status: 'Processed' } : f
          )
        }));
      }, 2000);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exportAssessment = () => {
    const dataStr = JSON.stringify(devopsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devops-assessment.json';
    link.click();
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setDevopsData(importedData);
        } catch (error) {
          alert('Error importing file: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveAssessment = () => {
    setDataSaved(true);
    setLastSaveTime(new Date());
    const dataStr = JSON.stringify(devopsData, null, 2);
    localStorage.setItem('devops_assessment', dataStr);
    toast.success('Assessment data saved successfully!');
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    // Simulate analysis processing
    setTimeout(() => {
      const analysisResults = {
        devopsAnalysis: `GitHub and Azure DevOps analysis reveals ${devopsData.github?.repositories?.length || 4} active repositories with strong development practices:

• Pull request merge rate: ${devopsData.github?.pullRequests?.mergeRate || 94}% with ${devopsData.github?.pullRequests?.avgReviewTime || '4.2 hours'} average review time
• ${devopsData.azureDevOps?.pipelines?.length || 3} Azure DevOps pipelines with ${devopsData.cicd?.successRate || 87}% success rate
• Code coverage at ${devopsData.github?.codeQuality?.coverage || 78}% across repositories
• Active work items: ${devopsData.azureDevOps?.workItems?.active || 23} with ${devopsData.azureDevOps?.workItems?.bugs || 8} open bugs`,

        pipelineAnalysis: `CI/CD pipeline performance shows areas for optimization:

• Average build time: ${devopsData.cicd?.avgBuildTime || 8.5} minutes with deployment frequency of ${devopsData.cicd?.deploymentFrequency || 'Daily'}
• Lead time from commit to production: ${devopsData.cicd?.leadTime || '2.3 hours'}
• Mean time to recovery (MTTR): ${devopsData.cicd?.mttr || '45 minutes'}
• Test automation at ${devopsData.automation?.find(a => a.process === 'Testing')?.automated || 65}% coverage`,

        qualityAnalysis: `Code quality metrics indicate good practices with improvement opportunities:

• Maintainability index: ${devopsData.github?.codeQuality?.maintainability || 85}%
• Reliability score: ${devopsData.github?.codeQuality?.reliability || 82}%
• Security rating: ${devopsData.github?.codeQuality?.security || 71}% - requires attention
• Test coverage: ${devopsData.azureDevOps?.testResults?.coverage || 82}% with ${devopsData.azureDevOps?.testResults?.failed || 91} failing tests`,

        modernizationRecommendations: `Recommended DevOps modernization strategy:

1. **Phase 1**: Implement Infrastructure as Code to reach 80%+ automation
2. **Phase 2**: Enhance security integration with automated scanning and compliance checks
3. **Phase 3**: Improve test automation coverage to 85%+ and reduce manual testing
4. **Implement**: Advanced monitoring, observability, and automated incident response`
      };

      setDevopsData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setIsAnalyzing(false);
      setShowAnalysisResults(true);
      toast.success('Analysis completed successfully!');
    }, 3000);
  };

  const getMaturityColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passing':
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'failing':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'partiallySucceeded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const repositoryLanguages = [
    { name: 'React', value: 35, color: '#61DAFB' },
    { name: 'Node.js', value: 25, color: '#339933' },
    { name: 'React Native', value: 20, color: '#61DAFB' },
    { name: 'Terraform', value: 20, color: '#623CE4' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">DevOps & Development Assessment</h1>
                <p className="text-blue-100">AI-powered DevOps analysis with GitHub and Azure DevOps integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {dataSaved && lastSaveTime && (
                <div className="text-sm text-blue-200">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Saved {new Date(lastSaveTime).toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={saveAssessment}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 pb-4">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'overview' 
                  ? 'bg-white text-blue-800' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Monitor className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setCurrentView('repo')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'repo' 
                  ? 'bg-white text-blue-800' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Data Sources
            </button>
            <button
              onClick={() => setCurrentView('analyze')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'analyze' 
                  ? 'bg-white text-blue-800' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Brain className="h-4 w-4 inline mr-2" />
              AI Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview View */}
        {currentView === 'overview' && (
          <div className="space-y-6">
      {/* DevOps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <GitBranch className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pipelines</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.pipelineCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.successRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Build Time</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.avgBuildTime}m</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Monitoring Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.monitoring.coverage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maturity Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Maturity Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={devopsData.maturity}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={devopsData.automation} layout="horizontal" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="process" width={150} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="automated" stackId="a" fill="#10b981" name="Automated" radius={[0, 2, 2, 0]} />
              <Bar dataKey="manual" stackId="a" fill="#ef4444" name="Manual" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CI/CD Metrics */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">CI/CD Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Deployment Frequency</h4>
              <p className="text-2xl font-bold text-blue-600">{devopsData.cicd.deploymentFrequency}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Gauge className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Lead Time</h4>
              <p className="text-2xl font-bold text-green-600">{devopsData.cicd.leadTime}</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">MTTR</h4>
              <p className="text-2xl font-bold text-purple-600">{devopsData.cicd.mttr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Maturity Breakdown */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">DevOps Practices Assessment</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {devopsData.maturity.map((practice, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: getMaturityColor(practice.score) }}></div>
                  <h4 className="font-medium text-gray-900">{practice.category}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${practice.score}%`,
                        backgroundColor: getMaturityColor(practice.score)
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{practice.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
          </div>
        )}

        {/* Data Sources (Repo) View */}
        {currentView === 'repo' && (
          <div className="space-y-6">
            
            {/* Import/Export Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
                <div className="flex space-x-3">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Assessment
                    <input
                      type="file"
                      accept=".json"
                      onChange={importAssessment}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={exportAssessment}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Assessment
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Data Source Integration</h3>
                <p className="text-sm text-gray-600">Upload GitHub exports, Azure DevOps data, logs, and pipeline diagrams</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* GitHub Data */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Code className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">GitHub Export</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload GitHub repository and workflow data</p>
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".json,.csv,.zip"
                        onChange={(e) => handleFileUpload(e, 'github')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Azure DevOps Data */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Azure DevOps</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload pipeline data, work items, test results</p>
                    <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".json,.xml,.csv"
                        onChange={(e) => handleFileUpload(e, 'azure-devops')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Pipeline Diagrams & Logs */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Logs & Diagrams</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload build logs, pipeline diagrams</p>
                    <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".txt,.log,.png,.jpg,.pdf,.yml,.yaml"
                        onChange={(e) => handleFileUpload(e, 'logs')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files Table */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devopsData.uploadedFiles?.map((file, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {file.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.uploadDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.status === 'Processed' ? 'bg-green-100 text-green-800' :
                            file.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {file.status === 'Processing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                            {file.status}
                          </span>
                        </td>
                      </tr>
                    )) || []}
                    {(!devopsData.uploadedFiles || devopsData.uploadedFiles.length === 0) && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No files uploaded yet. Upload your data sources to begin analysis.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analysis View */}
        {currentView === 'analyze' && (
          <div className="space-y-6">
            
            {/* Analysis Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered DevOps Analysis</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Run comprehensive analysis on your GitHub and Azure DevOps data
                  </p>
                </div>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isAnalyzing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {showAnalysisResults && (
              <div className="space-y-6">
                {/* DevOps Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
                      DevOps Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {devopsData.analysis?.devopsAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pipeline Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Pipeline Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {devopsData.analysis?.pipelineAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Quality Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {devopsData.analysis?.qualityAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modernization Recommendations */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      Modernization Recommendations
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {devopsData.analysis?.modernizationRecommendations?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Analysis Yet */}
            {!showAnalysisResults && !isAnalyzing && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Upload your data sources in the Data Sources tab, then return here to run AI-powered analysis.
                </p>
                <button
                  onClick={() => setCurrentView('repo')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Go to Data Sources
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default DevOpsAssessment;