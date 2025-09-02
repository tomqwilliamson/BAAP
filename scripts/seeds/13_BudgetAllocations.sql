-- Seed data for BudgetAllocations table
PRINT 'Seeding BudgetAllocations table...'

INSERT INTO BudgetAllocations (
    AssessmentCost,
    Implementation,
    Maintenance,
    Training,
    Contingency,
    Notes,
    AssessmentId,
    CreatedDate,
    LastModifiedDate
) VALUES 
-- Budget for Assessment 1 (E-commerce)
(250000.00, 1500000.00, 300000.00, 150000.00, 300000.00, 'E-commerce platform migration budget with focus on scalability and performance improvements', (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), GETDATE(), GETDATE()),

-- Budget for Assessment 2 (Banking)
(500000.00, 3200000.00, 800000.00, 400000.00, 500000.00, 'Core banking system modernization with enhanced security and compliance requirements', (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), GETDATE(), GETDATE()),

-- Budget for Assessment 3 (Healthcare)
(380000.00, 2800000.00, 620000.00, 320000.00, 480000.00, 'HIPAA-compliant healthcare platform with advanced analytics and telehealth capabilities', (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), GETDATE(), GETDATE());

PRINT 'BudgetAllocations seeded successfully!'
SELECT COUNT(*) as [BudgetAllocations Count] FROM BudgetAllocations;