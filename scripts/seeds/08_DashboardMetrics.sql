-- Seed data for DashboardMetrics table
PRINT 'Seeding DashboardMetrics table...'

INSERT INTO DashboardMetrics (
    MetricName,
    [Value],
    Unit,
    Category,
    RecordedDate,
    AssessmentId
) VALUES 
-- Dashboard Metrics for Assessment 1 (E-commerce)
('Total Applications', 4, 'count', 'Applications', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Migration Readiness Score', 7.5, 'score', 'Readiness', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Estimated Migration Cost', 1970000, 'currency', 'Cost', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Projected Annual Savings', 850000, 'currency', 'Savings', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('High Priority Security Issues', 2, 'count', 'Security', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Average Code Quality Score', 7.4, 'score', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Test Coverage Percentage', 79.5, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),

-- Dashboard Metrics for Assessment 2 (Banking)
('Total Applications', 4, 'count', 'Applications', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Migration Readiness Score', 5.8, 'score', 'Readiness', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Estimated Migration Cost', 4570000, 'currency', 'Cost', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Projected Annual Savings', 1200000, 'currency', 'Savings', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('High Priority Security Issues', 5, 'count', 'Security', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Average Code Quality Score', 6.3, 'score', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Test Coverage Percentage', 66.3, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Compliance Score', 72, 'percentage', 'Compliance', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),

-- Dashboard Metrics for Assessment 3 (Healthcare)
('Total Applications', 4, 'count', 'Applications', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Migration Readiness Score', 7.1, 'score', 'Readiness', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Estimated Migration Cost', 3240000, 'currency', 'Cost', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Projected Annual Savings', 950000, 'currency', 'Savings', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('High Priority Security Issues', 3, 'count', 'Security', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Average Code Quality Score', 6.9, 'score', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Test Coverage Percentage', 73.9, 'percentage', 'Quality', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('HIPAA Compliance Score', 78, 'percentage', 'Compliance', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Patient Data Security Score', 8.2, 'score', 'Security', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'));

PRINT 'DashboardMetrics seeded successfully!'
SELECT COUNT(*) as [DashboardMetrics Count] FROM DashboardMetrics;