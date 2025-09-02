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

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'recommendations', '{"strategicRecommendations": [{"priority": "High", "category": "Technology", "title": "Implement FHIR-compliant data integration", "description": "Standardize healthcare data exchange using HL7 FHIR standards", "estimatedCost": 450000, "timeframe": "6 months", "businessImpact": "Improved interoperability and care coordination"}], "tacticalRecommendations": [{"priority": "Medium", "category": "Process", "title": "Establish clinical data governance", "description": "Create comprehensive data governance framework for clinical data", "estimatedCost": 125000, "timeframe": "3 months"}], "overallScore": 82}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Missing AI Analysis Results

-- DevOps Analysis Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'devops', '{"currentMaturity": {"cicd": "Basic", "automation": 60, "monitoring": 70, "security": 65}, "recommendedImprovements": ["Implement GitOps workflows", "Add automated testing pipelines", "Enhance monitoring and observability"], "maturityScore": 68, "estimatedEffort": "6 months", "toolingRecommendations": ["Azure DevOps", "GitHub Actions", "Terraform"]}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'devops', '{"currentMaturity": {"cicd": "Manual", "automation": 30, "monitoring": 80, "security": 90}, "recommendedImprovements": ["Establish CI/CD pipelines", "Automate deployment processes", "Implement infrastructure as code"], "maturityScore": 52, "estimatedEffort": "12 months", "toolingRecommendations": ["Azure DevOps", "Jenkins", "Ansible"]}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'devops', '{"currentMaturity": {"cicd": "Intermediate", "automation": 75, "monitoring": 85, "security": 95}, "recommendedImprovements": ["Enhance automated testing", "Improve deployment consistency", "Add chaos engineering practices"], "maturityScore": 78, "estimatedEffort": "8 months", "toolingRecommendations": ["GitHub Actions", "Docker", "Kubernetes"]}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Cloud Migration Analysis Results  
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'cloudmigration', '{"migrationStrategy": "Hybrid Cloud", "readinessScore": 82, "estimatedTimeline": "8 months", "costAnalysis": {"migrationCost": 1200000, "monthlySavings": 45000}, "riskFactors": ["Data migration complexity", "Legacy system dependencies"], "recommendedApproach": "Phased migration with containerization"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'cloudmigration', '{"migrationStrategy": "Private Cloud First", "readinessScore": 45, "estimatedTimeline": "18 months", "costAnalysis": {"migrationCost": 3500000, "monthlySavings": 75000}, "riskFactors": ["Regulatory compliance", "Zero downtime requirements", "Legacy COBOL systems"], "recommendedApproach": "Strangler fig pattern with extensive testing"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'cloudmigration', '{"migrationStrategy": "HIPAA-Compliant Cloud", "readinessScore": 73, "estimatedTimeline": "12 months", "costAnalysis": {"migrationCost": 2100000, "monthlySavings": 60000}, "riskFactors": ["Patient data security", "Compliance validation", "Integration complexity"], "recommendedApproach": "Azure Healthcare APIs with BAA compliance"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Architecture Review Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'architecturereview', '{"applications": [{"name": "Patient Management System", "currentArchitecture": "Monolithic", "recommendedPattern": "Microservices", "migrationComplexity": "Medium", "businessImpact": "High"}, {"name": "Medical Imaging Platform", "currentArchitecture": "Desktop", "recommendedPattern": "Cloud-Native Web", "migrationComplexity": "High", "businessImpact": "Critical"}], "overallScore": 71, "recommendedApproach": "API-first modernization with FHIR compliance"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Infrastructure Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'infrastructure', '{"currentState": {"servers": 45, "databases": 12, "totalCost": 180000}, "recommendedState": {"cloudProvider": "Azure", "estimatedMonthlyCost": 95000, "savings": 85000}, "migrationStrategy": "Hybrid approach with on-premises core", "timeline": "15 months", "riskLevel": "High"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Healthcare%'), 'infrastructure', '{"currentState": {"servers": 28, "databases": 8, "totalCost": 120000}, "recommendedState": {"cloudProvider": "Azure", "estimatedMonthlyCost": 65000, "savings": 55000}, "migrationStrategy": "HIPAA-compliant cloud migration", "timeline": "10 months", "riskLevel": "Medium"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Data Architecture Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'dataarchitecture', '{"dataSources": 25, "dataVolume": "15.2TB", "currentComplexity": "Very High", "recommendedApproach": "Modern Data Warehouse with Real-time Analytics", "migrationEffort": "Very High", "complianceLevel": "SOX + PCI DSS", "estimatedCost": 2800000}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Security Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'security', '{"currentSecurityPosture": "Standard Web Security", "recommendedModel": "Cloud-Native Security with WAF", "criticalFindings": 5, "complianceGaps": 2, "recommendedInvestment": 850000, "timeToImplement": "6 months", "riskReduction": "80%"}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

-- Additional Recommendations Results
((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%E-commerce%'), 'recommendations', '{"strategicRecommendations": [{"priority": "High", "category": "Architecture", "title": "Implement microservices architecture", "description": "Break down monolithic applications into microservices", "estimatedCost": 750000, "timeframe": "8 months", "businessImpact": "Improved scalability and maintainability"}], "tacticalRecommendations": [{"priority": "Medium", "category": "Performance", "title": "Implement caching strategy", "description": "Add Redis caching for improved performance", "estimatedCost": 95000, "timeframe": "2 months"}], "overallScore": 78}', GETDATE(), GETDATE(), 'Simulation', '1.0'),

((SELECT TOP 1 Id FROM Assessments WHERE [Name] LIKE '%Banking%'), 'recommendations', '{"strategicRecommendations": [{"priority": "Critical", "category": "Modernization", "title": "Core banking system modernization", "description": "Replace legacy COBOL system with modern architecture", "estimatedCost": 2800000, "timeframe": "18 months", "businessImpact": "Regulatory compliance and digital enablement"}], "tacticalRecommendations": [{"priority": "High", "category": "Security", "title": "Implement Zero Trust", "description": "Deploy comprehensive zero trust security framework", "estimatedCost": 950000, "timeframe": "12 months"}], "overallScore": 65}', GETDATE(), GETDATE(), 'Simulation', '1.0');

PRINT 'AIAnalysisResults seeded successfully!'
SELECT COUNT(*) as [AIAnalysisResults Count] FROM AIAnalysisResults;
SELECT ModuleName, COUNT(*) as [Results Per Module] FROM AIAnalysisResults GROUP BY ModuleName ORDER BY ModuleName;