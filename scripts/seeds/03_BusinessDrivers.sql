-- Seed data for BusinessDrivers table
PRINT 'Seeding BusinessDrivers table...'

INSERT INTO BusinessDrivers (
    [Name],
    [Description],
    Priority,
    Impact,
    Urgency,
    BusinessValue,
    CreatedDate,
    AssessmentId
) VALUES 
-- Business Drivers for Assessment 1 (E-commerce)
('Digital Customer Experience Enhancement', 'Modernize customer touchpoints to improve user experience and increase conversion rates', 'High', 9, 8, 'Expected 35% increase in conversion rates and 25% improvement in customer satisfaction scores', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Scalability for Peak Season Traffic', 'Ensure platform can handle Black Friday and holiday shopping traffic spikes', 'High', 9, 9, 'Prevent revenue loss estimated at $2M during peak shopping periods', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Operational Cost Reduction', 'Reduce infrastructure and maintenance costs through cloud migration', 'Medium', 7, 6, 'Projected 30% reduction in operational costs, saving $850K annually', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),
('Market Expansion Capability', 'Enable rapid expansion into new geographical markets', 'Medium', 8, 7, 'Open access to 3 new markets with potential $5M annual revenue', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')),

-- Business Drivers for Assessment 2 (Banking)
('Regulatory Compliance Modernization', 'Meet evolving regulatory requirements and audit standards', 'Critical', 10, 10, 'Avoid potential $50M in regulatory fines and maintain banking license', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Real-time Transaction Processing', 'Enable instant payments and real-time balance updates', 'High', 9, 8, 'Compete with fintech solutions and retain younger customer demographics', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Enhanced Security Posture', 'Strengthen cybersecurity defenses against increasing threats', 'Critical', 10, 9, 'Prevent potential data breaches with estimated $100M impact', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),
('Digital Banking Innovation', 'Launch new digital banking products and services', 'High', 8, 7, 'Capture 15% market share in digital banking segment worth $800M', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')),

-- Business Drivers for Assessment 3 (Healthcare)
('Patient Care Quality Improvement', 'Enhance patient outcomes through better data analytics and care coordination', 'High', 9, 8, 'Improve patient satisfaction by 40% and reduce readmission rates by 25%', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('HIPAA and Healthcare Compliance', 'Ensure full compliance with healthcare regulations and data privacy requirements', 'Critical', 10, 9, 'Avoid regulatory penalties and maintain accreditation status', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Operational Efficiency in Care Delivery', 'Streamline clinical workflows and reduce administrative burden', 'High', 8, 8, 'Reduce administrative costs by $2M annually and increase physician productivity by 20%', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')),
('Telehealth and Remote Care Expansion', 'Expand remote patient monitoring and virtual care capabilities', 'Medium', 8, 7, 'Serve 50% more patients remotely and reduce facility overhead by 15%', GETDATE(), (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'));

PRINT 'BusinessDrivers seeded successfully!'
SELECT COUNT(*) as [BusinessDrivers Count] FROM BusinessDrivers;