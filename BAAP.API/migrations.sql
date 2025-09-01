BEGIN TRANSACTION;
CREATE TABLE [BudgetAllocations] (
    [Id] int NOT NULL IDENTITY,
    [AssessmentCost] decimal(18,2) NOT NULL,
    [Implementation] decimal(18,2) NOT NULL,
    [Maintenance] decimal(18,2) NOT NULL,
    [Training] decimal(18,2) NOT NULL,
    [Contingency] decimal(18,2) NOT NULL,
    [Notes] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastModifiedDate] datetime2 NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_BudgetAllocations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BudgetAllocations_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [BusinessContextRisks] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Category] nvarchar(50) NOT NULL,
    [Probability] nvarchar(50) NOT NULL,
    [Impact] nvarchar(50) NOT NULL,
    [RiskScore] int NOT NULL,
    [Mitigation] nvarchar(max) NULL,
    [Owner] nvarchar(max) NULL,
    [Status] nvarchar(50) NOT NULL,
    [DueDate] datetime2 NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastModifiedDate] datetime2 NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_BusinessContextRisks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BusinessContextRisks_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ProjectTimelineItems] (
    [Id] int NOT NULL IDENTITY,
    [Phase] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [Progress] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Dependencies] nvarchar(max) NULL,
    [Owner] nvarchar(max) NULL,
    [Notes] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastModifiedDate] datetime2 NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_ProjectTimelineItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProjectTimelineItems_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_BudgetAllocations_AssessmentId] ON [BudgetAllocations] ([AssessmentId]);

CREATE INDEX [IX_BusinessContextRisks_AssessmentId] ON [BusinessContextRisks] ([AssessmentId]);

CREATE INDEX [IX_ProjectTimelineItems_AssessmentId] ON [ProjectTimelineItems] ([AssessmentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250831193824_AddBusinessContextTables', N'9.0.8');

ALTER TABLE [Assessments] ADD [ApplicationCount] int NOT NULL DEFAULT 0;

ALTER TABLE [Assessments] ADD [CodeQualityScore] int NOT NULL DEFAULT 0;

ALTER TABLE [Assessments] ADD [DatabaseOptimizationScore] int NOT NULL DEFAULT 0;

ALTER TABLE [Assessments] ADD [DevOpsMaturityScore] int NOT NULL DEFAULT 0;

ALTER TABLE [Assessments] ADD [DocumentationScore] int NOT NULL DEFAULT 0;

ALTER TABLE [Assessments] ADD [InfrastructureScore] int NOT NULL DEFAULT 0;

ALTER TABLE [Applications] ADD [CriticalFindings] int NOT NULL DEFAULT 0;

ALTER TABLE [Applications] ADD [CriticalIssues] int NOT NULL DEFAULT 0;

ALTER TABLE [Applications] ADD [HighFindings] int NOT NULL DEFAULT 0;

ALTER TABLE [Applications] ADD [SecurityIssues] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250831200914_AddDashboardMetricFields', N'9.0.8');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250831225521_AddBudgetAndTimelineToAssessment', N'9.0.8');

CREATE TABLE [ArchitectureReviews] (
    [Id] int NOT NULL IDENTITY,
    [AssessmentId] int NOT NULL,
    [MaintainabilityScore] int NOT NULL,
    [ComplexityScore] int NOT NULL,
    [CouplingScore] int NOT NULL,
    [CohesionScore] int NOT NULL,
    [TestCoverageScore] int NOT NULL,
    [TechnicalDebtScore] int NOT NULL,
    [CodeSmells] int NOT NULL,
    [DuplicatedLines] float NOT NULL,
    [Vulnerabilities] int NOT NULL,
    [Bugs] int NOT NULL,
    [SecurityHotspots] int NOT NULL,
    [RepositoryUrl] nvarchar(max) NULL,
    [RepositoryType] nvarchar(max) NULL,
    [RepositoryStatus] nvarchar(max) NULL,
    [LastCommitHash] nvarchar(max) NULL,
    [LastCommitDate] datetime2 NULL,
    [ArchitectureAnalysis] nvarchar(max) NULL,
    [HealthAnalysis] nvarchar(max) NULL,
    [PatternsAnalysis] nvarchar(max) NULL,
    [TechnologyAnalysis] nvarchar(max) NULL,
    [MaintainabilityAnalysis] nvarchar(max) NULL,
    [RecommendationsAnalysis] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastUpdatedDate] datetime2 NULL,
    [LastUpdatedBy] nvarchar(max) NULL,
    CONSTRAINT [PK_ArchitectureReviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ArchitectureReviews_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ArchitecturePatterns] (
    [Id] int NOT NULL IDENTITY,
    [ArchitectureReviewId] int NOT NULL,
    [PatternName] nvarchar(100) NOT NULL,
    [Usage] int NOT NULL,
    [Quality] nvarchar(50) NOT NULL,
    [Recommendation] nvarchar(max) NULL,
    [Maturity] nvarchar(50) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_ArchitecturePatterns] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ArchitecturePatterns_ArchitectureReviews_ArchitectureReviewId] FOREIGN KEY ([ArchitectureReviewId]) REFERENCES [ArchitectureReviews] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CodebaseStats] (
    [Id] int NOT NULL IDENTITY,
    [ArchitectureReviewId] int NOT NULL,
    [Language] nvarchar(50) NOT NULL,
    [LinesOfCode] int NOT NULL,
    [Percentage] float NOT NULL,
    [FileCount] int NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_CodebaseStats] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CodebaseStats_ArchitectureReviews_ArchitectureReviewId] FOREIGN KEY ([ArchitectureReviewId]) REFERENCES [ArchitectureReviews] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TechnologyStacks] (
    [Id] int NOT NULL IDENTITY,
    [ArchitectureReviewId] int NOT NULL,
    [Category] nvarchar(100) NOT NULL,
    [Technology] nvarchar(100) NOT NULL,
    [Version] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Risk] nvarchar(50) NOT NULL,
    [Recommendation] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_TechnologyStacks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TechnologyStacks_ArchitectureReviews_ArchitectureReviewId] FOREIGN KEY ([ArchitectureReviewId]) REFERENCES [ArchitectureReviews] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_ArchitecturePatterns_ArchitectureReviewId] ON [ArchitecturePatterns] ([ArchitectureReviewId]);

CREATE INDEX [IX_ArchitectureReviews_AssessmentId] ON [ArchitectureReviews] ([AssessmentId]);

CREATE INDEX [IX_CodebaseStats_ArchitectureReviewId] ON [CodebaseStats] ([ArchitectureReviewId]);

CREATE INDEX [IX_TechnologyStacks_ArchitectureReviewId] ON [TechnologyStacks] ([ArchitectureReviewId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250901003208_AddArchitectureReviewModels', N'9.0.8');

ALTER TABLE [Assessments] ADD [BusinessContext] nvarchar(max) NULL;

ALTER TABLE [Assessments] ADD [LastModifiedDate] datetime2 NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250901005423_AddBusinessContextAndLastModifiedToAssessment', N'9.0.8');

CREATE TABLE [DevelopmentPractices] (
    [Id] int NOT NULL IDENTITY,
    [AssessmentId] int NOT NULL,
    [PrimaryMethodology] nvarchar(50) NULL,
    [SprintLength] nvarchar(20) NULL,
    [ReleaseFrequency] nvarchar(20) NULL,
    [HasDedicatedQA] bit NOT NULL,
    [ManualTesting] bit NOT NULL,
    [AutomatedTesting] bit NOT NULL,
    [UnitTesting] bit NOT NULL,
    [IntegrationTesting] bit NOT NULL,
    [E2ETesting] bit NOT NULL,
    [PerformanceTesting] bit NOT NULL,
    [CodeCoverageTarget] nvarchar(20) NULL,
    [TotalTeamSize] int NOT NULL,
    [NumberOfScrumTeams] int NOT NULL,
    [SoftwareDevelopers] int NOT NULL,
    [SeniorLeadDevelopers] int NOT NULL,
    [QAEngineers] int NOT NULL,
    [DatabaseEngineers] int NOT NULL,
    [DevOpsEngineers] int NOT NULL,
    [BusinessAnalysts] int NOT NULL,
    [ProductManagers] int NOT NULL,
    [ProjectManagers] int NOT NULL,
    [ScrumMasters] int NOT NULL,
    [UIUXDesigners] int NOT NULL,
    [Architects] int NOT NULL,
    [CodeReviews] bit NOT NULL,
    [PairProgramming] bit NOT NULL,
    [TestDrivenDevelopment] bit NOT NULL,
    [BehaviorDrivenDevelopment] bit NOT NULL,
    [ContinuousIntegration] bit NOT NULL,
    [ContinuousDeployment] bit NOT NULL,
    [FeatureFlags] bit NOT NULL,
    [ABTesting] bit NOT NULL,
    [CodeDocumentationStandards] bit NOT NULL,
    [APIDocumentation] bit NOT NULL,
    [TechnicalDebtManagement] bit NOT NULL,
    [PerformanceMonitoring] bit NOT NULL,
    [MicrosoftTeams] bit NOT NULL,
    [Slack] bit NOT NULL,
    [Discord] bit NOT NULL,
    [Email] bit NOT NULL,
    [OtherCommunicationTools] bit NOT NULL,
    [AzureDevOps] bit NOT NULL,
    [Jira] bit NOT NULL,
    [GitHubProjects] bit NOT NULL,
    [Trello] bit NOT NULL,
    [Asana] bit NOT NULL,
    [MondayCom] bit NOT NULL,
    [OtherProjectManagementTools] bit NOT NULL,
    [DailyStandups] bit NOT NULL,
    [SprintPlanning] bit NOT NULL,
    [SprintReviews] bit NOT NULL,
    [Retrospectives] bit NOT NULL,
    [BacklogGrooming] bit NOT NULL,
    [ArchitectureReviews] bit NOT NULL,
    [PrimaryProgrammingLanguages] nvarchar(500) NULL,
    [VisualStudio] bit NOT NULL,
    [VSCode] bit NOT NULL,
    [IntelliJIDEA] bit NOT NULL,
    [Eclipse] bit NOT NULL,
    [OtherIDEs] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    [CreatedBy] nvarchar(100) NULL,
    [UpdatedBy] nvarchar(100) NULL,
    CONSTRAINT [PK_DevelopmentPractices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DevelopmentPractices_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_DevelopmentPractices_AssessmentId] ON [DevelopmentPractices] ([AssessmentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250901043843_DevelopmentPractices', N'9.0.8');

COMMIT;
GO

