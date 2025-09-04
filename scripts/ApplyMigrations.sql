IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Assessments] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [StartedDate] datetime2 NULL,
    [CompletedDate] datetime2 NULL,
    [EstimatedCost] decimal(18,2) NULL,
    [PotentialSavings] decimal(18,2) NULL,
    [OverallScore] int NOT NULL,
    [SecurityScore] int NOT NULL,
    [CloudReadinessScore] int NOT NULL,
    [Type] nvarchar(max) NULL,
    [Scope] nvarchar(max) NULL,
    [BusinessObjective] nvarchar(max) NULL,
    [Timeline] nvarchar(max) NULL,
    [Budget] decimal(18,2) NULL,
    [Notes] nvarchar(max) NULL,
    CONSTRAINT [PK_Assessments] PRIMARY KEY ([Id])
);

CREATE TABLE [Applications] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Type] nvarchar(100) NOT NULL,
    [Category] nvarchar(100) NOT NULL,
    [Technology] nvarchar(100) NOT NULL,
    [LinesOfCode] int NOT NULL,
    [ComplexityScore] int NOT NULL,
    [SecurityRating] int NOT NULL,
    [CloudReadinessScore] int NOT NULL,
    [EstimatedMigrationCost] decimal(18,2) NULL,
    [MonthlyCost] decimal(18,2) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastAnalyzedDate] datetime2 NULL,
    [AssessmentId] int NULL,
    CONSTRAINT [PK_Applications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Applications_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AssessmentFiles] (
    [Id] int NOT NULL IDENTITY,
    [OriginalFileName] nvarchar(max) NOT NULL,
    [StoredFileName] nvarchar(max) NOT NULL,
    [FilePath] nvarchar(max) NOT NULL,
    [FileSize] bigint NOT NULL,
    [ContentType] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [AssessmentId] int NULL,
    [UploadedDate] datetime2 NOT NULL,
    [UploadedBy] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_AssessmentFiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AssessmentFiles_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [BusinessDrivers] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Priority] nvarchar(50) NOT NULL,
    [Impact] int NOT NULL,
    [Urgency] int NOT NULL,
    [BusinessValue] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_BusinessDrivers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BusinessDrivers_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [DashboardMetrics] (
    [Id] int NOT NULL IDENTITY,
    [MetricName] nvarchar(100) NOT NULL,
    [Value] float NOT NULL,
    [Unit] nvarchar(50) NULL,
    [Category] nvarchar(100) NOT NULL,
    [RecordedDate] datetime2 NOT NULL,
    [AssessmentId] int NULL,
    CONSTRAINT [PK_DashboardMetrics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DashboardMetrics_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE SET NULL
);

CREATE TABLE [Recommendations] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Category] nvarchar(100) NOT NULL,
    [Priority] nvarchar(50) NOT NULL,
    [Effort] nvarchar(50) NOT NULL,
    [EstimatedCost] decimal(18,2) NULL,
    [PotentialSavings] decimal(18,2) NULL,
    [TimeframeWeeks] int NULL,
    [Implementation] nvarchar(max) NULL,
    [Benefits] nvarchar(max) NULL,
    [Risks] nvarchar(max) NULL,
    [IsAccepted] bit NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_Recommendations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Recommendations_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Stakeholders] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(255) NOT NULL,
    [Role] nvarchar(100) NOT NULL,
    [Department] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NULL,
    [InfluenceLevel] nvarchar(100) NOT NULL,
    [InterestLevel] nvarchar(100) NOT NULL,
    [Notes] nvarchar(max) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_Stakeholders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Stakeholders_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CodeMetrics] (
    [Id] int NOT NULL IDENTITY,
    [MetricName] nvarchar(100) NOT NULL,
    [Value] float NOT NULL,
    [Unit] nvarchar(50) NULL,
    [Category] nvarchar(100) NOT NULL,
    [MeasuredDate] datetime2 NOT NULL,
    [ApplicationId] int NOT NULL,
    CONSTRAINT [PK_CodeMetrics] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CodeMetrics_Applications_ApplicationId] FOREIGN KEY ([ApplicationId]) REFERENCES [Applications] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SecurityFindings] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Severity] nvarchar(50) NOT NULL,
    [Category] nvarchar(100) NOT NULL,
    [FileName] nvarchar(255) NULL,
    [LineNumber] int NULL,
    [Source] nvarchar(100) NOT NULL,
    [IsResolved] bit NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ResolvedDate] datetime2 NULL,
    [ApplicationId] int NOT NULL,
    CONSTRAINT [PK_SecurityFindings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SecurityFindings_Applications_ApplicationId] FOREIGN KEY ([ApplicationId]) REFERENCES [Applications] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Applications_AssessmentId] ON [Applications] ([AssessmentId]);

CREATE INDEX [IX_AssessmentFiles_AssessmentId] ON [AssessmentFiles] ([AssessmentId]);

CREATE INDEX [IX_BusinessDrivers_AssessmentId] ON [BusinessDrivers] ([AssessmentId]);

CREATE INDEX [IX_CodeMetrics_ApplicationId] ON [CodeMetrics] ([ApplicationId]);

CREATE INDEX [IX_DashboardMetrics_AssessmentId] ON [DashboardMetrics] ([AssessmentId]);

CREATE INDEX [IX_Recommendations_AssessmentId] ON [Recommendations] ([AssessmentId]);

CREATE INDEX [IX_SecurityFindings_ApplicationId] ON [SecurityFindings] ([ApplicationId]);

CREATE INDEX [IX_Stakeholders_AssessmentId] ON [Stakeholders] ([AssessmentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250825182410_InitialCreate', N'9.0.8');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250828215908_UpdateSchema', N'9.0.8');

ALTER TABLE [Recommendations] ADD [EstimatedROI] nvarchar(20) NULL;

ALTER TABLE [Recommendations] ADD [Impact] nvarchar(50) NULL;

ALTER TABLE [Recommendations] ADD [Investment] nvarchar(50) NULL;

ALTER TABLE [Recommendations] ADD [RecommendationType] nvarchar(100) NULL;

ALTER TABLE [Recommendations] ADD [Timeline] nvarchar(50) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250829174908_AddRecommendationEnhancements', N'9.0.8');

CREATE TABLE [ComplianceFrameworks] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [CoveragePercent] int NOT NULL,
    [Notes] nvarchar(max) NULL,
    [AssessmentType] nvarchar(50) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastAssessedDate] datetime2 NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_ComplianceFrameworks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ComplianceFrameworks_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [DatabaseInstances] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Version] nvarchar(50) NOT NULL,
    [Size] nvarchar(20) NOT NULL,
    [ReadinessPercent] int NOT NULL,
    [IssueCount] int NOT NULL,
    [AzureTargetService] nvarchar(100) NULL,
    [SchemaCount] int NOT NULL,
    [TableCount] int NOT NULL,
    [Details] nvarchar(max) NULL,
    [CompatibilityStatus] nvarchar(50) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_DatabaseInstances] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DatabaseInstances_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [InfrastructureServers] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [ServerCount] int NOT NULL,
    [UtilizationPercent] int NOT NULL,
    [CloudReadiness] nvarchar(50) NOT NULL,
    [CurrentHosting] nvarchar(100) NULL,
    [RecommendedAzureTarget] nvarchar(100) NULL,
    [MigrationEffort] nvarchar(50) NULL,
    [EstimatedMonthlyCost] nvarchar(50) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_InfrastructureServers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InfrastructureServers_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SecurityVulnerabilities] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Severity] nvarchar(50) NOT NULL,
    [Category] nvarchar(100) NOT NULL,
    [Source] nvarchar(100) NOT NULL,
    [InstanceCount] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [CweId] nvarchar(100) NULL,
    [Scanner] nvarchar(100) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ResolvedDate] datetime2 NULL,
    [AssessmentId] int NOT NULL,
    CONSTRAINT [PK_SecurityVulnerabilities] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SecurityVulnerabilities_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_ComplianceFrameworks_AssessmentId] ON [ComplianceFrameworks] ([AssessmentId]);

CREATE INDEX [IX_DatabaseInstances_AssessmentId] ON [DatabaseInstances] ([AssessmentId]);

CREATE INDEX [IX_InfrastructureServers_AssessmentId] ON [InfrastructureServers] ([AssessmentId]);

CREATE INDEX [IX_SecurityVulnerabilities_AssessmentId] ON [SecurityVulnerabilities] ([AssessmentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250829183943_AddDetailedAssessmentEntities', N'9.0.8');

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

ALTER TABLE [Assessments] ADD [ArchitectureReviewLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [BusinessContextLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [CloudMigrationLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [DataArchitectureLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [DevOpsLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [InfrastructureLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [RecommendationsLastAiAnalysis] datetime2 NULL;

ALTER TABLE [Assessments] ADD [SecurityLastAiAnalysis] datetime2 NULL;

CREATE TABLE [AIAnalysisResults] (
    [Id] int NOT NULL IDENTITY,
    [AssessmentId] int NOT NULL,
    [ModuleName] nvarchar(50) NOT NULL,
    [ResultsJson] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastModifiedDate] datetime2 NOT NULL,
    [AnalysisMode] nvarchar(20) NOT NULL,
    [Version] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_AIAnalysisResults] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AIAnalysisResults_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [IX_AIAnalysisResults_AssessmentId_ModuleName] ON [AIAnalysisResults] ([AssessmentId], [ModuleName]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250902170144_AddAIAnalysisResult', N'9.0.8');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250902173316_AddAITimestampFields', N'9.0.8');

ALTER TABLE [Applications] ADD [BusinessCriticality] nvarchar(20) NULL;

ALTER TABLE [Applications] ADD [BusinessDomain] nvarchar(100) NULL;

ALTER TABLE [Applications] ADD [DeploymentModel] nvarchar(50) NULL;

ALTER TABLE [Applications] ADD [ModernizationPriority] int NOT NULL DEFAULT 0;

ALTER TABLE [Applications] ADD [RepositoryUrl] nvarchar(500) NULL;

ALTER TABLE [Applications] ADD [Tags] nvarchar(500) NULL;

ALTER TABLE [Applications] ADD [TechnologyStack] nvarchar(200) NULL;

CREATE TABLE [DocumentEmbeddings] (
    [Id] int NOT NULL IDENTITY,
    [FileName] nvarchar(max) NOT NULL,
    [ContentType] nvarchar(max) NOT NULL,
    [ExtractedText] nvarchar(max) NOT NULL,
    [EmbeddingVector] nvarchar(max) NOT NULL,
    [AssessmentId] int NOT NULL,
    [ModuleType] nvarchar(max) NOT NULL,
    [KeyFindings] nvarchar(max) NOT NULL,
    [Metadata] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [LastUpdated] datetime2 NOT NULL,
    [ChunkIndex] int NOT NULL,
    [TotalChunks] int NOT NULL,
    CONSTRAINT [PK_DocumentEmbeddings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DocumentEmbeddings_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [IndustryClassifications] (
    [Id] int NOT NULL IDENTITY,
    [IndustryCode] nvarchar(450) NOT NULL,
    [IndustryName] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ParentIndustryId] int NULL,
    [ComplianceFrameworks] nvarchar(max) NOT NULL,
    [TechnologyPatterns] nvarchar(max) NOT NULL,
    [RegulatoryConsiderations] nvarchar(max) NOT NULL,
    [KeyPerformanceIndicators] nvarchar(max) NOT NULL,
    [RiskFactors] nvarchar(max) NOT NULL,
    [BestPractices] nvarchar(max) NOT NULL,
    [CloudAdoptionPattern] nvarchar(max) NOT NULL,
    [TypicalComplexityScore] int NOT NULL,
    [SecurityRequirements] nvarchar(max) NOT NULL,
    [CustomPromptTemplate] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [LastUpdated] datetime2 NOT NULL,
    CONSTRAINT [PK_IndustryClassifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_IndustryClassifications_IndustryClassifications_ParentIndustryId] FOREIGN KEY ([ParentIndustryId]) REFERENCES [IndustryClassifications] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [AssessmentIndustryClassifications] (
    [Id] int NOT NULL IDENTITY,
    [AssessmentId] int NOT NULL,
    [IndustryClassificationId] int NOT NULL,
    [ClassificationConfidence] float NOT NULL,
    [ClassificationMethod] nvarchar(max) NOT NULL,
    [ClassificationReason] nvarchar(max) NOT NULL,
    [IsVerified] bit NOT NULL,
    [ClassifiedAt] datetime2 NOT NULL,
    [LastUpdated] datetime2 NOT NULL,
    CONSTRAINT [PK_AssessmentIndustryClassifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AssessmentIndustryClassifications_Assessments_AssessmentId] FOREIGN KEY ([AssessmentId]) REFERENCES [Assessments] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AssessmentIndustryClassifications_IndustryClassifications_IndustryClassificationId] FOREIGN KEY ([IndustryClassificationId]) REFERENCES [IndustryClassifications] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [IndustryBenchmarks] (
    [Id] int NOT NULL IDENTITY,
    [IndustryClassificationId] int NOT NULL,
    [MetricName] nvarchar(max) NOT NULL,
    [MetricCategory] nvarchar(450) NOT NULL,
    [BenchmarkValue] float NOT NULL,
    [Unit] nvarchar(max) NOT NULL,
    [PercentileData] nvarchar(max) NOT NULL,
    [DataSource] nvarchar(max) NOT NULL,
    [SampleSize] int NOT NULL,
    [LastUpdated] datetime2 NOT NULL,
    [ValidUntil] datetime2 NOT NULL,
    CONSTRAINT [PK_IndustryBenchmarks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_IndustryBenchmarks_IndustryClassifications_IndustryClassificationId] FOREIGN KEY ([IndustryClassificationId]) REFERENCES [IndustryClassifications] ([Id]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [IX_AssessmentIndustryClassifications_AssessmentId] ON [AssessmentIndustryClassifications] ([AssessmentId]);

CREATE INDEX [IX_AssessmentIndustryClassifications_IndustryClassificationId] ON [AssessmentIndustryClassifications] ([IndustryClassificationId]);

CREATE INDEX [IX_DocumentEmbeddings_AssessmentId] ON [DocumentEmbeddings] ([AssessmentId]);

CREATE INDEX [IX_IndustryBenchmarks_IndustryClassificationId_MetricCategory] ON [IndustryBenchmarks] ([IndustryClassificationId], [MetricCategory]);

CREATE UNIQUE INDEX [IX_IndustryClassifications_IndustryCode] ON [IndustryClassifications] ([IndustryCode]);

CREATE INDEX [IX_IndustryClassifications_ParentIndustryId] ON [IndustryClassifications] ([ParentIndustryId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250903185853_AddNewApplicationAndIndustryModels', N'9.0.8');

COMMIT;
GO

