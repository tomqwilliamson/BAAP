-- Enhanced Data Seeding Script with Mock Data
-- This script populates the database with comprehensive mock data extracted from React components

-- Clear existing data to ensure clean seeding
DELETE FROM SecurityFindings;
DELETE FROM Recommendations;
DELETE FROM BusinessDrivers;
DELETE FROM Stakeholders;
DELETE FROM Applications;
DELETE FROM Assessments;

-- Reset identity seeds
DBCC CHECKIDENT ('Assessments', RESEED, 0);
DBCC CHECKIDENT ('Applications', RESEED, 0);
DBCC CHECKIDENT ('SecurityFindings', RESEED, 0);
DBCC CHECKIDENT ('BusinessDrivers', RESEED, 0);
DBCC CHECKIDENT ('Stakeholders', RESEED, 0);
DBCC CHECKIDENT ('Recommendations', RESEED, 0);

-- Insert Assessments
INSERT INTO Assessments (Name, Description, Status, CreatedDate, StartedDate, EstimatedCost, PotentialSavings, OverallScore, SecurityScore, CloudReadinessScore)
VALUES 
('Q4 2024 Portfolio Assessment', 
 'Comprehensive assessment of the application portfolio for cloud migration readiness and optimization opportunities.',
 'Completed', 
 '2024-12-15T10:30:00Z', 
 '2024-12-16T10:30:00Z',
 3200000, 
 1240000, 
 76, 
 68, 
 72),

('Security Compliance Review', 
 'Security-focused assessment to identify vulnerabilities and compliance gaps across key applications.',
 'InProgress', 
 '2024-12-18T14:45:00Z', 
 '2024-12-19T14:45:00Z',
 1500000, 
 850000, 
 68, 
 65, 
 70),

('Cloud Migration Readiness', 
 'Evaluation of legacy systems for cloud migration potential and modernization strategies.',
 'Analyzing', 
 '2024-12-20T09:15:00Z', 
 '2024-12-21T09:15:00Z',
 4500000, 
 2100000, 
 82, 
 75, 
 85);

-- Insert Applications
INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId, LastAnalyzedDate)
VALUES 
('Customer Portal Web App', 
 'Customer-facing web application for account management and support',
 'React SPA', 
 'Customer-Facing', 
 'React, Node.js, PostgreSQL', 
 45000, 
 72, 
 72, 
 85, 
 125000, 
 2400, 
 1, 
 '2024-12-20T10:30:00Z'),

('Internal ERP System', 
 'Internal HR management system',
 '.NET Core API', 
 'Business Critical', 
 '.NET Core, SQL Server', 
 89000, 
 85, 
 60, 
 72, 
 275000, 
 5200, 
 1, 
 '2024-12-19T14:15:00Z'),

('Mobile Banking App', 
 'Mobile application for banking services',
 'React Native', 
 'Customer-Facing', 
 'React Native, Express.js, MongoDB', 
 62000, 
 68, 
 88, 
 91, 
 85000, 
 1800, 
 2, 
 '2024-12-18T09:45:00Z'),

('Legacy Payment Gateway', 
 'Critical payment processing system',
 'Java Spring', 
 'Business Critical', 
 'Java, Spring Boot, Oracle DB', 
 125000, 
 92, 
 45, 
 58, 
 450000, 
 8500, 
 3, 
 '2024-12-17T16:20:00Z'),

('Employee Management System', 
 'HR management and payroll system',
 'ASP.NET MVC', 
 'Internal', 
 '.NET Framework 4.8, SQL Server', 
 67800, 
 78, 
 55, 
 60, 
 180000, 
 4200, 
 1, 
 '2024-12-16T11:00:00Z'),

('Data Analytics Platform', 
 'Business intelligence and reporting platform',
 'Python Django', 
 'Business Intelligence', 
 'Python, Django, PostgreSQL, Redis', 
 89500, 
 85, 
 75, 
 80, 
 200000, 
 3800, 
 2, 
 '2024-12-15T13:20:00Z'),

('E-commerce API', 
 'Backend API for e-commerce operations',
 'Node.js API', 
 'Customer-Facing', 
 'Node.js, Express, MongoDB', 
 58900, 
 70, 
 68, 
 82, 
 110000, 
 2100, 
 1, 
 '2024-12-14T16:45:00Z'),

('Document Management System', 
 'Internal document storage and collaboration',
 'SharePoint', 
 'Internal', 
 'SharePoint, SQL Server', 
 25600, 
 60, 
 62, 
 55, 
 95000, 
 1500, 
 3, 
 '2024-12-13T10:15:00Z');

-- Insert Security Findings
INSERT INTO SecurityFindings (Title, Description, Severity, Category, FileName, LineNumber, Source, ApplicationId)
VALUES 
('SQL Injection Vulnerability', 'User input is not properly sanitized in database queries', 'Critical', 'A03:2021 – Injection', 'SearchController.cs', 45, 'SAST', 1),
('Cross-Site Scripting (XSS)', 'Reflected XSS in user profile page', 'High', 'A07:2021 – Cross-Site Scripting', 'profile.js', 123, 'DAST', 1),
('Missing Security Headers', 'Essential security headers not implemented', 'Medium', 'A05:2021 – Security Misconfiguration', 'web.config', 15, 'Manual Review', 1),
('Weak Password Policy', 'Password requirements do not meet security standards', 'High', 'A07:2021 – Identification and Authentication Failures', 'AuthService.cs', 78, 'Code Review', 2),
('Outdated Dependencies', 'Multiple dependencies with known vulnerabilities', 'Medium', 'A06:2021 – Vulnerable Components', 'package.json', 1, 'Dependency Check', 2),
('Insecure Direct Object References', 'Users can access unauthorized resources', 'High', 'A01:2021 – Broken Access Control', 'UserController.java', 156, 'Penetration Test', 4),
('Hard-coded Secrets', 'API keys and secrets hard-coded in source', 'Critical', 'A02:2021 – Cryptographic Failures', 'config.java', 23, 'Secret Scanner', 4),
('Missing Input Validation', 'User inputs not properly validated', 'Medium', 'A03:2021 – Injection', 'FormHandler.cs', 89, 'Code Review', 2),
('Insufficient Logging', 'Security events not properly logged', 'Low', 'A09:2021 – Security Logging Failures', 'Logger.py', 67, 'Audit', 6),
('Broken Authentication', 'Session management vulnerabilities', 'High', 'A07:2021 – Identification and Authentication Failures', 'auth.js', 234, 'DAST', 3);

-- Insert Business Drivers
INSERT INTO BusinessDrivers (Name, Description, Priority, Impact, Urgency, BusinessValue, AssessmentId)
VALUES 
('Digital Transformation Acceleration', 'Modernize core business applications to support digital-first customer experiences', 'Critical', 95, 88, 'Competitive advantage and customer satisfaction', 1),
('Cost Optimization', 'Reduce operational costs through cloud migration and infrastructure optimization', 'High', 82, 75, 'Annual savings of $800,000+ on infrastructure', 1),
('Security Compliance', 'Achieve regulatory compliance and improve security posture', 'Critical', 90, 92, 'Risk mitigation and regulatory compliance', 2),
('Scalability Requirements', 'Support business growth through scalable infrastructure', 'High', 78, 70, 'Enable 3x business growth without infrastructure constraints', 1),
('Innovation Enablement', 'Enable faster time-to-market for new products and features', 'Medium', 75, 65, 'Reduce development cycles from 6 months to 2 months', 3),
('Disaster Recovery Improvement', 'Enhance business continuity and disaster recovery capabilities', 'High', 85, 80, 'Reduce RTO from 24 hours to 4 hours', 2);

-- Insert Stakeholders
INSERT INTO Stakeholders (Name, Role, Department, Email, InfluenceLevel, InterestLevel, AssessmentId)
VALUES 
('John Smith', 'CTO', 'Technology', 'john.smith@company.com', 'High', 'High', 1),
('Sarah Johnson', 'Head of Digital', 'Digital', 'sarah.johnson@company.com', 'High', 'High', 1),
('Michael Brown', 'CISO', 'Security', 'michael.brown@company.com', 'High', 'High', 2),
('Emily Davis', 'VP of Operations', 'Operations', 'emily.davis@company.com', 'Medium', 'High', 1),
('Robert Wilson', 'Lead Developer', 'Development', 'robert.wilson@company.com', 'Medium', 'High', 1),
('Lisa Anderson', 'Security Architect', 'Security', 'lisa.anderson@company.com', 'Medium', 'High', 2),
('David Martinez', 'Infrastructure Manager', 'IT Infrastructure', 'david.martinez@company.com', 'Medium', 'Medium', 3),
('Jennifer Lee', 'Business Analyst', 'Business', 'jennifer.lee@company.com', 'Low', 'Medium', 1);

-- Insert Recommendations
INSERT INTO Recommendations (Title, Description, Category, Priority, Effort, EstimatedCost, PotentialSavings, TimeframeWeeks, AssessmentId)
VALUES 
('Implement Zero Trust Security Model', 'Deploy comprehensive zero trust architecture to enhance security posture', 'Security', 'Critical', 'Large', 250000, 500000, 16, 1),
('Containerize Legacy Applications', 'Modernize applications using Docker containers for better scalability', 'Modernization', 'High', 'Medium', 180000, 300000, 12, 1),
('Cloud Migration Strategy', 'Develop and execute comprehensive cloud migration plan', 'Infrastructure', 'Critical', 'Large', 650000, 1200000, 52, 1),
('Security Posture Enhancement', 'Address critical security vulnerabilities across all applications', 'Security', 'Critical', 'Medium', 200000, 800000, 20, 2),
('DevOps Pipeline Optimization', 'Implement advanced CI/CD practices and infrastructure automation', 'DevOps', 'High', 'Medium', 120000, 250000, 8, 1),
('Database Modernization', 'Upgrade and optimize database systems for cloud readiness', 'Database', 'High', 'Large', 300000, 400000, 24, 3),
('API Gateway Implementation', 'Deploy centralized API management and security gateway', 'Architecture', 'Medium', 'Medium', 80000, 150000, 10, 1),
('Monitoring and Observability', 'Implement comprehensive monitoring and alerting solutions', 'Infrastructure', 'High', 'Small', 50000, 100000, 6, 1),
('Identity and Access Management', 'Modernize IAM systems with single sign-on and MFA', 'Security', 'High', 'Medium', 150000, 300000, 14, 2),
('Backup and Disaster Recovery', 'Implement automated backup and disaster recovery systems', 'Infrastructure', 'High', 'Medium', 100000, 200000, 12, 3);

-- Create dashboard metrics view for quick access
CREATE OR ALTER VIEW vw_DashboardMetrics AS
SELECT 
    COUNT(DISTINCT a.Id) as TotalApplications,
    AVG(CAST(a.OverallScore as FLOAT)) as AverageScore,
    COUNT(CASE WHEN sf.Severity = 'Critical' THEN 1 END) as CriticalIssues,
    SUM(ISNULL(ass.PotentialSavings, 0)) as PotentialSavings,
    COUNT(CASE WHEN ass.Status = 'Completed' THEN 1 END) * 100.0 / COUNT(*) as AssessmentProgress,
    COUNT(sf.Id) as SecurityIssues,
    AVG(CAST(a.CloudReadinessScore as FLOAT)) as CloudReadiness
FROM Assessments ass
LEFT JOIN Applications a ON ass.Id = a.AssessmentId
LEFT JOIN SecurityFindings sf ON a.Id = sf.ApplicationId;

-- Create portfolio summary view
CREATE OR ALTER VIEW vw_PortfolioSummary AS
SELECT 
    a.Id,
    a.Name,
    a.Type,
    a.Category,
    a.Technology,
    a.LinesOfCode,
    a.ComplexityScore,
    a.SecurityRating,
    a.CloudReadinessScore,
    a.EstimatedMigrationCost,
    a.MonthlyCost,
    a.LastAnalyzedDate,
    COUNT(CASE WHEN sf.Severity = 'Critical' THEN 1 END) as CriticalFindings,
    COUNT(CASE WHEN sf.Severity = 'High' THEN 1 END) as HighFindings,
    ass.Name as AssessmentName,
    ass.Status as AssessmentStatus
FROM Applications a
LEFT JOIN SecurityFindings sf ON a.Id = sf.ApplicationId
LEFT JOIN Assessments ass ON a.AssessmentId = ass.Id
GROUP BY 
    a.Id, a.Name, a.Type, a.Category, a.Technology, a.LinesOfCode,
    a.ComplexityScore, a.SecurityRating, a.CloudReadinessScore,
    a.EstimatedMigrationCost, a.MonthlyCost, a.LastAnalyzedDate,
    ass.Name, ass.Status;

PRINT 'Mock data seeding completed successfully!';
PRINT 'Created views: vw_DashboardMetrics, vw_PortfolioSummary';