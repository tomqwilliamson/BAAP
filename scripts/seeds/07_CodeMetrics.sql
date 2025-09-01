-- Seed data for CodeMetrics table
PRINT 'Seeding CodeMetrics table...'

INSERT INTO CodeMetrics (
    ApplicationId,
    LinesOfCode,
    CyclomaticComplexity,
    CodeDuplication,
    TechnicalDebt,
    TestCoverage,
    Maintainability,
    MeasuredDate
) VALUES 
-- Code Metrics for Assessment 1 Applications (E-commerce)
-- Customer Web Portal
(1, 85000, 245, 15.2, 180000.00, 78.5, 7.2, GETDATE()),
-- Payment Processing API
(2, 42000, 128, 8.7, 95000.00, 85.2, 8.1, GETDATE()),
-- Inventory Management System
(3, 67000, 189, 12.4, 145000.00, 72.8, 6.8, GETDATE()),
-- Mobile Shopping App
(4, 58000, 156, 10.9, 120000.00, 81.3, 7.6, GETDATE()),

-- Code Metrics for Assessment 2 Applications (Banking)
-- Core Banking Engine
(5, 250000, 892, 35.8, 850000.00, 45.2, 4.1, GETDATE()),
-- Online Banking Portal
(6, 95000, 298, 18.3, 220000.00, 68.7, 6.4, GETDATE()),
-- ATM Network Controller
(7, 78000, 234, 22.1, 185000.00, 62.5, 5.8, GETDATE()),
-- Fraud Detection System
(8, 52000, 167, 9.4, 98000.00, 88.9, 8.7, GETDATE()),

-- Code Metrics for Assessment 3 Applications (Healthcare)
-- Patient Management System
(9, 76000, 201, 14.6, 165000.00, 75.4, 7.0, GETDATE()),
-- Medical Imaging Platform
(10, 125000, 445, 25.7, 380000.00, 58.3, 5.2, GETDATE()),
-- Lab Results API
(11, 45000, 142, 11.2, 105000.00, 82.7, 7.8, GETDATE()),
-- Telehealth Platform
(12, 68000, 178, 13.5, 140000.00, 79.1, 7.4, GETDATE());

PRINT 'CodeMetrics seeded successfully!'
SELECT COUNT(*) as [CodeMetrics Count] FROM CodeMetrics;