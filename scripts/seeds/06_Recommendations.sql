-- Seed data for Recommendations table
PRINT 'Seeding Recommendations table...'

INSERT INTO Recommendations (
    Title,
    [Description],
    Category,
    Priority,
    EstimatedCost,
    PotentialSavings,
    ExpectedTimeline,
    ImplementationComplexity,
    AssessmentId,
    CreatedDate
) VALUES 
-- Recommendations for Assessment 1 (E-commerce)
('Migrate to Microservices Architecture', 'Break down monolithic applications into microservices for better scalability and maintainability', 'Architecture', 'High', 750000.00, 300000.00, '8-12 months', 'High', 1, GETDATE()),
('Implement Cloud-Native CI/CD Pipeline', 'Establish automated deployment pipeline with containerization and orchestration', 'DevOps', 'High', 180000.00, 120000.00, '3-4 months', 'Medium', 1, GETDATE()),
('Upgrade Frontend to Progressive Web App', 'Enhance mobile experience and performance through PWA implementation', 'Frontend', 'Medium', 250000.00, 100000.00, '4-6 months', 'Medium', 1, GETDATE()),
('Implement Advanced Caching Strategy', 'Deploy Redis and CDN solutions for improved performance and cost reduction', 'Performance', 'Medium', 95000.00, 180000.00, '2-3 months', 'Low', 1, GETDATE()),

-- Recommendations for Assessment 2 (Banking)
('Core Banking System Modernization', 'Replace legacy COBOL system with modern cloud-native core banking platform', 'Modernization', 'Critical', 2800000.00, 800000.00, '18-24 months', 'Very High', 2, GETDATE()),
('Zero Trust Security Framework', 'Implement comprehensive zero trust security model for all banking operations', 'Security', 'Critical', 950000.00, 2000000.00, '12-15 months', 'High', 2, GETDATE()),
('Real-time Analytics Platform', 'Deploy modern data platform for real-time fraud detection and business intelligence', 'Analytics', 'High', 680000.00, 400000.00, '6-9 months', 'High', 2, GETDATE()),
('API-First Digital Banking Platform', 'Create comprehensive API ecosystem for third-party integrations and innovation', 'Digital Transformation', 'High', 520000.00, 350000.00, '8-12 months', 'Medium', 2, GETDATE()),

-- Recommendations for Assessment 3 (Healthcare)
('HIPAA-Compliant Cloud Migration', 'Migrate patient data and applications to HIPAA-compliant cloud infrastructure', 'Compliance', 'Critical', 1200000.00, 500000.00, '10-14 months', 'High', 3, GETDATE()),
('Interoperability Enhancement', 'Implement FHIR standards for seamless integration with external healthcare systems', 'Integration', 'High', 480000.00, 200000.00, '6-8 months', 'Medium', 3, GETDATE()),
('AI-Powered Clinical Decision Support', 'Deploy machine learning models for clinical decision support and patient outcome prediction', 'AI/ML', 'Medium', 720000.00, 300000.00, '8-12 months', 'High', 3, GETDATE()),
('Telehealth Platform Expansion', 'Enhance telehealth capabilities with advanced remote monitoring and consultation features', 'Digital Health', 'Medium', 380000.00, 250000.00, '4-6 months', 'Medium', 3, GETDATE());

PRINT 'Recommendations seeded successfully!'
SELECT COUNT(*) as [Recommendations Count] FROM Recommendations;