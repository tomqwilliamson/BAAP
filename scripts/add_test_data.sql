-- Add test data for existing Assessment ID 1
PRINT 'Adding test data for Assessment ID 1...'

-- Add Applications
INSERT INTO Applications (Name, [Type], Category, Technology, [Description], ComplexityScore, EstimatedMigrationCost, MonthlyCost, AssessmentId, CreatedDate, LinesOfCode, SecurityRating, CloudReadinessScore) VALUES
('Customer Portal Frontend', 'Web Application', 'Frontend', 'JavaScript React', 'Customer-facing e-commerce website', 65, 450000.00, 12000.00, 1, GETDATE(), 45000, 7, 8),
('Payment Processing API', 'API Service', 'Backend', 'C# .NET Core', 'Payment processing service', 85, 680000.00, 8500.00, 1, GETDATE(), 28000, 9, 7);

-- Add Business Drivers
INSERT INTO BusinessDrivers ([Name], [Description], Priority, Impact, Urgency, BusinessValue, CreatedDate, AssessmentId) VALUES
('Digital Customer Experience', 'Improve online customer experience', 'High', 9, 8, 'Expected 25% increase in conversion rates', GETDATE(), 1),
('Scalability for Peak Seasons', 'Handle traffic spikes', 'High', 8, 9, 'Prevent revenue loss during peak seasons', GETDATE(), 1);

-- Add Stakeholders
INSERT INTO Stakeholders ([Name], [Role], Department, Email, InfluenceLevel, InterestLevel, Notes, CreatedDate, AssessmentId) VALUES
('Jennifer Chen', 'CTO', 'Technology', 'j.chen@company.com', 'High', 'High', 'Executive sponsor', GETDATE(), 1),
('Marcus Rodriguez', 'VP Engineering', 'Engineering', 'm.rodriguez@company.com', 'High', 'High', 'Technical leader', GETDATE(), 1);

PRINT 'Test data inserted successfully!'