-- Minimal Seed Data Script - Core Tables Only
-- This script only includes the tables that we know work correctly

-- Clear existing data (optional - comment out if not needed)
-- DELETE FROM Applications;
-- DELETE FROM BusinessDrivers; 
-- DELETE FROM Stakeholders;
-- DELETE FROM Assessments;

-- 1. ASSESSMENTS (Core assessment records)
PRINT 'Seeding Assessments...'
IF NOT EXISTS (SELECT 1 FROM Assessments)
BEGIN
    INSERT INTO Assessments (Name, [Type], [Description], [Status], CreatedDate, OverallScore, InfrastructureScore, SecurityScore, CodeQualityScore, DevOpsMaturityScore, CloudReadinessScore, DatabaseOptimizationScore, DocumentationScore, EstimatedCost, PotentialSavings, ApplicationCount, BusinessObjective, [Scope], Timeline, Budget, BusinessContext, Notes, StartedDate, CompletedDate, LastModifiedDate) VALUES
    ('E-Commerce Platform Assessment', 'Application Modernization', 'Comprehensive assessment of legacy e-commerce platform for cloud migration and modernization opportunities', 'In Progress', GETDATE(), 78, 82, 75, 80, 70, 85, 77, 65, 2500000.00, 800000.00, 4, 'Modernize customer-facing e-commerce platform to improve performance, scalability, and user experience', 'Frontend applications, payment processing, inventory management, customer portal', '18 months', 2500000.00, 'Digital transformation initiative to compete with modern e-commerce platforms', 'High priority project with Q2 2026 deadline', DATEADD(month, -2, GETDATE()), NULL, GETDATE()),
    ('Financial Services Legacy Modernization', 'Legacy System Modernization', 'Assessment of COBOL-based core banking system for modernization to cloud-native architecture', 'In Progress', GETDATE(), 62, 45, 85, 35, 25, 40, 88, 55, 4200000.00, 1500000.00, 4, 'Modernize core banking infrastructure to reduce operational costs and improve regulatory compliance', 'Core banking system, customer portals, regulatory reporting, mobile applications', '24 months', 4200000.00, 'Critical infrastructure modernization to meet regulatory requirements and improve customer experience', 'Regulatory deadline of Q4 2026', DATEADD(month, -1, GETDATE()), NULL, GETDATE()),
    ('Enterprise Data Platform Modernization', 'Data Platform Migration', 'Migration of on-premises data warehouse to cloud-native data platform with advanced analytics capabilities', 'Planning', GETDATE(), 85, 78, 70, 85, 82, 88, 62, 88, 3800000.00, 1200000.00, 3, 'Transform data infrastructure to enable real-time analytics and machine learning capabilities', 'Data warehouse, ETL processes, business intelligence, analytics platform', '15 months', 3800000.00, 'Strategic data transformation to enable data-driven decision making across the organization', 'Business intelligence modernization initiative', DATEADD(week, -2, GETDATE()), NULL, GETDATE()),
    ('Manufacturing IoT Integration', 'IoT Implementation', 'Implementation of IoT sensors and predictive maintenance system across manufacturing facilities', 'Planning', GETDATE(), 72, 68, 65, 58, 45, 75, 42, 62, 1800000.00, 600000.00, 3, 'Implement IoT infrastructure to improve operational efficiency and reduce equipment downtime', 'Equipment monitoring, predictive maintenance, real-time dashboards, mobile applications', '12 months', 1800000.00, 'Industry 4.0 transformation to improve manufacturing efficiency and reduce maintenance costs', 'Part of broader digital transformation strategy', GETDATE(), NULL, GETDATE()),
    ('Healthcare Application Modernization', 'Healthcare IT Modernization', 'HIPAA-compliant modernization of electronic medical records and patient management systems', 'In Progress', GETDATE(), 68, 55, 92, 65, 38, 62, 78, 75, 3200000.00, 950000.00, 3, 'Modernize healthcare IT infrastructure to improve patient care and regulatory compliance', 'EMR system, patient portal, telemedicine platform, mobile applications', '20 months', 3200000.00, 'Critical healthcare infrastructure modernization to improve patient outcomes and operational efficiency', 'HIPAA compliance and telemedicine expansion focus', DATEADD(month, -1, GETDATE()), NULL, GETDATE());
    
    PRINT 'Inserted 5 Assessment records'
END

-- 2. APPLICATIONS (Applications within each assessment)
PRINT 'Seeding Applications...'
IF NOT EXISTS (SELECT 1 FROM Applications)
BEGIN
    INSERT INTO Applications (Name, [Type], Category, Technology, [Description], ComplexityScore, EstimatedMigrationCost, MonthlyCost, AssessmentId, CreatedDate, LinesOfCode, SecurityRating, CloudReadinessScore) VALUES
    -- E-Commerce Platform Applications (Assessment 1)
    ('Customer Portal Frontend', 'Web Application', 'Frontend', 'JavaScript React', 'Customer-facing e-commerce website with product catalog and checkout', 65, 450000.00, 12000.00, 1, GETDATE(), 45000, 7, 8),
    ('Payment Processing API', 'API Service', 'Backend', 'C# .NET Core', 'Secure payment processing and transaction management', 85, 680000.00, 8500.00, 1, GETDATE(), 28000, 9, 7),
    ('Inventory Management System', 'Desktop Application', 'Desktop', 'C# .NET Framework', 'Legacy inventory tracking and management system', 90, 520000.00, 15000.00, 1, GETDATE(), 65000, 6, 5),
    ('Order Management Service', 'Web Service', 'Backend', 'Java Spring Boot', 'Order processing and fulfillment workflows', 70, 380000.00, 9500.00, 1, GETDATE(), 35000, 8, 8),
    
    -- Financial Services Applications (Assessment 2)
    ('Core Banking System', 'Mainframe Application', 'Legacy', 'COBOL CICS', 'Legacy core banking transaction processing system', 95, 1200000.00, 45000.00, 2, GETDATE(), 180000, 8, 3),
    ('Customer Account Portal', 'Web Application', 'Frontend', 'Java JSF', 'Online banking interface for customers', 70, 420000.00, 18000.00, 2, GETDATE(), 52000, 7, 6),
    ('Regulatory Reporting System', 'Batch Processing', 'Backend', 'COBOL JCL', 'Automated regulatory compliance reporting', 85, 850000.00, 22000.00, 2, GETDATE(), 95000, 9, 4),
    ('Mobile Banking App', 'Mobile Application', 'Mobile', 'Swift Kotlin', 'Mobile banking application for iOS and Android', 65, 380000.00, 12000.00, 2, GETDATE(), 38000, 8, 7),
    
    -- Data Platform Applications (Assessment 3)
    ('Data Warehouse ETL', 'ETL Process', 'Data', 'SQL SSIS', 'Extract, transform, load processes for data warehouse', 80, 720000.00, 25000.00, 3, GETDATE(), 75000, 6, 6),
    ('Business Intelligence Dashboard', 'Analytics Platform', 'Analytics', 'Python Power BI', 'Executive dashboards and business intelligence reports', 60, 450000.00, 15000.00, 3, GETDATE(), 32000, 7, 8),
    ('Real-time Analytics Engine', 'Stream Processing', 'Data', 'Scala Apache Spark', 'Real-time data processing and analytics', 85, 620000.00, 20000.00, 3, GETDATE(), 48000, 8, 7),
    
    -- Manufacturing IoT Applications (Assessment 4)
    ('Equipment Monitoring System', 'IoT Platform', 'IoT', 'C++ Custom', 'Real-time equipment monitoring and alerting', 70, 380000.00, 14000.00, 4, GETDATE(), 42000, 7, 7),
    ('Production Planning Tool', 'Desktop Application', 'Desktop', 'C# WinForms', 'Production scheduling and resource planning', 65, 320000.00, 11000.00, 4, GETDATE(), 35000, 6, 5),
    ('Quality Control Dashboard', 'Web Application', 'Frontend', 'JavaScript Angular', 'Quality metrics and defect tracking system', 45, 180000.00, 6500.00, 4, GETDATE(), 22000, 8, 8),
    
    -- Healthcare Applications (Assessment 5)
    ('Electronic Medical Records', 'Web Application', 'Healthcare', 'C# ASP.NET MVC', 'Patient medical records and clinical documentation', 95, 980000.00, 35000.00, 5, GETDATE(), 120000, 9, 6),
    ('Patient Portal', 'Web Application', 'Frontend', 'JavaScript Vue.js', 'Patient access to medical records and appointment scheduling', 60, 420000.00, 16000.00, 5, GETDATE(), 28000, 8, 7),
    ('Telemedicine Platform', 'Web Application', 'Healthcare', 'TypeScript React', 'Video consultation and remote patient monitoring', 75, 650000.00, 22000.00, 5, GETDATE(), 55000, 9, 8);
    
    PRINT 'Inserted 17 Application records'
END

-- 3. BUSINESS DRIVERS (Strategic business drivers for each assessment)
PRINT 'Seeding Business Drivers...'
IF NOT EXISTS (SELECT 1 FROM BusinessDrivers)
BEGIN
    INSERT INTO BusinessDrivers ([Name], [Description], Priority, Impact, Urgency, BusinessValue, CreatedDate, AssessmentId) VALUES
    -- E-Commerce Platform Business Drivers
    ('Digital Customer Experience', 'Improve online customer experience to increase conversion rates and customer satisfaction', 'High', 9, 8, 'Expected 25% increase in online conversion rates and 40% improvement in customer satisfaction scores', GETDATE(), 1),
    ('Scalability for Peak Seasons', 'Handle Black Friday and holiday traffic spikes without performance degradation', 'High', 8, 9, 'Prevent revenue loss during peak seasons, estimated $2M in additional sales', GETDATE(), 1),
    ('Payment Security Enhancement', 'Implement advanced payment security to reduce fraud and improve customer trust', 'High', 9, 7, 'Reduce payment fraud by 60% and improve customer trust metrics', GETDATE(), 1),
    
    -- Financial Services Business Drivers
    ('Regulatory Compliance', 'Meet evolving banking regulations and reduce compliance costs', 'Critical', 10, 9, 'Avoid regulatory fines and reduce compliance operational costs by 30%', GETDATE(), 2),
    ('Digital Banking Innovation', 'Launch modern digital banking services to compete with fintech companies', 'High', 8, 8, 'Acquire 100,000 new digital customers and increase digital engagement by 50%', GETDATE(), 2),
    ('Operational Cost Reduction', 'Reduce IT infrastructure and maintenance costs through modernization', 'Medium', 7, 6, '40% reduction in IT operational costs over 3 years', GETDATE(), 2),
    
    -- Data Platform Business Drivers
    ('Real-time Analytics', 'Enable real-time business intelligence and decision making capabilities', 'High', 9, 7, 'Improve decision-making speed by 70% and enable predictive analytics', GETDATE(), 3),
    ('Data Governance & Quality', 'Implement comprehensive data governance and improve data quality', 'High', 8, 8, 'Improve data accuracy to 99.5% and ensure regulatory data compliance', GETDATE(), 3),
    ('Advanced Analytics & ML', 'Enable machine learning and advanced analytics for business insights', 'Medium', 8, 6, 'Generate $5M in additional revenue through data-driven insights', GETDATE(), 3),
    
    -- Manufacturing IoT Business Drivers
    ('Predictive Maintenance', 'Reduce equipment downtime through predictive maintenance capabilities', 'High', 9, 8, '30% reduction in unplanned downtime and 25% decrease in maintenance costs', GETDATE(), 4),
    ('Operational Efficiency', 'Improve overall equipment effectiveness and production efficiency', 'High', 8, 7, '15% improvement in OEE and 20% increase in production throughput', GETDATE(), 4),
    
    -- Healthcare Business Drivers
    ('Patient Care Quality', 'Improve patient care quality and clinical outcomes through better technology', 'Critical', 10, 9, 'Improve patient satisfaction scores by 30% and reduce clinical errors', GETDATE(), 5),
    ('HIPAA Compliance', 'Ensure full HIPAA compliance and data security for patient information', 'Critical', 10, 10, 'Avoid regulatory penalties and maintain patient trust', GETDATE(), 5),
    ('Telemedicine Expansion', 'Expand telemedicine capabilities to serve more patients remotely', 'High', 8, 8, 'Serve 40% more patients through telemedicine and improve access to care', GETDATE(), 5);
    
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
    
    -- Financial Services Stakeholders
    ('Robert Johnson', 'Chief Information Officer', 'Technology', 'r.johnson@bank.com', 'High', 'High', 'IT strategy and technology modernization leader', GETDATE(), 2),
    ('Lisa Thompson', 'VP of Compliance', 'Compliance', 'l.thompson@bank.com', 'High', 'High', 'Ensures regulatory compliance across all systems', GETDATE(), 2),
    ('Michael Brown', 'Core Banking Manager', 'Operations', 'm.brown@bank.com', 'High', 'High', 'Oversees critical banking operations and systems', GETDATE(), 2),
    
    -- Data Platform Stakeholders
    ('Dr. James Wilson', 'Chief Data Officer', 'Data & Analytics', 'j.wilson@corp.com', 'High', 'High', 'Strategic leader for data and analytics initiatives', GETDATE(), 3),
    ('Maria Garcia', 'Data Engineering Manager', 'Engineering', 'm.garcia@corp.com', 'High', 'High', 'Technical lead for data platform architecture', GETDATE(), 3),
    
    -- Manufacturing IoT Stakeholders
    ('Susan Miller', 'Plant Manager', 'Manufacturing', 's.miller@mfg.com', 'High', 'High', 'Operations leader focused on efficiency and safety', GETDATE(), 4),
    ('Tom Anderson', 'IoT Solutions Architect', 'Technology', 't.anderson@mfg.com', 'High', 'High', 'Technical expert in IoT and automation systems', GETDATE(), 4),
    
    -- Healthcare Stakeholders
    ('Dr. Patricia Adams', 'Chief Medical Officer', 'Clinical', 'p.adams@hospital.org', 'High', 'High', 'Clinical leader championing patient care improvements', GETDATE(), 5),
    ('John Martinez', 'IT Director', 'Information Technology', 'j.martinez@hospital.org', 'High', 'High', 'IT infrastructure and security oversight', GETDATE(), 5),
    ('Steven Clark', 'Privacy Officer', 'Compliance', 's.clark@hospital.org', 'High', 'Medium', 'HIPAA compliance and data privacy oversight', GETDATE(), 5);
    
    PRINT 'Inserted 14 Stakeholder records'
END

PRINT ''
PRINT '🎉 Minimal seed data insertion completed successfully!'
PRINT ''
PRINT 'Summary:'
PRINT '- 5 Assessments created'
PRINT '- 17 Applications created' 
PRINT '- 14 Business Drivers created'
PRINT '- 14 Stakeholders created'
PRINT ''
PRINT 'Total: 50 records inserted'