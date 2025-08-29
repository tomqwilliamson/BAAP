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
    case 'architecture':
      return generateArchitectureData(assessmentId, assessment);
    case 'portfolio':
      return generatePortfolioData(assessmentId, assessment);
    case 'recommendations':
      return generateRecommendationsData(assessmentId, assessment);
    case 'business':
      return generateBusinessContextData(assessmentId, assessment);
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

const generateArchitectureData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      applications: [
        { name: 'E-commerce Web App', technology: '.NET Core', complexity: 'Medium', dependencies: 8, issues: 3 },
        { name: 'Payment Gateway', technology: 'Java Spring', complexity: 'High', dependencies: 12, issues: 2 },
        { name: 'Inventory System', technology: 'Node.js', complexity: 'Low', dependencies: 4, issues: 1 },
        { name: 'Customer Portal', technology: 'React/Redux', complexity: 'Medium', dependencies: 6, issues: 5 }
      ],
      dependencies: [
        { from: 'Web App', to: 'Payment Gateway', type: 'API', strength: 'High' },
        { from: 'Web App', to: 'Inventory System', type: 'Database', strength: 'Medium' },
        { from: 'Customer Portal', to: 'Web App', type: 'REST', strength: 'High' }
      ],
      patterns: [
        { pattern: 'Microservices', usage: 65, maturity: 'Intermediate' },
        { pattern: 'Event-Driven', usage: 40, maturity: 'Basic' },
        { pattern: 'API Gateway', usage: 80, maturity: 'Advanced' },
        { pattern: 'CQRS', usage: 25, maturity: 'Basic' }
      ],
      analysis: {
        architectureAnalysis: 'E-commerce architecture shows good separation of concerns with microservices adoption. Payment and inventory systems well-isolated but customer portal needs modernization.',
        dependencyAnalysis: 'Strong API-first design with manageable dependencies. Consider reducing coupling between web app and inventory system.',
        modernizationAnalysis: 'Good foundation for cloud migration. Recommend containerizing services and implementing service mesh for better observability.',
        recommendationsAnalysis: 'Focus on: 1) Customer portal modernization, 2) Event-driven patterns for inventory updates, 3) API versioning strategy, 4) Circuit breaker implementation.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      applications: [
        { name: 'Core Banking System', technology: 'COBOL/Mainframe', complexity: 'Very High', dependencies: 25, issues: 8 },
        { name: 'Online Banking', technology: '.NET Framework', complexity: 'High', dependencies: 18, issues: 12 },
        { name: 'Mobile Banking', technology: 'Native iOS/Android', complexity: 'Medium', dependencies: 10, issues: 6 },
        { name: 'Risk Management', technology: 'Java EE', complexity: 'High', dependencies: 15, issues: 4 }
      ],
      dependencies: [
        { from: 'Online Banking', to: 'Core Banking', type: 'ESB', strength: 'Critical' },
        { from: 'Mobile Banking', to: 'Online Banking', type: 'API', strength: 'High' },
        { from: 'Risk Management', to: 'Core Banking', type: 'Batch', strength: 'Medium' }
      ],
      patterns: [
        { pattern: 'Monolithic', usage: 70, maturity: 'Legacy' },
        { pattern: 'SOA', usage: 50, maturity: 'Intermediate' },
        { pattern: 'Event-Driven', usage: 20, maturity: 'Basic' },
        { pattern: 'API Gateway', usage: 30, maturity: 'Basic' }
      ],
      analysis: {
        architectureAnalysis: 'Legacy financial architecture with mainframe core creating bottlenecks. High coupling and monolithic patterns dominate. Regulatory compliance adds architectural constraints.',
        dependencyAnalysis: 'Critical dependency on mainframe creates single point of failure. ESB layer provides some abstraction but adds latency. Batch processing creates data consistency challenges.',
        modernizationAnalysis: 'Requires careful strangler fig pattern to modernize without disrupting core banking operations. API-first approach needed for new services.',
        recommendationsAnalysis: 'Phased approach: 1) API gateway for external services, 2) Event sourcing for audit trails, 3) Microservices for new features, 4) Gradual mainframe decoupling.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      applications: [
        { name: 'Order Management', technology: 'Spring Boot', complexity: 'Low', dependencies: 5, issues: 1 },
        { name: 'User Service', technology: 'Go', complexity: 'Low', dependencies: 3, issues: 0 },
        { name: 'Notification Service', technology: 'Node.js', complexity: 'Low', dependencies: 4, issues: 2 },
        { name: 'Analytics Engine', technology: 'Python/FastAPI', complexity: 'Medium', dependencies: 7, issues: 1 }
      ],
      dependencies: [
        { from: 'Order Management', to: 'User Service', type: 'gRPC', strength: 'Medium' },
        { from: 'Order Management', to: 'Notification Service', type: 'Event Bus', strength: 'Low' },
        { from: 'Analytics Engine', to: 'Order Management', type: 'Kafka', strength: 'Medium' }
      ],
      patterns: [
        { pattern: 'Microservices', usage: 95, maturity: 'Advanced' },
        { pattern: 'Event-Driven', usage: 85, maturity: 'Advanced' },
        { pattern: 'API Gateway', usage: 90, maturity: 'Advanced' },
        { pattern: 'CQRS', usage: 60, maturity: 'Intermediate' }
      ],
      analysis: {
        architectureAnalysis: 'Modern cloud-native architecture with excellent microservices implementation. Low coupling, high cohesion achieved. Event-driven patterns well adopted.',
        dependencyAnalysis: 'Minimal dependencies with proper async communication. gRPC for synchronous calls and event bus for async operations. Good separation of concerns.',
        modernizationAnalysis: 'Already cloud-ready with containerized services and cloud-native patterns. Focus on optimization and observability enhancements.',
        recommendationsAnalysis: 'Optimization focus: 1) Service mesh implementation, 2) Advanced monitoring and tracing, 3) Chaos engineering, 4) Multi-region deployment strategy.'
      }
    };
  }
};

const generatePortfolioData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      applications: [
        { name: 'E-commerce Frontend', criticality: 'High', cloudReadiness: 85, complexity: 'Medium', lastUpdated: '2024-01-10' },
        { name: 'Payment Processing', criticality: 'Critical', cloudReadiness: 72, complexity: 'High', lastUpdated: '2024-01-08' },
        { name: 'Inventory Management', criticality: 'High', cloudReadiness: 90, complexity: 'Low', lastUpdated: '2024-01-12' },
        { name: 'Order Management', criticality: 'High', cloudReadiness: 78, complexity: 'Medium', lastUpdated: '2024-01-09' },
        { name: 'Customer Service Portal', criticality: 'Medium', cloudReadiness: 65, complexity: 'Medium', lastUpdated: '2024-01-07' }
      ],
      metrics: {
        totalApplications: 5,
        cloudReadyApps: 3,
        criticalApps: 4,
        averageComplexity: 2.2,
        totalTechnicalDebt: 85000
      },
      trends: [
        { month: 'Oct', readiness: 65, issues: 28 },
        { month: 'Nov', readiness: 72, issues: 23 },
        { month: 'Dec', readiness: 78, issues: 19 },
        { month: 'Jan', readiness: 82, issues: 15 }
      ],
      analysis: {
        portfolioAnalysis: 'E-commerce portfolio shows strong cloud readiness with 60% of applications ready for migration. Payment processing system requires additional security hardening.',
        riskAnalysis: 'Medium risk profile with manageable technical debt. Critical applications have good architecture but need performance optimization.',
        modernizationAnalysis: 'Recommend cloud-first approach for new features and gradual migration of existing services starting with inventory management.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      applications: [
        { name: 'Core Banking Platform', criticality: 'Critical', cloudReadiness: 25, complexity: 'Very High', lastUpdated: '2024-01-15' },
        { name: 'Online Banking', criticality: 'Critical', cloudReadiness: 45, complexity: 'High', lastUpdated: '2024-01-14' },
        { name: 'Mobile Banking App', criticality: 'High', cloudReadiness: 70, complexity: 'Medium', lastUpdated: '2024-01-13' },
        { name: 'Risk Management', criticality: 'Critical', cloudReadiness: 35, complexity: 'Very High', lastUpdated: '2024-01-12' },
        { name: 'Customer Portal', criticality: 'Medium', cloudReadiness: 60, complexity: 'Medium', lastUpdated: '2024-01-11' },
        { name: 'Fraud Detection', criticality: 'Critical', cloudReadiness: 40, complexity: 'High', lastUpdated: '2024-01-10' },
        { name: 'Loan Processing', criticality: 'High', cloudReadiness: 50, complexity: 'High', lastUpdated: '2024-01-09' }
      ],
      metrics: {
        totalApplications: 7,
        cloudReadyApps: 1,
        criticalApps: 5,
        averageComplexity: 3.8,
        totalTechnicalDebt: 285000
      },
      trends: [
        { month: 'Oct', readiness: 38, issues: 52 },
        { month: 'Nov', readiness: 42, issues: 48 },
        { month: 'Dec', readiness: 45, issues: 44 },
        { month: 'Jan', readiness: 47, issues: 41 }
      ],
      analysis: {
        portfolioAnalysis: 'Financial services portfolio requires extensive modernization. Core banking system on mainframe creates significant migration challenges. High regulatory compliance requirements.',
        riskAnalysis: 'Very high risk due to legacy systems and regulatory constraints. Technical debt of $285K needs immediate attention. Critical applications have complex interdependencies.',
        modernizationAnalysis: 'Phased approach required: Start with peripheral systems, establish cloud security controls, then gradually modernize core systems with hybrid cloud strategy.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      applications: [
        { name: 'User Management Service', criticality: 'High', cloudReadiness: 95, complexity: 'Low', lastUpdated: '2024-01-15' },
        { name: 'Order Processing', criticality: 'High', cloudReadiness: 92, complexity: 'Low', lastUpdated: '2024-01-14' },
        { name: 'Payment Gateway', criticality: 'Critical', cloudReadiness: 88, complexity: 'Medium', lastUpdated: '2024-01-13' },
        { name: 'Inventory Service', criticality: 'Medium', cloudReadiness: 94, complexity: 'Low', lastUpdated: '2024-01-12' },
        { name: 'Notification Hub', criticality: 'Low', cloudReadiness: 96, complexity: 'Low', lastUpdated: '2024-01-11' },
        { name: 'Analytics Platform', criticality: 'Medium', cloudReadiness: 85, complexity: 'Medium', lastUpdated: '2024-01-10' }
      ],
      metrics: {
        totalApplications: 6,
        cloudReadyApps: 6,
        criticalApps: 3,
        averageComplexity: 1.3,
        totalTechnicalDebt: 12000
      },
      trends: [
        { month: 'Oct', readiness: 88, issues: 8 },
        { month: 'Nov', readiness: 90, issues: 6 },
        { month: 'Dec', readiness: 92, issues: 5 },
        { month: 'Jan', readiness: 95, issues: 3 }
      ],
      analysis: {
        portfolioAnalysis: 'Excellent cloud-ready portfolio with modern microservices architecture. All applications containerized and following cloud-native patterns. Very low technical debt.',
        riskAnalysis: 'Low risk profile with well-architected applications. Payment gateway needs minor security enhancements but overall architecture is solid.',
        modernizationAnalysis: 'Portfolio already modernized and cloud-native. Focus on optimization, observability, and multi-cloud deployment strategies for resilience.'
      }
    };
  }
};

const generateRecommendationsData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      strategicRecommendations: [
        { 
          id: 'ecom-str-1',
          title: 'Cloud-Native Architecture Migration', 
          description: 'Migrate core e-commerce platform from monolithic architecture to cloud-native microservices for improved scalability, reliability, and development velocity.',
          impact: 'High', 
          effort: 'High', 
          priority: 'Critical',
          category: 'Strategic',
          timeline: '12-18 months',
          investment: '$450,000',
          estimatedROI: '280%',
          benefits: [
            'Improved system scalability and performance',
            'Reduced operational costs by 35%',
            'Faster time-to-market for new features',
            'Enhanced disaster recovery capabilities',
            'Better resource utilization and cost control'
          ],
          risks: [
            'Complex migration requiring careful planning',
            'Temporary performance impact during transition',
            'Need for team upskilling on cloud technologies',
            'Integration challenges with existing systems'
          ]
        },
        { 
          id: 'ecom-str-2',
          title: 'Advanced Security Implementation', 
          description: 'Implement comprehensive security framework including zero-trust architecture, advanced threat detection, and automated compliance monitoring.',
          impact: 'Critical', 
          effort: 'High', 
          priority: 'Critical',
          category: 'Security',
          timeline: '6-9 months',
          investment: '$280,000',
          estimatedROI: '195%',
          benefits: [
            'Reduced security incidents by 85%',
            'Automated compliance reporting',
            'Enhanced customer trust and brand protection',
            'Proactive threat detection and response',
            'Reduced manual security monitoring effort'
          ],
          risks: [
            'Initial performance overhead from security controls',
            'User experience changes requiring training',
            'Integration complexity with existing systems',
            'Potential false positives requiring tuning'
          ]
        },
        { 
          id: 'ecom-str-3',
          title: 'Modern CI/CD Pipeline', 
          description: 'Establish enterprise-grade CI/CD pipeline with automated testing, security scanning, and deployment orchestration for faster, safer releases.',
          impact: 'High', 
          effort: 'Medium', 
          priority: 'High',
          category: 'Infrastructure',
          timeline: '4-6 months',
          investment: '$150,000',
          estimatedROI: '240%',
          benefits: [
            'Deployment frequency increased by 500%',
            'Lead time reduced from weeks to hours',
            'Deployment failure rate reduced by 90%',
            'Automated quality gates and compliance checks',
            'Improved developer productivity and satisfaction'
          ],
          risks: [
            'Initial learning curve for development teams',
            'Potential pipeline complexity requiring maintenance',
            'Dependency on third-party tools and services',
            'Need for cultural shift in deployment practices'
          ]
        }
      ],
      tacticalRecommendations: [
        { 
          id: 'ecom-tac-1',
          title: 'Database Performance Optimization', 
          description: 'Optimize database queries, implement intelligent caching, and establish read replicas for improved application performance.',
          impact: 'High', 
          effort: 'Medium', 
          priority: 'High',
          category: 'Performance',
          timeline: '3-4 months',
          investment: '$85,000',
          estimatedROI: '180%',
          benefits: [
            'Application response time improved by 60%',
            'Database query optimization reducing server load',
            'Better user experience during peak traffic',
            'Reduced infrastructure costs through efficiency'
          ],
          risks: [
            'Temporary performance impact during optimization',
            'Potential data consistency challenges with caching',
            'Need for careful testing of query changes'
          ]
        },
        { 
          id: 'ecom-tac-2',
          title: 'API Gateway Implementation', 
          description: 'Deploy enterprise API gateway for centralized API management, security, and monitoring across all services.',
          impact: 'Medium', 
          effort: 'Medium', 
          priority: 'Medium',
          category: 'Architecture',
          timeline: '2-3 months',
          investment: '$65,000',
          estimatedROI: '150%',
          benefits: [
            'Centralized API security and rate limiting',
            'Improved API monitoring and analytics',
            'Simplified API versioning and management',
            'Better integration with third-party services'
          ],
          risks: [
            'Single point of failure requiring high availability',
            'Additional latency from gateway processing',
            'Integration complexity with existing APIs'
          ]
        }
      ],
      quickWins: [
        { 
          id: 'ecom-qw-1',
          title: 'Enable Application Monitoring', 
          description: 'Implement comprehensive application performance monitoring with real-time alerting and dashboards.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Medium',
          category: 'Operations',
          timeline: '2-3 weeks',
          investment: '$15,000',
          estimatedROI: '300%',
          benefits: [
            'Proactive issue detection and resolution',
            'Improved mean time to recovery (MTTR)',
            'Better visibility into application performance',
            'Data-driven optimization decisions'
          ],
          risks: [
            'Alert fatigue if not properly configured',
            'Initial overhead in dashboard setup'
          ]
        },
        { 
          id: 'ecom-qw-2',
          title: 'Implement CDN for Static Assets', 
          description: 'Deploy Content Delivery Network to improve page load times and reduce server load for static content.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Low',
          category: 'Performance',
          timeline: '1-2 weeks',
          investment: '$8,000',
          estimatedROI: '250%',
          benefits: [
            'Page load time reduction of 40%',
            'Reduced bandwidth costs',
            'Improved global user experience',
            'Decreased server load during traffic spikes'
          ],
          risks: [
            'Cache invalidation complexity',
            'Additional service dependency'
          ]
        },
        { 
          id: 'ecom-qw-3',
          title: 'Automated Backup Verification', 
          description: 'Implement automated testing of backup integrity and recovery procedures to ensure data protection.',
          impact: 'High', 
          effort: 'Low', 
          priority: 'High',
          category: 'Security',
          timeline: '1 week',
          investment: '$5,000',
          estimatedROI: '500%',
          benefits: [
            'Guaranteed backup reliability',
            'Reduced recovery time objectives (RTO)',
            'Compliance with data protection requirements',
            'Peace of mind for disaster recovery'
          ],
          risks: [
            'Resource consumption during backup testing',
            'Potential false alarms requiring investigation'
          ]
        }
      ],
      businessCase: {
        totalInvestment: 180000,
        projectedSavings: 155000,
        roi: 86,
        paybackPeriod: '18 months',
        riskReduction: 'Medium'
      },
      analysis: {
        executiveSummary: 'E-commerce platform modernization will improve customer experience and reduce operational costs. Focus on performance optimization and user interface updates.',
        keyFindings: 'Payment processing bottlenecks and outdated customer portal are primary concerns. Cloud scalability will handle seasonal traffic variations.',
        recommendations: 'Prioritize performance improvements for immediate impact, then modernize customer-facing components for long-term competitive advantage.'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      strategicRecommendations: [
        { 
          id: 'fin-str-1',
          title: 'Modern Authentication & Identity Management', 
          description: 'Replace legacy authentication systems with enterprise-grade identity management including MFA, OAuth 2.0, and SAML for regulatory compliance and enhanced security.',
          impact: 'Critical', 
          effort: 'High', 
          priority: 'Critical',
          category: 'Security',
          timeline: '8-12 months',
          investment: '$380,000',
          estimatedROI: '165%',
          benefits: [
            'Regulatory compliance with modern banking standards',
            'Reduced security incidents by 75%',
            'Improved user experience with SSO',
            'Centralized access control and audit trails',
            'Support for mobile and API authentication'
          ],
          risks: [
            'Complex integration with legacy mainframe systems',
            'User training required for new authentication methods',
            'Potential service disruption during migration',
            'Regulatory approval process for changes'
          ]
        },
        { 
          id: 'fin-str-2',
          title: 'Mainframe Modernization Strategy', 
          description: 'Implement phased approach to modernize core banking systems while maintaining regulatory compliance and operational stability.',
          impact: 'High', 
          effort: 'High', 
          priority: 'High',
          category: 'Strategic',
          timeline: '18-24 months',
          investment: '$1,200,000',
          estimatedROI: '145%',
          benefits: [
            'Reduced mainframe operational costs by 45%',
            'Improved system flexibility and agility',
            'Enhanced disaster recovery capabilities',
            'Better integration with modern systems',
            'Reduced dependency on specialized COBOL skills'
          ],
          risks: [
            'High complexity requiring extensive testing',
            'Regulatory scrutiny and approval requirements',
            'Risk of service disruption to critical operations',
            'Significant resource investment required'
          ]
        },
        { 
          id: 'fin-str-3',
          title: 'Comprehensive Fraud Detection System', 
          description: 'Deploy AI-powered fraud detection with real-time transaction monitoring and automated response capabilities.',
          impact: 'Critical', 
          effort: 'Medium', 
          priority: 'Critical',
          category: 'Security',
          timeline: '6-8 months',
          investment: '$320,000',
          estimatedROI: '280%',
          benefits: [
            'Fraud detection accuracy improved by 85%',
            'Reduced false positives by 60%',
            'Real-time transaction monitoring and blocking',
            'Automated compliance reporting',
            'Enhanced customer protection and trust'
          ],
          risks: [
            'Model training requiring historical fraud data',
            'Potential for false positives impacting customers',
            'Integration complexity with existing systems',
            'Ongoing model maintenance and tuning required'
          ]
        }
      ],
      tacticalRecommendations: [
        { 
          id: 'fin-tac-1',
          title: 'API Gateway for Legacy Integration', 
          description: 'Implement secure API gateway to create modern interface layer for mainframe systems and enable gradual modernization.',
          impact: 'High', 
          effort: 'Medium', 
          priority: 'High',
          category: 'Architecture',
          timeline: '4-5 months',
          investment: '$180,000',
          estimatedROI: '190%',
          benefits: [
            'Reduced direct mainframe access by 70%',
            'Improved API security and rate limiting',
            'Enhanced monitoring and analytics',
            'Simplified integration for new applications',
            'Better scalability for peak transaction periods'
          ],
          risks: [
            'Additional latency from gateway processing',
            'Single point of failure requiring redundancy',
            'Complex mapping of legacy data formats'
          ]
        },
        { 
          id: 'fin-tac-2',
          title: 'Enhanced Regulatory Reporting', 
          description: 'Automate regulatory reporting processes with real-time data collection and compliance validation.',
          impact: 'High', 
          effort: 'Medium', 
          priority: 'High',
          category: 'Compliance',
          timeline: '3-4 months',
          investment: '$150,000',
          estimatedROI: '220%',
          benefits: [
            'Automated generation of regulatory reports',
            'Reduced compliance processing time by 80%',
            'Improved accuracy and consistency',
            'Real-time compliance monitoring',
            'Reduced manual effort and errors'
          ],
          risks: [
            'Regulatory changes requiring system updates',
            'Data quality issues affecting report accuracy',
            'Integration challenges with multiple data sources'
          ]
        }
      ],
      quickWins: [
        { 
          id: 'fin-qw-1',
          title: 'Advanced Security Monitoring', 
          description: 'Deploy comprehensive security monitoring with SIEM integration for real-time threat detection.',
          impact: 'High', 
          effort: 'Low', 
          priority: 'High',
          category: 'Security',
          timeline: '3-4 weeks',
          investment: '$35,000',
          estimatedROI: '400%',
          benefits: [
            'Real-time security threat detection',
            'Automated incident response workflows',
            'Compliance audit trail generation',
            'Reduced mean time to threat detection'
          ],
          risks: [
            'Alert fatigue from excessive notifications',
            'Initial tuning period for rule optimization'
          ]
        },
        { 
          id: 'fin-qw-2',
          title: 'Database Query Optimization', 
          description: 'Optimize critical database queries to improve transaction processing performance during peak hours.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Medium',
          category: 'Performance',
          timeline: '2-3 weeks',
          investment: '$25,000',
          estimatedROI: '320%',
          benefits: [
            'Transaction processing speed improved by 40%',
            'Reduced database server load',
            'Better customer experience during peak times',
            'Lower infrastructure costs through efficiency'
          ],
          risks: [
            'Temporary performance impact during optimization',
            'Need for thorough testing in production-like environment'
          ]
        },
        { 
          id: 'fin-qw-3',
          title: 'Automated Backup Testing', 
          description: 'Implement automated testing of backup and recovery procedures to ensure data protection and regulatory compliance.',
          impact: 'High', 
          effort: 'Low', 
          priority: 'High',
          category: 'Operations',
          timeline: '1-2 weeks',
          investment: '$15,000',
          estimatedROI: '500%',
          benefits: [
            'Guaranteed backup reliability and compliance',
            'Reduced recovery time objectives (RTO)',
            'Automated compliance documentation',
            'Peace of mind for regulatory audits'
          ],
          risks: [
            'Resource consumption during backup testing',
            'Need for careful scheduling to avoid business impact'
          ]
        }
      ],
      businessCase: {
        totalInvestment: 450000,
        projectedSavings: 295000,
        roi: 65,
        paybackPeriod: '24 months',
        riskReduction: 'High'
      },
      analysis: {
        executiveSummary: 'Critical security and compliance gaps require immediate attention. Modernization strategy must balance innovation with regulatory requirements and operational stability.',
        keyFindings: 'Legacy authentication systems pose regulatory risk. Mainframe dependency limits agility. Insufficient monitoring creates compliance blind spots.',
        recommendations: 'Phase modernization with security first, then architectural improvements. Maintain hybrid approach to minimize disruption to core banking operations.'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      strategicRecommendations: [
        { 
          id: 'cloud-str-1',
          title: 'Multi-Region High Availability Architecture', 
          description: 'Implement multi-region deployment strategy with automated failover and disaster recovery capabilities for global scale and resilience.',
          impact: 'High', 
          effort: 'High', 
          priority: 'High',
          category: 'Strategic',
          timeline: '6-9 months',
          investment: '$320,000',
          estimatedROI: '185%',
          benefits: [
            '99.99% uptime with automated failover',
            'Global performance optimization',
            'Comprehensive disaster recovery capabilities',
            'Reduced latency for international users',
            'Enhanced business continuity assurance'
          ],
          risks: [
            'Increased complexity in deployment and management',
            'Higher operational costs for multi-region setup',
            'Data consistency challenges across regions',
            'Network latency considerations for synchronization'
          ]
        },
        { 
          id: 'cloud-str-2',
          title: 'Advanced Service Mesh Implementation', 
          description: 'Deploy comprehensive service mesh architecture with Istio for advanced traffic management, security policies, and observability.',
          impact: 'Medium', 
          effort: 'Medium', 
          priority: 'Medium',
          category: 'Infrastructure',
          timeline: '4-6 months',
          investment: '$180,000',
          estimatedROI: '155%',
          benefits: [
            'Centralized traffic management and routing',
            'Enhanced security with mutual TLS',
            'Improved observability and monitoring',
            'Simplified canary deployments',
            'Better microservices governance'
          ],
          risks: [
            'Additional complexity in service configuration',
            'Performance overhead from proxy layers',
            'Learning curve for development teams',
            'Potential debugging challenges'
          ]
        },
        { 
          id: 'cloud-str-3',
          title: 'AI-Powered Optimization Platform', 
          description: 'Implement AI-driven resource optimization and predictive scaling for cost efficiency and performance optimization.',
          impact: 'Medium', 
          effort: 'Medium', 
          priority: 'Medium',
          category: 'Strategic',
          timeline: '5-7 months',
          investment: '$240,000',
          estimatedROI: '210%',
          benefits: [
            'Automated resource optimization reducing costs by 30%',
            'Predictive scaling based on usage patterns',
            'Intelligent workload placement',
            'Proactive performance issue detection',
            'Cost optimization recommendations'
          ],
          risks: [
            'Model accuracy dependent on historical data',
            'Initial tuning period for optimization algorithms',
            'Integration complexity with existing monitoring',
            'Potential over-optimization affecting performance'
          ]
        }
      ],
      tacticalRecommendations: [
        { 
          id: 'cloud-tac-1',
          title: 'Enhanced Observability Stack', 
          description: 'Implement comprehensive observability with distributed tracing, advanced metrics, and intelligent alerting for proactive issue resolution.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Medium',
          category: 'Operations',
          timeline: '2-3 months',
          investment: '$85,000',
          estimatedROI: '180%',
          benefits: [
            'Complete visibility into distributed systems',
            'Faster root cause analysis and resolution',
            'Proactive performance issue detection',
            'Improved system reliability metrics',
            'Better capacity planning insights'
          ],
          risks: [
            'Data volume management for tracing',
            'Potential performance impact from instrumentation',
            'Tool complexity requiring training'
          ]
        },
        { 
          id: 'cloud-tac-2',
          title: 'Chaos Engineering Implementation', 
          description: 'Establish chaos engineering practices to test system resilience and identify failure modes proactively.',
          impact: 'Medium', 
          effort: 'Medium', 
          priority: 'Low',
          category: 'Reliability',
          timeline: '3-4 months',
          investment: '$95,000',
          estimatedROI: '165%',
          benefits: [
            'Improved system resilience and reliability',
            'Proactive identification of failure modes',
            'Enhanced confidence in system behavior',
            'Better incident response preparedness',
            'Reduced mean time to recovery (MTTR)'
          ],
          risks: [
            'Potential service disruption during testing',
            'Need for careful test planning and execution',
            'Cultural resistance to intentional failure introduction'
          ]
        }
      ],
      quickWins: [
        { 
          id: 'cloud-qw-1',
          title: 'Cost Optimization Dashboard', 
          description: 'Implement real-time cost monitoring and optimization dashboard with automated recommendations.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Medium',
          category: 'Cost',
          timeline: '2-3 weeks',
          investment: '$18,000',
          estimatedROI: '350%',
          benefits: [
            'Real-time visibility into cloud spending',
            'Automated cost optimization recommendations',
            'Resource rightsizing suggestions',
            'Budget alerts and forecasting'
          ],
          risks: [
            'Data accuracy dependent on proper tagging',
            'Initial setup complexity for cost allocation'
          ]
        },
        { 
          id: 'cloud-qw-2',
          title: 'Automated Security Scanning', 
          description: 'Implement automated security scanning in CI/CD pipeline for container images and infrastructure code.',
          impact: 'High', 
          effort: 'Low', 
          priority: 'High',
          category: 'Security',
          timeline: '1-2 weeks',
          investment: '$12,000',
          estimatedROI: '400%',
          benefits: [
            'Automated vulnerability detection',
            'Security compliance validation',
            'Prevention of security issues in production',
            'Reduced manual security review effort'
          ],
          risks: [
            'Potential false positives requiring review',
            'Integration complexity with existing pipeline'
          ]
        },
        { 
          id: 'cloud-qw-3',
          title: 'Performance Baseline Establishment', 
          description: 'Establish comprehensive performance baselines and SLI/SLO definitions for all critical services.',
          impact: 'Medium', 
          effort: 'Low', 
          priority: 'Medium',
          category: 'Performance',
          timeline: '1-2 weeks',
          investment: '$8,000',
          estimatedROI: '300%',
          benefits: [
            'Clear performance expectations and targets',
            'Improved performance regression detection',
            'Better capacity planning foundation',
            'Enhanced service reliability tracking'
          ],
          risks: [
            'Initial effort to define appropriate SLIs/SLOs',
            'Need for ongoing baseline maintenance'
          ]
        }
      ],
      businessCase: {
        totalInvestment: 85000,
        projectedSavings: 120000,
        roi: 141,
        paybackPeriod: '12 months',
        riskReduction: 'Low'
      },
      analysis: {
        executiveSummary: 'Cloud-native architecture is mature and well-implemented. Focus on optimization and resilience enhancements to maximize cloud investment.',
        keyFindings: 'Excellent microservices implementation with low technical debt. Opportunities exist in observability and multi-region resilience.',
        recommendations: 'Build on strong foundation with service mesh and multi-region capabilities. Implement chaos engineering for resilience testing.'
      }
    };
  }
};

const generateBusinessContextData = (assessmentId, assessment) => {
  // E-Commerce Platform (Assessment 1)
  if (assessmentId === 1) {
    return {
      businessDrivers: [
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
          description: 'Set up cloud infrastructure and development environments',
          startDate: '2025-03-01',
          duration: '8 weeks',
          dependencies: 'Architecture approval, cloud account setup',
          deliverables: 'Production and staging environments, CI/CD pipelines',
          status: 'Planned'
        },
        {
          id: 3,
          phase: 'Application Migration',
          description: 'Migrate applications and data to cloud infrastructure',
          startDate: '2025-04-26',
          duration: '12 weeks',
          dependencies: 'Infrastructure completion, testing strategy',
          deliverables: 'Migrated applications, performance validation, security testing',
          status: 'Planned'
        }
      ],
      businessCase: {
        totalInvestment: 850000,
        projectedSavings: 2400000,
        roi: 285,
        paybackPeriod: '14 months',
        timeToValue: '18 months'
      }
    };
  }
  // Financial Services Security (Assessment 2)
  else if (assessmentId === 2) {
    return {
      businessDrivers: [
        {
          id: 1,
          name: 'Regulatory Compliance',
          description: 'Meet evolving financial regulations and security standards',
          priority: 'Critical',
          impact: 95,
          urgency: 90,
          businessValue: 'Avoid regulatory penalties and maintain license'
        },
        {
          id: 2,
          name: 'Risk Mitigation',
          description: 'Reduce cybersecurity risks and potential data breaches',
          priority: 'Critical',
          impact: 90,
          urgency: 85,
          businessValue: 'Protect customer data and company reputation'
        },
        {
          id: 3,
          name: 'Operational Efficiency',
          description: 'Modernize legacy systems for improved efficiency',
          priority: 'High',
          impact: 80,
          urgency: 65,
          businessValue: 'Reduced operational costs and faster processing'
        }
      ],
      stakeholderGroups: [
        {
          id: 1,
          name: 'Risk Management',
          members: ['CRO', 'Compliance Officer', 'Security Team'],
          role: 'Risk Oversight',
          influence: 'High',
          interest: 'High',
          notes: 'Primary drivers of security initiative'
        },
        {
          id: 2,
          name: 'IT Operations',
          members: ['CTO', 'IT Director', 'Security Engineers'],
          role: 'Technical Implementation',
          influence: 'High',
          interest: 'High',
          notes: 'Responsible for technical execution'
        }
      ],
      projectTimeline: [
        {
          id: 1,
          phase: 'Security Assessment',
          description: 'Comprehensive security audit and vulnerability assessment',
          startDate: '2025-02-01',
          duration: '4 weeks',
          status: 'Planned'
        },
        {
          id: 2,
          phase: 'Compliance Implementation',
          description: 'Implement security controls and compliance measures',
          startDate: '2025-03-01',
          duration: '16 weeks',
          status: 'Planned'
        }
      ],
      businessCase: {
        totalInvestment: 450000,
        projectedSavings: 1200000,
        roi: 267,
        paybackPeriod: '16 months'
      }
    };
  }
  // Cloud Migration Readiness (Assessment 3)
  else {
    return {
      businessDrivers: [
        {
          id: 1,
          name: 'Cloud Transformation',
          description: 'Complete migration to cloud-native architecture',
          priority: 'High',
          impact: 85,
          urgency: 75,
          businessValue: 'Scalability and cost optimization'
        },
        {
          id: 2,
          name: 'Innovation Acceleration',
          description: 'Enable faster deployment and innovation cycles',
          priority: 'High',
          impact: 80,
          urgency: 70,
          businessValue: 'Competitive advantage through faster time-to-market'
        }
      ],
      stakeholderGroups: [
        {
          id: 1,
          name: 'Cloud Center of Excellence',
          members: ['Cloud Architect', 'DevOps Engineers', 'Platform Team'],
          role: 'Technical Leadership',
          influence: 'High',
          interest: 'High',
          notes: 'Driving cloud adoption strategy'
        }
      ],
      projectTimeline: [
        {
          id: 1,
          phase: 'Cloud Optimization',
          description: 'Optimize existing cloud infrastructure and processes',
          startDate: '2025-01-15',
          duration: '12 weeks',
          status: 'Planned'
        }
      ],
      businessCase: {
        totalInvestment: 300000,
        projectedSavings: 800000,
        roi: 267,
        paybackPeriod: '11 months'
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