-- Seed data for ProjectTimelineItems table
PRINT 'Seeding ProjectTimelineItems table...'

INSERT INTO ProjectTimelineItems (
    Title,
    [Description],
    StartDate,
    EndDate,
    [Status],
    Progress,
    AssignedTo,
    AssessmentId,
    CreatedDate,
    UpdatedDate
) VALUES 
-- Timeline for Assessment 1 (E-commerce)
('Infrastructure Assessment', 'Complete assessment of current infrastructure and cloud readiness evaluation', '2024-01-15', '2024-02-15', 'Completed', 100, 'Infrastructure Team', 1, GETDATE(), GETDATE()),
('Application Modernization Planning', 'Design microservices architecture and migration strategy', '2024-02-16', '2024-03-30', 'In Progress', 65, 'Architecture Team', 1, GETDATE(), GETDATE()),
('Security Implementation', 'Implement security controls and compliance measures', '2024-04-01', '2024-05-15', 'Planned', 0, 'Security Team', 1, GETDATE(), GETDATE()),
('Go-Live and Testing', 'Production deployment and user acceptance testing', '2024-05-16', '2024-06-30', 'Planned', 0, 'DevOps Team', 1, GETDATE(), GETDATE()),

-- Timeline for Assessment 2 (Banking)
('Legacy System Analysis', 'Comprehensive analysis of COBOL core banking system', '2024-02-01', '2024-03-15', 'Completed', 100, 'Legacy Systems Team', 2, GETDATE(), GETDATE()),
('Regulatory Compliance Review', 'Ensure all new systems meet banking regulations', '2024-03-16', '2024-04-30', 'In Progress', 40, 'Compliance Team', 2, GETDATE(), GETDATE()),
('Data Migration Strategy', 'Plan and execute customer data migration with zero downtime', '2024-05-01', '2024-07-15', 'Planned', 0, 'Data Engineering Team', 2, GETDATE(), GETDATE()),
('Security Framework Implementation', 'Deploy zero trust security model across all systems', '2024-07-16', '2024-09-15', 'Planned', 0, 'Cybersecurity Team', 2, GETDATE(), GETDATE()),

-- Timeline for Assessment 3 (Healthcare)
('HIPAA Compliance Assessment', 'Evaluate current HIPAA compliance status and gaps', '2024-03-10', '2024-04-10', 'Completed', 100, 'Compliance Team', 3, GETDATE(), GETDATE()),
('EMR System Integration', 'Integrate new platform with existing EMR systems', '2024-04-11', '2024-06-30', 'In Progress', 55, 'Integration Team', 3, GETDATE(), GETDATE()),
('Telehealth Platform Development', 'Build and test telehealth consultation features', '2024-07-01', '2024-09-15', 'Planned', 0, 'Development Team', 3, GETDATE(), GETDATE()),
('Clinical Staff Training', 'Train healthcare staff on new platform features', '2024-09-16', '2024-11-30', 'Planned', 0, 'Training Team', 3, GETDATE(), GETDATE()),
('Production Rollout', 'Phased rollout to all healthcare facilities', '2024-12-01', '2024-12-20', 'Planned', 0, 'Operations Team', 3, GETDATE(), GETDATE());

PRINT 'ProjectTimelineItems seeded successfully!'
SELECT COUNT(*) as [ProjectTimelineItems Count] FROM ProjectTimelineItems;