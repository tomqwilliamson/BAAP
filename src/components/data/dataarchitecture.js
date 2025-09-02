// src/components/Data/DataArchitecture.js - Data architecture assessment
import React, { useState, useEffect } from 'react';
import { 
  Database, GitBranch, BarChart3, Clock, Upload, Download, Save, FileText, Image, 
  Shield, Zap, DollarSign, RefreshCw, Brain, Activity, Server, AlertTriangle,
  Trash2, TrendingUp, Network, Filter, CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import { aiAnalysisService } from '../../services/aiAnalysisService';
import { apiService } from '../../services/apiService';
import { useAnalysis } from '../../hooks/useAnalysis';
import { API_BASE_URL } from '../../services/api';
import { dirtyTrackingService } from '../../services/dirtyTrackingService';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../contexts/notificationcontext';

// Helper functions
const getCompatibilityTarget = (dbType) => {
  if (dbType.includes('SQL Server')) return 'Azure SQL Database';
  if (dbType.includes('MongoDB')) return 'Azure Cosmos DB';
  if (dbType.includes('Redis')) return 'Azure Cache for Redis';
  if (dbType.includes('PostgreSQL')) return 'Azure Database for PostgreSQL';
  if (dbType.includes('Oracle')) return 'Azure SQL Managed Instance';
  if (dbType.includes('DB2')) return 'Azure SQL Managed Instance';
  return 'Azure SQL Database';
};

const generateSchemas = (dbType) => {
  if (dbType.includes('SQL Server')) return ['dbo', 'staging', 'reporting'];
  if (dbType.includes('MongoDB')) return ['collections'];
  if (dbType.includes('Redis')) return ['cache', 'session'];
  return ['main', 'staging'];
};

const generateDMAAssessments = (databases) => {
  return databases.map((db, index) => ({
    database: db.name,
    status: db.performance > 80 ? 'Ready' : db.performance > 60 ? 'Warning' : 'Needs Work',
    compatibility: db.performance,
    blockers: db.performance > 80 ? 0 : Math.floor(Math.random() * 5) + 1,
    warnings: Math.floor(Math.random() * 10) + 2
  }));
};

const generateCompatibilityMatrix = (databases) => {
  const matrix = {};
  databases.forEach(db => {
    matrix[db.name] = {
      azureSQL: db.performance,
      cosmosDB: Math.floor(Math.random() * 40) + 60,
      managedInstance: Math.floor(Math.random() * 30) + 70
    };
  });
  return matrix;
};

const generateDMARecommendations = (databases) => {
  return databases.map(db => ({
    database: db.name,
    recommendation: `Optimize ${db.name} for ${getCompatibilityTarget(db.type)}`,
    priority: db.performance > 80 ? 'Low' : db.performance > 60 ? 'Medium' : 'High',
    effort: db.performance > 80 ? 'Small' : 'Medium'
  }));
};

const createTechnologyDistribution = (databases) => {
  const distribution = {};
  databases.forEach(db => {
    const type = db.type.split(' ')[0]; // Get base type like "SQL" from "SQL Server"
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return Object.entries(distribution).map(([type, count]) => ({
    type,
    count,
    name: type
  }));
};

function DataArchitecture() {
  const { currentAssessment } = useAssessment();
  const { startAnalysis, getAnalysisState, isAnalysisRunning } = useAnalysis();
  const { addAnalysisNotification } = useNotifications();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
  const analysisState = getAnalysisState('data-architecture');
  const isAIAnalyzing = isAnalysisRunning('data-architecture');
  
  // Wrapper function to track dirty state when data changes
  const updateDataArchData = (newData) => {
    setDataArchData(newData);
    
    // Mark as dirty when data changes (except during initial load)
    if (currentAssessment?.id) {
      dirtyTrackingService.setDirty(currentAssessment.id, 'data-architecture', true);
    }
  };

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
    checkAIServiceAvailability();
    loadDocuments();
    loadInsights();
  }, [currentAssessment]);

  // Set up dirty tracking and SignalR
  useEffect(() => {
    if (!currentAssessment?.id) return;

    // Register this module for dirty tracking
    dirtyTrackingService.registerModule(currentAssessment.id, 'data-architecture', dataArchData);

    // Set up dirty tracking listener
    const unsubscribeDirty = dirtyTrackingService.onDirtyStateChange(
      currentAssessment.id,
      'data-architecture',
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
      dirtyTrackingService.unregisterModule(currentAssessment.id, 'data-architecture');
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
    'Data Architecture',
    'Technical Architecture', 
    'Business Requirements',
    'Infrastructure Documentation',
    'Security Documentation',
    'DevOps Documentation',
    'Project Management',
    'Compliance & Governance'
  ];

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Files/assessment/${currentAssessment?.id}?category=Data`);
      
      if (!response.ok) {
        setDocuments([]);
        return;
      }
      
      const data = await response.json();
      
      // Extract files array from the API response structure { summary, files }
      const filesArray = data.files || [];
      
      // Map the files to the expected document format
      const dataDocs = filesArray.map(file => ({
        id: file.id,
        name: file.originalFileName,
        fileName: file.originalFileName,
        documentType: 'Data Architecture',
        category: file.category || 'data-architecture',
        size: file.fileSize,
        sizeBytes: file.fileSize,
        uploadedDate: file.uploadedDate,
        uploadedAt: file.uploadedDate,
        uploadedBy: file.uploadedBy || 'System',
        description: file.description,
        summary: file.description || 'Data architecture document',
        contentType: file.contentType,
        chunks: file.chunks || [],
        keyFindings: file.keyFindings || []
      }));
      
      setDocuments(dataDocs);
    } catch (error) {
      console.error('Error loading data architecture documents:', error);
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
            title: "Database Migration Readiness",
            category: "Data",
            analysisCategory: "Data Architecture",
            documentType: "Data Architecture",
            content: "Analysis shows mixed readiness levels for database migration with optimization opportunities.",
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
      
      // Transform recommendations to insights format and filter for Data category
      const dataInsights = allRecommendations
        .filter(recommendation => 
          recommendation.category === 'Data' || 
          recommendation.category === 'Data Architecture' ||
          recommendation.area === 'Data' ||
          recommendation.type === 'Data'
        )
        .map((recommendation, index) => ({
          id: recommendation.id || `data_${index + 1}`,
          title: recommendation.title || recommendation.recommendation || recommendation.name || 'Data Architecture Recommendation',
          category: "Data",
          analysisCategory: "Data Architecture",
          documentType: "Data Architecture",
          content: recommendation.description || recommendation.details || recommendation.content || recommendation.recommendation || 'No description available',
          confidence: recommendation.priority === 'High' ? 90 : recommendation.priority === 'Medium' ? 75 : recommendation.priority === 'Low' ? 60 : 75,
          createdAt: new Date().toISOString()
        }));
      
      setInsights(dataInsights);
    } catch (error) {
      console.error('Error loading data architecture insights:', error);
      // Fallback to mock data on error
      setInsights([
        {
          id: 1,
          title: "Database Migration Readiness",
          category: "Data",
          analysisCategory: "Data Architecture",
          documentType: "Data Architecture",
          content: "Analysis shows mixed readiness levels for database migration with optimization opportunities.",
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
        formData.append('documentType', 'Data Architecture');
        formData.append('category', 'data-architecture');
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

  const loadDataArchitectureData = async () => {
    if (!currentAssessment?.id) {
      console.log('DATA ARCHITECTURE: No assessment selected');
      return;
    }

    try {
      setLoading(true);
      console.log('DATA ARCHITECTURE: Loading data for assessment:', currentAssessment?.id, currentAssessment);
      
      // Load AI analysis timestamp from API
      try {
        const assessmentData = await apiService.getAssessment(currentAssessment.id);
        if (assessmentData.dataArchitectureLastAiAnalysis) {
          setLastAiAnalysisTime(new Date(assessmentData.dataArchitectureLastAiAnalysis));
          console.log('DATA ARCHITECTURE: Loaded AI analysis timestamp from API:', assessmentData.dataArchitectureLastAiAnalysis);
        }
      } catch (error) {
        console.warn('Failed to load AI analysis timestamp from API:', error);
      }
      
      // Try to load from localStorage first
      const savedDataKey = `dataArchitectureData_${currentAssessment.id}`;
      const savedData = localStorage.getItem(savedDataKey);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setDataArchData(parsed);
          setDataSaved(true);
          const saveDate = parsed.lastSaveTime || new Date();
          setLastSaveTime(new Date(saveDate));
          setIsDatabaseMode(false);
          console.log('DATA ARCHITECTURE: Loaded data from localStorage for assessment:', currentAssessment.id);
          return;
        } catch (error) {
          console.error('Error parsing saved data architecture data:', error);
        }
      }
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'dataArchitecture');
      console.log('DATA ARCHITECTURE: Generated assessment data:', assessmentSpecificData);
      
      if (assessmentSpecificData && assessmentSpecificData.databases) {
        console.log('DATA ARCHITECTURE: Using assessment-specific data');
        // Use assessment-specific data
        const enhancedData = {
          microsoftDMA: {
            databases: assessmentSpecificData.databases.map((db, index) => ({
              name: db.name,
              type: db.type,
              size: db.size,
              compatibility: getCompatibilityTarget(db.type),
              readiness: db.performance,
              issues: Math.floor(Math.random() * 15) + 1,
              schemas: generateSchemas(db.type),
              tableCount: Math.floor(Math.random() * 200) + 50,
              details: `${db.name} - High-performance ${db.type} database`
            })),
            assessments: generateDMAAssessments(assessmentSpecificData.databases),
            compatibility: generateCompatibilityMatrix(assessmentSpecificData.databases),
            recommendations: generateDMARecommendations(assessmentSpecificData.databases)
          },
          databases: createTechnologyDistribution(assessmentSpecificData.databases),
          rawDatabases: assessmentSpecificData.databases,
          integration: assessmentSpecificData.dataflows || [],
          dataFlow: assessmentSpecificData.dataflows || [],
          quality: {
            overall: 85,
            completeness: 92,
            accuracy: 88,
            consistency: 79,
            timeliness: 91
          },
          governance: {
            dataClassification: {
              public: 35,
              internal: 40,
              confidential: 20,
              restricted: 5
            },
            compliance: {
              gdpr: { status: 'Compliant', coverage: 92 },
              hipaa: { status: 'Partial', coverage: 78 },
              sox: { status: 'Compliant', coverage: 95 },
              pciDss: { status: 'In Progress', coverage: 67 }
            },
            dataLineage: {
              documented: 68,
              automated: 23,
              missing: 9
            }
          },
          uploadedFiles: [],
          analysis: {
            databaseAnalysis: assessmentSpecificData.analysis?.dataArchitectureAnalysis || '',
            migrationAnalysis: assessmentSpecificData.analysis?.modernizationAnalysis || '',
            performanceAnalysis: assessmentSpecificData.analysis?.performanceAnalysis || '',
            modernizationRecommendations: assessmentSpecificData.analysis?.modernizationAnalysis || ''
          }
        };
        setDataArchData(enhancedData);
      } else {
        console.log('DATA ARCHITECTURE: Using fallback mock data');
        // Fallback to mock data
        const mockData = {
        microsoftDMA: {
          databases: [
            { name: 'CustomerDB-Prod', type: 'SQL Server 2019', size: '485 GB', compatibility: 'Azure SQL DB', readiness: 94, issues: 2, 
              schemas: ['dbo', 'customer', 'orders', 'inventory'], tableCount: 247, 
              details: 'Primary OLTP database with customer data, order management, and inventory tracking' },
            { name: 'DataWarehouse-Main', type: 'SQL Server 2017', size: '2.8 TB', compatibility: 'Azure Synapse', readiness: 78, issues: 12, 
              schemas: ['dw', 'staging', 'mart', 'reporting'], tableCount: 156,
              details: 'Enterprise data warehouse with historical data, complex ETL processes, and analytical workloads' },
            { name: 'LegacyFinance-DB', type: 'SQL Server 2012', size: '920 GB', compatibility: 'Azure SQL MI', readiness: 58, issues: 24, 
              schemas: ['finance', 'gl', 'ap', 'ar', 'payroll'], tableCount: 89,
              details: 'Legacy financial system with custom stored procedures, CLR assemblies, and regulatory compliance requirements' },
            { name: 'CRM-Analytics', type: 'SQL Server 2016', size: '320 GB', compatibility: 'Azure SQL DB', readiness: 89, issues: 5, 
              schemas: ['crm', 'analytics', 'staging'], tableCount: 67,
              details: 'CRM analytics database with customer segmentation, campaign tracking, and performance metrics' },
            { name: 'Archive-Historical', type: 'SQL Server 2008 R2', size: '1.5 TB', compatibility: 'Azure Blob + SQL MI', readiness: 42, issues: 31, 
              schemas: ['archive', 'historical', 'audit'], tableCount: 198,
              details: 'Historical archive database requiring major refactoring due to deprecated features and compliance retention' },
            { name: 'SessionState-Redis', type: 'Redis 6.2', size: '45 GB', compatibility: 'Azure Cache for Redis', readiness: 98, issues: 0, 
              schemas: ['session', 'cache'], tableCount: 0,
              details: 'High-performance session state and application caching layer' },
            { name: 'DocumentStore-Mongo', type: 'MongoDB 4.4', size: '180 GB', compatibility: 'Azure Cosmos DB', readiness: 85, issues: 6, 
              schemas: ['products', 'catalog', 'content'], tableCount: 0,
              details: 'Product catalog and content management with flexible document schemas' },
            { name: 'Analytics-Postgres', type: 'PostgreSQL 13', size: '650 GB', compatibility: 'Azure Database for PostgreSQL', readiness: 91, issues: 3, 
              schemas: ['analytics', 'metrics', 'logs'], tableCount: 45,
              details: 'Advanced analytics database with geospatial data, JSON documents, and machine learning extensions' }
          ],
          compatibility: { 
            azureSQLDB: 42, 
            azureSQLMI: 28, 
            azureSynapse: 15,
            azureCosmosDB: 8,
            sqlServerOnVM: 7 
          },
          recommendations: [
            'Prioritize migration of high-readiness SQL Server 2019 and 2017 databases',
            'Plan comprehensive refactoring for SQL Server 2008 R2 legacy systems',
            'Consider Azure Synapse Analytics for the data warehouse modernization',
            'Implement Azure Cosmos DB for document store migration with API compatibility',
            'Establish hybrid connectivity for phased migration approach',
            'Implement automated backup and disaster recovery strategies',
            'Plan for data governance and compliance requirements during migration'
          ]
        },
        databases: [
          { type: 'SQL Server', count: 12, usage: 'OLTP/Data Warehouse', performance: 82, totalSize: '6.5 TB', versions: ['2008 R2', '2012', '2016', '2017', '2019'] },
          { type: 'PostgreSQL', count: 6, usage: 'Analytics/GIS', performance: 91, totalSize: '980 GB', versions: ['11', '12', '13'] },
          { type: 'MongoDB', count: 4, usage: 'Document Store', performance: 87, totalSize: '420 GB', versions: ['4.2', '4.4'] },
          { type: 'Redis', count: 8, usage: 'Caching/Session', performance: 96, totalSize: '185 GB', versions: ['6.0', '6.2'] },
          { type: 'Oracle', count: 2, usage: 'Legacy ERP', performance: 74, totalSize: '1.2 TB', versions: ['11g', '12c'] },
          { type: 'MySQL', count: 5, usage: 'Web Applications', performance: 85, totalSize: '340 GB', versions: ['5.7', '8.0'] }
        ],
        integration: [
          { pattern: 'REST APIs', count: 28, complexity: 'Low', description: 'Standard HTTP REST endpoints for web and mobile applications' },
          { pattern: 'Message Queues (RabbitMQ)', count: 12, complexity: 'Medium', description: 'Asynchronous message processing for order fulfillment and notifications' },
          { pattern: 'ETL/ELT Batch Processing', count: 18, complexity: 'High', description: 'SSIS packages and custom ETL for data warehouse loading' },
          { pattern: 'Real-time Streaming (Kafka)', count: 6, complexity: 'High', description: 'Event streaming for real-time analytics and monitoring' },
          { pattern: 'File-based Transfer (SFTP)', count: 9, complexity: 'Medium', description: 'Scheduled file transfers with external partners and systems' },
          { pattern: 'Database Replication', count: 7, complexity: 'Medium', description: 'Always On availability groups and read replicas' },
          { pattern: 'Web Services (SOAP)', count: 4, complexity: 'Low', description: 'Legacy web services for third-party integrations' },
          { pattern: 'Direct Database Access', count: 15, complexity: 'High', description: 'Direct SQL connections requiring refactoring for cloud migration' }
        ],
        dataFlow: [
          { month: 'Jul 2024', volume: 3.2, latency: 125, throughput: 2400, errors: 12 },
          { month: 'Aug 2024', volume: 3.8, latency: 118, throughput: 2850, errors: 8 },
          { month: 'Sep 2024', volume: 4.1, latency: 110, throughput: 3200, errors: 6 },
          { month: 'Oct 2024', volume: 4.7, latency: 105, throughput: 3650, errors: 4 },
          { month: 'Nov 2024', volume: 5.2, latency: 98, throughput: 4100, errors: 3 },
          { month: 'Dec 2024', volume: 5.8, latency: 92, throughput: 4580, errors: 2 }
        ],
        quality: {
          completeness: 87,
          accuracy: 82,
          consistency: 85,
          timeliness: 79,
          validity: 91,
          uniqueness: 88,
          integrity: 84
        },
        governance: {
          dataClassification: {
            public: 35,
            internal: 40,
            confidential: 20,
            restricted: 5
          },
          compliance: {
            gdpr: { status: 'Compliant', coverage: 92 },
            hipaa: { status: 'Partial', coverage: 78 },
            sox: { status: 'Compliant', coverage: 95 },
            pciDss: { status: 'In Progress', coverage: 67 }
          },
          dataLineage: {
            documented: 68,
            automated: 23,
            missing: 9
          }
        },
        uploadedFiles: [
          { name: 'microsoft-dma-assessment-full.json', type: 'dma', size: '15.7 MB', uploadDate: '2024-01-20', status: 'Processed' },
          { name: 'sql-server-perfmon-logs.csv', type: 'log', size: '89.2 MB', uploadDate: '2024-01-19', status: 'Processed' },
          { name: 'database-schema-export.sql', type: 'schema', size: '12.4 MB', uploadDate: '2024-01-18', status: 'Processed' },
          { name: 'data-warehouse-erd.pdf', type: 'diagram', size: '8.3 MB', uploadDate: '2024-01-17', status: 'Processed' },
          { name: 'compliance-data-classification.xlsx', type: 'governance', size: '2.1 MB', uploadDate: '2024-01-16', status: 'Processed' },
          { name: 'integration-architecture.vsdx', type: 'diagram', size: '5.8 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'postgres-query-analysis.log', type: 'log', size: '45.6 MB', uploadDate: '2024-01-14', status: 'Processed' },
          { name: 'mongodb-profiler-output.json', type: 'log', size: '18.9 MB', uploadDate: '2024-01-13', status: 'Processed' }
        ],
        analysis: {
          databaseAnalysis: '',
          migrationAnalysis: '',
          performanceAnalysis: '',
          modernizationRecommendations: ''
        }
      };
      setDataArchData(mockData);
      }
    } catch (error) {
      console.error('Error loading data architecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDataArchitectureData = async () => {
    try {
      if (!currentAssessment?.id) {
        toast.error('No assessment selected. Please select an assessment first.');
        return;
      }

      // Save to localStorage with assessment-specific key
      const savedDataKey = `dataArchitectureData_${currentAssessment.id}`;
      const dataToSave = {
        ...dataArchData,
        lastSaveTime: new Date().toISOString()
      };
      localStorage.setItem(savedDataKey, JSON.stringify(dataToSave));
      
      // Mark as clean in dirty tracking service
      dirtyTrackingService.setDirty(currentAssessment.id, 'data-architecture', false);
      setLastSaveTime(new Date());
      setIsDatabaseMode(false); // Using local storage
      
      toast.success(`Data architecture assessment saved for "${currentAssessment.name}"!`);
      console.log('DATA ARCHITECTURE: Saved assessment data for:', currentAssessment.id);
    } catch (error) {
      console.error('Error saving data architecture data:', error);
      toast.error('Error saving data');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dataArchData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `data-architecture-assessment-${currentAssessment?.id || 'data'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data architecture data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setDataArchData(importedData);
          setDataSaved(false); // Mark as unsaved after import
          setLastSaveTime(new Date());
          toast.success('Data architecture data imported successfully');
        } catch (error) {
          toast.error('Error importing data - invalid format');
        }
      };
      reader.readAsText(file);
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

  // Note: exportAssessment, importAssessment, and saveAssessment functions have been replaced with 
  // exportData, importData, and saveDataArchitectureData defined above

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    setAiAnalysisResults(null);
    
    // Start the progress tracking analysis
    const result = await startAnalysis('data-architecture');
    
    if (!currentAssessment?.id) {
      toast.error('No assessment selected');
      setIsAnalyzing(false);
      return;
    }

    try {
      // Use the dirty tracking service to run AI analysis with SignalR notifications
      const analysisResults = await dirtyTrackingService.startAIAnalysis(
        currentAssessment.id,
        'data-architecture',
        async () => {
          // Try AI analysis first if available
          if (aiServiceAvailable) {
            // Transform data architecture data for AI analysis
            const dataArchitectureRequest = {
              databases: dataArchData.databases.map(db => ({
                name: db.name,
                type: db.type,
                version: db.version,
                sizeGB: db.size,
                configuration: { status: db.status, performance: db.performance }
              })),
              dataGovernance: 'Enterprise data governance with classification, lineage tracking, and compliance monitoring',
              dataFlows: dataArchData.integration?.map(i => `${i.from} -> ${i.to}: ${i.description}`).join('; ') || 'ETL pipelines, real-time streaming, batch processing',
              uploadedDocuments: []
            };
            
            // Call AI analysis service
            const aiResponse = await aiAnalysisService.analyzeDataArchitecture(dataArchitectureRequest);
            
            // Format and store AI results
            const formattedAiResults = aiAnalysisService.formatAnalysisResponse(aiResponse);
            setAiAnalysisResults(formattedAiResults);
            
            return {
              databaseAnalysis: formattedAiResults,
              isAiPowered: true,
              analysisMode: aiCapabilities?.mode || 'AI-Powered'
            };
          } else {
            // Fall back to simulation mode
            return generateSimulationResults();
          }
        }
      );

      // Update data with analysis results
      setDataArchData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setShowAnalysisResults(true);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      try {
        await apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'dataarchitecture');
        console.log('DATA ARCHITECTURE: AI analysis timestamp saved to API');
      } catch (error) {
        console.warn('Failed to save AI analysis timestamp to API:', error);
      }

      // Add to local notifications as well
      addAnalysisNotification(
        'data-architecture', 
        currentAssessment.name, 
        null
      );

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
      
      // Fall back to simulation mode
      const analysisResults = generateSimulationResults();
      
      setDataArchData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setShowAnalysisResults(true);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      try {
        await apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'dataarchitecture');
        console.log('DATA ARCHITECTURE: AI analysis timestamp saved to API (simulation mode)');
      } catch (error) {
        console.warn('Failed to save AI analysis timestamp to API:', error);
      }
      
      toast.success('Analysis completed using simulation mode', { 
        duration: 3000,
        icon: '📊'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSimulationResults = () => {
    return {
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
4. **Implement**: Real-time analytics, automated backup, and disaster recovery solutions`,

      isAiPowered: false,
      analysisMode: 'Simulation'
    };
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

  const compatibilityColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
  const compatibilityData = [
    { name: 'Azure SQL DB', value: dataArchData.microsoftDMA?.compatibility?.azureSQLDB || 42 },
    { name: 'Azure SQL MI', value: dataArchData.microsoftDMA?.compatibility?.azureSQLMI || 28 },
    { name: 'Azure Synapse', value: dataArchData.microsoftDMA?.compatibility?.azureSynapse || 15 },
    { name: 'Azure Cosmos DB', value: dataArchData.microsoftDMA?.compatibility?.azureCosmosDB || 8 },
    { name: 'SQL Server VM', value: dataArchData.microsoftDMA?.compatibility?.sqlServerOnVM || 7 }
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
              onClick={saveDataArchitectureData}
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
              <div>
                {dataSaved && lastSaveTime 
                  ? `Last saved: ${lastSaveTime?.toLocaleString ? lastSaveTime.toLocaleString() : 'Unknown time'} ${isDatabaseMode ? '(DB)' : '(Local)'}`
                  : 'Not saved yet'
                }
                {isDatabaseMode ? (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Database Mode</span>
                ) : (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Local Storage</span>
                )}
              </div>
              <div className="mt-1">
                {lastAiAnalysisTime 
                  ? `Last AI Analysis: ${lastAiAnalysisTime.toLocaleDateString()} ${lastAiAnalysisTime.toLocaleTimeString()}`
                  : 'No AI analysis run yet'
                }
              </div>
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

            {/* Data Governance Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Governance & Compliance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Classification */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Data Classification</h4>
                  {Object.entries(dataArchData.governance?.dataClassification || {}).map(([level, percentage]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              level === 'restricted' ? 'bg-red-500' :
                              level === 'confidential' ? 'bg-yellow-500' :
                              level === 'internal' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Compliance Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Compliance Status</h4>
                  {Object.entries(dataArchData.governance?.compliance || {}).map(([standard, info]) => (
                    <div key={standard} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600 uppercase">{standard}</span>
                        <div className="text-xs text-gray-500">{info.coverage}% coverage</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        info.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                        info.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {info.status}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Data Lineage */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Data Lineage Coverage</h4>
                  {Object.entries(dataArchData.governance?.dataLineage || {}).map(([type, percentage]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              type === 'missing' ? 'bg-red-500' :
                              type === 'automated' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                    </div>
                  ))}
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
                <h3 className="text-lg font-semibold text-gray-900">Microsoft DMA - Detailed Database Assessment</h3>
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
                <h3 className="text-lg font-semibold text-gray-900">Data Architecture Source Integration</h3>
                <p className="text-sm text-gray-600">Upload specific data architecture documents for comprehensive analysis</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Microsoft DMA Results */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                    <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Microsoft DMA</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload DMA assessment results, compatibility reports, migration recommendations</p>
                  </div>

                  {/* Database Documentation */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Database Logs</h4>
                    <p className="text-sm text-gray-600 mb-4">SQL Server logs, query performance data, database schemas, indexes</p>
                  </div>

                  {/* Data Models & ERDs */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Data Models</h4>
                    <p className="text-sm text-gray-600 mb-4">ERDs, data models, database documentation, data flow diagrams</p>
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
              <p className="text-lg mb-2">Or drag and drop data architecture documents here</p>
              <p className="text-sm text-gray-500">
                DMA reports • Database logs • Data models • ERDs • Documentation
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
                          No data architecture documents uploaded yet. Upload some documents to get started!
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
                          
                          {insight.keyThemes && insight.keyThemes.length > 0 && (
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

                          {insight.relatedDocuments && insight.relatedDocuments.length > 0 && (
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