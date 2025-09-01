-- Seed data for Applications table (multiple apps per assessment)
PRINT 'Seeding Applications table...'

INSERT INTO Applications (
    [Name],
    [Type],
    Category,
    Technology,
    [Description],
    ComplexityScore,
    EstimatedMigrationCost,
    MonthlyCost,
    AssessmentId,
    CreatedDate,
    LinesOfCode,
    SecurityRating,
    CloudReadinessScore
) VALUES 
-- Applications for Assessment 1 (E-commerce)
('Customer Web Portal', 'Web Application', 'Frontend', 'React, Node.js', 'Customer-facing e-commerce website with shopping cart and checkout', 75, 450000.00, 12000.00, 1, GETDATE(), 85000, 8, 9),
('Payment Processing API', 'API Service', 'Backend', 'C# .NET Core', 'Secure payment processing microservice with fraud detection', 90, 680000.00, 18500.00, 1, GETDATE(), 42000, 9, 7),
('Inventory Management System', 'Desktop Application', 'Backend', 'Java Spring Boot', 'Real-time inventory tracking and warehouse management', 65, 320000.00, 9500.00, 1, GETDATE(), 67000, 7, 6),
('Mobile Shopping App', 'Mobile Application', 'Frontend', 'React Native', 'iOS and Android mobile shopping application', 80, 520000.00, 15000.00, 1, GETDATE(), 58000, 8, 8),

-- Applications for Assessment 2 (Banking)
('Core Banking Engine', 'Enterprise System', 'Backend', 'COBOL, DB2', 'Legacy core banking system handling all financial transactions', 95, 1800000.00, 45000.00, 2, GETDATE(), 250000, 6, 3),
('Online Banking Portal', 'Web Application', 'Frontend', 'Angular, .NET Core', 'Secure customer online banking interface', 85, 750000.00, 22000.00, 2, GETDATE(), 95000, 9, 8),
('ATM Network Controller', 'System Service', 'Infrastructure', 'C++, Windows Service', 'ATM network management and transaction processing', 88, 920000.00, 28000.00, 2, GETDATE(), 78000, 8, 5),
('Fraud Detection System', 'AI/ML Service', 'Backend', 'Python, TensorFlow', 'Real-time fraud detection and prevention system', 92, 1100000.00, 35000.00, 2, GETDATE(), 52000, 9, 9),

-- Applications for Assessment 3 (Healthcare)
('Patient Management System', 'Web Application', 'Frontend', 'Vue.js, .NET Core', 'Comprehensive patient record management and scheduling', 82, 680000.00, 19500.00, 3, GETDATE(), 76000, 8, 7),
('Medical Imaging Platform', 'Desktop Application', 'Specialized', 'C#, WPF, DICOM', 'Medical imaging storage, processing and analysis platform', 90, 1250000.00, 38000.00, 3, GETDATE(), 125000, 7, 6),
('Lab Results API', 'API Service', 'Backend', 'Java Spring Boot', 'Laboratory results integration and reporting service', 75, 420000.00, 14000.00, 3, GETDATE(), 45000, 9, 8),
('Telehealth Platform', 'Web Application', 'Frontend', 'React, WebRTC', 'Secure video consultation and remote patient monitoring', 88, 890000.00, 26500.00, 3, GETDATE(), 68000, 9, 9);

PRINT 'Applications seeded successfully!'
SELECT COUNT(*) as [Applications Count] FROM Applications;