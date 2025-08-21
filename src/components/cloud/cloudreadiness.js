/**
 * Cloud Readiness Assessment Component
 * 
 * This component provides comprehensive cloud migration readiness assessment by:
 * 1. Aggregating data from Security, DevOps, and Infrastructure assessment modules
 * 2. Implementing intelligent scoring algorithms with cross-domain analysis
 * 3. Providing manual input capability for business and organizational factors
 * 4. Generating AI-powered strategic recommendations
 * 
 * CURRENT STATE: Using mock data and localStorage for persistence
 * TO ENABLE BACKEND: Uncomment the assessmentService import and related API calls
 */

import React, { useEffect, useState } from 'react';
import { 
  Cloud, Shield, GitBranch, Server, Database, Zap, Activity, AlertTriangle,
  CheckCircle, Upload, Download, Save, Brain, RefreshCw, Clock, DollarSign,
  TrendingUp, BarChart3, Target, Edit3, Plus, Minus, Settings, Monitor
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { formatCurrency } from '../../utils/currency';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
// import { assessmentService } from '../../services/assessmentservice'; // Commented out since we're using mock data for now

const CloudReadiness = () => {
  const { currentAssessment } = useAssessment();
  const [currentView, setCurrentView] = useState('overview'); // overview, manual-input, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cloudReadinessData, setCloudReadinessData] = useState({
    crossDomainAnalysis: {
      securityReadiness: 0,
      infrastructureReadiness: 0,
      devopsReadiness: 0,
      dataReadiness: 0,
      overallScore: 0
    },
    domainScores: {
      security: {
        score: 0,
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        complianceScore: 0,
        findings: []
      },
      infrastructure: {
        score: 0,
        serversAssessed: 0,
        cloudReady: 0,
        estimatedSavings: 0,
        findings: []
      },
      devops: {
        score: 0,
        pipelineMaturity: 0,
        automationLevel: 0,
        codeQuality: 0,
        findings: []
      },
      data: {
        score: 0,
        databasesAssessed: 0,
        migrationComplexity: 'Medium',
        findings: []
      }
    },
    manualInputs: {
      businessDrivers: {
        costOptimization: 0,
        scalabilityNeeds: 0,
        innovationRequirements: 0,
        complianceRequirements: 0
      },
      organizationalReadiness: {
        cloudSkills: 0,
        changeManagement: 0,
        governanceMaturity: 0,
        riskTolerance: 0
      },
      technicalGaps: {
        networkReadiness: 0,
        identityManagement: 0,
        monitoringCapabilities: 0,
        backupStrategy: 0
      }
    },
    migrationStrategy: {
      recommendedApproach: '',
      timeline: '',
      phases: [],
      risks: [],
      prerequisites: []
    },
    analysis: {
      strategicAnalysis: '',
      technicalAnalysis: '',
      riskAnalysis: '',
      recommendationsSummary: ''
    }
  });

  useEffect(() => {
    loadCloudReadinessData();
  }, [currentAssessment]);

  const loadCloudReadinessData = async () => {
    try {
      setLoading(true);
      
      // Load aggregated data from all domains (using mock data for now)
      const [securityData, infrastructureData, devopsData] = await Promise.all([
        loadDomainData('security'),
        loadDomainData('infrastructure'),
        loadDomainData('devops')
      ]);

      // Calculate cross-domain readiness scores
      const calculatedData = calculateCloudReadiness(securityData, infrastructureData, devopsData);
      
      // Try to load saved data from localStorage first
      let finalData = calculatedData;
      try {
        const savedDataKey = currentAssessment?.id 
          ? `cloud_readiness_assessment_${currentAssessment.id}`
          : 'cloud_readiness_assessment';
        const savedData = localStorage.getItem(savedDataKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Merge saved manual inputs with calculated technical data
          finalData = {
            ...calculatedData,
            manualInputs: parsedData.manualInputs || calculatedData.manualInputs,
            analysis: parsedData.analysis || calculatedData.analysis
          };
        }
      } catch (error) {
        console.warn('Could not load saved data from localStorage:', error);
      }
      
      // Use calculated data with any saved manual inputs
      setCloudReadinessData(finalData);
      
    } catch (error) {
      console.error('Failed to load cloud readiness data:', error);
      // Create default data even if everything fails
      const defaultData = calculateCloudReadiness({}, {}, {});
      setCloudReadinessData(defaultData);
      toast.error('Using default data - some assessment modules may not be available');
    } finally {
      setLoading(false);
    }
  };

  const loadDomainData = async (domain) => {
    try {
      // For now, always use mock data since the backend endpoints may not be implemented
      // In production, you would uncomment the line below:
      // const data = await assessmentService.getAssessmentData(currentAssessment.id, domain);
      // return data || getMockDomainData(domain);
      
      return getMockDomainData(domain);
    } catch (error) {
      console.warn(`Failed to load ${domain} data:`, error);
      return getMockDomainData(domain);
    }
  };

  const getMockDomainData = (domain) => {
    switch (domain) {
      case 'security':
        return {
          summary: { critical: 35, high: 67, medium: 142, low: 89, total: 333 },
          overallScore: 68,
          compliance: [
            { framework: 'OWASP Top 10', score: 75 },
            { framework: 'ISO 27001', score: 82 },
            { framework: 'NIST Cybersecurity', score: 78 }
          ]
        };
      case 'infrastructure':
        return {
          servers: [
            { name: 'WEB-SRV-01', readiness: 95, complexity: 'Low' },
            { name: 'DB-SRV-01', readiness: 78, complexity: 'Medium' },
            { name: 'APP-SRV-01', readiness: 88, complexity: 'Low' }
          ],
          readiness: { ready: 45, conditional: 35, notReady: 20 },
          costs: { current: 12450, azureEstimate: 8960, savings: 3490 }
        };
      case 'devops':
        return {
          maturity: [
            { category: 'CI/CD Pipeline', score: 78 },
            { category: 'Automated Testing', score: 65 },
            { category: 'Infrastructure as Code', score: 58 }
          ],
          cicd: { successRate: 87, avgBuildTime: 8.5 },
          codeQuality: { coverage: 78, maintainability: 85 }
        };
      default:
        return {};
    }
  };

  const calculateCloudReadiness = (securityData, infrastructureData, devopsData) => {
    // Security Score Calculation
    const securityScore = Math.max(0, Math.min(100, 
      100 - ((securityData.summary?.critical || 0) * 3 + 
             (securityData.summary?.high || 0) * 2 + 
             (securityData.summary?.medium || 0) * 1) / 10
    ));

    // Infrastructure Score Calculation
    const infrastructureScore = infrastructureData.readiness?.ready || 45;

    // DevOps Score Calculation
    const devopsScore = devopsData.maturity?.reduce((acc, item) => acc + item.score, 0) / 
                        (devopsData.maturity?.length || 1);

    // Data Score (placeholder - would be calculated from data assessment)
    const dataScore = 70;

    // Overall Score (weighted average)
    const overallScore = Math.round(
      (securityScore * 0.25) + 
      (infrastructureScore * 0.35) + 
      (devopsScore * 0.25) + 
      (dataScore * 0.15)
    );

    return {
      crossDomainAnalysis: {
        securityReadiness: Math.round(securityScore),
        infrastructureReadiness: Math.round(infrastructureScore),
        devopsReadiness: Math.round(devopsScore),
        dataReadiness: Math.round(dataScore),
        overallScore
      },
      domainScores: {
        security: {
          score: Math.round(securityScore),
          vulnerabilities: securityData.summary || { critical: 0, high: 0, medium: 0, low: 0 },
          complianceScore: securityData.compliance?.reduce((acc, c) => acc + c.score, 0) / 
                          (securityData.compliance?.length || 1) || 0,
          findings: [
            'SQL injection vulnerabilities detected',
            'Missing security headers identified',
            'Weak authentication mechanisms found'
          ]
        },
        infrastructure: {
          score: Math.round(infrastructureScore),
          serversAssessed: infrastructureData.servers?.length || 0,
          cloudReady: infrastructureData.readiness?.ready || 0,
          estimatedSavings: infrastructureData.costs?.savings || 0,
          findings: [
            'Legacy OS versions require updates',
            'Optimization opportunities identified',
            'Network configuration modernization needed'
          ]
        },
        devops: {
          score: Math.round(devopsScore),
          pipelineMaturity: devopsData.maturity?.find(m => m.category.includes('CI/CD'))?.score || 0,
          automationLevel: devopsData.maturity?.find(m => m.category.includes('Infrastructure'))?.score || 0,
          codeQuality: devopsData.codeQuality?.coverage || 0,
          findings: [
            'CI/CD pipeline optimization needed',
            'Test automation coverage gaps',
            'Infrastructure as Code adoption required'
          ]
        },
        data: {
          score: Math.round(dataScore),
          databasesAssessed: 5,
          migrationComplexity: 'Medium',
          findings: [
            'Database modernization opportunities',
            'Data governance framework needed',
            'Backup and disaster recovery assessment required'
          ]
        }
      },
      manualInputs: {
        businessDrivers: {
          costOptimization: 70,
          scalabilityNeeds: 80,
          innovationRequirements: 60,
          complianceRequirements: 85
        },
        organizationalReadiness: {
          cloudSkills: 50,
          changeManagement: 60,
          governanceMaturity: 45,
          riskTolerance: 70
        },
        technicalGaps: {
          networkReadiness: 65,
          identityManagement: 55,
          monitoringCapabilities: 60,
          backupStrategy: 70
        }
      },
      migrationStrategy: {
        recommendedApproach: getRecommendedApproach(overallScore),
        timeline: getEstimatedTimeline(overallScore),
        phases: getMigrationPhases(overallScore),
        risks: getIdentifiedRisks(securityScore, infrastructureScore, devopsScore),
        prerequisites: getPrerequisites(securityScore, infrastructureScore, devopsScore)
      },
      analysis: {
        strategicAnalysis: '',
        technicalAnalysis: '',
        riskAnalysis: '',
        recommendationsSummary: ''
      }
    };
  };

  const getRecommendedApproach = (score) => {
    if (score >= 80) return 'Lift-and-Shift with Optimization';
    if (score >= 60) return 'Hybrid Migration with Modernization';
    return 'Phased Approach with Significant Refactoring';
  };

  const getEstimatedTimeline = (score) => {
    if (score >= 80) return '6-12 months';
    if (score >= 60) return '12-18 months';
    return '18-24 months';
  };

  const getMigrationPhases = (score) => {
    if (score >= 80) {
      return [
        { phase: 'Phase 1', duration: '2-3 months', focus: 'Infrastructure Setup' },
        { phase: 'Phase 2', duration: '3-6 months', focus: 'Application Migration' },
        { phase: 'Phase 3', duration: '1-3 months', focus: 'Optimization & Testing' }
      ];
    }
    return [
      { phase: 'Phase 1', duration: '3-6 months', focus: 'Foundation & Security' },
      { phase: 'Phase 2', duration: '6-9 months', focus: 'Core Application Migration' },
      { phase: 'Phase 3', duration: '6-9 months', focus: 'Modernization & Optimization' },
      { phase: 'Phase 4', duration: '3-6 months', focus: 'Testing & Validation' }
    ];
  };

  const getIdentifiedRisks = (securityScore, infrastructureScore, devopsScore) => {
    const risks = [];
    if (securityScore < 70) risks.push('Security vulnerabilities may delay migration');
    if (infrastructureScore < 60) risks.push('Infrastructure complexity may increase costs');
    if (devopsScore < 60) risks.push('DevOps maturity gaps may impact delivery');
    return risks;
  };

  const getPrerequisites = (securityScore, infrastructureScore, devopsScore) => {
    const prerequisites = [];
    if (securityScore < 70) prerequisites.push('Security remediation and compliance review');
    if (infrastructureScore < 60) prerequisites.push('Infrastructure modernization planning');
    if (devopsScore < 60) prerequisites.push('CI/CD pipeline establishment');
    return prerequisites;
  };

  const handleManualInputChange = (category, field, value) => {
    setCloudReadinessData(prev => ({
      ...prev,
      manualInputs: {
        ...prev.manualInputs,
        [category]: {
          ...prev.manualInputs[category],
          [field]: value
        }
      }
    }));
    
    // Recalculate overall score with manual inputs
    recalculateWithManualInputs();
  };

  const recalculateWithManualInputs = () => {
    setCloudReadinessData(prev => {
      const manualScore = Object.values(prev.manualInputs).reduce((total, category) => {
        const categoryAvg = Object.values(category).reduce((sum, val) => sum + val, 0) / Object.values(category).length;
        return total + categoryAvg;
      }, 0) / Object.values(prev.manualInputs).length;

      const technicalScore = (
        prev.crossDomainAnalysis.securityReadiness * 0.25 +
        prev.crossDomainAnalysis.infrastructureReadiness * 0.35 +
        prev.crossDomainAnalysis.devopsReadiness * 0.25 +
        prev.crossDomainAnalysis.dataReadiness * 0.15
      );

      const adjustedScore = Math.round((technicalScore * 0.7) + (manualScore * 0.3));

      return {
        ...prev,
        crossDomainAnalysis: {
          ...prev.crossDomainAnalysis,
          overallScore: adjustedScore
        }
      };
    });
  };

  const saveAssessment = async () => {
    if (!currentAssessment?.id) {
      // Save to localStorage if no current assessment
      const dataStr = JSON.stringify(cloudReadinessData, null, 2);
      localStorage.setItem('cloud_readiness_assessment', dataStr);
      setDataSaved(true);
      setLastSaveTime(new Date());
      toast.success('Cloud Readiness assessment saved to local storage!');
      return;
    }
    
    try {
      // For now, save to localStorage since backend may not be implemented
      // In production, uncomment the line below:
      // await assessmentService.updateCloudReadiness(currentAssessment.id, cloudReadinessData);
      
      const dataStr = JSON.stringify(cloudReadinessData, null, 2);
      localStorage.setItem(`cloud_readiness_assessment_${currentAssessment.id}`, dataStr);
      
      setDataSaved(true);
      setLastSaveTime(new Date());
      toast.success('Cloud Readiness assessment saved successfully!');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      toast.error('Failed to save assessment');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleDateString();
      
      // Title
      doc.setFontSize(20);
      doc.text('Cloud Migration Readiness Assessment', 20, 30);
      
      // Summary
      doc.setFontSize(12);
      doc.text(`Generated: ${timestamp}`, 20, 50);
      doc.text(`Overall Score: ${cloudReadinessData.crossDomainAnalysis.overallScore}%`, 20, 60);
      
      // Domain Scores
      doc.setFontSize(14);
      doc.text('Domain Readiness Scores:', 20, 80);
      doc.setFontSize(10);
      doc.text(`Security: ${cloudReadinessData.crossDomainAnalysis.securityReadiness}%`, 25, 95);
      doc.text(`Infrastructure: ${cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}%`, 25, 105);
      doc.text(`DevOps: ${cloudReadinessData.crossDomainAnalysis.devopsReadiness}%`, 25, 115);
      doc.text(`Data: ${cloudReadinessData.crossDomainAnalysis.dataReadiness}%`, 25, 125);
      
      // Analysis Results (if available)
      if (showAnalysisResults && cloudReadinessData.analysis) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Strategic Analysis', 20, 30);
        doc.setFontSize(10);
        const analysisText = cloudReadinessData.analysis.strategicAnalysis || 'No analysis available';
        const splitText = doc.splitTextToSize(analysisText, 170);
        doc.text(splitText, 20, 45);
        
        // Technical Analysis
        doc.setFontSize(14);
        doc.text('Technical Analysis', 20, 120);
        doc.setFontSize(10);
        const techText = cloudReadinessData.analysis.technicalAnalysis || 'No technical analysis available';
        const splitTechText = doc.splitTextToSize(techText, 170);
        doc.text(splitTechText, 20, 135);
      }
      
      doc.save(`cloud-readiness-assessment-${timestamp.replace(/\//g, '-')}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    }
  };

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Summary Sheet
      const summaryData = [
        ['Cloud Migration Readiness Assessment'],
        ['Generated', new Date().toLocaleDateString()],
        [''],
        ['Overall Score', `${cloudReadinessData.crossDomainAnalysis.overallScore}%`],
        [''],
        ['Domain Scores'],
        ['Security Readiness', `${cloudReadinessData.crossDomainAnalysis.securityReadiness}%`],
        ['Infrastructure Readiness', `${cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}%`],
        ['DevOps Readiness', `${cloudReadinessData.crossDomainAnalysis.devopsReadiness}%`],
        ['Data Readiness', `${cloudReadinessData.crossDomainAnalysis.dataReadiness}%`],
        [''],
        ['Manual Input Scores'],
        ['Business Drivers'],
        ['Cost Optimization', `${cloudReadinessData.manualInputs.businessDrivers.costOptimization}%`],
        ['Scalability Needs', `${cloudReadinessData.manualInputs.businessDrivers.scalabilityNeeds}%`],
        ['Innovation Requirements', `${cloudReadinessData.manualInputs.businessDrivers.innovationRequirements}%`],
        ['Compliance Requirements', `${cloudReadinessData.manualInputs.businessDrivers.complianceRequirements}%`],
        [''],
        ['Organizational Readiness'],
        ['Cloud Skills', `${cloudReadinessData.manualInputs.organizationalReadiness.cloudSkills}%`],
        ['Change Management', `${cloudReadinessData.manualInputs.organizationalReadiness.changeManagement}%`],
        ['Governance Maturity', `${cloudReadinessData.manualInputs.organizationalReadiness.governanceMaturity}%`],
        ['Risk Tolerance', `${cloudReadinessData.manualInputs.organizationalReadiness.riskTolerance}%`]
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      
      // Analysis Results Sheet (if available)
      if (showAnalysisResults && cloudReadinessData.analysis) {
        const analysisData = [
          ['Analysis Results'],
          [''],
          ['Strategic Analysis'],
          [cloudReadinessData.analysis.strategicAnalysis || 'No analysis available'],
          [''],
          ['Technical Analysis'],
          [cloudReadinessData.analysis.technicalAnalysis || 'No technical analysis available'],
          [''],
          ['Risk Analysis'],
          [cloudReadinessData.analysis.riskAnalysis || 'No risk analysis available'],
          [''],
          ['Recommendations Summary'],
          [cloudReadinessData.analysis.recommendationsSummary || 'No recommendations available']
        ];
        
        const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
        XLSX.utils.book_append_sheet(wb, analysisWs, 'Analysis');
      }
      
      const timestamp = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `cloud-readiness-assessment-${timestamp}.xlsx`);
      toast.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export Excel file');
    }
  };

  const exportAssessment = () => {
    const dataStr = JSON.stringify(cloudReadinessData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloud-readiness-assessment-${currentAssessment?.id || 'export'}.json`;
    link.click();
    toast.success('JSON exported successfully!');
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setCloudReadinessData(importedData);
          toast.success('Assessment imported successfully!');
        } catch (error) {
          toast.error('Error importing file: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    try {
      // Simulate AI analysis
      setTimeout(() => {
        const analysisResults = {
          strategicAnalysis: `Cross-domain cloud readiness analysis reveals an overall score of ${cloudReadinessData.crossDomainAnalysis.overallScore}%:

• **Security Domain**: ${cloudReadinessData.crossDomainAnalysis.securityReadiness}% readiness with ${cloudReadinessData.domainScores.security.vulnerabilities.critical} critical vulnerabilities
• **Infrastructure**: ${cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}% ready with ${cloudReadinessData.domainScores.infrastructure.serversAssessed} servers assessed
• **DevOps Maturity**: ${cloudReadinessData.crossDomainAnalysis.devopsReadiness}% with pipeline success rate of ${cloudReadinessData.domainScores.devops.pipelineMaturity}%
• **Organizational Readiness**: Based on manual inputs, cloud skills at ${cloudReadinessData.manualInputs.organizationalReadiness.cloudSkills}%`,

          technicalAnalysis: `Technical assessment across domains identifies key migration considerations:

• **Security Gaps**: ${cloudReadinessData.domainScores.security.vulnerabilities.critical + cloudReadinessData.domainScores.security.vulnerabilities.high} high-priority security issues requiring remediation
• **Infrastructure Optimization**: Estimated savings of ${formatCurrency(cloudReadinessData.domainScores.infrastructure.estimatedSavings || 0)} monthly in cloud
• **DevOps Modernization**: ${cloudReadinessData.domainScores.devops.automationLevel}% automation level needs improvement for cloud-native operations
• **Network & Identity**: Manual assessment indicates ${cloudReadinessData.manualInputs.technicalGaps.networkReadiness}% network readiness and ${cloudReadinessData.manualInputs.technicalGaps.identityManagement}% identity management maturity`,

          riskAnalysis: `Risk assessment based on cross-domain analysis identifies:

• **Migration Risks**: ${cloudReadinessData.migrationStrategy.risks.length} key risks identified requiring mitigation strategies
• **Timeline Impact**: Current readiness suggests ${cloudReadinessData.migrationStrategy.timeline} timeline with ${cloudReadinessData.migrationStrategy.phases.length} migration phases
• **Compliance Considerations**: Average compliance score of ${Math.round(cloudReadinessData.domainScores.security.complianceScore)}% across security frameworks
• **Change Management**: Organizational readiness score of ${Math.round(Object.values(cloudReadinessData.manualInputs.organizationalReadiness).reduce((a, b) => a + b, 0) / 4)}% indicates change management focus needed`,

          recommendationsSummary: `Strategic recommendations for cloud migration success:

**Immediate Actions (0-3 months)**:
1. Address ${cloudReadinessData.domainScores.security.vulnerabilities.critical} critical security vulnerabilities
2. Establish cloud governance framework and security baselines
3. Begin cloud skills development program for technical teams

**Short-term (3-12 months)**:
1. Implement ${cloudReadinessData.migrationStrategy.recommendedApproach} migration strategy
2. Modernize CI/CD pipelines for cloud-native deployment
3. Establish monitoring and operational procedures

**Long-term (12+ months)**:
1. Complete application modernization and optimization
2. Implement advanced cloud-native capabilities
3. Establish continuous improvement and cost optimization processes`
        };

        setCloudReadinessData(prev => ({
          ...prev,
          analysis: analysisResults
        }));
        
        setIsAnalyzing(false);
        setShowAnalysisResults(true);
        toast.success('Analysis completed successfully!');
      }, 3000);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed');
      setIsAnalyzing(false);
    }
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getReadinessLabel = (score) => {
    if (score >= 80) return 'Cloud Ready';
    if (score >= 60) return 'Mostly Ready';
    if (score >= 40) return 'Needs Work';
    return 'Not Ready';
  };

  const radarData = [
    { domain: 'Security', score: cloudReadinessData.crossDomainAnalysis.securityReadiness, fullMark: 100 },
    { domain: 'Infrastructure', score: cloudReadinessData.crossDomainAnalysis.infrastructureReadiness, fullMark: 100 },
    { domain: 'DevOps', score: cloudReadinessData.crossDomainAnalysis.devopsReadiness, fullMark: 100 },
    { domain: 'Data', score: cloudReadinessData.crossDomainAnalysis.dataReadiness, fullMark: 100 },
    { domain: 'Business', score: Math.round(Object.values(cloudReadinessData.manualInputs.businessDrivers).reduce((a, b) => a + b, 0) / 4), fullMark: 100 },
    { domain: 'Organization', score: Math.round(Object.values(cloudReadinessData.manualInputs.organizationalReadiness).reduce((a, b) => a + b, 0) / 4), fullMark: 100 }
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Cloud className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Cloud Migration Readiness</h1>
                <p className="text-blue-100">Comprehensive cross-domain assessment with AI-powered insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {dataSaved && lastSaveTime && (
                <div className="text-sm text-blue-200">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Saved {new Date(lastSaveTime).toLocaleTimeString()}
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importAssessment}
                  className="hidden"
                />
              </label>
              <div className="relative inline-block text-left">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={exportToPDF}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-l-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 border-t border-b border-blue-300 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    Excel
                  </button>
                  <button
                    onClick={exportAssessment}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-r-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    JSON
                  </button>
                </div>
              </div>
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
                currentView === 'overview' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setCurrentView('manual-input')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'manual-input' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Edit3 className="h-4 w-4 inline mr-2" />
              Manual Assessment
            </button>
            <button
              onClick={() => setCurrentView('analyze')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'analyze' ? 'bg-white text-blue-800' : 'text-blue-100 hover:text-white hover:bg-blue-700'
              }`}
            >
              <Brain className="h-4 w-4 inline mr-2" />
              AI Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview View */}
        {currentView === 'overview' && (
          <div className="space-y-6">
            {/* Overall Readiness Score */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Overall Cloud Readiness</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {cloudReadinessData.crossDomainAnalysis.overallScore}%
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(cloudReadinessData.crossDomainAnalysis.overallScore)}`}>
                    {getReadinessLabel(cloudReadinessData.crossDomainAnalysis.overallScore)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Migration Approach</span>
                    <span className="font-semibold">{cloudReadinessData.migrationStrategy.recommendedApproach}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Timeline</span>
                    <span className="font-semibold">{cloudReadinessData.migrationStrategy.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Migration Phases</span>
                    <span className="font-semibold">{cloudReadinessData.migrationStrategy.phases.length}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servers Assessed</span>
                    <span className="font-semibold">{cloudReadinessData.domainScores.infrastructure.serversAssessed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Issues</span>
                    <span className="font-semibold text-red-600">{cloudReadinessData.domainScores.security.vulnerabilities.critical + cloudReadinessData.domainScores.security.vulnerabilities.high}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DevOps Maturity</span>
                    <span className="font-semibold">{cloudReadinessData.crossDomainAnalysis.devopsReadiness}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Monthly Savings</span>
                    <span className="font-semibold text-green-600">${cloudReadinessData.domainScores.infrastructure.estimatedSavings?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Key Risks</span>
                    <span className="font-semibold text-orange-600">{cloudReadinessData.migrationStrategy.risks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prerequisites</span>
                    <span className="font-semibold text-blue-600">{cloudReadinessData.migrationStrategy.prerequisites.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Domain Readiness Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Cross-Domain Readiness Assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Readiness Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Domain Breakdown */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Domain Readiness Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-medium">Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${cloudReadinessData.crossDomainAnalysis.securityReadiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{cloudReadinessData.crossDomainAnalysis.securityReadiness}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Infrastructure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GitBranch className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">DevOps</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${cloudReadinessData.crossDomainAnalysis.devopsReadiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{cloudReadinessData.crossDomainAnalysis.devopsReadiness}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${cloudReadinessData.crossDomainAnalysis.dataReadiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{cloudReadinessData.crossDomainAnalysis.dataReadiness}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Migration Strategy */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recommended Migration Strategy</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Migration Phases</h4>
                  <div className="space-y-3">
                    {cloudReadinessData.migrationStrategy.phases.map((phase, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{phase.phase}</span>
                          <span className="text-sm text-gray-500">{phase.duration}</span>
                        </div>
                        <div className="text-sm text-gray-600">{phase.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Risks</h4>
                    <ul className="space-y-2">
                      {cloudReadinessData.migrationStrategy.risks.map((risk, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Prerequisites</h4>
                    <ul className="space-y-2">
                      {cloudReadinessData.migrationStrategy.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Input View */}
        {currentView === 'manual-input' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Manual Assessment Inputs</h3>
              <p className="text-gray-600 mb-6">
                Provide additional context and manual assessments to refine your cloud readiness score.
              </p>

              {/* Business Drivers */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  Business Drivers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(cloudReadinessData.manualInputs.businessDrivers).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleManualInputChange('businessDrivers', key, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-sm font-medium">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizational Readiness */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-green-600 mr-2" />
                  Organizational Readiness
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(cloudReadinessData.manualInputs.organizationalReadiness).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleManualInputChange('organizationalReadiness', key, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-sm font-medium">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Gaps */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Monitor className="h-5 w-5 text-purple-600 mr-2" />
                  Technical Gaps Assessment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(cloudReadinessData.manualInputs.technicalGaps).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleManualInputChange('technicalGaps', key, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-sm font-medium">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Updated Score Display */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Updated Cloud Readiness Score</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {cloudReadinessData.crossDomainAnalysis.overallScore}%
                </div>
                <p className="text-sm text-blue-700">
                  Score updated based on technical assessment (70%) and manual inputs (30%)
                </p>
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
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered Cloud Readiness Analysis</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Generate comprehensive analysis based on cross-domain assessment and manual inputs
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
                {/* Strategic Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Strategic Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {cloudReadinessData.analysis?.strategicAnalysis?.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-green-600" />
                      Technical Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {cloudReadinessData.analysis?.technicalAnalysis?.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                      Risk Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {cloudReadinessData.analysis?.riskAnalysis?.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations Summary */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                      Strategic Recommendations
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {cloudReadinessData.analysis?.recommendationsSummary?.split('\n').map((line, index) => (
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
                  Your cross-domain assessment data is ready. Run AI analysis to generate comprehensive insights and strategic recommendations.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-medium text-blue-900">Security</div>
                    <div className="text-blue-600">{cloudReadinessData.crossDomainAnalysis.securityReadiness}%</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-medium text-green-900">Infrastructure</div>
                    <div className="text-green-600">{cloudReadinessData.crossDomainAnalysis.infrastructureReadiness}%</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="font-medium text-yellow-900">DevOps</div>
                    <div className="text-yellow-600">{cloudReadinessData.crossDomainAnalysis.devopsReadiness}%</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium text-purple-900">Overall</div>
                    <div className="text-purple-600">{cloudReadinessData.crossDomainAnalysis.overallScore}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudReadiness;