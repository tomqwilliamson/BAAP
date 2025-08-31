// src/components/DevOps/DevOpsAssessment.js - DevOps practices assessment
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Play, Zap, Monitor, Package, Gauge, Upload, Download, Save, FileText, Image,
  Shield, Brain, RefreshCw, Clock, Users, Code, AlertTriangle, CheckCircle, Activity,
  Trash2, TrendingUp, Network, Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
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
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [insights, setInsights] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState('documents');
  const [dragOver, setDragOver] = useState(false);
  
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
    loadDocuments();
    loadInsights();
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

  // Document management functions
  const documentTypes = [
    'DevOps Documentation',
    'Technical Architecture', 
    'Business Requirements',
    'Infrastructure Documentation',
    'Security Documentation',
    'Data Architecture',
    'Project Management',
    'Compliance & Governance'
  ];

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/document');
      const data = await response.json();
      // Filter for devops-related documents
      const devopsDocs = data.filter(doc => 
        doc.documentType === 'DevOps Documentation' || 
        doc.documentType === 'Technical Architecture' ||
        doc.category === 'devops'
      );
      setDocuments(devopsDocs);
    } catch (error) {
      console.error('Error loading devops documents:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await fetch('/api/document/analyze-relationships', {
        method: 'POST'
      });
      const data = await response.json();
      // Filter insights for devops-related documents
      const devopsInsights = data.filter(insight => 
        insight.analysisCategory === 'DevOps' ||
        insight.analysisCategory === 'Development' ||
        insight.documentType === 'DevOps Documentation'
      );
      setInsights(devopsInsights);
    } catch (error) {
      console.error('Error loading devops insights:', error);
    }
  };

  const handleDocumentUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ fileName: file.name, progress: 0 });
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', 'DevOps Documentation');
        formData.append('category', 'devops');
        
        const response = await fetch('/api/document/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          setUploadProgress({ fileName: file.name, progress: 100, status: 'completed' });
          await loadDocuments();
          await loadInsights();
          toast.success(`${file.name} uploaded successfully`);
        } else {
          setUploadProgress({ fileName: file.name, progress: 0, status: 'error' });
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress({ fileName: file.name, progress: 0, status: 'error' });
        toast.error(`Error uploading ${file.name}`);
      }
    }
    
    setTimeout(() => setUploadProgress(null), 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleDocumentUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await fetch(`/api/document/${documentId}`, { method: 'DELETE' });
      await loadDocuments();
      await loadInsights();
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting document');
    }
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      'Business Requirements': 'bg-blue-100 text-blue-800',
      'Technical Architecture': 'bg-green-100 text-green-800',
      'Infrastructure Documentation': 'bg-purple-100 text-purple-800',
      'Security Documentation': 'bg-red-100 text-red-800',
      'Data Architecture': 'bg-yellow-100 text-yellow-800',
      'DevOps Documentation': 'bg-indigo-100 text-indigo-800',
      'Project Management': 'bg-pink-100 text-pink-800',
      'Compliance & Governance': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
                <h2 className="text-lg font-semibold text-gray-900">DevOps Document Management</h2>
                <div className="flex space-x-3">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.csv,.json,.yml,.yaml,.xml,.zip"
                    onChange={(e) => handleDocumentUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
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

            {/* Upload Progress */}
            {uploadProgress && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    {uploadProgress.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : uploadProgress.status === 'error' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="text-sm">
                      {uploadProgress.status === 'completed' ? 'Uploaded: ' : 
                       uploadProgress.status === 'error' ? 'Failed: ' : 'Uploading: '}
                      {uploadProgress.fileName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Type Guidance */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">DevOps Data Source Integration</h3>
                <p className="text-sm text-gray-600">Upload specific DevOps documents for comprehensive analysis</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* GitHub Export Data */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Code className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">GitHub Export</h4>
                    <p className="text-sm text-gray-600 mb-4">Repository data, workflow history, pull requests, code quality metrics, branch protection rules</p>
                  </div>

                  {/* Azure DevOps Data */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Azure DevOps</h4>
                    <p className="text-sm text-gray-600 mb-4">Pipeline definitions, build/release history, work items, test results, board configurations</p>
                  </div>

                  {/* Logs & Diagrams */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Logs & Diagrams</h4>
                    <p className="text-sm text-gray-600 mb-4">Build logs, deployment logs, pipeline diagrams, monitoring dashboards, YAML definitions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Or drag and drop DevOps documents here</p>
              <p className="text-sm text-gray-500">
                GitHub exports • Azure DevOps data • Pipeline logs • YAML files • Diagrams
              </p>
            </div>

            <Tabs value={selectedDocumentTab} onValueChange={setSelectedDocumentTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{doc.fileName}</h3>
                              <Badge className={getDocumentTypeColor(doc.documentType)}>
                                {doc.documentType}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{doc.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{formatFileSize(doc.sizeBytes)}</span>
                              <span>{doc.chunks?.length || 0} chunks</span>
                              <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            {doc.keyFindings && doc.keyFindings.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700 mb-1">Key Findings:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {doc.keyFindings.slice(0, 3).map((finding, idx) => (
                                    <li key={idx}>• {finding}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {documents.length === 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          No DevOps documents uploaded yet. Upload some documents to get started!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid gap-4">
                  {insights.map((insight, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            insight.analysisCategory === 'DevOps' ? 'bg-blue-100' :
                            insight.analysisCategory === 'Development' ? 'bg-green-100' :
                            'bg-gray-100'
                          }`}>
                            <Network className={`h-4 w-4 ${
                              insight.analysisCategory === 'DevOps' ? 'text-blue-600' :
                              insight.analysisCategory === 'Development' ? 'text-green-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{insight.insight}</h3>
                            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Category: {insight.analysisCategory}</span>
                              <span>Confidence: {insight.confidence}%</span>
                              <span>Documents: {insight.relatedDocuments?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {insights.length === 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          No insights available yet. Upload documents to generate AI-powered insights!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

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