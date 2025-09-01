-- Seed data for Stakeholders table
PRINT 'Seeding Stakeholders table...'

INSERT INTO Stakeholders (
    [Name],
    [Role],
    Department,
    Email,
    InfluenceLevel,
    InterestLevel,
    Notes,
    CreatedDate,
    AssessmentId
) VALUES 
-- Stakeholders for Assessment 1 (E-commerce)
('Sarah Johnson', 'Chief Technology Officer', 'Technology', 's.johnson@techcorp.com', 'High', 'High', 'Executive sponsor and final decision maker for technology investments', GETDATE(), 1),
('Michael Chen', 'VP of Engineering', 'Engineering', 'm.chen@techcorp.com', 'High', 'High', 'Technical lead responsible for implementation oversight', GETDATE(), 1),
('Lisa Rodriguez', 'Director of Operations', 'Operations', 'l.rodriguez@techcorp.com', 'Medium', 'High', 'Responsible for operational impact and business continuity', GETDATE(), 1),
('David Kim', 'Security Manager', 'Information Security', 'd.kim@techcorp.com', 'Medium', 'High', 'Ensures security compliance and risk management', GETDATE(), 1),
('Amanda Foster', 'Customer Experience Manager', 'Marketing', 'a.foster@techcorp.com', 'Medium', 'Medium', 'Represents customer impact and user experience requirements', GETDATE(), 1),

-- Stakeholders for Assessment 2 (Banking)
('Robert Thompson', 'Chief Information Officer', 'Information Technology', 'r.thompson@securebank.com', 'High', 'High', 'IT strategy leader and transformation champion', GETDATE(), 2),
('Jennifer Martinez', 'Head of Compliance', 'Risk & Compliance', 'j.martinez@securebank.com', 'High', 'High', 'Ensures regulatory compliance and risk mitigation', GETDATE(), 2),
('William Brown', 'SVP of Operations', 'Operations', 'w.brown@securebank.com', 'High', 'Medium', 'Oversees operational impact and service delivery', GETDATE(), 2),
('Maria Gonzalez', 'Chief Security Officer', 'Cybersecurity', 'm.gonzalez@securebank.com', 'High', 'High', 'Leads cybersecurity strategy and threat management', GETDATE(), 2),
('James Wilson', 'Digital Banking Director', 'Digital Services', 'j.wilson@securebank.com', 'Medium', 'High', 'Drives digital transformation and customer experience', GETDATE(), 2),

-- Stakeholders for Assessment 3 (Healthcare)
('Dr. Emily Parker', 'Chief Medical Officer', 'Medical Affairs', 'e.parker@medtech.com', 'High', 'High', 'Clinical leader ensuring patient care quality and safety', GETDATE(), 3),
('Thomas Anderson', 'Chief Technology Officer', 'Information Technology', 't.anderson@medtech.com', 'High', 'High', 'Technology strategy and healthcare IT implementation lead', GETDATE(), 3),
('Rachel Davis', 'Compliance Director', 'Legal & Compliance', 'r.davis@medtech.com', 'High', 'High', 'Ensures HIPAA compliance and healthcare regulatory adherence', GETDATE(), 3),
('Kevin Lee', 'Director of Clinical Operations', 'Clinical Operations', 'k.lee@medtech.com', 'Medium', 'High', 'Manages clinical workflow impact and staff training needs', GETDATE(), 3),
('Susan Miller', 'Privacy Officer', 'Privacy & Security', 's.miller@medtech.com', 'Medium', 'High', 'Protects patient data privacy and manages security policies', GETDATE(), 3);

PRINT 'Stakeholders seeded successfully!'
SELECT COUNT(*) as [Stakeholders Count] FROM Stakeholders;