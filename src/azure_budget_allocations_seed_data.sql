-- Azure BudgetAllocations Seed Data
-- Comprehensive budget allocations for Azure assessments (IDs 4,5,6,7,8)

-- Clear existing data if needed
-- DELETE FROM BudgetAllocations WHERE AssessmentId IN (4,5,6,7,8);

-- Insert comprehensive budget allocation data for Azure assessments
INSERT INTO BudgetAllocations (AssessmentCost, Implementation, Maintenance, Training, Contingency, Notes, CreatedDate, LastModifiedDate, AssessmentId) VALUES

-- Azure Assessment 4: E-Commerce Platform Assessment ($2.5M total budget)
(45000.00, 1800000.00, 450000.00, 120000.00, 85000.00, 
'E-commerce platform modernization budget - includes cloud migration, payment system upgrades, and customer portal enhancements. Assessment phase covers technical discovery and architecture planning.', 
GETDATE(), GETDATE(), 4),

-- Azure Assessment 5: Financial Services Legacy Modernization ($4.2M total budget)
(85000.00, 3200000.00, 650000.00, 180000.00, 85000.00, 
'COBOL legacy system modernization budget - includes regulatory compliance validation, security enhancements, and API development. High implementation costs due to complex financial regulations and data migration requirements.', 
GETDATE(), GETDATE(), 5),

-- Azure Assessment 6: Enterprise Data Platform Modernization ($3.8M total budget)
(65000.00, 2800000.00, 720000.00, 150000.00, 65000.00, 
'Data platform migration to cloud with advanced analytics capabilities. Budget includes data lake setup, ETL pipeline development, and BI tool integration. Ongoing maintenance includes data governance and monitoring.', 
GETDATE(), GETDATE(), 6),

-- Azure Assessment 7: Manufacturing IoT Integration ($1.8M total budget)
(35000.00, 1350000.00, 280000.00, 95000.00, 40000.00, 
'IoT sensor integration and real-time monitoring system implementation. Budget covers hardware procurement, edge computing setup, and predictive maintenance dashboard development.', 
GETDATE(), GETDATE(), 7),

-- Azure Assessment 8: Healthcare Application Modernization ($3.2M total budget)
(55000.00, 2400000.00, 520000.00, 165000.00, 60000.00, 
'HIPAA-compliant healthcare application modernization with patient portal and telemedicine capabilities. Budget includes security compliance validation, EMR integration, and mobile app development.', 
GETDATE(), GETDATE(), 8);

-- Verify the data was inserted
SELECT 
    ba.Id,
    ba.AssessmentId,
    a.Name as AssessmentName,
    ba.AssessmentCost,
    ba.Implementation,
    ba.Maintenance,
    ba.Training,
    ba.Contingency,
    (ba.AssessmentCost + ba.Implementation + ba.Maintenance + ba.Training + ba.Contingency) as TotalBudget,
    SUBSTRING(ba.Notes, 1, 50) + '...' as NotesPreview,
    ba.CreatedDate
FROM BudgetAllocations ba
INNER JOIN Assessments a ON ba.AssessmentId = a.Id
WHERE ba.AssessmentId IN (4,5,6,7,8)
ORDER BY ba.AssessmentId;

PRINT 'Azure BudgetAllocations seed data has been successfully inserted!'
PRINT 'Total records: 5 budget allocations covering Azure assessments (4,5,6,7,8)'
PRINT 'Budget range: $1.8M - $4.2M per project'