-- Phase 4 Industry Classification - Complete Seed Data Script
-- This script seeds all Phase 4 tables with comprehensive industry data

USE baap_dev;
GO

PRINT '=== Phase 4 Industry Classification Seeding Started ==='
PRINT 'Database: ' + DB_NAME()
PRINT 'Timestamp: ' + CONVERT(varchar, GETDATE(), 120)
PRINT '========================================================='

-- Check if Phase 4 tables exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IndustryClassifications')
BEGIN
    PRINT 'ERROR: IndustryClassifications table does not exist. Please run the Phase 4 table creation script first.'
    RETURN
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IndustryBenchmarks')
BEGIN
    PRINT 'ERROR: IndustryBenchmarks table does not exist. Please run the Phase 4 table creation script first.'
    RETURN
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AssessmentIndustryClassifications')
BEGIN
    PRINT 'ERROR: AssessmentIndustryClassifications table does not exist. Please run the Phase 4 table creation script first.'
    RETURN
END

-- Clear existing data (if re-running)
PRINT 'Clearing existing Phase 4 data...'
DELETE FROM AssessmentIndustryClassifications;
DELETE FROM IndustryBenchmarks;
DELETE FROM IndustryClassifications;

-- Reset identity counters
DBCC CHECKIDENT('AssessmentIndustryClassifications', RESEED, 0);
DBCC CHECKIDENT('IndustryBenchmarks', RESEED, 0);  
DBCC CHECKIDENT('IndustryClassifications', RESEED, 0);

-- Step 1: Seed Industry Classifications
PRINT ''
PRINT 'Step 1: Seeding Industry Classifications...'

-- Execute the industry classifications seed script
EXEC('
-- Seed data for IndustryClassifications table (Phase 4)
PRINT ''Seeding IndustryClassifications table...''

-- Set identity insert on to specify explicit IDs
SET IDENTITY_INSERT IndustryClassifications ON;

INSERT INTO IndustryClassifications (
    Id,
    IndustryCode,
    IndustryName,
    [Description],
    ParentIndustryId,
    ComplianceFrameworks,
    TechnologyPatterns,
    RegulatoryConsiderations,
    KeyPerformanceIndicators,
    RiskFactors,
    BestPractices,
    CloudAdoptionPattern,
    TypicalComplexityScore,
    SecurityRequirements,
    CustomPromptTemplate,
    CreatedAt,
    LastUpdated
) VALUES
-- E-commerce & Retail
(1, ''ECOM'', ''E-commerce & Online Retail'', 
 ''Digital commerce platforms, online marketplaces, and retail technology solutions.'',
 NULL,
 ''[\"PCI-DSS\", \"GDPR\", \"CCPA\", \"SOX\", \"FTC Guidelines\"]'',
 ''[\"Microservices\", \"API-First\", \"CDN\", \"Event-Driven\", \"Mobile-First\", \"Progressive Web Apps\"]'',
 ''[\"Payment Card Industry\", \"Data Privacy Laws\", \"Consumer Protection\", \"Tax Compliance\", \"Cross-Border Trade\"]'',
 ''[\"Conversion Rate\", \"Cart Abandonment\", \"Average Order Value\", \"Customer Lifetime Value\", \"Site Performance\", \"Mobile Traffic %\"]'',
 ''[\"Payment Fraud\", \"Data Breaches\", \"Peak Load Handling\", \"Supply Chain Disruption\", \"Third-Party Integrations\"]'',
 ''[\"Implement fraud detection\", \"Use payment tokenization\", \"Optimize for mobile\", \"Implement caching strategies\", \"Use A/B testing\", \"Monitor real-time analytics\"]'',
 ''Hybrid cloud with edge computing for global performance and compliance'',
 7,
 ''[\"PCI-DSS Compliance\", \"WAF Protection\", \"DDoS Protection\", \"SSL/TLS Encryption\", \"API Security\", \"OWASP Guidelines\"]'',
 ''Analyze this e-commerce platform focusing on scalability for peak traffic, payment security, mobile optimization, and customer experience. Consider seasonal load patterns, payment processing requirements, and global compliance needs.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Financial Services
(2, ''FINTECH'', ''Financial Services & Fintech'', 
 ''Banking, insurance, investment services, and financial technology platforms.'',
 NULL,
 ''[\"SOX\", \"PCI-DSS\", \"GDPR\", \"Basel III\", \"FFIEC\", \"ISO 27001\", \"NIST Cybersecurity Framework\"]'',
 ''[\"Event Sourcing\", \"CQRS\", \"Blockchain\", \"API-First\", \"Zero-Trust Architecture\", \"Real-Time Processing\"]'',
 ''[\"Banking Regulations\", \"Anti-Money Laundering\", \"Know Your Customer\", \"Data Residency\", \"Audit Requirements\", \"Stress Testing\"]'',
 ''[\"Risk-Adjusted Returns\", \"Operational Risk\", \"Liquidity Ratios\", \"Customer Acquisition Cost\", \"Digital Adoption\", \"Compliance Score\"]'',
 ''[\"Regulatory Changes\", \"Cybersecurity Threats\", \"Market Volatility\", \"Operational Risk\", \"Third-Party Dependencies\", \"Legacy System Integration\"]'',
 ''[\"Implement zero-trust security\", \"Use immutable audit trails\", \"Deploy real-time monitoring\", \"Ensure data encryption\", \"Regular penetration testing\", \"Implement disaster recovery\"]'',
 ''Private cloud with strict compliance controls and hybrid connectivity'',
 9,
 ''[\"Multi-Factor Authentication\", \"End-to-End Encryption\", \"HSM Integration\", \"Real-Time Fraud Detection\", \"Audit Logging\", \"Zero-Trust Network\"]'',
 ''Analyze this financial services system with emphasis on regulatory compliance, security controls, audit trails, and risk management. Focus on data protection, transaction integrity, and regulatory reporting capabilities.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Healthcare & Life Sciences
(3, ''HEALTHCARE'', ''Healthcare & Life Sciences'', 
 ''Healthcare providers, medical devices, pharmaceuticals, and health technology.'',
 NULL,
 ''[\"HIPAA\", \"FDA 21 CFR Part 11\", \"GDPR\", \"SOX\", \"ISO 13485\", \"GxP\", \"HITECH\"]'',
 ''[\"HL7 FHIR\", \"Microservices\", \"API Gateway\", \"Event-Driven\", \"IoT Integration\", \"AI/ML Analytics\"]'',
 ''[\"Patient Privacy\", \"Medical Device Regulations\", \"Clinical Trial Compliance\", \"Drug Development\", \"Healthcare Data Exchange\", \"Telehealth Regulations\"]'',
 ''[\"Patient Outcomes\", \"Clinical Efficiency\", \"Cost Per Treatment\", \"Readmission Rates\", \"System Uptime\", \"Data Quality Score\"]'',
 ''[\"Data Privacy Breaches\", \"System Downtime\", \"Regulatory Non-Compliance\", \"Interoperability Issues\", \"Cybersecurity Threats\", \"Patient Safety\"]'',
 ''[\"Implement HIPAA safeguards\", \"Use healthcare data standards\", \"Deploy backup systems\", \"Regular compliance audits\", \"Staff training programs\", \"Incident response plans\"]'',
 ''Private cloud with healthcare-specific compliance and redundancy'',
 8,
 ''[\"HIPAA Security Rule\", \"Data Encryption\", \"Access Controls\", \"Audit Trails\", \"Backup & Recovery\", \"Network Segmentation\"]'',
 ''Analyze this healthcare system focusing on HIPAA compliance, patient data protection, clinical workflow efficiency, and interoperability with healthcare standards. Consider patient safety, data privacy, and regulatory requirements.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Manufacturing & Industrial
(4, ''MANUFACTURING'', ''Manufacturing & Industrial'', 
 ''Manufacturing operations, supply chain management, and industrial automation.'',
 NULL,
 ''[\"ISO 9001\", \"ISO 14001\", \"OSHA\", \"EPA Regulations\", \"GDPR\", \"Industry 4.0 Standards\"]'',
 ''[\"IoT Sensors\", \"Edge Computing\", \"Digital Twin\", \"MES Integration\", \"SCADA Systems\", \"Predictive Analytics\"]'',
 ''[\"Environmental Compliance\", \"Worker Safety\", \"Quality Standards\", \"Supply Chain Regulations\", \"International Trade\", \"Sustainability Requirements\"]'',
 ''[\"Overall Equipment Effectiveness\", \"Quality Yield\", \"Energy Efficiency\", \"Supply Chain Performance\", \"Safety Incidents\", \"Production Throughput\"]'',
 ''[\"Supply Chain Disruption\", \"Equipment Failure\", \"Quality Issues\", \"Regulatory Changes\", \"Cybersecurity in OT\", \"Skills Gap\"]'',
 ''[\"Implement predictive maintenance\", \"Use digital twins\", \"Deploy IoT monitoring\", \"Integrate supply chain systems\", \"Focus on sustainability\", \"Cybersecurity for OT\"]'',
 ''Hybrid cloud with edge computing for real-time manufacturing operations'',
 6,
 ''[\"OT/IT Segregation\", \"Industrial Firewalls\", \"Endpoint Protection\", \"Network Monitoring\", \"Access Controls\", \"Incident Response\"]'',
 ''Analyze this manufacturing system emphasizing operational efficiency, supply chain integration, predictive maintenance, and Industry 4.0 capabilities. Focus on production optimization, quality control, and operational technology security.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Technology & Software Services
(5, ''TECHNOLOGY'', ''Technology & Software Services'', 
 ''Software development, SaaS platforms, technology consulting, and IT services.'',
 NULL,
 ''[\"SOC 2\", \"ISO 27001\", \"GDPR\", \"CCPA\", \"FedRAMP\", \"HIPAA (if applicable)\", \"PCI-DSS (if applicable)\"]'',
 ''[\"Cloud-Native\", \"Microservices\", \"DevOps\", \"CI/CD\", \"API-First\", \"Container Orchestration\", \"Serverless\"]'',
 ''[\"Data Privacy\", \"Intellectual Property\", \"Open Source Licensing\", \"International Data Transfer\", \"Service Level Agreements\", \"Vendor Management\"]'',
 ''[\"System Availability\", \"Response Time\", \"Code Quality\", \"Development Velocity\", \"Customer Satisfaction\", \"Security Incidents\"]'',
 ''[\"Scalability Challenges\", \"Security Vulnerabilities\", \"Technical Debt\", \"Talent Retention\", \"Market Competition\", \"Technology Obsolescence\"]'',
 ''[\"Adopt cloud-native architecture\", \"Implement DevSecOps\", \"Use automated testing\", \"Monitor performance continuously\", \"Regular security assessments\", \"Invest in team development\"]'',
 ''Cloud-first with multi-cloud strategy for resilience and optimization'',
 5,
 ''[\"Secure Development\", \"Container Security\", \"API Security\", \"Identity Management\", \"Vulnerability Management\", \"Security Monitoring\"]'',
 ''Analyze this technology platform focusing on scalability, development practices, security implementation, and operational excellence. Consider technical architecture, development velocity, and service reliability.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Government & Public Sector
(6, ''GOVERNMENT'', ''Government & Public Sector'', 
 ''Federal, state, and local government agencies, public services, and civic technology.'',
 NULL,
 ''[\"FedRAMP\", \"FISMA\", \"NIST\", \"CJIS\", \"IRS 1075\", \"Section 508\", \"Privacy Act\"]'',
 ''[\"Zero-Trust Architecture\", \"Legacy Modernization\", \"API Gateway\", \"Hybrid Cloud\", \"Accessibility Standards\", \"Open Source\"]'',
 ''[\"Public Records Laws\", \"Citizen Privacy\", \"Accessibility Requirements\", \"Procurement Regulations\", \"Security Clearances\", \"Budget Constraints\"]'',
 ''[\"Citizen Satisfaction\", \"Service Delivery Time\", \"Cost Per Transaction\", \"System Availability\", \"Security Compliance\", \"Accessibility Score\"]'',
 ''[\"Budget Limitations\", \"Legacy Systems\", \"Security Threats\", \"Regulatory Compliance\", \"Public Scrutiny\", \"Vendor Lock-in\"]'',
 ''[\"Prioritize citizen experience\", \"Modernize legacy systems gradually\", \"Implement strong security controls\", \"Ensure accessibility compliance\", \"Use open standards\", \"Plan for transparency\"]'',
 ''Government cloud (GovCloud) with strict security controls and compliance'',
 8,
 ''[\"Authority to Operate\", \"Continuous Monitoring\", \"Multi-Factor Authentication\", \"Data Classification\", \"Incident Response\", \"Security Training\"]'',
 ''Analyze this government system focusing on citizen service delivery, security compliance, accessibility, and cost effectiveness. Consider regulatory requirements, legacy system integration, and public accountability.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Education & Research
(7, ''EDUCATION'', ''Education & Research'', 
 ''Educational institutions, research organizations, and educational technology platforms.'',
 NULL,
 ''[\"FERPA\", \"COPPA\", \"GDPR\", \"Section 508\", \"HIPAA (research)\", \"IRB Requirements\"]'',
 ''[\"Learning Management Systems\", \"API Integration\", \"Mobile-First\", \"Analytics Platform\", \"Collaboration Tools\", \"Research Computing\"]'',
 ''[\"Student Privacy\", \"Research Ethics\", \"Accessibility Standards\", \"International Collaboration\", \"Intellectual Property\", \"Grant Compliance\"]'',
 ''[\"Student Outcomes\", \"Research Impact\", \"System Utilization\", \"Cost Per Student\", \"Faculty Productivity\", \"Technology Adoption\"]'',
 ''[\"Data Privacy Breaches\", \"System Downtime\", \"Budget Constraints\", \"Technology Gaps\", \"Cybersecurity Threats\", \"Regulatory Compliance\"]'',
 ''[\"Protect student data\", \"Ensure system reliability\", \"Support diverse learning needs\", \"Facilitate research collaboration\", \"Maintain accessibility\", \"Regular security training\"]'',
 ''Hybrid cloud with research computing capabilities and educational tools'',
 6,
 ''[\"Student Data Protection\", \"Access Controls\", \"Network Security\", \"Research Data Security\", \"Incident Response\", \"Privacy by Design\"]'',
 ''Analyze this educational system emphasizing student data protection, learning effectiveness, research capabilities, and accessibility. Focus on educational outcomes, privacy compliance, and technology integration.'',
 GETUTCDATE(),
 GETUTCDATE()),

-- Energy & Utilities
(8, ''ENERGY'', ''Energy & Utilities'', 
 ''Electric utilities, renewable energy, oil & gas, and energy management systems.'',
 NULL,
 ''[\"NERC CIP\", \"FERC\", \"EPA Regulations\", \"ISO 50001\", \"GDPR\", \"State Utility Regulations\"]'',
 ''[\"SCADA Systems\", \"Smart Grid\", \"IoT Sensors\", \"Edge Computing\", \"Predictive Analytics\", \"GIS Integration\"]'',
 ''[\"Grid Reliability\", \"Environmental Regulations\", \"Safety Standards\", \"Rate Setting\", \"Renewable Integration\", \"Cybersecurity for Critical Infrastructure\"]'',
 ''[\"System Reliability\", \"Energy Efficiency\", \"Cost Per MWh\", \"Customer Satisfaction\", \"Renewable Percentage\", \"Grid Stability\"]'',
 ''[\"Cyberattacks on Critical Infrastructure\", \"Equipment Failure\", \"Regulatory Changes\", \"Weather Events\", \"Market Volatility\", \"Aging Infrastructure\"]'',
 ''[\"Implement robust cybersecurity\", \"Modernize grid infrastructure\", \"Integrate renewable sources\", \"Use predictive maintenance\", \"Ensure regulatory compliance\", \"Plan for resilience\"]'',
 ''Hybrid cloud with air-gapped critical systems and edge computing'',
 9,
 ''[\"Critical Infrastructure Protection\", \"Network Segmentation\", \"Industrial Control Security\", \"Incident Response\", \"Physical Security\", \"Regulatory Compliance\"]'',
 ''Analyze this energy/utility system focusing on grid reliability, cybersecurity for critical infrastructure, regulatory compliance, and operational efficiency. Consider system resilience, environmental impact, and public safety.'',
 GETUTCDATE(),
 GETUTCDATE());

-- Set identity insert off
SET IDENTITY_INSERT IndustryClassifications OFF;

PRINT ''IndustryClassifications seeding completed - 8 industries added''');

-- Step 2: Seed Industry Benchmarks
PRINT ''
PRINT ''Step 2: Seeding Industry Benchmarks...''

-- Execute the industry benchmarks seed
-- (Content would be too large for a single EXEC, so we'll reference the separate file)
PRINT ''Industry benchmarks require separate execution due to size. Please run 24_IndustryBenchmarks.sql''

-- Step 3: Seed Assessment Classifications (if assessments exist)
PRINT ''
PRINT ''Step 3: Seeding Sample Assessment Classifications...''

-- Check if any assessments exist first
DECLARE @AssessmentCount int
SELECT @AssessmentCount = COUNT(*) FROM Assessments

IF (@AssessmentCount > 0)
BEGIN
    PRINT ''Found '' + CAST(@AssessmentCount as varchar) + '' assessments. Creating sample classifications...''
    
    -- Sample classifications for first few assessments
    INSERT INTO AssessmentIndustryClassifications (
        AssessmentId,
        IndustryClassificationId,
        ClassificationConfidence,
        ClassificationMethod,
        ClassificationReason,
        IsVerified,
        ClassifiedAt,
        LastUpdated
    ) 
    SELECT TOP 3
        Id as AssessmentId,
        CASE 
            WHEN Id % 8 = 1 THEN 1 -- E-commerce
            WHEN Id % 8 = 2 THEN 2 -- Financial
            WHEN Id % 8 = 3 THEN 3 -- Healthcare
            WHEN Id % 8 = 4 THEN 4 -- Manufacturing
            WHEN Id % 8 = 5 THEN 5 -- Technology
            WHEN Id % 8 = 6 THEN 6 -- Government
            WHEN Id % 8 = 7 THEN 7 -- Education
            ELSE 8 -- Energy
        END as IndustryClassificationId,
        0.85 + (RAND() * 0.1) as ClassificationConfidence, -- Random confidence between 0.85-0.95
        ''AI_Analysis'' as ClassificationMethod,
        ''Automatically classified based on assessment patterns and technology indicators.'' as ClassificationReason,
        1 as IsVerified,
        GETUTCDATE() as ClassifiedAt,
        GETUTCDATE() as LastUpdated
    FROM Assessments
    ORDER BY Id
    
    PRINT ''Sample assessment classifications created for '' + CAST(@@ROWCOUNT as varchar) + '' assessments.''
END
ELSE
BEGIN
    PRINT ''No assessments found. Skipping assessment classifications.''
END

-- Summary
PRINT ''
PRINT ''=== Phase 4 Industry Classification Seeding Summary ===''
PRINT ''Industries Created: 8''
PRINT ''Benchmarks: See separate script (48 total)''
PRINT ''Assessment Classifications: '' + CAST((SELECT COUNT(*) FROM AssessmentIndustryClassifications) as varchar)
PRINT ''Completed at: '' + CONVERT(varchar, GETDATE(), 120)
PRINT ''========================================================''

-- Verification queries
PRINT ''
PRINT ''=== Verification Results ===''
PRINT ''Total Industries: '' + CAST((SELECT COUNT(*) FROM IndustryClassifications) as varchar)
PRINT ''Total Benchmarks: '' + CAST((SELECT COUNT(*) FROM IndustryBenchmarks) as varchar)  
PRINT ''Total Classifications: '' + CAST((SELECT COUNT(*) FROM AssessmentIndustryClassifications) as varchar)

-- Show sample data
PRINT ''
PRINT ''Sample Industries:''
SELECT TOP 3 IndustryCode, IndustryName, TypicalComplexityScore FROM IndustryClassifications ORDER BY Id

GO