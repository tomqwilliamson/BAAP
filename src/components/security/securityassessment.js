// src/components/Security/SecurityAssessment.js - Security assessment view
import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Upload, Download, Save, FileText, Image,
  Brain, RefreshCw, Clock, Activity, Database, Server, Wifi, Monitor, Trash2,
  TrendingUp, Network, BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useAssessment } from '../../contexts/assessmentcontext';
import { generateAssessmentSpecificData } from '../../utils/assessmentDataGenerator';

// Helper functions for generating cross-assessment and log data
const generateInfrastructureRisks = (securityData) => [
  { source: 'Infrastructure Assessment', risk: 'Unencrypted network traffic', severity: 'High', count: Math.floor(Math.random() * 5) + 2 },
  { source: 'Server Analysis', risk: 'Unpatched vulnerabilities', severity: 'Critical', count: securityData.vulnerabilities?.filter(v => v.category === 'Infrastructure').length || 3 },
  { source: 'Network Assessment', risk: 'Open firewall ports', severity: 'Medium', count: Math.floor(Math.random() * 8) + 4 }
];

const generateDatabaseVulnerabilities = (securityData) => [
  { source: 'Database Security Scan', risk: 'SQL injection vulnerabilities', severity: 'Critical', count: securityData.vulnerabilities?.filter(v => v.category === 'Database').length || 2 },
  { source: 'Access Control Audit', risk: 'Weak authentication', severity: 'High', count: Math.floor(Math.random() * 4) + 3 },
  { source: 'Privilege Review', risk: 'Excessive database privileges', severity: 'Medium', count: Math.floor(Math.random() * 8) + 5 }
];

const generateDevopsSecurityGaps = (securityData) => [
  { source: 'DevOps Assessment', risk: 'Secrets in source code', severity: 'Critical', count: Math.floor(Math.random() * 3) + 1 },
  { source: 'CI/CD Pipeline Review', risk: 'Insecure deployment processes', severity: 'High', count: Math.floor(Math.random() * 4) + 2 },
  { source: 'Container Security Scan', risk: 'Vulnerable container images', severity: 'Medium', count: Math.floor(Math.random() * 6) + 4 }
];

const generateSecurityLogs = (securityData) => ({
  vulnerabilityScans: [
    { scanner: 'Nessus', lastScan: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      critical: securityData.vulnerabilities?.filter(v => v.severity === 'Critical').length || 5,
      high: securityData.vulnerabilities?.filter(v => v.severity === 'High').length || 12,
      medium: securityData.vulnerabilities?.filter(v => v.severity === 'Medium').length || 25 },
    { scanner: 'OpenVAS', lastScan: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      critical: Math.floor(Math.random() * 8) + 2,
      high: Math.floor(Math.random() * 15) + 8,
      medium: Math.floor(Math.random() * 20) + 15 },
    { scanner: 'Qualys', lastScan: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      critical: Math.floor(Math.random() * 10) + 3,
      high: Math.floor(Math.random() * 18) + 10,
      medium: Math.floor(Math.random() * 25) + 20 }
  ],
  siemAlerts: [
    { source: 'Azure Sentinel', type: 'Suspicious Login Attempts', count: Math.floor(Math.random() * 30) + 15, severity: 'High' },
    { source: 'Microsoft Defender', type: 'Malware Detection', count: Math.floor(Math.random() * 10) + 3, severity: 'Critical' },
    { source: 'Custom SIEM', type: 'Data Exfiltration Attempt', count: Math.floor(Math.random() * 5) + 1, severity: 'Critical' }
  ],
  accessLogs: [
    { system: 'Active Directory', events: Math.floor(Math.random() * 1000) + 800, anomalies: Math.floor(Math.random() * 25) + 10, lastUpdate: new Date().toISOString().split('T')[0] },
    { system: 'VPN Access', events: Math.floor(Math.random() * 500) + 400, anomalies: Math.floor(Math.random() * 15) + 5, lastUpdate: new Date().toISOString().split('T')[0] },
    { system: 'Database Access', events: Math.floor(Math.random() * 2000) + 1000, anomalies: Math.floor(Math.random() * 50) + 20, lastUpdate: new Date().toISOString().split('T')[0] }
  ],
  networkTraffic: [
    { source: 'Firewall Logs', blocked: Math.floor(Math.random() * 1000) + 500, allowed: Math.floor(Math.random() * 8000) + 5000, suspicious: Math.floor(Math.random() * 50) + 20 },
    { source: 'IDS/IPS', detections: Math.floor(Math.random() * 100) + 50, blocked: Math.floor(Math.random() * 80) + 40, investigated: Math.floor(Math.random() * 30) + 15 },
    { source: 'DNS Logs', queries: Math.floor(Math.random() * 10000) + 8000, malicious: Math.floor(Math.random() * 30) + 10, blocked: Math.floor(Math.random() * 25) + 8 }
  ],
  endpointEvents: [
    { agent: 'Microsoft Defender', endpoints: Math.floor(Math.random() * 150) + 100, threats: Math.floor(Math.random() * 15) + 5, quarantined: Math.floor(Math.random() * 10) + 3 },
    { agent: 'CrowdStrike', endpoints: Math.floor(Math.random() * 200) + 150, threats: Math.floor(Math.random() * 12) + 4, quarantined: Math.floor(Math.random() * 8) + 2 },
    { agent: 'Carbon Black', endpoints: Math.floor(Math.random() * 120) + 80, threats: Math.floor(Math.random() * 8) + 2, quarantined: Math.floor(Math.random() * 6) + 1 }
  ]
});

function SecurityAssessment() {
  const { currentAssessment } = useAssessment();
  const [currentView, setCurrentView] = useState('overview'); // overview, repo, analyze
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [insights, setInsights] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState('documents');
  const [dragOver, setDragOver] = useState(false);
  
  const [securityData, setSecurityData] = useState({
    crossAssessment: {
      infrastructureRisks: [],
      databaseVulnerabilities: [],
      devopsSecurityGaps: [],
      overallSecurityScore: 0
    },
    securityLogs: {
      vulnerabilityScans: [],
      siemAlerts: [],
      accessLogs: [],
      networkTraffic: [],
      endpointEvents: []
    },
    findings: [],
    summary: {},
    owasp: [],
    compliance: [],
    uploadedFiles: [],
    analysis: {
      securityPostureAnalysis: '',
      threatAnalysis: '',
      complianceAnalysis: '',
      recommendationsAnalysis: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSecurityData();
    loadDocuments();
    loadInsights();
  }, [currentAssessment]);

  // Document management functions
  const documentTypes = [
    'Security Documentation',
    'Vulnerability Reports', 
    'Compliance Reports',
    'SIEM Reports',
    'Network Documentation',
    'Incident Response',
    'Risk Assessment',
    'Audit Documentation'
  ];

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/document');
      const data = await response.json();
      // Filter for security-related documents
      const securityDocs = data.filter(doc => 
        doc.documentType === 'Security Documentation' || 
        doc.documentType === 'Vulnerability Reports' ||
        doc.documentType === 'Compliance Reports' ||
        doc.category === 'security'
      );
      setDocuments(securityDocs);
    } catch (error) {
      console.error('Error loading security documents:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await fetch('/api/document/analyze-relationships', {
        method: 'POST'
      });
      const data = await response.json();
      // Filter insights for security-related documents
      const securityInsights = data.filter(insight => 
        insight.analysisCategory === 'Security' ||
        insight.documentType === 'Security Documentation'
      );
      setInsights(securityInsights);
    } catch (error) {
      console.error('Error loading security insights:', error);
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
        formData.append('documentType', 'Security Documentation');
        formData.append('category', 'security');
        
        const response = await fetch('/api/document/upload', {
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
      await fetch(`/api/document/${documentId}`, { method: 'DELETE' });
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
      'Security Documentation': 'bg-red-100 text-red-800',
      'Vulnerability Reports': 'bg-orange-100 text-orange-800',
      'Compliance Reports': 'bg-green-100 text-green-800',
      'SIEM Reports': 'bg-blue-100 text-blue-800',
      'Network Documentation': 'bg-purple-100 text-purple-800',
      'Incident Response': 'bg-yellow-100 text-yellow-800',
      'Risk Assessment': 'bg-pink-100 text-pink-800',
      'Audit Documentation': 'bg-gray-100 text-gray-800'
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

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      console.log('SECURITY: Loading data for assessment:', currentAssessment?.id);
      
      // Generate assessment-specific data
      const assessmentSpecificData = generateAssessmentSpecificData(currentAssessment, 'security');
      
      if (assessmentSpecificData) {
        // Use assessment-specific security data with enhanced cross-assessment and log analysis
        const enhancedData = {
          crossAssessment: {
            infrastructureRisks: generateInfrastructureRisks(assessmentSpecificData),
            databaseVulnerabilities: generateDatabaseVulnerabilities(assessmentSpecificData),
            devopsSecurityGaps: generateDevopsSecurityGaps(assessmentSpecificData),
            overallSecurityScore: assessmentSpecificData.complianceScore || 68
          },
          securityLogs: generateSecurityLogs(assessmentSpecificData),
          findings: assessmentSpecificData.vulnerabilities || [],
          summary: {
            critical: assessmentSpecificData.vulnerabilities?.filter(v => v.severity === 'Critical').length || 0,
            high: assessmentSpecificData.vulnerabilities?.filter(v => v.severity === 'High').length || 0,
            medium: assessmentSpecificData.vulnerabilities?.filter(v => v.severity === 'Medium').length || 0,
            low: assessmentSpecificData.vulnerabilities?.filter(v => v.severity === 'Low').length || 0,
            total: assessmentSpecificData.vulnerabilities?.length || 0
          },
          owasp: assessmentSpecificData.owaspCompliance || [],
          compliance: assessmentSpecificData.complianceResults || [],
          uploadedFiles: [],
          analysis: {
            securityPostureAnalysis: assessmentSpecificData.analysis?.securityPostureAnalysis || '',
            threatAnalysis: assessmentSpecificData.analysis?.threatAnalysis || '',
            complianceAnalysis: assessmentSpecificData.analysis?.complianceAnalysis || '',
            recommendationsAnalysis: assessmentSpecificData.analysis?.recommendationsAnalysis || ''
          }
        };
        setSecurityData(enhancedData);
      } else {
        // Fallback to mock data
        const mockData = {
        crossAssessment: {
          infrastructureRisks: [
            { source: 'Azure Migrate', risk: 'Unencrypted data migration', severity: 'High', count: 3 },
            { source: 'Network Assessment', risk: 'Open firewall ports', severity: 'Critical', count: 2 },
            { source: 'Server Analysis', risk: 'Unpatched vulnerabilities', severity: 'High', count: 8 }
          ],
          databaseVulnerabilities: [
            { source: 'DMA Assessment', risk: 'SQL injection points', severity: 'Critical', count: 4 },
            { source: 'Database Audit', risk: 'Weak authentication', severity: 'High', count: 6 },
            { source: 'Access Review', risk: 'Excessive privileges', severity: 'Medium', count: 12 }
          ],
          devopsSecurityGaps: [
            { source: 'GitHub Analysis', risk: 'Secrets in code', severity: 'Critical', count: 2 },
            { source: 'Pipeline Review', risk: 'Insecure CI/CD', severity: 'High', count: 5 },
            { source: 'Container Scan', risk: 'Vulnerable images', severity: 'Medium', count: 9 }
          ],
          overallSecurityScore: 68
        },
        securityLogs: {
          vulnerabilityScans: [
            { scanner: 'Nessus', lastScan: '2024-01-15', critical: 12, high: 28, medium: 45 },
            { scanner: 'OpenVAS', lastScan: '2024-01-14', critical: 8, high: 22, medium: 38 },
            { scanner: 'Qualys', lastScan: '2024-01-13', critical: 15, high: 31, medium: 52 }
          ],
          siemAlerts: [
            { source: 'Splunk', type: 'Suspicious Login', count: 23, severity: 'High' },
            { source: 'QRadar', type: 'Malware Detection', count: 8, severity: 'Critical' },
            { source: 'Sentinel', type: 'Data Exfiltration', count: 4, severity: 'Critical' }
          ],
          accessLogs: [
            { system: 'Active Directory', events: 1247, anomalies: 23, lastUpdate: '2024-01-15' },
            { system: 'VPN Access', events: 892, anomalies: 12, lastUpdate: '2024-01-15' },
            { system: 'Database Access', events: 2156, anomalies: 45, lastUpdate: '2024-01-15' }
          ],
          networkTraffic: [
            { source: 'Firewall Logs', blocked: 1247, allowed: 8956, suspicious: 34 },
            { source: 'IDS/IPS', detections: 89, blocked: 67, investigated: 22 },
            { source: 'DNS Logs', queries: 12456, malicious: 23, blocked: 18 }
          ],
          endpointEvents: [
            { agent: 'CrowdStrike', endpoints: 245, threats: 12, quarantined: 8 },
            { agent: 'Windows Defender', endpoints: 189, threats: 23, quarantined: 19 },
            { agent: 'Carbon Black', endpoints: 156, threats: 8, quarantined: 6 }
          ]
        },
        findings: [
          {
            id: 1,
            title: 'SQL Injection Vulnerability',
            severity: 'Critical',
            category: 'A03:2021 – Injection',
            description: 'User input is not properly sanitized in database queries',
            affected: 3,
            status: 'Open',
            cwe: 'CWE-89'
          },
          {
            id: 2,
            title: 'Missing Security Headers',
            severity: 'Medium',
            category: 'A05:2021 – Security Misconfiguration',
            description: 'Essential security headers not implemented',
            affected: 7,
            status: 'Open',
            cwe: 'CWE-693'
          },
          {
            id: 3,
            title: 'Weak Password Policy',
            severity: 'High',
            category: 'A07:2021 – Identification and Authentication Failures',
            description: 'Password requirements do not meet security standards',
            affected: 2,
            status: 'In Progress',
            cwe: 'CWE-521'
          }
        ],
        summary: {
          critical: 35,
          high: 67,
          medium: 142,
          low: 89,
          total: 333
        },
        owasp: [
          { name: 'Injection', count: 8, severity: 'Critical' },
          { name: 'Broken Authentication', count: 12, severity: 'High' },
          { name: 'Security Misconfiguration', count: 28, severity: 'Medium' },
          { name: 'Cross-Site Scripting', count: 15, severity: 'Medium' },
          { name: 'Insecure Deserialization', count: 9, severity: 'Low' }
        ],
        compliance: [
          { framework: 'OWASP Top 10', score: 75, status: 'Partial' },
          { framework: 'ISO 27001', score: 82, status: 'Good' },
          { framework: 'NIST Cybersecurity', score: 78, status: 'Good' },
          { framework: 'GDPR', score: 85, status: 'Good' }
        ],
        uploadedFiles: [
          { name: 'vulnerability-scan-results.xml', type: 'vulnerability-scan', size: '8.7 MB', uploadDate: '2024-01-15', status: 'Processed' },
          { name: 'siem-alerts-export.json', type: 'siem', size: '12.3 MB', uploadDate: '2024-01-14', status: 'Processed' },
          { name: 'firewall-logs.txt', type: 'firewall', size: '45.2 MB', uploadDate: '2024-01-13', status: 'Processed' }
        ],
        analysis: {
          securityPostureAnalysis: '',
          threatAnalysis: '',
          complianceAnalysis: '',
          recommendationsAnalysis: ''
        }
      };
      setSecurityData(mockData);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
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
      
      setSecurityData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, newFile]
      }));

      // Simulate processing
      setTimeout(() => {
        setSecurityData(prev => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles.map(f => 
            f.name === file.name ? { ...f, status: 'Processed' } : f
          )
        }));
      }, 2000);
    });
  };

  const exportAssessment = () => {
    const dataStr = JSON.stringify(securityData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'security-assessment.json';
    link.click();
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setSecurityData(importedData);
        } catch (error) {
          alert('Error importing file: Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveAssessment = async () => {
    try {
      if (!currentAssessment?.id) {
        toast.error('No assessment selected. Please select an assessment first.');
        return;
      }
      
      setDataSaved(true);
      setLastSaveTime(new Date());
      
      // Save to database via API (placeholder for actual implementation)
      console.log('SECURITY: Saving assessment data for:', currentAssessment.id, securityData);
      
      // Also save to localStorage as backup
      const dataStr = JSON.stringify(securityData, null, 2);
      localStorage.setItem(`security_assessment_${currentAssessment.id}`, dataStr);
      
      toast.success(`Security assessment data saved for "${currentAssessment.name}"!`);
    } catch (error) {
      console.error('Error saving security assessment:', error);
      toast.error('Failed to save assessment data');
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResults(false);
    
    // Simulate analysis processing
    setTimeout(() => {
      const analysisResults = {
        securityPostureAnalysis: `Cross-assessment security analysis reveals significant vulnerabilities across all technology domains:

• Total security findings: ${securityData.summary?.total || 333} across infrastructure, databases, and DevOps pipelines
• Critical vulnerabilities: ${securityData.summary?.critical || 35} requiring immediate attention
• Overall security score: ${securityData.crossAssessment?.overallSecurityScore || 68}% - needs improvement
• SIEM alerts show ${securityData.securityLogs?.siemAlerts?.reduce((sum, alert) => sum + alert.count, 0) || 35} security incidents requiring investigation`,

        threatAnalysis: `Threat landscape analysis from security logs and vulnerability scans:

• Vulnerability scanners detected ${securityData.securityLogs?.vulnerabilityScans?.reduce((sum, scan) => sum + scan.critical, 0) || 35} critical vulnerabilities
• Network traffic analysis shows ${securityData.securityLogs?.networkTraffic?.reduce((sum, traffic) => sum + traffic.suspicious, 0) || 79} suspicious activities
• Endpoint protection quarantined ${securityData.securityLogs?.endpointEvents?.reduce((sum, event) => sum + event.threats, 0) || 43} threats
• Access log anomalies detected across ${securityData.securityLogs?.accessLogs?.length || 3} critical systems`,

        complianceAnalysis: `Compliance framework assessment shows mixed readiness:

• OWASP Top 10: ${securityData.compliance?.find(c => c.framework === 'OWASP Top 10')?.score || 75}% compliance with ${securityData.owasp?.length || 5} vulnerability categories identified
• ISO 27001: ${securityData.compliance?.find(c => c.framework === 'ISO 27001')?.score || 82}% compliance - good security management practices
• NIST Cybersecurity Framework: ${securityData.compliance?.find(c => c.framework === 'NIST Cybersecurity')?.score || 78}% compliance
• GDPR: ${securityData.compliance?.find(c => c.framework === 'GDPR')?.score || 85}% compliance - strong data protection measures`,

        recommendationsAnalysis: `Priority security recommendations based on cross-domain analysis:

1. **Immediate (Critical)**: Address SQL injection vulnerabilities and patch unencrypted data migration paths
2. **Short-term (High)**: Implement comprehensive access controls and strengthen CI/CD pipeline security
3. **Medium-term**: Deploy advanced threat detection and response capabilities across all domains
4. **Long-term**: Establish continuous security monitoring and automated compliance reporting`
      };

      setSecurityData(prev => ({
        ...prev,
        analysis: analysisResults
      }));
      
      setIsAnalyzing(false);
      setShowAnalysisResults(true);
      toast.success('Analysis completed successfully!');
    }, 3000);
  };

  const severityColors = {
    Critical: '#EF4444',
    High: '#F97316',
    Medium: '#EAB308',
    Low: '#3B82F6'
  };

  const crossAssessmentData = [
    { domain: 'Infrastructure', score: 72, fullMark: 100 },
    { domain: 'Database', score: 65, fullMark: 100 },
    { domain: 'DevOps', score: 71, fullMark: 100 },
    { domain: 'Network', score: 58, fullMark: 100 },
    { domain: 'Endpoint', score: 76, fullMark: 100 },
    { domain: 'Application', score: 63, fullMark: 100 }
  ];

  const pieData = [
    { name: 'Critical', value: securityData.summary.critical, color: '#EF4444' },
    { name: 'High', value: securityData.summary.high, color: '#F97316' },
    { name: 'Medium', value: securityData.summary.medium, color: '#EAB308' },
    { name: 'Low', value: securityData.summary.low, color: '#3B82F6' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <Shield className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Security Assessment</h1>
                <p className="text-blue-100">AI-powered security analysis across all infrastructure domains</p>
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
                onClick={exportAssessment}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
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
              <Shield className="h-4 w-4 inline mr-2" />
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
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{securityData.summary?.critical || 35}</p>
                    <p className="text-xs text-gray-500">Immediate attention required</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">{securityData.summary?.high || 67}</p>
                    <p className="text-xs text-gray-500">Needs prompt resolution</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Security Score</p>
                    <p className="text-2xl font-bold text-gray-900">{securityData.crossAssessment?.overallSecurityScore || 68}%</p>
                    <p className="text-xs text-gray-500">Cross-domain assessment</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Findings</p>
                    <p className="text-2xl font-bold text-gray-900">{securityData.summary?.total || 333}</p>
                    <p className="text-xs text-gray-500">All severity levels</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cross-Domain Security Assessment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Domain Security Assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={crossAssessmentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Security Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Vulnerability Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerability Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: securityData.summary?.critical || 35, color: '#EF4444' },
                        { name: 'High', value: securityData.summary?.high || 67, color: '#F97316' },
                        { name: 'Medium', value: securityData.summary?.medium || 142, color: '#EAB308' },
                        { name: 'Low', value: securityData.summary?.low || 89, color: '#3B82F6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { name: 'Critical', value: securityData.summary?.critical || 35, color: '#EF4444' },
                        { name: 'High', value: securityData.summary?.high || 67, color: '#F97316' },
                        { name: 'Medium', value: securityData.summary?.medium || 142, color: '#EAB308' },
                        { name: 'Low', value: securityData.summary?.low || 89, color: '#3B82F6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cross-Assessment Risk Summary */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cross-Assessment Security Risks</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Infrastructure Risks */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Server className="h-5 w-5 mr-2 text-blue-600" />
                      Infrastructure Risks
                    </h4>
                    <div className="space-y-3">
                      {securityData.crossAssessment?.infrastructureRisks?.map((risk, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{risk.risk}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              risk.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                              risk.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {risk.severity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {risk.source} • {risk.count} instances
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  {/* Database Vulnerabilities */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-green-600" />
                      Database Vulnerabilities
                    </h4>
                    <div className="space-y-3">
                      {securityData.crossAssessment?.databaseVulnerabilities?.map((vuln, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{vuln.risk}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              vuln.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                              vuln.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {vuln.severity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {vuln.source} • {vuln.count} instances
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  {/* DevOps Security Gaps */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Monitor className="h-5 w-5 mr-2 text-purple-600" />
                      DevOps Security Gaps
                    </h4>
                    <div className="space-y-3">
                      {securityData.crossAssessment?.devopsSecurityGaps?.map((gap, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{gap.risk}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              gap.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                              gap.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {gap.severity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {gap.source} • {gap.count} instances
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Log Analysis */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security Log Analysis Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Log Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Events/Alerts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Update
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {securityData.securityLogs?.siemAlerts?.map((alert, index) => (
                      <tr key={`siem-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alert.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          SIEM Alert
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {alert.count} ({alert.type})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Real-time
                        </td>
                      </tr>
                    )) || []}
                    {securityData.securityLogs?.vulnerabilityScans?.map((scan, index) => (
                      <tr key={`scan-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {scan.scanner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Vulnerability Scan
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scan.critical + scan.high + scan.medium} vulnerabilities
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {scan.critical} Critical
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.lastScan}
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

            {/* File Upload Section */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security Data Source Integration</h3>
                <p className="text-sm text-gray-600">Upload security logs, vulnerability scans, SIEM exports, and other security assessment data</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Upload Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Vulnerability Scans */}
                  <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center bg-red-50">
                    <Shield className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Vulnerability Scans</h4>
                    <p className="text-xs text-gray-600 mb-3">Nessus, OpenVAS, Qualys</p>
                  </div>

                  {/* SIEM Exports */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
                    <Monitor className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">SIEM Exports</h4>
                    <p className="text-xs text-gray-600 mb-3">Splunk, QRadar, Sentinel</p>
                  </div>

                  {/* Access & Network Logs */}
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-green-50">
                    <Wifi className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Network & Access</h4>
                    <p className="text-xs text-gray-600 mb-3">Firewall, VPN, IDS/IPS</p>
                  </div>

                  {/* Endpoint & Server Logs */}
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50">
                    <Server className="h-10 w-10 text-purple-500 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Endpoint & Server</h4>
                    <p className="text-xs text-gray-600 mb-3">EDR, AV, System logs</p>
                  </div>
                </div>

                {/* Additional Upload Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Application Logs */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Application & Patch Logs</h4>
                    <p className="text-xs text-gray-600 mb-3">App logs, patch management, backup logs</p>
                  </div>

                  {/* Physical Security */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Image className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Physical Security</h4>
                    <p className="text-xs text-gray-600 mb-3">Badge access, camera logs, facility reports</p>
                  </div>

                  {/* Compliance Reports */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <CheckCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Compliance Reports</h4>
                    <p className="text-xs text-gray-600 mb-3">Audit reports, compliance scans</p>
                  </div>
                </div>
              </div>
            </div>

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
              <p className="text-lg mb-2">Or drag and drop security documents here</p>
              <p className="text-sm text-gray-500">
                Vulnerability scans • SIEM exports • Security logs • Compliance reports
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
                          No security documents uploaded yet. Upload some documents to get started!
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

            {/* Uploaded Files Table */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Uploaded Security Files</h3>
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
                    {securityData.uploadedFiles?.map((file, index) => (
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
                    {(!securityData.uploadedFiles || securityData.uploadedFiles.length === 0) && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No security files uploaded yet. Upload your security data sources to begin comprehensive analysis.
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
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered Security Analysis</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Run comprehensive security analysis across all assessment domains and uploaded security data
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
                {/* Security Posture Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Security Posture Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {securityData.analysis?.securityPostureAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Threat Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Threat Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {securityData.analysis?.threatAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compliance Analysis */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Compliance Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {securityData.analysis?.complianceAnalysis?.split('\\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-purple-600" />
                      Security Recommendations
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose max-w-none text-gray-700">
                      {securityData.analysis?.recommendationsAnalysis?.split('\\n').map((line, index) => (
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Security Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Upload your security data sources in the Data Sources tab, then return here to run comprehensive AI-powered security analysis.
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

export default SecurityAssessment;