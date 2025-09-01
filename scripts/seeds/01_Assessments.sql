-- Seed data for Assessments table (3 assessments)
PRINT 'Seeding Assessments table...'

INSERT INTO Assessments (
    OrganizationName,
    ProjectName,
    [Description],
    StartDate,
    EndDate,
    [Status],
    Budget,
    PotentialSavings,
    CreatedBy,
    CreatedDate
) VALUES 
-- Assessment 1: E-commerce Platform Migration
('TechCorp Solutions', 'E-commerce Platform Migration', 'Migration of legacy e-commerce platform to cloud-native architecture', '2024-01-15', '2024-06-30', 'In Progress', 2500000.00, 850000.00, 'System Admin', GETDATE()),

-- Assessment 2: Financial Services Modernization  
('SecureBank Ltd', 'Core Banking System Modernization', 'Modernization of core banking systems with enhanced security and compliance', '2024-02-01', '2024-09-15', 'Planning', 4200000.00, 1200000.00, 'System Admin', GETDATE()),

-- Assessment 3: Healthcare Data Platform
('MedTech Innovations', 'Healthcare Data Analytics Platform', 'Implementation of HIPAA-compliant data analytics platform for patient care optimization', '2024-03-10', '2024-12-20', 'Discovery', 3800000.00, 950000.00, 'System Admin', GETDATE());

PRINT 'Assessments seeded successfully!'
SELECT COUNT(*) as [Assessments Count] FROM Assessments;