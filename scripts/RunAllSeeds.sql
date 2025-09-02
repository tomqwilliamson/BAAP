-- Simple script to execute all 22 seed files in order
-- Run this from the scripts folder

PRINT 'Starting BAAP Database Seeding...'
PRINT '=================================='

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
:r "seeds\22_AIAnalysisResults.sql"

PRINT '=================================='
PRINT 'All seed scripts completed!'

-- Summary
SELECT 'Final Summary' as Info;
SELECT 
    'Assessments' as TableName, COUNT(*) as RecordCount FROM Assessments
UNION ALL SELECT 
    'Applications', COUNT(*) FROM Applications
UNION ALL SELECT 
    'BusinessDrivers', COUNT(*) FROM BusinessDrivers
UNION ALL SELECT 
    'Stakeholders', COUNT(*) FROM Stakeholders
UNION ALL SELECT 
    'AIAnalysisResults', COUNT(*) FROM AIAnalysisResults
ORDER BY TableName;

PRINT 'Database seeding complete!'