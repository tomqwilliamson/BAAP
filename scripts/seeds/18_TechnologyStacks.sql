-- Seed data for TechnologyStacks table
PRINT 'Seeding TechnologyStacks table...'

INSERT INTO TechnologyStacks (
    Category,
    TechnologyName,
    Version,
    [Description],
    RecommendedAction,
    ModernizationPriority,
    ArchitectureReviewId,
    CreatedDate
) VALUES 
-- Technology Stack for Architecture Review 1 (E-commerce)
('Frontend', 'React', '18.2.0', 'Modern JavaScript library for building user interfaces', 'Keep - Already modern and well-maintained', 'Low', 1, GETDATE()),
('Backend', '.NET Framework', '4.8', 'Legacy .NET Framework monolithic application', 'Migrate to .NET Core/.NET 6+ for cloud compatibility', 'High', 1, GETDATE()),
('Database', 'SQL Server', '2019', 'Relational database management system', 'Migrate to Azure SQL Database with elastic scaling', 'Medium', 1, GETDATE()),
('Caching', 'In-Memory Cache', 'N/A', 'Application-level caching using System.Web.Caching', 'Replace with Redis for distributed caching', 'Medium', 1, GETDATE()),
('Message Queue', 'None', 'N/A', 'No message queuing system currently implemented', 'Implement Azure Service Bus for microservices communication', 'High', 1, GETDATE()),

-- Technology Stack for Architecture Review 2 (Banking)
('Mainframe', 'COBOL', 'Enterprise COBOL 6.3', 'Legacy COBOL applications for core banking functions', 'Gradually replace with modern languages, maintain critical functions', 'Critical', 2, GETDATE()),
('Database', 'IBM DB2', '12.1', 'Enterprise database system for mainframe and distributed computing', 'Migrate to cloud-native database with real-time capabilities', 'High', 2, GETDATE()),
('Frontend', 'Green Screen Terminals', '3270', 'Legacy terminal-based user interface', 'Replace with modern web-based interfaces using React/Angular', 'High', 2, GETDATE()),
('Middleware', 'IBM WebSphere', '9.0', 'Enterprise application server and integration platform', 'Modernize to cloud-native container platform', 'High', 2, GETDATE()),
('Security', 'IBM RACF', '2.6', 'Resource Access Control Facility for mainframe security', 'Supplement with modern identity and access management solutions', 'High', 2, GETDATE()),

-- Technology Stack for Architecture Review 3 (Healthcare)
('EMR Integration', 'HL7 v2', '2.8', 'Legacy healthcare data exchange standard', 'Migrate to FHIR R4 for modern interoperability', 'High', 3, GETDATE()),
('Frontend', 'Windows Forms', '.NET Framework 4.5', 'Desktop application framework for clinical applications', 'Migrate to web-based interface using React or Blazor', 'Medium', 3, GETDATE()),
('Database', 'SQL Server', '2017', 'Relational database for patient records and clinical data', 'Upgrade to SQL Server 2022 with enhanced security features', 'Medium', 3, GETDATE()),
('Imaging', 'DICOM', '3.0', 'Digital Imaging and Communications in Medicine standard', 'Maintain compliance while adding cloud storage capabilities', 'Low', 3, GETDATE()),
('API Layer', 'WCF Services', '.NET Framework 4.5', 'Windows Communication Foundation for service-oriented architecture', 'Migrate to ASP.NET Core Web APIs with OpenAPI specification', 'High', 3, GETDATE());

PRINT 'TechnologyStacks seeded successfully!'
SELECT COUNT(*) as [TechnologyStacks Count] FROM TechnologyStacks;