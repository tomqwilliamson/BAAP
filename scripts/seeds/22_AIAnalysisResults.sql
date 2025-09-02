-- Seed data for AIAnalysisResults table
PRINT 'Seeding AIAnalysisResults table...'

INSERT INTO AIAnalysisResults (
    AssessmentId,
    ModuleName,
    ResultsJson,
    CreatedDate,
    LastModifiedDate,
    AnalysisMode,
    [Version]
) VALUES 
-- AI Analysis Results for Assessment 1 (E-commerce Platform Migration)
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'businesscontext', '{"findings": [{"category": "Strategic Alignment", "score": 85, "assessment": "Strong alignment with digital transformation goals", "recommendations": ["Prioritize customer experience improvements", "Focus on scalability architecture"]}], "overallScore": 85, "keyInsights": "E-commerce transformation shows excellent strategic alignment with significant growth potential"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'architecturereview', '{"applications": [{"name": "Customer Web Portal", "currentArchitecture": "Monolithic", "recommendedPattern": "Microservices", "migrationComplexity": "Medium", "businessImpact": "High"}, {"name": "Payment Processing API", "currentArchitecture": "Service-Oriented", "recommendedPattern": "Event-Driven", "migrationComplexity": "Low", "businessImpact": "Medium"}], "overallScore": 78, "recommendedApproach": "Gradual microservices migration with API-first design"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'infrastructure', '{"currentState": {"servers": 12, "databases": 3, "totalCost": 45000}, "recommendedState": {"cloudProvider": "Azure", "estimatedMonthlyCost": 28000, "savings": 17000}, "migrationStrategy": "Rehost and Replatform", "timeline": "6 months", "riskLevel": "Medium"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'dataarchitecture', '{"dataSources": 8, "dataVolume": "2.5TB", "currentComplexity": "High", "recommendedApproach": "Data Lake with Analytics Pipeline", "migrationEffort": "Medium", "complianceLevel": "Standard", "estimatedCost": 350000}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- AI Analysis Results for Assessment 2 (Financial Services Modernization)
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'businesscontext', '{"findings": [{"category": "Regulatory Compliance", "score": 92, "assessment": "Critical compliance requirements well-defined", "recommendations": ["Implement Zero Trust security model", "Establish comprehensive audit trails"]}], "overallScore": 88, "keyInsights": "Banking modernization requires careful balance of innovation and regulatory compliance"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'architecturereview', '{"applications": [{"name": "Core Banking Engine", "currentArchitecture": "Mainframe Monolith", "recommendedPattern": "Domain-Driven Microservices", "migrationComplexity": "Very High", "businessImpact": "Critical"}, {"name": "Online Banking Portal", "currentArchitecture": "N-Tier", "recommendedPattern": "Cloud-Native SPA", "migrationComplexity": "Medium", "businessImpact": "High"}], "overallScore": 65, "recommendedApproach": "Strangler Fig pattern for gradual legacy replacement"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'security', '{"currentSecurityPosture": "Traditional Perimeter", "recommendedModel": "Zero Trust Architecture", "criticalFindings": 8, "complianceGaps": 3, "recommendedInvestment": 2800000, "timeToImplement": "12 months", "riskReduction": "75%"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- AI Analysis Results for Assessment 3 (Healthcare Data Platform)
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'businesscontext', '{"findings": [{"category": "Patient Care Quality", "score": 90, "assessment": "Strong focus on patient outcomes and care coordination", "recommendations": ["Implement FHIR-compliant data exchange", "Focus on clinical decision support systems"]}], "overallScore": 87, "keyInsights": "Healthcare analytics platform shows strong potential for improving patient outcomes while maintaining strict compliance"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'dataarchitecture', '{"dataSources": 15, "dataVolume": "8.7TB", "currentComplexity": "Very High", "recommendedApproach": "FHIR-compliant Data Platform with AI/ML Pipeline", "migrationEffort": "High", "complianceLevel": "HIPAA + HITECH", "estimatedCost": 1250000}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'security', '{"currentSecurityPosture": "HIPAA Compliant", "recommendedModel": "Enhanced Zero Trust with Healthcare Extensions", "criticalFindings": 2, "complianceGaps": 1, "recommendedInvestment": 890000, "timeToImplement": "8 months", "riskReduction": "85%"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'recommendations', '{"strategicRecommendations": [{"priority": "High", "category": "Technology", "title": "Implement FHIR-compliant data integration", "description": "Standardize healthcare data exchange using HL7 FHIR standards", "estimatedCost": 450000, "timeframe": "6 months", "businessImpact": "Improved interoperability and care coordination"}], "tacticalRecommendations": [{"priority": "Medium", "category": "Process", "title": "Establish clinical data governance", "description": "Create comprehensive data governance framework for clinical data", "estimatedCost": 125000, "timeframe": "3 months"}], "overallScore": 82}', GETDATE(), GETDATE(), 'Simulation', '1.0');

PRINT 'AIAnalysisResults seeded successfully!'
SELECT COUNT(*) as [AIAnalysisResults Count] FROM AIAnalysisResults;
SELECT ModuleName, COUNT(*) as [Results Per Module] FROM AIAnalysisResults GROUP BY ModuleName ORDER BY ModuleName;