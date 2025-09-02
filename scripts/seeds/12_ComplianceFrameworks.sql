-- Seed data for ComplianceFrameworks table
PRINT 'Seeding ComplianceFrameworks table...'

INSERT INTO ComplianceFrameworks (
    [Name],
    [Status],
    CoveragePercent,
    Notes,
    AssessmentType,
    CreatedDate,
    LastAssessedDate,
    AssessmentId
) VALUES 
-- Compliance for Assessment 1 (E-commerce)
('PCI DSS', 'Partial', 78, 'Payment Card Industry Data Security Standard implementation in progress with 3 remaining controls', 'Data', GETDATE(), '2024-01-15', 1),
('GDPR', 'Compliant', 85, 'General Data Protection Regulation compliance with minor documentation updates needed', 'Data', GETDATE(), '2024-01-10', 1),
('SOC 2 Type II', 'Partial', 72, 'Service Organization Control 2 audit scheduled for Q2 2024', 'Security', GETDATE(), '2023-12-20', 1),

-- Compliance for Assessment 2 (Banking)
('SOX', 'Compliant', 88, 'Sarbanes-Oxley Act financial reporting compliance maintained with quarterly reviews', 'Security', GETDATE(), '2024-01-05', 2),
('Basel III', 'Compliant', 92, 'International banking regulations for capital adequacy - fully compliant', 'Security', GETDATE(), '2024-01-20', 2),
('PCI DSS', 'Compliant', 95, 'Payment Card Industry Data Security Standard - fully compliant with regular audits', 'Data', GETDATE(), '2024-02-01', 2),
('FFIEC', 'Compliant', 85, 'Federal Financial Institutions Examination Council guidelines compliance maintained', 'Security', GETDATE(), '2024-01-25', 2),

-- Compliance for Assessment 3 (Healthcare)
('HIPAA', 'Partial', 78, 'Health Insurance Portability and Accountability Act compliance with PHI access control improvements needed', 'Data', GETDATE(), '2024-01-12', 3),
('HITECH', 'Compliant', 82, 'Health Information Technology for Economic and Clinical Health Act compliance maintained', 'Data', GETDATE(), '2024-01-18', 3),
('FDA 21 CFR Part 820', 'Partial', 75, 'FDA Quality System Regulation for medical devices with documentation updates in progress', 'Infrastructure', GETDATE(), '2023-12-15', 3),
('SOC 2 Type II', 'Compliant', 80, 'Service Organization Control 2 for healthcare data security - annual audit completed', 'Security', GETDATE(), '2024-01-08', 3);

PRINT 'ComplianceFrameworks seeded successfully!'
SELECT COUNT(*) as [ComplianceFrameworks Count] FROM ComplianceFrameworks;