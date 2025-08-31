// src/components/Business/BusinessContext.js - Business context analysis with workshop data gathering
import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Target, TrendingUp, DollarSign, Calendar, FileText, AlertCircle,
  Plus, Edit3, Save, X, Trash2, Brain, Download, Upload, Eye, EyeOff, Settings,
  CheckCircle, Clock, Network, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { formatCurrency } from '../../utils/currency';
import { useAssessment } from '../../contexts/assessmentcontext';
import { apiService } from '../../services/apiService';
import { aiAnalysisService } from '../../services/aiAnalysisService';
import businessContextService from '../../services/businessContextService';
import { useAnalysis } from '../../hooks/useAnalysis';
import { API_BASE_URL } from '../../services/api';

// Generate assessment-specific mock data
const generateMockDataForAssessment = (assessment, businessDrivers) => {
  const assessmentId = assessment.id;
  
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      businessDrivers: businessDrivers.length > 0 ? businessDrivers : [
        {
          id: 1,
          name: 'Customer Experience Improvement',
          description: 'Enhance digital customer experience and reduce cart abandonment',
          priority: 'Critical',
          impact: 90,
          urgency: 85,
          businessValue: 'Increased customer satisfaction and revenue'
        },
        {
          id: 2,
          name: 'Platform Scalability',
          description: 'Scale platform to handle peak shopping seasons and growth',
          priority: 'High',
          impact: 85,
          urgency: 70,
          businessValue: 'Support business growth without performance issues'
        },
        {
          id: 3,
          name: 'Payment Security',
          description: 'Enhance payment processing security and compliance',
          priority: 'Critical',
          impact: 95,
          urgency: 80,
          businessValue: 'Customer trust and regulatory compliance'
        },
        {
          id: 4,
          name: 'Cost Optimization',
          description: 'Reduce infrastructure costs through cloud migration',
          priority: 'Medium',
          impact: 75,
          urgency: 60,
          businessValue: 'Annual savings of $200,000+'
        }
      ],
      stakeholderGroups: [
        {
          id: 1,
          name: 'Executive Leadership',
          members: ['CEO', 'CTO', 'VP of Engineering'],
          role: 'Strategic Decision Making',
          influence: 'High',
          interest: 'High',
          notes: 'Primary sponsors and budget approvers'
        },
        {
          id: 2,
          name: 'Development Team',
          members: ['Lead Developer', 'Frontend Team', 'Backend Team'],
          role: 'Technical Implementation',
          influence: 'Medium',
          interest: 'High',
          notes: 'Responsible for day-to-day development and migration'
        },
        {
          id: 3,
          name: 'Customer Support',
          members: ['Support Manager', 'Customer Success Team'],
          role: 'End User Advocacy',
          influence: 'Medium',
          interest: 'High',
          notes: 'Represents customer needs and concerns'
        }
      ],
      projectTimeline: [
        {
          id: 1,
          phase: 'Discovery & Planning',
          description: 'Requirements gathering, architecture design, and migration strategy',
          startDate: '2025-01-15',
          duration: '6 weeks',
          dependencies: 'Business requirements approval',
          deliverables: 'Technical architecture, migration plan, risk assessment',
          status: 'Planned'
        },
        {
          id: 2,
          phase: 'Infrastructure Setup',
          description: 'Cloud infrastructure provisioning and CI/CD pipeline setup',
          startDate: '2025-03-01',
          duration: '4 weeks',
          dependencies: 'Architecture approval',
          deliverables: 'Production-ready infrastructure, deployment pipelines',
          status: 'Planned'
        },
        {
          id: 3,
          phase: 'Core Platform Migration',
          description: 'Migrate core e-commerce functionality and payment systems',
          startDate: '2025-04-01',
          duration: '8 weeks',
          dependencies: 'Infrastructure ready',
          deliverables: 'Migrated core platform, payment integration',
          status: 'Planned'
        }
      ],
      riskAssessment: [
        {
          id: 1,
          risk: 'Customer Data Migration Complexity',
          probability: 'Medium',
          impact: 'High',
          category: 'Technical',
          mitigation: 'Comprehensive testing strategy and rollback plan',
          owner: 'Technical Lead'
        },
        {
          id: 2,
          risk: 'Performance Degradation During Migration',
          probability: 'Medium',
          impact: 'Medium',
          category: 'Business',
          mitigation: 'Gradual migration approach with load testing',
          owner: 'DevOps Team'
        }
      ],
      budgetAllocation: {
        assessment: 85000,
        implementation: 520000,
        maintenance: 180000,
        contingency: 65000
      },
      analysis: {
        driversAnalysis: 'Analysis of 4 business driver(s) shows strong focus on digital transformation and customer experience. High-priority drivers indicate urgent modernization needs. Critical priority on Customer Experience Improvement (90% impact, 85% urgency) demonstrates commitment to user satisfaction.',
        stakeholderAnalysis: 'Stakeholder analysis reveals 3 key stakeholder groups. Executive leadership provides strategic direction while development teams ensure technical feasibility. Customer support brings valuable end-user perspective.',
        timelineAnalysis: 'Project timeline consists of 3 planned phases spanning 18 weeks. E-commerce platform migration requires careful coordination between infrastructure setup and core platform migration to minimize customer impact.',
        riskAnalysis: 'Risk assessment identifies 2 key risks focused on technical complexity and performance. Medium-probability risks require proactive mitigation strategies including comprehensive testing and gradual rollout.',
        recommendations: 'Strategic recommendations: 1) Prioritize customer experience features, 2) Implement comprehensive testing strategy, 3) Plan for gradual migration to minimize business impact, 4) Establish performance monitoring throughout migration.',
        considerations: 'Key considerations: Customer impact during migration, data integrity, performance optimization, and team training on new platform.'
      }
    };
  }
  
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      businessDrivers: businessDrivers.length > 0 ? businessDrivers : [
        {
          id: 1,
          name: 'Regulatory Compliance',
          description: 'Meet banking and financial regulations (SOX, PCI-DSS)',
          priority: 'Critical',
          impact: 98,
          urgency: 95,
          businessValue: 'Avoid regulatory penalties and maintain banking license'
        },
        {
          id: 2,
          name: 'Security Enhancement',
          description: 'Strengthen cybersecurity posture against financial threats',
          priority: 'Critical',
          impact: 95,
          urgency: 90,
          businessValue: 'Protect customer data and prevent financial losses'
        },
        {
          id: 3,
          name: 'Audit Readiness',
          description: 'Maintain continuous audit readiness and documentation',
          priority: 'High',
          impact: 85,
          urgency: 75,
          businessValue: 'Streamlined audit processes and reduced compliance costs'
        }
      ],
      stakeholderGroups: [
        {
          id: 1,
          name: 'Compliance Team',
          members: ['Chief Compliance Officer', 'Risk Manager', 'Audit Team'],
          role: 'Regulatory Oversight',
          influence: 'High',
          interest: 'High',
          notes: 'Ensures all changes meet financial regulations'
        },
        {
          id: 2,
          name: 'Security Team',
          members: ['CISO', 'Security Architects', 'SOC Team'],
          role: 'Security Implementation',
          influence: 'High',
          interest: 'High',
          notes: 'Responsible for security controls and monitoring'
        },
        {
          id: 3,
          name: 'Banking Operations',
          members: ['Operations Manager', 'Business Analysts'],
          role: 'Business Requirements',
          influence: 'Medium',
          interest: 'High',
          notes: 'Daily operations and customer impact assessment'
        }
      ],
      projectTimeline: [
        {
          id: 1,
          phase: 'Security Assessment',
          description: 'Comprehensive security audit and vulnerability assessment',
          startDate: '2025-02-01',
          duration: '4 weeks',
          dependencies: 'System access approval',
          deliverables: 'Security assessment report, vulnerability matrix',
          status: 'In Progress'
        },
        {
          id: 2,
          phase: 'Compliance Review',
          description: 'Regulatory compliance gap analysis and remediation planning',
          startDate: '2025-03-01',
          duration: '6 weeks',
          dependencies: 'Security assessment complete',
          deliverables: 'Compliance gap analysis, remediation roadmap',
          status: 'Planned'
        },
        {
          id: 3,
          phase: 'Implementation',
          description: 'Security controls implementation and compliance remediation',
          startDate: '2025-04-15',
          duration: '12 weeks',
          dependencies: 'Management approval',
          deliverables: 'Enhanced security posture, compliance certification',
          status: 'Planned'
        }
      ],
      riskAssessment: [
        {
          id: 1,
          risk: 'Regulatory Non-Compliance',
          probability: 'High',
          impact: 'High',
          category: 'Compliance',
          mitigation: 'Continuous compliance monitoring and regular audits',
          owner: 'Compliance Officer'
        },
        {
          id: 2,
          risk: 'Data Breach During Assessment',
          probability: 'Low',
          impact: 'High',
          category: 'Security',
          mitigation: 'Strict access controls and monitoring during assessment',
          owner: 'CISO'
        },
        {
          id: 3,
          risk: 'Business Disruption',
          probability: 'Medium',
          impact: 'Medium',
          category: 'Business',
          mitigation: 'Phased approach with minimal business impact',
          owner: 'Operations Manager'
        }
      ],
      budgetAllocation: {
        assessment: 130000,
        implementation: 380000,
        maintenance: 120000,
        contingency: 20000
      },
      analysis: {
        driversAnalysis: 'Analysis of 3 business driver(s) shows critical focus on regulatory compliance and security enhancement. High-priority compliance drivers indicate urgent regulatory requirements that must be addressed to avoid penalties.',
        stakeholderAnalysis: 'Stakeholder analysis reveals 3 key groups with compliance and security teams having highest influence. Strong regulatory oversight ensures all changes meet financial industry standards.',
        timelineAnalysis: 'Project timeline consists of 3 phases over 22 weeks. Security-first approach with comprehensive assessment before implementation ensures thorough risk mitigation.',
        riskAnalysis: 'Risk assessment identifies 3 key risks with regulatory non-compliance rated as high probability and high impact. Comprehensive mitigation strategies focus on continuous monitoring and compliance validation.',
        recommendations: 'Critical recommendations: 1) Prioritize regulatory compliance remediation, 2) Implement continuous security monitoring, 3) Establish regular audit cycles, 4) Enhance incident response capabilities.',
        considerations: 'Key considerations: Regulatory deadlines, business continuity during security updates, staff training on new compliance procedures, and ongoing monitoring requirements.'
      }
    };
  }
  
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      businessDrivers: businessDrivers.length > 0 ? businessDrivers : [
        {
          id: 1,
          name: 'Innovation Enablement',
          description: 'Enable faster innovation through modern cloud infrastructure',
          priority: 'High',
          impact: 88,
          urgency: 85,
          businessValue: 'Accelerated time-to-market and competitive advantage'
        }
      ],
      stakeholderGroups: [
        {
          id: 1,
          name: 'Cloud Architecture Team',
          members: ['Cloud Architect', 'Solutions Architect', 'Platform Engineers'],
          role: 'Technical Leadership',
          influence: 'High',
          interest: 'High',
          notes: 'Designs and implements cloud migration strategy'
        },
        {
          id: 2,
          name: 'Application Teams',
          members: ['Development Teams', 'Application Owners'],
          role: 'Application Migration',
          influence: 'Medium',
          interest: 'High',
          notes: 'Responsible for individual application migrations'
        }
      ],
      projectTimeline: [
        {
          id: 1,
          phase: 'Cloud Readiness Assessment',
          description: 'Evaluate applications and infrastructure for cloud migration',
          startDate: '2025-01-01',
          duration: '8 weeks',
          dependencies: 'Resource allocation',
          deliverables: 'Migration readiness report, cloud strategy',
          status: 'In Progress'
        },
        {
          id: 2,
          phase: 'Pilot Migration',
          description: 'Migrate selected low-risk applications as proof of concept',
          startDate: '2025-03-01',
          duration: '6 weeks',
          dependencies: 'Assessment completion',
          deliverables: 'Pilot applications migrated, lessons learned',
          status: 'Planned'
        }
      ],
      riskAssessment: [
        {
          id: 1,
          risk: 'Vendor Lock-in',
          probability: 'Medium',
          impact: 'Medium',
          category: 'Strategic',
          mitigation: 'Multi-cloud strategy and portable architecture',
          owner: 'Cloud Architect'
        }
      ],
      budgetAllocation: {
        assessment: 180000,
        implementation: 1200000,
        maintenance: 450000,
        contingency: 270000
      },
      analysis: {
        driversAnalysis: 'Analysis of 1 business driver focused on innovation enablement. Cloud migration represents strategic shift toward modern, scalable infrastructure supporting future growth and innovation initiatives.',
        stakeholderAnalysis: 'Stakeholder analysis reveals 2 key groups with cloud architecture team providing technical leadership. Strong collaboration between architects and application teams ensures successful migration.',
        timelineAnalysis: 'Project timeline consists of 2 phases over 14 weeks. Phased approach with pilot migration reduces risk and validates cloud strategy before full-scale implementation.',
        riskAnalysis: 'Risk assessment identifies 1 strategic risk around vendor lock-in. Mitigation through multi-cloud strategy ensures flexibility and avoids single vendor dependency.',
        recommendations: 'Strategic recommendations: 1) Execute pilot migration for validation, 2) Implement multi-cloud architecture, 3) Establish cloud governance framework, 4) Plan for staff training and capability development.',
        considerations: 'Key considerations: Application compatibility, data migration strategies, performance optimization in cloud environment, and ongoing cloud cost management.'
      }
    };
  }
};

function BusinessContext() {
  const { currentAssessment, loadAssessment } = useAssessment();
  const { startAnalysis, getAnalysisState, isAnalysisRunning } = useAnalysis();
  const [currentView, setCurrentView] = useState('overview'); // overview, gather, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState(null);
  const [usingDatabaseData, setUsingDatabaseData] = useState(false);
  const [aiServiceAvailable, setAiServiceAvailable] = useState(false);
  const [aiCapabilities, setAiCapabilities] = useState(null);
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [insights, setInsights] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState('documents');
  const [dragOver, setDragOver] = useState(false);

  // Get analysis state for this module
  const analysisState = getAnalysisState('business-context');
  const isAIAnalyzing = isAnalysisRunning('business-context');
  
  // Business context data structure - will be loaded from assessment
  const [businessData, setBusinessData] = useState({
    projectInfo: {
      name: '',
      description: '',
      duration: '',
      totalBudget: ''
    },
    businessDrivers: [
      {
        id: 1,
        name: 'Digital Transformation Acceleration',
        description: 'Modernize core business applications to support digital-first customer experiences and streamline operations',
        priority: 'Critical',
        impact: 95,
        urgency: 88,
        businessValue: 'Competitive advantage and customer satisfaction'
      },
      {
        id: 2,
        name: 'Cost Optimization',
        description: 'Reduce operational costs through cloud migration and infrastructure optimization',
        priority: 'High',
        impact: 82,
        urgency: 75,
        businessValue: `Annual savings of ${formatCurrency(800000)}+ on infrastructure`
      },
      {
        id: 3,
        name: 'Security & Compliance Enhancement',
        description: 'Address security vulnerabilities and ensure regulatory compliance across all systems',
        priority: 'Critical',
        impact: 98,
        urgency: 92,
        businessValue: 'Risk mitigation and regulatory adherence'
      },
      {
        id: 4,
        name: 'Developer Productivity',
        description: 'Improve developer experience and accelerate time-to-market for new features',
        priority: 'Medium',
        impact: 76,
        urgency: 65,
        businessValue: 'Faster feature delivery and reduced development costs'
      }
    ],
    stakeholderGroups: [
      {
        id: 1,
        role: 'Chief Technology Officer',
        name: 'Sarah Chen',
        influence: 'High',
        interest: 'High',
        involvement: 'Executive sponsor and strategic decision maker',
        contact: 'sarah.chen@company.com',
        expectations: 'Successful digital transformation with minimal business disruption'
      },
      {
        id: 2,
        role: 'VP of Engineering',
        name: 'Michael Rodriguez',
        influence: 'High',
        interest: 'High',
        involvement: 'Technical leadership and resource allocation',
        contact: 'michael.rodriguez@company.com',
        expectations: 'Modern tech stack with improved developer experience'
      },
      {
        id: 3,
        role: 'Security & Compliance Director',
        name: 'Lisa Thompson',
        influence: 'High',
        interest: 'High',
        involvement: 'Security review and compliance oversight',
        contact: 'lisa.thompson@company.com',
        expectations: 'Enhanced security posture and regulatory compliance'
      },
      {
        id: 4,
        role: 'Business Operations Manager',
        name: 'David Kim',
        influence: 'Medium',
        interest: 'High',
        involvement: 'Business process coordination and user acceptance',
        contact: 'david.kim@company.com',
        expectations: 'Minimal operational disruption during transition'
      },
      {
        id: 5,
        role: 'Development Team Lead',
        name: 'Jennifer Walsh',
        influence: 'Medium',
        interest: 'High',
        involvement: 'Technical implementation and team coordination',
        contact: 'jennifer.walsh@company.com',
        expectations: 'Clear technical roadmap and adequate training'
      }
    ],
    budgetAllocation: {
      assessment: 320000,
      implementation: 2100000,
      maintenance: 580000,
      training: 200000
    },
    projectTimeline: [
      {
        id: 1,
        phase: 'Discovery & Assessment',
        description: 'Comprehensive assessment of current applications, architecture analysis, and modernization strategy development',
        startDate: '2025-01-15',
        duration: '8 weeks',
        dependencies: 'Stakeholder interviews and system access',
        deliverables: 'Assessment reports, modernization roadmap, risk analysis',
        status: 'In Progress'
      },
      {
        id: 2,
        phase: 'Architecture Design',
        description: 'Design target architecture, select technologies, and create detailed migration plans',
        startDate: '2025-03-15',
        duration: '6 weeks',
        dependencies: 'Completion of assessment phase',
        deliverables: 'Target architecture, technology selection, migration plans',
        status: 'Planned'
      },
      {
        id: 3,
        phase: 'Pilot Implementation',
        description: 'Implement and test modernization approach with 2-3 pilot applications',
        startDate: '2025-05-01',
        duration: '12 weeks',
        dependencies: 'Architecture approval and resource allocation',
        deliverables: 'Pilot applications, lessons learned, refined processes',
        status: 'Planned'
      },
      {
        id: 4,
        phase: 'Full-Scale Migration',
        description: 'Migrate remaining applications according to established patterns and processes',
        startDate: '2025-08-01',
        duration: '24 weeks',
        dependencies: 'Successful pilot completion',
        deliverables: 'Modernized applications, updated documentation',
        status: 'Planned'
      },
      {
        id: 5,
        phase: 'Optimization & Closure',
        description: 'Performance optimization, knowledge transfer, and project closure activities',
        startDate: '2026-01-15',
        duration: '8 weeks',
        dependencies: 'Migration completion',
        deliverables: 'Optimized systems, documentation, team training',
        status: 'Planned'
      }
    ],
    riskAssessment: [
      {
        id: 1,
        risk: 'Legacy System Dependencies',
        category: 'Technical',
        probability: 'High',
        impact: 'High',
        mitigation: 'Detailed dependency mapping, phased migration approach, and fallback strategies',
        owner: 'Michael Rodriguez',
        status: 'Open'
      },
      {
        id: 2,
        risk: 'Budget Overrun',
        category: 'Budget',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Regular budget reviews, contingency planning, and scope management',
        owner: 'Sarah Chen',
        status: 'Open'
      },
      {
        id: 3,
        risk: 'Resource Availability',
        category: 'Resource',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: 'Early resource commitment, cross-training, and external contractor backup',
        owner: 'Jennifer Walsh',
        status: 'Open'
      },
      {
        id: 4,
        risk: 'Security Vulnerabilities',
        category: 'Technical',
        probability: 'Low',
        impact: 'High',
        mitigation: 'Security-first design, regular penetration testing, and compliance reviews',
        owner: 'Lisa Thompson',
        status: 'Open'
      },
      {
        id: 5,
        risk: 'Business Process Disruption',
        category: 'Business',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: 'Comprehensive change management, user training, and parallel system operation',
        owner: 'David Kim',
        status: 'Open'
      }
    ],
    analysis: {
      driversAnalysis: 'Analysis of 4 business driver(s) shows clear organizational focus on digital transformation and risk mitigation. High-priority drivers indicate urgent business needs that should be addressed immediately. The critical priority on Digital Transformation Acceleration (95% impact, 88% urgency) and Security & Compliance Enhancement (98% impact, 92% urgency) demonstrates strong executive commitment to modernization. Average impact score: 88% with urgency at 80%, indicating well-balanced strategic priorities.',
      stakeholderAnalysis: 'Stakeholder analysis reveals 5 key stakeholder groups identified. 3 high-influence stakeholders require special attention for project success. The current stakeholder matrix shows 5 highly interested parties, which indicates strong organizational support. Executive sponsorship from CTO level ensures strategic alignment, while technical leadership from VP of Engineering provides implementation support.',
      timelineAnalysis: 'Project timeline consists of 5 planned phases. For the "Enterprise Application Modernization Initiative" project, the phased approach appears comprehensive with multiple delivery milestones. The 18-month timeline balances thorough assessment with timely delivery, including an 8-week pilot phase to validate approaches before full-scale migration.',
      riskAnalysis: 'Risk assessment identifies 5 key risks. Risk distribution: 0 high-probability and 2 high-impact risks require immediate mitigation strategies. Categories include: Technical, Budget, Resource, Business. The focus on legacy system dependencies and budget management reflects realistic enterprise modernization challenges.',
      recommendations: `Strategic Recommendations based on current context:

1. Address critical business drivers first focusing on Digital Transformation and Security Enhancement
2. Leverage 3 high-influence stakeholders as project champions, particularly CTO and VP Engineering
3. Execute 5-phase delivery plan with milestone reviews and pilot validation
4. Implement mitigation for 2 high-impact risks related to legacy dependencies and budget
5. Establish change management and communication plans
6. Define success metrics and regular review cadences

Priority Actions:
- Secure executive sponsorship and resource commitments
- Complete comprehensive dependency mapping
- Implement robust security and compliance frameworks
- Establish regular stakeholder communication cadence
- Plan for minimal business disruption during migrations`
    }
  });

  const [editingDriver, setEditingDriver] = useState(null);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [editingTimelineItem, setEditingTimelineItem] = useState(null);
  const [editingRisk, setEditingRisk] = useState(null);

  // Load assessment data when currentAssessment changes
  useEffect(() => {
    loadAssessmentData();
    checkAIServiceAvailability();
    loadDocuments();
    loadInsights();
  }, [currentAssessment]);

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

  // Save budget allocation to database with debouncing
  const saveBudgetAllocation = async (budgetData) => {
    if (!currentAssessment?.id) return;
    
    try {
      await businessContextService.saveBudgetAllocation(currentAssessment.id, budgetData);
      console.log('Budget allocation saved to database');
    } catch (error) {
      console.error('Failed to save budget allocation:', error);
      toast.error('Failed to save budget allocation');
    }
  };

  // Debounced save function
  const debouncedSaveBudget = React.useCallback(
    debounce((budgetData) => {
      saveBudgetAllocation(budgetData);
    }, 1000),
    [currentAssessment?.id]
  );

  // Document management functions
  const documentTypes = [
    'Business Requirements',
    'Strategic Documents', 
    'Business Process Documentation',
    'Stakeholder Analysis',
    'Market Research',
    'Financial Planning',
    'Project Charter',
    'Business Case Documentation'
  ];

  const loadDocuments = async () => {
    // Check localStorage for document API unavailability
    const documentUnavailableKey = 'baap_document_api_unavailable';
    const stored = localStorage.getItem(documentUnavailableKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        // If stored timestamp is within 1 minute, skip API call
        if (now - data.timestamp < 60000) {
          console.warn('Document API recently unavailable, using empty documents');
          setDocuments([]);
          return;
        }
      } catch (error) {
        // Invalid storage data, continue with API call
      }
    }
    
    try {
      // Use Files controller endpoint for assessment files
      const assessmentId = currentAssessment?.id || 1; // Default to 1 if no assessment
      const response = await fetch(`${API_BASE_URL}/Files/assessment/${assessmentId}?category=General,Requirements`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Files API not available, using empty documents');
          // Save unavailability state to localStorage
          localStorage.setItem(documentUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
          setDocuments([]);
          return;
        }
        throw new Error(`Failed to load documents: ${response.status}`);
      }
      
      const data = await response.json();
      // The Files API returns { summary, files } structure
      if (data && data.files && Array.isArray(data.files)) {
        // Map Files API response to expected document structure
        const businessDocs = data.files.map(file => ({
          id: file.id,
          name: file.originalFileName,
          documentType: file.category || 'General',
          category: 'business',
          uploadedBy: file.uploadedBy,
          uploadedDate: file.uploadedDate,
          fileSize: file.fileSize,
          contentType: file.contentType,
          description: file.description
        }));
        setDocuments(businessDocs);
      } else {
        console.warn('Files API returned unexpected data structure, using empty documents');
        setDocuments([]);
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.warn('Document API not available, using empty documents');
        // Save unavailability state to localStorage
        localStorage.setItem(documentUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
        setDocuments([]);
      } else if (error.message.includes('Unexpected token') || error.name === 'SyntaxError') {
        console.warn('Document API returned invalid JSON (likely HTML error page), using empty documents');
        // Save unavailability state to localStorage
        localStorage.setItem(documentUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
        setDocuments([]);
      } else {
        console.error('Error loading business documents:', error);
        setDocuments([]);
      }
    }
  };

  const loadInsights = async () => {
    // Check localStorage for insights API unavailability
    const insightsUnavailableKey = 'baap_insights_api_unavailable';
    const stored = localStorage.getItem(insightsUnavailableKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        // If stored timestamp is within 1 minute, skip API call
        if (now - data.timestamp < 60000) {
          console.warn('Document insights API recently unavailable, using empty insights');
          setInsights([]);
          return;
        }
      } catch (error) {
        // Invalid storage data, continue with API call
      }
    }
    
    try {
      // Use Intelligence recommendations endpoint for insights
      const assessmentId = currentAssessment?.id || 'default';
      const response = await fetch(`${API_BASE_URL}/Intelligence/recommendations/${assessmentId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Document insights API not available, using empty insights');
          // Save unavailability state to localStorage
          localStorage.setItem(insightsUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
          setInsights([]);
          return;
        }
        throw new Error(`Failed to load insights: ${response.status}`);
      }
      
      const data = await response.json();
      // Transform Intelligence API response to insights format
      if (data) {
        const businessInsights = [{
          id: 1,
          documentId: 1,
          fileName: 'Business Analysis Report',
          analysisCategory: 'Business',
          documentType: 'Business Requirements',
          insight: 'AI-powered business analysis recommendations available',
          confidence: 0.9,
          keyThemes: ['Digital Transformation', 'Cloud Migration', 'Business Optimization'],
          relatedDocuments: [],
          recommendations: data
        }];
        setInsights(businessInsights);
      } else {
        console.warn('Intelligence API returned unexpected data, using empty insights');
        setInsights([]);
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.warn('Document insights API not available, using empty insights');
        // Save unavailability state to localStorage
        localStorage.setItem(insightsUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
        setInsights([]);
      } else if (error.message.includes('Unexpected token') || error.name === 'SyntaxError') {
        console.warn('Document insights API returned invalid JSON (likely HTML error page), using empty insights');
        // Save unavailability state to localStorage
        localStorage.setItem(insightsUnavailableKey, JSON.stringify({ timestamp: Date.now() }));
        setInsights([]);
      } else {
        console.error('Error loading business insights:', error);
        setInsights([]);
      }
    }
  };

  const handleDocumentUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ fileName: file.name, progress: 0 });
      
      try {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('Category', 'Requirements');
        formData.append('Description', 'Business requirements document');
        formData.append('AssessmentId', currentAssessment?.id || 1);
        
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
      'Strategic Documents': 'bg-purple-100 text-purple-800',
      'Business Process Documentation': 'bg-green-100 text-green-800',
      'Stakeholder Analysis': 'bg-orange-100 text-orange-800',
      'Market Research': 'bg-pink-100 text-pink-800',
      'Financial Planning': 'bg-yellow-100 text-yellow-800',
      'Project Charter': 'bg-indigo-100 text-indigo-800',
      'Business Case Documentation': 'bg-gray-100 text-gray-800'
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

  const loadAssessmentData = async () => {
    try {
      setLoading(true);
      
      // If we have a current assessment, load its data from the database
      if (currentAssessment?.id) {
        console.log('LOADING: Assessment data for ID:', currentAssessment.id);
        
        // Load project information from assessment
        const projectInfo = {
          name: currentAssessment.type || currentAssessment.name || '',
          description: currentAssessment.businessObjective || currentAssessment.description || '',
          duration: currentAssessment.timeline || '',
          totalBudget: currentAssessment.budget ? formatCurrency(currentAssessment.budget) : ''
        };
        
        console.log('LOADING: Current assessment data:', {
          id: currentAssessment.id,
          name: currentAssessment.name,
          type: currentAssessment.type,
          description: currentAssessment.description,
          businessObjective: currentAssessment.businessObjective,
          timeline: currentAssessment.timeline,
          budget: currentAssessment.budget
        });
        console.log('LOADING: Mapped projectInfo:', projectInfo);

        // Load business drivers for this assessment
        let businessDrivers = [];
        let stakeholderGroups = [];
        let hasStoredData = false;
        
        try {
          const driversResponse = await apiService.getBusinessDrivers(currentAssessment.id);
          businessDrivers = driversResponse.businessDrivers || [];
          console.log('LOADING: Business drivers loaded:', businessDrivers.length);
        } catch (error) {
          console.log('LOADING: No business drivers found for this assessment');
          businessDrivers = [];
        }

        try {
          const stakeholdersResponse = await apiService.getStakeholders(currentAssessment.id);
          stakeholderGroups = stakeholdersResponse.stakeholders || [];
          console.log('LOADING: Stakeholders loaded:', stakeholderGroups.length);
        } catch (error) {
          console.log('LOADING: No stakeholders found for this assessment');
          stakeholderGroups = [];
        }

        hasStoredData = businessDrivers.length > 0 || stakeholderGroups.length > 0;

        // Load budget allocation from database
        let budgetAllocation = null;
        try {
          budgetAllocation = await businessContextService.getBudgetAllocation(currentAssessment.id);
          console.log('LOADING: Budget allocation loaded from database:', budgetAllocation);
        } catch (error) {
          console.warn('LOADING: Failed to load budget allocation from database, using fallback');
          const assessmentSpecificData = generateMockDataForAssessment(currentAssessment, businessDrivers);
          budgetAllocation = assessmentSpecificData.budgetAllocation || {
            assessment: 0,
            implementation: 0,
            maintenance: 0,
            training: 0
          };
        }

        if (hasStoredData) {
          // Use database data - prioritize real data over simulation
          console.log('LOADING: Using database data');
          setUsingDatabaseData(true);
          const assessmentSpecificData = generateMockDataForAssessment(currentAssessment, businessDrivers);
          setBusinessData({
            projectInfo,
            businessDrivers,
            stakeholderGroups,
            projectTimeline: [], // Will be loaded from database separately
            budgetAllocation: {
              assessment: budgetAllocation?.assessmentCost || budgetAllocation?.assessment || 0,
              implementation: budgetAllocation?.implementation || 0,
              maintenance: budgetAllocation?.maintenance || 0,
              training: budgetAllocation?.training || 0,
              contingency: budgetAllocation?.contingency || 0
            },
            risks: assessmentSpecificData.risks || []
          });
          console.log('LOADING: Set businessData with database budget allocation');
        } else {
          // No database data found - use assessment-specific simulation data as fallback
          console.log('LOADING: No database data found, using simulation data for assessment', currentAssessment.id);
          setUsingDatabaseData(false);
          const assessmentSpecificData = generateMockDataForAssessment(currentAssessment, []);
          setBusinessData({
            ...assessmentSpecificData,
            projectInfo,
            budgetAllocation: {
              assessment: budgetAllocation?.assessmentCost || budgetAllocation?.assessment || assessmentSpecificData.budgetAllocation?.assessment || 0,
              implementation: budgetAllocation?.implementation || assessmentSpecificData.budgetAllocation?.implementation || 0,
              maintenance: budgetAllocation?.maintenance || assessmentSpecificData.budgetAllocation?.maintenance || 0,
              training: budgetAllocation?.training || assessmentSpecificData.budgetAllocation?.training || 0,
              contingency: budgetAllocation?.contingency || assessmentSpecificData.budgetAllocation?.contingency || 0
            }
          });
          console.log('LOADING: Set businessData with simulation + database budget');
        }

        setDataSaved(true);
        setLastSaveTime(new Date());
        console.log('LOADING: Assessment data loaded successfully');
      } else {
        // No assessment selected - load from localStorage as fallback or show empty
        console.log('LOADING: No current assessment selected');
        const savedData = localStorage.getItem('businessContextData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setBusinessData(parsed);
        } else {
          // Set to empty/default state
          setBusinessData({
            projectInfo: {
              name: '',
              description: '',
              duration: '',
              totalBudget: ''
            },
            businessDrivers: [],
            stakeholderGroups: [],
            projectTimeline: [],
            riskAssessment: [],
            budgetAllocation: {
              assessment: 0,
              implementation: 0,
              maintenance: 0,
              contingency: 0
            },
            analysis: {
              driversAnalysis: '',
              stakeholderAnalysis: '',
              timelineAnalysis: '',
              riskAnalysis: '',
              recommendations: '',
              considerations: ''
            }
          });
        }
      }
    } catch (error) {
      console.error('LOADING ERROR: Error loading assessment data:', error);
      toast.error('Error loading assessment data');
    } finally {
      setLoading(false);
    }
  };

  const saveBusinessData = async () => {
    try {
      // Save to localStorage as backup
      localStorage.setItem('businessContextData', JSON.stringify(businessData));
      
      // Debug logging
      console.log('BIZ SAVE: Starting save process...');
      console.log('BIZ SAVE: Current assessment:', currentAssessment);
      console.log('BIZ SAVE: Project info:', businessData.projectInfo);
      
      // Save to database if we have a current assessment
      if (currentAssessment?.id) {
        // Parse budget value
        const budgetValue = businessData.projectInfo.totalBudget?.replace(/[^0-9.-]+/g, "");
        const parsedBudget = budgetValue ? parseFloat(budgetValue) : null;
        
        // Save project information to assessment - using PascalCase for C# API
        const assessmentUpdate = {
          Id: currentAssessment.id,
          Name: currentAssessment.name,
          Description: businessData.projectInfo.description || currentAssessment.description,
          Status: currentAssessment.status,
          Type: businessData.projectInfo.name || currentAssessment.type,
          Scope: `Project: ${businessData.projectInfo.name || 'Business Context Assessment'}`,
          BusinessObjective: businessData.projectInfo.description || currentAssessment.businessObjective,
          Timeline: businessData.projectInfo.duration || currentAssessment.timeline,
          Budget: parsedBudget || currentAssessment.budget,
          Notes: currentAssessment.notes,
          CreatedDate: currentAssessment.createdDate,
          StartedDate: currentAssessment.startedDate,
          CompletedDate: currentAssessment.completedDate,
          EstimatedCost: currentAssessment.estimatedCost,
          PotentialSavings: currentAssessment.potentialSavings,
          OverallScore: currentAssessment.overallScore,
          SecurityScore: currentAssessment.securityScore,
          CloudReadinessScore: currentAssessment.cloudReadinessScore
        };

        console.log('BIZ SAVE: Assessment update payload:', assessmentUpdate);
        
        const updateResult = await apiService.updateAssessment(currentAssessment.id, assessmentUpdate);
        console.log('BIZ SAVE: Assessment update result:', updateResult);

        // Save business drivers to database
        if (businessData?.businessDrivers?.length > 0) {
          const driversResult = await apiService.updateBusinessDrivers(currentAssessment.id, {
            businessDrivers: businessData.businessDrivers
          });
          console.log('BIZ SAVE: Business drivers update result:', driversResult);
        }

        // Save stakeholders to database
        if (businessData?.stakeholderGroups?.length > 0) {
          // For each stakeholder, add them to the assessment
          for (const stakeholder of businessData.stakeholderGroups) {
            try {
              if (stakeholder.id && stakeholder.id > 0 && !stakeholder.id.toString().startsWith('new_')) {
                // Update existing stakeholder
                await apiService.updateStakeholder(stakeholder.id, stakeholder);
                console.log('BIZ SAVE: Updated stakeholder:', stakeholder.name || stakeholder.role);
              } else {
                // Add new stakeholder
                await apiService.addStakeholder(currentAssessment.id, {
                  ...stakeholder,
                  assessmentId: currentAssessment.id
                });
                console.log('BIZ SAVE: Added new stakeholder:', stakeholder.name || stakeholder.role);
              }
            } catch (error) {
              console.error('BIZ SAVE: Error saving stakeholder:', stakeholder.name || stakeholder.role, error);
            }
          }
        }

        console.log('BIZ SAVE: Data saved to database and localStorage successfully');
        setUsingDatabaseData(true); // Now using database data since we just saved it
        
        // Reload the current assessment to get the updated data in context
        console.log('BIZ SAVE: Reloading assessment to refresh context data');
        await loadAssessment(currentAssessment.id);
        
        toast.success('Business context data saved to database successfully');
      } else {
        console.log('BIZ SAVE: No current assessment found - currentAssessment is:', currentAssessment);
        toast.success('Business context data saved locally (no active assessment selected)');
      }

      setDataSaved(true);
      setLastSaveTime(new Date());
    } catch (error) {
      console.error('BIZ SAVE ERROR: Full error object:', error);
      console.error('BIZ SAVE ERROR: Error message:', error.message);
      console.error('BIZ SAVE ERROR: Error response:', error.response?.data);
      toast.error(`Error saving data: ${error.message}`);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(businessData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'business-context-analysis.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setBusinessData(importedData);
          setDataSaved(true);
          setLastSaveTime(new Date());
          toast.success('Data imported successfully');
        } catch (error) {
          toast.error('Error importing data - invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  // Business Driver Management
  const addBusinessDriver = () => {
    const newDriver = {
      id: Date.now(),
      name: '',
      description: '',
      priority: 'Medium',
      impact: 50,
      urgency: 50,
      businessValue: ''
    };
    setBusinessData(prev => ({
      ...prev,
      businessDrivers: [...(prev?.businessDrivers || []), newDriver]
    }));
    setEditingDriver(newDriver.id);
    setDataSaved(false); // Mark as unsaved when data changes
  };

  const updateBusinessDriver = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      businessDrivers: (prev?.businessDrivers || []).map(driver =>
        driver.id === id ? { ...driver, ...updates } : driver
      )
    }));
    setDataSaved(false); // Mark as unsaved when data changes
  };

  const deleteBusinessDriver = (id) => {
    setBusinessData(prev => ({
      ...prev,
      businessDrivers: (prev?.businessDrivers || []).filter(driver => driver.id !== id)
    }));
  };

  // Stakeholder Management
  const addStakeholder = () => {
    const newStakeholder = {
      id: Date.now(),
      role: '',
      name: '',
      influence: 'Medium',
      interest: 'Medium',
      involvement: '',
      contact: '',
      expectations: ''
    };
    setBusinessData(prev => ({
      ...prev,
      stakeholderGroups: [...(prev?.stakeholderGroups || []), newStakeholder]
    }));
    setEditingStakeholder(newStakeholder.id);
  };

  const updateStakeholder = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      stakeholderGroups: (prev?.stakeholderGroups || []).map(stakeholder =>
        stakeholder.id === id ? { ...stakeholder, ...updates } : stakeholder
      )
    }));
  };

  const deleteStakeholder = (id) => {
    setBusinessData(prev => ({
      ...prev,
      stakeholderGroups: (prev?.stakeholderGroups || []).filter(stakeholder => stakeholder.id !== id)
    }));
  };

  // Timeline Management
  const addTimelineItem = () => {
    const newItem = {
      id: Date.now(),
      phase: '',
      description: '',
      startDate: '',
      duration: '',
      dependencies: '',
      deliverables: '',
      status: 'Planned'
    };
    setBusinessData(prev => ({
      ...prev,
      projectTimeline: [...(prev?.projectTimeline || []), newItem]
    }));
    setEditingTimelineItem(newItem.id);
  };

  const updateTimelineItem = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      projectTimeline: (prev?.projectTimeline || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteTimelineItem = (id) => {
    setBusinessData(prev => ({
      ...prev,
      projectTimeline: (prev?.projectTimeline || []).filter(item => item.id !== id)
    }));
  };

  // Risk Management
  const addRisk = () => {
    const newRisk = {
      id: Date.now(),
      risk: '',
      category: 'Technical',
      probability: 'Medium',
      impact: 'Medium',
      mitigation: '',
      owner: '',
      status: 'Open'
    };
    setBusinessData(prev => ({
      ...prev,
      riskAssessment: [...(prev?.riskAssessment || []), newRisk]
    }));
    setEditingRisk(newRisk.id);
  };

  const updateRisk = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      riskAssessment: (prev?.riskAssessment || []).map(risk =>
        risk.id === id ? { ...risk, ...updates } : risk
      )
    }));
  };

  const deleteRisk = (id) => {
    setBusinessData(prev => ({
      ...prev,
      riskAssessment: (prev?.riskAssessment || []).filter(risk => risk.id !== id)
    }));
  };

  // LLM Analysis Integration
  const runLLMAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysisResults(null);
    
    // Start the progress tracking analysis
    const result = await startAnalysis('business-context');
    
    let analysisResults;

    try {
      // Try AI analysis first if available
      if (aiServiceAvailable) {
        toast.success('Starting AI-powered business context analysis...', { duration: 3000 });
        
        // Transform business data for AI analysis
        const businessContextRequest = {
          companyName: businessData.projectInfo.name || currentAssessment?.name || 'Organization',
          industry: currentAssessment?.industry || 'Technology',
          businessDrivers: (businessData?.businessDrivers || []).map(d => `${d.name}: ${d.description} (Priority: ${d.priority}, Impact: ${d.impact}%)`).join('\n'),
          timelineRequirements: businessData.projectInfo.duration || currentAssessment?.timeline || 'TBD',
          budgetConstraints: businessData.projectInfo.totalBudget || currentAssessment?.budget || 'TBD',
          complianceRequirements: businessData?.riskAssessment?.filter(r => r.category?.includes('Compliance')).map(r => r.name).join(', ') || 'Standard enterprise compliance',
          uploadedDocuments: []
        };
        
        // Call AI analysis service
        const aiResponse = await aiAnalysisService.analyzeBusinessContext(businessContextRequest);
        
        // Format and store AI results
        const formattedAiResults = aiAnalysisService.formatAnalysisResponse(aiResponse);
        setAiAnalysisResults(formattedAiResults);
        
        analysisResults = {
          driversAnalysis: formattedAiResults,
          isAiPowered: true,
          analysisMode: aiCapabilities?.mode || 'AI-Powered'
        };

        toast.success('AI analysis completed successfully!', { 
          duration: 4000,
          icon: '🤖'
        });

      } else {
        // Fall back to simulation mode
        analysisResults = generateSimulationResults();
        
        toast.success('Analysis completed using simulation mode', { 
          duration: 3000,
          icon: '📊'
        });
      }
    } catch (error) {
      console.error('AI analysis failed, falling back to simulation:', error);
      toast.error('AI analysis failed, using simulation mode', { duration: 3000 });
      
      // Fall back to simulation mode
      analysisResults = generateSimulationResults();
    }

    setBusinessData(prev => ({
      ...prev,
      analysis: analysisResults
    }));
    
    setShowAnalysisResults(true);
    setIsAnalyzing(false);
  };

  const generateSimulationResults = () => {
    // Generate analysis based on available data
    const hasDrivers = businessData?.businessDrivers?.length > 0;
    const hasStakeholders = businessData?.stakeholderGroups?.length > 0;
    const hasTimeline = businessData?.projectTimeline?.length > 0;
    const hasRisks = businessData?.riskAssessment?.length > 0;
    const hasProject = businessData?.projectInfo?.name;
    
    return {
      driversAnalysis: hasDrivers 
        ? `Analysis of ${businessData?.businessDrivers?.length || 0} business driver(s) shows clear organizational focus areas. ${businessData?.businessDrivers?.filter(d => d.priority === 'Critical' || d.priority === 'High').length > 0 ? 'High-priority drivers indicate urgent business needs that should be addressed immediately.' : 'The balanced priority distribution suggests a well-planned transformation approach.'} Average impact score: ${Math.round(businessData?.businessDrivers?.reduce((sum, d) => sum + d.impact, 0) / (businessData?.businessDrivers?.length || 1))}% with urgency at ${Math.round(businessData?.businessDrivers?.reduce((sum, d) => sum + d.urgency, 0) / (businessData?.businessDrivers?.length || 1))}%.`
        : `Business drivers analysis framework: Organizations typically focus on cost optimization (40%), digital transformation (30%), security compliance (20%), and operational efficiency (10%). Consider identifying your primary drivers in areas such as competitive advantage, regulatory compliance, scalability needs, and innovation requirements.`,
      
      stakeholderAnalysis: hasStakeholders 
        ? `Stakeholder analysis reveals ${businessData?.stakeholderGroups?.length || 0} key stakeholder group(s) identified. ${businessData?.stakeholderGroups?.filter(s => s.influence === 'High').length || 0} high-influence stakeholders require special attention for project success. The current stakeholder matrix shows ${businessData?.stakeholderGroups?.filter(s => s.interest === 'High').length || 0} highly interested parties, which indicates ${(businessData?.stakeholderGroups?.filter(s => s.interest === 'High').length || 0) > (businessData?.stakeholderGroups?.length || 1) / 2 ? 'strong organizational support' : 'need for increased engagement strategies'}.`
        : `Stakeholder management framework: Identify key stakeholders across executive leadership (C-level), operational management (directors/VPs), technical teams (architects/leads), and end users. Map each by influence level (high/medium/low) and interest (high/medium/low) to develop targeted engagement strategies.`,
      
      timelineAnalysis: hasTimeline 
        ? `Project timeline consists of ${businessData?.projectTimeline?.length || 0} planned phase(s). ${hasProject ? `For the "${businessData?.projectInfo?.name}" project, ` : ''}the phased approach ${(businessData?.projectTimeline?.length || 0) > 3 ? 'appears comprehensive with multiple delivery milestones' : 'follows a streamlined delivery model'}. Timeline dependencies should be carefully managed to ensure sequential delivery success.`
        : `Timeline planning framework: Consider a phased approach with (1) Discovery & Planning (2-3 months), (2) Foundation & Architecture (3-6 months), (3) Implementation & Integration (6-12 months), and (4) Testing & Deployment (2-4 months). Adjust timelines based on organizational complexity and resource availability.`,
      
      riskAnalysis: hasRisks 
        ? `Risk assessment identifies ${businessData?.riskAssessment?.length || 0} key risk(s). Risk distribution: ${businessData?.riskAssessment?.filter(r => r.probability === 'High').length || 0} high-probability, ${businessData?.riskAssessment?.filter(r => r.impact === 'High').length || 0} high-impact risks require immediate mitigation strategies. Categories include: ${[...new Set(businessData?.riskAssessment?.map(r => r.category) || [])].join(', ')}.`
        : `Risk management framework: Common transformation risks include technical complexity (40% probability), resource constraints (60% probability), stakeholder resistance (30% probability), and budget overruns (25% probability). Develop mitigation strategies for each category with defined ownership and monitoring processes.`,
      
      recommendations: hasDrivers || hasStakeholders || hasTimeline || hasRisks
        ? `Strategic Recommendations based on current context:

1. ${hasDrivers ? `Address ${businessData?.businessDrivers?.filter(d => d.priority === 'Critical').length > 0 ? 'critical business drivers first' : 'high-impact drivers systematically'}` : 'Define and prioritize business drivers'}
2. ${hasStakeholders ? `Leverage ${businessData?.stakeholderGroups?.filter(s => s.influence === 'High').length || 0} high-influence stakeholder(s) as project champions` : 'Establish stakeholder governance structure'}
3. ${hasTimeline ? `Execute ${businessData?.projectTimeline?.length || 0}-phase delivery plan with milestone reviews` : 'Develop detailed project timeline with dependencies'}
4. ${hasRisks ? `Implement mitigation for ${businessData?.riskAssessment?.filter(r => r.impact === 'High').length || 0} high-impact risks` : 'Conduct comprehensive risk assessment'}
5. Establish change management and communication plans
6. Define success metrics and regular review cadences`
        : `Strategic Recommendations for Project Success:

1. Conduct comprehensive business context workshop to identify drivers
2. Map stakeholder influence and develop engagement strategies  
3. Create detailed project timeline with dependencies and milestones
4. Perform risk assessment with mitigation strategies
5. Establish governance structure and communication plans
6. Define success criteria and measurement frameworks
7. Plan for change management and organizational readiness
8. Consider pilot approaches for risk mitigation`,

      isAiPowered: false,
      analysisMode: 'Simulation'
    };
  };

  // Chart data preparation
  const driversChartData = businessData.businessDrivers.map(driver => ({
    name: driver.name.slice(0, 20),
    impact: driver.impact,
    urgency: driver.urgency
  }));

  const budgetChartData = Object.entries(businessData.budgetAllocation)
    .filter(([key, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }));

  const budgetColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInfluenceColor = (influence) => {
    switch (influence) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Main render
  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Business Context Analysis</h2>
            <p className="text-blue-100 mt-1">
              Comprehensive workshop-driven business context gathering and AI-powered analysis
            </p>
            {!currentAssessment && (
              <div className="mt-2 p-3 bg-blue-700 rounded-md border border-blue-500">
                <p className="text-sm text-blue-100">
                  💡 <strong>Tip:</strong> Select an assessment from the Dashboard first to save data to the database.
                </p>
              </div>
            )}
          </div>
          <Building className="h-12 w-12 text-blue-200" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'overview' 
                ? 'bg-white text-blue-800' 
                : 'text-blue-100 hover:text-white hover:bg-blue-700'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setCurrentView('gather')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'gather' 
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

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-3">
          <button
            onClick={saveBusinessData}
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
        <div className="flex flex-col space-y-1 text-sm">
          <div className="text-gray-500">
            {dataSaved && lastSaveTime 
              ? `Last saved: ${lastSaveTime.toLocaleString()}`
              : 'Not saved yet'
            }
          </div>
          <div className={`flex items-center space-x-1 text-xs ${usingDatabaseData ? 'text-green-600' : 'text-orange-600'}`}>
            <div className={`w-2 h-2 rounded-full ${usingDatabaseData ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span>
              {usingDatabaseData ? 'Database Data' : 'Simulation Data'}
            </span>
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
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Business Drivers</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData?.businessDrivers?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Stakeholder Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData?.stakeholderGroups?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Timeline Items</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData?.projectTimeline?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Identified Risks</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData?.riskAssessment?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {businessData?.businessDrivers?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Drivers Impact vs Urgency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={driversChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impact" fill="#3B82F6" name="Impact" />
                    <Bar dataKey="urgency" fill="#10B981" name="Urgency" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {budgetChartData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${(value/1000)}K`}
                      >
                        {budgetChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={budgetColors[index % budgetColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {(!businessData?.businessDrivers || businessData?.businessDrivers?.length === 0) && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-500 mb-4">Start by gathering workshop data to see visualizations and analysis.</p>
              <button
                onClick={() => setCurrentView('gather')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Workshop Data Collection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Data Sources View */}
      {currentView === 'gather' && (
        <div className="space-y-6">
          
          {/* Upload Progress */}
          {uploadProgress && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  {uploadProgress.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : uploadProgress.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
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
            <p className="text-lg mb-2">Drag and drop business documents here</p>
            <p className="text-sm text-gray-500">
              Business requirements • Strategic documents • Process documentation • Excel templates
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
                        No business documents uploaded yet. Upload some documents to get started!
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

          {/* Manual Entry Section - Preserve ALL existing functionality */}
          <div className="bg-blue-50 rounded-lg p-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Manual Data Entry</h3>
            <p className="text-blue-700 mb-4">
              You can also manually enter business context information using the forms below. This data will be combined with any uploaded documents for comprehensive AI analysis.
            </p>
          </div>
          
          {/* Project Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={businessData.projectInfo.name}
                  onChange={(e) => {
                    setBusinessData(prev => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, name: e.target.value }
                    }));
                    setDataSaved(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={businessData.projectInfo.duration}
                  onChange={(e) => {
                    setBusinessData(prev => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, duration: e.target.value }
                    }));
                    setDataSaved(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12 months"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={businessData.projectInfo.description}
                  onChange={(e) => {
                    setBusinessData(prev => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, description: e.target.value }
                    }));
                    setDataSaved(false);
                  }}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                <input
                  type="text"
                  value={businessData.projectInfo.totalBudget}
                  onChange={(e) => {
                    setBusinessData(prev => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, totalBudget: e.target.value }
                    }));
                    setDataSaved(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2500000"
                />
              </div>
            </div>
          </div>

          {/* Business Drivers */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Business Drivers</h3>
              <button
                onClick={addBusinessDriver}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Driver
              </button>
            </div>
            <div className="p-6">
              {(!businessData?.businessDrivers || businessData?.businessDrivers?.length === 0) ? (
                <p className="text-gray-500 text-center py-4">No business drivers added yet. Click "Add Driver" to start.</p>
              ) : (
                <div className="space-y-4">
                  {businessData.businessDrivers.map((driver) => (
                    <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                      {editingDriver === driver.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={driver.name}
                              onChange={(e) => updateBusinessDriver(driver.id, { name: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Driver name"
                            />
                            <select
                              value={driver.priority}
                              onChange={(e) => updateBusinessDriver(driver.id, { priority: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Low">Low Priority</option>
                              <option value="Medium">Medium Priority</option>
                              <option value="High">High Priority</option>
                              <option value="Critical">Critical Priority</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Impact (1-100)</label>
                              <input
                                type="range"
                                min="1"
                                max="100"
                                value={driver.impact}
                                onChange={(e) => updateBusinessDriver(driver.id, { impact: parseInt(e.target.value) })}
                                className="w-full"
                              />
                              <span className="text-sm text-gray-500">{driver.impact}%</span>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Urgency (1-100)</label>
                              <input
                                type="range"
                                min="1"
                                max="100"
                                value={driver.urgency}
                                onChange={(e) => updateBusinessDriver(driver.id, { urgency: parseInt(e.target.value) })}
                                className="w-full"
                              />
                              <span className="text-sm text-gray-500">{driver.urgency}%</span>
                            </div>
                          </div>
                          <textarea
                            value={driver.description}
                            onChange={(e) => updateBusinessDriver(driver.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Driver description and business value"
                            rows="2"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingDriver(null)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => deleteBusinessDriver(driver.id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{driver.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(driver.priority)}`}>
                                {driver.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{driver.description}</p>
                            <div className="flex space-x-4 text-sm text-gray-500">
                              <span>Impact: {driver.impact}%</span>
                              <span>Urgency: {driver.urgency}%</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingDriver(driver.id)}
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stakeholders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Stakeholder Groups</h3>
              <button
                onClick={addStakeholder}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stakeholder
              </button>
            </div>
            <div className="p-6">
              {(!businessData?.stakeholderGroups || businessData?.stakeholderGroups?.length === 0) ? (
                <p className="text-gray-500 text-center py-4">No stakeholders added yet. Click "Add Stakeholder" to start.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(businessData?.stakeholderGroups || []).map((stakeholder) => (
                    <div key={stakeholder.id} className="border border-gray-200 rounded-lg p-4">
                      {editingStakeholder === stakeholder.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={stakeholder.role}
                            onChange={(e) => updateStakeholder(stakeholder.id, { role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Role/Title"
                          />
                          <input
                            type="text"
                            value={stakeholder.name}
                            onChange={(e) => updateStakeholder(stakeholder.id, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name (optional)"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={stakeholder.influence}
                              onChange={(e) => updateStakeholder(stakeholder.id, { influence: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Low">Low Influence</option>
                              <option value="Medium">Medium Influence</option>
                              <option value="High">High Influence</option>
                            </select>
                            <select
                              value={stakeholder.interest}
                              onChange={(e) => updateStakeholder(stakeholder.id, { interest: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Low">Low Interest</option>
                              <option value="Medium">Medium Interest</option>
                              <option value="High">High Interest</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={stakeholder.involvement}
                            onChange={(e) => updateStakeholder(stakeholder.id, { involvement: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Level of involvement"
                          />
                          <textarea
                            value={stakeholder.expectations}
                            onChange={(e) => updateStakeholder(stakeholder.id, { expectations: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Expectations and concerns"
                            rows="2"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingStakeholder(null)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => deleteStakeholder(stakeholder.id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{stakeholder.role}</h4>
                            {stakeholder.name && <p className="text-sm text-gray-600">{stakeholder.name}</p>}
                            <div className="flex items-center space-x-2 mt-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getInfluenceColor(stakeholder.influence) }}
                              ></div>
                              <span className="text-xs text-gray-500">
                                {stakeholder.influence} influence, {stakeholder.interest} interest
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{stakeholder.involvement}</p>
                          </div>
                          <button
                            onClick={() => setEditingStakeholder(stakeholder.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.assessment}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    const updatedBudget = { ...businessData.budgetAllocation, assessment: newValue };
                    setBusinessData(prev => ({
                      ...prev,
                      budgetAllocation: updatedBudget
                    }));
                    debouncedSaveBudget(updatedBudget);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.implementation}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    const updatedBudget = { ...businessData.budgetAllocation, implementation: newValue };
                    setBusinessData(prev => ({
                      ...prev,
                      budgetAllocation: updatedBudget
                    }));
                    debouncedSaveBudget(updatedBudget);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.maintenance}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    const updatedBudget = { ...businessData.budgetAllocation, maintenance: newValue };
                    setBusinessData(prev => ({
                      ...prev,
                      budgetAllocation: updatedBudget
                    }));
                    debouncedSaveBudget(updatedBudget);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.training}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    const updatedBudget = { ...businessData.budgetAllocation, training: newValue };
                    setBusinessData(prev => ({
                      ...prev,
                      budgetAllocation: updatedBudget
                    }));
                    debouncedSaveBudget(updatedBudget);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
              <button
                onClick={addTimelineItem}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Phase
              </button>
            </div>
            <div className="p-6">
              {(!businessData?.projectTimeline || businessData?.projectTimeline?.length === 0) ? (
                <p className="text-gray-500 text-center py-4">No timeline items added yet. Click "Add Phase" to start.</p>
              ) : (
                <div className="space-y-4">
                  {(businessData?.projectTimeline || []).map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      {editingTimelineItem === item.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={item.phase}
                              onChange={(e) => updateTimelineItem(item.id, { phase: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Phase name"
                            />
                            <input
                              type="date"
                              value={item.startDate}
                              onChange={(e) => updateTimelineItem(item.id, { startDate: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={item.duration}
                              onChange={(e) => updateTimelineItem(item.id, { duration: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Duration (e.g., 4 weeks)"
                            />
                          </div>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateTimelineItem(item.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phase description"
                            rows="2"
                          />
                          <input
                            type="text"
                            value={item.deliverables}
                            onChange={(e) => updateTimelineItem(item.id, { deliverables: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Key deliverables"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingTimelineItem(null)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => deleteTimelineItem(item.id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                              <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.phase}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                Start: {item.startDate} • Duration: {item.duration}
                              </div>
                              {item.deliverables && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Deliverables: {item.deliverables}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingTimelineItem(item.id)}
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              </div>
              <button
                onClick={addRisk}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Risk
              </button>
            </div>
            <div className="p-6">
              {(!businessData?.riskAssessment || businessData?.riskAssessment?.length === 0) ? (
                <p className="text-gray-500 text-center py-4">No risks added yet. Click "Add Risk" to start.</p>
              ) : (
                <div className="space-y-4">
                  {(businessData?.riskAssessment || []).map((risk) => (
                    <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                      {editingRisk === risk.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={risk.risk}
                            onChange={(e) => updateRisk(risk.id, { risk: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Risk description"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select
                              value={risk.category}
                              onChange={(e) => updateRisk(risk.id, { category: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Technical">Technical</option>
                              <option value="Business">Business</option>
                              <option value="Resource">Resource</option>
                              <option value="Timeline">Timeline</option>
                              <option value="Budget">Budget</option>
                              <option value="Stakeholder">Stakeholder</option>
                            </select>
                            <select
                              value={risk.probability}
                              onChange={(e) => updateRisk(risk.id, { probability: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Low">Low Probability</option>
                              <option value="Medium">Medium Probability</option>
                              <option value="High">High Probability</option>
                            </select>
                            <select
                              value={risk.impact}
                              onChange={(e) => updateRisk(risk.id, { impact: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Low">Low Impact</option>
                              <option value="Medium">Medium Impact</option>
                              <option value="High">High Impact</option>
                            </select>
                          </div>
                          <textarea
                            value={risk.mitigation}
                            onChange={(e) => updateRisk(risk.id, { mitigation: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mitigation strategy"
                            rows="2"
                          />
                          <input
                            type="text"
                            value={risk.owner}
                            onChange={(e) => updateRisk(risk.id, { owner: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Risk owner"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingRisk(null)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => deleteRisk(risk.id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{risk.risk}</h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {risk.category}
                              </span>
                            </div>
                            <div className="flex space-x-4 text-sm text-gray-500 mb-2">
                              <span>Probability: {risk.probability}</span>
                              <span>Impact: {risk.impact}</span>
                              {risk.owner && <span>Owner: {risk.owner}</span>}
                            </div>
                            {risk.mitigation && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-800">
                                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setEditingRisk(risk.id)}
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                <h3 className="text-lg font-semibold text-gray-900">
                  AI-Powered Business Context Analysis
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
                </h3>
                <p className="text-gray-500 mt-1">
                  {aiServiceAvailable 
                    ? 'Generate AI-powered strategic insights from your business context data'
                    : 'Generate strategic insights from your business context data using simulation analysis'
                  }
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
                  onClick={runLLMAnalysis}
                  disabled={isAnalyzing || isAIAnalyzing}
                  className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
                    (isAnalyzing || isAIAnalyzing)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                  }`}
                >
                  {(isAnalyzing || isAIAnalyzing) ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      {isAIAnalyzing ? `${analysisState.currentStep || 'Analyzing'}...` : 'Analyzing...'}
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

            {(!businessData?.businessDrivers || businessData?.businessDrivers?.length === 0) && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 text-sm">
                  <strong>Tip:</strong> For best results, add business context data in the "Workshop Data" section before running analysis. The analysis will work with any available data or provide a general assessment framework.
                </p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {showAnalysisResults && businessData.analysis.driversAnalysis && (
            <div className="space-y-6">
              {/* Business Drivers Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Business Drivers Analysis</span>
                  {businessData.analysis?.isAiPowered && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Brain className="h-3 w-3 mr-1" />
                      AI-Powered
                    </span>
                  )}
                  {businessData.analysis?.isAiPowered === false && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      📊 Simulation
                    </span>
                  )}
                </h3>
                <div className="prose max-w-none">
                  {businessData.analysis?.isAiPowered ? (
                    // AI-powered results (may contain markdown formatting)
                    <div className="whitespace-pre-wrap text-gray-700">
                      {businessData.analysis?.driversAnalysis}
                    </div>
                  ) : (
                    // Simulation results
                    <p className="text-gray-700">{businessData.analysis.driversAnalysis}</p>
                  )}
                </div>
              </div>

              {/* Stakeholder Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stakeholder Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{businessData.analysis.stakeholderAnalysis}</p>
                </div>
              </div>

              {/* Timeline Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{businessData.analysis.timelineAnalysis}</p>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{businessData.analysis.riskAnalysis}</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-line">{businessData.analysis.recommendations}</div>
                </div>
              </div>
            </div>
          )}

          {!showAnalysisResults && businessData.analysis.driversAnalysis && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Complete</h3>
              <p className="text-gray-500 mb-4">AI analysis has been completed. Click "Show Results" to view insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessContext;