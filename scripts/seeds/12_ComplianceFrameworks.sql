-- Seed data for ComplianceFrameworks table
PRINT 'Seeding ComplianceFrameworks table...'

INSERT INTO ComplianceFrameworks (
    FrameworkName,
    [Description],
    ComplianceScore,
    RequiredControls,
    ImplementedControls,
    [Status],
    AssessmentId,
    CreatedDate
) VALUES 
-- Compliance for Assessment 1 (E-commerce)
('PCI DSS', 'Payment Card Industry Data Security Standard for e-commerce transactions', 78, 12, 9, 'Partial', 1, GETDATE()),
('GDPR', 'General Data Protection Regulation for customer data privacy', 85, 8, 7, 'Mostly Compliant', 1, GETDATE()),
('SOC 2 Type II', 'Service Organization Control 2 for security and availability', 72, 5, 3, 'Partial', 1, GETDATE()),

-- Compliance for Assessment 2 (Banking)
('SOX', 'Sarbanes-Oxley Act financial reporting compliance', 88, 15, 13, 'Mostly Compliant', 2, GETDATE()),
('Basel III', 'International banking regulations for capital adequacy', 92, 10, 9, 'Compliant', 2, GETDATE()),
('PCI DSS', 'Payment Card Industry Data Security Standard', 95, 12, 12, 'Compliant', 2, GETDATE()),
('FFIEC', 'Federal Financial Institutions Examination Council guidelines', 85, 25, 21, 'Mostly Compliant', 2, GETDATE()),

-- Compliance for Assessment 3 (Healthcare)
('HIPAA', 'Health Insurance Portability and Accountability Act', 78, 18, 14, 'Partial', 3, GETDATE()),
('HITECH', 'Health Information Technology for Economic and Clinical Health Act', 82, 12, 10, 'Mostly Compliant', 3, GETDATE()),
('FDA 21 CFR Part 820', 'FDA Quality System Regulation for medical devices', 75, 8, 6, 'Partial', 3, GETDATE()),
('SOC 2 Type II', 'Service Organization Control 2 for healthcare data security', 80, 5, 4, 'Mostly Compliant', 3, GETDATE());

PRINT 'ComplianceFrameworks seeded successfully!'
SELECT COUNT(*) as [ComplianceFrameworks Count] FROM ComplianceFrameworks;