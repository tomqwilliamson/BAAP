-- Architecture Review Seed Data
-- Adding architecture reviews for the first few assessments

INSERT INTO ArchitectureReviews (
    AssessmentId, MaintainabilityScore, ComplexityScore, CouplingScore, CohesionScore, 
    TestCoverageScore, TechnicalDebtScore, CodeSmells, DuplicatedLines, Vulnerabilities, 
    Bugs, SecurityHotspots, RepositoryUrl, RepositoryType, RepositoryStatus, 
    LastCommitHash, LastCommitDate, ArchitectureAnalysis, HealthAnalysis, 
    PatternsAnalysis, TechnologyAnalysis, MaintainabilityAnalysis, RecommendationsAnalysis, 
    CreatedDate, LastUpdatedDate, LastUpdatedBy
) VALUES
-- Assessment 1: E-Commerce Platform Assessment
(1, 78, 65, 70, 82, 68, 72, 125, 8.5, 12, 18, 7, 
'https://github.com/company/ecommerce-platform', 'Git', 'Active',
'a7f3c2d1e9b8f6a4c3d2e1f0', '2025-08-28T14:30:00',
'The e-commerce platform demonstrates a modern microservices architecture with React frontend and Node.js/Java backend services. The architecture follows cloud-native principles with containerization and API-first design. However, the legacy order management system creates architectural debt that needs addressing.',
'Overall code health is good with room for improvement. The React frontend shows strong component organization but has some coupling issues. Payment processing service demonstrates excellent security practices. The legacy .NET Framework order system significantly impacts overall maintainability scores.',
'Architecture patterns analysis reveals good use of microservices, API Gateway, and CQRS patterns. The frontend implements a component-based architecture with proper separation of concerns. However, there''s inconsistent error handling patterns across services and some anti-patterns in the legacy order management system.',
'Technology stack analysis shows a modern mix with React 18, Node.js 18, Java 17 Spring Boot, and Azure services. The legacy .NET Framework 4.8 order system is the primary technical risk. Container orchestration with Kubernetes provides good scalability. Database technology is appropriately distributed across services.',
'Maintainability is challenged by the monolithic order management system and inconsistent coding standards across teams. The React frontend has good maintainability with proper component structure. Microservices are well-designed but need better documentation and monitoring.',
'Priority recommendations: 1) Modernize order management system to microservices, 2) Implement consistent error handling patterns, 3) Increase test coverage especially in payment processing, 4) Establish code quality gates in CI/CD pipeline, 5) Improve API documentation and monitoring.',
GETDATE(), GETDATE(), 'System'),

-- Assessment 2: Financial Services Legacy Modernization
(2, 42, 88, 92, 35, 25, 95, 387, 22.3, 45, 78, 23,
'https://internal-git.bank.com/core-banking', 'Git', 'Active',
'b8e4d3c2f1a9e7b5c6d4e2f1', '2025-08-15T09:15:00',
'The core banking system represents a classic monolithic COBOL architecture with decades of accumulated complexity. The system handles critical financial transactions but lacks modern architectural patterns. Recent additions of Java services create a hybrid architecture with integration challenges.',
'Code health metrics indicate significant technical debt accumulated over 30+ years. The COBOL codebase has extremely high complexity and coupling scores. Security vulnerabilities exist primarily in integration points between legacy and modern systems. The newer Java components show better health metrics.',
'Architecture patterns analysis reveals a monolithic mainframe architecture with limited separation of concerns. Recent Java services attempt to implement modern patterns but create integration anti-patterns with the COBOL core. Error handling is inconsistent between legacy and modern components.',
'Technology stack spans from COBOL/CICS mainframe to Java 11 Spring Boot microservices. Database technology includes both DB2 mainframe and PostgreSQL for modern services. This creates data consistency challenges and requires careful transaction management across platforms.',
'Maintainability is severely impacted by COBOL complexity and limited documentation. The aging codebase has few original developers remaining. Modern Java services are well-structured but tightly coupled to legacy systems through complex integration layers.',
'Critical recommendations: 1) Implement strangler fig pattern for gradual COBOL replacement, 2) Create comprehensive API abstraction layer, 3) Establish automated testing for critical transaction flows, 4) Document business rules embedded in COBOL, 5) Implement monitoring and alerting across hybrid architecture.',
GETDATE(), GETDATE(), 'System'),

-- Assessment 3: Enterprise Data Platform Modernization  
(3, 89, 58, 62, 88, 85, 45, 67, 3.2, 5, 8, 2,
'https://github.com/manufacturing/data-platform', 'Git', 'Active', 
'c9f5e4d3a2b8f7c6d5e3f2a1', '2025-08-20T11:45:00',
'The data platform demonstrates excellent modern architecture with cloud-native design principles. The migration to Azure Synapse Analytics has been well-executed with proper data lake integration. The MLOps pipeline follows best practices with automated model deployment and monitoring.',
'Code health is excellent across the data platform. Python ETL code is well-structured with proper error handling. SQL queries are optimized for parallel processing. The Power BI integration demonstrates clean separation between data processing and presentation layers.',
'Architecture patterns show excellent implementation of data mesh principles with domain-specific data products. The ETL pipeline implements proper batch and streaming patterns. ML pipeline follows MLOps best practices with versioned models and automated testing.',
'Technology stack is modern and well-integrated: Azure Synapse Analytics, Azure Data Factory, Azure ML, Power BI, and Python/Spark. The technology choices align well with scalability and performance requirements. Proper use of Infrastructure as Code with ARM templates.',
'Maintainability is excellent with comprehensive documentation, automated testing, and monitoring. The Python codebase follows PEP 8 standards with proper logging and error handling. Data lineage tracking enables easy troubleshooting and impact analysis.',
'Enhancement recommendations: 1) Implement data governance framework with automated quality checks, 2) Expand real-time streaming capabilities, 3) Add cost optimization automation, 4) Implement advanced security with data classification, 5) Enhance self-service analytics capabilities.',
GETDATE(), GETDATE(), 'System');

-- Architecture Patterns data for related tables would go here
-- For now, just creating the main ArchitectureReviews entries

PRINT 'Architecture review seed data inserted successfully';