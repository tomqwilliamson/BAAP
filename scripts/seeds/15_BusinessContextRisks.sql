-- Seed data for BusinessContextRisks table
PRINT 'Seeding BusinessContextRisks table...'

INSERT INTO BusinessContextRisks (
    RiskName,
    [Description],
    Category,
    Probability,
    Impact,
    RiskScore,
    MitigationStrategy,
    [Status],
    AssessmentId,
    CreatedDate,
    UpdatedDate
) VALUES 
-- Risks for Assessment 1 (E-commerce)
('Migration Downtime', 'Extended downtime during platform migration affecting sales revenue', 'Technical', 6, 9, 54, 'Implement blue-green deployment strategy with comprehensive rollback plan', 'Open', 1, GETDATE(), GETDATE()),
('Data Loss During Migration', 'Risk of customer data corruption or loss during database migration', 'Data', 3, 10, 30, 'Multiple backup strategies and thorough testing in staging environment', 'Mitigated', 1, GETDATE(), GETDATE()),
('Performance Degradation', 'New cloud infrastructure may not handle peak traffic as effectively', 'Performance', 5, 7, 35, 'Load testing and auto-scaling configuration with performance monitoring', 'In Progress', 1, GETDATE(), GETDATE()),
('Third-party Integration Failures', 'Payment and shipping integrations may break during migration', 'Integration', 7, 8, 56, 'Thorough API testing and fallback mechanisms for critical integrations', 'Open', 1, GETDATE(), GETDATE()),

-- Risks for Assessment 2 (Banking)
('Regulatory Non-compliance', 'New system may not meet all banking regulatory requirements', 'Compliance', 4, 10, 40, 'Continuous compliance monitoring and regular regulatory reviews', 'Open', 2, GETDATE(), GETDATE()),
('Customer Data Breach', 'Security vulnerabilities in new system could expose customer financial data', 'Security', 3, 10, 30, 'Zero trust security implementation and continuous security monitoring', 'In Progress', 2, GETDATE(), GETDATE()),
('Legacy System Integration Issues', 'Difficulty integrating modern systems with legacy COBOL applications', 'Technical', 8, 7, 56, 'Comprehensive integration testing and API gateway implementation', 'Open', 2, GETDATE(), GETDATE()),
('Staff Training and Adoption', 'Bank employees may struggle to adapt to new modern interfaces', 'Organizational', 6, 5, 30, 'Comprehensive training program and change management strategy', 'Planned', 2, GETDATE(), GETDATE()),

-- Risks for Assessment 3 (Healthcare)
('HIPAA Violation', 'Inadequate patient data protection could result in HIPAA violations and fines', 'Compliance', 4, 10, 40, 'HIPAA compliance framework with regular audits and staff training', 'Open', 3, GETDATE(), GETDATE()),
('Medical Device Integration Failure', 'New platform may not properly integrate with existing medical devices', 'Technical', 6, 8, 48, 'Comprehensive device compatibility testing and vendor collaboration', 'In Progress', 3, GETDATE(), GETDATE()),
('Clinical Workflow Disruption', 'New system may disrupt established clinical workflows affecting patient care', 'Operational', 7, 7, 49, 'Phased rollout with extensive clinical staff training and workflow optimization', 'Open', 3, GETDATE(), GETDATE()),
('Telehealth Security Risks', 'Video consultations and remote monitoring may introduce new security vulnerabilities', 'Security', 5, 8, 40, 'End-to-end encryption and secure communication protocols implementation', 'Planned', 3, GETDATE(), GETDATE()),
('Data Interoperability Issues', 'Difficulty exchanging patient data with other healthcare systems and providers', 'Integration', 8, 6, 48, 'FHIR standard implementation and comprehensive integration testing', 'Open', 3, GETDATE(), GETDATE());

PRINT 'BusinessContextRisks seeded successfully!'
SELECT COUNT(*) as [BusinessContextRisks Count] FROM BusinessContextRisks;