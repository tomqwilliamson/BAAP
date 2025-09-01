-- Supplemental Seed Data for Azure Database
-- This script adds the timeline, risk, and architecture data that was added after initial Azure seeding

-- Timeline Items (25 items total)
INSERT INTO ProjectTimelineItems (Phase, Description, StartDate, EndDate, Progress, Status, Dependencies, Owner, Notes, CreatedDate, LastModifiedDate, AssessmentId) VALUES
-- Assessment 1: E-Commerce Platform Assessment
('Discovery & Planning', 'Requirements gathering and technical discovery', '2025-09-15', '2025-10-15', 90, 'In Progress', 'Stakeholder interviews', 'Jennifer Chen', 'Customer experience focus', GETDATE(), GETDATE(), 4),
('Infrastructure Setup', 'Prepare cloud infrastructure and CI/CD pipelines', '2025-10-01', '2025-11-15', 60, 'In Progress', 'Discovery completion', 'Marcus Rodriguez', 'Azure App Service migration', GETDATE(), GETDATE(), 4),
('Core Platform Migration', 'Migrate React frontend and payment services', '2025-11-01', '2025-12-31', 30, 'Planned', 'Infrastructure setup', 'Sarah Kim', 'Customer-facing priority', GETDATE(), GETDATE(), 4),
('Testing & Optimization', 'Performance testing and Black Friday prep', '2025-12-15', '2026-01-31', 10, 'Planned', 'Core migration', 'David Park', 'Peak season readiness', GETDATE(), GETDATE(), 4),
('Go-Live & Monitoring', 'Production deployment and monitoring setup', '2026-01-15', '2026-02-28', 0, 'Planned', 'Testing completion', 'Jennifer Chen', 'Business continuity focus', GETDATE(), GETDATE(), 4),

-- Assessment 2: Financial Services Legacy Modernization
('Regulatory Compliance Review', 'Review current compliance gaps and requirements', '2025-09-01', '2025-10-31', 80, 'In Progress', 'None', 'Lisa Thompson', 'Critical for banking license', GETDATE(), GETDATE(), 5),
('COBOL System Analysis', 'Deep dive into legacy COBOL codebase', '2025-10-15', '2025-12-15', 40, 'In Progress', 'Compliance review', 'Robert Martinez', '850K lines to analyze', GETDATE(), GETDATE(), 5),
('API Gateway Implementation', 'Create secure API layer for legacy access', '2025-11-01', '2026-01-15', 20, 'Planned', 'System analysis', 'Michael Brown', 'Enables mobile banking', GETDATE(), GETDATE(), 5),
('Core Banking Modernization', 'Replace critical COBOL modules with .NET Core', '2026-01-01', '2026-08-31', 5, 'Planned', 'API Gateway', 'Robert Martinez', 'Strangler fig pattern', GETDATE(), GETDATE(), 5),
('Digital Banking Launch', 'Launch modern digital banking services', '2026-07-01', '2026-12-31', 0, 'Planned', 'Core modernization', 'Lisa Thompson', 'Competitive advantage', GETDATE(), GETDATE(), 5),

-- Assessment 3: Enterprise Data Platform Modernization
('Data Migration Planning', 'Plan 15TB data warehouse migration strategy', '2025-01-15', '2025-02-28', 100, 'Completed', 'None', 'Dr. Amanda Foster', 'Azure Synapse target', GETDATE(), GETDATE(), 6),
('ETL Pipeline Migration', 'Migrate SSIS to Azure Data Factory', '2025-02-15', '2025-04-15', 100, 'Completed', 'Migration planning', 'James Wilson', 'Python/SQL hybrid', GETDATE(), GETDATE(), 6),
('Analytics Dashboard Upgrade', 'Power BI integration and self-service', '2025-04-01', '2025-06-30', 100, 'Completed', 'ETL migration', 'Karen Zhang', 'Finance team priority', GETDATE(), GETDATE(), 6),
('ML Pipeline Implementation', 'Deploy MLOps with Azure ML', '2025-05-15', '2025-08-31', 95, 'Completed', 'Dashboard upgrade', 'Dr. Amanda Foster', 'Predictive analytics', GETDATE(), GETDATE(), 6),
('Performance Optimization', 'Query optimization and cost management', '2025-07-01', '2025-09-30', 85, 'In Progress', 'ML pipeline', 'James Wilson', '40% cost reduction target', GETDATE(), GETDATE(), 6),

-- Assessment 4: Healthcare Integration Platform Assessment
('HIPAA Compliance Assessment', 'Comprehensive compliance and security review', '2025-08-01', '2025-09-30', 70, 'In Progress', 'None', 'Steven Davis', 'Patient data protection', GETDATE(), GETDATE(), 7),
('EHR Integration Planning', 'Plan HL7 FHIR integration strategy', '2025-09-15', '2025-11-15', 50, 'In Progress', 'HIPAA assessment', 'Dr. Emily Johnson', '500K patient records', GETDATE(), GETDATE(), 7),
('Patient Portal Enhancement', 'Improve patient self-service capabilities', '2025-11-01', '2026-01-31', 30, 'Planned', 'EHR planning', 'Maria Gonzalez', 'User experience focus', GETDATE(), GETDATE(), 7),
('Clinical Decision Support', 'AI-powered clinical assistance deployment', '2026-01-15', '2026-05-31', 10, 'Planned', 'Portal enhancement', 'Dr. Emily Johnson', 'Python/TensorFlow', GETDATE(), GETDATE(), 7),
('Go-Live & Training', 'System deployment and staff training', '2026-05-01', '2026-08-31', 0, 'Planned', 'Decision support', 'Steven Davis', 'Change management critical', GETDATE(), GETDATE(), 7),

-- Assessment 5: Smart Manufacturing IoT Assessment
('IoT Sensor Deployment', 'Install monitoring sensors across 12 facilities', '2025-07-01', '2025-09-30', 75, 'In Progress', 'None', 'Carlos Rodriguez', '500+ machines to monitor', GETDATE(), GETDATE(), 8),
('Data Pipeline Setup', 'Real-time data ingestion and processing', '2025-08-15', '2025-10-31', 60, 'In Progress', 'Sensor deployment', 'Lisa Wang', 'Azure IoT Hub integration', GETDATE(), GETDATE(), 8),
('Predictive Analytics Development', 'ML models for maintenance prediction', '2025-10-01', '2025-12-31', 40, 'Planned', 'Data pipeline', 'Carlos Rodriguez', 'Reduce 15% downtime', GETDATE(), GETDATE(), 8),
('Dashboard & Alerting', 'Operations dashboard and alert system', '2025-11-15', '2026-02-15', 25, 'Planned', 'Analytics development', 'Maria Santos', 'Real-time monitoring', GETDATE(), GETDATE(), 8),
('Pilot & Rollout', 'Pilot deployment and facility rollout', '2026-02-01', '2026-06-30', 0, 'Planned', 'Dashboard completion', 'Lisa Wang', 'Phased deployment strategy', GETDATE(), GETDATE(), 8);

-- Business Context Risks (14 items total)
INSERT INTO BusinessContextRisks (Name, Description, Category, Probability, Impact, RiskScore, Mitigation, Owner, Status, DueDate, CreatedDate, LastModifiedDate, AssessmentId) VALUES
-- Assessment 1: E-Commerce Platform Assessment (Azure Assessment ID 4)
('Black Friday Traffic Spike', 'System may not handle 10x traffic increase during peak season', 'Performance', 'Medium', 'High', 75, 'Load testing and auto-scaling configuration', 'Marcus Rodriguez', 'Active', '2025-11-01', GETDATE(), GETDATE(), 4),
('Payment Processing Downtime', 'Payment service interruption could cause revenue loss', 'Business', 'Low', 'Critical', 80, 'Redundant payment processors and circuit breakers', 'Jennifer Chen', 'Active', '2025-10-15', GETDATE(), GETDATE(), 4),
('Data Migration Corruption', 'Customer data corruption during migration', 'Technical', 'Low', 'Critical', 70, 'Comprehensive backup and rollback procedures', 'Sarah Kim', 'Mitigated', '2025-09-30', GETDATE(), GETDATE(), 4),

-- Assessment 2: Financial Services Legacy Modernization (Azure Assessment ID 5)
('Regulatory Non-Compliance', 'Failure to meet banking regulations could result in penalties', 'Compliance', 'Medium', 'Critical', 90, 'Regular compliance audits and regulatory liaison', 'Lisa Thompson', 'Active', '2025-12-31', GETDATE(), GETDATE(), 5),
('COBOL Expertise Shortage', 'Limited COBOL developers for legacy system maintenance', 'Resource', 'High', 'High', 85, 'Knowledge transfer documentation and external consultants', 'Robert Martinez', 'Active', '2025-11-30', GETDATE(), GETDATE(), 5),
('Data Integrity During Migration', 'Financial transaction data corruption during COBOL migration', 'Technical', 'Medium', 'Critical', 88, 'Extensive testing and parallel processing validation', 'Michael Brown', 'Active', '2026-06-30', GETDATE(), GETDATE(), 5),

-- Assessment 3: Enterprise Data Platform Modernization (Azure Assessment ID 6)
('Query Performance Degradation', 'Azure Synapse queries slower than on-premises SQL Server', 'Performance', 'Medium', 'Medium', 50, 'Query optimization and partitioning strategy', 'James Wilson', 'Resolved', '2025-05-31', GETDATE(), GETDATE(), 6),
('Cost Overrun', 'Cloud data processing costs exceed budget projections', 'Financial', 'Medium', 'Medium', 55, 'Cost monitoring and resource optimization', 'Dr. Amanda Foster', 'Monitoring', '2025-12-31', GETDATE(), GETDATE(), 6),

-- Assessment 4: Healthcare Integration Platform Assessment (Azure Assessment ID 7)
('HIPAA Violation', 'Patient data breach could result in severe penalties', 'Compliance', 'Low', 'Critical', 85, 'Zero-trust security model and encryption at rest/transit', 'Steven Davis', 'Active', '2026-03-31', GETDATE(), GETDATE(), 7),
('Clinical Workflow Disruption', 'System changes could disrupt patient care workflows', 'Operational', 'Medium', 'High', 70, 'Comprehensive staff training and phased rollout', 'Dr. Emily Johnson', 'Active', '2026-01-31', GETDATE(), GETDATE(), 7),
('Integration Complexity', 'HL7 FHIR integration more complex than anticipated', 'Technical', 'High', 'Medium', 65, 'Expert consultants and proof-of-concept validation', 'Maria Gonzalez', 'Active', '2025-11-30', GETDATE(), GETDATE(), 7),

-- Assessment 5: Smart Manufacturing IoT Assessment (Azure Assessment ID 8)
('Sensor Hardware Failure', 'IoT sensors in harsh manufacturing environment may fail frequently', 'Technical', 'Medium', 'Medium', 60, 'Redundant sensors and predictive maintenance for sensors', 'Carlos Rodriguez', 'Active', '2025-12-31', GETDATE(), GETDATE(), 8),
('Network Connectivity Issues', 'Manufacturing facilities have limited network infrastructure', 'Infrastructure', 'High', 'High', 80, 'Edge computing and offline-capable systems', 'Lisa Wang', 'Active', '2025-10-31', GETDATE(), GETDATE(), 8),
('Data Privacy Concerns', 'Manufacturing process data contains trade secrets', 'Security', 'Medium', 'High', 75, 'Data encryption and access control implementation', 'Maria Santos', 'Active', '2025-11-15', GETDATE(), GETDATE(), 8);

-- Architecture Review Data (3 assessments)
INSERT INTO ArchitectureReviews (
    AssessmentId, MaintainabilityScore, ComplexityScore, CouplingScore, CohesionScore, 
    TestCoverageScore, TechnicalDebtScore, CodeSmells, DuplicatedLines, Vulnerabilities, 
    Bugs, SecurityHotspots, RepositoryUrl, RepositoryType, RepositoryStatus, 
    LastCommitHash, LastCommitDate, ArchitectureAnalysis, HealthAnalysis, 
    PatternsAnalysis, TechnologyAnalysis, MaintainabilityAnalysis, RecommendationsAnalysis, 
    CreatedDate, LastUpdatedDate, LastUpdatedBy
) VALUES
-- Assessment 1: E-Commerce Platform Assessment (Azure Assessment ID 4)
(4, 78, 65, 70, 82, 68, 72, 125, 8.5, 12, 18, 7, 
'https://github.com/company/ecommerce-platform', 'Git', 'Active',
'a7f3c2d1e9b8f6a4c3d2e1f0', '2025-08-28T14:30:00',
'The e-commerce platform demonstrates a modern microservices architecture with React frontend and Node.js/Java backend services. The architecture follows cloud-native principles with containerization and API-first design. However, the legacy order management system creates architectural debt that needs addressing.',
'Overall code health is good with room for improvement. The React frontend shows strong component organization but has some coupling issues. Payment processing service demonstrates excellent security practices. The legacy .NET Framework order system significantly impacts overall maintainability scores.',
'Architecture patterns analysis reveals good use of microservices, API Gateway, and CQRS patterns. The frontend implements a component-based architecture with proper separation of concerns. However, there''s inconsistent error handling patterns across services and some anti-patterns in the legacy order management system.',
'Technology stack analysis shows a modern mix with React 18, Node.js 18, Java 17 Spring Boot, and Azure services. The legacy .NET Framework 4.8 order system is the primary technical risk. Container orchestration with Kubernetes provides good scalability. Database technology is appropriately distributed across services.',
'Maintainability is challenged by the monolithic order management system and inconsistent coding standards across teams. The React frontend has good maintainability with proper component structure. Microservices are well-designed but need better documentation and monitoring.',
'Priority recommendations: 1) Modernize order management system to microservices, 2) Implement consistent error handling patterns, 3) Increase test coverage especially in payment processing, 4) Establish code quality gates in CI/CD pipeline, 5) Improve API documentation and monitoring.',
GETDATE(), GETDATE(), 'System'),

-- Assessment 2: Financial Services Legacy Modernization (Azure Assessment ID 5)
(5, 42, 88, 92, 35, 25, 95, 387, 22.3, 45, 78, 23,
'https://internal-git.bank.com/core-banking', 'Git', 'Active',
'b8e4d3c2f1a9e7b5c6d4e2f1', '2025-08-15T09:15:00',
'The core banking system represents a classic monolithic COBOL architecture with decades of accumulated complexity. The system handles critical financial transactions but lacks modern architectural patterns. Recent additions of Java services create a hybrid architecture with integration challenges.',
'Code health metrics indicate significant technical debt accumulated over 30+ years. The COBOL codebase has extremely high complexity and coupling scores. Security vulnerabilities exist primarily in integration points between legacy and modern systems. The newer Java components show better health metrics.',
'Architecture patterns analysis reveals a monolithic mainframe architecture with limited separation of concerns. Recent Java services attempt to implement modern patterns but create integration anti-patterns with the COBOL core. Error handling is inconsistent between legacy and modern components.',
'Technology stack spans from COBOL/CICS mainframe to Java 11 Spring Boot microservices. Database technology includes both DB2 mainframe and PostgreSQL for modern services. This creates data consistency challenges and requires careful transaction management across platforms.',
'Maintainability is severely impacted by COBOL complexity and limited documentation. The aging codebase has few original developers remaining. Modern Java services are well-structured but tightly coupled to legacy systems through complex integration layers.',
'Critical recommendations: 1) Implement strangler fig pattern for gradual COBOL replacement, 2) Create comprehensive API abstraction layer, 3) Establish automated testing for critical transaction flows, 4) Document business rules embedded in COBOL, 5) Implement monitoring and alerting across hybrid architecture.',
GETDATE(), GETDATE(), 'System'),

-- Assessment 3: Enterprise Data Platform Modernization (Azure Assessment ID 6)
(6, 89, 58, 62, 88, 85, 45, 67, 3.2, 5, 8, 2,
'https://github.com/manufacturing/data-platform', 'Git', 'Active', 
'c9f5e4d3a2b8f7c6d5e3f2a1', '2025-08-20T11:45:00',
'The data platform demonstrates excellent modern architecture with cloud-native design principles. The migration to Azure Synapse Analytics has been well-executed with proper data lake integration. The MLOps pipeline follows best practices with automated model deployment and monitoring.',
'Code health is excellent across the data platform. Python ETL code is well-structured with proper error handling. SQL queries are optimized for parallel processing. The Power BI integration demonstrates clean separation between data processing and presentation layers.',
'Architecture patterns show excellent implementation of data mesh principles with domain-specific data products. The ETL pipeline implements proper batch and streaming patterns. ML pipeline follows MLOps best practices with versioned models and automated testing.',
'Technology stack is modern and well-integrated: Azure Synapse Analytics, Azure Data Factory, Azure ML, Power BI, and Python/Spark. The technology choices align well with scalability and performance requirements. Proper use of Infrastructure as Code with ARM templates.',
'Maintainability is excellent with comprehensive documentation, automated testing, and monitoring. The Python codebase follows PEP 8 standards with proper logging and error handling. Data lineage tracking enables easy troubleshooting and impact analysis.',
'Enhancement recommendations: 1) Implement data governance framework with automated quality checks, 2) Expand real-time streaming capabilities, 3) Add cost optimization automation, 4) Implement advanced security with data classification, 5) Enhance self-service analytics capabilities.',
GETDATE(), GETDATE(), 'System');

PRINT 'Azure supplemental seed data applied successfully';
PRINT 'Added 25 timeline items, 14 risk items, and 3 architecture reviews';

-- Note: The Assessment IDs in Azure are different (4,5,6,7,8) vs local (1,2,3,4,5)
-- This script uses the correct Azure Assessment IDs