-- BAAP Azure SQL Database Seed Script
-- This script clears existing data and reseeds the Azure SQL database

USE baap_dev;
GO

PRINT 'Starting BAAP Azure SQL Database Seeding Process...'
PRINT '======================================================'

-- Clear existing data in dependency order (foreign keys first)
PRINT 'Clearing existing data...'
DELETE FROM AIAnalysisResults;
DELETE FROM DevelopmentPractices;
DELETE FROM CodebaseStats;
DELETE FROM TechnologyStacks;
DELETE FROM ArchitecturePatterns;
DELETE FROM ArchitectureReviews;
DELETE FROM BusinessContextRisks;
DELETE FROM ProjectTimelineItems;
DELETE FROM BudgetAllocations;
DELETE FROM ComplianceFrameworks;
DELETE FROM SecurityVulnerabilities;
DELETE FROM DatabaseInstances;
DELETE FROM InfrastructureServers;
DELETE FROM DashboardMetrics;
DELETE FROM CodeMetrics;
DELETE FROM SecurityFindings;
DELETE FROM Recommendations;
DELETE FROM Stakeholders;
DELETE FROM BusinessDrivers;
DELETE FROM Applications;
DELETE FROM Assessments;
PRINT 'Existing data cleared!'

-- Seed core assessment data first
:r "seeds\01_Assessments.sql"
:r "seeds\02_Applications.sql" 
:r "seeds\03_BusinessDrivers.sql"
:r "seeds\04_Stakeholders.sql"
:r "seeds\05_SecurityFindings.sql"
:r "seeds\06_Recommendations.sql"
:r "seeds\07_CodeMetrics.sql"
:r "seeds\08_DashboardMetrics.sql"
:r "seeds\09_InfrastructureServers.sql"
:r "seeds\10_DatabaseInstances.sql"
:r "seeds\11_SecurityVulnerabilities.sql"
:r "seeds\12_ComplianceFrameworks.sql"
:r "seeds\13_BudgetAllocations.sql"
:r "seeds\14_ProjectTimelineItems.sql"
:r "seeds\15_BusinessContextRisks.sql"
:r "seeds\16_ArchitectureReviews.sql"
:r "seeds\17_ArchitecturePatterns.sql"
:r "seeds\18_TechnologyStacks.sql"
:r "seeds\19_CodebaseStats.sql"
:r "seeds\20_DevelopmentPractices.sql"
:r "seeds\21_AssessmentFiles.sql"

-- Seed AI Analysis Results last (depends on Assessments)
:r "seeds\22_AIAnalysisResults.sql"

PRINT '======================================================'
PRINT 'BAAP Azure SQL Database Seeding Complete!'
PRINT 'Summary of seeded data:'

SELECT 'Assessments' as TableName, COUNT(*) as RecordCount FROM Assessments
UNION ALL
SELECT 'Applications', COUNT(*) FROM Applications  
UNION ALL
SELECT 'BusinessDrivers', COUNT(*) FROM BusinessDrivers
UNION ALL
SELECT 'Stakeholders', COUNT(*) FROM Stakeholders
UNION ALL
SELECT 'Recommendations', COUNT(*) FROM Recommendations
UNION ALL
SELECT 'AIAnalysisResults', COUNT(*) FROM AIAnalysisResults
ORDER BY TableName;

PRINT 'Azure SQL database seeding completed successfully!'