-- Timeline and Risk Seed Data for Business Context
-- Adding timeline items for each assessment

INSERT INTO ProjectTimelineItems (Phase, Description, StartDate, EndDate, Progress, Status, Dependencies, Owner, Notes, CreatedDate, LastModifiedDate, AssessmentId) VALUES
-- Assessment 1: E-Commerce Platform Assessment
('Discovery & Planning', 'Requirements gathering and technical discovery', '2025-09-15', '2025-10-15', 90, 'In Progress', 'Stakeholder interviews', 'Jennifer Chen', 'Customer experience focus', GETDATE(), GETDATE(), 1),
('Infrastructure Setup', 'Prepare cloud infrastructure and CI/CD pipelines', '2025-10-01', '2025-11-15', 60, 'In Progress', 'Discovery completion', 'Marcus Rodriguez', 'Azure App Service migration', GETDATE(), GETDATE(), 1),
('Core Platform Migration', 'Migrate React frontend and payment services', '2025-11-01', '2025-12-31', 30, 'Planned', 'Infrastructure setup', 'Sarah Kim', 'Customer-facing priority', GETDATE(), GETDATE(), 1),
('Testing & Optimization', 'Performance testing and Black Friday prep', '2025-12-15', '2026-01-31', 10, 'Planned', 'Core migration', 'David Park', 'Peak season readiness', GETDATE(), GETDATE(), 1),
('Go-Live & Monitoring', 'Production deployment and monitoring setup', '2026-01-15', '2026-02-28', 0, 'Planned', 'Testing completion', 'Jennifer Chen', 'Business continuity focus', GETDATE(), GETDATE(), 1),

-- Assessment 2: Financial Services Legacy Modernization
('Regulatory Compliance Review', 'Review current compliance gaps and requirements', '2025-09-01', '2025-10-31', 80, 'In Progress', 'None', 'Lisa Thompson', 'Critical for banking license', GETDATE(), GETDATE(), 2),
('COBOL System Analysis', 'Deep dive into legacy COBOL codebase', '2025-10-15', '2025-12-15', 40, 'In Progress', 'Compliance review', 'Robert Martinez', '850K lines to analyze', GETDATE(), GETDATE(), 2),
('API Gateway Implementation', 'Create secure API layer for legacy access', '2025-11-01', '2026-01-15', 20, 'Planned', 'System analysis', 'Michael Brown', 'Enables mobile banking', GETDATE(), GETDATE(), 2),
('Core Banking Modernization', 'Replace critical COBOL modules with .NET Core', '2026-01-01', '2026-08-31', 5, 'Planned', 'API Gateway', 'Robert Martinez', 'Strangler fig pattern', GETDATE(), GETDATE(), 2),
('Digital Banking Launch', 'Launch modern digital banking services', '2026-07-01', '2026-12-31', 0, 'Planned', 'Core modernization', 'Lisa Thompson', 'Competitive advantage', GETDATE(), GETDATE(), 2),

-- Assessment 3: Enterprise Data Platform Modernization
('Data Migration Planning', 'Plan 15TB data warehouse migration strategy', '2025-01-15', '2025-02-28', 100, 'Completed', 'None', 'Dr. Amanda Foster', 'Azure Synapse target', GETDATE(), GETDATE(), 3),
('ETL Pipeline Migration', 'Migrate SSIS to Azure Data Factory', '2025-02-15', '2025-04-15', 100, 'Completed', 'Migration planning', 'James Wilson', 'Python/SQL hybrid', GETDATE(), GETDATE(), 3),
('Analytics Dashboard Upgrade', 'Power BI integration and self-service', '2025-04-01', '2025-06-30', 100, 'Completed', 'ETL migration', 'Karen Zhang', 'Finance team priority', GETDATE(), GETDATE(), 3),
('ML Pipeline Implementation', 'Deploy MLOps with Azure ML', '2025-05-15', '2025-08-31', 95, 'Completed', 'Dashboard upgrade', 'Dr. Amanda Foster', 'Predictive analytics', GETDATE(), GETDATE(), 3),
('Performance Optimization', 'Query optimization and cost management', '2025-07-01', '2025-09-30', 85, 'In Progress', 'ML pipeline', 'James Wilson', '40% cost reduction target', GETDATE(), GETDATE(), 3),

-- Assessment 4: Healthcare Integration Platform Assessment
('HIPAA Compliance Assessment', 'Comprehensive compliance and security review', '2025-08-01', '2025-09-30', 70, 'In Progress', 'None', 'Steven Davis', 'Patient data protection', GETDATE(), GETDATE(), 4),
('EHR Integration Planning', 'Plan HL7 FHIR integration strategy', '2025-09-15', '2025-11-15', 50, 'In Progress', 'HIPAA assessment', 'Dr. Emily Johnson', '500K patient records', GETDATE(), GETDATE(), 4),
('Patient Portal Enhancement', 'Improve patient self-service capabilities', '2025-11-01', '2026-01-31', 30, 'Planned', 'EHR planning', 'Maria Gonzalez', 'User experience focus', GETDATE(), GETDATE(), 4),
('Clinical Decision Support', 'AI-powered clinical assistance deployment', '2026-01-15', '2026-05-31', 10, 'Planned', 'Portal enhancement', 'Dr. Emily Johnson', 'Python/TensorFlow', GETDATE(), GETDATE(), 4),
('Go-Live & Training', 'System deployment and staff training', '2026-05-01', '2026-08-31', 0, 'Planned', 'Decision support', 'Steven Davis', 'Change management critical', GETDATE(), GETDATE(), 4),

-- Assessment 5: Smart Manufacturing IoT Assessment
('IoT Sensor Deployment', 'Install monitoring sensors across 12 facilities', '2025-07-01', '2025-09-30', 75, 'In Progress', 'None', 'Carlos Rodriguez', '500+ machines to monitor', GETDATE(), GETDATE(), 5),
('Data Pipeline Setup', 'Real-time data ingestion and processing', '2025-08-15', '2025-10-31', 60, 'In Progress', 'Sensor deployment', 'Lisa Wang', 'Azure IoT Hub integration', GETDATE(), GETDATE(), 5),
('Predictive Analytics Development', 'ML models for maintenance prediction', '2025-10-01', '2025-12-31', 40, 'Planned', 'Data pipeline', 'Carlos Rodriguez', 'Reduce 15% downtime', GETDATE(), GETDATE(), 5),
('Dashboard & Alerting', 'Operations dashboard and alert system', '2025-11-15', '2026-02-15', 25, 'Planned', 'Analytics development', 'Maria Santos', 'Real-time monitoring', GETDATE(), GETDATE(), 5),
('Pilot & Rollout', 'Pilot deployment and facility rollout', '2026-02-01', '2026-06-30', 0, 'Planned', 'Dashboard completion', 'Lisa Wang', 'Phased deployment strategy', GETDATE(), GETDATE(), 5);

-- Risk data for each assessment
INSERT INTO BusinessContextRisks (Name, Description, Category, Probability, Impact, RiskScore, Mitigation, Owner, Status, DueDate, CreatedDate, LastModifiedDate, AssessmentId) VALUES
-- Assessment 1: E-Commerce Platform Assessment
('Black Friday Traffic Spike', 'System may not handle 10x traffic increase during peak season', 'Performance', 'Medium', 'High', 75, 'Load testing and auto-scaling configuration', 'Marcus Rodriguez', 'Active', '2025-11-01', GETDATE(), GETDATE(), 1),
('Payment Processing Downtime', 'Payment service interruption could cause revenue loss', 'Business', 'Low', 'Critical', 80, 'Redundant payment processors and circuit breakers', 'Jennifer Chen', 'Active', '2025-10-15', GETDATE(), GETDATE(), 1),
('Data Migration Corruption', 'Customer data corruption during migration', 'Technical', 'Low', 'Critical', 70, 'Comprehensive backup and rollback procedures', 'Sarah Kim', 'Mitigated', '2025-09-30', GETDATE(), GETDATE(), 1),

-- Assessment 2: Financial Services Legacy Modernization
('Regulatory Non-Compliance', 'Failure to meet banking regulations could result in penalties', 'Compliance', 'Medium', 'Critical', 90, 'Regular compliance audits and regulatory liaison', 'Lisa Thompson', 'Active', '2025-12-31', GETDATE(), GETDATE(), 2),
('COBOL Expertise Shortage', 'Limited COBOL developers for legacy system maintenance', 'Resource', 'High', 'High', 85, 'Knowledge transfer documentation and external consultants', 'Robert Martinez', 'Active', '2025-11-30', GETDATE(), GETDATE(), 2),
('Data Integrity During Migration', 'Financial transaction data corruption during COBOL migration', 'Technical', 'Medium', 'Critical', 88, 'Extensive testing and parallel processing validation', 'Michael Brown', 'Active', '2026-06-30', GETDATE(), GETDATE(), 2),

-- Assessment 3: Enterprise Data Platform Modernization
('Query Performance Degradation', 'Azure Synapse queries slower than on-premises SQL Server', 'Performance', 'Medium', 'Medium', 50, 'Query optimization and partitioning strategy', 'James Wilson', 'Resolved', '2025-05-31', GETDATE(), GETDATE(), 3),
('Cost Overrun', 'Cloud data processing costs exceed budget projections', 'Financial', 'Medium', 'Medium', 55, 'Cost monitoring and resource optimization', 'Dr. Amanda Foster', 'Monitoring', '2025-12-31', GETDATE(), GETDATE(), 3),

-- Assessment 4: Healthcare Integration Platform Assessment
('HIPAA Violation', 'Patient data breach could result in severe penalties', 'Compliance', 'Low', 'Critical', 85, 'Zero-trust security model and encryption at rest/transit', 'Steven Davis', 'Active', '2026-03-31', GETDATE(), GETDATE(), 4),
('Clinical Workflow Disruption', 'System changes could disrupt patient care workflows', 'Operational', 'Medium', 'High', 70, 'Comprehensive staff training and phased rollout', 'Dr. Emily Johnson', 'Active', '2026-01-31', GETDATE(), GETDATE(), 4),
('Integration Complexity', 'HL7 FHIR integration more complex than anticipated', 'Technical', 'High', 'Medium', 65, 'Expert consultants and proof-of-concept validation', 'Maria Gonzalez', 'Active', '2025-11-30', GETDATE(), GETDATE(), 4),

-- Assessment 5: Smart Manufacturing IoT Assessment
('Sensor Hardware Failure', 'IoT sensors in harsh manufacturing environment may fail frequently', 'Technical', 'Medium', 'Medium', 60, 'Redundant sensors and predictive maintenance for sensors', 'Carlos Rodriguez', 'Active', '2025-12-31', GETDATE(), GETDATE(), 5),
('Network Connectivity Issues', 'Manufacturing facilities have limited network infrastructure', 'Infrastructure', 'High', 'High', 80, 'Edge computing and offline-capable systems', 'Lisa Wang', 'Active', '2025-10-31', GETDATE(), GETDATE(), 5),
('Data Privacy Concerns', 'Manufacturing process data contains trade secrets', 'Security', 'Medium', 'High', 75, 'Data encryption and access control implementation', 'Maria Santos', 'Active', '2025-11-15', GETDATE(), GETDATE(), 5);

PRINT 'Timeline items and risks inserted successfully';