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
('Frontend Framework', 'React', '18.2.0', 'Current', 'Low', 'Keep current version, consider Next.js for SSR capabilities', 1, GETDATE()),
('Backend Runtime', '.NET Framework', '4.8', 'Legacy', 'High', 'Migrate to .NET 8 for cloud-native features and performance', 1, GETDATE()),
('Database', 'SQL Server', '2019', 'Current', 'Medium', 'Consider Azure SQL Database for cloud scalability', 1, GETDATE()),
('Caching', 'In-Memory Cache', 'N/A', 'Outdated', 'Medium', 'Implement Redis for distributed caching', 1, GETDATE()),
('Message Queue', 'None', 'N/A', 'Legacy', 'High', 'Implement Azure Service Bus or RabbitMQ', 1, GETDATE()),

-- Technology Stack for Architecture Review 2 (Banking)
('Programming Language', 'COBOL', 'Enterprise COBOL 6.3', 'Legacy', 'Critical', 'Gradually migrate to Java or C# maintaining business logic', 2, GETDATE()),
('Database', 'IBM DB2', '12.1', 'Outdated', 'High', 'Migrate to PostgreSQL or Oracle for cloud compatibility', 2, GETDATE()),
('User Interface', 'Green Screen Terminals', '3270', 'Legacy', 'Critical', 'Replace with modern web UI using React or Angular', 2, GETDATE()),
('Middleware', 'IBM WebSphere', '9.0', 'Outdated', 'High', 'Migrate to Kubernetes with microservices', 2, GETDATE()),
('Security', 'IBM RACF', '2.6', 'Legacy', 'High', 'Implement modern IAM with OAuth 2.0 and SAML', 2, GETDATE()),

-- Technology Stack for Architecture Review 3 (Healthcare)
('Integration Standard', 'HL7 v2', '2.8', 'Outdated', 'High', 'Migrate to FHIR R4 for interoperability', 3, GETDATE()),
('Frontend Framework', 'Windows Forms', '.NET Framework 4.5', 'Legacy', 'Medium', 'Migrate to React or Blazor web application', 3, GETDATE()),
('Database', 'SQL Server', '2017', 'Outdated', 'Medium', 'Upgrade to SQL Server 2022 or PostgreSQL', 3, GETDATE()),
('Imaging Standard', 'DICOM', '3.0', 'Current', 'Low', 'Maintain compliance, add cloud storage', 3, GETDATE()),
('API Framework', 'WCF Services', '.NET Framework 4.5', 'Legacy', 'High', 'Migrate to ASP.NET Core Web APIs', 3, GETDATE());

PRINT 'TechnologyStacks seeded successfully!'
SELECT COUNT(*) as [TechnologyStacks Count] FROM TechnologyStacks;