// src/components/Architecture/ArchitectureReview.js - Enhanced architecture review with repository analysis
import React, { useState, useEffect } from 'react';
import { 
  Layers, Box, Zap, Link, Database, Shield, Monitor, GitBranch, Github, 
  Plus, Edit3, Save, X, Trash2, Brain, Download, Upload, Eye, EyeOff, Settings,
  Search, RefreshCw, AlertCircle, CheckCircle, Clock, Code, Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

function ArchitectureReview() {
  const [currentView, setCurrentView] = useState('overview'); // overview, repository, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [repositoryConnected, setRepositoryConnected] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  // Architecture analysis data structure
  const [architectureData, setArchitectureData] = useState({
    repositoryInfo: {
      url: '',
      type: 'github', // github, azure-devops, gitlab
      branch: 'main',
      accessToken: '',
      lastAnalyzed: null,
      status: 'disconnected' // disconnected, connecting, connected, error
    },
    codebaseStats: {
      totalFiles: 0,
      linesOfCode: 0,
      languages: [],
      frameworks: [],
      lastCommit: null
    },
    architecturePatterns: [],
    healthMetrics: {
      maintainability: 0,
      complexity: 0,
      coupling: 0,
      cohesion: 0,
      testCoverage: 0,
      technicalDebt: 0
    },
    technologyStack: [],
    codeQuality: {
      codeSmells: 0,
      duplicatedLines: 0,
      vulnerabilities: 0,
      bugs: 0,
      securityHotspots: 0
    },
    dependencies: [],
    analysis: {
      architectureAnalysis: '',
      healthAnalysis: '',
      patternsAnalysis: '',
      technologyAnalysis: '',
      maintainabilityAnalysis: '',
      recommendationsAnalysis: ''
    }
  });

  // Load saved data on component mount
  useEffect(() => {
    loadArchitectureData();
  }, []);

  const loadArchitectureData = () => {
    const savedData = localStorage.getItem('architectureReviewData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setArchitectureData(parsed);
        if (parsed.repositoryInfo.status === 'connected') {
          setRepositoryConnected(true);
        }
        setDataSaved(true);
        setLastSaveTime(new Date());
      } catch (error) {
        console.error('Error loading architecture data:', error);
        toast.error('Error loading saved data');
      }
    }
  };

  const saveArchitectureData = () => {
    try {
      localStorage.setItem('architectureReviewData', JSON.stringify(architectureData));
      setDataSaved(true);
      setLastSaveTime(new Date());
      console.log('ARCH SAVE: dataSaved set to true, repositoryConnected:', repositoryConnected);
      toast.success('Architecture data saved successfully');
    } catch (error) {
      console.error('Error saving architecture data:', error);
      toast.error('Error saving data');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(architectureData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'architecture-review-analysis.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Architecture data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setArchitectureData(importedData);
          if (importedData.repositoryInfo.status === 'connected') {
            setRepositoryConnected(true);
          }
          setDataSaved(true);
          setLastSaveTime(new Date());
          toast.success('Architecture data imported successfully');
        } catch (error) {
          toast.error('Error importing data - invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  // Repository Connection Functions
  const connectRepository = async () => {
    if (!architectureData.repositoryInfo.url) {
      toast.error('Please enter a repository URL');
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate repository connection and initial scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCodebaseStats = {
        totalFiles: 247,
        linesOfCode: 45678,
        languages: [
          { name: 'JavaScript', percentage: 45, files: 89 },
          { name: 'TypeScript', percentage: 25, files: 67 },
          { name: 'CSS', percentage: 15, files: 34 },
          { name: 'HTML', percentage: 10, files: 23 },
          { name: 'Python', percentage: 5, files: 12 }
        ],
        frameworks: [
          { name: 'React', version: '18.2.0', usage: 'Frontend' },
          { name: 'Node.js', version: '18.17.0', usage: 'Backend' },
          { name: 'Express', version: '4.18.2', usage: 'API Server' },
          { name: 'Tailwind CSS', version: '3.3.0', usage: 'Styling' }
        ],
        lastCommit: new Date().toISOString()
      };

      setArchitectureData(prev => ({
        ...prev,
        repositoryInfo: {
          ...prev.repositoryInfo,
          status: 'connected',
          lastAnalyzed: new Date().toISOString()
        },
        codebaseStats: mockCodebaseStats
      }));

      setRepositoryConnected(true);
      setDataSaved(false); // Mark as unsaved when new repository data is connected
      toast.success('Repository connected successfully');
    } catch (error) {
      console.error('Error connecting repository:', error);
      setArchitectureData(prev => ({
        ...prev,
        repositoryInfo: { ...prev.repositoryInfo, status: 'error' }
      }));
      toast.error('Failed to connect to repository');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectRepository = () => {
    setArchitectureData(prev => ({
      ...prev,
      repositoryInfo: {
        ...prev.repositoryInfo,
        status: 'disconnected'
      },
      codebaseStats: {
        totalFiles: 0,
        linesOfCode: 0,
        languages: [],
        frameworks: [],
        lastCommit: null
      }
    }));
    setRepositoryConnected(false);
    toast.success('Repository disconnected');
  };

  const refreshRepository = async () => {
    if (!repositoryConnected) return;
    
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setArchitectureData(prev => ({
        ...prev,
        repositoryInfo: {
          ...prev.repositoryInfo,
          lastAnalyzed: new Date().toISOString()
        }
      }));
      toast.success('Repository data refreshed');
    } catch (error) {
      toast.error('Failed to refresh repository');
    } finally {
      setIsConnecting(false);
    }
  };

  // LLM Analysis Integration
  const runArchitectureAnalysis = async () => {
    if (!repositoryConnected) {
      toast.error('Please connect a repository first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate comprehensive architecture analysis
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockAnalysisData = {
        architecturePatterns: [
          { pattern: 'Component-Based Architecture', usage: 85, quality: 'Good', recommendation: 'Continue with current approach' },
          { pattern: 'Layered Architecture', usage: 70, quality: 'Fair', recommendation: 'Consider refactoring for better separation' },
          { pattern: 'MVC Pattern', usage: 60, quality: 'Good', recommendation: 'Well implemented' },
          { pattern: 'Repository Pattern', usage: 45, quality: 'Poor', recommendation: 'Implement for better data abstraction' },
          { pattern: 'Microservices', usage: 20, quality: 'Fair', recommendation: 'Consider for scalability' }
        ],
        healthMetrics: {
          maintainability: 72,
          complexity: 68,
          coupling: 75,
          cohesion: 80,
          testCoverage: 65,
          technicalDebt: 23
        },
        technologyStack: [
          { category: 'Frontend Framework', technology: 'React', version: '18.2.0', status: 'Current', risk: 'Low' },
          { category: 'Backend Runtime', technology: 'Node.js', version: '18.17.0', status: 'Current', risk: 'Low' },
          { category: 'Database', technology: 'PostgreSQL', version: '15.0', status: 'Current', risk: 'Low' },
          { category: 'Build Tool', technology: 'Webpack', version: '5.88.0', status: 'Current', risk: 'Medium' },
          { category: 'Testing Framework', technology: 'Jest', version: '28.1.0', status: 'Current', risk: 'Low' }
        ],
        codeQuality: {
          codeSmells: 47,
          duplicatedLines: 2.3,
          vulnerabilities: 3,
          bugs: 8,
          securityHotspots: 5
        },
        dependencies: [
          { name: 'lodash', version: '4.17.21', risk: 'Low', outdated: false },
          { name: 'moment', version: '2.29.4', risk: 'High', outdated: true, recommendation: 'Migrate to day.js' },
          { name: 'axios', version: '1.4.0', risk: 'Low', outdated: false },
          { name: 'express', version: '4.18.2', risk: 'Low', outdated: false }
        ],
        analysis: {
          architectureAnalysis: `The codebase demonstrates a well-structured component-based architecture with React as the primary frontend framework. The separation of concerns is generally good, with clear boundaries between UI components, business logic, and data access layers. However, there are opportunities to improve the implementation of certain patterns, particularly the repository pattern for data access abstraction.`,
          
          healthAnalysis: `Overall architecture health is moderate with a maintainability score of 72/100. The complexity metrics indicate manageable code complexity, but there are areas where refactoring could improve long-term maintainability. Test coverage at 65% is acceptable but could be improved for critical business logic components.`,
          
          patternsAnalysis: `The application effectively uses component-based architecture and MVC patterns. However, the repository pattern implementation is inconsistent across the codebase. Consider standardizing data access patterns and implementing proper dependency injection to improve testability and maintainability.`,
          
          technologyAnalysis: `The technology stack is modern and well-maintained with current versions of major dependencies. React 18.2.0 and Node.js 18.17.0 provide a solid foundation. However, consider migrating from Webpack to Vite for improved build performance and developer experience.`,
          
          maintainabilityAnalysis: `Code maintainability is hindered by moderate coupling between components and inconsistent coding patterns. Implementing stricter TypeScript usage, improving error handling patterns, and establishing consistent state management would significantly improve maintainability scores.`,
          
          recommendationsAnalysis: `1. Implement comprehensive repository pattern for data access
2. Increase test coverage to 80%+ focusing on business logic
3. Migrate from Moment.js to Day.js for better performance
4. Establish consistent error handling patterns
5. Consider implementing dependency injection container
6. Improve TypeScript coverage to 90%+
7. Implement automated code quality gates in CI/CD
8. Consider architectural decision records (ADRs) for major decisions`
        }
      };
      
      setArchitectureData(prev => ({
        ...prev,
        architecturePatterns: mockAnalysisData.architecturePatterns,
        healthMetrics: mockAnalysisData.healthMetrics,
        technologyStack: mockAnalysisData.technologyStack,
        codeQuality: mockAnalysisData.codeQuality,
        dependencies: mockAnalysisData.dependencies,
        analysis: mockAnalysisData.analysis
      }));
      
      setShowAnalysisResults(true);
      toast.success('Architecture analysis completed successfully');
    } catch (error) {
      console.error('Error running architecture analysis:', error);
      toast.error('Error running architecture analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chart colors and utilities
  const patternColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const healthColors = ['#10B981', '#F59E0B', '#EF4444'];
  
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'connecting': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <X className="h-4 w-4 text-gray-400" />;
    }
  };

  // Radar chart data for architecture health
  const radarData = [
    { subject: 'Maintainability', A: architectureData.healthMetrics.maintainability, fullMark: 100 },
    { subject: 'Complexity', A: 100 - architectureData.healthMetrics.complexity, fullMark: 100 },
    { subject: 'Coupling', A: architectureData.healthMetrics.coupling, fullMark: 100 },
    { subject: 'Cohesion', A: architectureData.healthMetrics.cohesion, fullMark: 100 },
    { subject: 'Test Coverage', A: architectureData.healthMetrics.testCoverage, fullMark: 100 },
    { subject: 'Tech Debt', A: 100 - architectureData.healthMetrics.technicalDebt, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Architecture Review & Analysis</h2>
            <p className="text-purple-100 mt-1">
              Comprehensive codebase analysis with AI-powered architecture insights
            </p>
          </div>
          <Layers className="h-12 w-12 text-purple-200" />
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'overview' 
                ? 'bg-white text-purple-800' 
                : 'text-purple-100 hover:text-white hover:bg-purple-700'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setCurrentView('repository')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'repository' 
                ? 'bg-white text-purple-800' 
                : 'text-purple-100 hover:text-white hover:bg-purple-700'
            }`}
          >
            <GitBranch className="h-4 w-4 inline mr-2" />
            Repository
          </button>
          <button
            onClick={() => setCurrentView('analyze')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'analyze' 
                ? 'bg-white text-purple-800' 
                : 'text-purple-100 hover:text-white hover:bg-purple-700'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            AI Analysis
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-3">
          <button
            onClick={saveArchitectureData}
            className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
              !dataSaved 
                ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {!dataSaved ? 'Save Data (Required)' : 'Save Data'}
          </button>
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <label className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex items-center space-x-4">
          {repositoryConnected && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {getStatusIcon(architectureData.repositoryInfo.status)}
              <span>Repository Connected</span>
            </div>
          )}
          <div className="text-sm text-gray-500">
            {dataSaved && lastSaveTime 
              ? `Last saved: ${lastSaveTime.toLocaleString()}`
              : 'Not saved yet'
            }
          </div>
        </div>
      </div>

      {/* Overview View */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lines of Code</p>
                  <p className="text-2xl font-bold text-gray-900">{architectureData.codebaseStats.linesOfCode.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{architectureData.codebaseStats.totalFiles}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <Monitor className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintainability</p>
                  <p className="text-2xl font-bold text-gray-900">{architectureData.healthMetrics.maintainability}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Code Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{architectureData.codeQuality.codeSmells + architectureData.codeQuality.bugs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {architectureData.codebaseStats.languages.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={architectureData.codebaseStats.languages}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="percentage"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {architectureData.codebaseStats.languages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={patternColors[index % patternColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Architecture Health Radar */}
              {architectureData.healthMetrics.maintainability > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Architecture Health</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {!repositoryConnected && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Repository Connected</h3>
              <p className="text-gray-500 mb-4">Connect your repository to start architecture analysis.</p>
              <button
                onClick={() => setCurrentView('repository')}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Connect Repository
              </button>
            </div>
          )}
        </div>
      )}

      {/* Repository View */}
      {currentView === 'repository' && (
        <div className="space-y-6">
          {/* Repository Connection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Connection</h3>
            
            {!repositoryConnected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Repository Type</label>
                    <select
                      value={architectureData.repositoryInfo.type}
                      onChange={(e) => setArchitectureData(prev => ({
                        ...prev,
                        repositoryInfo: { ...prev.repositoryInfo, type: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="github">GitHub</option>
                      <option value="azure-devops">Azure DevOps</option>
                      <option value="gitlab">GitLab</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      value={architectureData.repositoryInfo.branch}
                      onChange={(e) => setArchitectureData(prev => ({
                        ...prev,
                        repositoryInfo: { ...prev.repositoryInfo, branch: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="main"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={architectureData.repositoryInfo.url}
                    onChange={(e) => setArchitectureData(prev => ({
                      ...prev,
                      repositoryInfo: { ...prev.repositoryInfo, url: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://github.com/username/repository"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Token (Optional)</label>
                  <input
                    type="password"
                    value={architectureData.repositoryInfo.accessToken}
                    onChange={(e) => setArchitectureData(prev => ({
                      ...prev,
                      repositoryInfo: { ...prev.repositoryInfo, accessToken: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Personal access token for private repositories"
                  />
                </div>
                
                <button
                  onClick={connectRepository}
                  disabled={isConnecting || !architectureData.repositoryInfo.url}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <GitBranch className="h-4 w-4 mr-2" />
                      Connect Repository
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Repository Connected</p>
                      <p className="text-sm text-green-600">{architectureData.repositoryInfo.url}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={refreshRepository}
                      disabled={isConnecting}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isConnecting ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button
                      onClick={disconnectRepository}
                      className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Disconnect
                    </button>
                  </div>
                </div>
                
                {/* Repository Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Total Files</h4>
                    <p className="text-2xl font-bold text-blue-600">{architectureData.codebaseStats.totalFiles}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Lines of Code</h4>
                    <p className="text-2xl font-bold text-green-600">{architectureData.codebaseStats.linesOfCode.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">Languages</h4>
                    <p className="text-2xl font-bold text-purple-600">{architectureData.codebaseStats.languages.length}</p>
                  </div>
                </div>
                
                {/* Languages Breakdown */}
                {architectureData.codebaseStats.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Language Breakdown</h4>
                    <div className="space-y-2">
                      {architectureData.codebaseStats.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: patternColors[index % patternColors.length] }}
                            ></div>
                            <span className="font-medium text-gray-900">{lang.name}</span>
                            <span className="text-sm text-gray-500">({lang.files} files)</span>
                          </div>
                          <span className="font-medium text-gray-900">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Frameworks */}
                {architectureData.codebaseStats.frameworks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Detected Frameworks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {architectureData.codebaseStats.frameworks.map((framework, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium text-gray-900">{framework.name}</p>
                            <p className="text-sm text-gray-500">{framework.usage}</p>
                          </div>
                          <span className="text-sm font-medium text-blue-600">v{framework.version}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Analysis View */}
      {currentView === 'analyze' && (
        <div className="space-y-6">
          {/* Analysis Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Architecture Analysis</h3>
                <p className="text-gray-500 mt-1">
                  Comprehensive codebase analysis for architecture patterns, health metrics, and recommendations
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAnalysisResults(!showAnalysisResults)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  {showAnalysisResults ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Results
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Results
                    </>
                  )}
                </button>
                <button
                  onClick={runArchitectureAnalysis}
                  disabled={isAnalyzing || !repositoryConnected || !dataSaved}
                  className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
                    isAnalyzing || !repositoryConnected || !dataSaved
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                  }`}
                  title={`Debug: analyzing=${isAnalyzing}, repo=${repositoryConnected}, saved=${dataSaved}`}
                >
                  {isAnalyzing ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
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

            {(!repositoryConnected || !dataSaved) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">
                  {!repositoryConnected 
                    ? 'Please connect a repository in the "Repository" section before running analysis.'
                    : !dataSaved
                    ? 'Please save your repository data before running analysis.'
                    : 'Please connect a repository and save data before running analysis.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {showAnalysisResults && architectureData.analysis.architectureAnalysis && (
            <div className="space-y-6">
              {/* Architecture Health Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className={`p-4 rounded-lg ${getHealthColor(architectureData.healthMetrics.maintainability)}`}>
                  <h4 className="font-medium">Maintainability</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.maintainability}</p>
                </div>
                <div className={`p-4 rounded-lg ${getHealthColor(100 - architectureData.healthMetrics.complexity)}`}>
                  <h4 className="font-medium">Complexity</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.complexity}</p>
                </div>
                <div className={`p-4 rounded-lg ${getHealthColor(architectureData.healthMetrics.coupling)}`}>
                  <h4 className="font-medium">Coupling</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.coupling}</p>
                </div>
                <div className={`p-4 rounded-lg ${getHealthColor(architectureData.healthMetrics.cohesion)}`}>
                  <h4 className="font-medium">Cohesion</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.cohesion}</p>
                </div>
                <div className={`p-4 rounded-lg ${getHealthColor(architectureData.healthMetrics.testCoverage)}`}>
                  <h4 className="font-medium">Test Coverage</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.testCoverage}%</p>
                </div>
                <div className={`p-4 rounded-lg ${getHealthColor(100 - architectureData.healthMetrics.technicalDebt)}`}>
                  <h4 className="font-medium">Tech Debt</h4>
                  <p className="text-2xl font-bold">{architectureData.healthMetrics.technicalDebt}%</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Architecture Patterns */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Architecture Patterns Usage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={architectureData.architecturePatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pattern" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#8B5CF6" name="Usage %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Code Quality Issues */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Quality Issues</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Code Smells', value: architectureData.codeQuality.codeSmells },
                      { name: 'Bugs', value: architectureData.codeQuality.bugs },
                      { name: 'Vulnerabilities', value: architectureData.codeQuality.vulnerabilities },
                      { name: 'Security Hotspots', value: architectureData.codeQuality.securityHotspots }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Architecture Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Architecture Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{architectureData.analysis.architectureAnalysis}</p>
                </div>
              </div>

              {/* Health Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{architectureData.analysis.healthAnalysis}</p>
                </div>
              </div>

              {/* Patterns Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patterns Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{architectureData.analysis.patternsAnalysis}</p>
                </div>
              </div>

              {/* Technology Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{architectureData.analysis.technologyAnalysis}</p>
                </div>
                
                {/* Technology Stack Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {architectureData.technologyStack.map((tech, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tech.technology}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.version}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(tech.risk)}`}>
                              {tech.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maintainability Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintainability Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{architectureData.analysis.maintainabilityAnalysis}</p>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-line">{architectureData.analysis.recommendationsAnalysis}</div>
                </div>
              </div>

              {/* Dependencies Analysis */}
              {architectureData.dependencies.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {architectureData.dependencies.map((dep, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dep.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dep.version}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(dep.risk)}`}>
                                {dep.risk}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dep.outdated ? 'Outdated' : 'Current'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{dep.recommendation || 'No action needed'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {!showAnalysisResults && architectureData.analysis.architectureAnalysis && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Complete</h3>
              <p className="text-gray-500 mb-4">Architecture analysis has been completed. Click "Show Results" to view detailed insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ArchitectureReview;