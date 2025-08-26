// src/components/Business/BusinessContext.js - Business context analysis with workshop data gathering
import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Target, TrendingUp, DollarSign, Calendar, FileText, AlertCircle,
  Plus, Edit3, Save, X, Trash2, Brain, Download, Upload, Eye, EyeOff, Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';
import { useAssessment } from '../../contexts/assessmentcontext';
import { apiService } from '../../services/apiService';

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
  const { currentAssessment } = useAssessment();
  const [currentView, setCurrentView] = useState('overview'); // overview, gather, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
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
  }, [currentAssessment]);

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

        // Load business drivers for this assessment
        let businessDrivers = [];
        let hasStoredDrivers = false;
        try {
          const driversResponse = await apiService.getBusinessDrivers(currentAssessment.id);
          businessDrivers = driversResponse.businessDrivers || [];
          hasStoredDrivers = businessDrivers.length > 0;
          console.log('LOADING: Business drivers loaded:', businessDrivers.length);
        } catch (error) {
          console.log('LOADING: No business drivers found for this assessment, will use mock data');
          businessDrivers = [];
          hasStoredDrivers = false;
        }

        // Generate assessment-specific mock data
        const assessmentSpecificData = generateMockDataForAssessment(currentAssessment, businessDrivers);
        
        // Update the business data with assessment-specific data
        setBusinessData({
          ...assessmentSpecificData,
          projectInfo,
          // Only override business drivers if we have stored data, otherwise keep mock data
          businessDrivers: hasStoredDrivers ? businessDrivers : assessmentSpecificData.businessDrivers
        });

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
        if (businessData.businessDrivers.length > 0) {
          const driversResult = await apiService.updateBusinessDrivers(currentAssessment.id, {
            businessDrivers: businessData.businessDrivers
          });
          console.log('BIZ SAVE: Business drivers update result:', driversResult);
        }

        console.log('BIZ SAVE: Data saved to database and localStorage successfully');
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
      businessDrivers: [...prev.businessDrivers, newDriver]
    }));
    setEditingDriver(newDriver.id);
    setDataSaved(false); // Mark as unsaved when data changes
  };

  const updateBusinessDriver = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      businessDrivers: prev.businessDrivers.map(driver =>
        driver.id === id ? { ...driver, ...updates } : driver
      )
    }));
    setDataSaved(false); // Mark as unsaved when data changes
  };

  const deleteBusinessDriver = (id) => {
    setBusinessData(prev => ({
      ...prev,
      businessDrivers: prev.businessDrivers.filter(driver => driver.id !== id)
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
      stakeholderGroups: [...prev.stakeholderGroups, newStakeholder]
    }));
    setEditingStakeholder(newStakeholder.id);
  };

  const updateStakeholder = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      stakeholderGroups: prev.stakeholderGroups.map(stakeholder =>
        stakeholder.id === id ? { ...stakeholder, ...updates } : stakeholder
      )
    }));
  };

  const deleteStakeholder = (id) => {
    setBusinessData(prev => ({
      ...prev,
      stakeholderGroups: prev.stakeholderGroups.filter(stakeholder => stakeholder.id !== id)
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
      projectTimeline: [...prev.projectTimeline, newItem]
    }));
    setEditingTimelineItem(newItem.id);
  };

  const updateTimelineItem = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      projectTimeline: prev.projectTimeline.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteTimelineItem = (id) => {
    setBusinessData(prev => ({
      ...prev,
      projectTimeline: prev.projectTimeline.filter(item => item.id !== id)
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
      riskAssessment: [...prev.riskAssessment, newRisk]
    }));
    setEditingRisk(newRisk.id);
  };

  const updateRisk = (id, updates) => {
    setBusinessData(prev => ({
      ...prev,
      riskAssessment: prev.riskAssessment.map(risk =>
        risk.id === id ? { ...risk, ...updates } : risk
      )
    }));
  };

  const deleteRisk = (id) => {
    setBusinessData(prev => ({
      ...prev,
      riskAssessment: prev.riskAssessment.filter(risk => risk.id !== id)
    }));
  };

  // LLM Analysis Integration
  const runLLMAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate LLM analysis - in real implementation, this would call your LLM service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate analysis based on available data
      const hasDrivers = businessData.businessDrivers.length > 0;
      const hasStakeholders = businessData.stakeholderGroups.length > 0;
      const hasTimeline = businessData.projectTimeline.length > 0;
      const hasRisks = businessData.riskAssessment.length > 0;
      const hasProject = businessData.projectInfo.name;
      
      const mockAnalysis = {
        driversAnalysis: hasDrivers 
          ? `Analysis of ${businessData.businessDrivers.length} business driver(s) shows clear organizational focus areas. ${businessData.businessDrivers.filter(d => d.priority === 'Critical' || d.priority === 'High').length > 0 ? 'High-priority drivers indicate urgent business needs that should be addressed immediately.' : 'The balanced priority distribution suggests a well-planned transformation approach.'} Average impact score: ${Math.round(businessData.businessDrivers.reduce((sum, d) => sum + d.impact, 0) / businessData.businessDrivers.length)}% with urgency at ${Math.round(businessData.businessDrivers.reduce((sum, d) => sum + d.urgency, 0) / businessData.businessDrivers.length)}%.`
          : `Business drivers analysis framework: Organizations typically focus on cost optimization (40%), digital transformation (30%), security compliance (20%), and operational efficiency (10%). Consider identifying your primary drivers in areas such as competitive advantage, regulatory compliance, scalability needs, and innovation requirements.`,
        
        stakeholderAnalysis: hasStakeholders 
          ? `Stakeholder analysis reveals ${businessData.stakeholderGroups.length} key stakeholder group(s) identified. ${businessData.stakeholderGroups.filter(s => s.influence === 'High').length} high-influence stakeholders require special attention for project success. The current stakeholder matrix shows ${businessData.stakeholderGroups.filter(s => s.interest === 'High').length} highly interested parties, which indicates ${businessData.stakeholderGroups.filter(s => s.interest === 'High').length > businessData.stakeholderGroups.length / 2 ? 'strong organizational support' : 'need for increased engagement strategies'}.`
          : `Stakeholder management framework: Identify key stakeholders across executive leadership (C-level), operational management (directors/VPs), technical teams (architects/leads), and end users. Map each by influence level (high/medium/low) and interest (high/medium/low) to develop targeted engagement strategies.`,
        
        timelineAnalysis: hasTimeline 
          ? `Project timeline consists of ${businessData.projectTimeline.length} planned phase(s). ${hasProject ? `For the "${businessData.projectInfo.name}" project, ` : ''}the phased approach ${businessData.projectTimeline.length > 3 ? 'appears comprehensive with multiple delivery milestones' : 'follows a streamlined delivery model'}. Timeline dependencies should be carefully managed to ensure sequential delivery success.`
          : `Timeline planning framework: Consider a phased approach with (1) Discovery & Planning (2-3 months), (2) Foundation & Architecture (3-6 months), (3) Implementation & Integration (6-12 months), and (4) Testing & Deployment (2-4 months). Adjust timelines based on organizational complexity and resource availability.`,
        
        riskAnalysis: hasRisks 
          ? `Risk assessment identifies ${businessData.riskAssessment.length} key risk(s). Risk distribution: ${businessData.riskAssessment.filter(r => r.probability === 'High').length} high-probability, ${businessData.riskAssessment.filter(r => r.impact === 'High').length} high-impact risks require immediate mitigation strategies. Categories include: ${[...new Set(businessData.riskAssessment.map(r => r.category))].join(', ')}.`
          : `Risk management framework: Common transformation risks include technical complexity (40% probability), resource constraints (60% probability), stakeholder resistance (30% probability), and budget overruns (25% probability). Develop mitigation strategies for each category with defined ownership and monitoring processes.`,
        
        recommendations: hasDrivers || hasStakeholders || hasTimeline || hasRisks
          ? `Strategic Recommendations based on current context:

1. ${hasDrivers ? `Address ${businessData.businessDrivers.filter(d => d.priority === 'Critical').length > 0 ? 'critical business drivers first' : 'high-impact drivers systematically'}` : 'Define and prioritize business drivers'}
2. ${hasStakeholders ? `Leverage ${businessData.stakeholderGroups.filter(s => s.influence === 'High').length} high-influence stakeholder(s) as project champions` : 'Establish stakeholder governance structure'}
3. ${hasTimeline ? `Execute ${businessData.projectTimeline.length}-phase delivery plan with milestone reviews` : 'Develop detailed project timeline with dependencies'}
4. ${hasRisks ? `Implement mitigation for ${businessData.riskAssessment.filter(r => r.impact === 'High').length} high-impact risks` : 'Conduct comprehensive risk assessment'}
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
8. Consider pilot approaches for risk mitigation`
      };
      
      setBusinessData(prev => ({
        ...prev,
        analysis: mockAnalysis
      }));
      
      setShowAnalysisResults(true);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error('Error running analysis');
    } finally {
      setIsAnalyzing(false);
    }
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
            <Edit3 className="h-4 w-4 inline mr-2" />
            Workshop Data
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
        <div className="text-sm text-gray-500">
          {dataSaved && lastSaveTime 
            ? `Last saved: ${lastSaveTime.toLocaleString()}`
            : 'Not saved yet'
          }
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
                  <p className="text-2xl font-bold text-gray-900">{businessData.businessDrivers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Stakeholder Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData.stakeholderGroups.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Timeline Items</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData.projectTimeline.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Identified Risks</p>
                  <p className="text-2xl font-bold text-gray-900">{businessData.riskAssessment.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {businessData.businessDrivers.length > 0 && (
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

          {businessData.businessDrivers.length === 0 && (
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

      {/* Workshop Data Gathering View */}
      {currentView === 'gather' && (
        <div className="space-y-6">
          {/* Project Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={businessData.projectInfo.name}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={businessData.projectInfo.duration}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, duration: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12 months"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={businessData.projectInfo.description}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, description: e.target.value }
                  }))}
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
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    projectInfo: { ...prev.projectInfo, totalBudget: e.target.value }
                  }))}
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
              {businessData.businessDrivers.length === 0 ? (
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
              {businessData.stakeholderGroups.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No stakeholders added yet. Click "Add Stakeholder" to start.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessData.stakeholderGroups.map((stakeholder) => (
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
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    budgetAllocation: { ...prev.budgetAllocation, assessment: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.implementation}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    budgetAllocation: { ...prev.budgetAllocation, implementation: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.maintenance}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    budgetAllocation: { ...prev.budgetAllocation, maintenance: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training</label>
                <input
                  type="number"
                  value={businessData.budgetAllocation.training}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    budgetAllocation: { ...prev.budgetAllocation, training: parseInt(e.target.value) || 0 }
                  }))}
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
              {businessData.projectTimeline.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No timeline items added yet. Click "Add Phase" to start.</p>
              ) : (
                <div className="space-y-4">
                  {businessData.projectTimeline.map((item, index) => (
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
              {businessData.riskAssessment.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No risks added yet. Click "Add Risk" to start.</p>
              ) : (
                <div className="space-y-4">
                  {businessData.riskAssessment.map((risk) => (
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
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Analysis</h3>
                <p className="text-gray-500 mt-1">
                  Generate comprehensive insights from your business context data using advanced AI analysis
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
                  disabled={isAnalyzing}
                  className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${
                    isAnalyzing
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                  }`}
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

            {businessData.businessDrivers.length === 0 && (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Drivers Analysis</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{businessData.analysis.driversAnalysis}</p>
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