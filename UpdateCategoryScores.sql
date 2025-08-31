-- Update category scores for existing assessments

-- Update Assessment 1 (Q4 2024 Portfolio Assessment)
UPDATE Assessments 
SET 
    CodeQualityScore = 85,
    InfrastructureScore = 92,
    DevOpsMaturityScore = 74,
    DatabaseOptimizationScore = 81,
    DocumentationScore = 69,
    ApplicationCount = 6
WHERE Id = 1;

-- Update Assessment 2 (Security Compliance Review)
UPDATE Assessments 
SET 
    CodeQualityScore = 62,
    InfrastructureScore = 58,
    DevOpsMaturityScore = 45,
    DatabaseOptimizationScore = 72,
    DocumentationScore = 55,
    ApplicationCount = 4
WHERE Id = 2;

-- Update Assessment 3 (Cloud Migration Readiness)
UPDATE Assessments 
SET 
    CodeQualityScore = 88,
    InfrastructureScore = 94,
    DevOpsMaturityScore = 91,
    DatabaseOptimizationScore = 89,
    DocumentationScore = 82,
    ApplicationCount = 2
WHERE Id = 3;

-- Update some application records with critical/security issues for dashboard metrics
UPDATE Applications 
SET 
    CriticalIssues = 2,
    SecurityIssues = 3,
    CriticalFindings = 2,
    HighFindings = 1
WHERE Id = 1; -- Customer Portal Web App

UPDATE Applications 
SET 
    CriticalIssues = 1,
    SecurityIssues = 2,
    CriticalFindings = 1,
    HighFindings = 1
WHERE Id = 2; -- Internal ERP System

UPDATE Applications 
SET 
    CriticalIssues = 3,
    SecurityIssues = 5,
    CriticalFindings = 3,
    HighFindings = 2
WHERE Id = 11; -- Banking Core System (high risk legacy system)

UPDATE Applications 
SET 
    CriticalIssues = 0,
    SecurityIssues = 1,
    CriticalFindings = 0,
    HighFindings = 1
WHERE Id = 4; -- Legacy Payment Gateway

PRINT 'Category scores and application metrics updated successfully!';