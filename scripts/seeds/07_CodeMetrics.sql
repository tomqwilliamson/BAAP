-- Seed data for CodeMetrics table
PRINT 'Seeding CodeMetrics table...'

INSERT INTO CodeMetrics (
    MetricName,
    [Value],
    Unit,
    Category,
    MeasuredDate,
    ApplicationId
) VALUES 
-- Code Metrics for Assessment 1 Applications (E-commerce)
-- Customer Web Portal
('Cyclomatic Complexity', 245, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Customer Web Portal%')),
('Code Duplication', 15.2, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Customer Web Portal%')),
('Test Coverage', 78.5, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Customer Web Portal%')),
('Maintainability Score', 7.2, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Customer Web Portal%')),

-- Payment Processing API
('Cyclomatic Complexity', 128, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Payment Processing API%')),
('Code Duplication', 8.7, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Payment Processing API%')),
('Test Coverage', 85.2, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Payment Processing API%')),
('Maintainability Score', 8.1, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Payment Processing API%')),

-- Inventory Management System
('Cyclomatic Complexity', 189, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Inventory Management System%')),
('Code Duplication', 12.4, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Inventory Management System%')),
('Test Coverage', 72.8, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Inventory Management System%')),
('Maintainability Score', 6.8, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Inventory Management System%')),

-- Mobile Shopping App
('Cyclomatic Complexity', 156, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Mobile Shopping App%')),
('Code Duplication', 10.9, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Mobile Shopping App%')),
('Test Coverage', 81.3, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Mobile Shopping App%')),
('Maintainability Score', 7.6, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Mobile Shopping App%')),

-- Code Metrics for Assessment 2 Applications (Banking)
-- Core Banking Engine
('Cyclomatic Complexity', 892, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Core Banking Engine%')),
('Code Duplication', 35.8, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Core Banking Engine%')),
('Test Coverage', 45.2, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Core Banking Engine%')),
('Maintainability Score', 4.1, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Core Banking Engine%')),

-- Online Banking Portal
('Cyclomatic Complexity', 298, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Online Banking Portal%')),
('Code Duplication', 18.3, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Online Banking Portal%')),
('Test Coverage', 68.7, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Online Banking Portal%')),
('Maintainability Score', 6.4, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Online Banking Portal%')),

-- ATM Network Controller
('Cyclomatic Complexity', 234, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%ATM Network Controller%')),
('Code Duplication', 22.1, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%ATM Network Controller%')),
('Test Coverage', 62.5, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%ATM Network Controller%')),
('Maintainability Score', 5.8, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%ATM Network Controller%')),

-- Fraud Detection System
('Cyclomatic Complexity', 167, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Fraud Detection System%')),
('Code Duplication', 9.4, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Fraud Detection System%')),
('Test Coverage', 88.9, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Fraud Detection System%')),
('Maintainability Score', 8.7, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Fraud Detection System%')),

-- Code Metrics for Assessment 3 Applications (Healthcare)
-- Patient Management System
('Cyclomatic Complexity', 201, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Patient Management System%')),
('Code Duplication', 14.6, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Patient Management System%')),
('Test Coverage', 75.4, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Patient Management System%')),
('Maintainability Score', 7.0, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Patient Management System%')),

-- Medical Imaging Platform
('Cyclomatic Complexity', 445, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Medical Imaging Platform%')),
('Code Duplication', 25.7, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Medical Imaging Platform%')),
('Test Coverage', 58.3, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Medical Imaging Platform%')),
('Maintainability Score', 5.2, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Medical Imaging Platform%')),

-- Lab Results API
('Cyclomatic Complexity', 142, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Lab Results API%')),
('Code Duplication', 11.2, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Lab Results API%')),
('Test Coverage', 82.7, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Lab Results API%')),
('Maintainability Score', 7.8, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Lab Results API%')),

-- Telehealth Platform
('Cyclomatic Complexity', 178, 'count', 'Complexity', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Telehealth Platform%')),
('Code Duplication', 13.5, 'percentage', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Telehealth Platform%')),
('Test Coverage', 79.1, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Telehealth Platform%')),
('Maintainability Score', 7.4, 'score', 'Maintainability', GETDATE(), (SELECT TOP 1 Id FROM Applications WHERE [Name] LIKE '%Telehealth Platform%'));

PRINT 'CodeMetrics seeded successfully!'
SELECT COUNT(*) as [CodeMetrics Count] FROM CodeMetrics;