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
('Repository Pattern', 85, 'Good', 'Continue using but ensure proper abstraction and avoid leaky abstractions', 'Advanced', 1, GETDATE()),
('MVC Pattern', 100, 'Good', 'Well implemented across the application, maintain current approach', 'Advanced', 1, GETDATE()),
('Singleton Pattern', 45, 'Poor', 'Overused, causing testing difficulties. Replace with dependency injection where possible', 'Basic', 1, GETDATE()),
('Factory Pattern', 60, 'Fair', 'Good implementation but could be extended to more areas of the codebase', 'Intermediate', 1, GETDATE()),

-- Patterns for Architecture Review 2 (Banking)
('Batch Processing', 95, 'Poor', 'Legacy batch pattern causing delays. Migrate to real-time event streaming', 'Legacy', 2, GETDATE()),
('Procedural Programming', 100, 'Poor', 'COBOL procedural code difficult to maintain. Introduce object-oriented design patterns', 'Legacy', 2, GETDATE()),
('Monolithic Architecture', 100, 'Poor', 'Single mainframe application prevents scaling. Decompose into microservices', 'Legacy', 2, GETDATE()),

-- Patterns for Architecture Review 3 (Healthcare)
('Client-Server Pattern', 75, 'Fair', 'Traditional but functional. Consider moving to more modern patterns', 'Intermediate', 3, GETDATE()),
('Service Locator Pattern', 40, 'Fair', 'Works but creates hidden dependencies. Migrate to dependency injection', 'Basic', 3, GETDATE()),
('Factory Pattern', 55, 'Good', 'Well implemented for medical device interfaces', 'Intermediate', 3, GETDATE()),
('Observer Pattern', 30, 'Good', 'Used for real-time patient monitoring. Expand usage for event-driven features', 'Intermediate', 3, GETDATE());

PRINT 'ArchitecturePatterns seeded successfully!'
SELECT COUNT(*) as [ArchitecturePatterns Count] FROM ArchitecturePatterns;