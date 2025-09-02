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
('Cyclomatic Complexity', 245, 'count', 'Complexity', GETDATE(), 1),
('Code Duplication', 15.2, 'percentage', 'Maintainability', GETDATE(), 1),
('Test Coverage', 78.5, 'percentage', 'Quality', GETDATE(), 1),
('Maintainability Score', 7.2, 'score', 'Maintainability', GETDATE(), 1),

-- Payment Processing API
('Cyclomatic Complexity', 128, 'count', 'Complexity', GETDATE(), 2),
('Code Duplication', 8.7, 'percentage', 'Maintainability', GETDATE(), 2),
('Test Coverage', 85.2, 'percentage', 'Quality', GETDATE(), 2),
('Maintainability Score', 8.1, 'score', 'Maintainability', GETDATE(), 2),

-- Inventory Management System
('Cyclomatic Complexity', 189, 'count', 'Complexity', GETDATE(), 3),
('Code Duplication', 12.4, 'percentage', 'Maintainability', GETDATE(), 3),
('Test Coverage', 72.8, 'percentage', 'Quality', GETDATE(), 3),
('Maintainability Score', 6.8, 'score', 'Maintainability', GETDATE(), 3),

-- Mobile Shopping App
('Cyclomatic Complexity', 156, 'count', 'Complexity', GETDATE(), 4),
('Code Duplication', 10.9, 'percentage', 'Maintainability', GETDATE(), 4),
('Test Coverage', 81.3, 'percentage', 'Quality', GETDATE(), 4),
('Maintainability Score', 7.6, 'score', 'Maintainability', GETDATE(), 4),

-- Code Metrics for Assessment 2 Applications (Banking)
-- Core Banking Engine
('Cyclomatic Complexity', 892, 'count', 'Complexity', GETDATE(), 5),
('Code Duplication', 35.8, 'percentage', 'Maintainability', GETDATE(), 5),
('Test Coverage', 45.2, 'percentage', 'Quality', GETDATE(), 5),
('Maintainability Score', 4.1, 'score', 'Maintainability', GETDATE(), 5),

-- Online Banking Portal
('Cyclomatic Complexity', 298, 'count', 'Complexity', GETDATE(), 6),
('Code Duplication', 18.3, 'percentage', 'Maintainability', GETDATE(), 6),
('Test Coverage', 68.7, 'percentage', 'Quality', GETDATE(), 6),
('Maintainability Score', 6.4, 'score', 'Maintainability', GETDATE(), 6),

-- ATM Network Controller
('Cyclomatic Complexity', 234, 'count', 'Complexity', GETDATE(), 7),
('Code Duplication', 22.1, 'percentage', 'Maintainability', GETDATE(), 7),
('Test Coverage', 62.5, 'percentage', 'Quality', GETDATE(), 7),
('Maintainability Score', 5.8, 'score', 'Maintainability', GETDATE(), 7),

-- Fraud Detection System
('Cyclomatic Complexity', 167, 'count', 'Complexity', GETDATE(), 8),
('Code Duplication', 9.4, 'percentage', 'Maintainability', GETDATE(), 8),
('Test Coverage', 88.9, 'percentage', 'Quality', GETDATE(), 8),
('Maintainability Score', 8.7, 'score', 'Maintainability', GETDATE(), 8),

-- Code Metrics for Assessment 3 Applications (Healthcare)
-- Patient Management System
('Cyclomatic Complexity', 201, 'count', 'Complexity', GETDATE(), 9),
('Code Duplication', 14.6, 'percentage', 'Maintainability', GETDATE(), 9),
('Test Coverage', 75.4, 'percentage', 'Quality', GETDATE(), 9),
('Maintainability Score', 7.0, 'score', 'Maintainability', GETDATE(), 9),

-- Medical Imaging Platform
('Cyclomatic Complexity', 445, 'count', 'Complexity', GETDATE(), 10),
('Code Duplication', 25.7, 'percentage', 'Maintainability', GETDATE(), 10),
('Test Coverage', 58.3, 'percentage', 'Quality', GETDATE(), 10),
('Maintainability Score', 5.2, 'score', 'Maintainability', GETDATE(), 10),

-- Lab Results API
('Cyclomatic Complexity', 142, 'count', 'Complexity', GETDATE(), 11),
('Code Duplication', 11.2, 'percentage', 'Maintainability', GETDATE(), 11),
('Test Coverage', 82.7, 'percentage', 'Quality', GETDATE(), 11),
('Maintainability Score', 7.8, 'score', 'Maintainability', GETDATE(), 11),

-- Telehealth Platform
('Cyclomatic Complexity', 178, 'count', 'Complexity', GETDATE(), 12),
('Code Duplication', 13.5, 'percentage', 'Maintainability', GETDATE(), 12),
('Test Coverage', 79.1, 'percentage', 'Quality', GETDATE(), 12),
('Maintainability Score', 7.4, 'score', 'Maintainability', GETDATE(), 12);

PRINT 'CodeMetrics seeded successfully!'
SELECT COUNT(*) as [CodeMetrics Count] FROM CodeMetrics;