-- Seed data for SecurityVulnerabilities table
PRINT 'Seeding SecurityVulnerabilities table...'

INSERT INTO SecurityVulnerabilities (
    Title,
    [Description],
    Severity,
    Category,
    [Source],
    InstanceCount,
    [Status],
    CweId,
    Scanner,
    CreatedDate,
    ResolvedDate,
    AssessmentId
) VALUES 
-- Security Vulnerabilities for Assessment 1 (E-commerce)
('Cross-Site Scripting (XSS)', 'Stored XSS vulnerability in product review comments allowing script injection', 'High', 'Infrastructure', 'Azure Migrate', 3, 'Open', 'CWE-79', 'Nessus', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('SQL Injection', 'SQL injection vulnerability in search functionality due to improper input validation', 'Critical', 'Database', 'DMA Assessment', 2, 'In Progress', 'CWE-89', 'OpenVAS', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Insecure Direct Object Reference', 'Users can access other customers order details by manipulating order ID parameters', 'Medium', 'Infrastructure', 'Azure Migrate', 1, 'Open', 'CWE-639', 'Qualys', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),

-- Security Vulnerabilities for Assessment 2 (Banking)
('Weak Cryptographic Implementation', 'Legacy encryption algorithms used for sensitive financial data storage', 'Critical', 'Infrastructure', 'Azure Migrate', 5, 'Open', 'CWE-327', 'Nessus', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Authentication Bypass', 'Privilege escalation vulnerability allowing unauthorized access to admin functions', 'Critical', 'Network', 'SIEM', 2, 'In Progress', 'CWE-287', 'OpenVAS', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Information Disclosure', 'Sensitive customer information exposed in error messages and logs', 'Medium', 'Infrastructure', 'Azure Migrate', 8, 'Open', 'CWE-200', 'Qualys', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Unvalidated Redirects', 'Open redirect vulnerability that could be used for phishing attacks', 'Medium', 'Network', 'SIEM', 3, 'Open', 'CWE-601', 'Nessus', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),

-- Security Vulnerabilities for Assessment 3 (Healthcare)
('HIPAA Data Exposure', 'Patient health information accessible without proper authentication in legacy system', 'Critical', 'Infrastructure', 'Azure Migrate', 4, 'Open', 'CWE-306', 'Qualys', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Medical Device Vulnerability', 'Default credentials used on networked medical imaging equipment', 'High', 'DevOps', 'DMA Assessment', 6, 'In Progress', 'CWE-798', 'Nessus', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('API Security Flaw', 'Lab results API lacks proper rate limiting and authentication for external integrations', 'Medium', 'Network', 'SIEM', 2, 'Open', 'CWE-307', 'OpenVAS', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Data Encryption Gap', 'Patient data transmitted between systems without end-to-end encryption', 'High', 'Infrastructure', 'Azure Migrate', 3, 'Open', 'CWE-319', 'Qualys', GETDATE(), NULL, (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'));

PRINT 'SecurityVulnerabilities seeded successfully!'
SELECT COUNT(*) as [SecurityVulnerabilities Count] FROM SecurityVulnerabilities;