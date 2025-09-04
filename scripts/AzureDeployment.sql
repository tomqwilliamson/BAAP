-- BAAP Azure Database Deployment Script
-- This script sets up the complete BAAP database in Azure SQL Database
-- Run this script against your Azure SQL Database

-- Step 1: Apply all migrations (this will create the schema)
-- Note: The migration SQL is generated from the ApplyMigrations.sql file

-- Step 2: Insert Industry Classification Seed Data
-- This data is essential for the application to function

-- Insert Industry Classifications
IF NOT EXISTS (SELECT 1 FROM [IndustryClassifications] WHERE [IndustryCode] = 'ECOM')
BEGIN
    SET IDENTITY_INSERT [IndustryClassifications] ON;
    
    INSERT INTO [IndustryClassifications] ([Id], [IndustryCode], [IndustryName], [Description], [ParentIndustryId], [ComplianceFrameworks], [TechnologyPatterns], [RegulatoryConsiderations], [KeyPerformanceIndicators], [RiskFactors], [BestPractices], [CloudAdoptionPattern], [TypicalComplexityScore], [SecurityRequirements], [CustomPromptTemplate], [CreatedAt], [LastUpdated]) 
    VALUES 
    (1, 'ECOM', 'E-commerce & Online Retail', 'Digital commerce platforms, online marketplaces, and retail technology solutions.', NULL, '["PCI-DSS","GDPR","CCPA","SOX","FTC Guidelines"]', '["Microservices","API-First","CDN","Event-Driven","Mobile-First","Progressive Web Apps"]', '["Payment Card Industry","Data Privacy Laws","Consumer Protection","Tax Compliance","Cross-Border Trade"]', '["Conversion Rate","Cart Abandonment","Average Order Value","Customer Lifetime Value","Site Performance","Mobile Traffic %"]', '["Payment Fraud","Data Breaches","Peak Load Handling","Supply Chain Disruption","Third-Party Integrations"]', '["Implement fraud detection","Use payment tokenization","Optimize for mobile","Implement caching strategies","Use A/B testing","Monitor real-time analytics"]', 'Hybrid cloud with edge computing for global performance and compliance', 7, '["PCI-DSS Compliance","WAF Protection","DDoS Protection","SSL/TLS Encryption","API Security","OWASP Guidelines"]', 'Analyze this e-commerce platform focusing on scalability for peak traffic, payment security, mobile optimization, and customer experience. Consider seasonal load patterns, payment processing requirements, and global compliance needs.', '2025-09-03 19:09:42.2433333', '2025-09-03 19:09:42.2433333'),
    
    (2, 'FINTECH', 'Financial Services & Fintech', 'Banking, insurance, investment services, and financial technology platforms.', NULL, '["SOX","PCI-DSS","GDPR","Basel III","FFIEC","ISO 27001","NIST Cybersecurity Framework"]', '["Event Sourcing","CQRS","Blockchain","API-First","Zero-Trust Architecture","Real-Time Processing"]', '["Banking Regulations","Anti-Money Laundering","Know Your Customer","Data Residency","Audit Requirements","Stress Testing"]', '["Risk-Adjusted Returns","Operational Risk","Liquidity Ratios","Customer Acquisition Cost","Digital Adoption","Compliance Score"]', '["Regulatory Changes","Cybersecurity Threats","Market Volatility","Operational Risk","Third-Party Dependencies","Legacy System Integration"]', '["Implement zero-trust security","Use immutable audit trails","Deploy real-time monitoring","Ensure data encryption","Regular penetration testing","Implement disaster recovery"]', 'Private cloud with strict compliance controls and hybrid connectivity', 9, '["Multi-Factor Authentication","End-to-End Encryption","HSM Integration","Real-Time Fraud Detection","Audit Logging","Zero-Trust Network"]', 'Analyze this financial services system with emphasis on regulatory compliance, security controls, audit trails, and risk management. Focus on data protection, transaction integrity, and regulatory reporting capabilities.', '2025-09-03 19:09:42.2433333', '2025-09-03 19:09:42.2433333'),
    
    (3, 'HEALTHCARE', 'Healthcare & Life Sciences', 'Healthcare providers, medical devices, pharmaceuticals, and health technology.', NULL, '["HIPAA","FDA 21 CFR Part 11","GDPR","SOX","ISO 13485","GxP","HITECH"]', '["HL7 FHIR","Microservices","API Gateway","Event-Driven","IoT Integration","AI/ML Analytics"]', '["Patient Privacy","Medical Device Regulations","Clinical Trial Compliance","Drug Development","Healthcare Data Exchange","Telehealth Regulations"]', '["Patient Outcomes","Clinical Efficiency","Cost Per Treatment","Readmission Rates","System Uptime","Data Quality Score"]', '["Data Privacy Breaches","System Downtime","Regulatory Non-Compliance","Interoperability Issues","Cybersecurity Threats","Patient Safety"]', '["Implement HIPAA safeguards","Use healthcare data standards","Deploy backup systems","Regular compliance audits","Staff training programs","Incident response plans"]', 'Private cloud with healthcare-specific compliance and redundancy', 8, '["HIPAA Security Rule","Data Encryption","Access Controls","Audit Trails","Backup & Recovery","Network Segmentation"]', 'Analyze this healthcare system focusing on HIPAA compliance, patient data protection, clinical workflow efficiency, and interoperability with healthcare standards. Consider patient safety, data privacy, and regulatory requirements.', '2025-09-03 19:09:42.2433333', '2025-09-03 19:09:42.2433333'),
    
    (4, 'MANUFACTURING', 'Manufacturing & Industrial', 'Manufacturing operations, supply chain management, and industrial automation.', NULL, '["ISO 9001","ISO 14001","OSHA","EPA Regulations","GDPR","Industry 4.0 Standards"]', '["IoT Sensors","Edge Computing","Digital Twin","MES Integration","SCADA Systems","Predictive Analytics"]', '["Environmental Compliance","Worker Safety","Quality Standards","Supply Chain Regulations","International Trade","Sustainability Requirements"]', '["Overall Equipment Effectiveness","Quality Yield","Energy Efficiency","Supply Chain Performance","Safety Incidents","Production Throughput"]', '["Supply Chain Disruption","Equipment Failure","Quality Issues","Regulatory Changes","Cybersecurity in OT","Skills Gap"]', '["Implement predictive maintenance","Use digital twins","Deploy IoT monitoring","Integrate supply chain systems","Focus on sustainability","Cybersecurity for OT"]', 'Hybrid cloud with edge computing for real-time manufacturing operations', 6, '["OT/IT Segregation","Industrial Firewalls","Endpoint Protection","Network Monitoring","Access Controls","Incident Response"]', 'Analyze this manufacturing system emphasizing operational efficiency, supply chain integration, predictive maintenance, and Industry 4.0 capabilities. Focus on production optimization, quality control, and operational technology security.', '2025-09-03 19:09:42.2433333', '2025-09-03 19:09:42.2433333'),
    
    (5, 'TECHNOLOGY', 'Technology & Software Services', 'Software development, SaaS platforms, technology consulting, and IT services.', NULL, '["SOC 2","ISO 27001","GDPR","CCPA","FedRAMP","HIPAA (if applicable)","PCI-DSS (if applicable)"]', '["Cloud-Native","Microservices","DevOps","CI/CD","API-First","Container Orchestration","Serverless"]', '["Data Privacy","Intellectual Property","Open Source Licensing","International Data Transfer","Service Level Agreements","Vendor Management"]', '["System Availability","Response Time","Code Quality","Development Velocity","Customer Satisfaction","Security Incidents"]', '["Scalability Challenges","Security Vulnerabilities","Technical Debt","Talent Retention","Market Competition","Technology Obsolescence"]', '["Adopt cloud-native architecture","Implement DevSecOps","Use automated testing","Monitor performance continuously","Regular security assessments","Invest in team development"]', 'Cloud-first with multi-cloud strategy for resilience and optimization', 5, '["Secure Development","Container Security","API Security","Identity Management","Vulnerability Management","Security Monitoring"]', 'Analyze this technology platform focusing on scalability, development practices, security implementation, and operational excellence. Consider technical architecture, development velocity, and service reliability.', '2025-09-03 19:09:42.2433333', '2025-09-03 19:09:42.2433333');
    
    SET IDENTITY_INSERT [IndustryClassifications] OFF;
END

-- Step 3: Insert Sample Assessment Data
-- This provides some initial data for testing and demonstration

IF NOT EXISTS (SELECT 1 FROM [Assessments] WHERE [Name] = 'Demo Assessment - Financial Services')
BEGIN
    SET IDENTITY_INSERT [Assessments] ON;
    
    INSERT INTO [Assessments] ([Id], [Name], [Description], [Status], [CreatedDate], [StartedDate], [CompletedDate], [EstimatedCost], [PotentialSavings], [OverallScore], [SecurityScore], [CloudReadinessScore], [CodeQualityScore], [InfrastructureScore], [DevOpsMaturityScore], [DatabaseOptimizationScore], [DocumentationScore], [ApplicationCount], [Type], [Scope], [BusinessObjective], [Timeline], [Budget], [Notes], [BusinessContext], [LastModifiedDate])
    VALUES 
    (1, 'Demo Assessment - Financial Services', 'Sample assessment for financial services modernization', 'Draft', '2025-09-03 20:00:00', NULL, NULL, 2500000.00, 850000.00, 78, 85, 72, 74, 82, 68, 76, 71, 3, 'Cloud Migration', 'Enterprise Modernization', 'Modernize core banking systems for improved compliance and customer experience', '12 months', 3000000.00, 'Focus on regulatory compliance and zero-trust security', 'Legacy mainframe-based banking system serving 500K+ customers with strict regulatory requirements', '2025-09-03 20:00:00');
    
    SET IDENTITY_INSERT [Assessments] OFF;
END

-- Step 4: Insert Sample Applications for the Demo Assessment
IF NOT EXISTS (SELECT 1 FROM [Applications] WHERE [Name] = 'Core Banking System')
BEGIN
    SET IDENTITY_INSERT [Applications] ON;
    
    INSERT INTO [Applications] ([Id], [Name], [Description], [Type], [Category], [Technology], [BusinessCriticality], [ModernizationPriority], [LinesOfCode], [ComplexityScore], [SecurityRating], [CloudReadinessScore], [CriticalIssues], [SecurityIssues], [CriticalFindings], [HighFindings], [EstimatedMigrationCost], [MonthlyCost], [CreatedDate], [LastAnalyzedDate], [AssessmentId])
    VALUES 
    (1, 'Core Banking System', 'Legacy mainframe system handling all financial transactions', 'Enterprise System', 'Backend', 'COBOL, DB2', 'Critical', 1, 450000, 95, 6, 3, 12, 18, 8, 15, 1800000.00, 45000.00, '2025-09-03 20:00:00', '2025-09-03 20:00:00', 1),
    
    (2, 'Online Banking Portal', 'Customer-facing web application for online banking', 'Web Application', 'Frontend', 'Angular, .NET Core', 'High', 2, 85000, 75, 8, 7, 3, 5, 2, 6, 650000.00, 18000.00, '2025-09-03 20:00:00', '2025-09-03 20:00:00', 1),
    
    (3, 'Payment Processing API', 'Real-time payment processing and fraud detection', 'API Service', 'Backend', 'Java Spring Boot', 'Critical', 1, 120000, 88, 9, 8, 2, 3, 1, 4, 980000.00, 28000.00, '2025-09-03 20:00:00', '2025-09-03 20:00:00', 1);
    
    SET IDENTITY_INSERT [Applications] OFF;
END

-- Step 5: Insert Business Drivers
IF NOT EXISTS (SELECT 1 FROM [BusinessDrivers] WHERE [Name] = 'Regulatory Compliance Modernization')
BEGIN
    SET IDENTITY_INSERT [BusinessDrivers] ON;
    
    INSERT INTO [BusinessDrivers] ([Id], [Name], [Description], [Priority], [Impact], [Urgency], [BusinessValue], [CreatedDate], [AssessmentId])
    VALUES 
    (1, 'Regulatory Compliance Modernization', 'Meet evolving regulatory requirements and audit standards', 'Critical', 10, 10, 'Avoid potential $50M in regulatory fines and maintain banking license', '2025-09-03 20:00:00', 1),
    
    (2, 'Enhanced Security Posture', 'Strengthen cybersecurity defenses against increasing threats', 'Critical', 10, 9, 'Prevent potential data breaches with estimated $100M impact', '2025-09-03 20:00:00', 1),
    
    (3, 'Digital Banking Innovation', 'Launch new digital banking products and services', 'High', 8, 7, 'Capture 15% market share in digital banking segment worth $800M', '2025-09-03 20:00:00', 1);
    
    SET IDENTITY_INSERT [BusinessDrivers] OFF;
END

-- Step 6: Insert Stakeholders
IF NOT EXISTS (SELECT 1 FROM [Stakeholders] WHERE [Email] = 'cto@bank.com')
BEGIN
    SET IDENTITY_INSERT [Stakeholders] ON;
    
    INSERT INTO [Stakeholders] ([Id], [Name], [Role], [Department], [Email], [InfluenceLevel], [InterestLevel], [Notes], [CreatedDate], [AssessmentId])
    VALUES 
    (1, 'Sarah Johnson', 'Chief Technology Officer', 'Technology', 'cto@bank.com', 'High', 'High', 'Executive sponsor and final decision maker for technology investments', '2025-09-03 20:00:00', 1),
    
    (2, 'Michael Rodriguez', 'Head of Compliance', 'Risk & Compliance', 'compliance@bank.com', 'High', 'High', 'Ensures regulatory compliance and risk mitigation', '2025-09-03 20:00:00', 1),
    
    (3, 'Jennifer Chen', 'VP of Engineering', 'Engineering', 'engineering@bank.com', 'High', 'High', 'Technical lead responsible for implementation oversight', '2025-09-03 20:00:00', 1);
    
    SET IDENTITY_INSERT [Stakeholders] OFF;
END

-- Step 7: Insert Recommendations
IF NOT EXISTS (SELECT 1 FROM [Recommendations] WHERE [Title] = 'Core Banking System Modernization')
BEGIN
    SET IDENTITY_INSERT [Recommendations] ON;
    
    INSERT INTO [Recommendations] ([Id], [Title], [Description], [Category], [Priority], [Effort], [Impact], [RecommendationType], [Timeline], [Investment], [EstimatedROI], [EstimatedCost], [PotentialSavings], [TimeframeWeeks], [Implementation], [Benefits], [Risks], [IsAccepted], [CreatedDate], [AssessmentId])
    VALUES 
    (1, 'Core Banking System Modernization', 'Replace legacy COBOL system with modern cloud-native core banking platform', 'Modernization', 'Critical', 'XLarge', 'Critical', 'Strategic', '18-24 months', '$2,800,000', '129%', 2800000.00, 800000.00, 96, 'Gradual migration with parallel systems', 'Modern architecture, improved performance, compliance', 'High complexity, business continuity risks', 0, '2025-09-03 20:00:00', 1),
    
    (2, 'Zero Trust Security Framework', 'Implement comprehensive zero trust security model for all banking operations', 'Security', 'Critical', 'Large', 'Critical', 'Strategic', '12-15 months', '$950,000', '310%', 950000.00, 2000000.00, 60, 'Identity-based security with continuous verification', 'Enhanced security, compliance, reduced breach risk', 'Complex implementation, user adaptation', 0, '2025-09-03 20:00:00', 1);
    
    SET IDENTITY_INSERT [Recommendations] OFF;
END

PRINT 'BAAP Azure database deployment completed successfully!';
PRINT 'Industry classifications, sample assessment data, and related entities have been created.';
PRINT 'The application is ready for use in Azure.';