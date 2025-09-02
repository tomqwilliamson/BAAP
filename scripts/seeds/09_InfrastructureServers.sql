-- Seed data for InfrastructureServers table
PRINT 'Seeding InfrastructureServers table...'

INSERT INTO InfrastructureServers (
    [Name],
    [Type],
    ServerCount,
    UtilizationPercent,
    CloudReadiness,
    CurrentHosting,
    RecommendedAzureTarget,
    MigrationEffort,
    EstimatedMonthlyCost,
    CreatedDate,
    AssessmentId
) VALUES 
-- Infrastructure for Assessment 1 (E-commerce)
('Web Servers', 'IIS', 3, 75, 'High', 'On-Premise Data Center', 'Azure App Service', 'Medium', '$2,400', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Application Servers', 'Linux', 2, 68, 'High', 'On-Premise Data Center', 'Azure Container Instances', 'Low', '$1,800', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Database Servers', 'SQL Server', 1, 82, 'Medium', 'On-Premise Data Center', 'Azure SQL Database', 'High', '$3,200', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Cache Servers', 'Redis', 2, 45, 'High', 'On-Premise Data Center', 'Azure Cache for Redis', 'Low', '$800', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),

-- Infrastructure for Assessment 2 (Banking)
('Core Banking Mainframe', 'Mainframe', 1, 95, 'Low', 'Secure Data Center', 'Azure Virtual Machines', 'High', '$15,000', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Web Application Servers', 'Linux', 4, 78, 'Medium', 'Secure Data Center', 'Azure App Service', 'Medium', '$4,800', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Database Cluster', 'DB2', 3, 88, 'Low', 'Secure Data Center', 'Azure SQL Managed Instance', 'High', '$8,500', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Security Infrastructure', 'Linux', 2, 65, 'Medium', 'Secure Data Center', 'Azure Security Center', 'Medium', '$2,200', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),

-- Infrastructure for Assessment 3 (Healthcare)
('EMR Application Servers', 'IIS', 2, 72, 'High', 'Healthcare Data Center', 'Azure App Service', 'Medium', '$3,600', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Medical Imaging Storage', 'Linux', 4, 85, 'Medium', 'Healthcare Data Center', 'Azure Blob Storage', 'Medium', '$12,000', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('API Gateway Cluster', 'Linux', 2, 60, 'High', 'Healthcare Data Center', 'Azure API Management', 'Low', '$1,400', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Healthcare Database', 'SQL Server', 2, 90, 'Medium', 'Healthcare Data Center', 'Azure SQL Database', 'High', '$5,200', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'));

PRINT 'InfrastructureServers seeded successfully!'
SELECT COUNT(*) as [InfrastructureServers Count] FROM InfrastructureServers;