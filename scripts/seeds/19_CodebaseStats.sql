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
('C#', 145000, 58.0, 850, 1, GETDATE()),
('JavaScript', 62000, 24.8, 420, 1, GETDATE()),
('TypeScript', 28000, 11.2, 180, 1, GETDATE()),
('SQL', 12000, 4.8, 95, 1, GETDATE()),
('CSS', 3000, 1.2, 305, 1, GETDATE()),

-- Codebase Stats for Architecture Review 2 (Banking)
('COBOL', 380000, 80.0, 450, 2, GETDATE()),
('JCL', 45000, 9.5, 120, 2, GETDATE()),
('SQL', 35000, 7.4, 85, 2, GETDATE()),
('Java', 12000, 2.5, 180, 2, GETDATE()),
('Shell Script', 3000, 0.6, 57, 2, GETDATE()),

-- Codebase Stats for Architecture Review 3 (Healthcare)
('C#', 125000, 39.8, 520, 3, GETDATE()),
('Java', 85000, 27.1, 380, 3, GETDATE()),
('JavaScript', 48000, 15.3, 210, 3, GETDATE()),
('Python', 32000, 10.2, 95, 3, GETDATE()),
('SQL', 24000, 7.6, 35, 3, GETDATE());

PRINT 'CodebaseStats seeded successfully!'
SELECT COUNT(*) as [CodebaseStats Count] FROM CodebaseStats;