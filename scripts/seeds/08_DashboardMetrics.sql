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
('Total Applications', 4, 'count', 'Applications', GETDATE(), 1),
('Migration Readiness Score', 7.5, 'score', 'Readiness', GETDATE(), 1),
('Estimated Migration Cost', 1970000, 'currency', 'Cost', GETDATE(), 1),
('Projected Annual Savings', 850000, 'currency', 'Savings', GETDATE(), 1),
('High Priority Security Issues', 2, 'count', 'Security', GETDATE(), 1),
('Average Code Quality Score', 7.4, 'score', 'Quality', GETDATE(), 1),
('Test Coverage Percentage', 79.5, 'percentage', 'Quality', GETDATE(), 1),

-- Dashboard Metrics for Assessment 2 (Banking)
('Total Applications', 4, 'count', 'Applications', GETDATE(), 2),
('Migration Readiness Score', 5.8, 'score', 'Readiness', GETDATE(), 2),
('Estimated Migration Cost', 4570000, 'currency', 'Cost', GETDATE(), 2),
('Projected Annual Savings', 1200000, 'currency', 'Savings', GETDATE(), 2),
('High Priority Security Issues', 5, 'count', 'Security', GETDATE(), 2),
('Average Code Quality Score', 6.3, 'score', 'Quality', GETDATE(), 2),
('Test Coverage Percentage', 66.3, 'percentage', 'Quality', GETDATE(), 2),
('Compliance Score', 72, 'percentage', 'Compliance', GETDATE(), 2),

-- Dashboard Metrics for Assessment 3 (Healthcare)
('Total Applications', 4, 'count', 'Applications', GETDATE(), 3),
('Migration Readiness Score', 7.1, 'score', 'Readiness', GETDATE(), 3),
('Estimated Migration Cost', 3240000, 'currency', 'Cost', GETDATE(), 3),
('Projected Annual Savings', 950000, 'currency', 'Savings', GETDATE(), 3),
('High Priority Security Issues', 3, 'count', 'Security', GETDATE(), 3),
('Average Code Quality Score', 6.9, 'score', 'Quality', GETDATE(), 3),
('Test Coverage Percentage', 73.9, 'percentage', 'Quality', GETDATE(), 3),
('HIPAA Compliance Score', 78, 'percentage', 'Compliance', GETDATE(), 3),
('Patient Data Security Score', 8.2, 'score', 'Security', GETDATE(), 3);

PRINT 'DashboardMetrics seeded successfully!'
SELECT COUNT(*) as [DashboardMetrics Count] FROM DashboardMetrics;