// src/components/Infrastructure/InfrastructureAssessment.js - Infrastructure assessment
import React, { useState, useEffect } from 'react';
import { 
  Cloud, Server, Database, Zap, Activity, HardDrive, Wifi, Shield, 
  Upload, Download, Save, FileText, Image, BarChart3, AlertTriangle,
  CheckCircle, Clock, DollarSign, Users, Settings, RefreshCw, Brain
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';

function InfrastructureAssessment() {
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  const [assessmentData, setAssessmentData] = useState({
    azureMigrate: {
      servers: [],
      applications: [],
      dependencies: [],
      readiness: {},
      costs: {}
    },
    hosting: [],
    utilization: [],
    cloudReadiness: [],
    scalability: {},
    uploadedFiles: [],
    architectureDiagrams: [],
    analysis: {
      infrastructureAnalysis: '',
      costOptimizationAnalysis: '',
      securityAnalysis: '',
      modernizationRecommendations: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssessmentData();
  }, []);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      // Mock infrastructure data
      const mockData = {
        azureMigrate: {
          servers: [
            { name: 'WEB-SRV-01', os: 'Windows Server 2019', cpu: 4, memory: 16, storage: 500, readiness: 95, complexity: 'Low', monthlyCost: 245 },
            { name: 'DB-SRV-01', os: 'Windows Server 2016', cpu: 8, memory: 32, storage: 1000, readiness: 78, complexity: 'Medium', monthlyCost: 485 },
            { name: 'APP-SRV-01', os: 'RHEL 8', cpu: 6, memory: 24, storage: 750, readiness: 88, complexity: 'Low', monthlyCost: 365 },
            { name: 'FILE-SRV-01', os: 'Windows Server 2012', cpu: 2, memory: 8, storage: 2000, readiness: 45, complexity: 'High', monthlyCost: 195 },
            { name: 'MAIL-SRV-01', os: 'Windows Server 2019', cpu: 4, memory: 16, storage: 300, readiness: 82, complexity: 'Medium', monthlyCost: 275 }
          ],
          readiness: { ready: 45, conditional: 35, notReady: 20 },
          costs: { current: 12450, azureEstimate: 8960, savings: 3490, paybackMonths: 18 }
        },
        hosting: [
          { name: 'On-Premises', count: 12, percentage: 60 },
          { name: 'AWS', count: 5, percentage: 25 },
          { name: 'Azure', count: 2, percentage: 10 },
          { name: 'Hybrid', count: 1, percentage: 5 }
        ],
        utilization: [
          { name: 'CPU', current: 65, capacity: 100, status: 'Good' },
          { name: 'Memory', current: 78, capacity: 100, status: 'Warning' },
          { name: 'Storage', current: 45, capacity: 100, status: 'Good' },
          { name: 'Network', current: 32, capacity: 100, status: 'Good' }
        ],
        cloudReadiness: [
          { application: 'Customer Portal', readiness: 85, complexity: 'Low' },
          { application: 'ERP System', readiness: 60, complexity: 'Medium' },
          { application: 'Legacy Billing', readiness: 25, complexity: 'High' },
          { application: 'Mobile API', readiness: 90, complexity: 'Low' }
        ],
        scalability: {
          autoScaling: 30,
          loadBalancing: 45,
          containerization: 20,
          microservices: 15
        },
        uploadedFiles: [
          { name: 'server-logs-web01.txt', type: 'log', size: '2.4 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'performance-metrics.csv', type: 'data', size: '1.8 MB', uploadDate: '2024-01-14', status: 'Processed' }
        ]
      };
      setAssessmentData(mockData);
    } catch (error) {
      console.error('Error loading infrastructure data:', error);
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
      
      setAssessmentData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, newFile]
      }));

      // Simulate processing
      setTimeout(() => {
        setAssessmentData(prev => ({
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
    const dataStr = JSON.stringify(assessmentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'infrastructure-assessment.json';
    link.click();
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setAssessmentData(importedData);
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
    const dataStr = JSON.stringify(assessmentData, null, 2);
    localStorage.setItem('infrastructure_assessment', dataStr);
    toast.success('Assessment data saved successfully!');
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    // Simulate analysis processing
    setTimeout(() => {
      const analysisResults = {
        infrastructureAnalysis: `Based on the assessment of ${assessmentData.azureMigrate?.servers?.length || 5} servers, your infrastructure shows mixed cloud readiness. Key findings:

• ${assessmentData.azureMigrate?.readiness?.ready || 45}% of applications are cloud-ready with minimal modifications
• Legacy systems (Windows Server 2012) require significant modernization effort
• Current resource utilization shows opportunity for optimization`,

        costOptimizationAnalysis: `Cost analysis reveals significant savings opportunities:

• Estimated monthly savings: ${formatCurrency(assessmentData.azureMigrate?.costs?.savings || 3490)}
• ROI payback period: ${assessmentData.azureMigrate?.costs?.paybackMonths || 18} months
• Overprovisioned resources detected in ${assessmentData.azureMigrate?.servers?.filter(s => s.readiness < 80).length || 2} servers
• Cloud-native services could reduce operational overhead by 40%`,

        securityAnalysis: `Security assessment highlights critical areas:

• Legacy operating systems present security risks (Windows Server 2012)
• No evidence of auto-patching or security automation
• Network segmentation analysis required for cloud migration
• Identity and access management modernization needed`,

        modernizationRecommendations: `Recommended modernization strategy:

1. **Phase 1**: Migrate ${assessmentData.azureMigrate?.readiness?.ready || 45}% cloud-ready applications via lift-and-shift
2. **Phase 2**: Refactor medium-complexity applications for cloud optimization  
3. **Phase 3**: Rebuild legacy systems with modern architecture patterns
4. **Implement**: Container orchestration, auto-scaling, and monitoring solutions`
      };

      setAssessmentData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setIsAnalyzing(false);
      setShowAnalysisResults(true);
      toast.success('Analysis completed successfully!');
    }, 3000);
  };

  const hostingColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  const getReadinessColor = (readiness) => {
    if (readiness >= 80) return 'bg-green-500';
    if (readiness >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUtilizationColor = (current) => {
    if (current >= 80) return 'bg-red-500';
    if (current >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
              <Server className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Infrastructure & Compute Assessment</h1>
                <p className="text-blue-100">AI-powered infrastructure analysis with Azure Migrate integration</p>
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
                  <Server className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Servers</p>
                    <p className="text-2xl font-bold text-gray-900">{assessmentData.azureMigrate?.servers?.length || 5}</p>
                    <p className="text-xs text-gray-500">Discovered by Azure Migrate</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <Cloud className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cloud Ready</p>
                    <p className="text-2xl font-bold text-gray-900">{assessmentData.azureMigrate?.readiness?.ready || 45}%</p>
                    <p className="text-xs text-gray-500">Applications assessed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated Savings</p>
                    <p className="text-2xl font-bold text-gray-900">${(assessmentData.azureMigrate?.costs?.savings || 3490).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Monthly in Azure</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">ROI Payback</p>
                    <p className="text-2xl font-bold text-gray-900">{assessmentData.azureMigrate?.costs?.paybackMonths || 18}</p>
                    <p className="text-xs text-gray-500">Months to break even</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hosting Environment Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Hosting Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assessmentData.hosting}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {assessmentData.hosting.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={hostingColors[index % hostingColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} servers`, `${props.payload.name}`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Resource Utilization */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
                <div className="space-y-4">
                  {assessmentData.utilization.map((resource, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>{resource.name}</span>
                        <span>{resource.current}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getUtilizationColor(resource.current)}`}
                          style={{ width: `${resource.current}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Status: {resource.status}
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
                <p className="text-sm text-gray-600">Upload Azure Migrate data, log files, documentation, and architecture diagrams</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Azure Migrate Data */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Cloud className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Azure Migrate</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload Azure Migrate assessment data</p>
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".json,.csv,.xlsx"
                        onChange={(e) => handleFileUpload(e, 'azure-migrate')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Log Files */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Log Files</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload server logs, performance metrics</p>
                    <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".txt,.log,.csv"
                        onChange={(e) => handleFileUpload(e, 'log')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Architecture Diagrams */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Architecture Diagrams</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload system diagrams and documentation</p>
                    <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                      Select Files
                      <input
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf,.vsd,.docx"
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
                    {assessmentData.uploadedFiles?.map((file, index) => (
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
                    {(!assessmentData.uploadedFiles || assessmentData.uploadedFiles.length === 0) && (
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
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered Infrastructure Analysis</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Run comprehensive analysis on your uploaded data and Azure Migrate assessment
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
                {/* Infrastructure Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Server className="h-5 w-5 mr-2 text-blue-600" />
                      Infrastructure Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {assessmentData.analysis?.infrastructureAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cost Optimization */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Cost Optimization Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {assessmentData.analysis?.costOptimizationAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-red-600" />
                      Security Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {assessmentData.analysis?.securityAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modernization Recommendations */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-purple-600" />
                      Modernization Recommendations
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {assessmentData.analysis?.modernizationRecommendations?.split('\\n').map((line, index) => (
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

export default InfrastructureAssessment;