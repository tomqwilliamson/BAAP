// Assessment-specific data generator utility
// This provides consistent mock data across all assessment components

export const generateAssessmentSpecificData = (assessment, component) => {
  if (!assessment?.id) {
    return getEmptyData(component);
  }

  const assessmentId = assessment.id;
  
  switch (component) {
    case 'infrastructure':
      return generateInfrastructureData(assessmentId, assessment);
    case 'security':
      return generateSecurityData(assessmentId, assessment);
    case 'devops':
      return generateDevOpsData(assessmentId, assessment);
    case 'dataArchitecture':
      return generateDataArchitectureData(assessmentId, assessment);
    case 'cloudReadiness':
      return generateCloudReadinessData(assessmentId, assessment);
    default:
      return {};
  }
};

const generateInfrastructureData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      servers: [
        { name: 'Web Server Cluster', type: 'IIS', count: 4, utilization: 78, readiness: 'High' },
        { name: 'Database Servers', type: 'SQL Server', count: 2, utilization: 65, readiness: 'Medium' },
        { name: 'Load Balancers', type: 'F5', count: 2, utilization: 45, readiness: 'High' }
      ],
      hosting: [
        { service: 'Web Hosting', current: 'On-Premises', recommended: 'Azure App Service', effort: 'Medium', cost: '$2,500/month' },
        { service: 'Database', current: 'SQL Server 2019', recommended: 'Azure SQL Database', effort: 'Low', cost: '$1,800/month' },
        { service: 'File Storage', current: 'Local Storage', recommended: 'Azure Blob Storage', effort: 'Low', cost: '$200/month' }
      ],
      utilization: [
        { month: 'Jan', cpu: 75, memory: 68, storage: 82 },
        { month: 'Feb', cpu: 78, memory: 71, storage: 84 },
        { month: 'Mar', cpu: 82, memory: 74, storage: 86 }
      ],
      cloudReadiness: [
        { component: 'Web Application', readiness: 85, blockers: ['Session State', 'File Dependencies'] },
        { component: 'Database', readiness: 78, blockers: ['Custom Extensions', 'Backup Strategy'] },
        { component: 'File System', readiness: 92, blockers: ['Path Dependencies'] }
      ],
      analysis: {
        infrastructureAnalysis: 'Infrastructure analysis shows good cloud readiness with moderate complexity. Web servers show high utilization requiring scalability improvements.',
        costOptimizationAnalysis: 'Potential 35% cost reduction through cloud migration with improved scalability and reliability.',
        securityAnalysis: 'Current security posture is adequate but can be enhanced with cloud-native security services.',
        modernizationRecommendations: 'Recommend containerization of web tier and migration to managed database services.'
      }
    };
  }
  
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      servers: [
        { name: 'Core Banking System', type: 'Mainframe', count: 1, utilization: 85, readiness: 'Low' },
        { name: 'Web Services', type: 'Windows Server', count: 6, utilization: 72, readiness: 'Medium' },
        { name: 'Database Cluster', type: 'Oracle RAC', count: 4, utilization: 68, readiness: 'Medium' }
      ],
      hosting: [
        { service: 'Core Banking', current: 'Mainframe', recommended: 'Hybrid Cloud', effort: 'High', cost: '$8,000/month' },
        { service: 'Web Services', current: 'Windows Server', recommended: 'Azure Container Apps', effort: 'Medium', cost: '$3,200/month' },
        { service: 'Database', current: 'Oracle on-prem', recommended: 'Azure SQL Managed Instance', effort: 'High', cost: '$4,500/month' }
      ],
      utilization: [
        { month: 'Jan', cpu: 82, memory: 78, storage: 88 },
        { month: 'Feb', cpu: 85, memory: 82, storage: 90 },
        { month: 'Mar', cpu: 88, memory: 85, storage: 92 }
      ],
      cloudReadiness: [
        { component: 'Core Banking', readiness: 25, blockers: ['Legacy Architecture', 'Regulatory Compliance', 'Data Sovereignty'] },
        { component: 'Web Services', readiness: 72, blockers: ['Security Controls', 'Audit Logging'] },
        { component: 'Database', readiness: 58, blockers: ['Encryption Requirements', 'Backup Compliance'] }
      ],
      analysis: {
        infrastructureAnalysis: 'Complex infrastructure with legacy mainframe requiring careful migration strategy. High utilization indicates capacity constraints.',
        costOptimizationAnalysis: 'Limited immediate cost savings due to compliance requirements, but long-term operational efficiency gains possible.',
        securityAnalysis: 'Strong security requirements necessitate enhanced monitoring and compliance frameworks in cloud environment.',
        modernizationRecommendations: 'Phased approach: migrate peripheral systems first, establish hybrid connectivity, maintain core banking on-premises initially.'
      }
    };
  }
  
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      servers: [
        { name: 'Application Servers', type: 'Linux', count: 8, utilization: 62, readiness: 'High' },
        { name: 'Container Platform', type: 'Kubernetes', count: 12, utilization: 58, readiness: 'High' },
        { name: 'Data Services', type: 'PostgreSQL', count: 3, utilization: 45, readiness: 'High' }
      ],
      hosting: [
        { service: 'Container Orchestration', current: 'On-Premises K8s', recommended: 'Azure AKS', effort: 'Low', cost: '$1,200/month' },
        { service: 'Database Services', current: 'Self-managed PostgreSQL', recommended: 'Azure Database for PostgreSQL', effort: 'Medium', cost: '$800/month' },
        { service: 'Monitoring & Logging', current: 'Custom Stack', recommended: 'Azure Monitor', effort: 'Low', cost: '$400/month' }
      ],
      utilization: [
        { month: 'Jan', cpu: 58, memory: 52, storage: 65 },
        { month: 'Feb', cpu: 62, memory: 55, storage: 68 },
        { month: 'Mar', cpu: 65, memory: 58, storage: 70 }
      ],
      cloudReadiness: [
        { component: 'Containerized Apps', readiness: 95, blockers: ['Storage Persistence'] },
        { component: 'Data Services', readiness: 88, blockers: ['Backup Strategy'] },
        { component: 'Networking', readiness: 82, blockers: ['VPN Configuration'] }
      ],
      analysis: {
        infrastructureAnalysis: 'Modern containerized infrastructure with excellent cloud readiness. Low utilization indicates over-provisioning.',
        costOptimizationAnalysis: 'Significant cost optimization opportunity through right-sizing and cloud-native services.',
        securityAnalysis: 'Good security foundation with container security practices, can be enhanced with cloud security services.',
        modernizationRecommendations: 'Quick migration path available - recommend lift-and-shift to AKS with gradual adoption of managed services.'
      }
    };
  }
};

const generateSecurityData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      findings: [
        { id: 1, title: 'Outdated SSL Certificates', severity: 'High', category: 'Network Security', status: 'Open', affected: 3 },
        { id: 2, title: 'Missing Input Validation', severity: 'Critical', category: 'Application Security', status: 'Open', affected: 5 },
        { id: 3, title: 'Weak Password Policy', severity: 'Medium', category: 'Access Control', status: 'In Progress', affected: 2 }
      ],
      vulnerabilities: [
        { cve: 'CVE-2023-12345', severity: 'High', component: 'Payment Gateway', score: 8.1, status: 'Patched' },
        { cve: 'CVE-2023-67890', severity: 'Critical', component: 'User Authentication', score: 9.2, status: 'Open' }
      ],
      complianceStatus: {
        pci: { score: 78, status: 'Partial', requirements: '12/12', compliant: '9/12' },
        gdpr: { score: 85, status: 'Good', requirements: '8/8', compliant: '7/8' },
        iso27001: { score: 72, status: 'Needs Improvement', requirements: '10/10', compliant: '7/10' }
      },
      analysis: {
        securityPostureAnalysis: 'E-commerce platform shows moderate security posture with critical payment security gaps. SSL certificate management needs immediate attention. Input validation vulnerabilities pose significant risk to customer data.',
        threatAnalysis: 'Primary threats include payment fraud, data breaches, and session hijacking. Customer data exposure risk is high due to authentication vulnerabilities.',
        complianceAnalysis: 'PCI DSS compliance gaps in payment processing. GDPR compliance good but needs data retention policy updates. ISO 27001 framework partially implemented.',
        recommendationsAnalysis: 'Priority: 1) Update SSL certificates, 2) Implement input validation, 3) Strengthen authentication, 4) Complete PCI DSS compliance.'
      }
    };
  }
  // Financial Services Security (Assessment 2)  
  else if (assessmentId === 2) {
    return {
      findings: [
        { id: 1, title: 'Legacy Authentication System', severity: 'Critical', category: 'Access Control', status: 'Open', affected: 8 },
        { id: 2, title: 'Unencrypted Data Transmission', severity: 'Critical', category: 'Data Protection', status: 'Open', affected: 12 },
        { id: 3, title: 'Missing Audit Trails', severity: 'High', category: 'Compliance', status: 'In Progress', affected: 6 },
        { id: 4, title: 'Insufficient Monitoring', severity: 'High', category: 'Detection', status: 'Open', affected: 10 }
      ],
      vulnerabilities: [
        { cve: 'CVE-2023-11111', severity: 'Critical', component: 'Core Banking', score: 9.8, status: 'Open' },
        { cve: 'CVE-2023-22222', severity: 'High', component: 'Web Portal', score: 8.4, status: 'Patching' },
        { cve: 'CVE-2023-33333', severity: 'Critical', component: 'API Gateway', score: 9.1, status: 'Open' }
      ],
      complianceStatus: {
        sox: { score: 65, status: 'Non-Compliant', requirements: '15/15', compliant: '10/15' },
        pci: { score: 58, status: 'Critical Gaps', requirements: '12/12', compliant: '7/12' },
        glba: { score: 70, status: 'Needs Improvement', requirements: '8/8', compliant: '6/8' },
        ffiec: { score: 62, status: 'Non-Compliant', requirements: '20/20', compliant: '12/20' }
      },
      analysis: {
        securityPostureAnalysis: 'Financial services environment shows significant security gaps with critical compliance violations. Legacy systems create substantial risk exposure. Regulatory requirements not adequately addressed.',
        threatAnalysis: 'High risk of regulatory penalties, data breaches, and financial fraud. Advanced persistent threats targeting financial data. Insider threat risk elevated due to insufficient monitoring.',
        complianceAnalysis: 'Multiple regulatory compliance failures across SOX, PCI DSS, GLBA, and FFIEC standards. Immediate remediation required to avoid regulatory action.',
        recommendationsAnalysis: 'Critical: 1) Implement modern authentication, 2) Encrypt all data transmission, 3) Deploy comprehensive monitoring, 4) Complete compliance remediation program.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      findings: [
        { id: 1, title: 'Container Security Gaps', severity: 'Medium', category: 'Container Security', status: 'Open', affected: 4 },
        { id: 2, title: 'Network Segmentation', severity: 'Medium', category: 'Network Security', status: 'Planned', affected: 2 },
        { id: 3, title: 'Secret Management', severity: 'High', category: 'Access Control', status: 'In Progress', affected: 6 }
      ],
      vulnerabilities: [
        { cve: 'CVE-2023-44444', severity: 'Medium', component: 'Kubernetes', score: 6.8, status: 'Mitigated' },
        { cve: 'CVE-2023-55555', severity: 'High', component: 'Container Runtime', score: 7.9, status: 'Open' }
      ],
      complianceStatus: {
        nist: { score: 88, status: 'Good', requirements: '10/10', compliant: '9/10' },
        cis: { score: 82, status: 'Good', requirements: '15/15', compliant: '12/15' },
        kubernetes: { score: 75, status: 'Acceptable', requirements: '12/12', compliant: '9/12' }
      },
      analysis: {
        securityPostureAnalysis: 'Cloud-ready environment shows good security foundation with modern practices. Container security needs attention but manageable gaps. Strong baseline security posture.',
        threatAnalysis: 'Container escape risks and supply chain threats primary concerns. Network isolation and secret management need enhancement. Overall threat exposure moderate.',
        complianceAnalysis: 'Strong compliance posture with NIST framework well-implemented. CIS benchmarks mostly met. Kubernetes security standards need minor improvements.',
        recommendationsAnalysis: 'Focus areas: 1) Enhance container security scanning, 2) Implement proper secret management, 3) Improve network segmentation, 4) Complete Kubernetes hardening.'
      }
    };
  }
};

const generateDevOpsData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      pipelines: [
        { name: 'Frontend Build', status: 'Success', lastRun: '2 hours ago', duration: '4m 32s', successRate: 94 },
        { name: 'API Build', status: 'Failed', lastRun: '1 hour ago', duration: '6m 18s', successRate: 87 },
        { name: 'Database Deploy', status: 'Success', lastRun: '6 hours ago', duration: '2m 45s', successRate: 98 }
      ],
      deployments: {
        production: { frequency: 'Weekly', lastDeploy: '3 days ago', rollbacks: 2, success: 92 },
        staging: { frequency: 'Daily', lastDeploy: '4 hours ago', rollbacks: 0, success: 98 },
        dev: { frequency: 'Continuous', lastDeploy: '30 minutes ago', rollbacks: 1, success: 95 }
      },
      maturityScores: {
        cicd: 78, automation: 72, monitoring: 65, testing: 82, security: 70, collaboration: 85
      },
      analysis: {
        cicdAnalysis: 'E-commerce platform has solid CI/CD foundation with room for improvement in pipeline reliability. Frontend builds stable, but API pipeline needs attention.',
        deploymentAnalysis: 'Weekly production deployments indicate conservative approach. Staging environment well-utilized. Consider increasing deployment frequency.',
        testingAnalysis: 'Good test automation coverage at 82%. Focus on improving API testing to reduce build failures.',
        recommendationsAnalysis: 'Key improvements: 1) Fix API pipeline instability, 2) Increase deployment frequency, 3) Enhance monitoring coverage, 4) Implement blue-green deployments.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      pipelines: [
        { name: 'Core Banking Build', status: 'Success', lastRun: '12 hours ago', duration: '45m 22s', successRate: 85 },
        { name: 'Security Scan', status: 'Warning', lastRun: '8 hours ago', duration: '15m 30s', successRate: 91 },
        { name: 'Compliance Check', status: 'Success', lastRun: '4 hours ago', duration: '8m 10s', successRate: 96 }
      ],
      deployments: {
        production: { frequency: 'Monthly', lastDeploy: '2 weeks ago', rollbacks: 0, success: 100 },
        staging: { frequency: 'Weekly', lastDeploy: '3 days ago', rollbacks: 1, success: 95 },
        test: { frequency: 'Daily', lastDeploy: '1 day ago', rollbacks: 0, success: 98 }
      },
      maturityScores: {
        cicd: 65, automation: 58, monitoring: 88, testing: 75, security: 92, collaboration: 70
      },
      analysis: {
        cicdAnalysis: 'Financial services environment prioritizes security and compliance over speed. Long build times due to extensive security scanning. Conservative deployment approach appropriate for regulatory requirements.',
        deploymentAnalysis: 'Monthly production deployments reflect risk-averse approach suitable for financial services. Strong rollback success rate indicates good deployment practices.',
        testingAnalysis: 'Comprehensive security testing implemented. Need to improve automated testing coverage while maintaining compliance standards.',
        recommendationsAnalysis: 'Balanced improvements: 1) Optimize security scanning for faster feedback, 2) Implement automated compliance testing, 3) Enhance development environment automation, 4) Maintain stringent security practices.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      pipelines: [
        { name: 'Container Build', status: 'Success', lastRun: '30 minutes ago', duration: '2m 15s', successRate: 97 },
        { name: 'Kubernetes Deploy', status: 'Success', lastRun: '1 hour ago', duration: '3m 40s', successRate: 95 },
        { name: 'Integration Tests', status: 'Success', lastRun: '45 minutes ago', duration: '5m 20s', successRate: 93 }
      ],
      deployments: {
        production: { frequency: 'Daily', lastDeploy: '2 hours ago', rollbacks: 1, success: 97 },
        staging: { frequency: 'Continuous', lastDeploy: '1 hour ago', rollbacks: 2, success: 94 },
        dev: { frequency: 'Continuous', lastDeploy: '15 minutes ago', rollbacks: 3, success: 92 }
      },
      maturityScores: {
        cicd: 92, automation: 88, monitoring: 85, testing: 90, security: 78, collaboration: 95
      },
      analysis: {
        cicdAnalysis: 'Modern cloud-native CI/CD pipeline with excellent automation and fast feedback cycles. Container-based builds enable quick deployments and good scalability.',
        deploymentAnalysis: 'High-frequency deployments with good success rates demonstrate mature DevOps practices. Continuous deployment in development and staging environments.',
        testingAnalysis: 'Strong automated testing foundation with good integration test coverage. Container testing and security scanning well integrated.',
        recommendationsAnalysis: 'Optimization focus: 1) Enhance security scanning integration, 2) Implement chaos engineering, 3) Improve observability and monitoring, 4) Expand test automation coverage.'
      }
    };
  }
};

const generateDataArchitectureData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      databases: [
        { name: 'Customer DB', type: 'SQL Server', size: '2.5TB', performance: 78, availability: 99.2 },
        { name: 'Product Catalog', type: 'MongoDB', size: '850GB', performance: 92, availability: 99.8 },
        { name: 'Session Store', type: 'Redis', size: '45GB', performance: 95, availability: 99.9 }
      ],
      dataflows: [
        { source: 'Web App', target: 'Customer DB', volume: '50K/day', latency: '45ms', status: 'Healthy' },
        { source: 'Mobile App', target: 'Product Catalog', volume: '125K/day', latency: '23ms', status: 'Healthy' },
        { source: 'Analytics', target: 'Data Warehouse', volume: '2M/day', latency: '2.5s', status: 'Warning' }
      ],
      analysis: {
        dataArchitectureAnalysis: 'E-commerce data architecture shows good separation of concerns with customer, product, and session data properly segregated. Performance generally good with some analytics bottlenecks.',
        performanceAnalysis: 'Customer database showing some performance degradation under peak loads. Product catalog performing well with NoSQL optimization. Session management efficient.',
        modernizationAnalysis: 'Recommend migrating to cloud-native data services for improved scalability and performance. Consider implementing data lakehouse architecture for analytics.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      databases: [
        { name: 'Core Banking', type: 'DB2 Mainframe', size: '12TB', performance: 65, availability: 99.95 },
        { name: 'Customer Data', type: 'Oracle RAC', size: '8.5TB', performance: 72, availability: 99.9 },
        { name: 'Reporting DB', type: 'SQL Server', size: '3.2TB', performance: 88, availability: 99.5 }
      ],
      dataflows: [
        { source: 'ATM Network', target: 'Core Banking', volume: '500K/day', latency: '180ms', status: 'Healthy' },
        { source: 'Web Banking', target: 'Customer Data', volume: '200K/day', latency: '95ms', status: 'Warning' },
        { source: 'Batch Jobs', target: 'Reporting DB', volume: '10M/day', latency: '15min', status: 'Critical' }
      ],
      analysis: {
        dataArchitectureAnalysis: 'Legacy financial data architecture with mainframe core showing signs of strain. High availability maintained but performance and scalability concerns growing.',
        performanceAnalysis: 'Core banking system nearing capacity limits. Customer data access patterns creating bottlenecks. Reporting infrastructure struggling with batch processing volumes.',
        modernizationAnalysis: 'Critical need for data architecture modernization. Recommend hybrid approach maintaining core banking stability while modernizing peripheral systems and implementing real-time analytics.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      databases: [
        { name: 'Application DB', type: 'PostgreSQL', size: '1.2TB', performance: 91, availability: 99.7 },
        { name: 'Time Series DB', type: 'InfluxDB', size: '450GB', performance: 94, availability: 99.6 },
        { name: 'Search Index', type: 'Elasticsearch', size: '280GB', performance: 89, availability: 99.8 }
      ],
      dataflows: [
        { source: 'Microservices', target: 'Application DB', volume: '80K/day', latency: '12ms', status: 'Excellent' },
        { source: 'IoT Sensors', target: 'Time Series DB', volume: '1M/day', latency: '5ms', status: 'Excellent' },
        { source: 'API Gateway', target: 'Search Index', volume: '300K/day', latency: '8ms', status: 'Healthy' }
      ],
      analysis: {
        dataArchitectureAnalysis: 'Modern cloud-ready data architecture with microservices-oriented design. Multiple specialized databases optimized for specific use cases showing excellent performance characteristics.',
        performanceAnalysis: 'All databases performing well within optimal ranges. Low latency data flows and high availability. Time series data handling particularly efficient.',
        modernizationAnalysis: 'Architecture already well-suited for cloud migration. Recommend managed database services for operational efficiency and implementing data mesh principles for scale.'
      }
    };
  }
};

const generateCloudReadinessData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      readinessScores: {
        applications: 75, infrastructure: 82, data: 78, security: 71, operations: 68
      },
      migrationWave: [
        { wave: 'Wave 1', applications: ['Static Assets', 'CDN'], complexity: 'Low', timeline: '2 weeks' },
        { wave: 'Wave 2', applications: ['Web Frontend', 'API Gateway'], complexity: 'Medium', timeline: '6 weeks' },
        { wave: 'Wave 3', applications: ['Core Services', 'Database'], complexity: 'High', timeline: '12 weeks' }
      ],
      analysis: {
        readinessAnalysis: 'E-commerce platform shows good overall cloud readiness with infrastructure and data components leading. Security and operations need attention before migration.',
        migrationAnalysis: 'Recommended 3-wave migration approach starting with low-risk static assets, progressing to web services, and finally core business logic.',
        costAnalysis: 'Estimated 30-35% cost reduction post-migration with improved scalability and reduced operational overhead.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      readinessScores: {
        applications: 45, infrastructure: 52, data: 38, security: 85, operations: 62
      },
      migrationWave: [
        { wave: 'Wave 1', applications: ['Development Tools', 'Non-Critical Apps'], complexity: 'Medium', timeline: '8 weeks' },
        { wave: 'Wave 2', applications: ['Web Services', 'Reporting'], complexity: 'High', timeline: '16 weeks' },
        { wave: 'Wave 3', applications: ['Core Banking - Hybrid'], complexity: 'Critical', timeline: '24 weeks' }
      ],
      analysis: {
        readinessAnalysis: 'Financial services environment shows strong security readiness but significant challenges with legacy applications and data architecture. Hybrid approach recommended.',
        migrationAnalysis: 'Conservative 3-wave approach with core banking remaining on-premises initially. Focus on peripheral systems and gradual cloud adoption.',
        costAnalysis: 'Limited immediate cost savings due to compliance requirements, but long-term operational efficiency gains and improved disaster recovery capabilities.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      readinessScores: {
        applications: 92, infrastructure: 88, data: 85, security: 78, operations: 91
      },
      migrationWave: [
        { wave: 'Wave 1', applications: ['Containerized Apps', 'Stateless Services'], complexity: 'Low', timeline: '3 weeks' },
        { wave: 'Wave 2', applications: ['Data Services', 'Monitoring Stack'], complexity: 'Medium', timeline: '4 weeks' },
        { wave: 'Wave 3', applications: ['Legacy Connectors', 'Batch Jobs'], complexity: 'Medium', timeline: '6 weeks' }
      ],
      analysis: {
        readinessAnalysis: 'Excellent cloud readiness across all dimensions. Modern containerized architecture with cloud-native practices already implemented. Migration path straightforward.',
        migrationAnalysis: 'Rapid migration possible with lift-and-shift approach for containerized workloads. Minimal refactoring required.',
        costAnalysis: 'Significant cost optimization opportunities through right-sizing and managed services. Estimated 40-50% reduction in infrastructure costs.'
      }
    };
  }
};

const getEmptyData = (component) => {
  return {
    analysis: {
      [`${component}Analysis`]: 'No assessment selected. Please select an assessment from the Dashboard to view detailed analysis.',
      recommendations: 'Select an assessment to see recommendations.',
      considerations: 'Assessment-specific considerations will appear here.'
    }
  };
};