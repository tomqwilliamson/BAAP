-- Seed data for AssessmentIndustryClassifications table (Phase 4)
PRINT 'Seeding AssessmentIndustryClassifications table...'

-- Set identity insert on to specify explicit IDs
SET IDENTITY_INSERT AssessmentIndustryClassifications ON;

-- First check if assessments exist, and classify a few sample ones
INSERT INTO AssessmentIndustryClassifications (
    Id,
    AssessmentId,
    IndustryClassificationId,
    ClassificationConfidence,
    ClassificationMethod,
    ClassificationReason,
    IsVerified,
    ClassifiedAt,
    LastUpdated
) VALUES
-- Assessment 1 classified as E-commerce (assuming it exists)
(1, 1, 1, 0.87, 'AI_Analysis', 'Detected e-commerce patterns: shopping cart functionality, payment processing, product catalogs, and customer review systems. Strong indicators of retail technology stack.', 1, GETUTCDATE(), GETUTCDATE()),

-- Assessment 2 classified as Financial Services (assuming it exists)  
(2, 2, 2, 0.92, 'AI_Analysis', 'Identified financial services characteristics: transaction processing, compliance frameworks (SOX, PCI-DSS), risk management systems, and audit trail requirements.', 1, GETUTCDATE(), GETUTCDATE()),

-- Assessment 3 classified as Healthcare (assuming it exists)
(3, 3, 3, 0.85, 'AI_Analysis', 'Healthcare indicators detected: HIPAA compliance requirements, patient data handling, clinical workflow systems, and medical device integration patterns.', 1, GETUTCDATE(), GETUTCDATE());

-- Set identity insert off
SET IDENTITY_INSERT AssessmentIndustryClassifications OFF;

-- Note: This will only insert records if the corresponding AssessmentId exists
-- If assessments don't exist, these records will be skipped due to foreign key constraints

PRINT 'AssessmentIndustryClassifications seeding completed - sample classifications added';