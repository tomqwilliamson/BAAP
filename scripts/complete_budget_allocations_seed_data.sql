-- Complete BudgetAllocations Seed Data
-- Works for both Local (AssessmentIDs 1-5) and Azure (AssessmentIDs 4-8) databases

-- Clear existing budget allocation data if needed
DELETE FROM BudgetAllocations;

-- Insert comprehensive budget allocation data
-- Note: This script includes both local (1-5) and Azure (4-8) assessment IDs for maximum compatibility

-- Local/Azure Assessment 1/4: E-Commerce Platform Assessment ($2.5M total budget)
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) 
SELECT 45000.00, 1800000.00, 450000.00, 120000.00, 85000.00, 
'E-commerce platform modernization budget - includes cloud migration, payment system upgrades, and customer portal enhancements. Assessment phase covers technical discovery and architecture planning.', 
GETDATE(), GETDATE(), Id
FROM Assessments WHERE Id IN (1, 4);

-- Local/Azure Assessment 2/5: Financial Services Legacy Modernization ($4.2M total budget)
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) 
SELECT 85000.00, 3200000.00, 650000.00, 180000.00, 85000.00, 
'COBOL legacy system modernization budget - includes regulatory compliance validation, security enhancements, and API development. High implementation costs due to complex financial regulations and data migration requirements.', 
GETDATE(), GETDATE(), Id
FROM Assessments WHERE Id IN (2, 5);

-- Local/Azure Assessment 3/6: Enterprise Data Platform Modernization ($3.8M total budget)
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) 
SELECT 65000.00, 2800000.00, 720000.00, 150000.00, 65000.00, 
'Data platform migration to cloud with advanced analytics capabilities. Budget includes data lake setup, ETL pipeline development, and BI tool integration. Ongoing maintenance includes data governance and monitoring.', 
GETDATE(), GETDATE(), Id
FROM Assessments WHERE Id IN (3, 6);

-- Local/Azure Assessment 4/7: Manufacturing IoT Integration ($1.8M total budget)
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) 
SELECT 35000.00, 1350000.00, 280000.00, 95000.00, 40000.00, 
'IoT sensor integration and real-time monitoring system implementation. Budget covers hardware procurement, edge computing setup, and predictive maintenance dashboard development.', 
GETDATE(), GETDATE(), Id
FROM Assessments WHERE Id IN (4, 7);

-- Local/Azure Assessment 5/8: Healthcare Application Modernization ($3.2M total budget)
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) 
SELECT 55000.00, 2400000.00, 520000.00, 165000.00, 60000.00, 
'HIPAA-compliant healthcare application modernization with patient portal and telemedicine capabilities. Budget includes security compliance validation, EMR integration, and mobile app development.', 
GETDATE(), GETDATE(), Id
FROM Assessments WHERE Id IN (5, 8);

-- Verify the data was inserted
SELECT 
    ba.Id,
    ba.AssessmentId,
    a.Name as AssessmentName,
    FORMAT(ba.AssessmentCost, 'C0') as AssessmentCost,
    FORMAT(ba.Implementation, 'C0') as Implementation,
    FORMAT(ba.Maintenance, 'C0') as Maintenance,
    FORMAT(ba.Training, 'C0') as Training,
    FORMAT(ba.Contingency, 'C0') as Contingency,
    FORMAT((ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency), 'C0') as TotalBudget,
    SUBSTRING(ba.Notes, 1, 50) + '...' as NotesPreview,
    ba.CreatedDate
FROM BudgetAllocations ba
INNER JOIN Assessments a ON ba.AssessmentId = a.Id
ORDER BY ba.AssessmentId;

-- Summary statistics
SELECT 
    COUNT(*) as TotalBudgetAllocations,
    FORMAT(AVG(ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency), 'C0') as AvgTotalBudget,
    FORMAT(MIN(ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency), 'C0') as MinTotalBudget,
    FORMAT(MAX(ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency), 'C0') as MaxTotalBudget,
    FORMAT(SUM(ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency), 'C0') as GrandTotal
FROM BudgetAllocations ba;

PRINT 'BudgetAllocations seed data has been successfully inserted!'
PRINT 'Total budget allocations created for all available assessments'
PRINT 'Budget range: $1.8M - $4.2M per project'