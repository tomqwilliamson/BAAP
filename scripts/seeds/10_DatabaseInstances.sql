-- Seed data for DatabaseInstances table
PRINT 'Seeding DatabaseInstances table...'

INSERT INTO DatabaseInstances (
    [Name],
    [Type],
    [Version],
    [Size],
    ReadinessPercent,
    IssueCount,
    AzureTargetService,
    SchemaCount,
    TableCount,
    Details,
    CompatibilityStatus,
    CreatedDate,
    AssessmentId
) VALUES 
-- Database Instances for Assessment 1 (E-commerce)
('ECommerce_Production', 'SQL Server', '2019', '850 GB', 85, 3, 'Azure SQL Database', 12, 145, 'Primary production database with customer and order data', 'Ready', GETDATE(), 1),
('ECommerce_Analytics', 'SQL Server', '2019', '450 GB', 90, 1, 'Azure Synapse Analytics', 8, 85, 'Analytics and reporting database', 'Ready', GETDATE(), 1),
('Redis_Cache', 'Redis', '6.2', '13 GB', 95, 0, 'Azure Cache for Redis', 1, 0, 'In-memory cache for session and application data', 'Ready', GETDATE(), 1),

-- Database Instances for Assessment 2 (Banking)
('CoreBanking_Main', 'IBM DB2', '12.1', '5.2 TB', 45, 15, 'Azure SQL Managed Instance', 25, 485, 'Core banking system with legacy COBOL procedures', 'Needs Work', GETDATE(), 2),
('CustomerData_Prod', 'IBM DB2', '12.1', '2.8 TB', 65, 8, 'Azure SQL Database', 18, 320, 'Customer information and account data', 'Warning', GETDATE(), 2),
('Transactions_Archive', 'IBM DB2', '11.5', '8.5 TB', 40, 22, 'Azure Blob Storage', 12, 156, 'Historical transaction archive with compliance requirements', 'Needs Work', GETDATE(), 2),
('Analytics_Warehouse', 'PostgreSQL', '14.2', '1.2 TB', 80, 2, 'Azure Database for PostgreSQL', 15, 210, 'Business intelligence and analytics platform', 'Ready', GETDATE(), 2),

-- Database Instances for Assessment 3 (Healthcare)
('PatientRecords_Main', 'SQL Server', '2022', '3.2 TB', 75, 6, 'Azure SQL Database', 22, 380, 'Electronic health records with HIPAA compliance', 'Warning', GETDATE(), 3),
('MedicalImaging_Store', 'MongoDB', '5.0', '15 TB', 85, 4, 'Azure Cosmos DB', 45, 890, 'Medical imaging data and metadata storage', 'Ready', GETDATE(), 3),
('LabResults_Data', 'MySQL', '8.0', '681 GB', 88, 2, 'Azure Database for MySQL', 8, 125, 'Laboratory test results and analysis data', 'Ready', GETDATE(), 3),
('Analytics_DataLake', 'PostgreSQL', '15.1', '950 GB', 82, 3, 'Azure Synapse Analytics', 12, 165, 'Clinical analytics and research data platform', 'Ready', GETDATE(), 3);

PRINT 'DatabaseInstances seeded successfully!'
SELECT COUNT(*) as [DatabaseInstances Count] FROM DatabaseInstances;