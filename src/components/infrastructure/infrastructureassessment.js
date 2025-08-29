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
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import { useAnalysis } from '../../hooks/useAnalysis';

function InfrastructureAssessment() {
  const { currentAssessment } = useAssessment();
  const { startAnalysis, getAnalysisState, isAnalysisRunning } = useAnalysis();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  // Get analysis state for this module
  const analysisState = getAnalysisState('infrastructure');
  const isAnalyzing = isAnalysisRunning('infrastructure');
  
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
  }, [currentAssessment]);

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      console.log('INFRASTRUCTURE: Loading data for assessment:', currentAssessment?.id);
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'infrastructure');
      
      // Transform hosting data from service recommendations to distribution for pie chart
      const transformHostingData = (hostingServices) => {
        if (!hostingServices || hostingServices.length === 0) {
          return [
            { name: 'On-Premises Physical', count: 12, percentage: 48 },
            { name: 'VMware vSphere', count: 8, percentage: 32 },
            { name: 'Hyper-V', count: 3, percentage: 12 },
            { name: 'Public Cloud', count: 2, percentage: 8 }
          ];
        }
        // Extract hosting patterns from current environments
        const hostingTypes = {};
        hostingServices.forEach(service => {
          if (service.current?.includes('On-Premises') || service.current?.includes('Mainframe')) {
            hostingTypes['On-Premises Physical'] = (hostingTypes['On-Premises Physical'] || 0) + 1;
          } else if (service.current?.includes('Windows Server') || service.current?.includes('IIS')) {
            hostingTypes['Windows Server'] = (hostingTypes['Windows Server'] || 0) + 1;
          } else if (service.current?.includes('Linux') || service.current?.includes('K8s')) {
            hostingTypes['Linux/Container'] = (hostingTypes['Linux/Container'] || 0) + 1;
          } else {
            hostingTypes['Other'] = (hostingTypes['Other'] || 0) + 1;
          }
        });
        
        const total = Object.values(hostingTypes).reduce((sum, count) => sum + count, 0) || 1;
        return Object.entries(hostingTypes).map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / total) * 100)
        }));
      };

      // Transform utilization data from monthly trends to current resource utilization
      const transformUtilizationData = (monthlyData) => {
        if (!monthlyData || monthlyData.length === 0) {
          return [
            { name: 'CPU Usage', current: 67, status: 'Good', target: 75 },
            { name: 'Memory Usage', current: 84, status: 'High', target: 80 },
            { name: 'Storage Usage', current: 58, status: 'Good', target: 85 },
            { name: 'Network I/O', current: 45, status: 'Low', target: 70 },
            { name: 'Disk I/O', current: 72, status: 'Good', target: 80 }
          ];
        }
        // Use the latest month's data
        const latestData = monthlyData[monthlyData.length - 1];
        return [
          { name: 'CPU Usage', current: latestData.cpu || 67, status: latestData.cpu > 80 ? 'High' : latestData.cpu > 60 ? 'Good' : 'Low', target: 75 },
          { name: 'Memory Usage', current: latestData.memory || 84, status: latestData.memory > 80 ? 'High' : latestData.memory > 60 ? 'Good' : 'Low', target: 80 },
          { name: 'Storage Usage', current: latestData.storage || 58, status: latestData.storage > 85 ? 'High' : latestData.storage > 70 ? 'Good' : 'Low', target: 85 }
        ];
      };

      const mockData = {
        azureMigrate: {
          servers: assessmentSpecificData.servers || [],
          readiness: { ready: 45, conditional: 35, notReady: 20 },
          costs: { current: 12450, azureEstimate: 8960, savings: 3490, paybackMonths: 18 }
        },
        hosting: transformHostingData(assessmentSpecificData.hosting),
        utilization: transformUtilizationData(assessmentSpecificData.utilization),
        cloudReadiness: assessmentSpecificData.cloudReadiness || [],
        scalability: {
          autoScaling: 30,
          loadBalancing: 45,
          containerization: 20,
          microservices: 15
        },
        uploadedFiles: [
          { name: 'server-logs-web01.txt', type: 'log', size: '2.4 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'performance-metrics.csv', type: 'data', size: '1.8 MB', uploadDate: '2024-01-14', status: 'Processed' }
        ],
        analysis: assessmentSpecificData.analysis || {}
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
    setShowAnalysisResults(false);
    
    const result = await startAnalysis('infrastructure');
    
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

      securityAnalysis: `Security assessment indicates good baseline with improvement opportunities:

• Current infrastructure follows standard security practices
• Recommend implementing Azure Security Center for enhanced monitoring  
• Network segmentation should be improved for better isolation
• Multi-factor authentication should be enforced across all systems`,

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
    
    setShowAnalysisResults(true);
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

            {/* Enhanced Azure Migrate Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Migration Readiness Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Readiness</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Ready</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{assessmentData.azureMigrate?.readiness?.ready || 45}%</span>
                      <span className="text-xs text-gray-500">({Math.round(((assessmentData.azureMigrate?.servers?.length || 5) * (assessmentData.azureMigrate?.readiness?.ready || 45)) / 100)} servers)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Conditional</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{assessmentData.azureMigrate?.readiness?.conditional || 35}%</span>
                      <span className="text-xs text-gray-500">({Math.round(((assessmentData.azureMigrate?.servers?.length || 5) * (assessmentData.azureMigrate?.readiness?.conditional || 35)) / 100)} servers)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Not Ready</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{assessmentData.azureMigrate?.readiness?.notReady || 20}%</span>
                      <span className="text-xs text-gray-500">({Math.round(((assessmentData.azureMigrate?.servers?.length || 5) * (assessmentData.azureMigrate?.readiness?.notReady || 20)) / 100)} servers)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Readiness</span>
                    <span className="font-medium text-gray-900">{Math.round(((assessmentData.azureMigrate?.readiness?.ready || 45) + (assessmentData.azureMigrate?.readiness?.conditional || 35) * 0.5) / 1)}%</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg CPU Usage</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
                      </div>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Memory</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '84%'}}></div>
                      </div>
                      <span className="text-sm font-medium">84%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '58%'}}></div>
                      </div>
                      <span className="text-sm font-medium">58%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network I/O</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Last 30 days average
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Monthly</span>
                    <span className="text-lg font-bold text-gray-900">${(assessmentData.azureMigrate?.costs?.current || 12450).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Azure Estimate</span>
                    <span className="text-lg font-bold text-blue-600">${(assessmentData.azureMigrate?.costs?.azureEstimate || 8960).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-green-600">Monthly Savings</span>
                    <span className="text-lg font-bold text-green-600">${(assessmentData.azureMigrate?.costs?.savings || 3490).toLocaleString()}</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">{Math.round(((assessmentData.azureMigrate?.costs?.savings || 3490) / (assessmentData.azureMigrate?.costs?.current || 12450)) * 100)}%</div>
                      <div className="text-xs text-green-600">Cost Reduction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Details and Migration Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Servers by Resource Usage */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Resource Consumers</h3>
                <div className="space-y-3">
                  {[
                    { name: 'SQL-PROD-01', cpu: 89, memory: 92, storage: 78, readiness: 85 },
                    { name: 'WEB-FARM-03', cpu: 76, memory: 83, storage: 65, readiness: 92 },
                    { name: 'APP-SRV-02', cpu: 72, memory: 79, storage: 82, readiness: 78 },
                    { name: 'FILE-SRV-01', cpu: 45, memory: 67, storage: 94, readiness: 88 },
                    { name: 'DC-CTRL-01', cpu: 68, memory: 71, storage: 45, readiness: 65 }
                  ].map((server, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Server className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{server.name}</div>
                          <div className="text-xs text-gray-500">CPU: {server.cpu}% | Mem: {server.memory}% | Storage: {server.storage}%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(server.readiness)} text-white`}>
                          {server.readiness}% Ready
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Migration Effort Estimation */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Effort Estimation</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <div className="text-sm font-medium">Low Effort</div>
                        <div className="text-xs text-gray-500">Lift & Shift</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">15 servers</div>
                      <div className="text-xs text-gray-500">2-4 weeks</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <div>
                        <div className="text-sm font-medium">Medium Effort</div>
                        <div className="text-xs text-gray-500">Refactor Required</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">8 servers</div>
                      <div className="text-xs text-gray-500">6-12 weeks</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <div className="text-sm font-medium">High Effort</div>
                        <div className="text-xs text-gray-500">Rebuild/Replace</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">3 servers</div>
                      <div className="text-xs text-gray-500">16-24 weeks</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Timeline</span>
                    <span className="font-medium text-gray-900">18-24 months</span>
                  </div>
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