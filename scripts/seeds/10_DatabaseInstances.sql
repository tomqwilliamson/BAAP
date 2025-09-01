-- Seed data for DatabaseInstances table
PRINT 'Seeding DatabaseInstances table...'

INSERT INTO DatabaseInstances (
    DatabaseName,
    DatabaseType,
    Version,
    SizeInGB,
    ServerName,
    [Status],
    AssessmentId,
    CreatedDate
) VALUES 
-- Database Instances for Assessment 1 (E-commerce)
('ECommerce_Production', 'SQL Server', '2019 Standard', 850.5, 'EC-DB-01', 'Active', 1, GETDATE()),
('ECommerce_Analytics', 'SQL Server', '2019 Standard', 450.2, 'EC-DB-01', 'Active', 1, GETDATE()),
('Redis_Cache', 'Redis', '6.2', 12.8, 'EC-CACHE-01', 'Active', 1, GETDATE()),

-- Database Instances for Assessment 2 (Banking)
('CoreBanking_Main', 'IBM DB2', '12.1', 5200.0, 'BK-CORE-01', 'Active', 2, GETDATE()),
('CustomerData_Prod', 'IBM DB2', '12.1', 2800.5, 'BK-DB-01', 'Active', 2, GETDATE()),
('Transactions_Archive', 'IBM DB2', '11.5', 8500.0, 'BK-DB-01', 'Active', 2, GETDATE()),
('Analytics_Warehouse', 'PostgreSQL', '14.2', 1200.8, 'BK-APP-01', 'Active', 2, GETDATE()),

-- Database Instances for Assessment 3 (Healthcare)
('PatientRecords_Main', 'SQL Server', '2022 Enterprise', 3200.0, 'HC-DB-01', 'Active', 3, GETDATE()),
('MedicalImaging_Store', 'MongoDB', '5.0', 15000.0, 'HC-IMG-01', 'Active', 3, GETDATE()),
('LabResults_Data', 'MySQL', '8.0', 680.5, 'HC-DB-01', 'Active', 3, GETDATE()),
('Analytics_DataLake', 'PostgreSQL', '15.1', 950.2, 'HC-API-01', 'Active', 3, GETDATE());

PRINT 'DatabaseInstances seeded successfully!'
SELECT COUNT(*) as [DatabaseInstances Count] FROM DatabaseInstances;