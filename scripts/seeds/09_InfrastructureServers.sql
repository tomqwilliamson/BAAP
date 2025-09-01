-- Seed data for InfrastructureServers table
PRINT 'Seeding InfrastructureServers table...'

INSERT INTO InfrastructureServers (
    ServerName,
    ServerType,
    OperatingSystem,
    CPUCores,
    RAMInGB,
    StorageInGB,
    Location,
    [Status],
    AssessmentId,
    CreatedDate
) VALUES 
-- Infrastructure for Assessment 1 (E-commerce)
('EC-WEB-01', 'Web Server', 'Windows Server 2019', 8, 32, 500, 'On-Premise Data Center', 'Active', 1, GETDATE()),
('EC-API-01', 'Application Server', 'Ubuntu 20.04', 16, 64, 1000, 'On-Premise Data Center', 'Active', 1, GETDATE()),
('EC-DB-01', 'Database Server', 'Windows Server 2019', 24, 128, 2000, 'On-Premise Data Center', 'Active', 1, GETDATE()),
('EC-CACHE-01', 'Cache Server', 'CentOS 8', 4, 16, 200, 'On-Premise Data Center', 'Active', 1, GETDATE()),

-- Infrastructure for Assessment 2 (Banking)
('BK-CORE-01', 'Mainframe', 'z/OS', 32, 256, 10000, 'Secure Data Center', 'Active', 2, GETDATE()),
('BK-WEB-01', 'Web Server', 'Red Hat Enterprise Linux 8', 12, 48, 800, 'Secure Data Center', 'Active', 2, GETDATE()),
('BK-APP-01', 'Application Server', 'AIX', 16, 64, 1200, 'Secure Data Center', 'Active', 2, GETDATE()),
('BK-DB-01', 'Database Server', 'IBM DB2 on Linux', 20, 96, 5000, 'Secure Data Center', 'Active', 2, GETDATE()),
('BK-SEC-01', 'Security Server', 'Ubuntu 22.04', 8, 32, 500, 'Secure Data Center', 'Active', 2, GETDATE()),

-- Infrastructure for Assessment 3 (Healthcare)
('HC-EMR-01', 'EMR Server', 'Windows Server 2022', 16, 64, 2000, 'Healthcare Data Center', 'Active', 3, GETDATE()),
('HC-IMG-01', 'Imaging Server', 'CentOS Stream 8', 32, 128, 20000, 'Healthcare Data Center', 'Active', 3, GETDATE()),
('HC-API-01', 'API Gateway', 'Ubuntu 22.04', 8, 32, 500, 'Healthcare Data Center', 'Active', 3, GETDATE()),
('HC-DB-01', 'Database Server', 'SQL Server on Windows', 20, 96, 5000, 'Healthcare Data Center', 'Active', 3, GETDATE());

PRINT 'InfrastructureServers seeded successfully!'
SELECT COUNT(*) as [InfrastructureServers Count] FROM InfrastructureServers;