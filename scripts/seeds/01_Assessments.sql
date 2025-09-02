-- Seed data for Assessments table (3 assessments)
PRINT 'Seeding Assessments table...'

INSERT INTO Assessments (
    [Name],
    [Description],
    [Status],
    Budget,
    PotentialSavings,
    EstimatedCost,
    CreatedDate,
    StartedDate,
    CompletedDate,
    [Type],
    Scope,
    BusinessObjective,
    Timeline,
    Notes,
    BusinessContext,
    OverallScore,
    SecurityScore,
    CloudReadinessScore,
    CodeQualityScore,
    InfrastructureScore,
    DevOpsMaturityScore,
    DatabaseOptimizationScore,
    DocumentationScore,
    ApplicationCount,
    LastModifiedDate
) VALUES 
-- Assessment 1: E-commerce Platform Migration
('TechCorp Solutions - E-commerce Platform Migration', 'Migration of legacy e-commerce platform to cloud-native architecture with enhanced scalability and performance', 'In Progress', 2500000.00, 850000.00, 2200000.00, GETDATE(), '2024-01-15', '2024-06-30', 'Cloud Migration', 'Full Platform Modernization', 'Improve customer experience and reduce operational costs through cloud-native architecture', '6 months', 'Focus on microservices architecture and containerization', 'E-commerce platform serving 1M+ customers with peak traffic of 50K concurrent users', 78, 72, 85, 74, 82, 68, 76, 71, 4, GETDATE()),

-- Assessment 2: Financial Services Modernization  
('SecureBank Ltd - Core Banking System Modernization', 'Modernization of core banking systems with enhanced security and compliance for digital banking transformation', 'Planning', 4200000.00, 1200000.00, 3800000.00, GETDATE(), '2024-02-01', '2024-09-15', 'Legacy Modernization', 'Core Banking Transformation', 'Meet regulatory requirements while enabling digital banking innovation', '8 months', 'COBOL to modern stack migration with zero downtime requirements', 'Legacy mainframe system processing 100K+ daily transactions with strict regulatory compliance', 65, 88, 42, 58, 48, 38, 92, 55, 4, GETDATE()),

-- Assessment 3: Healthcare Data Platform
('MedTech Innovations - Healthcare Data Analytics Platform', 'Implementation of HIPAA-compliant data analytics platform for patient care optimization and clinical decision support', 'Discovery', 3800000.00, 950000.00, 3400000.00, GETDATE(), '2024-03-10', '2024-12-20', 'Data Platform', 'Healthcare Analytics', 'Improve patient outcomes through data-driven clinical decision support', '10 months', 'FHIR-compliant platform with AI/ML capabilities for clinical insights', 'Multi-facility healthcare system serving 250K+ patients with complex data integration requirements', 72, 85, 76, 68, 74, 71, 88, 79, 4, GETDATE());

PRINT 'Assessments seeded successfully!'
SELECT COUNT(*) as [Assessments Count] FROM Assessments;