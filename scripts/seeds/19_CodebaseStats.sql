-- Seed data for CodebaseStats table
PRINT 'Seeding CodebaseStats table...'

INSERT INTO CodebaseStats (
    TotalLinesOfCode,
    NumberOfFiles,
    NumberOfClasses,
    NumberOfMethods,
    AverageCyclomaticComplexity,
    CodeDuplicationPercentage,
    TechnicalDebtRatio,
    TestCoveragePercentage,
    ArchitectureReviewId,
    MeasuredDate
) VALUES 
-- Codebase Stats for Architecture Review 1 (E-commerce)
(250000, 1850, 420, 3200, 8.7, 12.4, 15.8, 78.5, 1, GETDATE()),

-- Codebase Stats for Architecture Review 2 (Banking)
(475000, 892, 156, 2400, 15.2, 28.7, 35.4, 52.1, 2, GETDATE()),

-- Codebase Stats for Architecture Review 3 (Healthcare)
(314000, 1240, 315, 2650, 10.3, 16.9, 22.1, 69.8, 3, GETDATE());

PRINT 'CodebaseStats seeded successfully!'
SELECT COUNT(*) as [CodebaseStats Count] FROM CodebaseStats;