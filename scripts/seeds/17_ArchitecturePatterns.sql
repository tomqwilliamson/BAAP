-- Seed data for ArchitecturePatterns table
PRINT 'Seeding ArchitecturePatterns table...'

INSERT INTO ArchitecturePatterns (
    PatternName,
    Usage,
    Quality,
    Recommendation,
    Maturity,
    ArchitectureReviewId,
    CreatedDate
) VALUES 
-- Patterns for Architecture Review 1 (E-commerce)
('Repository Pattern', 85, 'Good', 'Continue using but ensure proper abstraction and avoid leaky abstractions', 'Advanced', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('MVC Pattern', 100, 'Good', 'Well implemented across the application, maintain current approach', 'Advanced', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Singleton Pattern', 45, 'Poor', 'Overused, causing testing difficulties. Replace with dependency injection where possible', 'Basic', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('Factory Pattern', 60, 'Fair', 'Good implementation but could be extended to more areas of the codebase', 'Intermediate', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),

-- Patterns for Architecture Review 2 (Banking)
('Batch Processing', 95, 'Poor', 'Legacy batch pattern causing delays. Migrate to real-time event streaming', 'Legacy', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Procedural Programming', 100, 'Poor', 'COBOL procedural code difficult to maintain. Introduce object-oriented design patterns', 'Legacy', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Monolithic Architecture', 100, 'Poor', 'Single mainframe application prevents scaling. Decompose into microservices', 'Legacy', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),

-- Patterns for Architecture Review 3 (Healthcare)
('Client-Server Pattern', 75, 'Fair', 'Traditional but functional. Consider moving to more modern patterns', 'Intermediate', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Service Locator Pattern', 40, 'Fair', 'Works but creates hidden dependencies. Migrate to dependency injection', 'Basic', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Factory Pattern', 55, 'Good', 'Well implemented for medical device interfaces', 'Intermediate', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Observer Pattern', 30, 'Good', 'Used for real-time patient monitoring. Expand usage for event-driven features', 'Intermediate', (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE());

PRINT 'ArchitecturePatterns seeded successfully!'
SELECT COUNT(*) as [ArchitecturePatterns Count] FROM ArchitecturePatterns;