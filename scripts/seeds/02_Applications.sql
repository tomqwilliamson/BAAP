-- Seed data for Applications table (multiple apps per assessment)
PRINT 'Seeding Applications table...'

INSERT INTO Applications (
    [Name],
    [Description],
    [Type],
    Category,
    Technology,
    LinesOfCode,
    ComplexityScore,
    SecurityRating,
    CloudReadinessScore,
    CriticalIssues,
    SecurityIssues,
    CriticalFindings,
    HighFindings,
    EstimatedMigrationCost,
    MonthlyCost,
    CreatedDate,
    LastAnalyzedDate,
    AssessmentId
) VALUES 
-- Applications for Assessment 1 (E-commerce)
('Customer Web Portal', 'Customer-facing e-commerce website with shopping cart and checkout', 'Web Application', 'Frontend', 'React, Node.js', 85000, 75, 8, 9, 3, 5, 2, 4, 450000.00, 12000.00, GETDATE(), GETDATE(), 1),
('Payment Processing API', 'Secure payment processing microservice with fraud detection', 'API Service', 'Backend', 'C# .NET Core', 42000, 90, 9, 7, 1, 2, 1, 3, 680000.00, 18500.00, GETDATE(), GETDATE(), 1),
('Inventory Management System', 'Real-time inventory tracking and warehouse management', 'Desktop Application', 'Backend', 'Java Spring Boot', 67000, 65, 7, 6, 4, 3, 3, 5, 320000.00, 9500.00, GETDATE(), GETDATE(), 1),
('Mobile Shopping App', 'iOS and Android mobile shopping application', 'Mobile Application', 'Frontend', 'React Native', 58000, 80, 8, 8, 2, 4, 2, 3, 520000.00, 15000.00, GETDATE(), GETDATE(), 1),

-- Applications for Assessment 2 (Banking)
('Core Banking Engine', 'Legacy core banking system handling all financial transactions', 'Enterprise System', 'Backend', 'COBOL, DB2', 250000, 95, 6, 3, 8, 12, 6, 10, 1800000.00, 45000.00, GETDATE(), GETDATE(), 2),
('Online Banking Portal', 'Secure customer online banking interface', 'Web Application', 'Frontend', 'Angular, .NET Core', 95000, 85, 9, 8, 2, 3, 1, 4, 750000.00, 22000.00, GETDATE(), GETDATE(), 2),
('ATM Network Controller', 'ATM network management and transaction processing', 'System Service', 'Infrastructure', 'C++, Windows Service', 78000, 88, 8, 5, 5, 6, 4, 7, 920000.00, 28000.00, GETDATE(), GETDATE(), 2),
('Fraud Detection System', 'Real-time fraud detection and prevention system', 'AI/ML Service', 'Backend', 'Python, TensorFlow', 52000, 92, 9, 9, 1, 2, 1, 2, 1100000.00, 35000.00, GETDATE(), GETDATE(), 2),

-- Applications for Assessment 3 (Healthcare)
('Patient Management System', 'Comprehensive patient record management and scheduling', 'Web Application', 'Frontend', 'Vue.js, .NET Core', 76000, 82, 8, 7, 3, 4, 2, 5, 680000.00, 19500.00, GETDATE(), GETDATE(), 3),
('Medical Imaging Platform', 'Medical imaging storage, processing and analysis platform', 'Desktop Application', 'Specialized', 'C#, WPF, DICOM', 125000, 90, 7, 6, 6, 8, 5, 9, 1250000.00, 38000.00, GETDATE(), GETDATE(), 3),
('Lab Results API', 'Laboratory results integration and reporting service', 'API Service', 'Backend', 'Java Spring Boot', 45000, 75, 9, 8, 1, 2, 1, 3, 420000.00, 14000.00, GETDATE(), GETDATE(), 3),
('Telehealth Platform', 'Secure video consultation and remote patient monitoring', 'Web Application', 'Frontend', 'React, WebRTC', 68000, 88, 9, 9, 2, 3, 1, 4, 890000.00, 26500.00, GETDATE(), GETDATE(), 3);

PRINT 'Applications seeded successfully!'
SELECT COUNT(*) as [Applications Count] FROM Applications;