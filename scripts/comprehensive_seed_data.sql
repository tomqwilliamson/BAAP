-- BAAP Comprehensive Seed Data Script
-- This script provides complete sample data for the BAAP application
-- Including data for existing assessments and templates for new assessments

-- Insert Comprehensive Assessments
INSERT INTO Assessments (
    Name, Description, Status, CreatedDate, EstimatedCost, PotentialSavings, 
    OverallScore, SecurityScore, CloudReadinessScore, CodeQualityScore, 
    DatabaseOptimizationScore, DevOpsMaturityScore, InfrastructureScore, 
    DocumentationScore, ApplicationCount, Type, Scope, 
    BusinessObjective, Timeline, Budget, Notes, BusinessContext, LastModifiedDate
) VALUES 
-- Assessment 1: E-Commerce Platform
('E-Commerce Platform Assessment', 
 'Comprehensive assessment of modern e-commerce platform with microservices architecture', 
 'In Progress', GETUTCDATE(), 850000.00, 320000.00, 
 82, 88, 81, 75, 85, 72, 78, 68, 4, 
 'Digital Transformation', 'Full Application Portfolio',
 'Modernize customer experience and improve scalability for Black Friday traffic',
 '12 months', 850000.00, 
 'Priority focus on customer-facing applications and payment systems',
 'Growing e-commerce business with 2M+ active users, seasonal traffic spikes, competitive pressure',
 GETUTCDATE()),

-- Assessment 2: Legacy Banking System
('Financial Services Legacy Modernization', 
 'Assessment and modernization strategy for legacy COBOL-based financial systems', 
 'In Progress', GETUTCDATE(), 2500000.00, 1200000.00, 
 45, 52, 20, 38, 28, 35, 42, 55, 3, 
 'Legacy Modernization', 'Core Banking Systems',
 'Replace aging COBOL systems to meet regulatory requirements and improve maintainability',
 '24 months', 2500000.00,
 'Critical: System end-of-life approaching, regulatory compliance requirements',
 'Regional bank with $2B assets, 150K customers, heavy regulatory oversight, aging infrastructure',
 GETUTCDATE()),

-- Assessment 3: Data Platform Migration  
('Enterprise Data Platform Modernization', 
 'Migration from on-premises data warehouse to cloud-native analytics platform', 
 'Completed', GETUTCDATE(), 750000.00, 400000.00, 
 91, 87, 94, 89, 92, 88, 95, 82, 5, 
 'Data Platform Migration', 'Data & Analytics',
 'Enable real-time analytics and machine learning capabilities for business insights',
 '8 months', 750000.00,
 'Successfully migrated 15TB data warehouse to Azure Synapse Analytics',
 'Manufacturing company, 50+ data sources, real-time IoT analytics requirements',
 GETUTCDATE()),

-- Assessment 4: Healthcare System Integration
('Healthcare Integration Platform Assessment', 
 'Assessment of patient data integration and HIPAA compliance systems', 
 'Planning', GETUTCDATE(), 1200000.00, 600000.00, 
 67, 78, 65, 71, 69, 58, 73, 84, 6, 
 'Healthcare Integration', 'Clinical Systems',
 'Integrate disparate clinical systems while maintaining HIPAA compliance and improving patient outcomes',
 '18 months', 1200000.00,
 'Complex integration requirements across multiple healthcare providers',
 'Regional health network, 3 hospitals, 12 clinics, 500K+ patient records, strict compliance requirements',
 GETUTCDATE()),

-- Assessment 5: Manufacturing IoT Platform
('Smart Manufacturing IoT Assessment', 
 'Industrial IoT platform for predictive maintenance and operational efficiency', 
 'In Progress', GETUTCDATE(), 950000.00, 1500000.00, 
 78, 71, 85, 73, 77, 81, 89, 65, 4, 
 'IoT Modernization', 'Manufacturing Operations',
 'Implement predictive maintenance and real-time operational monitoring across 12 manufacturing facilities',
 '15 months', 950000.00,
 'Focus on reducing unplanned downtime and improving OEE (Overall Equipment Effectiveness)',
 'Global manufacturer, 12 facilities, 500+ machines, $50M annual maintenance costs, 15% unplanned downtime',
 GETUTCDATE());

-- Insert Applications for each Assessment
INSERT INTO Applications (
    Name, Description, Type, Category, Technology, LinesOfCode, 
    ComplexityScore, SecurityRating, CloudReadinessScore, 
    CriticalIssues, SecurityIssues, CriticalFindings, HighFindings,
    EstimatedMigrationCost, MonthlyCost, CreatedDate, AssessmentId
) VALUES 
-- E-Commerce Applications (Assessment 1)
('Customer Web Portal', 'React-based customer-facing e-commerce website', 'Web Application', 'Frontend', 'React/TypeScript', 85000, 72, 85, 88, 2, 5, 1, 3, 145000.00, 3200.00, GETUTCDATE(), 1),
('Payment Processing Service', 'Microservice handling payment transactions and fraud detection', 'Microservice', 'Backend', 'Node.js', 45000, 68, 92, 85, 3, 2, 0, 1, 95000.00, 2100.00, GETUTCDATE(), 1),
('Product Catalog API', 'RESTful API for product information and inventory management', 'API', 'Backend', 'Java Spring', 62000, 75, 83, 82, 4, 8, 2, 4, 125000.00, 2800.00, GETUTCDATE(), 1),
('Order Management System', 'Legacy order processing and fulfillment system', 'Legacy System', 'Backend', '.NET Framework', 120000, 85, 71, 65, 8, 12, 3, 7, 285000.00, 4500.00, GETUTCDATE(), 1),

-- Banking Applications (Assessment 2)
('Core Banking System', 'COBOL-based transaction processing system', 'Monolith', 'Core System', 'COBOL', 850000, 95, 65, 25, 15, 23, 8, 15, 1200000.00, 12000.00, GETUTCDATE(), 2),
('Customer Information System', 'Customer data management and KYC compliance', 'Legacy System', 'CRM', 'COBOL', 320000, 88, 58, 30, 12, 18, 6, 12, 450000.00, 5500.00, GETUTCDATE(), 2),
('Loan Processing System', 'Loan origination and underwriting platform', 'Legacy System', 'Business Logic', 'COBOL', 180000, 78, 62, 35, 8, 14, 4, 9, 380000.00, 4200.00, GETUTCDATE(), 2),

-- Data Platform Applications (Assessment 3)
('Data Warehouse', 'Enterprise data warehouse with ETL processes', 'Data Platform', 'Analytics', 'SQL Server', 125000, 68, 78, 92, 2, 4, 1, 2, 95000.00, 2800.00, GETUTCDATE(), 3),
('ETL Pipeline', 'Data extraction, transformation, and loading processes', 'Data Pipeline', 'Data Processing', 'SSIS/Python', 85000, 71, 82, 95, 1, 3, 0, 1, 65000.00, 1800.00, GETUTCDATE(), 3),
('Analytics Dashboard', 'Business intelligence and reporting platform', 'Web Application', 'Analytics', 'Power BI/React', 45000, 58, 85, 88, 1, 2, 0, 1, 45000.00, 1200.00, GETUTCDATE(), 3),
('Data Lake Storage', 'Raw data storage and processing system', 'Storage System', 'Data Storage', 'Hadoop/Spark', 35000, 62, 89, 94, 0, 1, 0, 0, 35000.00, 950.00, GETUTCDATE(), 3),
('ML Pipeline', 'Machine learning model training and deployment', 'ML Platform', 'Data Science', 'Python/MLflow', 28000, 65, 87, 91, 1, 1, 0, 1, 42000.00, 1500.00, GETUTCDATE(), 3),

-- Healthcare Applications (Assessment 4)
('Electronic Health Records', 'Patient health record management system', 'Web Application', 'Clinical', 'C#/.NET', 180000, 82, 88, 72, 5, 9, 2, 5, 285000.00, 5200.00, GETUTCDATE(), 4),
('Patient Portal', 'Patient self-service portal for appointments and records', 'Web Application', 'Patient Care', 'Angular', 65000, 68, 85, 78, 3, 6, 1, 3, 95000.00, 2100.00, GETUTCDATE(), 4),
('Clinical Decision Support', 'AI-powered clinical decision assistance system', 'AI System', 'Clinical', 'Python/TensorFlow', 42000, 71, 82, 81, 2, 4, 1, 2, 125000.00, 2800.00, GETUTCDATE(), 4),
('Billing Integration', 'Healthcare billing and insurance processing', 'Integration Platform', 'Financial', 'Java', 95000, 78, 79, 68, 6, 11, 3, 6, 165000.00, 3500.00, GETUTCDATE(), 4),
('Lab Results System', 'Laboratory results management and reporting', 'Legacy System', 'Clinical', 'VB.NET', 75000, 85, 71, 62, 4, 8, 2, 4, 135000.00, 2900.00, GETUTCDATE(), 4),
('Pharmacy Management', 'Prescription and pharmacy integration system', 'Integration System', 'Clinical', 'Java', 55000, 72, 83, 75, 3, 5, 1, 3, 85000.00, 1800.00, GETUTCDATE(), 4),

-- Manufacturing IoT Applications (Assessment 5)
('Equipment Monitoring Dashboard', 'Real-time equipment monitoring and alerts', 'Web Application', 'Operations', 'React/Node.js', 52000, 65, 81, 85, 2, 4, 1, 2, 85000.00, 2200.00, GETUTCDATE(), 5),
('Predictive Maintenance Engine', 'ML-powered predictive maintenance system', 'ML Platform', 'Maintenance', 'Python/TensorFlow', 38000, 72, 85, 89, 1, 2, 0, 1, 125000.00, 3200.00, GETUTCDATE(), 5),
('Production Planning System', 'Manufacturing resource planning and scheduling', 'ERP System', 'Operations', 'SAP/ABAP', 125000, 88, 73, 58, 8, 15, 4, 8, 385000.00, 6500.00, GETUTCDATE(), 5),
('Quality Control System', 'Quality assurance and defect tracking system', 'Quality System', 'QA', 'C#/.NET', 68000, 75, 79, 72, 3, 7, 2, 3, 115000.00, 2500.00, GETUTCDATE(), 5);

-- Insert Business Drivers
INSERT INTO BusinessDrivers (Name, Description, Priority, Impact, Urgency, BusinessValue, CreatedDate, AssessmentId) VALUES 
-- E-Commerce Drivers (Assessment 1)
('Digital Customer Experience', 'Modernize customer journey and improve conversion rates', 'High', 90, 85, 'Increase conversion rates by 25% and reduce cart abandonment by 35%', GETUTCDATE(), 1),
('Scalability for Peak Traffic', 'Handle Black Friday and Cyber Monday traffic spikes', 'Critical', 95, 90, 'Support 10x traffic increase during peak seasons without downtime', GETUTCDATE(), 1),
('Mobile-First Strategy', 'Optimize platform for mobile commerce growth', 'High', 88, 80, 'Capture 60% of transactions from mobile devices', GETUTCDATE(), 1),

-- Banking Drivers (Assessment 2)  
('Regulatory Compliance', 'Meet updated banking regulations and audit requirements', 'Critical', 98, 95, 'Avoid regulatory penalties and maintain banking license', GETUTCDATE(), 2),
('Operational Efficiency', 'Reduce manual processes and improve staff productivity', 'High', 85, 75, 'Reduce operational costs by 30% and processing time by 50%', GETUTCDATE(), 2),
('Digital Banking Services', 'Launch modern digital banking capabilities', 'Medium', 80, 70, 'Attract younger customers and compete with fintech companies', GETUTCDATE(), 2),

-- Data Platform Drivers (Assessment 3)
('Real-Time Analytics', 'Enable real-time business insights and decision making', 'High', 92, 85, 'Reduce time-to-insight from days to minutes', GETUTCDATE(), 3),
('Cost Optimization', 'Reduce data storage and processing costs', 'Medium', 78, 65, 'Achieve 40% cost reduction in data platform operations', GETUTCDATE(), 3),
('Self-Service Analytics', 'Enable business users to create their own reports', 'Medium', 75, 60, 'Reduce IT backlog and improve business agility', GETUTCDATE(), 3),

-- Healthcare Drivers (Assessment 4)
('Patient Experience', 'Improve patient satisfaction and care coordination', 'High', 90, 80, 'Increase patient satisfaction scores by 25%', GETUTCDATE(), 4),
('Clinical Efficiency', 'Reduce administrative burden on healthcare providers', 'High', 88, 85, 'Save 2 hours per day per clinician on administrative tasks', GETUTCDATE(), 4),
('Interoperability', 'Enable seamless data sharing between healthcare systems', 'Critical', 95, 90, 'Improve care coordination and reduce medical errors', GETUTCDATE(), 4),

-- Manufacturing Drivers (Assessment 5)
('Operational Excellence', 'Achieve world-class manufacturing efficiency', 'High', 92, 85, 'Increase OEE from 75% to 90% across all facilities', GETUTCDATE(), 5),
('Predictive Maintenance', 'Reduce unplanned downtime through predictive analytics', 'Critical', 95, 88, 'Reduce unplanned downtime from 15% to 5%', GETUTCDATE(), 5),
('Quality Improvement', 'Improve product quality and reduce defects', 'High', 85, 75, 'Reduce defect rate by 50% and improve customer satisfaction', GETUTCDATE(), 5);

-- Insert Stakeholders  
INSERT INTO Stakeholders (Name, Role, Department, Email, InfluenceLevel, InterestLevel, Notes, CreatedDate, AssessmentId) VALUES 
-- E-Commerce Stakeholders (Assessment 1)
('Jennifer Chen', 'Chief Technology Officer', 'Technology', 'jennifer.chen@ecommerce.com', 'High', 'High', 'Strong advocate for microservices architecture and cloud-native solutions', GETUTCDATE(), 1),
('Marcus Rodriguez', 'VP of Engineering', 'Technology', 'marcus.rodriguez@ecommerce.com', 'High', 'High', 'Focused on scalability and performance optimization', GETUTCDATE(), 1),
('Sarah Kim', 'Chief Marketing Officer', 'Marketing', 'sarah.kim@ecommerce.com', 'Medium', 'High', 'Interested in customer experience improvements and mobile optimization', GETUTCDATE(), 1),
('David Park', 'Head of Operations', 'Operations', 'david.park@ecommerce.com', 'Medium', 'Medium', 'Concerned about system reliability during peak seasons', GETUTCDATE(), 1),

-- Banking Stakeholders (Assessment 2)
('Robert Martinez', 'Chief Information Officer', 'Technology', 'robert.martinez@regionalbank.com', 'High', 'High', 'Leading the digital transformation initiative', GETUTCDATE(), 2),
('Lisa Thompson', 'Chief Risk Officer', 'Risk Management', 'lisa.thompson@regionalbank.com', 'High', 'High', 'Focused on regulatory compliance and risk mitigation', GETUTCDATE(), 2),
('Michael Brown', 'VP of Operations', 'Operations', 'michael.brown@regionalbank.com', 'Medium', 'High', 'Interested in operational efficiency improvements', GETUTCDATE(), 2),

-- Data Platform Stakeholders (Assessment 3)
('Dr. Amanda Foster', 'Chief Data Officer', 'Data & Analytics', 'amanda.foster@manufacturing.com', 'High', 'High', 'Champion of data-driven decision making and ML initiatives', GETUTCDATE(), 3),
('James Wilson', 'VP of Analytics', 'Data & Analytics', 'james.wilson@manufacturing.com', 'High', 'High', 'Technical lead for analytics platform migration', GETUTCDATE(), 3),
('Karen Zhang', 'Business Intelligence Manager', 'Finance', 'karen.zhang@manufacturing.com', 'Medium', 'High', 'Primary user of analytics platform for financial reporting', GETUTCDATE(), 3),

-- Healthcare Stakeholders (Assessment 4)
('Dr. Emily Johnson', 'Chief Medical Officer', 'Clinical Operations', 'emily.johnson@healthnetwork.org', 'High', 'High', 'Champion for clinical workflow improvements and patient safety', GETUTCDATE(), 4),
('Steven Davis', 'Chief Information Officer', 'Technology', 'steven.davis@healthnetwork.org', 'High', 'High', 'Leading healthcare IT modernization efforts', GETUTCDATE(), 4),
('Maria Gonzalez', 'Director of Nursing', 'Clinical Operations', 'maria.gonzalez@healthnetwork.org', 'Medium', 'High', 'Focused on nurse workflow efficiency and patient care quality', GETUTCDATE(), 4),

-- Manufacturing Stakeholders (Assessment 5)
('John Anderson', 'Chief Operations Officer', 'Manufacturing', 'john.anderson@manufacturing.com', 'High', 'High', 'Driving operational excellence and lean manufacturing initiatives', GETUTCDATE(), 5),
('Patricia Liu', 'VP of Manufacturing', 'Operations', 'patricia.liu@manufacturing.com', 'High', 'High', 'Responsible for production efficiency and quality metrics', GETUTCDATE(), 5),
('Thomas Green', 'Director of Maintenance', 'Maintenance', 'thomas.green@manufacturing.com', 'Medium', 'High', 'Interested in predictive maintenance and equipment reliability', GETUTCDATE(), 5);

-- Insert Recommendations
INSERT INTO Recommendations (
    Title, Description, Category, Priority, Effort, EstimatedCost, PotentialSavings, 
    TimeframeWeeks, Implementation, Benefits, Risks, IsAccepted, CreatedDate, AssessmentId
) VALUES 
-- E-Commerce Recommendations (Assessment 1)
('Migrate to Azure App Service', 
 'Move React frontend to Azure App Service with auto-scaling capabilities', 
 'Modernization', 'High', 'Medium', 125000.00, 180000.00, 12, 
 'Use Azure DevOps pipelines for CI/CD, implement blue-green deployment strategy',
 'Improved scalability, reduced infrastructure management overhead, better performance during peak traffic',
 'Temporary service disruption during migration, learning curve for ops team',
 0, GETUTCDATE(), 1),

('Implement Microservices Architecture', 
 'Break down monolithic order management system into domain-specific microservices', 
 'Architecture', 'High', 'Large', 285000.00, 450000.00, 24, 
 'Use containerization with Docker and Kubernetes, implement API gateway pattern',
 'Better scalability, independent deployments, improved fault tolerance, team autonomy',
 'Increased complexity in service orchestration, potential performance overhead from network calls',
 0, GETUTCDATE(), 1),

('Implement CDN and Caching Strategy', 
 'Deploy Azure CDN and implement Redis caching for improved performance', 
 'Performance', 'Medium', 'Small', 45000.00, 85000.00, 6,
 'Configure Azure CDN for static assets, implement Redis for session and catalog caching',
 'Faster page load times, reduced server load, improved customer experience globally',
 'Cache invalidation complexity, increased monitoring requirements',
 1, GETUTCDATE(), 1),

-- Banking Recommendations (Assessment 2)
('Phased COBOL Modernization', 
 'Modernize COBOL systems using a strangler fig pattern with .NET Core', 
 'Modernization', 'Critical', 'XLarge', 1200000.00, 1800000.00, 78, 
 'Start with customer-facing services, gradually replace backend modules, maintain data consistency',
 'Reduced maintenance costs, improved developer productivity, better regulatory compliance capabilities',
 'High complexity, potential data migration issues, extended timeline',
 0, GETUTCDATE(), 2),

('Implement API Management Layer', 
 'Create secure API gateway for modern applications to access legacy systems', 
 'Integration', 'High', 'Medium', 185000.00, 320000.00, 16,
 'Use Azure API Management with OAuth2 authentication and rate limiting',
 'Secure legacy system access, enables mobile and web applications, improved monitoring',
 'Additional complexity layer, potential single point of failure',
 1, GETUTCDATE(), 2),

-- Data Platform Recommendations (Assessment 3)  
('Migrate to Azure Synapse Analytics', 
 'Move from on-premises SQL Server to Azure Synapse with real-time capabilities', 
 'Modernization', 'High', 'Large', 95000.00, 285000.00, 20,
 'Use Azure Data Factory for data migration, implement incremental loading patterns',
 'Massive parallel processing, pay-as-you-scale pricing, integrated with Power BI',
 'Learning curve for new platform, potential query performance differences',
 1, GETUTCDATE(), 3),

('Implement Data Mesh Architecture', 
 'Decentralize data ownership with domain-specific data products', 
 'Architecture', 'Medium', 'Large', 165000.00, 225000.00, 32,
 'Create domain-specific data teams, implement data product interfaces, establish data governance',
 'Better data quality, faster time-to-market for analytics, reduced bottlenecks',
 'Organizational change required, potential data duplication, governance complexity',
 0, GETUTCDATE(), 3),

-- Healthcare Recommendations (Assessment 4)
('Implement FHIR Standards', 
 'Adopt HL7 FHIR for interoperable healthcare data exchange', 
 'Integration', 'High', 'Large', 285000.00, 425000.00, 28,
 'Implement FHIR APIs, create patient data mapping, establish security protocols',
 'Improved interoperability, reduced integration costs, better patient outcomes',
 'Complex data mapping, potential performance impact, staff training requirements',
 0, GETUTCDATE(), 4),

('Cloud Migration with HIPAA Compliance', 
 'Migrate to Azure Government Cloud with full HIPAA compliance', 
 'Modernization', 'High', 'Large', 385000.00, 580000.00, 36,
 'Use Azure Government regions, implement zero-trust security model, establish compliance monitoring',
 'Reduced infrastructure costs, improved scalability, enhanced security and compliance',
 'Regulatory approval timeline, data migration complexity, staff training requirements',
 0, GETUTCDATE(), 4),

-- Manufacturing Recommendations (Assessment 5)
('Implement Azure IoT Hub', 
 'Deploy comprehensive IoT platform for equipment monitoring and predictive maintenance', 
 'IoT', 'High', 'Large', 125000.00, 1200000.00, 20,
 'Connect 500+ machines, implement edge computing, create ML models for predictive maintenance',
 'Reduced unplanned downtime, optimized maintenance schedules, improved OEE',
 'Network connectivity requirements, sensor installation complexity, change management',
 1, GETUTCDATE(), 5),

('Modernize ERP Integration', 
 'Replace legacy SAP interfaces with modern API-based integration platform', 
 'Integration', 'Medium', 'Medium', 185000.00, 285000.00, 16,
 'Implement Azure Logic Apps for workflow automation, create real-time dashboards',
 'Real-time production visibility, reduced manual data entry, improved decision making',
 'ERP system dependencies, potential integration points failure, testing complexity',
 0, GETUTCDATE(), 5);

SELECT 'Comprehensive seed data inserted successfully' as Status;
-- Timeline Items and Risk Data
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
-- Architecture Review Data
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