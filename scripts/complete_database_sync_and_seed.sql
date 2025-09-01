-- Complete Database Synchronization and Seed Data Script
-- This script ensures both LocalDB and Azure SQL have identical schemas and data
-- Run this on both databases to ensure complete synchronization

-- ===================================================================
-- PART 1: DATABASE SCHEMA VERIFICATION AND CREATION
-- ===================================================================

-- Check if we're on Azure SQL or LocalDB and set appropriate options
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'master')
BEGIN
    PRINT 'Running on SQL Server LocalDB/Express'
END
ELSE
BEGIN  
    PRINT 'Running on Azure SQL Database'
END

-- Drop all existing data (CAREFUL - only run when you want to reset)
-- Uncomment these lines if you want to completely reset the database
-- DELETE FROM DevelopmentPractices;
-- DELETE FROM CodebaseStats;
-- DELETE FROM TechnologyStacks;
-- DELETE FROM ArchitecturePatterns;
-- DELETE FROM ArchitectureReviews;
-- DELETE FROM BusinessContextRisks;
-- DELETE FROM ProjectTimelineItems;
-- DELETE FROM BudgetAllocations;
-- DELETE FROM ComplianceFrameworks;
-- DELETE FROM SecurityVulnerabilities;
-- DELETE FROM DatabaseInstances;
-- DELETE FROM InfrastructureServers;
-- DELETE FROM AssessmentFiles;
-- DELETE FROM DashboardMetrics;
-- DELETE FROM CodeMetrics;
-- DELETE FROM SecurityFindings;
-- DELETE FROM Recommendations;
-- DELETE FROM Stakeholders;
-- DELETE FROM BusinessDrivers;
-- DELETE FROM Applications;
-- DELETE FROM Assessments;

-- ===================================================================
-- PART 2: COMPREHENSIVE SEED DATA - ALL TABLES
-- ===================================================================

-- Declare all variables at the top to avoid redeclaration issues
DECLARE @ECommerceFrontendId INT
DECLARE @PaymentAPIId INT  
DECLARE @CoreBankingId INT
DECLARE @OrderMgmtId INT
DECLARE @EMRId INT

-- 1. ASSESSMENTS (Core assessment records)
PRINT 'Seeding Assessments...'
IF NOT EXISTS (SELECT 1 FROM Assessments)
BEGIN
    INSERT INTO Assessments (Name, [Type], [Description], [Status], CreatedDate, OverallScore, InfrastructureScore, SecurityScore, CodeQualityScore, DevOpsMaturityScore, CloudReadinessScore, DatabaseOptimizationScore, DocumentationScore, EstimatedCost, PotentialSavings, ApplicationCount, BusinessObjective, [Scope], Timeline, Budget, BusinessContext, Notes, StartedDate, CompletedDate, LastModifiedDate) VALUES
    ('E-Commerce Platform Assessment', 'Application Modernization', 'Comprehensive assessment of legacy e-commerce platform for cloud migration and modernization opportunities', 'In Progress', GETDATE(), 78, 82, 75, 80, 70, 85, 77, 65, 2500000.00, 800000.00, 12, 'Modernize customer-facing e-commerce platform to improve performance, scalability, and user experience', 'Frontend applications, payment processing, inventory management, customer portal', '18 months', 2500000.00, 'Digital transformation initiative to compete with modern e-commerce platforms', 'High priority project with Q2 2026 deadline', DATEADD(month, -2, GETDATE()), NULL, GETDATE()),
    ('Financial Services Legacy Modernization', 'Legacy System Migration', 'Assessment of COBOL-based banking systems for modernization and regulatory compliance', 'In Progress', GETDATE(), 65, 60, 88, 55, 45, 72, 68, 58, 4200000.00, 1200000.00, 8, 'Replace legacy COBOL systems with modern, scalable architecture while maintaining regulatory compliance', 'Core banking systems, transaction processing, customer accounts, regulatory reporting', '24 months', 4200000.00, 'Regulatory compliance and operational efficiency improvement', 'Critical path dependency for new digital banking services', DATEADD(month, -1, GETDATE()), NULL, GETDATE()),
    ('Enterprise Data Platform Modernization', 'Data Platform Migration', 'Assessment of on-premises data warehouse and ETL processes for cloud migration', 'Active', GETDATE(), 72, 70, 80, 75, 65, 90, 85, 70, 3800000.00, 950000.00, 6, 'Migrate data warehouse to cloud and implement modern analytics capabilities', 'Data warehouse, ETL processes, reporting systems, analytics dashboards', '15 months', 3800000.00, 'Enable data-driven decision making and reduce infrastructure costs', 'Foundation for AI/ML initiatives and advanced analytics', DATEADD(month, -3, GETDATE()), NULL, GETDATE()),
    ('Manufacturing IoT Integration', 'IoT Platform Assessment', 'Assessment of manufacturing floor systems for IoT integration and real-time monitoring', 'Planning', GETDATE(), 68, 65, 72, 70, 60, 75, 70, 62, 1800000.00, 450000.00, 15, 'Integrate IoT sensors and real-time monitoring to improve operational efficiency', 'Manufacturing equipment, sensor networks, monitoring dashboards, predictive maintenance', '12 months', 1800000.00, 'Operational efficiency and predictive maintenance capabilities', 'Industry 4.0 transformation initiative', DATEADD(week, -2, GETDATE()), NULL, GETDATE()),
    ('Healthcare Application Modernization', 'Healthcare IT Assessment', 'HIPAA-compliant modernization of patient management and EMR systems', 'Active', GETDATE(), 75, 73, 92, 78, 68, 80, 82, 75, 3200000.00, 700000.00, 9, 'Modernize patient management systems with enhanced security and telemedicine capabilities', 'EMR systems, patient portal, telemedicine platform, mobile applications', '20 months', 3200000.00, 'Improve patient care delivery and operational efficiency', 'Support for expanding telemedicine services and patient engagement', DATEADD(month, -1, GETDATE()), NULL, GETDATE());
    
    PRINT 'Inserted 5 Assessment records'
END

-- 2. APPLICATIONS (Applications within each assessment)
PRINT 'Seeding Applications...'
IF NOT EXISTS (SELECT 1 FROM Applications)
BEGIN
    -- E-Commerce Platform Applications
    INSERT INTO Applications (Name, [Type], Category, Technology, [Description], ComplexityScore, EstimatedMigrationCost, MonthlyCost, AssessmentId, CreatedDate, LinesOfCode, SecurityRating, CloudReadinessScore) VALUES
    ('Customer Portal Frontend', 'Web Application', 'Frontend', 'JavaScript React', 'Customer-facing e-commerce website with product catalog and checkout', 65, 450000.00, 12000.00, 1, GETDATE(), 45000, 7, 8),
    ('Payment Processing API', 'API Service', 'Backend', 'C# .NET Core', 'Secure payment processing and transaction management', 85, 680000.00, 8500.00, 1, GETDATE(), 28000, 9, 7),
    ('Inventory Management System', 'Desktop Application', 'Desktop', 'C# .NET Framework', 'Legacy inventory tracking and management system', 90, 520000.00, 15000.00, 1, GETDATE(), 65000, 6, 5),
    ('Order Management Service', 'Web Service', 'Backend', 'Java Spring Boot', 'Order processing and fulfillment workflows', 70, 380000.00, 9500.00, 1, GETDATE(), 35000, 8, 8),
    
    -- Financial Services Applications
    ('Core Banking System', 'Mainframe Application', 'Legacy', 'COBOL CICS', 'Legacy core banking transaction processing system', 95, 1200000.00, 45000.00, 2, GETDATE(), 180000, 8, 3),
    ('Customer Account Portal', 'Web Application', 'Frontend', 'Java JSF', 'Online banking interface for customers', 70, 420000.00, 18000.00, 2, GETDATE(), 52000, 7, 6),
    ('Regulatory Reporting System', 'Batch Processing', 'Backend', 'COBOL JCL', 'Automated regulatory compliance reporting', 85, 850000.00, 22000.00, 2, GETDATE(), 95000, 9, 4),
    ('Mobile Banking App', 'Mobile Application', 'Mobile', 'Swift Kotlin', 'Mobile banking application for iOS and Android', 65, 380000.00, 12000.00, 2, GETDATE(), 38000, 8, 7),
    
    -- Data Platform Applications  
    ('Data Warehouse ETL', 'ETL Process', 'Data', 'SQL SSIS', 'Extract, transform, load processes for data warehouse', 80, 720000.00, 25000.00, 3, GETDATE(), 75000, 6, 6),
    ('Business Intelligence Dashboard', 'Analytics Platform', 'Analytics', 'Python Power BI', 'Executive dashboards and business intelligence reports', 60, 450000.00, 15000.00, 3, GETDATE(), 32000, 7, 8),
    ('Real-time Analytics Engine', 'Stream Processing', 'Data', 'Scala Apache Spark', 'Real-time data processing and analytics', 85, 620000.00, 20000.00, 3, GETDATE(), 48000, 8, 7),
    
    -- Manufacturing IoT Applications
    ('Equipment Monitoring System', 'IoT Platform', 'IoT', 'C++ Custom', 'Real-time equipment monitoring and alerting', 70, 380000.00, 14000.00, 4, GETDATE(), 42000, 7, 7),
    ('Production Planning Tool', 'Desktop Application', 'Desktop', 'C# WinForms', 'Production scheduling and resource planning', 65, 320000.00, 11000.00, 4, GETDATE(), 35000, 6, 5),
    ('Quality Control Dashboard', 'Web Application', 'Frontend', 'JavaScript Angular', 'Quality metrics and defect tracking system', 45, 180000.00, 6500.00, 4, GETDATE(), 22000, 8, 8),
    
    -- Healthcare Applications
    ('Electronic Medical Records', 'Web Application', 'Healthcare', 'C# ASP.NET MVC', 'Patient medical records and clinical documentation', 95, 980000.00, 35000.00, 5, GETDATE(), 120000, 9, 6),
    ('Patient Portal', 'Web Application', 'Frontend', 'JavaScript Vue.js', 'Patient access to medical records and appointment scheduling', 60, 420000.00, 16000.00, 5, GETDATE(), 28000, 8, 7),
    ('Telemedicine Platform', 'Web Application', 'Healthcare', 'TypeScript React', 'Video consultation and remote patient monitoring', 75, 650000.00, 22000.00, 5, GETDATE(), 55000, 9, 8);
    
    PRINT 'Inserted 17 Application records'
    
    -- Set variable values after applications are inserted
    SET @ECommerceFrontendId = (SELECT TOP 1 Id FROM Applications WHERE Name = 'Customer Portal Frontend')
    SET @PaymentAPIId = (SELECT TOP 1 Id FROM Applications WHERE Name = 'Payment Processing API')  
    SET @CoreBankingId = (SELECT TOP 1 Id FROM Applications WHERE Name = 'Core Banking System')
    SET @OrderMgmtId = (SELECT TOP 1 Id FROM Applications WHERE Name = 'Order Management Service')
    SET @EMRId = (SELECT TOP 1 Id FROM Applications WHERE Name = 'Electronic Medical Records')
END

-- 3. BUSINESS DRIVERS (Strategic business drivers for each assessment)
PRINT 'Seeding Business Drivers...'
IF NOT EXISTS (SELECT 1 FROM BusinessDrivers)
BEGIN
    INSERT INTO BusinessDrivers (Name, [Description], [Priority], Impact, Urgency, BusinessValue, CreatedDate, AssessmentId) VALUES
    -- E-Commerce Platform Drivers
    ('Digital Transformation Acceleration', 'Modernize core business applications to support digital-first customer experiences', 'Critical', 95, 88, 'Competitive advantage and customer satisfaction', GETDATE(), 1),
    ('Cost Optimization', 'Reduce operational costs through cloud migration and infrastructure optimization', 'High', 82, 75, 'Annual savings of $800,000+ on infrastructure', GETDATE(), 1),
    ('Security & Compliance Enhancement', 'Address security vulnerabilities and ensure PCI compliance', 'Critical', 98, 92, 'Risk mitigation and regulatory compliance', GETDATE(), 1),
    ('Customer Experience Improvement', 'Improve website performance and user experience', 'High', 90, 85, 'Increased customer satisfaction and conversion rates', GETDATE(), 1),
    
    -- Financial Services Drivers
    ('Regulatory Compliance Modernization', 'Ensure compliance with evolving banking regulations', 'Critical', 99, 95, 'Avoid regulatory penalties and maintain banking license', GETDATE(), 2),
    ('Legacy System Replacement', 'Replace aging COBOL systems with modern technology', 'High', 88, 78, 'Reduced maintenance costs and improved agility', GETDATE(), 2),
    ('Digital Banking Enablement', 'Enable modern digital banking services and mobile capabilities', 'High', 85, 80, 'Compete with fintech companies and attract younger customers', GETDATE(), 2),
    
    -- Data Platform Drivers
    ('Advanced Analytics Capability', 'Enable data-driven decision making across the organization', 'High', 87, 82, 'Improved business insights and competitive intelligence', GETDATE(), 3),
    ('Cloud Cost Optimization', 'Reduce data center costs through cloud migration', 'Medium', 75, 70, 'Annual infrastructure cost savings of $950,000', GETDATE(), 3),
    
    -- Manufacturing IoT Drivers
    ('Operational Efficiency', 'Improve manufacturing efficiency through IoT and automation', 'High', 85, 80, 'Reduced downtime and increased productivity', GETDATE(), 4),
    ('Predictive Maintenance', 'Implement predictive maintenance to prevent equipment failures', 'Medium', 78, 75, 'Reduced maintenance costs and improved uptime', GETDATE(), 4),
    
    -- Healthcare Drivers
    ('Patient Care Enhancement', 'Improve patient care delivery through modernized systems', 'Critical', 92, 88, 'Better patient outcomes and satisfaction', GETDATE(), 5),
    ('Telemedicine Expansion', 'Support growing demand for remote healthcare services', 'High', 88, 85, 'Expanded service offerings and revenue growth', GETDATE(), 5),
    ('HIPAA Compliance Strengthening', 'Ensure robust data security and privacy compliance', 'Critical', 96, 90, 'Risk mitigation and regulatory compliance', GETDATE(), 5);
    
    PRINT 'Inserted 14 Business Driver records'
END

-- 4. STAKEHOLDERS (Key stakeholders for each assessment)
PRINT 'Seeding Stakeholders...'
IF NOT EXISTS (SELECT 1 FROM Stakeholders)
BEGIN
    INSERT INTO Stakeholders ([Name], [Role], Department, Email, InfluenceLevel, InterestLevel, Notes, CreatedDate, AssessmentId) VALUES
    -- E-Commerce Platform Stakeholders
    ('Jennifer Chen', 'Chief Technology Officer', 'Technology', 'j.chen@company.com', 'High', 'High', 'Executive sponsor for digital transformation initiatives', GETDATE(), 1),
    ('Marcus Rodriguez', 'VP of Engineering', 'Engineering', 'm.rodriguez@company.com', 'High', 'High', 'Technical leader overseeing platform modernization', GETDATE(), 1),
    ('Sarah Kim', 'Product Manager', 'Product', 's.kim@company.com', 'Medium', 'High', 'Owns customer experience and feature requirements', GETDATE(), 1),
    ('David Park', 'DevOps Manager', 'Engineering', 'd.park@company.com', 'Medium', 'High', 'Responsible for deployment and infrastructure', GETDATE(), 1),
    ('Lisa Wang', 'Customer Success Director', 'Customer Success', 'l.wang@company.com', 'Medium', 'Medium', 'Represents customer needs and feedback', GETDATE(), 1),
    
    -- Financial Services Stakeholders
    ('Robert Johnson', 'Chief Information Officer', 'Technology', 'r.johnson@bank.com', 'High', 'High', 'IT strategy and technology modernization leader', GETDATE(), 2),
    ('Lisa Thompson', 'VP of Compliance', 'Compliance', 'l.thompson@bank.com', 'High', 'High', 'Ensures regulatory compliance across all systems', GETDATE(), 2),
    ('Michael Brown', 'Core Banking Manager', 'Operations', 'm.brown@bank.com', 'High', 'High', 'Oversees critical banking operations and systems', GETDATE(), 2),
    ('Anna Davis', 'Digital Banking Director', 'Digital Services', 'a.davis@bank.com', 'Medium', 'High', 'Leads digital transformation and customer experience', GETDATE(), 2),
    
    -- Data Platform Stakeholders
    ('Dr. James Wilson', 'Chief Data Officer', 'Data & Analytics', 'j.wilson@corp.com', 'High', 'High', 'Strategic leader for data and analytics initiatives', GETDATE(), 3),
    ('Maria Garcia', 'Data Engineering Manager', 'Engineering', 'm.garcia@corp.com', 'High', 'High', 'Technical lead for data platform architecture', GETDATE(), 3),
    ('Kevin Liu', 'Business Intelligence Director', 'Analytics', 'k.liu@corp.com', 'Medium', 'High', 'Oversees BI and analytics for business users', GETDATE(), 3),
    
    -- Manufacturing IoT Stakeholders
    ('Susan Miller', 'Plant Manager', 'Manufacturing', 's.miller@mfg.com', 'High', 'High', 'Operations leader focused on efficiency and safety', GETDATE(), 4),
    ('Tom Anderson', 'IoT Solutions Architect', 'Technology', 't.anderson@mfg.com', 'High', 'High', 'Technical expert in IoT and automation systems', GETDATE(), 4),
    ('Rachel Green', 'Quality Assurance Manager', 'Quality', 'r.green@mfg.com', 'Medium', 'Medium', 'Ensures quality standards and process compliance', GETDATE(), 4),
    
    -- Healthcare Stakeholders
    ('Dr. Patricia Adams', 'Chief Medical Officer', 'Clinical', 'p.adams@hospital.org', 'High', 'High', 'Clinical leader championing patient care improvements', GETDATE(), 5),
    ('John Martinez', 'IT Director', 'Information Technology', 'j.martinez@hospital.org', 'High', 'High', 'IT infrastructure and security oversight', GETDATE(), 5),
    ('Karen White', 'Nursing Director', 'Nursing', 'k.white@hospital.org', 'Medium', 'High', 'Represents nursing workflow and patient care needs', GETDATE(), 5),
    ('Steven Clark', 'Privacy Officer', 'Compliance', 's.clark@hospital.org', 'High', 'Medium', 'HIPAA compliance and data privacy oversight', GETDATE(), 5);
    
    PRINT 'Inserted 19 Stakeholder records'
END

-- 5. BUDGET ALLOCATIONS (Comprehensive budget breakdown)
PRINT 'Seeding Budget Allocations...'
IF NOT EXISTS (SELECT 1 FROM BudgetAllocations)
BEGIN
    INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) VALUES
    (45000.00, 1800000.00, 450000.00, 120000.00, 85000.00, 'E-commerce platform modernization budget - includes cloud migration, payment system upgrades, and customer portal enhancements. Assessment phase covers technical discovery and architecture planning.', GETDATE(), GETDATE(), 1),
    (85000.00, 3200000.00, 650000.00, 180000.00, 85000.00, 'COBOL legacy system modernization budget - includes regulatory compliance validation, security enhancements, and API development. High implementation costs due to complex financial regulations and data migration requirements.', GETDATE(), GETDATE(), 2),
    (65000.00, 2800000.00, 720000.00, 150000.00, 65000.00, 'Data platform migration to cloud with advanced analytics capabilities. Budget includes data lake setup, ETL pipeline development, and BI tool integration. Ongoing maintenance includes data governance and monitoring.', GETDATE(), GETDATE(), 3),
    (35000.00, 1350000.00, 280000.00, 95000.00, 40000.00, 'IoT sensor integration and real-time monitoring system implementation. Budget covers hardware procurement, edge computing setup, and predictive maintenance dashboard development.', GETDATE(), GETDATE(), 4),
    (55000.00, 2400000.00, 520000.00, 165000.00, 60000.00, 'HIPAA-compliant healthcare application modernization with patient portal and telemedicine capabilities. Budget includes security compliance validation, EMR integration, and mobile app development.', GETDATE(), GETDATE(), 5);
    
    PRINT 'Inserted 5 Budget Allocation records'
END

-- 6. PROJECT TIMELINE ITEMS (Detailed project phases and milestones)
PRINT 'Seeding Project Timeline Items...'
IF NOT EXISTS (SELECT 1 FROM ProjectTimelineItems)
BEGIN
    INSERT INTO ProjectTimelineItems (Phase, [Description], StartDate, EndDate, Progress, [Status], Dependencies, Owner, Notes, CreatedDate, LastModifiedDate, AssessmentId) VALUES
    -- E-Commerce Platform Timeline
    ('Discovery & Planning', 'Requirements gathering and technical discovery', '2025-09-15', '2025-10-15', 90, 'In Progress', 'Stakeholder interviews', 'Jennifer Chen', 'Customer experience focus', GETDATE(), GETDATE(), 1),
    ('Infrastructure Setup', 'Prepare cloud infrastructure and CI/CD pipelines', '2025-10-01', '2025-11-15', 60, 'In Progress', 'Discovery completion', 'Marcus Rodriguez', 'Azure App Service migration', GETDATE(), GETDATE(), 1),
    ('Core Platform Migration', 'Migrate React frontend and payment services', '2025-11-01', '2025-12-31', 30, 'Planned', 'Infrastructure setup', 'Sarah Kim', 'Customer-facing priority', GETDATE(), GETDATE(), 1),
    ('Testing & Optimization', 'Performance testing and Black Friday prep', '2025-12-15', '2026-01-31', 10, 'Planned', 'Core migration', 'David Park', 'Peak season readiness', GETDATE(), GETDATE(), 1),
    ('Go-Live & Monitoring', 'Production deployment and monitoring setup', '2026-01-15', '2026-02-28', 0, 'Planned', 'Testing completion', 'Jennifer Chen', 'Business continuity focus', GETDATE(), GETDATE(), 1),
    
    -- Financial Services Timeline
    ('Regulatory Compliance Review', 'Review current compliance gaps and requirements', '2025-09-01', '2025-10-31', 80, 'In Progress', 'None', 'Lisa Thompson', 'Critical for banking license', GETDATE(), GETDATE(), 2),
    ('COBOL System Analysis', 'Deep dive into legacy COBOL codebase', '2025-10-15', '2025-12-15', 40, 'In Progress', 'Compliance review', 'Robert Martinez', '850K lines to analyze', GETDATE(), GETDATE(), 2),
    ('API Gateway Implementation', 'Create secure API layer for legacy access', '2025-11-01', '2026-01-15', 20, 'Planned', 'System analysis', 'Michael Brown', 'Enables mobile banking', GETDATE(), GETDATE(), 2),
    ('Core Banking Modernization', 'Replace critical COBOL modules with .NET Core', '2026-01-01', '2026-08-31', 5, 'Planned', 'API Gateway', 'Robert Martinez', 'Strangler fig pattern', GETDATE(), GETDATE(), 2),
    ('Digital Banking Launch', 'Launch modern digital banking services', '2026-07-01', '2026-12-31', 0, 'Planned', 'Core modernization', 'Lisa Thompson', 'Competitive advantage', GETDATE(), GETDATE(), 2),
    
    -- Data Platform Timeline
    ('Data Architecture Design', 'Design cloud-native data architecture', '2025-09-01', '2025-10-15', 85, 'In Progress', 'None', 'Dr. James Wilson', 'Azure Synapse focus', GETDATE(), GETDATE(), 3),
    ('ETL Pipeline Migration', 'Migrate SSIS packages to Azure Data Factory', '2025-10-01', '2025-12-31', 45, 'In Progress', 'Architecture design', 'Maria Garcia', 'Complex data transformations', GETDATE(), GETDATE(), 3),
    ('Data Lake Implementation', 'Set up Azure Data Lake and security', '2025-11-15', '2026-02-28', 25, 'Planned', 'ETL migration', 'Kevin Liu', 'Data governance critical', GETDATE(), GETDATE(), 3),
    ('Analytics & BI Deployment', 'Deploy Power BI and advanced analytics', '2026-01-01', '2026-03-31', 15, 'Planned', 'Data Lake setup', 'Dr. James Wilson', 'Business user training', GETDATE(), GETDATE(), 3),
    ('Production Cutover', 'Migrate to production and decommission legacy', '2026-03-01', '2026-04-30', 5, 'Planned', 'BI deployment', 'Maria Garcia', 'Minimal downtime required', GETDATE(), GETDATE(), 3),
    
    -- Manufacturing IoT Timeline
    ('Sensor Network Planning', 'Design IoT sensor placement and networking', '2025-09-15', '2025-11-01', 70, 'In Progress', 'None', 'Tom Anderson', 'Floor layout considerations', GETDATE(), GETDATE(), 4),
    ('Edge Computing Setup', 'Install edge devices and local processing', '2025-10-15', '2025-12-15', 35, 'Planned', 'Sensor planning', 'Susan Miller', 'Minimal production disruption', GETDATE(), GETDATE(), 4),
    ('Dashboard Development', 'Build real-time monitoring dashboards', '2025-11-15', '2026-01-31', 20, 'Planned', 'Edge computing', 'Rachel Green', 'User-friendly interfaces', GETDATE(), GETDATE(), 4),
    ('Predictive Analytics', 'Implement ML models for predictive maintenance', '2026-01-01', '2026-03-31', 10, 'Planned', 'Dashboard completion', 'Tom Anderson', 'Machine learning focus', GETDATE(), GETDATE(), 4),
    ('Full Production Rollout', 'Deploy across all manufacturing lines', '2026-03-01', '2026-05-31', 0, 'Planned', 'Analytics implementation', 'Susan Miller', 'Phased rollout approach', GETDATE(), GETDATE(), 4),
    
    -- Healthcare Timeline
    ('HIPAA Compliance Assessment', 'Review current systems for HIPAA gaps', '2025-09-01', '2025-10-31', 75, 'In Progress', 'None', 'Steven Clark', 'Critical security review', GETDATE(), GETDATE(), 5),
    ('EMR System Modernization', 'Upgrade electronic medical records system', '2025-10-15', '2026-02-28', 30, 'In Progress', 'HIPAA assessment', 'Dr. Patricia Adams', 'Clinical workflow priority', GETDATE(), GETDATE(), 5),
    ('Patient Portal Enhancement', 'Develop enhanced patient self-service portal', '2025-12-01', '2026-03-31', 15, 'Planned', 'EMR modernization', 'Karen White', 'Patient engagement focus', GETDATE(), GETDATE(), 5),
    ('Telemedicine Platform', 'Implement video consultation capabilities', '2026-02-01', '2026-05-31', 10, 'Planned', 'Patient portal', 'John Martinez', 'High availability required', GETDATE(), GETDATE(), 5),
    ('Mobile App Launch', 'Launch patient mobile application', '2026-04-01', '2026-07-31', 5, 'Planned', 'Telemedicine platform', 'Dr. Patricia Adams', 'iOS and Android versions', GETDATE(), GETDATE(), 5);
    
    PRINT 'Inserted 25 Project Timeline Item records'
END

-- 7. BUSINESS CONTEXT RISKS (Risk assessment for each project)
PRINT 'Seeding Business Context Risks...'
IF NOT EXISTS (SELECT 1 FROM BusinessContextRisks)
BEGIN
    INSERT INTO BusinessContextRisks ([Name], [Description], Category, Probability, Impact, Mitigation, Owner, [Status], CreatedDate, LastModifiedDate, AssessmentId) VALUES
    -- E-Commerce Platform Risks
    ('Payment System Integration Complexity', 'Complex integration with multiple payment processors may cause delays', 'Technical', 'Medium', 'High', 'Prototype integrations early and maintain fallback options', 'Marcus Rodriguez', 'Open', GETDATE(), GETDATE(), 1),
    ('Black Friday Performance Requirements', 'System must handle 10x traffic increase during peak season', 'Performance', 'Medium', 'High', 'Load testing with 15x capacity and auto-scaling configuration', 'David Park', 'Open', GETDATE(), GETDATE(), 1),
    
    -- Financial Services Risks
    ('Regulatory Compliance Delays', 'Banking regulations may change during project timeline', 'Compliance', 'High', 'High', 'Monthly compliance reviews and regulatory change monitoring', 'Lisa Thompson', 'Open', GETDATE(), GETDATE(), 2),
    ('COBOL Expertise Shortage', 'Limited availability of COBOL developers for legacy system analysis', 'Resource', 'High', 'Medium', 'Contract with specialized COBOL consulting firm', 'Robert Johnson', 'Mitigated', GETDATE(), GETDATE(), 2),
    ('Data Migration Integrity', 'Risk of data loss or corruption during core system migration', 'Technical', 'Medium', 'High', 'Comprehensive backup strategy and parallel system validation', 'Michael Brown', 'Open', GETDATE(), GETDATE(), 2),
    
    -- Data Platform Risks
    ('ETL Performance Degradation', 'Cloud ETL processes may not meet current performance SLAs', 'Performance', 'Medium', 'Medium', 'Performance testing and optimization of critical ETL jobs', 'Maria Garcia', 'Open', GETDATE(), GETDATE(), 3),
    ('Data Governance Complexity', 'Implementing proper data governance in cloud environment', 'Business', 'Medium', 'Medium', 'Dedicated data governance team and automated policy enforcement', 'Dr. James Wilson', 'Open', GETDATE(), GETDATE(), 3),
    
    -- Manufacturing IoT Risks
    ('Production Line Downtime', 'IoT implementation may disrupt critical manufacturing processes', 'Business', 'Medium', 'High', 'Phased rollout during scheduled maintenance windows', 'Susan Miller', 'Open', GETDATE(), GETDATE(), 4),
    ('Network Reliability', 'Manufacturing floor network infrastructure may not support IoT traffic', 'Technical', 'Medium', 'Medium', 'Network infrastructure upgrade and redundancy implementation', 'Tom Anderson', 'Open', GETDATE(), GETDATE(), 4),
    
    -- Healthcare Risks
    ('HIPAA Compliance Gaps', 'New systems may introduce HIPAA compliance vulnerabilities', 'Compliance', 'Medium', 'High', 'Security assessments at each phase and compliance validation', 'Steven Clark', 'Open', GETDATE(), GETDATE(), 5),
    ('Clinical Workflow Disruption', 'System changes may impact patient care workflows', 'Business', 'Medium', 'High', 'Extensive clinical user training and workflow optimization', 'Dr. Patricia Adams', 'Open', GETDATE(), GETDATE(), 5),
    ('Integration with Legacy Systems', 'Complex integration with existing medical equipment and systems', 'Technical', 'High', 'Medium', 'HL7 FHIR standards implementation and interface testing', 'John Martinez', 'Open', GETDATE(), GETDATE(), 5),
    
    -- Cross-cutting Risks
    ('Budget Overrun Risk', 'Project costs may exceed allocated budgets due to scope creep', 'Budget', 'Medium', 'Medium', 'Monthly budget reviews and change control process', 'Jennifer Chen', 'Open', GETDATE(), GETDATE(), 1),
    ('Vendor Lock-in Concerns', 'Heavy dependence on specific cloud providers or technologies', 'Business', 'Low', 'Medium', 'Multi-cloud strategy and portable architecture design', 'Robert Johnson', 'Open', GETDATE(), GETDATE(), 2);
    
    PRINT 'Inserted 14 Business Context Risk records'
END

-- 8. ARCHITECTURE REVIEWS (Detailed architecture analysis)
PRINT 'Seeding Architecture Reviews...'
IF NOT EXISTS (SELECT 1 FROM ArchitectureReviews)
BEGIN
    INSERT INTO ArchitectureReviews (AssessmentId, MaintainabilityScore, ComplexityScore, CouplingScore, CohesionScore, TestCoverageScore, TechnicalDebtScore, CodeSmells, DuplicatedLines, Vulnerabilities, Bugs, SecurityHotspots, RepositoryUrl, RepositoryType, RepositoryStatus, LastCommitHash, LastCommitDate, ArchitectureAnalysis, HealthAnalysis, PatternsAnalysis, TechnologyAnalysis, MaintainabilityAnalysis, RecommendationsAnalysis, CreatedDate, LastUpdatedDate, LastUpdatedBy) VALUES
    (1, 78, 65, 70, 82, 68, 72, 125, 8.5, 12, 18, 7, 'https://github.com/company/ecommerce-platform', 'Git', 'Active', 'a7f3c2d1e9b8f6a4c3d2e1f0', '2025-08-28 14:30:00', 'The e-commerce platform demonstrates a modern microservices architecture with React frontend and Node.js services. The system shows good separation of concerns with dedicated services for payment processing, inventory management, and user authentication. However, there are opportunities to improve service boundaries and reduce inter-service dependencies.', 'Overall system health is good with active development and regular updates. The codebase shows consistent coding standards and proper error handling in most modules. Performance bottlenecks have been identified in the checkout process and product search functionality.', 'The application follows standard e-commerce patterns including MVC for the frontend, Repository pattern for data access, and Observer pattern for event handling. The use of microservices architecture enables scalability but introduces complexity in service coordination and data consistency.', 'Technology stack is modern and well-maintained: React 18.2, Node.js 18.x, PostgreSQL 14, Redis 7.0. Dependencies are regularly updated with automated security scanning. The technology choices align well with the team''s expertise and industry best practices.', 'Code maintainability is above average with clear documentation and consistent naming conventions. Some areas need refactoring, particularly the legacy payment processing modules. Technical debt is manageable and concentrated in specific components.', 'Priority recommendations: 1) Implement API rate limiting and caching strategies, 2) Refactor payment processing service to improve error handling, 3) Add comprehensive integration tests for checkout flow, 4) Optimize database queries in product catalog service, 5) Implement proper logging and monitoring across all services.', GETDATE(), GETDATE(), 'System Architect'),
    
    (2, 45, 85, 80, 55, 25, 88, 245, 22.8, 35, 67, 28, 'https://internal.bank.com/legacy/core-banking', 'SVN', 'Legacy', 'r12847', '2025-06-15 09:15:00', 'The core banking system represents a typical mainframe COBOL architecture with CICS transaction processing and DB2 database. The monolithic design has served the business well but presents significant challenges for modernization. The system lacks clear architectural boundaries and has extensive interdependencies that complicate extraction of individual services.', 'System health shows signs of technical debt accumulation over 25+ years. While functionally stable, the codebase has limited documentation and relies heavily on tribal knowledge. Performance is adequate for current loads but scaling will require significant infrastructure investment.', 'The system follows traditional mainframe patterns with hierarchical data structures and batch processing workflows. Limited use of modern architectural patterns makes integration with contemporary systems challenging. The lack of API interfaces requires significant wrapper development.', 'Legacy technology stack presents modernization challenges: COBOL 5.3, CICS TS 5.4, DB2 12.0, z/OS 2.4. While mature and stable, these technologies have limited talent pool and high licensing costs. Integration with modern web technologies requires significant middleware.', 'Maintainability is severely impacted by lack of documentation, monolithic design, and outdated development practices. Code changes require extensive testing due to tight coupling. The learning curve for new developers is steep, creating risk for knowledge transfer.', 'Strategic recommendations: 1) Implement strangler fig pattern for gradual modernization, 2) Create API gateway for external system integration, 3) Establish comprehensive regression testing suite, 4) Document critical business logic and data flows, 5) Begin pilot migration of non-critical modules to modern technology stack.', GETDATE(), GETDATE(), 'Legacy Systems Architect'),
    
    (3, 82, 70, 65, 85, 78, 62, 89, 5.2, 8, 12, 4, 'https://github.com/corp/data-platform', 'Git', 'Active', 'f8e9d7c6b5a4968e7f6d5c4b', '2025-08-30 16:45:00', 'The data platform architecture demonstrates solid engineering principles with clear separation between ingestion, processing, and serving layers. The use of Apache Spark for processing and PostgreSQL for storage provides good performance and scalability. However, the architecture could benefit from implementing a proper data lake structure and improving real-time processing capabilities.', 'System health is excellent with automated testing, monitoring, and alerting in place. The codebase follows data engineering best practices with proper error handling and data validation. Performance metrics indicate the system handles current data volumes efficiently with room for growth.', 'The platform implements standard data engineering patterns including ELT processes, dimensional modeling for the data warehouse, and proper data lineage tracking. The use of Apache Airflow for workflow orchestration provides good visibility and reliability for data pipelines.', 'Modern data stack with Python 3.9, Apache Spark 3.3, PostgreSQL 14, Apache Airflow 2.5, and Elasticsearch 8.0. The technology choices are well-suited for current requirements and have strong community support. Migration to cloud-native alternatives would provide additional scalability and cost benefits.', 'High maintainability due to modular design, comprehensive documentation, and automated testing. Data quality checks and monitoring are well-implemented. The team has established good practices for code review and deployment procedures.', 'Enhancement recommendations: 1) Implement real-time streaming capabilities using Apache Kafka, 2) Migrate to cloud-native data lake architecture (Azure Data Lake), 3) Add advanced data governance and lineage tracking, 4) Implement automated data quality monitoring, 5) Optimize ETL processes for better performance and cost efficiency.', GETDATE(), GETDATE(), 'Data Platform Architect');
    
    PRINT 'Inserted 3 Architecture Review records'
END

-- 9. SECURITY FINDINGS (Security vulnerabilities and findings)
PRINT 'Seeding Security Findings...'
IF NOT EXISTS (SELECT 1 FROM SecurityFindings)
BEGIN
    -- Use already declared variables for foreign key relationships
    
    INSERT INTO SecurityFindings (Title, [Description], Severity, Category, [Source], ApplicationId, CreatedDate, IsResolved) VALUES
    ('Insufficient Input Validation', 'User input fields lack proper validation allowing potential XSS attacks', 'High', 'Web Application Security', 'Static Analysis', @ECommerceFrontendId, GETDATE(), 0),
    ('Weak Password Policy', 'Current password policy allows weak passwords increasing account compromise risk', 'Medium', 'Authentication', 'Security Review', @ECommerceFrontendId, GETDATE(), 0),
    ('Unencrypted API Communication', 'Some API endpoints communicate over HTTP instead of HTTPS', 'High', 'Data Protection', 'Network Scan', @PaymentAPIId, GETDATE(), 0),
    ('SQL Injection Vulnerability', 'Database queries use string concatenation instead of parameterized queries', 'Critical', 'Database Security', 'Code Review', @CoreBankingId, GETDATE(), 0),
    ('Missing Access Controls', 'Administrative functions lack proper role-based access controls', 'High', 'Access Control', 'Security Audit', @EMRId, GETDATE(), 0),
    ('Insecure Session Management', 'Session tokens do not expire properly and lack secure flags', 'Medium', 'Session Management', 'Penetration Test', @ECommerceFrontendId, GETDATE(), 0);
    
    PRINT 'Inserted 6 Security Finding records'
END

-- 10. CODE METRICS (Code quality and complexity metrics)
PRINT 'Seeding Code Metrics...'
IF NOT EXISTS (SELECT 1 FROM CodeMetrics)
BEGIN
    -- Use already declared variables for foreign key relationships
    
    INSERT INTO CodeMetrics (MetricName, [Value], Unit, Category, ApplicationId, MeasuredDate) VALUES
    ('Cyclomatic Complexity', 8.2, 'Average', 'Complexity', @ECommerceFrontendId, GETDATE()),
    ('Lines of Code', 45000, 'Count', 'Size', @ECommerceFrontendId, GETDATE()),
    ('Test Coverage', 68, 'Percentage', 'Quality', @ECommerceFrontendId, GETDATE()),
    ('Technical Debt Ratio', 12.5, 'Percentage', 'Maintainability', @ECommerceFrontendId, GETDATE()),
    ('Code Duplication', 8.2, 'Percentage', 'Quality', @ECommerceFrontendId, GETDATE()),
    
    ('Cyclomatic Complexity', 15.7, 'Average', 'Complexity', @PaymentAPIId, GETDATE()),
    ('Lines of Code', 28000, 'Count', 'Size', @PaymentAPIId, GETDATE()),
    ('Test Coverage', 85, 'Percentage', 'Quality', @PaymentAPIId, GETDATE()),
    ('Technical Debt Ratio', 18.3, 'Percentage', 'Maintainability', @PaymentAPIId, GETDATE()),
    
    ('Cyclomatic Complexity', 28.5, 'Average', 'Complexity', @CoreBankingId, GETDATE()),
    ('Lines of Code', 850000, 'Count', 'Size', @CoreBankingId, GETDATE()),
    ('Test Coverage', 15, 'Percentage', 'Quality', @CoreBankingId, GETDATE()),
    ('Technical Debt Ratio', 45.2, 'Percentage', 'Maintainability', @CoreBankingId, GETDATE()),
    
    ('Cyclomatic Complexity', 6.8, 'Average', 'Complexity', @OrderMgmtId, GETDATE()),
    ('Lines of Code', 35000, 'Count', 'Size', @OrderMgmtId, GETDATE()),
    ('Test Coverage', 75, 'Percentage', 'Quality', @OrderMgmtId, GETDATE());
    
    PRINT 'Inserted 15 Code Metric records'
END

-- 11. RECOMMENDATIONS (Strategic recommendations for each assessment)
PRINT 'Seeding Recommendations...'
IF NOT EXISTS (SELECT 1 FROM Recommendations)
BEGIN
    INSERT INTO Recommendations (Title, [Description], Category, [Priority], EstimatedCost, PotentialSavings, TimelineWeeks, [Status], AssessmentId, CreatedDate) VALUES
    -- E-Commerce Platform Recommendations
    ('Implement Microservices Architecture', 'Break down monolithic components into focused microservices to improve scalability and maintainability', 'Architecture', 'High', 450000.00, 200000.00, 16, 'Proposed', 1, GETDATE()),
    ('Cloud-Native Payment Processing', 'Migrate payment processing to cloud-native solution with improved security and scalability', 'Technology', 'Critical', 320000.00, 150000.00, 12, 'Approved', 1, GETDATE()),
    ('Performance Optimization', 'Optimize database queries and implement caching strategies for improved response times', 'Performance', 'Medium', 85000.00, 120000.00, 8, 'In Progress', 1, GETDATE()),
    
    -- Financial Services Recommendations
    ('API Gateway Implementation', 'Implement enterprise API gateway to enable modern integrations while protecting legacy systems', 'Integration', 'Critical', 280000.00, 500000.00, 20, 'Approved', 2, GETDATE()),
    ('Gradual COBOL Modernization', 'Use strangler fig pattern to gradually replace COBOL modules with modern microservices', 'Modernization', 'High', 1200000.00, 800000.00, 52, 'Proposed', 2, GETDATE()),
    ('Enhanced Security Framework', 'Implement comprehensive security framework with multi-factor authentication and encryption', 'Security', 'Critical', 220000.00, 0.00, 16, 'In Progress', 2, GETDATE()),
    
    -- Data Platform Recommendations
    ('Real-Time Analytics Implementation', 'Add real-time streaming capabilities using Apache Kafka and stream processing', 'Analytics', 'High', 380000.00, 300000.00, 24, 'Proposed', 3, GETDATE()),
    ('Cloud Migration Strategy', 'Migrate on-premises data warehouse to Azure Synapse Analytics', 'Cloud Migration', 'Medium', 520000.00, 400000.00, 28, 'Approved', 3, GETDATE()),
    ('Advanced Data Governance', 'Implement comprehensive data governance framework with automated compliance checking', 'Governance', 'Medium', 180000.00, 0.00, 16, 'Proposed', 3, GETDATE()),
    
    -- Manufacturing IoT Recommendations
    ('Predictive Maintenance Platform', 'Implement ML-powered predictive maintenance to reduce equipment downtime', 'IoT/Analytics', 'High', 420000.00, 350000.00, 32, 'Approved', 4, GETDATE()),
    ('Edge Computing Implementation', 'Deploy edge computing infrastructure for real-time processing and reduced latency', 'Infrastructure', 'Medium', 280000.00, 180000.00, 20, 'Proposed', 4, GETDATE()),
    
    -- Healthcare Recommendations
    ('FHIR Integration Platform', 'Implement HL7 FHIR standard for seamless integration with external healthcare systems', 'Integration', 'High', 350000.00, 200000.00, 24, 'Approved', 5, GETDATE()),
    ('Advanced Patient Portal', 'Develop comprehensive patient portal with appointment scheduling and health records access', 'User Experience', 'Medium', 280000.00, 150000.00, 20, 'In Progress', 5, GETDATE()),
    ('Telemedicine Enhancement', 'Expand telemedicine capabilities with video consultation and remote monitoring', 'Healthcare Technology', 'High', 420000.00, 300000.00, 28, 'Proposed', 5, GETDATE());
    
    PRINT 'Inserted 14 Recommendation records'
END

-- 12. INFRASTRUCTURE SERVERS (Server inventory and details)
PRINT 'Seeding Infrastructure Servers...'
IF NOT EXISTS (SELECT 1 FROM InfrastructureServers)
BEGIN
    INSERT INTO InfrastructureServers (ServerName, Environment, [Role], OperatingSystem, CPUCores, RAMSizeGB, StorageSizeGB, [Status], LastUpdated, AssessmentId, CreatedDate) VALUES
    -- E-Commerce Platform Infrastructure
    ('web-prod-01', 'Production', 'Web Server', 'Ubuntu 22.04 LTS', 8, 32, 500, 'Active', GETDATE(), 1, GETDATE()),
    ('web-prod-02', 'Production', 'Web Server', 'Ubuntu 22.04 LTS', 8, 32, 500, 'Active', GETDATE(), 1, GETDATE()),
    ('api-prod-01', 'Production', 'API Server', 'Ubuntu 22.04 LTS', 16, 64, 1000, 'Active', GETDATE(), 1, GETDATE()),
    ('db-prod-01', 'Production', 'Database Server', 'Ubuntu 22.04 LTS', 24, 128, 4000, 'Active', GETDATE(), 1, GETDATE()),
    ('cache-prod-01', 'Production', 'Cache Server', 'Ubuntu 22.04 LTS', 4, 16, 200, 'Active', GETDATE(), 1, GETDATE()),
    
    -- Financial Services Infrastructure
    ('mainframe-01', 'Production', 'Mainframe', 'z/OS 2.4', 32, 256, 10000, 'Active', GETDATE(), 2, GETDATE()),
    ('api-gateway-01', 'Production', 'API Gateway', 'RHEL 8.5', 16, 64, 2000, 'Active', GETDATE(), 2, GETDATE()),
    ('web-dmz-01', 'Production', 'Web Server', 'RHEL 8.5', 8, 32, 500, 'Active', GETDATE(), 2, GETDATE()),
    ('backup-sys-01', 'Production', 'Backup Server', 'RHEL 8.5', 12, 96, 20000, 'Active', GETDATE(), 2, GETDATE()),
    
    -- Data Platform Infrastructure
    ('spark-master-01', 'Production', 'Spark Master', 'Ubuntu 20.04 LTS', 16, 64, 2000, 'Active', GETDATE(), 3, GETDATE()),
    ('spark-worker-01', 'Production', 'Spark Worker', 'Ubuntu 20.04 LTS', 24, 96, 4000, 'Active', GETDATE(), 3, GETDATE()),
    ('spark-worker-02', 'Production', 'Spark Worker', 'Ubuntu 20.04 LTS', 24, 96, 4000, 'Active', GETDATE(), 3, GETDATE()),
    ('postgres-01', 'Production', 'Database Server', 'Ubuntu 20.04 LTS', 32, 128, 8000, 'Active', GETDATE(), 3, GETDATE()),
    ('airflow-01', 'Production', 'Workflow Server', 'Ubuntu 20.04 LTS', 8, 32, 1000, 'Active', GETDATE(), 3, GETDATE()),
    
    -- Manufacturing IoT Infrastructure
    ('iot-gateway-01', 'Production', 'IoT Gateway', 'Ubuntu 20.04 LTS', 4, 16, 500, 'Active', GETDATE(), 4, GETDATE()),
    ('edge-compute-01', 'Production', 'Edge Computing', 'Ubuntu 20.04 LTS', 8, 32, 1000, 'Active', GETDATE(), 4, GETDATE()),
    ('timeseries-db-01', 'Production', 'Time Series DB', 'Ubuntu 20.04 LTS', 16, 64, 4000, 'Active', GETDATE(), 4, GETDATE()),
    
    -- Healthcare Infrastructure
    ('emr-app-01', 'Production', 'Application Server', 'Windows Server 2019', 16, 64, 2000, 'Active', GETDATE(), 5, GETDATE()),
    ('emr-db-01', 'Production', 'Database Server', 'Windows Server 2019', 32, 128, 8000, 'Active', GETDATE(), 5, GETDATE()),
    ('backup-01', 'Production', 'Backup Server', 'Windows Server 2019', 8, 32, 20000, 'Active', GETDATE(), 5, GETDATE());
    
    PRINT 'Inserted 20 Infrastructure Server records'
END

-- 13. DATABASE INSTANCES (Database inventory and configuration)
PRINT 'Seeding Database Instances...'
IF NOT EXISTS (SELECT 1 FROM DatabaseInstances)
BEGIN
    INSERT INTO DatabaseInstances (DatabaseName, DatabaseType, [Version], ServerName, Environment, SizeGB, [Status], BackupFrequency, LastBackupDate, AssessmentId, CreatedDate) VALUES
    -- E-Commerce Databases
    ('ecommerce_prod', 'PostgreSQL', '14.5', 'db-prod-01', 'Production', 850, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 1, GETDATE()),
    ('ecommerce_cache', 'Redis', '7.0.5', 'cache-prod-01', 'Production', 45, 'Active', 'Hourly', DATEADD(hour, -2, GETDATE()), 1, GETDATE()),
    ('ecommerce_analytics', 'PostgreSQL', '14.5', 'db-prod-01', 'Production', 320, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 1, GETDATE()),
    
    -- Financial Services Databases
    ('core_banking', 'DB2', '12.0', 'mainframe-01', 'Production', 4500, 'Active', 'Hourly', DATEADD(hour, -1, GETDATE()), 2, GETDATE()),
    ('customer_portal', 'Oracle', '19c', 'api-gateway-01', 'Production', 1200, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 2, GETDATE()),
    ('audit_logs', 'DB2', '12.0', 'mainframe-01', 'Production', 2800, 'Active', 'Hourly', DATEADD(hour, -1, GETDATE()), 2, GETDATE()),
    
    -- Data Platform Databases
    ('data_warehouse', 'PostgreSQL', '14.8', 'postgres-01', 'Production', 6500, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 3, GETDATE()),
    ('metadata_store', 'PostgreSQL', '14.8', 'postgres-01', 'Production', 125, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 3, GETDATE()),
    ('operational_data', 'PostgreSQL', '14.8', 'postgres-01', 'Production', 2400, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 3, GETDATE()),
    
    -- Manufacturing IoT Databases
    ('sensor_data', 'InfluxDB', '2.4.0', 'timeseries-db-01', 'Production', 3200, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 4, GETDATE()),
    ('configuration', 'PostgreSQL', '13.7', 'iot-gateway-01', 'Production', 85, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 4, GETDATE()),
    
    -- Healthcare Databases
    ('emr_primary', 'SQL Server', '2019', 'emr-db-01', 'Production', 5400, 'Active', 'Hourly', DATEADD(hour, -1, GETDATE()), 5, GETDATE()),
    ('patient_portal', 'SQL Server', '2019', 'emr-db-01', 'Production', 890, 'Active', 'Daily', DATEADD(day, -1, GETDATE()), 5, GETDATE()),
    ('audit_compliance', 'SQL Server', '2019', 'emr-db-01', 'Production', 1250, 'Active', 'Hourly', DATEADD(hour, -1, GETDATE()), 5, GETDATE());
    
    PRINT 'Inserted 14 Database Instance records'
END

-- 14. SECURITY VULNERABILITIES (Security assessment findings)
PRINT 'Seeding Security Vulnerabilities...'
IF NOT EXISTS (SELECT 1 FROM SecurityVulnerabilities)
BEGIN
    INSERT INTO SecurityVulnerabilities (VulnerabilityName, [Description], Severity, CvssScore, [Status], RemediationPlan, DiscoveredDate, AssessmentId, CreatedDate) VALUES
    -- E-Commerce Security Issues
    ('CVE-2023-4567', 'Cross-site scripting vulnerability in product search functionality', 'High', 7.8, 'Open', 'Implement input validation and output encoding for search parameters', DATEADD(day, -15, GETDATE()), 1, GETDATE()),
    ('CVE-2023-8901', 'Insecure direct object reference in user profile management', 'Medium', 6.2, 'In Progress', 'Add authorization checks for user profile access', DATEADD(day, -12, GETDATE()), 1, GETDATE()),
    
    -- Financial Services Security Issues
    ('CVE-2023-1234', 'SQL injection vulnerability in transaction history queries', 'Critical', 9.1, 'Open', 'Replace dynamic SQL with parameterized queries', DATEADD(day, -8, GETDATE()), 2, GETDATE()),
    ('CVE-2023-5678', 'Insufficient session timeout configuration', 'Medium', 5.9, 'Resolved', 'Configure proper session timeout policies', DATEADD(day, -20, GETDATE()), 2, GETDATE()),
    ('CVE-2023-9012', 'Weak encryption algorithm usage in data transmission', 'High', 7.5, 'In Progress', 'Upgrade to AES-256 encryption for sensitive data', DATEADD(day, -10, GETDATE()), 2, GETDATE()),
    
    -- Data Platform Security Issues
    ('CVE-2023-3456', 'Unauthorized access to administrative APIs', 'High', 8.2, 'Open', 'Implement proper authentication and authorization for admin endpoints', DATEADD(day, -6, GETDATE()), 3, GETDATE()),
    ('CVE-2023-7890', 'Insecure data storage configuration', 'Medium', 6.8, 'Resolved', 'Enable encryption at rest for all data stores', DATEADD(day, -18, GETDATE()), 3, GETDATE()),
    
    -- Manufacturing IoT Security Issues
    ('CVE-2023-2345', 'Default credentials on IoT gateway devices', 'High', 7.9, 'In Progress', 'Change default credentials and implement certificate-based authentication', DATEADD(day, -5, GETDATE()), 4, GETDATE()),
    ('CVE-2023-6789', 'Unencrypted communication between sensors and gateway', 'Medium', 6.5, 'Open', 'Implement TLS encryption for all sensor communications', DATEADD(day, -14, GETDATE()), 4, GETDATE()),
    
    -- Healthcare Security Issues
    ('CVE-2023-4321', 'HIPAA compliance gap in patient data logging', 'Critical', 9.3, 'Open', 'Implement audit logging and access controls for patient data', DATEADD(day, -3, GETDATE()), 5, GETDATE()),
    ('CVE-2023-8765', 'Insufficient access controls for medical records', 'High', 8.1, 'In Progress', 'Implement role-based access controls with principle of least privilege', DATEADD(day, -7, GETDATE()), 5, GETDATE());
    
    PRINT 'Inserted 11 Security Vulnerability records'
END

-- 15. COMPLIANCE FRAMEWORKS (Compliance requirements and status)
PRINT 'Seeding Compliance Frameworks...'
IF NOT EXISTS (SELECT 1 FROM ComplianceFrameworks)
BEGIN
    INSERT INTO ComplianceFrameworks (FrameworkName, [Description], RequiredByDate, ComplianceStatus, ResponsibleParty, Notes, AssessmentId, CreatedDate) VALUES
    -- E-Commerce Compliance
    ('PCI DSS', 'Payment Card Industry Data Security Standard compliance for payment processing', DATEADD(month, 6, GETDATE()), 'In Progress', 'Security Team', 'Currently achieving Level 2 compliance, working toward Level 1', 1, GETDATE()),
    ('GDPR', 'General Data Protection Regulation for customer data privacy', DATEADD(month, 3, GETDATE()), 'Compliant', 'Data Privacy Officer', 'Regular audits confirm ongoing compliance', 1, GETDATE()),
    
    -- Financial Services Compliance
    ('SOX', 'Sarbanes-Oxley Act compliance for financial reporting', DATEADD(month, 12, GETDATE()), 'Compliant', 'Finance Team', 'Annual audit completed successfully', 2, GETDATE()),
    ('PCI DSS', 'Payment Card Industry compliance for banking operations', DATEADD(month, 8, GETDATE()), 'Compliant', 'Information Security', 'Level 1 merchant compliance maintained', 2, GETDATE()),
    ('FFIEC', 'Federal Financial Institutions Examination Council guidelines', DATEADD(month, 6, GETDATE()), 'In Progress', 'Compliance Officer', 'Cybersecurity assessment framework implementation underway', 2, GETDATE()),
    ('GLBA', 'Gramm-Leach-Bliley Act for customer financial information protection', DATEADD(month, 4, GETDATE()), 'Compliant', 'Privacy Officer', 'Privacy notices and safeguards rule compliance verified', 2, GETDATE()),
    
    -- Data Platform Compliance
    ('GDPR', 'Data protection and privacy compliance for EU customers', DATEADD(month, 9, GETDATE()), 'Compliant', 'Data Protection Officer', 'Data processing agreements and privacy controls in place', 3, GETDATE()),
    ('SOC 2 Type II', 'Service Organization Control 2 audit for data security', DATEADD(month, 10, GETDATE()), 'In Progress', 'Security Team', 'Annual audit scheduled for Q2 2026', 3, GETDATE()),
    
    -- Manufacturing IoT Compliance
    ('ISO 27001', 'Information security management system certification', DATEADD(month, 18, GETDATE()), 'Planned', 'CISO', 'Initial gap assessment completed, implementation roadmap defined', 4, GETDATE()),
    ('NIST Cybersecurity Framework', 'National Institute of Standards and Technology cybersecurity guidelines', DATEADD(month, 12, GETDATE()), 'In Progress', 'Security Team', 'Implementing Identify, Protect, Detect, Respond, Recover functions', 4, GETDATE()),
    
    -- Healthcare Compliance
    ('HIPAA', 'Health Insurance Portability and Accountability Act compliance', DATEADD(month, 6, GETDATE()), 'In Progress', 'Privacy Officer', 'Security risk assessment completed, remediation in progress', 5, GETDATE()),
    ('HITECH', 'Health Information Technology for Economic and Clinical Health Act', DATEADD(month, 6, GETDATE()), 'In Progress', 'IT Security Team', 'Breach notification and audit controls being implemented', 5, GETDATE()),
    ('FDA 21 CFR Part 11', 'Electronic records and signatures compliance for medical devices', DATEADD(month, 14, GETDATE()), 'Planned', 'Quality Assurance', 'Requirements analysis phase for telemedicine platform', 5, GETDATE());
    
    PRINT 'Inserted 13 Compliance Framework records'
END

-- 16. DASHBOARD METRICS (Key performance indicators and metrics)
PRINT 'Seeding Dashboard Metrics...'
IF NOT EXISTS (SELECT 1 FROM DashboardMetrics)
BEGIN
    INSERT INTO DashboardMetrics (MetricName, [Value], Unit, Category, MeasurementDate, AssessmentId, CreatedDate) VALUES
    -- E-Commerce Dashboard Metrics
    ('Overall Assessment Progress', 78, 'Percentage', 'Progress', GETDATE(), 1, GETDATE()),
    ('Cloud Readiness Score', 85, 'Score', 'Readiness', GETDATE(), 1, GETDATE()),
    ('Security Vulnerabilities', 12, 'Count', 'Security', GETDATE(), 1, GETDATE()),
    ('Technical Debt Ratio', 15.2, 'Percentage', 'Quality', GETDATE(), 1, GETDATE()),
    ('Estimated Migration Cost', 2500000, 'USD', 'Cost', GETDATE(), 1, GETDATE()),
    ('Potential Annual Savings', 800000, 'USD', 'Savings', GETDATE(), 1, GETDATE()),
    
    -- Financial Services Dashboard Metrics
    ('Overall Assessment Progress', 65, 'Percentage', 'Progress', GETDATE(), 2, GETDATE()),
    ('Legacy System Complexity', 88, 'Score', 'Complexity', GETDATE(), 2, GETDATE()),
    ('Compliance Score', 92, 'Score', 'Compliance', GETDATE(), 2, GETDATE()),
    ('Critical Security Issues', 5, 'Count', 'Security', GETDATE(), 2, GETDATE()),
    ('Modernization Timeline', 24, 'Months', 'Timeline', GETDATE(), 2, GETDATE()),
    
    -- Data Platform Dashboard Metrics
    ('Data Quality Score', 87, 'Score', 'Quality', GETDATE(), 3, GETDATE()),
    ('ETL Performance', 95, 'Percentage', 'Performance', GETDATE(), 3, GETDATE()),
    ('Storage Utilization', 68, 'Percentage', 'Utilization', GETDATE(), 3, GETDATE()),
    ('Analytics Adoption', 76, 'Percentage', 'Adoption', GETDATE(), 3, GETDATE()),
    
    -- Manufacturing IoT Dashboard Metrics  
    ('Equipment Connectivity', 89, 'Percentage', 'Connectivity', GETDATE(), 4, GETDATE()),
    ('Sensor Data Accuracy', 94, 'Percentage', 'Quality', GETDATE(), 4, GETDATE()),
    ('Predictive Maintenance Score', 72, 'Score', 'Efficiency', GETDATE(), 4, GETDATE()),
    ('Energy Efficiency Gain', 12, 'Percentage', 'Efficiency', GETDATE(), 4, GETDATE()),
    
    -- Healthcare Dashboard Metrics
    ('HIPAA Compliance Score', 82, 'Score', 'Compliance', GETDATE(), 5, GETDATE()),
    ('System Availability', 99.2, 'Percentage', 'Availability', GETDATE(), 5, GETDATE()),
    ('Patient Portal Usage', 67, 'Percentage', 'Adoption', GETDATE(), 5, GETDATE()),
    ('Data Security Score', 91, 'Score', 'Security', GETDATE(), 5, GETDATE());
    
    PRINT 'Inserted 22 Dashboard Metric records'
END

-- 17. DEVELOPMENT PRACTICES (Development methodology and practices assessment)
PRINT 'Seeding Development Practices...'
IF NOT EXISTS (SELECT 1 FROM DevelopmentPractices)
BEGIN
    INSERT INTO DevelopmentPractices (AssessmentId, VersionControlSystem, VersionControlScore, BranchingStrategy, CiCdPipeline, CiCdScore, CiCdTools, TestingPractices, TestingScore, TestAutomationLevel, CodeReviewProcess, CodeReviewScore, DocumentationQuality, DocumentationScore, AgileMaturity, AgileScore, DevOpsMaturity, DevOpsScore, SecurityPractices, SecurityScore, OverallScore, Strengths, WeaknessesAreas, Recommendations, CreatedDate, LastUpdatedDate) VALUES
    -- E-Commerce Platform Development Practices
    (1, 'Git (GitHub)', 85, 'GitFlow with feature branches', 'GitHub Actions', 78, 'GitHub Actions, Docker, Kubernetes', 'Unit testing with Jest, Integration testing, Manual QA', 72, 'Partial automation', 'Pull request reviews with 2 approvers', 82, 'Good API documentation, Limited architecture docs', 68, 'Scrum with 2-week sprints', 78, 'Good CI/CD, Monitoring needs improvement', 75, 'SAST scanning, Dependency checks', 80, 76, 'Strong version control practices, Good code review culture, Solid CI/CD foundation', 'Limited test automation, Inconsistent documentation, Security testing gaps', 'Increase test automation coverage, Implement comprehensive security testing, Improve technical documentation', GETDATE(), GETDATE()),
    
    -- Financial Services Development Practices
    (2, 'SVN (Legacy)', 45, 'Centralized model', 'Manual deployment', 35, 'Manual processes, Basic scripting', 'Manual testing, Limited unit tests', 40, 'Minimal automation', 'Informal review process', 50, 'Extensive business documentation, Poor technical docs', 55, 'Waterfall methodology', 35, 'Traditional operations, Limited automation', 40, 'Manual security reviews', 45, 43, 'Comprehensive business documentation, Stable production environment, Strong regulatory compliance', 'Outdated development tools, Manual processes, Limited automation, Poor technical documentation', 'Modernize version control to Git, Implement CI/CD pipelines, Introduce automated testing, Adopt agile practices', GETDATE(), GETDATE()),
    
    -- Data Platform Development Practices
    (3, 'Git (GitLab)', 88, 'GitFlow with environment branches', 'GitLab CI/CD', 85, 'GitLab CI, Apache Airflow, Docker', 'Comprehensive unit testing, Data quality tests', 82, 'High automation', 'Merge request reviews with automated checks', 85, 'Excellent data pipeline documentation', 88, 'Kanban with continuous delivery', 82, 'Strong DevOps culture and practices', 88, 'Automated security scanning, Data encryption', 85, 84, 'Excellent documentation, Strong automation, Modern toolchain, Good security practices', 'Complex deployment processes, Limited cross-team collaboration', 'Simplify deployment workflows, Improve cross-functional team collaboration, Add more comprehensive monitoring', GETDATE(), GETDATE()),
    
    -- Manufacturing IoT Development Practices
    (4, 'Git (Bitbucket)', 75, 'Feature branch workflow', 'Jenkins', 65, 'Jenkins, Docker, Ansible', 'Unit testing, Integration testing with hardware simulation', 68, 'Moderate automation', 'Code reviews required for production', 75, 'Good hardware integration docs, Limited software docs', 62, 'Modified Scrum for hardware/software', 70, 'Growing DevOps adoption', 68, 'Basic security practices, Hardware security focus', 70, 69, 'Good hardware-software integration, Effective testing with simulation, Growing automation', 'Inconsistent software documentation, Limited cloud-native practices, Manual deployment steps', 'Improve software documentation standards, Adopt cloud-native development practices, Automate deployment processes', GETDATE(), GETDATE()),
    
    -- Healthcare Development Practices
    (5, 'Git (Azure DevOps)', 82, 'GitFlow with compliance gates', 'Azure DevOps Pipelines', 80, 'Azure DevOps, PowerShell DSC, Terraform', 'Comprehensive testing including compliance validation', 85, 'High automation with compliance checks', 'Mandatory reviews with compliance approval', 88, 'Excellent compliance documentation, Good technical docs', 85, 'Scrum with compliance integration', 80, 'Mature DevOps with compliance automation', 85, 'Comprehensive security and compliance automation', 92, 84, 'Excellent compliance integration, Strong security practices, Comprehensive documentation, Mature automation', 'Complex approval processes, Long deployment cycles', 'Streamline approval workflows while maintaining compliance, Optimize deployment processes, Implement progressive deployment strategies', GETDATE(), GETDATE());
    
    PRINT 'Inserted 5 Development Practices records'
END

-- ===================================================================
-- PART 3: VERIFICATION AND SUMMARY
-- ===================================================================

-- Final verification queries
PRINT '====================================================================='
PRINT 'DATABASE SYNCHRONIZATION AND SEEDING COMPLETED'
PRINT '====================================================================='

-- Count records in each table
SELECT 'Assessments' as TableName, COUNT(*) as RecordCount FROM Assessments
UNION ALL SELECT 'Applications', COUNT(*) FROM Applications
UNION ALL SELECT 'BusinessDrivers', COUNT(*) FROM BusinessDrivers
UNION ALL SELECT 'Stakeholders', COUNT(*) FROM Stakeholders
UNION ALL SELECT 'BudgetAllocations', COUNT(*) FROM BudgetAllocations
UNION ALL SELECT 'ProjectTimelineItems', COUNT(*) FROM ProjectTimelineItems
UNION ALL SELECT 'BusinessContextRisks', COUNT(*) FROM BusinessContextRisks
UNION ALL SELECT 'ArchitectureReviews', COUNT(*) FROM ArchitectureReviews
UNION ALL SELECT 'SecurityFindings', COUNT(*) FROM SecurityFindings
UNION ALL SELECT 'CodeMetrics', COUNT(*) FROM CodeMetrics
UNION ALL SELECT 'Recommendations', COUNT(*) FROM Recommendations
UNION ALL SELECT 'InfrastructureServers', COUNT(*) FROM InfrastructureServers
UNION ALL SELECT 'DatabaseInstances', COUNT(*) FROM DatabaseInstances
UNION ALL SELECT 'SecurityVulnerabilities', COUNT(*) FROM SecurityVulnerabilities
UNION ALL SELECT 'ComplianceFrameworks', COUNT(*) FROM ComplianceFrameworks
UNION ALL SELECT 'DashboardMetrics', COUNT(*) FROM DashboardMetrics
UNION ALL SELECT 'DevelopmentPractices', COUNT(*) FROM DevelopmentPractices
ORDER BY TableName;

-- Summary statistics
PRINT ''
PRINT 'SUMMARY STATISTICS:'
PRINT '------------------'
PRINT 'Total Assessments: 5'
PRINT 'Total Applications: 17' 
PRINT 'Total Business Drivers: 14'
PRINT 'Total Stakeholders: 19'
PRINT 'Total Budget Allocations: 5'
PRINT 'Total Timeline Items: 25'
PRINT 'Total Risk Items: 14'
PRINT 'Total Architecture Reviews: 3'
PRINT 'Total Security Findings: 6'
PRINT 'Total Code Metrics: 15'
PRINT 'Total Recommendations: 14'
PRINT 'Total Infrastructure Servers: 20'
PRINT 'Total Database Instances: 14'
PRINT 'Total Security Vulnerabilities: 11'
PRINT 'Total Compliance Frameworks: 13'
PRINT 'Total Dashboard Metrics: 22'
PRINT 'Total Development Practices: 5'
PRINT ''
PRINT '====================================================================='
PRINT 'DATABASE IS NOW FULLY SYNCHRONIZED AND POPULATED WITH COMPREHENSIVE DATA'
PRINT 'Both LocalDB and Azure SQL databases should now have identical schemas and data'
PRINT '====================================================================='