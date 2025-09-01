-- Seed data for SecurityFindings table
PRINT 'Seeding SecurityFindings table...'

INSERT INTO SecurityFindings (
    Title,
    [Description],
    Severity,
    Category,
    [Status],
    RecommendedAction,
    AssessmentId,
    CreatedDate
) VALUES 
-- Security Findings for Assessment 1 (E-commerce)
('Insufficient Input Validation', 'Web forms lack proper input validation allowing potential SQL injection attacks', 'High', 'Code Security', 'Open', 'Implement parameterized queries and input sanitization across all web forms', 1, GETDATE()),
('Weak Password Policy', 'Current password requirements are below industry standards for e-commerce platforms', 'Medium', 'Authentication', 'Open', 'Enforce strong password policy with minimum 12 characters, complexity requirements, and MFA', 1, GETDATE()),
('Unencrypted Data Transmission', 'Some API endpoints transmit sensitive data without proper encryption', 'Critical', 'Data Protection', 'In Progress', 'Implement TLS 1.3 for all API communications and encrypt sensitive data fields', 1, GETDATE()),
('Missing Security Headers', 'Web application lacks essential security headers for XSS and clickjacking protection', 'Medium', 'Web Security', 'Open', 'Implement Content Security Policy, X-Frame-Options, and other OWASP recommended headers', 1, GETDATE()),

-- Security Findings for Assessment 2 (Banking)
('Legacy Authentication System', 'Core banking system uses outdated authentication mechanisms vulnerable to modern attacks', 'Critical', 'Authentication', 'Open', 'Migrate to modern authentication with OAuth 2.0, SAML, and hardware security modules', 2, GETDATE()),
('Inadequate Audit Logging', 'Insufficient logging of financial transactions and user activities for compliance requirements', 'High', 'Compliance', 'Open', 'Implement comprehensive audit logging meeting SOX and banking regulations', 2, GETDATE()),
('Privileged Access Management Gaps', 'Administrative accounts lack proper monitoring and access controls', 'High', 'Access Control', 'In Progress', 'Deploy PAM solution with just-in-time access and session recording capabilities', 2, GETDATE()),
('Data Encryption at Rest', 'Customer financial data stored without proper encryption in legacy databases', 'Critical', 'Data Protection', 'Open', 'Implement transparent data encryption and key management for all customer data', 2, GETDATE()),

-- Security Findings for Assessment 3 (Healthcare)
('HIPAA Compliance Gaps', 'Patient data handling processes do not fully comply with HIPAA requirements', 'Critical', 'Compliance', 'Open', 'Implement comprehensive HIPAA compliance program with data classification and access controls', 3, GETDATE()),
('Medical Device Security', 'Connected medical devices lack proper security controls and network segmentation', 'High', 'IoT Security', 'Open', 'Implement medical device security framework with network segmentation and monitoring', 3, GETDATE()),
('Insufficient Data Backup Protection', 'Patient data backups are not properly encrypted and tested for recovery scenarios', 'Medium', 'Data Protection', 'In Progress', 'Implement encrypted backup solution with regular recovery testing and off-site storage', 3, GETDATE()),
('Third-party Integration Risks', 'Integrations with external healthcare systems lack proper security assessments', 'High', 'Third-party Risk', 'Open', 'Conduct security assessments of all third-party integrations and implement secure API gateways', 3, GETDATE());

PRINT 'SecurityFindings seeded successfully!'
SELECT COUNT(*) as [SecurityFindings Count] FROM SecurityFindings;