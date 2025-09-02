-- Seed data for TechnologyStacks table
PRINT 'Seeding TechnologyStacks table...'

INSERT INTO TechnologyStacks (
    Category,
    Technology,
    Version,
    [Status],
    Risk,
    Recommendation,
    ArchitectureReviewId,
    CreatedDate
) VALUES 
-- Technology Stack for Architecture Review 1 (E-commerce)
('Frontend Framework', 'React', '18.2.0', 'Current', 'Low', 'Keep current version, consider Next.js for SSR capabilities', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Backend Runtime', '.NET Framework', '4.8', 'Legacy', 'High', 'Migrate to .NET 8 for cloud-native features and performance', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Database', 'SQL Server', '2019', 'Current', 'Medium', 'Consider Azure SQL Database for cloud scalability', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Caching', 'In-Memory Cache', 'N/A', 'Outdated', 'Medium', 'Implement Redis for distributed caching', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Message Queue', 'None', 'N/A', 'Legacy', 'High', 'Implement Azure Service Bus or RabbitMQ', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),

-- Technology Stack for Architecture Review 2 (Banking)
('Programming Language', 'COBOL', 'Enterprise COBOL 6.3', 'Legacy', 'Critical', 'Gradually migrate to Java or C# maintaining business logic', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Database', 'IBM DB2', '12.1', 'Outdated', 'High', 'Migrate to PostgreSQL or Oracle for cloud compatibility', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('User Interface', 'Green Screen Terminals', '3270', 'Legacy', 'Critical', 'Replace with modern web UI using React or Angular', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Middleware', 'IBM WebSphere', '9.0', 'Outdated', 'High', 'Migrate to Kubernetes with microservices', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Security', 'IBM RACF', '2.6', 'Legacy', 'High', 'Implement modern IAM with OAuth 2.0 and SAML', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),

-- Technology Stack for Architecture Review 3 (Healthcare)
('Integration Standard', 'HL7 v2', '2.8', 'Outdated', 'High', 'Migrate to FHIR R4 for interoperability', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Frontend Framework', 'Windows Forms', '.NET Framework 4.5', 'Legacy', 'Medium', 'Migrate to React or Blazor web application', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Database', 'SQL Server', '2017', 'Outdated', 'Medium', 'Upgrade to SQL Server 2022 or PostgreSQL', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Imaging Standard', 'DICOM', '3.0', 'Current', 'Low', 'Maintain compliance, add cloud storage', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('API Framework', 'WCF Services', '.NET Framework 4.5', 'Legacy', 'High', 'Migrate to ASP.NET Core Web APIs', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE());

PRINT 'TechnologyStacks seeded successfully!'
SELECT COUNT(*) as [TechnologyStacks Count] FROM TechnologyStacks;