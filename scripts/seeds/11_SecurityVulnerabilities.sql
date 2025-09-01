-- Seed data for SecurityVulnerabilities table
PRINT 'Seeding SecurityVulnerabilities table...'

INSERT INTO SecurityVulnerabilities (
    VulnerabilityName,
    [Description],
    Severity,
    CVENumber,
    AffectedComponent,
    [Status],
    RemediationAction,
    AssessmentId,
    CreatedDate
) VALUES 
-- Security Vulnerabilities for Assessment 1 (E-commerce)
('Cross-Site Scripting (XSS)', 'Stored XSS vulnerability in product review comments allowing script injection', 'High', 'CVE-2023-1234', 'Customer Web Portal', 'Open', 'Implement output encoding and Content Security Policy headers', 1, GETDATE()),
('SQL Injection', 'SQL injection vulnerability in search functionality due to improper input validation', 'Critical', 'CVE-2023-5678', 'Payment Processing API', 'In Progress', 'Implement parameterized queries and input validation', 1, GETDATE()),
('Insecure Direct Object Reference', 'Users can access other customers order details by manipulating order ID parameters', 'Medium', NULL, 'Customer Web Portal', 'Open', 'Implement proper authorization checks for order access', 1, GETDATE()),

-- Security Vulnerabilities for Assessment 2 (Banking)
('Weak Cryptographic Implementation', 'Legacy encryption algorithms used for sensitive financial data storage', 'Critical', NULL, 'Core Banking Engine', 'Open', 'Upgrade to AES-256 encryption and implement proper key management', 2, GETDATE()),
('Authentication Bypass', 'Privilege escalation vulnerability allowing unauthorized access to admin functions', 'Critical', 'CVE-2022-9876', 'Online Banking Portal', 'In Progress', 'Implement multi-factor authentication and proper session management', 2, GETDATE()),
('Information Disclosure', 'Sensitive customer information exposed in error messages and logs', 'Medium', NULL, 'ATM Network Controller', 'Open', 'Sanitize error messages and implement secure logging practices', 2, GETDATE()),
('Unvalidated Redirects', 'Open redirect vulnerability that could be used for phishing attacks', 'Medium', 'CVE-2023-3456', 'Online Banking Portal', 'Open', 'Validate and whitelist redirect destinations', 2, GETDATE()),

-- Security Vulnerabilities for Assessment 3 (Healthcare)
('HIPAA Data Exposure', 'Patient health information accessible without proper authentication in legacy system', 'Critical', NULL, 'Patient Management System', 'Open', 'Implement role-based access control and audit logging for PHI access', 3, GETDATE()),
('Medical Device Vulnerability', 'Default credentials used on networked medical imaging equipment', 'High', 'CVE-2023-7890', 'Medical Imaging Platform', 'In Progress', 'Change default passwords and implement device security hardening', 3, GETDATE()),
('API Security Flaw', 'Lab results API lacks proper rate limiting and authentication for external integrations', 'Medium', NULL, 'Lab Results API', 'Open', 'Implement API authentication, rate limiting, and request validation', 3, GETDATE()),
('Data Encryption Gap', 'Patient data transmitted between systems without end-to-end encryption', 'High', NULL, 'Telehealth Platform', 'Open', 'Implement TLS 1.3 and end-to-end encryption for all patient data transmission', 3, GETDATE());

PRINT 'SecurityVulnerabilities seeded successfully!'
SELECT COUNT(*) as [SecurityVulnerabilities Count] FROM SecurityVulnerabilities;