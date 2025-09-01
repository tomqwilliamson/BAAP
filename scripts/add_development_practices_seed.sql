-- Add seed data for DevelopmentPractices table
PRINT 'Adding seed data for DevelopmentPractices table...'

-- Insert comprehensive development practices data for Assessment ID 1
INSERT INTO DevelopmentPractices (
    AssessmentId,
    PrimaryMethodology,
    SprintLength,
    ReleaseFrequency,
    HasDedicatedQA,
    ManualTesting,
    AutomatedTesting,
    UnitTesting,
    IntegrationTesting,
    E2ETesting,
    PerformanceTesting,
    CodeCoverageTarget,
    TotalTeamSize,
    NumberOfScrumTeams,
    SoftwareDevelopers,
    SeniorLeadDevelopers,
    QAEngineers,
    DatabaseEngineers,
    DevOpsEngineers,
    BusinessAnalysts,
    ProductManagers,
    ProjectManagers,
    ScrumMasters,
    UIUXDesigners,
    Architects,
    CodeReviews,
    PairProgramming,
    TestDrivenDevelopment,
    BehaviorDrivenDevelopment,
    ContinuousIntegration,
    ContinuousDeployment,
    FeatureFlags,
    ABTesting,
    CodeDocumentationStandards,
    APIDocumentation,
    TechnicalDebtManagement,
    PerformanceMonitoring,
    MicrosoftTeams,
    Slack,
    Discord,
    Email,
    OtherCommunicationTools,
    AzureDevOps,
    Jira,
    GitHubProjects,
    Trello,
    Asana,
    MondayCom,
    OtherProjectManagementTools,
    DailyStandups,
    SprintPlanning,
    SprintReviews,
    Retrospectives,
    BacklogGrooming,
    ArchitectureReviews,
    PrimaryProgrammingLanguages,
    VisualStudio,
    VSCode,
    IntelliJIDEA,
    Eclipse,
    OtherIDEs,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
    UpdatedBy
) VALUES (
    1, -- AssessmentId
    'Agile/Scrum', -- PrimaryMethodology
    '2 weeks', -- SprintLength
    'Bi-weekly', -- ReleaseFrequency
    1, -- HasDedicatedQA
    1, -- ManualTesting
    1, -- AutomatedTesting
    1, -- UnitTesting
    1, -- IntegrationTesting
    0, -- E2ETesting
    1, -- PerformanceTesting
    '70-80%', -- CodeCoverageTarget
    12, -- TotalTeamSize
    2, -- NumberOfScrumTeams
    6, -- SoftwareDevelopers
    2, -- SeniorLeadDevelopers
    2, -- QAEngineers
    1, -- DatabaseEngineers
    1, -- DevOpsEngineers
    1, -- BusinessAnalysts
    1, -- ProductManagers
    1, -- ProjectManagers
    2, -- ScrumMasters
    1, -- UIUXDesigners
    1, -- Architects
    1, -- CodeReviews
    1, -- PairProgramming
    0, -- TestDrivenDevelopment
    0, -- BehaviorDrivenDevelopment
    1, -- ContinuousIntegration
    0, -- ContinuousDeployment
    1, -- FeatureFlags
    0, -- ABTesting
    1, -- CodeDocumentationStandards
    1, -- APIDocumentation
    1, -- TechnicalDebtManagement
    1, -- PerformanceMonitoring
    1, -- MicrosoftTeams
    0, -- Slack
    0, -- Discord
    1, -- Email
    0, -- OtherCommunicationTools
    1, -- AzureDevOps
    0, -- Jira
    1, -- GitHubProjects
    0, -- Trello
    0, -- Asana
    0, -- MondayCom
    0, -- OtherProjectManagementTools
    1, -- DailyStandups
    1, -- SprintPlanning
    1, -- SprintReviews
    1, -- Retrospectives
    1, -- BacklogGrooming
    1, -- ArchitectureReviews
    'C#, JavaScript, TypeScript, SQL, PowerShell', -- PrimaryProgrammingLanguages
    1, -- VisualStudio
    1, -- VSCode
    0, -- IntelliJIDEA
    0, -- Eclipse
    0, -- OtherIDEs
    GETDATE(), -- CreatedAt
    GETDATE(), -- UpdatedAt
    'System', -- CreatedBy
    'System' -- UpdatedBy
);

PRINT 'DevelopmentPractices seed data inserted successfully!'

-- Verify the data was inserted
SELECT COUNT(*) as [DevelopmentPractices Count] FROM DevelopmentPractices WHERE AssessmentId = 1;