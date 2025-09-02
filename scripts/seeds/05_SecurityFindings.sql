-- Seed data for SecurityFindings table
PRINT 'Seeding SecurityFindings table...'

INSERT INTO SecurityFindings (
    Title,
    [Description],
    Severity,
    Category,
    [FileName],
    LineNumber,
    [Source],
    IsResolved,
    CreatedDate,
    ResolvedDate,
    ApplicationId
) VALUES 
-- Security Findings for Assessment 1 (E-commerce)
('Insufficient Input Validation', 'Web forms lack proper input validation allowing potential SQL injection attacks', 'High', 'SQL Injection', 'UserController.cs', 145, 'SAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Customer Web Portal')),
('Weak Password Policy', 'Current password requirements are below industry standards for e-commerce platforms', 'Medium', 'Authentication', 'AuthService.cs', 78, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Customer Web Portal')),
('Unencrypted Data Transmission', 'Some API endpoints transmit sensitive data without proper encryption', 'Critical', 'Data Protection', 'PaymentController.cs', 203, 'DAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Payment Processing API')),
('Missing Security Headers', 'Web application lacks essential security headers for XSS and clickjacking protection', 'Medium', 'XSS', 'Startup.cs', 89, 'SAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Customer Web Portal')),

-- Security Findings for Assessment 2 (Banking)
('Legacy Authentication System', 'Core banking system uses outdated authentication mechanisms vulnerable to modern attacks', 'Critical', 'Authentication', 'AuthModule.cbl', 1247, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Core Banking Engine')),
('Inadequate Audit Logging', 'Insufficient logging of financial transactions and user activities for compliance requirements', 'High', 'Compliance', 'AuditService.cs', 456, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Core Banking Engine')),
('Privileged Access Management Gaps', 'Administrative accounts lack proper monitoring and access controls', 'High', 'Access Control', 'AdminController.cs', 189, 'SAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Online Banking Portal')),
('Data Encryption at Rest', 'Customer financial data stored without proper encryption in legacy databases', 'Critical', 'Data Protection', 'DatabaseConfig.cbl', 2134, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Core Banking Engine')),

-- Security Findings for Assessment 3 (Healthcare)
('HIPAA Compliance Gaps', 'Patient data handling processes do not fully comply with HIPAA requirements', 'Critical', 'Compliance', 'PatientService.cs', 567, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Patient Management System')),
('Medical Device Security', 'Connected medical devices lack proper security controls and network segmentation', 'High', 'IoT Security', 'DeviceController.cs', 234, 'SAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Medical Imaging Platform')),
('Insufficient Data Backup Protection', 'Patient data backups are not properly encrypted and tested for recovery scenarios', 'Medium', 'Data Protection', 'BackupService.cs', 123, 'Manual Review', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Patient Management System')),
('Third-party Integration Risks', 'Integrations with external healthcare systems lack proper security assessments', 'High', 'Third-party Risk', 'IntegrationService.cs', 345, 'SAST', 0, GETDATE(), NULL, (SELECT TOP 1 Id FROM Applications WHERE [Name] = 'Lab Results API'));

PRINT 'SecurityFindings seeded successfully!'
SELECT COUNT(*) as [SecurityFindings Count] FROM SecurityFindings;