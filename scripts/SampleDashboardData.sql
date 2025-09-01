-- Sample data to populate dashboard with realistic metrics

-- Update existing assessments with better scores and metrics
UPDATE Assessments 
SET 
    OverallScore = 78,
    SecurityScore = 82,
    CloudReadinessScore = 75,
    PotentialSavings = 125000.00,
    Status = 'Completed'
WHERE Id = 1;

UPDATE Assessments 
SET 
    OverallScore = 65,
    SecurityScore = 58,
    CloudReadinessScore = 62,
    PotentialSavings = 89000.00,
    Status = 'In Progress'
WHERE Id = 2;

UPDATE Assessments 
SET 
    OverallScore = 91,
    SecurityScore = 88,
    CloudReadinessScore = 94,
    PotentialSavings = 210000.00,
    Status = 'Completed'
WHERE Id = 3;

-- Add some applications if they don't exist (for Assessment 1 - E-Commerce Platform)
INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Customer Portal', 'Main customer-facing web application', 'React SPA', 'Customer-Facing', 'React, Node.js', 45000, 7, 6, 8, 25000.00, 1200.00, 1
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Customer Portal' AND AssessmentId = 1);

INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Admin Dashboard', 'Internal admin management system', 'ASP.NET MVC', 'Internal', 'C#, SQL Server', 32000, 6, 7, 7, 18000.00, 800.00, 1
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Admin Dashboard' AND AssessmentId = 1);

INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Mobile API', 'REST API for mobile applications', 'Web API', 'Integration', 'C#, .NET Core', 28000, 5, 8, 9, 15000.00, 650.00, 1
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Mobile API' AND AssessmentId = 1);

-- Add some applications for Assessment 2 (Financial Services Security)
INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Core Banking System', 'Main financial transactions system', 'Legacy System', 'Critical', 'COBOL, Mainframe', 180000, 9, 4, 3, 85000.00, 4200.00, 2
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Core Banking System' AND AssessmentId = 2);

INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Customer Portal', 'Online banking interface', 'Angular SPA', 'Customer-Facing', 'Angular, Java', 52000, 6, 5, 6, 28000.00, 1500.00, 2
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Customer Portal' AND AssessmentId = 2);

-- Add some applications for Assessment 3 (Cloud Migration Readiness)
INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Inventory Management', 'Cloud-native inventory system', 'Microservices', 'Internal', 'Docker, Kubernetes', 38000, 4, 9, 10, 12000.00, 950.00, 3
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Inventory Management' AND AssessmentId = 3);

INSERT INTO Applications (Name, Description, Type, Category, Technology, LinesOfCode, ComplexityScore, SecurityRating, CloudReadinessScore, EstimatedMigrationCost, MonthlyCost, AssessmentId)
SELECT 'Analytics Platform', 'Data analytics and reporting', 'Web Application', 'Analytics', 'Python, Azure', 41000, 5, 8, 9, 16000.00, 1100.00, 3
WHERE NOT EXISTS (SELECT 1 FROM Applications WHERE Name = 'Analytics Platform' AND AssessmentId = 3);

-- Add some security findings to show critical and security issues
INSERT INTO SecurityFindings (ApplicationId, Type, Severity, Description, Status, FirstDetected)
SELECT 1, 'Vulnerability', 'Critical', 'SQL Injection vulnerability in user login', 'Open', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM SecurityFindings WHERE ApplicationId = 1 AND Type = 'Vulnerability');

INSERT INTO SecurityFindings (ApplicationId, Type, Severity, Description, Status, FirstDetected)
SELECT 1, 'Code Quality', 'High', 'Missing input validation on payment forms', 'Open', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM SecurityFindings WHERE ApplicationId = 1 AND Type = 'Code Quality');

INSERT INTO SecurityFindings (ApplicationId, Type, Severity, Description, Status, FirstDetected)
SELECT 4, 'Security', 'Critical', 'Outdated encryption protocols', 'Open', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM SecurityFindings WHERE ApplicationId = 4 AND Type = 'Security');

INSERT INTO SecurityFindings (ApplicationId, Type, Severity, Description, Status, FirstDetected)
SELECT 4, 'Vulnerability', 'High', 'Cross-site scripting vulnerability', 'In Progress', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM SecurityFindings WHERE ApplicationId = 4 AND Type = 'Vulnerability');

INSERT INTO SecurityFindings (ApplicationId, Type, Severity, Description, Status, FirstDetected)
SELECT 5, 'Code Quality', 'Medium', 'Inconsistent error handling', 'Open', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM SecurityFindings WHERE ApplicationId = 5 AND Type = 'Code Quality');

-- Add some code metrics for applications
INSERT INTO CodeMetrics (ApplicationId, MetricType, MetricName, Value, Threshold, Status, MeasuredAt)
SELECT 1, 'Complexity', 'Cyclomatic Complexity', 15.2, 10.0, 'Warning', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM CodeMetrics WHERE ApplicationId = 1 AND MetricName = 'Cyclomatic Complexity');

INSERT INTO CodeMetrics (ApplicationId, MetricType, MetricName, Value, Threshold, Status, MeasuredAt)
SELECT 1, 'Quality', 'Code Coverage', 68.5, 80.0, 'Warning', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM CodeMetrics WHERE ApplicationId = 1 AND MetricName = 'Code Coverage');

INSERT INTO CodeMetrics (ApplicationId, MetricType, MetricName, Value, Threshold, Status, MeasuredAt)
SELECT 2, 'Complexity', 'Cyclomatic Complexity', 8.3, 10.0, 'OK', GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM CodeMetrics WHERE ApplicationId = 2 AND MetricName = 'Cyclomatic Complexity');

-- Add some budget allocation data
INSERT INTO BudgetAllocations (AssessmentId, AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate)
SELECT 1, 15000.00, 125000.00, 35000.00, 12000.00, 20000.00, 'E-commerce platform modernization budget', GETDATE(), GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM BudgetAllocations WHERE AssessmentId = 1);

INSERT INTO BudgetAllocations (AssessmentId, AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate)
SELECT 2, 25000.00, 280000.00, 65000.00, 35000.00, 50000.00, 'Financial services security enhancement', GETDATE(), GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM BudgetAllocations WHERE AssessmentId = 2);

INSERT INTO BudgetAllocations (AssessmentId, AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate)
SELECT 3, 18000.00, 95000.00, 28000.00, 15000.00, 18000.00, 'Cloud migration project budget', GETDATE(), GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM BudgetAllocations WHERE AssessmentId = 3);

PRINT 'Sample dashboard data has been added successfully!';