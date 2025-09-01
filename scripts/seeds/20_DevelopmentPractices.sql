-- Seed data for DevelopmentPractices table
PRINT 'Seeding DevelopmentPractices table...'

INSERT INTO DevelopmentPractices (
    AssessmentId, PrimaryMethodology, SprintLength, ReleaseFrequency, HasDedicatedQA,
    ManualTesting, AutomatedTesting, UnitTesting, IntegrationTesting, E2ETesting, PerformanceTesting,
    CodeCoverageTarget, TotalTeamSize, NumberOfScrumTeams, SoftwareDevelopers, SeniorLeadDevelopers,
    QAEngineers, DatabaseEngineers, DevOpsEngineers, BusinessAnalysts, ProductManagers, ProjectManagers,
    ScrumMasters, UIUXDesigners, Architects, CodeReviews, PairProgramming, TestDrivenDevelopment,
    BehaviorDrivenDevelopment, ContinuousIntegration, ContinuousDeployment, FeatureFlags, ABTesting,
    CodeDocumentationStandards, APIDocumentation, TechnicalDebtManagement, PerformanceMonitoring,
    MicrosoftTeams, Slack, Discord, Email, OtherCommunicationTools, AzureDevOps, Jira, GitHubProjects,
    Trello, Asana, MondayCom, OtherProjectManagementTools, DailyStandups, SprintPlanning,
    SprintReviews, Retrospectives, BacklogGrooming, ArchitectureReviews, PrimaryProgrammingLanguages,
    VisualStudio, VSCode, IntelliJIDEA, Eclipse, OtherIDEs, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy
) VALUES 
-- Development Practices for Assessment 1 (E-commerce)
(1, 'Agile/Scrum', '2 weeks', 'Bi-weekly', 1, 1, 1, 1, 1, 0, 1, '70-80%', 12, 2, 6, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 'C#, JavaScript, TypeScript, SQL, PowerShell', 1, 1, 0, 0, 0, GETDATE(), GETDATE(), 'System', 'System'),

-- Development Practices for Assessment 2 (Banking)
(2, 'Waterfall', '4 weeks', 'Quarterly', 1, 1, 0, 0, 0, 0, 0, 'No formal target', 25, 1, 8, 4, 4, 3, 2, 3, 2, 3, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 'COBOL, PL/I, Java, SQL, JCL', 0, 0, 1, 1, 1, GETDATE(), GETDATE(), 'System', 'System'),

-- Development Practices for Assessment 3 (Healthcare)
(3, 'Kanban', 'Continuous', 'Monthly', 1, 1, 1, 1, 1, 1, 1, '80-90%', 18, 3, 8, 3, 3, 2, 2, 2, 2, 2, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 'C#, Java, JavaScript, Python, SQL', 1, 1, 1, 0, 0, GETDATE(), GETDATE(), 'System', 'System');

PRINT 'DevelopmentPractices seeded successfully!'
SELECT COUNT(*) as [DevelopmentPractices Count] FROM DevelopmentPractices;