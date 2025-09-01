-- Seed data for ArchitectureReviews table
PRINT 'Seeding ArchitectureReviews table...'

INSERT INTO ArchitectureReviews (
    ReviewName,
    [Description],
    CurrentArchitecture,
    ProposedArchitecture,
    ArchitectureScore,
    ModernizationApproach,
    AssessmentId,
    CreatedDate,
    UpdatedDate
) VALUES 
-- Architecture Reviews for each Assessment
('E-commerce Platform Architecture Review', 'Comprehensive review of monolithic e-commerce platform for cloud modernization', 'Monolithic .NET Framework application with SQL Server database on physical servers', 'Microservices architecture using .NET Core, containerized with Kubernetes, cloud-native data services', 7.2, 'Strangler Fig Pattern - Gradual decomposition of monolith into microservices', 1, GETDATE(), GETDATE()),

('Core Banking System Architecture Review', 'Legacy mainframe system modernization assessment for digital banking transformation', 'COBOL mainframe with DB2 database, batch processing, green screen terminals', 'Event-driven microservices architecture with real-time processing, API-first design, modern web and mobile interfaces', 4.8, 'Database-First Approach - Modernize data layer first, then gradually replace business logic', 2, GETDATE(), GETDATE()),

('Healthcare Platform Architecture Review', 'Medical systems integration and HIPAA-compliant cloud architecture assessment', 'Distributed client-server applications with local databases, point-to-point integrations', 'Unified cloud platform with FHIR-compliant APIs, centralized data lake, microservices for clinical workflows', 6.5, 'API Gateway Pattern - Standardize integrations through secure API layer with healthcare interoperability standards', 3, GETDATE(), GETDATE());

PRINT 'ArchitectureReviews seeded successfully!'
SELECT COUNT(*) as [ArchitectureReviews Count] FROM ArchitectureReviews;