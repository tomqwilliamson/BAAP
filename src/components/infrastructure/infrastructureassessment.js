// src/components/Infrastructure/InfrastructureAssessment.js - Infrastructure assessment
import React, { useState, useEffect } from 'react';
import { 
  Cloud, Server, Database, Zap, Activity, HardDrive, Wifi, Shield, 
  Upload, Download, Save, FileText, Image, BarChart3, AlertTriangle,
  CheckCircle, Clock, DollarSign, Users, Settings, RefreshCw, Brain,
  Trash2, TrendingUp, Network, Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import { useAnalysis } from '../../hooks/useAnalysis';
import { aiAnalysisService } from '../../services/aiAnalysisService';
import { apiService } from '../../services/apiService';
import { API_BASE_URL } from '../../services/api';
import { dirtyTrackingService } from '../../services/dirtyTrackingService';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../contexts/notificationcontext';

function InfrastructureAssessment() {
  const { currentAssessment } = useAssessment();
  const { startAnalysis, getAnalysisState, isAnalysisRunning } = useAnalysis();
  const { addAnalysisNotification } = useNotifications();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [lastAiAnalysisTime, setLastAiAnalysisTime] = useState(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState(null);
  const [aiServiceAvailable, setAiServiceAvailable] = useState(false);
  const [aiCapabilities, setAiCapabilities] = useState(null);
  const [isDatabaseMode, setIsDatabaseMode] = useState(true); // Track if using database mode
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [insights, setInsights] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState('documents');
  const [dragOver, setDragOver] = useState(false);
  
  // Get analysis state for this module
  const analysisState = getAnalysisState('infrastructure');
  const isAnalyzing = isAnalysisRunning('infrastructure');
  
  // Wrapper function to track dirty state when data changes
  const updateAssessmentData = (newData) => {
    setAssessmentData(newData);
    
    // Mark as dirty when data changes (except during initial load)
    if (currentAssessment?.id) {
      dirtyTrackingService.setDirty(currentAssessment.id, 'infrastructure', true);
    }
  };

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
    checkAIServiceAvailability();
    loadDocuments();
    loadInsights();
  }, [currentAssessment]);

  // Set up dirty tracking and SignalR
  useEffect(() => {
    if (!currentAssessment?.id) return;

    // Register this module for dirty tracking
    dirtyTrackingService.registerModule(currentAssessment.id, 'infrastructure', assessmentData);

    // Set up dirty tracking listener
    const unsubscribeDirty = dirtyTrackingService.onDirtyStateChange(
      currentAssessment.id,
      'infrastructure',
      (isDirtyState) => {
        setIsDirty(isDirtyState);
        setDataSaved(!isDirtyState);
      }
    );

    // Join SignalR assessment group for real-time collaboration
    notificationService.joinAssessment(currentAssessment.id);

    // Set up SignalR event listeners
    const unsubscribeProgress = notificationService.onProgressUpdate((update) => {
      if (update.Stage === 'ai_analysis_started' && update.AssessmentId == currentAssessment.id) {
        toast.loading(update.Message, { id: 'ai-analysis-progress' });
      } else if (update.Stage === 'ai_analysis_completed' && update.AssessmentId == currentAssessment.id) {
        toast.success(update.Message, { id: 'ai-analysis-progress' });
      } else if (update.Stage === 'dirty_save_reminder' && update.AssessmentId == currentAssessment.id) {
        toast.error(update.Message, { 
          id: 'dirty-save-reminder',
          duration: 5000,
          icon: '💾' 
        });
      }
    });

    return () => {
      // Clean up
      unsubscribeDirty();
      unsubscribeProgress();
      dirtyTrackingService.unregisterModule(currentAssessment.id, 'infrastructure');
      notificationService.leaveAssessment(currentAssessment.id);
    };
  }, [currentAssessment?.id]);

  const checkAIServiceAvailability = async () => {
    try {
      const capabilities = await aiAnalysisService.getCapabilities();
      setAiServiceAvailable(capabilities.available);
      setAiCapabilities(capabilities);
    } catch (error) {
      console.error('Failed to check AI service availability:', error);
      setAiServiceAvailable(false);
      setAiCapabilities(null);
    }
  };

  // Document management functions
  const documentTypes = [
    'Infrastructure Documentation',
    'Technical Architecture', 
    'Business Requirements',
    'Security Documentation',
    'Data Architecture',
    'DevOps Documentation',
    'Project Management',
    'Compliance & Governance'
  ];

  const loadDocuments = async () => {
    try {
      const assessmentId = currentAssessment?.id || 1;
      const response = await fetch(`${API_BASE_URL}/Files/assessment/${assessmentId}?category=Infrastructure`);
      
      if (!response.ok) {
        console.warn('Files endpoint not available, using empty document list');
        setDocuments([]);
        return;
      }
      
      const data = await response.json();
      // The API returns { summary, files } - extract the files array
      const files = data.files || [];
      
      // Map the API response to the expected document format
      const infrastructureDocs = files.map(file => ({
        id: file.id,
        name: file.originalFileName,
        documentType: 'Infrastructure Documentation',
        category: file.category || 'Infrastructure',
        size: file.fileSize,
        uploadedDate: file.uploadedDate,
        uploadedBy: file.uploadedBy || 'System',
        description: file.description,
        contentType: file.contentType
      }));
      
      setDocuments(infrastructureDocs);
    } catch (error) {
      console.error('Error loading infrastructure documents:', error);
    }
  };

  const loadInsights = async () => {
    try {
      // Try to get recommendations from the Intelligence API
      const assessmentId = currentAssessment?.id || 1;
      const response = await fetch(`${API_BASE_URL}/Intelligence/recommendations/${assessmentId}`);
      
      if (!response.ok) {
        // If the endpoint doesn't exist (404) or other error, use mock data
        console.warn('Intelligence recommendations not available, using mock insights');
        setInsights([
          {
            id: 1,
            title: "Legacy System Dependencies Identified",
            category: "Infrastructure",
            analysisCategory: "Infrastructure",
            documentType: "Infrastructure Documentation",
            content: "Analysis shows dependencies on legacy mainframe systems that may impact cloud migration timeline.",
            confidence: 85,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Network Architecture Optimization",
            category: "Infrastructure",
            analysisCategory: "Infrastructure", 
            documentType: "Infrastructure Documentation",
            content: "Current network topology can be optimized for cloud connectivity and improved performance.",
            confidence: 78,
            createdAt: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const data = await response.json();
      
      // Handle the new RecommendationResult structure
      if (!data || typeof data !== 'object') {
        console.warn('Invalid Intelligence API response structure');
        setInsights([]);
        return;
      }

      // Combine all recommendation arrays from the RecommendationResult
      const allRecommendations = [
        ...(data.strategicRecommendations || []),
        ...(data.tacticalRecommendations || []),
        ...(data.personalizedRecommendations || [])
      ];
      
      // Transform recommendations into insights format and filter for Infrastructure category
      const infrastructureInsights = allRecommendations
        .filter(rec => 
          rec.category === 'Infrastructure' || 
          rec.area === 'Infrastructure' ||
          rec.type === 'Infrastructure'
        )
        .map((rec, index) => ({
          id: rec.id || `infra_${index + 1}`,
          title: rec.title || rec.recommendation || rec.name || 'Infrastructure Recommendation',
          category: "Infrastructure",
          analysisCategory: "Infrastructure",
          documentType: "Infrastructure Documentation",
          content: rec.description || rec.details || rec.content || rec.recommendation || 'No description available',
          confidence: rec.priority === 'High' ? 90 : rec.priority === 'Medium' ? 75 : rec.priority === 'Low' ? 60 : 75,
          createdAt: new Date().toISOString()
        }));

      setInsights(infrastructureInsights);
    } catch (error) {
      console.error('Error loading infrastructure insights:', error);
      // Fallback to mock data on network error
      setInsights([
        {
          id: 1,
          title: "Legacy System Dependencies Identified",
          category: "Infrastructure",
          analysisCategory: "Infrastructure",
          documentType: "Infrastructure Documentation",
          content: "Analysis shows dependencies on legacy mainframe systems that may impact cloud migration timeline.",
          confidence: 85,
          createdAt: new Date().toISOString()
        }
      ]);
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
        formData.append('documentType', 'Infrastructure Documentation');
        formData.append('category', 'Infrastructure');
        formData.append('assessmentId', currentAssessment?.id || 1);
        
        const response = await fetch(`${API_BASE_URL}/Files/upload`, {
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
      await fetch(`${API_BASE_URL}/Files/${documentId}`, { method: 'DELETE' });
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

  const loadAssessmentData = async () => {
    if (!currentAssessment?.id) {
      console.log('INFRASTRUCTURE: No assessment selected');
      return;
    }

    try {
      setLoading(true);
      
      // Load AI analysis timestamp from API
      try {
        const assessmentData = await apiService.getAssessment(currentAssessment.id);
        if (assessmentData.infrastructureLastAiAnalysis) {
          setLastAiAnalysisTime(new Date(assessmentData.infrastructureLastAiAnalysis));
          console.log('INFRASTRUCTURE: Loaded AI analysis timestamp from API:', assessmentData.infrastructureLastAiAnalysis);
        }
      } catch (error) {
        console.warn('Failed to load AI analysis timestamp from API:', error);
      }
      
      // Try to load from localStorage first
      const savedDataKey = `infrastructureData_${currentAssessment.id}`;
      const savedData = localStorage.getItem(savedDataKey);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setAssessmentData(parsed);
          setDataSaved(true);
          const saveDate = parsed.lastSaveTime || new Date();
          setLastSaveTime(new Date(saveDate));
          setIsDatabaseMode(false);
          console.log('INFRASTRUCTURE: Loaded data from localStorage for assessment:', currentAssessment.id);
        } catch (error) {
          console.error('Error parsing saved infrastructure data:', error);
        }
      }
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

  const exportData = () => {
    const dataStr = JSON.stringify(assessmentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `infrastructure-assessment-${currentAssessment?.id || 'data'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Infrastructure data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setAssessmentData(importedData);
          setDataSaved(false); // Mark as unsaved after import
          setLastSaveTime(new Date());
          toast.success('Infrastructure data imported successfully');
        } catch (error) {
          toast.error('Error importing data - invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveInfrastructureData = async () => {
    try {
      if (!currentAssessment?.id) {
        toast.error('No assessment selected. Please select an assessment first.');
        return;
      }

      // Save to localStorage with assessment-specific key
      const savedDataKey = `infrastructureData_${currentAssessment.id}`;
      const dataToSave = {
        ...assessmentData,
        lastSaveTime: new Date().toISOString()
      };
      localStorage.setItem(savedDataKey, JSON.stringify(dataToSave));
      
      // Mark as clean in dirty tracking service
      dirtyTrackingService.setDirty(currentAssessment.id, 'infrastructure', false);
      
      setLastSaveTime(new Date());
      setIsDatabaseMode(false); // Using local storage
      
      toast.success(`Infrastructure assessment saved for "${currentAssessment.name}"!`);
      console.log('INFRASTRUCTURE: Saved assessment data for:', currentAssessment.id);
    } catch (error) {
      console.error('Error saving infrastructure data:', error);
      toast.error('Error saving data');
    }
  };

  const runAnalysis = async () => {
    setShowAnalysisResults(false);
    setAiAnalysisResults(null);
    
    // Start the progress tracking analysis
    const result = await startAnalysis('infrastructure');
    
    if (!currentAssessment?.id) {
      toast.error('No assessment selected');
      return;
    }

    try {
      // Use the dirty tracking service to run AI analysis with SignalR notifications
      const analysisResults = await dirtyTrackingService.startAIAnalysis(
        currentAssessment.id,
        'infrastructure',
        async () => {
          // Try AI analysis first if available
          if (aiServiceAvailable) {
            // Transform assessment data for AI analysis
            const infrastructureRequest = aiAnalysisService.transformInfrastructureData(assessmentData);
            
            // Call AI analysis service
            const aiResponse = await aiAnalysisService.analyzeInfrastructure(infrastructureRequest);
            
            // Format and store AI results
            const formattedAiResults = aiAnalysisService.formatAnalysisResponse(aiResponse);
            setAiAnalysisResults(formattedAiResults);
            
            return {
              infrastructureAnalysis: formattedAiResults,
              isAiPowered: true,
              analysisMode: aiCapabilities?.mode || 'AI-Powered'
            };
          } else {
            // Fall back to simulation mode
            return generateSimulationResults();
          }
        }
      );

      // Update assessment data with results
      setAssessmentData(prev => ({
        ...prev,
        analysis: analysisResults
      }));

      // Show analysis results
      setShowAnalysisResults(true);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      try {
        await apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'infrastructure');
        console.log('INFRASTRUCTURE: AI analysis timestamp saved to API');
      } catch (error) {
        console.warn('Failed to save AI analysis timestamp to API:', error);
      }

      // Add to local notifications as well
      addAnalysisNotification(
        'infrastructure', 
        currentAssessment.name, 
        null
      );

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
      
      // Fall back to simulation mode
      const analysisResults = generateSimulationResults();
      
      setAssessmentData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setShowAnalysisResults(true);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      try {
        await apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'infrastructure');
        console.log('INFRASTRUCTURE: AI analysis timestamp saved to API (simulation mode)');
      } catch (error) {
        console.warn('Failed to save AI analysis timestamp to API:', error);
      }
      
      toast.success('Analysis completed using simulation mode', { 
        duration: 3000,
        icon: '📊'
      });
    }
  };

  const generateSimulationResults = () => {
    return {
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
4. **Implement**: Container orchestration, auto-scaling, and monitoring solutions`,

      isAiPowered: false,
      analysisMode: 'Simulation'
    };
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
              {/* Empty for now - buttons moved to action bar */}
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

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-3">
            <button
              onClick={saveInfrastructureData}
              className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
                isDirty 
                  ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isDirty ? 'Save Data (Required)' : 'Save Data'}
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
            <div className="text-sm text-gray-500">
              {dataSaved && lastSaveTime 
                ? `Last saved: ${lastSaveTime?.toLocaleString ? lastSaveTime.toLocaleString() : 'Unknown time'} ${isDatabaseMode ? '(DB)' : '(Local)'}`
                : 'Not saved yet'
              }
              <div>
                {lastAiAnalysisTime 
                  ? `Last AI Analysis Run: ${lastAiAnalysisTime?.toLocaleString ? lastAiAnalysisTime.toLocaleString() : 'Unknown time'}`
                  : 'No AI analysis run yet'
                }
              </div>
              {isDatabaseMode ? (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Database Mode</span>
              ) : (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Local Storage</span>
              )}
            </div>
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
                <h3 className="text-lg font-semibold text-gray-900">Infrastructure Data Source Integration</h3>
                <p className="text-sm text-gray-600">Upload specific infrastructure documents for comprehensive analysis</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Azure Migrate Data */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Cloud className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Azure Migrate</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload Azure Migrate assessment data, server inventory, readiness reports</p>
                  </div>

                  {/* Performance Logs */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Performance Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Server logs, performance metrics, monitoring reports, capacity data</p>
                  </div>

                  {/* Architecture Diagrams */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Architecture Docs</h4>
                    <p className="text-sm text-gray-600 mb-4">Infrastructure diagrams, network topology, system documentation</p>
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
              <p className="text-lg mb-2">Or drag and drop infrastructure documents here</p>
              <p className="text-sm text-gray-500">
                Azure Migrate data • Performance logs • Architecture diagrams • Documentation
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
                          No infrastructure documents uploaded yet. Upload some documents to get started!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Document Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(
                          documents.reduce((acc, doc) => {
                            acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <Badge className={getDocumentTypeColor(type)}>{type}</Badge>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Processing Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Documents:</span>
                          <span className="font-medium">{documents.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Chunks:</span>
                          <span className="font-medium">
                            {documents.reduce((sum, doc) => sum + (doc.chunks?.length || 0), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Size:</span>
                          <span className="font-medium">
                            {formatFileSize(documents.reduce((sum, doc) => sum + doc.sizeBytes, 0))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Network className="h-5 w-5 mr-2" />
                      Document Relationships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <div key={insight.documentId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{insight.fileName}</h4>
                            <Badge variant="outline">{insight.analysisCategory}</Badge>
                          </div>
                          
                          {insight.keyThemes.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Key Themes:</p>
                              <div className="flex flex-wrap gap-1">
                                {insight.keyThemes.map((theme, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {theme}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {insight.relatedDocuments.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-700 mb-1">Related Documents:</p>
                              <div className="space-y-1">
                                {insight.relatedDocuments.map((related, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span>{related.fileName}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {related.relationshipType}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {insights.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No document insights available yet. Upload documents to see relationships and analysis.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI-Powered Infrastructure Analysis
                    {aiServiceAvailable && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {aiCapabilities?.mode || 'AI-Powered'}
                      </span>
                    )}
                    {!aiServiceAvailable && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Simulation Mode
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {aiServiceAvailable 
                      ? 'Run AI-powered comprehensive analysis on your infrastructure data'
                      : 'Run simulation analysis on your uploaded data and Azure Migrate assessment'
                    }
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
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <Server className="h-5 w-5 mr-2 text-blue-600" />
                        Infrastructure Analysis
                      </div>
                      {assessmentData.analysis?.isAiPowered && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Brain className="h-3 w-3 mr-1" />
                          AI-Powered
                        </span>
                      )}
                      {assessmentData.analysis?.isAiPowered === false && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          📊 Simulation
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {assessmentData.analysis?.isAiPowered ? (
                        // AI-powered results (may contain markdown formatting)
                        <div className="whitespace-pre-wrap">
                          {assessmentData.analysis?.infrastructureAnalysis}
                        </div>
                      ) : (
                        // Simulation results
                        assessmentData.analysis?.infrastructureAnalysis?.split('\n').map((line, index) => (
                          <p key={index} className="mb-2">{line}</p>
                        ))
                      )}
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