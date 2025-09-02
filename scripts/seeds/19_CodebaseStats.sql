-- Seed data for CodebaseStats table
PRINT 'Seeding CodebaseStats table...'

INSERT INTO CodebaseStats (
    [Language],
    LinesOfCode,
    Percentage,
    FileCount,
    ArchitectureReviewId,
    CreatedDate
) VALUES 
-- Codebase Stats for Architecture Review 1 (E-commerce)
('C#', 145000, 58.0, 850, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('JavaScript', 62000, 24.8, 420, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('TypeScript', 28000, 11.2, 180, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('SQL', 12000, 4.8, 95, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),
('CSS', 3000, 1.2, 305, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%')), GETDATE()),

-- Codebase Stats for Architecture Review 2 (Banking)
('COBOL', 380000, 80.0, 450, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('JCL', 45000, 9.5, 120, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('SQL', 35000, 7.4, 85, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Java', 12000, 2.5, 180, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),
('Shell Script', 3000, 0.6, 57, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%')), GETDATE()),

-- Codebase Stats for Architecture Review 3 (Healthcare)
('C#', 125000, 39.8, 520, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Java', 85000, 27.1, 380, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('JavaScript', 48000, 15.3, 210, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('Python', 32000, 10.2, 95, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE()),
('SQL', 24000, 7.6, 35, (SELECT TOP 1 Id FROM ArchitectureReviews WHERE AssessmentId = (SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%')), GETDATE());

PRINT 'CodebaseStats seeded successfully!'
SELECT COUNT(*) as [CodebaseStats Count] FROM CodebaseStats;