-- Seed data for ProjectTimelineItems table
PRINT 'Seeding ProjectTimelineItems table...'

INSERT INTO ProjectTimelineItems (
    Phase,
    [Description],
    StartDate,
    EndDate,
    [Status],
    Progress,
    Dependencies,
    [Owner],
    Notes,
    AssessmentId,
    CreatedDate,
    LastModifiedDate
) VALUES 
-- Timeline for Assessment 1 (E-commerce)
('Infrastructure Assessment', 'Complete assessment of current infrastructure and cloud readiness evaluation', '2024-01-15', '2024-02-15', 'Completed', 100, NULL, 'Infrastructure Team', 'Initial assessment phase completed successfully', 1, GETDATE(), GETDATE()),
('Application Modernization Planning', 'Design microservices architecture and migration strategy', '2024-02-16', '2024-03-30', 'In Progress', 65, 'Infrastructure Assessment', 'Architecture Team', 'Working on containerization strategy', 1, GETDATE(), GETDATE()),
('Security Implementation', 'Implement security controls and compliance measures', '2024-04-01', '2024-05-15', 'Not Started', 0, 'Application Modernization Planning', 'Security Team', 'Awaiting architecture finalization', 1, GETDATE(), GETDATE()),
('Go-Live and Testing', 'Production deployment and user acceptance testing', '2024-05-16', '2024-06-30', 'Not Started', 0, 'Security Implementation', 'DevOps Team', 'Final phase before production', 1, GETDATE(), GETDATE()),

-- Timeline for Assessment 2 (Banking)
('Legacy System Analysis', 'Comprehensive analysis of COBOL core banking system', '2024-02-01', '2024-03-15', 'Completed', 100, NULL, 'Legacy Systems Team', 'Analysis complete, documented all dependencies', 2, GETDATE(), GETDATE()),
('Regulatory Compliance Review', 'Ensure all new systems meet banking regulations', '2024-03-16', '2024-04-30', 'In Progress', 40, 'Legacy System Analysis', 'Compliance Team', 'Working with legal on SOX requirements', 2, GETDATE(), GETDATE()),
('Data Migration Strategy', 'Plan and execute customer data migration with zero downtime', '2024-05-01', '2024-07-15', 'Not Started', 0, 'Regulatory Compliance Review', 'Data Engineering Team', 'Awaiting compliance approval', 2, GETDATE(), GETDATE()),
('Security Framework Implementation', 'Deploy zero trust security model across all systems', '2024-07-16', '2024-09-15', 'Not Started', 0, 'Data Migration Strategy', 'Cybersecurity Team', 'Pending architecture review', 2, GETDATE(), GETDATE()),

-- Timeline for Assessment 3 (Healthcare)
('HIPAA Compliance Assessment', 'Evaluate current HIPAA compliance status and gaps', '2024-03-10', '2024-04-10', 'Completed', 100, NULL, 'Compliance Team', 'Initial assessment complete, gaps identified', 3, GETDATE(), GETDATE()),
('EMR System Integration', 'Integrate new platform with existing EMR systems', '2024-04-11', '2024-06-30', 'In Progress', 55, 'HIPAA Compliance Assessment', 'Integration Team', 'Working on HL7 to FHIR conversion', 3, GETDATE(), GETDATE()),
('Telehealth Platform Development', 'Build and test telehealth consultation features', '2024-07-01', '2024-09-15', 'Not Started', 0, 'EMR System Integration', 'Development Team', 'Awaiting integration completion', 3, GETDATE(), GETDATE()),
('Clinical Staff Training', 'Train healthcare staff on new platform features', '2024-09-16', '2024-11-30', 'Not Started', 0, 'Telehealth Platform Development', 'Training Team', 'Training materials being prepared', 3, GETDATE(), GETDATE()),
('Production Rollout', 'Phased rollout to all healthcare facilities', '2024-12-01', '2024-12-20', 'Not Started', 0, 'Clinical Staff Training', 'Operations Team', 'Final deployment phase', 3, GETDATE(), GETDATE());

PRINT 'ProjectTimelineItems seeded successfully!'
SELECT COUNT(*) as [ProjectTimelineItems Count] FROM ProjectTimelineItems;