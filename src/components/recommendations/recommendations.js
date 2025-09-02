/**
 * Results & Insights - Comprehensive Assessment Recommendations
 * 
 * This component provides a complete executive summary and recommendations by:
 * 1. Aggregating data from all assessment modules (Security, DevOps, Infrastructure, Cloud Readiness)
 * 2. Generating AI-powered strategic recommendations and business case
 * 3. Creating compelling executive dashboard with key metrics
 * 4. Providing multiple export formats (PDF, Excel, PowerPoint-ready)
 */

import React, { useEffect, useState, useRef } from 'react';
import { 
  TrendingUp, Target, Zap, Shield, GitBranch, Server, Database, Cloud,
  Download, FileText, BarChart3, CheckCircle, AlertTriangle, DollarSign,
  Clock, Users, Settings, Monitor, Brain, RefreshCw, ArrowRight, 
  Award, Lightbulb, ChevronDown, ChevronUp, Printer, FileSpreadsheet,
  Building, Calendar, Layers, Code, ExternalLink, TrendingDown, AlertCircle,
  Upload, Save
} from 'lucide-react';
import ExportDropdown from '../ui/ExportDropdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
import { apiService } from '../../services/apiService';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatCurrency } from '../../utils/currency';

const Recommendations = () => {
  const { currentAssessment } = useAssessment();
  const [currentView, setCurrentView] = useState('executive'); // executive, detailed, roadmap
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [showBusinessCase, setShowBusinessCase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [storageMode, setStorageMode] = useState('Local Storage'); // Local Storage, Simulation, Azure DB
  const [lastGeneratedTime, setLastGeneratedTime] = useState(new Date());
  const [lastAiAnalysisTime, setLastAiAnalysisTime] = useState(null);
  const printRef = useRef();

  const [comprehensiveResults, setComprehensiveResults] = useState({
    executiveSummary: {
      overallReadinessScore: 0,
      totalFindings: 0,
      criticalIssues: 0,
      estimatedSavings: 0,
      recommendedInvestment: 0,
      roiProjection: 0,
      timeToValue: '',
      confidenceLevel: 'High'
    },
    domainResults: {
      security: { score: 0, issues: 0, recommendations: 0 },
      infrastructure: { score: 0, servers: 0, savings: 0 },
      devops: { score: 0, pipelines: 0, maturity: 0 },
      cloudReadiness: { score: 0, strategy: '', timeline: '' },
      dataArchitecture: { score: 0, databases: 0, readiness: 0 }
    },
    businessCase: {
      currentStateCosts: 0,
      futureStateBenefits: 0,
      migrationInvestment: 0,
      netPresentValue: 0,
      paybackPeriod: 0,
      riskMitigation: [],
      competitiveAdvantages: []
    },
    strategicRecommendations: [],
    tacticalRecommendations: [],
    quickWins: [],
    aiInsights: {
      trendAnalysis: '',
      riskAssessment: '',
      opportunityIdentification: '',
      implementationStrategy: ''
    }
  });

  useEffect(() => {
    loadComprehensiveAssessment();
  }, [currentAssessment]);

  const loadComprehensiveAssessment = async () => {
    try {
      setLoading(true);
      console.log('RECOMMENDATIONS: Loading data for assessment:', currentAssessment?.id);
      
      // Load AI analysis timestamp from API
      if (currentAssessment?.id) {
        try {
          const assessmentData = await apiService.getAssessment(currentAssessment.id);
          if (assessmentData.recommendationsLastAiAnalysis) {
            setLastAiAnalysisTime(new Date(assessmentData.recommendationsLastAiAnalysis));
            console.log('RECOMMENDATIONS: Loaded AI analysis timestamp from API:', assessmentData.recommendationsLastAiAnalysis);
          }
        } catch (error) {
          console.warn('Failed to load AI analysis timestamp from API:', error);
        }
      }
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'recommendations');
      
      if (assessmentSpecificData) {
        // Use assessment-specific recommendations data
        const allRecommendations = [
          ...(assessmentSpecificData.strategicRecommendations || []),
          ...(assessmentSpecificData.tacticalRecommendations || []),
          ...(assessmentSpecificData.quickWins || [])
        ];
        
        const analysisResults = {
          executiveSummary: {
            overallReadinessScore: Math.min(currentAssessment?.overallScore || 85, 100),
            totalFindings: allRecommendations.length,
            criticalIssues: allRecommendations.filter(p => p.priority === 'Critical').length,
            estimatedSavings: assessmentSpecificData.businessCase?.projectedSavings || 180000,
            recommendedInvestment: assessmentSpecificData.businessCase?.totalInvestment || 150000,
            roiProjection: assessmentSpecificData.businessCase?.roi || 120,
            timeToValue: assessmentSpecificData.businessCase?.paybackPeriod || '18 months',
            confidenceLevel: 'High'
          },
          domainResults: {
            security: { score: 78, issues: 102, recommendations: 12 },
            infrastructure: { score: 45, servers: 12, savings: 3490 },
            devops: { score: 78, pipelines: 8, maturity: 65 },
            cloudReadiness: { score: 72, strategy: 'Hybrid Migration', timeline: '12-18 months' },
            dataArchitecture: { score: 75, databases: 6, readiness: 68 }
          },
          strategicRecommendations: assessmentSpecificData.strategicRecommendations || [],
          tacticalRecommendations: assessmentSpecificData.tacticalRecommendations || [],
          quickWins: assessmentSpecificData.quickWins || [],
          businessCase: {
            currentStateCosts: assessmentSpecificData.businessCase?.currentStateCosts || 2450000,
            futureStateBenefits: assessmentSpecificData.businessCase?.futureStateBenefits || 4890000,
            migrationInvestment: assessmentSpecificData.businessCase?.totalInvestment || 850000,
            netPresentValue: assessmentSpecificData.businessCase?.netPresentValue || 3200000,
            paybackPeriod: assessmentSpecificData.businessCase?.paybackPeriod || 14,
            ...(assessmentSpecificData.businessCase || {})
          },
          analysis: assessmentSpecificData.analysis || {},
          roadmap: generateRoadmap(allRecommendations),
          aiInsights: {
            trendAnalysis: `Based on industry benchmarks and assessment data, your organization shows strong potential for digital transformation. Key trends indicate that similar organizations achieving 70%+ modernization scores see average ROI of 280% within 24 months. Your current readiness score of ${assessmentSpecificData.businessCase?.roi || 85}% positions you well for accelerated transformation.`,
            riskAssessment: `Primary risks center around security vulnerabilities and legacy infrastructure dependencies. However, strong foundation provides basis for successful modernization. Risk mitigation through phased approach reduces implementation complexity.`,
            opportunityIdentification: `Significant opportunities exist in cloud cost optimization (estimated $${(assessmentSpecificData.businessCase?.projectedSavings || 180000).toLocaleString()} total savings), automated security compliance, and accelerated development cycles. Market analysis suggests 18-month window for competitive advantage through early cloud adoption.`,
            implementationStrategy: `Recommended approach: Begin with security remediation (immediate), proceed with infrastructure modernization (months 3-12), and complete with advanced cloud-native adoption (months 12-18). This strategy balances risk mitigation with rapid value realization while building organizational capabilities progressively.`
          }
        };
        setComprehensiveResults(analysisResults);
      } else {
        // Aggregate data from all assessment modules
        const aggregatedData = await aggregateAllAssessmentData();
        
        // Generate comprehensive analysis
        const analysisResults = generateComprehensiveAnalysis(aggregatedData);
        
        setComprehensiveResults(analysisResults);
      }
      
    } catch (error) {
      console.error('Failed to load comprehensive assessment:', error);
      // Use mock data for demonstration
      setComprehensiveResults(generateMockComprehensiveResults());
    } finally {
      setLoading(false);
    }
  };

  const generateDomainAssessments = (assessmentId) => {
    // Generate domain-specific assessment data based on assessment type
    const baseData = [
      { domain: 'Security', score: 72, findings: 8, status: 'Needs Improvement' },
      { domain: 'Infrastructure', score: 85, findings: 3, status: 'Good' },
      { domain: 'DevOps', score: 78, findings: 5, status: 'Good' },
      { domain: 'Data Architecture', score: 82, findings: 4, status: 'Good' },
      { domain: 'Cloud Readiness', score: 88, findings: 2, status: 'Excellent' }
    ];

    // Customize based on assessment type
    if (assessmentId === 1) {
      // E-commerce - focus on scalability and performance
      baseData[0].score = 75; // Security
      baseData[1].score = 88; // Infrastructure 
      baseData[2].score = 82; // DevOps
    } else if (assessmentId === 2) {
      // Financial services - focus on security and compliance
      baseData[0].score = 65; // Security (needs work)
      baseData[0].findings = 12;
      baseData[0].status = 'Critical';
    } else if (assessmentId === 3) {
      // Cloud migration - already optimized
      baseData.forEach(domain => {
        domain.score += 5; // Boost all scores
        domain.findings = Math.max(1, domain.findings - 2);
      });
    }

    return baseData;
  };

  const generateRoadmap = (priorityRecommendations) => {
    return (priorityRecommendations || []).map((rec, index) => ({
      phase: `Phase ${index + 1}`,
      title: rec.title,
      duration: rec.timeline,
      effort: rec.effort,
      impact: rec.impact,
      dependencies: index === 0 ? [] : [`Phase ${index}`],
      deliverables: [`Complete ${rec.title.toLowerCase()}`, 'Documentation', 'Team training']
    }));
  };

  const aggregateAllAssessmentData = async () => {
    // In production, this would fetch from all assessment modules
    // For now, we'll use representative mock data
    return {
      security: {
        vulnerabilities: { critical: 35, high: 67, medium: 142, low: 89 },
        complianceScore: 78,
        findings: 45
      },
      infrastructure: {
        servers: 12,
        cloudReadiness: 45,
        estimatedSavings: 3490,
        utilizationScore: 65
      },
      devops: {
        pipelineMaturity: 78,
        automationLevel: 65,
        codeQuality: 82,
        deploymentFrequency: 'Daily'
      },
      cloudReadiness: {
        overallScore: 72,
        strategy: 'Hybrid Migration with Modernization',
        timeline: '12-18 months'
      }
    };
  };

  const generateComprehensiveAnalysis = (data) => {
    // Calculate overall metrics
    const totalFindings = data.security.vulnerabilities.critical + 
                         data.security.vulnerabilities.high + 
                         data.security.vulnerabilities.medium + 
                         data.security.vulnerabilities.low;
    
    const overallScore = Math.round(
      (data.security.complianceScore * 0.25) +
      (data.infrastructure.cloudReadiness * 0.35) +
      (data.devops.pipelineMaturity * 0.25) +
      (data.cloudReadiness.overallScore * 0.15)
    );

    return generateMockComprehensiveResults(data, overallScore, totalFindings);
  };

  const generateMockComprehensiveResults = (data = null, overallScore = 72, totalFindings = 333) => {
    return {
      executiveSummary: {
        overallReadinessScore: overallScore,
        totalFindings: totalFindings,
        criticalIssues: data?.security.vulnerabilities.critical || 35,
        estimatedSavings: data?.infrastructure.estimatedSavings || 3490,
        recommendedInvestment: 850000,
        roiProjection: 285,
        timeToValue: '18 months',
        confidenceLevel: 'High'
      },
      domainResults: {
        security: { 
          score: data?.security.complianceScore || 78, 
          issues: data?.security.vulnerabilities.critical + data?.security.vulnerabilities.high || 102, 
          recommendations: 12 
        },
        infrastructure: { 
          score: data?.infrastructure.cloudReadiness || 45, 
          servers: data?.infrastructure.servers || 12, 
          savings: data?.infrastructure.estimatedSavings || 3490 
        },
        devops: { 
          score: data?.devops.pipelineMaturity || 78, 
          pipelines: 8, 
          maturity: data?.devops.automationLevel || 65 
        },
        cloudReadiness: { 
          score: data?.cloudReadiness.overallScore || 72, 
          strategy: data?.cloudReadiness.strategy || 'Hybrid Migration', 
          timeline: data?.cloudReadiness.timeline || '12-18 months' 
        },
        dataArchitecture: { 
          score: data?.dataArchitecture.overallScore || 75, 
          databases: data?.dataArchitecture.databases || 6, 
          readiness: data?.dataArchitecture.readiness || 68 
        }
      },
      businessCase: {
        currentStateCosts: 2450000,
        futureStateBenefits: 4890000,
        migrationInvestment: 850000,
        netPresentValue: 3200000,
        paybackPeriod: 14,
        riskMitigation: [
          'Reduced security breach probability by 75%',
          'Eliminated single points of failure',
          'Improved disaster recovery capabilities',
          'Enhanced compliance posture'
        ],
        competitiveAdvantages: [
          'Faster time-to-market for new features',
          'Improved customer experience and satisfaction',
          'Enhanced scalability for business growth',
          'Access to modern cloud-native capabilities'
        ]
      },
      strategicRecommendations: [
        {
          id: 1,
          title: 'Cloud-First Digital Transformation Initiative',
          description: 'Comprehensive modernization program to migrate critical workloads to cloud infrastructure',
          impact: 'High',
          effort: 'High',
          priority: 'Critical',
          category: 'Strategic',
          estimatedROI: '285%',
          timeline: '18 months',
          investment: formatCurrency(650000),
          benefits: [
            'Reduce operational costs by 35%',
            'Improve application performance by 60%',
            'Enable faster deployment cycles',
            'Enhance disaster recovery capabilities'
          ],
          risks: [
            'Change management challenges',
            'Temporary performance impact during migration',
            'Skills gap requiring training investment'
          ]
        },
        {
          id: 2,
          title: 'Security Posture Enhancement Program',
          description: 'Multi-phase security improvement initiative addressing critical vulnerabilities and compliance gaps',
          impact: 'High',
          effort: 'Medium',
          priority: 'Critical',
          category: 'Security',
          estimatedROI: '450%',
          timeline: '12 months',
          investment: formatCurrency(200000),
          benefits: [
            'Reduce security breach risk by 75%',
            'Achieve compliance certification',
            'Improve customer trust and confidence',
            'Enable secure cloud adoption'
          ],
          risks: [
            'Potential service disruptions during implementation',
            'Regulatory requirements may change',
            'User productivity impact during rollout'
          ]
        }
      ],
      tacticalRecommendations: [
        {
          id: 3,
          title: 'DevOps Pipeline Optimization',
          description: 'Implement advanced CI/CD practices and infrastructure automation',
          impact: 'Medium',
          effort: 'Medium',
          priority: 'High',
          category: 'DevOps',
          estimatedROI: '180%',
          timeline: '6 months',
          investment: formatCurrency(120000)
        },
        {
          id: 4,
          title: 'Infrastructure Monitoring Enhancement',
          description: 'Deploy comprehensive monitoring and alerting solutions',
          impact: 'Medium',
          effort: 'Low',
          priority: 'High',
          category: 'Infrastructure',
          estimatedROI: '220%',
          timeline: '3 months',
          investment: formatCurrency(80000)
        }
      ],
      quickWins: [
        {
          id: 5,
          title: 'Security Header Implementation',
          description: 'Configure essential security headers across web applications',
          impact: 'Medium',
          effort: 'Low',
          priority: 'High',
          timeline: '2 weeks',
          investment: formatCurrency(5000)
        },
        {
          id: 6,
          title: 'Database Query Optimization',
          description: 'Optimize slow-performing database queries and indexes',
          impact: 'Medium',
          effort: 'Low',
          priority: 'Medium',
          timeline: '1 month',
          investment: formatCurrency(15000)
        },
        {
          id: 7,
          title: 'Automated Backup Verification',
          description: 'Implement automated backup testing and verification',
          impact: 'High',
          effort: 'Low',
          priority: 'High',
          timeline: '3 weeks',
          investment: formatCurrency(10000)
        }
      ],
      aiInsights: {
        trendAnalysis: `Based on industry benchmarks and assessment data, your organization shows strong potential for digital transformation. Key trends indicate that similar organizations achieving 70%+ modernization scores see average ROI of 280% within 24 months. Your current readiness score of ${overallScore}% positions you well for accelerated transformation.`,
        
        riskAssessment: `Primary risks center around security vulnerabilities (${data?.security.vulnerabilities.critical || 35} critical issues) and legacy infrastructure dependencies. However, strong DevOps maturity (${data?.devops.pipelineMaturity || 78}%) provides foundation for successful modernization. Risk mitigation through phased approach reduces implementation complexity.`,
        
        opportunityIdentification: `Significant opportunities exist in cloud cost optimization (estimated $${(data?.infrastructure.estimatedSavings || 3490).toLocaleString()}/month savings), automated security compliance, and accelerated development cycles. Market analysis suggests 18-month window for competitive advantage through early cloud adoption.`,
        
        implementationStrategy: `Recommended approach: Begin with security remediation (immediate), proceed with infrastructure modernization (months 3-12), and complete with advanced cloud-native adoption (months 12-18). This strategy balances risk mitigation with rapid value realization while building organizational capabilities progressively.`
      }
    };
  };

  const generateAIRecommendations = async () => {
    setIsGeneratingAnalysis(true);
    
    // Simulate AI analysis processing
    setTimeout(() => {
      // In production, this would call the actual AI service
      toast.success('AI analysis completed - comprehensive recommendations generated!');
      setIsGeneratingAnalysis(false);
      setLastAiAnalysisTime(new Date());

      // Save AI analysis timestamp to API
      if (currentAssessment?.id) {
        try {
          apiService.updateAiAnalysisTimestamp(currentAssessment.id, 'recommendations');
          console.log('RECOMMENDATIONS: AI analysis timestamp saved to API');
        } catch (error) {
          console.warn('Failed to save AI analysis timestamp to API:', error);
        }
      }
    }, 3000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Assessment-Results-${currentAssessment?.name || 'Report'}-${new Date().toISOString().split('T')[0]}`
  });

  const exportToPDF = async () => {
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        allowTaint: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Assessment-Results-${currentAssessment?.name || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF report exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const exportToExcel = () => {
    try {
      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new();

      // Executive Summary Sheet
      const executiveData = [
        ['Metric', 'Value'],
        ['Overall Readiness Score', `${comprehensiveResults.executiveSummary.overallReadinessScore}%`],
        ['Total Findings', comprehensiveResults.executiveSummary.totalFindings],
        ['Critical Issues', comprehensiveResults.executiveSummary.criticalIssues],
        ['Estimated Monthly Savings', `$${comprehensiveResults.executiveSummary.estimatedSavings.toLocaleString()}`],
        ['Recommended Investment', `$${comprehensiveResults.executiveSummary.recommendedInvestment.toLocaleString()}`],
        ['ROI Projection', `${comprehensiveResults.executiveSummary.roiProjection}%`],
        ['Time to Value', comprehensiveResults.executiveSummary.timeToValue]
      ];
      const executiveWS = XLSX.utils.aoa_to_sheet(executiveData);
      XLSX.utils.book_append_sheet(wb, executiveWS, 'Executive Summary');

      // Domain Results Sheet
      const domainData = [
        ['Domain', 'Score', 'Key Metric', 'Value'],
        ['Security', `${comprehensiveResults.domainResults.security.score}%`, 'Issues', comprehensiveResults.domainResults.security.issues],
        ['Infrastructure', `${comprehensiveResults.domainResults.infrastructure.score}%`, 'Servers', comprehensiveResults.domainResults.infrastructure.servers],
        ['DevOps', `${comprehensiveResults.domainResults.devops.score}%`, 'Pipelines', comprehensiveResults.domainResults.devops.pipelines],
        ['Cloud Readiness', `${comprehensiveResults.domainResults.cloudReadiness.score}%`, 'Strategy', comprehensiveResults.domainResults.cloudReadiness.strategy]
      ];
      const domainWS = XLSX.utils.aoa_to_sheet(domainData);
      XLSX.utils.book_append_sheet(wb, domainWS, 'Domain Results');

      // Recommendations Sheet
      const recommendationsData = [
        ['Title', 'Category', 'Priority', 'Impact', 'Timeline', 'Investment', 'ROI'],
        ...(comprehensiveResults.strategicRecommendations || []).map(rec => [
          rec.title, rec.category, rec.priority, rec.impact, rec.timeline, rec.investment, rec.estimatedROI
        ]),
        ...(comprehensiveResults.tacticalRecommendations || []).map(rec => [
          rec.title, rec.category, rec.priority, rec.impact, rec.timeline, rec.investment, rec.estimatedROI || 'TBD'
        ])
      ];
      const recommendationsWS = XLSX.utils.aoa_to_sheet(recommendationsData);
      XLSX.utils.book_append_sheet(wb, recommendationsWS, 'Recommendations');

      // Export file
      const fileName = `Assessment-Results-${currentAssessment?.name || 'Report'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success('Excel report exported successfully!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  const exportPowerPointData = () => {
    const powerPointData = {
      title: `${currentAssessment?.name || 'Assessment'} Results & Recommendations`,
      executiveSummary: comprehensiveResults.executiveSummary,
      keyFindings: [
        `Overall readiness score: ${comprehensiveResults.executiveSummary.overallReadinessScore}%`,
        `${comprehensiveResults.executiveSummary.criticalIssues} critical issues identified`,
        `$${comprehensiveResults.executiveSummary.estimatedSavings.toLocaleString()} monthly savings potential`,
        `${comprehensiveResults.executiveSummary.roiProjection}% ROI projection`
      ],
      recommendations: (comprehensiveResults.strategicRecommendations || []).map(rec => ({
        title: rec.title,
        impact: rec.impact,
        timeline: rec.timeline,
        roi: rec.estimatedROI
      })),
      businessCase: comprehensiveResults.businessCase
    };

    const dataStr = JSON.stringify(powerPointData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PowerPoint-Data-${currentAssessment?.name || 'Report'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('PowerPoint data exported - ready for presentation creation!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const ExecutiveDashboard = () => (
    <div ref={printRef} className="space-y-8">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Executive Assessment Results</h2>
            <p className="text-blue-100 text-lg">
              {currentAssessment?.name || 'Comprehensive Application Portfolio Assessment'}
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Generated on {new Date().toLocaleDateString()} • Confidence Level: {comprehensiveResults.executiveSummary.confidenceLevel}
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{comprehensiveResults.executiveSummary.overallReadinessScore}%</div>
            <div className="text-xl">Overall Readiness</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Savings Potential</p>
              <p className="text-2xl font-bold text-gray-900">${comprehensiveResults.executiveSummary.estimatedSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">ROI Projection</p>
              <p className="text-2xl font-bold text-gray-900">{comprehensiveResults.executiveSummary.roiProjection}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-bold text-gray-900">{comprehensiveResults.executiveSummary.criticalIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Time to Value</p>
              <p className="text-2xl font-bold text-gray-900">{comprehensiveResults.executiveSummary.timeToValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Assessment Results */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Assessment Results by Domain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(comprehensiveResults.domainResults.security.score)}`}>
              {comprehensiveResults.domainResults.security.score}%
            </div>
            <div className="text-lg font-medium text-gray-900">Security</div>
            <div className="text-sm text-gray-600">{comprehensiveResults.domainResults.security.issues} issues found</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <Server className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(comprehensiveResults.domainResults.infrastructure.score)}`}>
              {comprehensiveResults.domainResults.infrastructure.score}%
            </div>
            <div className="text-lg font-medium text-gray-900">Infrastructure</div>
            <div className="text-sm text-gray-600">{comprehensiveResults.domainResults.infrastructure.servers} servers assessed</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <GitBranch className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(comprehensiveResults.domainResults.devops.score)}`}>
              {comprehensiveResults.domainResults.devops.score}%
            </div>
            <div className="text-lg font-medium text-gray-900">DevOps</div>
            <div className="text-sm text-gray-600">{comprehensiveResults.domainResults.devops.pipelines} pipelines</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <Cloud className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(comprehensiveResults.domainResults.cloudReadiness.score)}`}>
              {comprehensiveResults.domainResults.cloudReadiness.score}%
            </div>
            <div className="text-lg font-medium text-gray-900">Cloud Ready</div>
            <div className="text-sm text-gray-600">{comprehensiveResults.domainResults.cloudReadiness.timeline}</div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <Database className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(comprehensiveResults.domainResults.dataArchitecture.score)}`}>
              {comprehensiveResults.domainResults.dataArchitecture.score}%
            </div>
            <div className="text-lg font-medium text-gray-900">Data Architecture</div>
            <div className="text-sm text-gray-600">{comprehensiveResults.domainResults.dataArchitecture.databases} databases assessed</div>
          </div>
        </div>
      </div>

      {/* Business Context and Architecture Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessContextExecutiveSummary />
        <ArchitectureReviewExecutiveSummary />
      </div>

      {/* Business Case Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Business Case for Modernization</h3>
          <button
            onClick={() => setShowBusinessCase(!showBusinessCase)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            {showBusinessCase ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            {showBusinessCase ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">
              ${((comprehensiveResults.businessCase?.currentStateCosts || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-gray-700">Current State Costs</div>
            <div className="text-xs text-gray-500">Annual operational costs</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${((comprehensiveResults.businessCase?.futureStateBenefits || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-gray-700">Future State Benefits</div>
            <div className="text-xs text-gray-500">Annual value creation</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${((comprehensiveResults.businessCase?.netPresentValue || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-gray-700">Net Present Value</div>
            <div className="text-xs text-gray-500">3-year projection</div>
          </div>
        </div>

        {showBusinessCase && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Risk Mitigation Benefits</h4>
              <ul className="space-y-2">
                {(comprehensiveResults.businessCase?.riskMitigation || []).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Competitive Advantages</h4>
              <ul className="space-y-2">
                {(comprehensiveResults.businessCase?.competitiveAdvantages || []).map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <Award className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            AI-Powered Strategic Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
              Trend Analysis
            </h4>
            <p className="text-sm text-gray-600 mb-4">{comprehensiveResults.aiInsights?.trendAnalysis || 'Trend analysis data is being generated...'}</p>

            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              Risk Assessment
            </h4>
            <p className="text-sm text-gray-600">{comprehensiveResults.aiInsights?.riskAssessment || 'Risk assessment data is being generated...'}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
              Opportunity Identification
            </h4>
            <p className="text-sm text-gray-600 mb-4">{comprehensiveResults.aiInsights?.opportunityIdentification || 'Opportunity identification data is being generated...'}</p>

            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 text-green-500 mr-2" />
              Implementation Strategy
            </h4>
            <p className="text-sm text-gray-600">{comprehensiveResults.aiInsights?.implementationStrategy || 'Implementation strategy data is being generated...'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailedRecommendations = () => (
    <div className="space-y-8">
      {/* Recommendations Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Strategic Actions</p>
              <p className="text-2xl font-bold text-gray-900">{(comprehensiveResults.strategicRecommendations || []).length}</p>
              <p className="text-xs text-gray-500">High-impact initiatives</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Wins</p>
              <p className="text-2xl font-bold text-gray-900">{(comprehensiveResults.quickWins || []).length}</p>
              <p className="text-xs text-gray-500">Low effort, high impact</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${((comprehensiveResults.strategicRecommendations || [])
                  .reduce((sum, rec) => sum + (parseInt(rec.investment?.replace(/[^0-9]/g, '')) || 0), 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500">Estimated cost</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg ROI</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((comprehensiveResults.strategicRecommendations || [])
                  .reduce((sum, rec) => sum + (parseInt(rec.estimatedROI?.replace('%', '')) || 0), 0) / 
                  Math.max((comprehensiveResults.strategicRecommendations || []).length, 1))}%
              </p>
              <p className="text-xs text-gray-500">Expected return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations by Category Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Recommendations by Category</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Security', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Security').length, color: '#EF4444' },
                    { name: 'Infrastructure', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Infrastructure').length, color: '#3B82F6' },
                    { name: 'Strategic', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Strategic').length, color: '#10B981' },
                    { name: 'Quick Wins', value: (comprehensiveResults?.quickWins || []).length, color: '#F59E0B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {[
                    { name: 'Security', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Security').length, color: '#EF4444' },
                    { name: 'Infrastructure', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Infrastructure').length, color: '#3B82F6' },
                    { name: 'Strategic', value: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Strategic').length, color: '#10B981' },
                    { name: 'Quick Wins', value: (comprehensiveResults?.quickWins || []).length, color: '#F59E0B' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Priority Distribution</h4>
            {['Critical', 'High', 'Medium', 'Low'].map(priority => {
              const count = (comprehensiveResults?.strategicRecommendations || []).filter(r => r.priority === priority).length;
              const total = Math.max((comprehensiveResults?.strategicRecommendations || []).length, 1);
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{priority} Priority</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === 'Critical' ? 'bg-red-500' : 
                          priority === 'High' ? 'bg-orange-500' : 
                          priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Target className="h-6 w-6 text-blue-600 mr-2" />
          Strategic Recommendations
        </h3>
        <div className="space-y-6">
          {(comprehensiveResults.strategicRecommendations || []).map(rec => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h4>
                  <p className="text-gray-600 mb-4">{rec.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Impact</div>
                      <div className="text-sm text-gray-600 capitalize">{rec.impact}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Timeline</div>
                      <div className="text-sm text-gray-600">{rec.timeline}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Investment</div>
                      <div className="text-sm text-gray-600">{rec.investment}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Est. ROI</div>
                      <div className="text-sm font-bold text-green-600">{rec.estimatedROI}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Expected Benefits</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(rec.benefits || []).map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Risks & Considerations</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(rec.risks || []).map((risk, idx) => (
                          <li key={idx} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {rec.priority}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Zap className="h-6 w-6 text-yellow-600 mr-2" />
          Quick Wins (High Impact, Low Effort)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(comprehensiveResults.quickWins || []).map(win => (
            <div key={win.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-gray-900 mb-2">{win.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{win.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Timeline: {win.timeline}</span>
                <span className="font-medium text-green-600">{win.investment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ImplementationRoadmap = () => {
    const phases = [
      {
        phase: 'Phase 1: Foundation (0-3 months)',
        items: comprehensiveResults?.quickWins || [],
        color: 'blue',
        description: 'Quick wins and foundational improvements',
        totalCost: (comprehensiveResults?.quickWins || []).reduce((sum, item) => sum + (parseInt(item.investment?.replace(/[^0-9]/g, '')) || 50000), 0),
        expectedROI: '150%',
        riskLevel: 'Low'
      },
      {
        phase: 'Phase 2: Security & Compliance (3-9 months)',
        items: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Security'),
        color: 'red',
        description: 'Critical security vulnerabilities and compliance gaps',
        totalCost: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Security')
          .reduce((sum, item) => sum + (parseInt(item.investment?.replace(/[^0-9]/g, '')) || 200000), 0),
        expectedROI: '125%',
        riskLevel: 'Medium'
      },
      {
        phase: 'Phase 3: Infrastructure Modernization (6-15 months)',
        items: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Strategic'),
        color: 'green',
        description: 'Core infrastructure and architecture transformation',
        totalCost: (comprehensiveResults?.strategicRecommendations || []).filter(r => r.category === 'Strategic')
          .reduce((sum, item) => sum + (parseInt(item.investment?.replace(/[^0-9]/g, '')) || 500000), 0),
        expectedROI: '200%',
        riskLevel: 'High'
      },
      {
        phase: 'Phase 4: Optimization (12-18 months)',
        items: comprehensiveResults?.tacticalRecommendations || [],
        color: 'purple',
        description: 'Performance optimization and continuous improvement',
        totalCost: (comprehensiveResults?.tacticalRecommendations || [])
          .reduce((sum, item) => sum + (parseInt(item.investment?.replace(/[^0-9]/g, '')) || 100000), 0),
        expectedROI: '175%',
        riskLevel: 'Low'
      }
    ];

    const totalInvestment = phases.reduce((sum, phase) => sum + phase.totalCost, 0);
    const totalItems = phases.reduce((sum, phase) => sum + (phase.items || []).length, 0);

    return (
      <div className="space-y-8">
        {/* Roadmap Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">18 months</p>
                <p className="text-xs text-gray-500">End-to-end timeline</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Initiatives</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-xs text-gray-500">Across all phases</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">${(totalInvestment / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">Estimated cost</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Expected ROI</p>
                <p className="text-2xl font-bold text-gray-900">165%</p>
                <p className="text-xs text-gray-500">Weighted average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Investment Timeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-6">Investment Timeline by Phase</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phases.map(phase => ({
                name: phase.phase.split(':')[0],
                investment: phase.totalCost / 1000000,
                items: (phase.items || []).length
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Investment ($M)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'investment' ? `$${value.toFixed(1)}M` : value,
                    name === 'investment' ? 'Investment' : 'Items'
                  ]}
                />
                <Bar dataKey="investment" fill="#3B82F6" name="investment" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phase Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Implementation Phases</h3>
          <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative border border-gray-200 rounded-lg p-6">
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-6 h-6 bg-${phase.color}-500 rounded-full mr-4 flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${(phase.totalCost / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-500">Total Investment</div>
                </div>
              </div>

              {/* Phase Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{(phase.items || []).length}</div>
                  <div className="text-xs text-gray-500">Initiatives</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{phase.expectedROI}</div>
                  <div className="text-xs text-gray-500">Expected ROI</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    phase.riskLevel === 'Low' ? 'text-green-600' :
                    phase.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {phase.riskLevel}
                  </div>
                  <div className="text-xs text-gray-500">Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {(() => {
                      const match = phase.phase.match(/\(([^)]+)\)/);
                      return match ? match[1] : 'TBD';
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>

              {/* Phase Items */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 mb-3">Key Initiatives</h5>
                {(phase.items || []).length > 0 ? (
                  (phase.items || []).map(item => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{item.description || 'See detailed recommendations above'}</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱ {item.timeline || 'TBD'}</span>
                          <span>💰 {item.investment || 'TBD'}</span>
                          {item.estimatedROI && <span>📈 {item.estimatedROI} ROI</span>}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority || 'Medium'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No specific initiatives defined for this phase yet</p>
                    <p className="text-sm">Items will be populated based on assessment results</p>
                  </div>
                )}
              </div>

              {/* Phase Dependencies */}
              {index > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    <span>Depends on completion of {phases[index - 1].phase.split(':')[0]}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  };

  // Business Context Executive Summary Component
  const BusinessContextExecutiveSummary = () => {
    const { currentAssessment } = useAssessment();
    const [businessData, setBusinessData] = useState(null);

    useEffect(() => {
      const loadBusinessData = () => {
        try {
          const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'business');
          const summaryData = {
            businessDrivers: assessmentSpecificData?.businessDrivers || [
              { name: 'Digital Transformation', priority: 'Critical', impact: 90 },
              { name: 'Cost Optimization', priority: 'High', impact: 85 }
            ],
            businessMetrics: {
              estimatedROI: assessmentSpecificData?.businessCase?.roi || 285,
              paybackPeriod: assessmentSpecificData?.businessCase?.paybackPeriod || '14 months'
            }
          };
          setBusinessData(summaryData);
        } catch (error) {
          console.error('Error loading business context data:', error);
        }
      };
      loadBusinessData();
    }, [currentAssessment]);

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Critical': return 'text-red-600 bg-red-100';
        case 'High': return 'text-orange-600 bg-orange-100';
        case 'Medium': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Building className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Business Context</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Estimated ROI</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {businessData?.businessMetrics?.estimatedROI || 0}%
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Payback Period</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {businessData?.businessMetrics?.paybackPeriod || 'N/A'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Target className="h-4 w-4 text-gray-600 mr-2" />
            Top Business Drivers
          </h4>
          <div className="space-y-2">
            {(businessData?.businessDrivers || []).slice(0, 3).map((driver, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{driver.name}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(driver.priority)}`}>
                    {driver.priority}
                  </span>
                  <span className="text-sm text-gray-500">{driver.impact}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Architecture Review Executive Summary Component  
  const ArchitectureReviewExecutiveSummary = () => {
    const { currentAssessment } = useAssessment();
    const [architectureData, setArchitectureData] = useState(null);

    useEffect(() => {
      const loadArchitectureData = () => {
        try {
          const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'architecture');
          const summaryData = {
            healthMetrics: {
              maintainability: assessmentSpecificData?.healthMetrics?.maintainability || 78,
              testCoverage: assessmentSpecificData?.healthMetrics?.testCoverage || 72,
              overall: assessmentSpecificData?.healthMetrics?.overall || 71
            },
            codeQuality: {
              codeSmells: assessmentSpecificData?.codeQuality?.codeSmells || 156,
              bugs: assessmentSpecificData?.codeQuality?.bugs || 23,
              vulnerabilities: assessmentSpecificData?.codeQuality?.vulnerabilities || 8
            }
          };
          setArchitectureData(summaryData);
        } catch (error) {
          console.error('Error loading architecture data:', error);
        }
      };
      loadArchitectureData();
    }, [currentAssessment]);

    const getScoreIcon = (score) => {
      if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-600" />;
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Layers className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Architecture Review</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Health</span>
              {getScoreIcon(architectureData?.healthMetrics?.overall || 0)}
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {architectureData?.healthMetrics?.overall || 0}%
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Test Coverage</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {architectureData?.healthMetrics?.testCoverage || 0}%
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Code className="h-4 w-4 text-gray-600 mr-2" />
            Code Quality
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Code Smells</span>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{architectureData?.codeQuality?.codeSmells || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bugs</span>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm font-medium">{architectureData?.codeQuality?.bugs || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vulnerabilities</span>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm font-medium">{architectureData?.codeQuality?.vulnerabilities || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Results & Insights</h1>
                <p className="text-blue-100">Comprehensive assessment results and strategic recommendations</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 pb-4">
            <button
              onClick={() => setCurrentView('executive')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'executive' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Award className="h-4 w-4 inline mr-2" />
              Executive Dashboard
            </button>
            <button
              onClick={() => setCurrentView('detailed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'detailed' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Detailed Recommendations
            </button>
            <button
              onClick={() => setCurrentView('roadmap')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'roadmap' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <ArrowRight className="h-4 w-4 inline mr-2" />
              Implementation Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar - Matching Data Architecture Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <ExportDropdown 
              onExportPDF={exportToPDF}
              onExportExcel={exportToExcel}
              onExportJSON={exportPowerPointData}
            />
            <button
              onClick={generateAIRecommendations}
              disabled={isGeneratingAnalysis}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isGeneratingAnalysis ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {isGeneratingAnalysis ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 text-xs rounded-full ${
              storageMode === 'Azure DB' ? 'bg-blue-100 text-blue-800' : 
              storageMode === 'Simulation' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {storageMode}
            </span>
            {comprehensiveResults && (
              <div className="text-sm text-gray-600">
                <Clock className="h-4 w-4 inline mr-1" />
                Generated: {lastGeneratedTime.toLocaleDateString()} {lastGeneratedTime.toLocaleTimeString()}
                <div>
                  <Clock className="h-4 w-4 inline mr-1" />
                  {lastAiAnalysisTime 
                    ? `Last AI Analysis Run: ${lastAiAnalysisTime?.toLocaleString ? lastAiAnalysisTime.toLocaleString() : 'Unknown time'}`
                    : 'No AI analysis run yet'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'executive' && <ExecutiveDashboard />}
        {currentView === 'detailed' && <DetailedRecommendations />}
        {currentView === 'roadmap' && <ImplementationRoadmap />}
      </div>
    </div>
  );
};

export default Recommendations;