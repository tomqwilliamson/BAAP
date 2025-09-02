-- Seed data for BusinessContextRisks table
PRINT 'Seeding BusinessContextRisks table...'

INSERT INTO BusinessContextRisks (
    [Name],
    [Description],
    Category,
    Probability,
    Impact,
    RiskScore,
    Mitigation,
    [Owner],
    [Status],
    DueDate,
    AssessmentId,
    CreatedDate,
    LastModifiedDate
) VALUES 
-- Risks for Assessment 1 (E-commerce)
('Migration Downtime', 'Extended downtime during platform migration affecting sales revenue', 'Technical', 'Medium', 'High', 15, 'Implement blue-green deployment strategy with comprehensive rollback plan', 'DevOps Lead', 'Open', DATEADD(month, 2, GETDATE()), 1, GETDATE(), GETDATE()),
('Data Loss During Migration', 'Risk of customer data corruption or loss during database migration', 'Technical', 'Low', 'High', 9, 'Multiple backup strategies and thorough testing in staging environment', 'Data Engineering Lead', 'Mitigated', DATEADD(month, 1, GETDATE()), 1, GETDATE(), GETDATE()),
('Performance Degradation', 'New cloud infrastructure may not handle peak traffic as effectively', 'Technical', 'Medium', 'Medium', 9, 'Load testing and auto-scaling configuration with performance monitoring', 'Infrastructure Lead', 'Open', DATEADD(month, 3, GETDATE()), 1, GETDATE(), GETDATE()),
('Third-party Integration Failures', 'Payment and shipping integrations may break during migration', 'Business', 'High', 'High', 25, 'Thorough API testing and fallback mechanisms for critical integrations', 'Integration Lead', 'Open', DATEADD(month, 2, GETDATE()), 1, GETDATE(), GETDATE()),

-- Risks for Assessment 2 (Banking)
('Regulatory Non-compliance', 'New system may not meet all banking regulatory requirements', 'Compliance', 'Medium', 'High', 15, 'Continuous compliance monitoring and regular regulatory reviews', 'Compliance Officer', 'Open', DATEADD(month, 4, GETDATE()), 2, GETDATE(), GETDATE()),
('Customer Data Breach', 'Security vulnerabilities in new system could expose customer financial data', 'Security', 'Low', 'High', 9, 'Zero trust security implementation and continuous security monitoring', 'CISO', 'Open', DATEADD(month, 1, GETDATE()), 2, GETDATE(), GETDATE()),
('Legacy System Integration Issues', 'Difficulty integrating modern systems with legacy COBOL applications', 'Technical', 'High', 'High', 25, 'Comprehensive integration testing and API gateway implementation', 'System Architect', 'Open', DATEADD(month, 3, GETDATE()), 2, GETDATE(), GETDATE()),
('Staff Training and Adoption', 'Bank employees may struggle to adapt to new modern interfaces', 'Business', 'Medium', 'Medium', 9, 'Comprehensive training program and change management strategy', 'Change Manager', 'Open', DATEADD(month, 5, GETDATE()), 2, GETDATE(), GETDATE()),

-- Risks for Assessment 3 (Healthcare)
('HIPAA Violation', 'Inadequate patient data protection could result in HIPAA violations and fines', 'Compliance', 'Medium', 'High', 15, 'HIPAA compliance framework with regular audits and staff training', 'Compliance Manager', 'Open', DATEADD(month, 2, GETDATE()), 3, GETDATE(), GETDATE()),
('Medical Device Integration Failure', 'New platform may not properly integrate with existing medical devices', 'Technical', 'Medium', 'High', 15, 'Comprehensive device compatibility testing and vendor collaboration', 'Clinical Systems Lead', 'Open', DATEADD(month, 3, GETDATE()), 3, GETDATE(), GETDATE()),
('Clinical Workflow Disruption', 'New system may disrupt established clinical workflows affecting patient care', 'Business', 'High', 'Medium', 15, 'Phased rollout with extensive clinical staff training and workflow optimization', 'Clinical Operations Director', 'Open', DATEADD(month, 4, GETDATE()), 3, GETDATE(), GETDATE()),
('Telehealth Security Risks', 'Video consultations and remote monitoring may introduce new security vulnerabilities', 'Security', 'Medium', 'High', 15, 'End-to-end encryption and secure communication protocols implementation', 'Security Lead', 'Open', DATEADD(month, 2, GETDATE()), 3, GETDATE(), GETDATE()),
('Data Interoperability Issues', 'Difficulty exchanging patient data with other healthcare systems and providers', 'Technical', 'High', 'Medium', 15, 'FHIR standard implementation and comprehensive integration testing', 'Integration Architect', 'Open', DATEADD(month, 3, GETDATE()), 3, GETDATE(), GETDATE());

PRINT 'BusinessContextRisks seeded successfully!'
SELECT COUNT(*) as [BusinessContextRisks Count] FROM BusinessContextRisks;