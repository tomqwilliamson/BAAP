-- Seed data for Recommendations table
PRINT 'Seeding Recommendations table...'

INSERT INTO Recommendations (
    Title,
    [Description],
    Category,
    Priority,
    Effort,
    Impact,
    RecommendationType,
    Timeline,
    Investment,
    EstimatedROI,
    EstimatedCost,
    PotentialSavings,
    TimeframeWeeks,
    Implementation,
    Benefits,
    Risks,
    IsAccepted,
    CreatedDate,
    AssessmentId
) VALUES 
-- Recommendations for Assessment 1 (E-commerce)
('Migrate to Microservices Architecture', 'Break down monolithic applications into microservices for better scalability and maintainability', 'Architecture', 'High', 'XLarge', 'High', 'Strategic', '8-12 months', '$750,000', '140%', 750000.00, 300000.00, 48, 'Phased migration approach with containerization', 'Improved scalability, maintainability, and team autonomy', 'Complex coordination, potential performance overhead', 0, GETDATE(), 1),
('Implement Cloud-Native CI/CD Pipeline', 'Establish automated deployment pipeline with containerization and orchestration', 'DevOps', 'High', 'Large', 'High', 'Tactical', '3-4 months', '$180,000', '167%', 180000.00, 120000.00, 16, 'Azure DevOps with containerization and automated testing', 'Faster deployment, reduced errors, improved quality', 'Initial complexity, team training requirements', 0, GETDATE(), 1),
('Upgrade Frontend to Progressive Web App', 'Enhance mobile experience and performance through PWA implementation', 'Frontend', 'Medium', 'Medium', 'Medium', 'Tactical', '4-6 months', '$250,000', '140%', 250000.00, 100000.00, 24, 'React PWA with service workers and caching', 'Better mobile experience, offline capabilities', 'Browser compatibility, caching complexity', 0, GETDATE(), 1),
('Implement Advanced Caching Strategy', 'Deploy Redis and CDN solutions for improved performance and cost reduction', 'Performance', 'Medium', 'Small', 'High', 'QuickWin', '2-3 months', '$95,000', '189%', 95000.00, 180000.00, 12, 'Redis cluster with Azure CDN integration', 'Improved performance, reduced infrastructure costs', 'Cache invalidation complexity, monitoring overhead', 0, GETDATE(), 1),

-- Recommendations for Assessment 2 (Banking)
('Core Banking System Modernization', 'Replace legacy COBOL system with modern cloud-native core banking platform', 'Modernization', 'Critical', 'XLarge', 'Critical', 'Strategic', '18-24 months', '$2,800,000', '129%', 2800000.00, 800000.00, 96, 'Gradual migration with parallel systems', 'Modern architecture, improved performance, compliance', 'High complexity, business continuity risks', 0, GETDATE(), 2),
('Zero Trust Security Framework', 'Implement comprehensive zero trust security model for all banking operations', 'Security', 'Critical', 'XLarge', 'Critical', 'Strategic', '12-15 months', '$950,000', '310%', 950000.00, 2000000.00, 60, 'Identity-based security with continuous verification', 'Enhanced security, compliance, reduced breach risk', 'Complex implementation, user adaptation', 0, GETDATE(), 2),
('Real-time Analytics Platform', 'Deploy modern data platform for real-time fraud detection and business intelligence', 'Analytics', 'High', 'Large', 'High', 'Strategic', '6-9 months', '$680,000', '159%', 680000.00, 400000.00, 36, 'Azure Synapse with real-time streaming', 'Faster fraud detection, better business insights', 'Data quality challenges, integration complexity', 0, GETDATE(), 2),
('API-First Digital Banking Platform', 'Create comprehensive API ecosystem for third-party integrations and innovation', 'Digital Transformation', 'High', 'Large', 'High', 'Strategic', '8-12 months', '$520,000', '167%', 520000.00, 350000.00, 48, 'Azure API Management with OAuth 2.0', 'Third-party integrations, innovation enablement', 'Security management, versioning complexity', 0, GETDATE(), 2),

-- Recommendations for Assessment 3 (Healthcare)
('HIPAA-Compliant Cloud Migration', 'Migrate patient data and applications to HIPAA-compliant cloud infrastructure', 'Compliance', 'Critical', 'XLarge', 'Critical', 'Strategic', '10-14 months', '$1,200,000', '142%', 1200000.00, 500000.00, 56, 'Azure Healthcare APIs with BAA compliance', 'HIPAA compliance, scalability, cost reduction', 'Migration complexity, compliance validation', 0, GETDATE(), 3),
('Interoperability Enhancement', 'Implement FHIR standards for seamless integration with external healthcare systems', 'Integration', 'High', 'Large', 'High', 'Strategic', '6-8 months', '$480,000', '142%', 480000.00, 200000.00, 32, 'Azure FHIR service with HL7 standards', 'Better care coordination, data exchange', 'Standards complexity, integration testing', 0, GETDATE(), 3),
('AI-Powered Clinical Decision Support', 'Deploy machine learning models for clinical decision support and patient outcome prediction', 'AI/ML', 'Medium', 'Large', 'High', 'Strategic', '8-12 months', '$720,000', '142%', 720000.00, 300000.00, 48, 'Azure ML with healthcare-specific models', 'Improved patient outcomes, clinical efficiency', 'Model accuracy, regulatory approval', 0, GETDATE(), 3),
('Telehealth Platform Expansion', 'Enhance telehealth capabilities with advanced remote monitoring and consultation features', 'Digital Health', 'Medium', 'Medium', 'High', 'Tactical', '4-6 months', '$380,000', '166%', 380000.00, 250000.00, 24, 'Teams integration with IoT monitoring', 'Remote care capabilities, patient satisfaction', 'Technology adoption, reimbursement challenges', 0, GETDATE(), 3);

PRINT 'Recommendations seeded successfully!'
SELECT COUNT(*) as [Recommendations Count] FROM Recommendations;