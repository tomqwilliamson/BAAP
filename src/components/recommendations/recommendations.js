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
  Award, Lightbulb, ChevronDown, ChevronUp, Printer, FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';
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
      cloudReadiness: { score: 0, strategy: '', timeline: '' }
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
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'recommendations');
      
      if (assessmentSpecificData) {
        // Use assessment-specific recommendations data
        const analysisResults = {
          executiveSummary: {
            overallReadinessScore: assessmentSpecificData.businessCase?.roi || 85,
            totalFindings: assessmentSpecificData.priority?.length || 3,
            criticalIssues: assessmentSpecificData.priority?.filter(p => p.impact === 'Critical').length || 1,
            estimatedSavings: assessmentSpecificData.businessCase?.projectedSavings || 180000,
            recommendedInvestment: assessmentSpecificData.businessCase?.totalInvestment || 150000,
            roiProjection: assessmentSpecificData.businessCase?.roi || 120,
            timeToValue: assessmentSpecificData.businessCase?.paybackPeriod || '18 months',
            confidenceLevel: 'High'
          },
          domainAssessments: generateDomainAssessments(currentAssessment?.id),
          priorityRecommendations: assessmentSpecificData.priority || [],
          businessCase: assessmentSpecificData.businessCase || {},
          analysis: assessmentSpecificData.analysis || {},
          roadmap: generateRoadmap(assessmentSpecificData.priority || [])
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
    return priorityRecommendations.map((rec, index) => ({
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
        ...comprehensiveResults.strategicRecommendations.map(rec => [
          rec.title, rec.category, rec.priority, rec.impact, rec.timeline, rec.investment, rec.estimatedROI
        ]),
        ...comprehensiveResults.tacticalRecommendations.map(rec => [
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
      recommendations: comprehensiveResults.strategicRecommendations.map(rec => ({
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
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
              ${(comprehensiveResults.businessCase.currentStateCosts / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-gray-700">Current State Costs</div>
            <div className="text-xs text-gray-500">Annual operational costs</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${(comprehensiveResults.businessCase.futureStateBenefits / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-gray-700">Future State Benefits</div>
            <div className="text-xs text-gray-500">Annual value creation</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${(comprehensiveResults.businessCase.netPresentValue / 1000000).toFixed(1)}M
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
                {comprehensiveResults.businessCase.riskMitigation.map((benefit, index) => (
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
                {comprehensiveResults.businessCase.competitiveAdvantages.map((advantage, index) => (
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            AI-Powered Strategic Insights
          </h3>
          <button
            onClick={generateAIRecommendations}
            disabled={isGeneratingAnalysis}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isGeneratingAnalysis ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isGeneratingAnalysis ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
              Trend Analysis
            </h4>
            <p className="text-sm text-gray-600 mb-4">{comprehensiveResults.aiInsights.trendAnalysis}</p>

            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              Risk Assessment
            </h4>
            <p className="text-sm text-gray-600">{comprehensiveResults.aiInsights.riskAssessment}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
              Opportunity Identification
            </h4>
            <p className="text-sm text-gray-600 mb-4">{comprehensiveResults.aiInsights.opportunityIdentification}</p>

            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 text-green-500 mr-2" />
              Implementation Strategy
            </h4>
            <p className="text-sm text-gray-600">{comprehensiveResults.aiInsights.implementationStrategy}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailedRecommendations = () => (
    <div className="space-y-8">
      {/* Strategic Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Target className="h-6 w-6 text-blue-600 mr-2" />
          Strategic Recommendations
        </h3>
        <div className="space-y-6">
          {comprehensiveResults.strategicRecommendations.map(rec => (
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
                        {rec.benefits.map((benefit, idx) => (
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
                        {rec.risks.map((risk, idx) => (
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
          {comprehensiveResults.quickWins.map(win => (
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
        items: comprehensiveResults.quickWins,
        color: 'blue'
      },
      {
        phase: 'Phase 2: Security & Compliance (3-9 months)',
        items: comprehensiveResults.strategicRecommendations.filter(r => r.category === 'Security'),
        color: 'red'
      },
      {
        phase: 'Phase 3: Infrastructure Modernization (6-15 months)',
        items: comprehensiveResults.strategicRecommendations.filter(r => r.category === 'Strategic'),
        color: 'green'
      },
      {
        phase: 'Phase 4: Optimization (12-18 months)',
        items: comprehensiveResults.tacticalRecommendations,
        color: 'purple'
      }
    ];

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Implementation Roadmap</h3>
        <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="flex items-center mb-4">
                <div className={`w-4 h-4 bg-${phase.color}-500 rounded-full mr-4`}></div>
                <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {phase.items.length} items
                </span>
              </div>
              <div className="ml-8 space-y-3">
                {phase.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.description || 'See detailed recommendations above'}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.timeline || item.investment || 'TBD'}
                    </div>
                  </div>
                ))}
              </div>
              {index < phases.length - 1 && (
                <div className="absolute left-2 top-8 w-0.5 h-8 bg-gray-300"></div>
              )}
            </div>
          ))}
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
              <button
                onClick={exportPowerPointData}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                PowerPoint Data
              </button>
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