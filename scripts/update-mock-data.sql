-- Update Mock Data for Assessments
-- Run this script to refresh assessment-specific data

-- Clear existing business drivers (optional)
-- DELETE FROM BusinessDrivers;

-- Update Assessment 1 - E-Commerce Platform Migration
UPDATE Assessments SET 
    Type='E-Commerce Platform Migration',
    Scope='Migration of legacy e-commerce platform', 
    BusinessObjective='Modernize customer-facing platform for better performance and scalability',
    Timeline='12 months',
    Budget=850000,
    OverallScore=82, 
    SecurityScore=85, 
    CloudReadinessScore=75, 
    PotentialSavings=320000
WHERE Id=1;

-- Update Assessment 2 - Financial Services Security Review  
UPDATE Assessments SET
    Type='Financial Services Security Review',
    Scope='Comprehensive security assessment for banking applications',
    BusinessObjective='Ensure compliance with financial regulations and protect customer data', 
    Timeline='8 months',
    Budget=650000,
    OverallScore=68,
    SecurityScore=70,
    CloudReadinessScore=45,
    PotentialSavings=180000
WHERE Id=2;

-- Update Assessment 3 - Cloud Migration Readiness
UPDATE Assessments SET
    Type='Cloud Migration Readiness Assessment',
    Scope='Multi-cloud migration strategy and readiness evaluation',
    BusinessObjective='Enable cloud-first architecture for scalability and innovation',
    Timeline='10 months', 
    Budget=2100000,
    OverallScore=82,
    SecurityScore=75,
    CloudReadinessScore=85,
    PotentialSavings=2100000
WHERE Id=3;

-- Verify updates
SELECT Id, Name, Type, Timeline, Budget, OverallScore, SecurityScore, CloudReadinessScore, PotentialSavings 
FROM Assessments;

-- Check business drivers distribution
SELECT AssessmentId, COUNT(*) as DriverCount, STRING_AGG(Name, '; ') as DriverNames 
FROM BusinessDrivers 
GROUP BY AssessmentId;