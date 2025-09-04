// src/components/DevOps/DevOpsAssessment.js - DevOps practices assessment
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Play, Zap, Monitor, Package, Gauge, Upload, Download, Save, FileText, Image,
  Shield, Brain, RefreshCw, Clock, Users, Code, AlertTriangle, CheckCircle, Activity,
  Trash2, TrendingUp, Network, Filter
} from 'lucide-react';
import ActionPanel from '../ui/ActionPanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import { API_BASE_URL } from '../../services/api';
import { apiService } from '../../services/apiService';
import { developmentPracticesService } from '../../services/developmentPracticesService';
import { dirtyTrackingService } from '../../services/dirtyTrackingService';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../contexts/notificationcontext';

function DevOpsAssessment() {
  const { currentAssessment } = useAssessment();
  const { addAnalysisNotification } = useNotifications();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [lastAiAnalysisTime, setLastAiAnalysisTime] = useState(null);
  const [isDatabaseMode, setIsDatabaseMode] = useState(true); // Track if using database mode
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [insights, setInsights] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState('documents');
  const [dragOver, setDragOver] = useState(false);
  
  // Development practices tabs state
  const [selectedDevelopmentTab, setSelectedDevelopmentTab] = useState('methodology');
  
  // Wrapper function to track dirty state when data changes
  const updateDevopsData = (newData) => {
    setDevopsData(newData);
    
    // Mark as dirty when data changes (except during initial load)
    if (currentAssessment?.id) {
      dirtyTrackingService.setDirty(currentAssessment.id, 'devops', true);
    }
  };

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
  
  // Development Practices state
  const [developmentPractices, setDevelopmentPractices] = useState(null);
  const [practicesLoading, setPracticesLoading] = useState(false);
  const [practicesSaving, setPracticesSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Development Methodology
    primaryMethodology: '',
    sprintLength: '',
    releaseFrequency: '',
    
    // Quality Assurance
    hasDedicatedQA: false,
    manualTesting: false,
    automatedTesting: false,
    unitTesting: false,
    integrationTesting: false,
    e2ETesting: false,
    performanceTesting: false,
    codeCoverageTarget: '',
    
    // Team Structure
    totalTeamSize: 0,
    numberOfScrumTeams: 0,
    
    // Role counts
    softwareDevelopers: 0,
    seniorLeadDevelopers: 0,
    qaEngineers: 0,
    databaseEngineers: 0,
    devOpsEngineers: 0,
    businessAnalysts: 0,
    productManagers: 0,
    projectManagers: 0,
    scrumMasters: 0,
    uiuxDesigners: 0,
    architects: 0,
    
    // Development practices
    codeReviews: false,
    pairProgramming: false,
    testDrivenDevelopment: false,
    behaviorDrivenDevelopment: false,
    continuousIntegration: false,
    continuousDeployment: false,
    featureFlags: false,
    abTesting: false,
    codeDocumentationStandards: false,
    apiDocumentation: false,
    technicalDebtManagement: false,
    performanceMonitoring: false,
    
    // Communication tools
    microsoftTeams: false,
    slack: false,
    discord: false,
    email: false,
    otherCommunicationTools: false,
    
    // Project management tools
    azureDevOps: false,
    jira: false,
    gitHubProjects: false,
    trello: false,
    asana: false,
    mondayCom: false,
    otherProjectManagementTools: false,
    
    // Meeting cadence
    dailyStandups: false,
    sprintPlanning: false,
    sprintReviews: false,
    retrospectives: false,
    backlogGrooming: false,
    architectureReviews: false,
    
    // Technology
    primaryProgrammingLanguages: '',
    visualStudio: false,
    vsCode: false,
    intellijIDEA: false,
    eclipse: false,
    otherIDEs: false
  });

  useEffect(() => {
    loadDevOpsData();
    loadDocuments();
    loadInsights();
    loadDevelopmentPractices();
  }, [currentAssessment]);

  // Set up dirty tracking and SignalR
  useEffect(() => {
    if (!currentAssessment?.id) return;

    // Register this module for dirty tracking
    dirtyTrackingService.registerModule(currentAssessment.id, 'devops', devopsData);

    // Set up dirty tracking listener
    const unsubscribeDirty = dirtyTrackingService.onDirtyStateChange(
      currentAssessment.id,
      'devops',
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
      dirtyTrackingService.unregisterModule(currentAssessment.id, 'devops');
      notificationService.leaveAssessment(currentAssessment.id);
    };
  }, [currentAssessment?.id]);

  // Save, Export, Import functions
  const saveDevOpsData = async () => {
    try {
      if (!currentAssessment?.id) {
        toast.error('No assessment selected. Please select an assessment first.');
        return;
      }

      // Save DevOps data to localStorage with assessment-specific key
      const savedDataKey = `devOpsData_${currentAssessment.id}`;
      const dataToSave = {
        ...devopsData,
        lastSaveTime: new Date().toISOString()
      };
      localStorage.setItem(savedDataKey, JSON.stringify(dataToSave));
      
      // Also save development practices data if currentAssessment exists
      if (currentAssessment?.id && formData) {
        try {
          await developmentPracticesService.createOrUpdateForAssessment(
            currentAssessment.id,
            formData
          );
          console.log('DEVOPS: Development practices saved successfully');
        } catch (practicesError) {
          console.error('Error saving development practices:', practicesError);
          toast.error('DevOps data saved, but failed to save development practices');
        }
      }
      
      // Mark as clean in dirty tracking service
      dirtyTrackingService.setDirty(currentAssessment.id, 'devops', false);
      setLastSaveTime(new Date());
      setIsDatabaseMode(false); // Using local storage
      
      toast.success(`DevOps assessment saved for "${currentAssessment.name}"!`);
      console.log('DEVOPS: Saved assessment data for:', currentAssessment.id);
    } catch (error) {
      console.error('Error saving DevOps data:', error);
      toast.error('Error saving data');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(devopsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `devops-assessment-${currentAssessment?.id || 'data'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('DevOps data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setDevopsData(importedData);
          setDataSaved(false); // Mark as unsaved after import
          setLastSaveTime(new Date());
          toast.success('DevOps data imported successfully');
        } catch (error) {
          toast.error('Error importing data - invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  const loadDevOpsData = async () => {
    if (!currentAssessment?.id) {
      console.log('DEVOPS: No assessment selected');
      return;
    }

    try {
      setLoading(true);
      console.log('DEVOPS: Loading data for assessment:', currentAssessment?.id);
      
      // Load AI analysis timestamp from API
      try {
        const assessmentData = await apiService.getAssessment(currentAssessment.id);
        if (assessmentData.devOpsLastAiAnalysis) {
          setLastAiAnalysisTime(new Date(assessmentData.devOpsLastAiAnalysis));
          console.log('DEVOPS: Loaded AI analysis timestamp from API:', assessmentData.devOpsLastAiAnalysis);
        }
      } catch (error) {
        console.warn('Failed to load AI analysis timestamp from API:', error);
      }

      // Load existing AI analysis results from API
      try {
        const aiResults = await apiService.getAIAnalysisResults(currentAssessment.id, 'devops');
        if (aiResults && aiResults.analysisResults) {
          setDevopsData(prev => ({
            ...prev,
            analysis: aiResults.analysisResults
          }));
          setShowAnalysisResults(true);
          console.log('DEVOPS: Loaded existing AI analysis results from API:', aiResults.analysisMode);
        }
      } catch (error) {
        // No existing results found - this is normal for new assessments
        console.log('DEVOPS: No existing AI analysis results found (this is normal for new assessments)');
      }
      
      // Try to load from localStorage first
      const savedDataKey = `devOpsData_${currentAssessment.id}`;
      const savedData = localStorage.getItem(savedDataKey);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setDevopsData(parsed);
          setDataSaved(true);
          const saveDate = parsed.lastSaveTime || new Date();
          setLastSaveTime(new Date(saveDate));
          setIsDatabaseMode(false);
          console.log('DEVOPS: Loaded data from localStorage for assessment:', currentAssessment.id);
          return;
        } catch (error) {
          console.error('Error parsing saved DevOps data:', error);
        }
      }
      
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
      const response = await fetch(`${API_BASE_URL}/Files/assessment/${currentAssessment?.id}?category=DevOps`);
      
      if (!response.ok) {
        setDocuments([]);
        return;
      }
      
      const data = await response.json();
      
      // Extract files array from the API response structure { summary, files }
      const filesArray = data.files || [];
      
      // Map the files to the expected document format
      const devopsDocs = filesArray.map(file => ({
        id: file.id,
        name: file.originalFileName,
        fileName: file.originalFileName,
        documentType: 'DevOps Documentation',
        category: file.category || 'devops',
        size: file.fileSize,
        sizeBytes: file.fileSize,
        uploadedDate: file.uploadedDate,
        uploadedAt: file.uploadedDate,
        uploadedBy: file.uploadedBy || 'System',
        description: file.description,
        summary: file.description || 'DevOps documentation',
        contentType: file.contentType,
        chunks: file.chunks || [],
        keyFindings: file.keyFindings || []
      }));
      
      setDocuments(devopsDocs);
    } catch (error) {
      console.error('Error loading devops documents:', error);
      setDocuments([]);
    }
  };

  const loadInsights = async () => {
    try {
      const assessmentId = currentAssessment?.id || 1;
      const response = await fetch(`${API_BASE_URL}/Intelligence/recommendations/${assessmentId}`);
      
      if (!response.ok) {
        console.warn('Intelligence recommendations not available, using mock insights');
        setInsights([
          {
            id: 1,
            title: "CI/CD Pipeline Optimization",
            category: "DevOps",
            analysisCategory: "DevOps",
            documentType: "DevOps Documentation",
            content: "Analysis shows opportunities to improve CI/CD pipeline efficiency and reduce build times.",
            confidence: 85,
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
      
      // Transform recommendations to insights format and filter for DevOps category
      const devopsInsights = allRecommendations
        .filter(recommendation => 
          recommendation.category === 'DevOps' || 
          recommendation.category === 'Development' ||
          recommendation.area === 'DevOps' ||
          recommendation.type === 'DevOps'
        )
        .map((recommendation, index) => ({
          id: recommendation.id || `devops_${index + 1}`,
          title: recommendation.title || recommendation.recommendation || recommendation.name || 'DevOps Recommendation',
          category: "DevOps",
          analysisCategory: "DevOps",
          documentType: "DevOps Documentation",
          content: recommendation.description || recommendation.details || recommendation.content || recommendation.recommendation || 'No description available',
          confidence: recommendation.priority === 'High' ? 90 : recommendation.priority === 'Medium' ? 75 : recommendation.priority === 'Low' ? 60 : 75,
          createdAt: new Date().toISOString()
        }));
      
      setInsights(devopsInsights);
    } catch (error) {
      console.error('Error loading devops insights:', error);
      // Fallback to mock data on error
      setInsights([
        {
          id: 1,
          title: "CI/CD Pipeline Optimization",
          category: "DevOps",
          analysisCategory: "DevOps", 
          documentType: "DevOps Documentation",
          content: "Analysis shows opportunities to improve CI/CD pipeline efficiency and reduce build times.",
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
        formData.append('documentType', 'DevOps Documentation');
        formData.append('category', 'devops');
        if (currentAssessment?.id) {
          formData.append('assessmentId', currentAssessment.id);
        }
        
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

  // Development Practices functions
  const loadDevelopmentPractices = async () => {
    if (!currentAssessment?.id) return;
    
    try {
      setPracticesLoading(true);
      const practices = await developmentPracticesService.getByAssessmentId(currentAssessment.id);
      
      if (practices) {
        setDevelopmentPractices(practices);
        // Update form data with loaded practices
        setFormData({
          primaryMethodology: practices.primaryMethodology || '',
          sprintLength: practices.sprintLength || '',
          releaseFrequency: practices.releaseFrequency || '',
          hasDedicatedQA: practices.hasDedicatedQA || false,
          manualTesting: practices.manualTesting || false,
          automatedTesting: practices.automatedTesting || false,
          unitTesting: practices.unitTesting || false,
          integrationTesting: practices.integrationTesting || false,
          e2ETesting: practices.e2ETesting || false,
          performanceTesting: practices.performanceTesting || false,
          codeCoverageTarget: practices.codeCoverageTarget || '',
          totalTeamSize: practices.totalTeamSize || 0,
          numberOfScrumTeams: practices.numberOfScrumTeams || 0,
          softwareDevelopers: practices.softwareDevelopers || 0,
          seniorLeadDevelopers: practices.seniorLeadDevelopers || 0,
          qaEngineers: practices.qaEngineers || 0,
          databaseEngineers: practices.databaseEngineers || 0,
          devOpsEngineers: practices.devOpsEngineers || 0,
          businessAnalysts: practices.businessAnalysts || 0,
          productManagers: practices.productManagers || 0,
          projectManagers: practices.projectManagers || 0,
          scrumMasters: practices.scrumMasters || 0,
          uiuxDesigners: practices.uiuxDesigners || 0,
          architects: practices.architects || 0,
          codeReviews: practices.codeReviews || false,
          pairProgramming: practices.pairProgramming || false,
          testDrivenDevelopment: practices.testDrivenDevelopment || false,
          behaviorDrivenDevelopment: practices.behaviorDrivenDevelopment || false,
          continuousIntegration: practices.continuousIntegration || false,
          continuousDeployment: practices.continuousDeployment || false,
          featureFlags: practices.featureFlags || false,
          abTesting: practices.abTesting || false,
          codeDocumentationStandards: practices.codeDocumentationStandards || false,
          apiDocumentation: practices.apiDocumentation || false,
          technicalDebtManagement: practices.technicalDebtManagement || false,
          performanceMonitoring: practices.performanceMonitoring || false,
          microsoftTeams: practices.microsoftTeams || false,
          slack: practices.slack || false,
          discord: practices.discord || false,
          email: practices.email || false,
          otherCommunicationTools: practices.otherCommunicationTools || false,
          azureDevOps: practices.azureDevOps || false,
          jira: practices.jira || false,
          gitHubProjects: practices.gitHubProjects || false,
          trello: practices.trello || false,
          asana: practices.asana || false,
          mondayCom: practices.mondayCom || false,
          otherProjectManagementTools: practices.otherProjectManagementTools || false,
          dailyStandups: practices.dailyStandups || false,
          sprintPlanning: practices.sprintPlanning || false,
          sprintReviews: practices.sprintReviews || false,
          retrospectives: practices.retrospectives || false,
          backlogGrooming: practices.backlogGrooming || false,
          architectureReviews: practices.architectureReviews || false,
          primaryProgrammingLanguages: practices.primaryProgrammingLanguages || '',
          visualStudio: practices.visualStudio || false,
          vsCode: practices.vsCode || false,
          intellijIDEA: practices.intellijIDEA || false,
          eclipse: practices.eclipse || false,
          otherIDEs: practices.otherIDEs || false
        });
      } else {
        // No existing practices, keep default form data
        setDevelopmentPractices(null);
      }
    } catch (error) {
      console.error('Error loading development practices:', error);
      setDevelopmentPractices(null);
    } finally {
      setPracticesLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveDevelopmentPractices = async () => {
    if (!currentAssessment?.id) {
      toast.error('No assessment selected');
      return;
    }

    try {
      setPracticesSaving(true);
      
      const result = await developmentPracticesService.createOrUpdateForAssessment(
        currentAssessment.id,
        formData
      );
      
      setDevelopmentPractices(result);
      toast.success('Development practices saved successfully!');
    } catch (error) {
      console.error('Error saving development practices:', error);
      toast.error('Failed to save development practices');
    } finally {
      setPracticesSaving(false);
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


  // Note: Export and save functions are defined above after useEffect

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    if (!currentAssessment?.id) {
      toast.error('No assessment selected');
      setIsAnalyzing(false);
      return;
    }

    try {
      // Use the dirty tracking service to run AI analysis with SignalR notifications
      const analysisResults = await dirtyTrackingService.startAIAnalysis(
        currentAssessment.id,
        'devops',
        async () => {
          // Simulate analysis processing or call actual AI service
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
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
              });
            }, 3000);
          });
        }
      );

      // Update data with analysis results
      setDevopsData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setShowAnalysisResults(true);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      try {
        await apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'devops');
        console.log('DEVOPS: AI analysis timestamp saved to API');
      } catch (error) {
        console.warn('Failed to save AI analysis timestamp to API:', error);
      }

      // Save AI analysis results to API
      try {
        const analysisMode = analysisResults.isAiPowered ? 'AI-Powered' : 'Simulation';
        await apiService.saveAIAnalysisResults(
          currentAssessment.id,
          'devops',
          analysisResults,
          analysisMode
        );
        console.log('DEVOPS: AI analysis results saved to API:', analysisMode);
      } catch (error) {
        console.warn('Failed to save AI analysis results to API:', error);
      }

      // Add to local notifications as well
      addAnalysisNotification(
        'devops', 
        currentAssessment.name, 
        null
      );

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
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
              onClick={() => setCurrentView('development')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'development' 
                  ? 'bg-white text-blue-800' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Development Practices
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

      {/* Action Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ActionPanel
          onSave={saveDevOpsData}
          onExport={exportData}
          onImport={importData}
          isDirty={isDirty}
          dataSaved={dataSaved}
          lastSaveTime={lastSaveTime}
          lastAiAnalysisTime={lastAiAnalysisTime}
          isDatabaseMode={isDatabaseMode}
          loading={loading}
          saveButtonText="Save DevOps Data"
        />
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
          {devopsData.maturity && devopsData.maturity.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">Loading maturity assessment...</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Levels</h3>
          {devopsData.automation && devopsData.automation.length > 0 ? (
            <div className="space-y-4">
              {devopsData.automation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.process}</span>
                    <span className="text-sm text-gray-500">{item.automated}% Automated</span>
                  </div>
                  <div className="relative w-full h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${item.automated}%` }}
                    >
                      <div className="h-full flex items-center justify-end pr-2">
                        {item.automated > 10 && (
                          <span className="text-xs text-white font-medium">{item.automated}%</span>
                        )}
                      </div>
                    </div>
                    <div 
                      className="absolute top-0 h-full bg-red-400 transition-all duration-500"
                      style={{ 
                        left: `${item.automated}%`,
                        width: `${item.manual}%` 
                      }}
                    >
                      <div className="h-full flex items-center justify-end pr-2">
                        {item.manual > 10 && (
                          <span className="text-xs text-white font-medium">{item.manual}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                      Automated
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-red-400 rounded-full mr-1"></span>
                      Manual
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">Loading automation data...</p>
              </div>
            </div>
          )}
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

            {/* Document Type Guidance */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">DevOps Data Source Integration</h3>
                <p className="text-sm text-gray-600">Upload specific DevOps documents for comprehensive analysis</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* GitHub Integration */}
                  <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                    <div className="flex items-center mb-3">
                      <GitBranch className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-900">GitHub Integration</h4>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Repository configuration files</li>
                      <li>• GitHub Actions workflows (.yml/.yaml)</li>
                      <li>• Branch protection rules</li>
                      <li>• Pull request templates</li>
                      <li>• Issue templates</li>
                      <li>• README and documentation</li>
                    </ul>
                  </div>

                  {/* Azure DevOps Integration */}
                  <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                    <div className="flex items-center mb-3">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-900">Azure DevOps</h4>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Build pipeline definitions</li>
                      <li>• Release pipeline configurations</li>
                      <li>• Variable groups and libraries</li>
                      <li>• Service connections</li>
                      <li>• Work item templates</li>
                      <li>• Test plans and suites</li>
                    </ul>
                  </div>

                  {/* CI/CD Documentation */}
                  <div className="border rounded-lg p-4 border-purple-200 bg-purple-50">
                    <div className="flex items-center mb-3">
                      <Zap className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-medium text-purple-900">CI/CD Documentation</h4>
                    </div>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Deployment procedures</li>
                      <li>• Environment configurations</li>
                      <li>• Release notes and changelogs</li>
                      <li>• Rollback procedures</li>
                      <li>• Testing strategies</li>
                      <li>• Quality gates documentation</li>
                    </ul>
                  </div>

                  {/* Monitoring & Operations */}
                  <div className="border rounded-lg p-4 border-orange-200 bg-orange-50">
                    <div className="flex items-center mb-3">
                      <Monitor className="h-5 w-5 text-orange-600 mr-2" />
                      <h4 className="font-medium text-orange-900">Monitoring & Operations</h4>
                    </div>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Monitoring configurations</li>
                      <li>• Alert rules and notifications</li>
                      <li>• Dashboards and visualizations</li>
                      <li>• Incident response procedures</li>
                      <li>• Performance metrics</li>
                      <li>• Log aggregation configs</li>
                    </ul>
                  </div>

                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Upload Guidelines</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        For best results, upload configuration files, documentation, and process definitions 
                        that represent your current DevOps practices. The AI analysis will identify 
                        improvement opportunities and provide maturity assessments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Document Upload</h2>
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
                </div>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Uploading: {uploadProgress.fileName}</span>
                    <span>{uploadProgress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${uploadProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const files = Array.from(e.dataTransfer.files);
                  handleDocumentUpload(files);
                }}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg mb-2">Or drag and drop DevOps documents here</p>
                <p className="text-sm text-gray-500">
                  Supports PDF, Word, Excel, PowerPoint, JSON, YAML, XML, and ZIP files (Max 50MB each)
                </p>
              </div>
            </div>

            {/* Document Tabs */}
            <Tabs value={selectedDocumentTab} onValueChange={setSelectedDocumentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm">
                  {documents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {documents.map((doc, index) => (
                        <div key={index} className="p-4 flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.name}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-xs text-gray-500">
                                {doc.size ? formatFileSize(doc.size) : 'Unknown size'} • {doc.uploadedDate ? new Date(doc.uploadedDate).toLocaleDateString() : 'Recently uploaded'}
                              </p>
                              <Badge 
                                className={`text-xs ${
                                  getDocumentTypeColor(doc.documentType) || 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {doc.documentType}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {doc.summary || 'DevOps documentation and configuration files'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="flex-shrink-0 p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg mb-2">No DevOps documents uploaded yet</p>
                      <p className="text-sm">
                        Upload documents using the area above to get started with AI analysis!
                      </p>
                    </div>
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
                            <h3 className="font-semibold mb-1">{insight.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{insight.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Category: {insight.analysisCategory}</span>
                              <span>Confidence: {insight.confidence}%</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </div>
        )}

        {/* Development Practices View */}
        {currentView === 'development' && (
          <div className="space-y-6">

            {/* Development Methodology Assessment */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Development Methodology & Process Assessment</h3>
                <p className="text-sm text-gray-600">Evaluate your software development practices, team structure, and methodologies</p>
              </div>
              
              <div className="p-6">
                {practicesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading development practices...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Assessment: {currentAssessment?.name || 'No assessment selected'}</h4>
                        <p className="text-sm text-gray-600">{developmentPractices ? 'Existing practices found' : 'New practices assessment'}</p>
                      </div>
                    </div>
                
                    {/* Development Practices Tabs */}
                    <Tabs value={selectedDevelopmentTab} onValueChange={setSelectedDevelopmentTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-6 mb-6">
                        <TabsTrigger value="methodology" className="text-xs">Development Methodology</TabsTrigger>
                        <TabsTrigger value="team" className="text-xs">Team Structure & Organization</TabsTrigger>
                        <TabsTrigger value="quality" className="text-xs">Quality Assurance & Testing</TabsTrigger>
                        <TabsTrigger value="practices" className="text-xs">Development Practices</TabsTrigger>
                        <TabsTrigger value="communication" className="text-xs">Communication & Collaboration</TabsTrigger>
                        <TabsTrigger value="technology" className="text-xs">Technology Stack & Environment</TabsTrigger>
                      </TabsList>

                      {/* Development Methodology Tab */}
                      <TabsContent value="methodology" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Development Methodology</h4>
                          
                          {/* Methodology Selection */}
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Primary Development Methodology</label>
                              <div className="mt-2 space-y-2">
                                {['Agile/Scrum', 'Kanban', 'Waterfall', 'DevOps', 'Lean', 'Hybrid', 'Other'].map((method) => (
                                  <label key={method} className="flex items-center">
                                    <input 
                                      type="radio" 
                                      name="methodology" 
                                      value={method} 
                                      checked={formData.primaryMethodology === method}
                                      onChange={(e) => handleFormChange('primaryMethodology', e.target.value)}
                                      className="form-radio h-4 w-4 text-blue-600" 
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Sprint/Cycle Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Sprint/Cycle Length</label>
                                <select 
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  value={formData.sprintLength}
                                  onChange={(e) => handleFormChange('sprintLength', e.target.value)}
                                >
                                  <option value="">Select length</option>
                                  <option value="1 week">1 week</option>
                                  <option value="2 weeks">2 weeks</option>
                                  <option value="3 weeks">3 weeks</option>
                                  <option value="4 weeks">4 weeks</option>
                                  <option value="Other/N/A">Other/N/A</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Release Frequency</label>
                                <select 
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  value={formData.releaseFrequency}
                                  onChange={(e) => handleFormChange('releaseFrequency', e.target.value)}
                                >
                                  <option value="">Select frequency</option>
                                  <option value="Daily">Daily</option>
                                  <option value="Weekly">Weekly</option>
                                  <option value="Bi-weekly">Bi-weekly</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Ad-hoc">Ad-hoc</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Team Structure Tab */}
                      <TabsContent value="team" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Team Structure & Organization</h4>
                          
                          {/* Team Size */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Total Development Team Size</label>
                              <input 
                                type="number" 
                                min="0" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                                placeholder="e.g., 15"
                                value={formData.totalTeamSize}
                                onChange={(e) => handleFormChange('totalTeamSize', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Number of Scrum Teams</label>
                              <input 
                                type="number" 
                                min="0" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                                placeholder="e.g., 3"
                                value={formData.numberOfScrumTeams}
                                onChange={(e) => handleFormChange('numberOfScrumTeams', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          {/* Role Distribution */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-700">Team Roles & Count</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { label: 'Software Developers', key: 'softwareDevelopers' },
                                { label: 'Senior/Lead Developers', key: 'seniorLeadDevelopers' },
                                { label: 'QA Engineers/Testers', key: 'qaEngineers' },
                                { label: 'Database Engineers/DBAs', key: 'databaseEngineers' },
                                { label: 'DevOps Engineers', key: 'devOpsEngineers' },
                                { label: 'Business Analysts', key: 'businessAnalysts' },
                                { label: 'Product Managers', key: 'productManagers' },
                                { label: 'Project Managers', key: 'projectManagers' },
                                { label: 'Scrum Masters', key: 'scrumMasters' },
                                { label: 'UI/UX Designers', key: 'uiuxDesigners' },
                                { label: 'Architects (Solution/Technical)', key: 'architects' }
                              ].map((role) => (
                                <div key={role.key} className="flex items-center justify-between">
                                  <label className="text-sm text-gray-700 flex-1">{role.label}</label>
                                  <input 
                                    type="number" 
                                    min="0" 
                                    className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" 
                                    placeholder="0"
                                    value={formData[role.key]}
                                    onChange={(e) => handleFormChange(role.key, parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Quality Assurance Tab */}
                      <TabsContent value="quality" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Quality Assurance & Testing</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="form-checkbox h-4 w-4 text-blue-600" 
                                  checked={formData.hasDedicatedQA}
                                  onChange={(e) => handleFormChange('hasDedicatedQA', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700">Dedicated QA Department</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Testing Approach</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[
                                  { label: 'Manual Testing', key: 'manualTesting' },
                                  { label: 'Automated Testing', key: 'automatedTesting' },
                                  { label: 'Unit Testing', key: 'unitTesting' },
                                  { label: 'Integration Testing', key: 'integrationTesting' },
                                  { label: 'E2E Testing', key: 'e2ETesting' },
                                  { label: 'Performance Testing', key: 'performanceTesting' }
                                ].map((approach) => (
                                  <label key={approach.key} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-blue-600" 
                                      checked={formData[approach.key]}
                                      onChange={(e) => handleFormChange(approach.key, e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{approach.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Code Coverage Target</label>
                              <select 
                                className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formData.codeCoverageTarget}
                                onChange={(e) => handleFormChange('codeCoverageTarget', e.target.value)}
                              >
                                <option value="">Select target</option>
                                <option value="No formal target">No formal target</option>
                                <option value="50-60%">50-60%</option>
                                <option value="60-70%">60-70%</option>
                                <option value="70-80%">70-80%</option>
                                <option value="80%+">80%+</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Development Practices Tab */}
                      <TabsContent value="practices" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Development Practices</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { label: 'Code Reviews (Pull Requests)', key: 'codeReviews' },
                              { label: 'Pair Programming', key: 'pairProgramming' },
                              { label: 'Test-Driven Development (TDD)', key: 'testDrivenDevelopment' },
                              { label: 'Behavior-Driven Development (BDD)', key: 'behaviorDrivenDevelopment' },
                              { label: 'Continuous Integration (CI)', key: 'continuousIntegration' },
                              { label: 'Continuous Deployment (CD)', key: 'continuousDeployment' },
                              { label: 'Feature Flags/Toggles', key: 'featureFlags' },
                              { label: 'A/B Testing', key: 'abTesting' },
                              { label: 'Code Documentation Standards', key: 'codeDocumentationStandards' },
                              { label: 'API Documentation', key: 'apiDocumentation' },
                              { label: 'Technical Debt Management', key: 'technicalDebtManagement' },
                              { label: 'Performance Monitoring', key: 'performanceMonitoring' }
                            ].map((practice) => (
                              <label key={practice.key} className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="form-checkbox h-4 w-4 text-blue-600" 
                                  checked={formData[practice.key]}
                                  onChange={(e) => handleFormChange(practice.key, e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700">{practice.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Communication & Collaboration Tab */}
                      <TabsContent value="communication" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Communication & Collaboration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Communication Tools</label>
                              <div className="space-y-2">
                                {[
                                  { label: 'Microsoft Teams', key: 'microsoftTeams' },
                                  { label: 'Slack', key: 'slack' },
                                  { label: 'Discord', key: 'discord' },
                                  { label: 'Email', key: 'email' },
                                  { label: 'Other', key: 'otherCommunicationTools' }
                                ].map((tool) => (
                                  <label key={tool.key} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-blue-600" 
                                      checked={formData[tool.key]}
                                      onChange={(e) => handleFormChange(tool.key, e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{tool.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Project Management Tools</label>
                              <div className="space-y-2">
                                {[
                                  { label: 'Azure DevOps', key: 'azureDevOps' },
                                  { label: 'Jira', key: 'jira' },
                                  { label: 'GitHub Projects', key: 'gitHubProjects' },
                                  { label: 'Trello', key: 'trello' },
                                  { label: 'Asana', key: 'asana' },
                                  { label: 'Monday.com', key: 'mondayCom' },
                                  { label: 'Other', key: 'otherProjectManagementTools' }
                                ].map((tool) => (
                                  <label key={tool.key} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-blue-600" 
                                      checked={formData[tool.key]}
                                      onChange={(e) => handleFormChange(tool.key, e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{tool.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Cadence</label>
                              <div className="space-y-2">
                                {[
                                  { label: 'Daily Standups', key: 'dailyStandups' },
                                  { label: 'Sprint Planning', key: 'sprintPlanning' },
                                  { label: 'Sprint Reviews', key: 'sprintReviews' },
                                  { label: 'Retrospectives', key: 'retrospectives' },
                                  { label: 'Backlog Grooming', key: 'backlogGrooming' },
                                  { label: 'Architecture Reviews', key: 'architectureReviews' }
                                ].map((meeting) => (
                                  <label key={meeting.key} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-blue-600" 
                                      checked={formData[meeting.key]}
                                      onChange={(e) => handleFormChange(meeting.key, e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{meeting.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      </TabsContent>

                      {/* Technology Stack Tab */}
                      <TabsContent value="technology" className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Technology Stack & Environment</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Programming Languages</label>
                              <textarea 
                                rows="3" 
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., C#, JavaScript, Python, Java, TypeScript..."
                                value={formData.primaryProgrammingLanguages}
                                onChange={(e) => handleFormChange('primaryProgrammingLanguages', e.target.value)}
                              ></textarea>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Development Environments</label>
                              <div className="space-y-2">
                                {[
                                  { label: 'Visual Studio', key: 'visualStudio' },
                                  { label: 'VS Code', key: 'vsCode' },
                                  { label: 'IntelliJ IDEA', key: 'intellijIDEA' },
                                  { label: 'Eclipse', key: 'eclipse' },
                                  { label: 'Other IDEs', key: 'otherIDEs' }
                                ].map((env) => (
                                  <label key={env.key} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-blue-600" 
                                      checked={formData[env.key]}
                                      onChange={(e) => handleFormChange(env.key, e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{env.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      </TabsContent>

                    </Tabs>
                  </div>
                )}
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