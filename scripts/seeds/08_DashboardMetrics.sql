-- Seed data for DashboardMetrics table
PRINT 'Seeding DashboardMetrics table...'

INSERT INTO DashboardMetrics (
    AssessmentId,
    MetricName,
    MetricValue,
    MetricType,
    [Description],
    LastUpdated
) VALUES 
-- Dashboard Metrics for Assessment 1 (E-commerce)
(1, 'Total Applications', '4', 'Count', 'Number of applications in the assessment', GETDATE()),
(1, 'Migration Readiness Score', '7.5', 'Score', 'Overall readiness score for cloud migration (1-10)', GETDATE()),
(1, 'Estimated Migration Cost', '1970000', 'Currency', 'Total estimated cost for migrating all applications', GETDATE()),
(1, 'Projected Annual Savings', '850000', 'Currency', 'Expected annual cost savings post-migration', GETDATE()),
(1, 'High Priority Security Issues', '2', 'Count', 'Number of critical and high severity security findings', GETDATE()),
(1, 'Average Code Quality Score', '7.4', 'Score', 'Average maintainability score across all applications', GETDATE()),
(1, 'Test Coverage Percentage', '79.5', 'Percentage', 'Overall test coverage across the codebase', GETDATE()),

-- Dashboard Metrics for Assessment 2 (Banking)
(2, 'Total Applications', '4', 'Count', 'Number of applications in the assessment', GETDATE()),
(2, 'Migration Readiness Score', '5.8', 'Score', 'Overall readiness score for cloud migration (1-10)', GETDATE()),
(2, 'Estimated Migration Cost', '4570000', 'Currency', 'Total estimated cost for migrating all applications', GETDATE()),
(2, 'Projected Annual Savings', '1200000', 'Currency', 'Expected annual cost savings post-migration', GETDATE()),
(2, 'High Priority Security Issues', '5', 'Count', 'Number of critical and high severity security findings', GETDATE()),
(2, 'Average Code Quality Score', '6.3', 'Score', 'Average maintainability score across all applications', GETDATE()),
(2, 'Test Coverage Percentage', '66.3', 'Percentage', 'Overall test coverage across the codebase', GETDATE()),
(2, 'Compliance Score', '72', 'Percentage', 'Current compliance with banking regulations', GETDATE()),

-- Dashboard Metrics for Assessment 3 (Healthcare)
(3, 'Total Applications', '4', 'Count', 'Number of applications in the assessment', GETDATE()),
(3, 'Migration Readiness Score', '7.1', 'Score', 'Overall readiness score for cloud migration (1-10)', GETDATE()),
(3, 'Estimated Migration Cost', '3240000', 'Currency', 'Total estimated cost for migrating all applications', GETDATE()),
(3, 'Projected Annual Savings', '950000', 'Currency', 'Expected annual cost savings post-migration', GETDATE()),
(3, 'High Priority Security Issues', '3', 'Count', 'Number of critical and high severity security findings', GETDATE()),
(3, 'Average Code Quality Score', '6.9', 'Score', 'Average maintainability score across all applications', GETDATE()),
(3, 'Test Coverage Percentage', '73.9', 'Percentage', 'Overall test coverage across the codebase', GETDATE()),
(3, 'HIPAA Compliance Score', '78', 'Percentage', 'Current HIPAA compliance assessment score', GETDATE()),
(3, 'Patient Data Security Score', '8.2', 'Score', 'Security score for patient data protection (1-10)', GETDATE());

PRINT 'DashboardMetrics seeded successfully!'
SELECT COUNT(*) as [DashboardMetrics Count] FROM DashboardMetrics;