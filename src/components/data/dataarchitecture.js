// src/components/Data/DataArchitecture.js - Data architecture assessment
import React, { useState, useEffect } from 'react';
import { 
  Database, GitBranch, BarChart3, Clock, Upload, Download, Save, FileText, Image, 
  Shield, Zap, DollarSign, RefreshCw, Brain, Activity, Server, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

function DataArchitecture() {
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  const [dataArchData, setDataArchData] = useState({
    microsoftDMA: {
      databases: [],
      assessments: [],
      compatibility: {},
      recommendations: []
    },
    databases: [],
    integration: [],
    dataFlow: [],
    quality: {},
    uploadedFiles: [],
    analysis: {
      databaseAnalysis: '',
      migrationAnalysis: '',
      performanceAnalysis: '',
      modernizationRecommendations: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDataArchitectureData();
  }, []);

  const loadDataArchitectureData = async () => {
    try {
      setLoading(true);
      const mockData = {
        microsoftDMA: {
          databases: [
            { name: 'ProductionDB', type: 'SQL Server 2014', size: '250 GB', compatibility: 'Azure SQL DB', readiness: 85, issues: 3 },
            { name: 'AnalyticsDB', type: 'SQL Server 2012', size: '1.2 TB', compatibility: 'Azure SQL MI', readiness: 65, issues: 8 },
            { name: 'ReportingDB', type: 'SQL Server 2016', size: '180 GB', compatibility: 'Azure SQL DB', readiness: 92, issues: 1 },
            { name: 'ArchiveDB', type: 'SQL Server 2008', size: '500 GB', compatibility: 'Azure SQL MI', readiness: 45, issues: 15 }
          ],
          compatibility: { 
            azureSQLDB: 40, 
            azureSQLMI: 35, 
            sqlServerOnVM: 25 
          },
          recommendations: [
            'Upgrade SQL Server 2008 instances before migration',
            'Consider Azure SQL Managed Instance for complex databases',
            'Implement automated backup strategies for critical databases'
          ]
        },
        databases: [
          { type: 'SQL Server', count: 8, usage: 'OLTP', performance: 85 },
          { type: 'Oracle', count: 3, usage: 'Data Warehouse', performance: 78 },
          { type: 'PostgreSQL', count: 5, usage: 'Analytics', performance: 92 },
          { type: 'MongoDB', count: 4, usage: 'Document Store', performance: 88 },
          { type: 'Redis', count: 6, usage: 'Cache', performance: 95 }
        ],
        integration: [
          { pattern: 'REST APIs', count: 15, complexity: 'Low' },
          { pattern: 'Message Queues', count: 8, complexity: 'Medium' },
          { pattern: 'ETL Batch', count: 12, complexity: 'High' },
          { pattern: 'Real-time Streaming', count: 3, complexity: 'High' },
          { pattern: 'File Transfer', count: 6, complexity: 'Low' }
        ],
        dataFlow: [
          { month: 'Jan', volume: 2.4, latency: 120 },
          { month: 'Feb', volume: 2.8, latency: 115 },
          { month: 'Mar', volume: 3.2, latency: 110 },
          { month: 'Apr', volume: 3.6, latency: 105 },
          { month: 'May', volume: 4.1, latency: 100 },
          { month: 'Jun', volume: 4.5, latency: 95 }
        ],
        quality: {
          completeness: 85,
          accuracy: 78,
          consistency: 82,
          timeliness: 75,
          validity: 88
        },
        uploadedFiles: [
          { name: 'dma-assessment-results.json', type: 'dma', size: '3.2 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'sql-server-logs.txt', type: 'log', size: '5.1 MB', uploadDate: '2024-01-14', status: 'Processed' }
        ],
        analysis: assessmentSpecificData?.analysis || {
          databaseAnalysis: '',
          migrationAnalysis: '',
          performanceAnalysis: '',
          modernizationRecommendations: ''
        }
      };
      setDataArchData(mockData);
    } catch (error) {
      console.error('Error loading data architecture data:', error);
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
      
      setDataArchData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, newFile]
      }));

      // Simulate processing
      setTimeout(() => {
        setDataArchData(prev => ({
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
    const dataStr = JSON.stringify(dataArchData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-architecture-assessment.json';
    link.click();
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setDataArchData(importedData);
        } catch (error) {
          alert('Error importing file: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveAssessment = async () => {
    try {
      if (!currentAssessment?.id) {
        toast.error('No assessment selected. Please select an assessment first.');
        return;
      }
      
      setDataSaved(true);
      setLastSaveTime(new Date());
      
      // Save to database via API (placeholder for actual implementation)
      console.log('DATA ARCHITECTURE: Saving assessment data for:', currentAssessment.id, dataArchData);
      
      // Also save to localStorage as backup
      const dataStr = JSON.stringify(dataArchData, null, 2);
      localStorage.setItem(`data_architecture_assessment_${currentAssessment.id}`, dataStr);
      
      toast.success(`Data architecture assessment saved for "${currentAssessment.name}"!`);
    } catch (error) {
      console.error('Error saving data architecture assessment:', error);
      toast.error('Failed to save assessment data');
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    // Simulate analysis processing
    setTimeout(() => {
      const analysisResults = {
        databaseAnalysis: `Microsoft DMA assessment reveals ${dataArchData.microsoftDMA?.databases?.length || 4} databases requiring migration planning:

• ${dataArchData.microsoftDMA?.compatibility?.azureSQLDB || 40}% suitable for Azure SQL Database
• ${dataArchData.microsoftDMA?.compatibility?.azureSQLMI || 35}% require Azure SQL Managed Instance
• Legacy SQL Server versions detected with significant compatibility issues
• Database sizes range from 180 GB to 1.2 TB requiring careful migration planning`,

        migrationAnalysis: `Migration complexity analysis shows mixed readiness levels:

• High readiness databases (>80%): Ready for immediate migration
• Medium readiness (60-80%): Require minor modifications before migration
• Low readiness (<60%): Need significant refactoring or version upgrades
• Critical path: Upgrade SQL Server 2008 instances to supported versions`,

        performanceAnalysis: `Current database performance shows optimization opportunities:

• SQL Server instances averaging 85% performance efficiency
• Data volume trending upward at 15% monthly growth
• Latency improvements of 25ms achieved through recent optimizations
• Integration patterns show 12 high-complexity ETL processes requiring modernization`,

        modernizationRecommendations: `Recommended data modernization strategy:

1. **Phase 1**: Migrate high-readiness databases to Azure SQL Database
2. **Phase 2**: Upgrade and migrate medium-complexity databases to Azure SQL MI
3. **Phase 3**: Modernize legacy systems with cloud-native data services
4. **Implement**: Real-time analytics, automated backup, and disaster recovery solutions`
      };

      setDataArchData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setIsAnalyzing(false);
      setShowAnalysisResults(true);
      toast.success('Analysis completed successfully!');
    }, 3000);
  };

  const dbColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'bg-green-500';
    if (performance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReadinessColor = (readiness) => {
    if (readiness >= 80) return 'bg-green-500';
    if (readiness >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const compatibilityColors = ['#3B82F6', '#10B981', '#F59E0B'];
  const compatibilityData = [
    { name: 'Azure SQL DB', value: dataArchData.microsoftDMA?.compatibility?.azureSQLDB || 40 },
    { name: 'Azure SQL MI', value: dataArchData.microsoftDMA?.compatibility?.azureSQLMI || 35 },
    { name: 'SQL Server VM', value: dataArchData.microsoftDMA?.compatibility?.sqlServerOnVM || 25 }
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
              <Database className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Data Architecture Assessment</h1>
                <p className="text-blue-100">AI-powered database analysis with Microsoft DMA integration</p>
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
              <BarChart3 className="h-4 w-4 inline mr-2" />
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
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">DMA Databases</p>
                    <p className="text-2xl font-bold text-gray-900">{dataArchData.microsoftDMA?.databases?.length || 4}</p>
                    <p className="text-xs text-gray-500">Analyzed by Microsoft DMA</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Azure SQL Ready</p>
                    <p className="text-2xl font-bold text-gray-900">{dataArchData.microsoftDMA?.compatibility?.azureSQLDB || 40}%</p>
                    <p className="text-xs text-gray-500">Direct migration capable</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Migration Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{dataArchData.microsoftDMA?.databases?.reduce((sum, db) => sum + (db.issues || 0), 0) || 27}</p>
                    <p className="text-xs text-gray-500">Identified by DMA</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Data (TB)</p>
                    <p className="text-2xl font-bold text-gray-900">2.13</p>
                    <p className="text-xs text-gray-500">Across all databases</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Microsoft DMA Compatibility */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Microsoft DMA - Azure Compatibility</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={compatibilityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {compatibilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={compatibilityColors[index % compatibilityColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Compatibility']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Database Technology Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Technology Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataArchData.databases}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {dataArchData.databases.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={dbColors[index % dbColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Microsoft DMA Assessment Results */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Microsoft DMA - Database Assessment Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Database Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Azure Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Readiness
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issues
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataArchData.microsoftDMA?.databases?.map((db, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {db.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {db.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {db.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {db.compatibility}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full ${getReadinessColor(db.readiness)}`}
                                style={{ width: `${db.readiness}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{db.readiness}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            db.issues === 0 ? 'bg-green-100 text-green-800' :
                            db.issues <= 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {db.issues} issues
                          </span>
                        </td>
                      </tr>
                    )) || []}
                  </tbody>
                </table>
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
                <p className="text-sm text-gray-600">Upload Microsoft DMA results, SQL logs, documentation, and data modeling diagrams</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Microsoft DMA Results */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Microsoft DMA</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload DMA assessment results</p>
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".json,.xml,.csv"
                        onChange={(e) => handleFileUpload(e, 'dma')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* SQL Logs */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">SQL Logs</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload SQL Server logs, query performance data</p>
                    <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".txt,.log,.csv,.sql"
                        onChange={(e) => handleFileUpload(e, 'log')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Data Modeling Diagrams */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Data Models & ERDs</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload data models, ERDs, documentation</p>
                    <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf,.vsd,.docx,.erd"
                        onChange={(e) => handleFileUpload(e, 'diagram')}
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
                    {dataArchData.uploadedFiles?.map((file, index) => (
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
                    {(!dataArchData.uploadedFiles || dataArchData.uploadedFiles.length === 0) && (
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
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered Database Analysis</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Run comprehensive analysis on your uploaded data and Microsoft DMA assessment
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
                {/* Database Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-blue-600" />
                      Database Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {dataArchData.analysis?.databaseAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Migration Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Migration Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {dataArchData.analysis?.migrationAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Performance Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {dataArchData.analysis?.performanceAnalysis?.split('\\n').map((line, index) => (
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
                      {dataArchData.analysis?.modernizationRecommendations?.split('\\n').map((line, index) => (
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

export default DataArchitecture;