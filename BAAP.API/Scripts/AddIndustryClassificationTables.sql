-- Phase 4: Industry Classification Tables for Custom AI Models
-- This script adds industry classification tables for specialized recommendations

USE baap_dev;
GO

-- Create IndustryClassifications table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IndustryClassifications')
BEGIN
    CREATE TABLE IndustryClassifications (
        Id int IDENTITY(1,1) PRIMARY KEY,
        IndustryCode nvarchar(50) NOT NULL UNIQUE,
        IndustryName nvarchar(255) NOT NULL,
        Description nvarchar(max) NOT NULL DEFAULT '',
        ParentIndustryId int NULL,
        ComplianceFrameworks nvarchar(max) NOT NULL DEFAULT '[]',
        TechnologyPatterns nvarchar(max) NOT NULL DEFAULT '[]',
        RegulatoryConsiderations nvarchar(max) NOT NULL DEFAULT '[]',
        KeyPerformanceIndicators nvarchar(max) NOT NULL DEFAULT '[]',
        RiskFactors nvarchar(max) NOT NULL DEFAULT '[]',
        BestPractices nvarchar(max) NOT NULL DEFAULT '[]',
        CloudAdoptionPattern nvarchar(max) NOT NULL DEFAULT '',
        TypicalComplexityScore int NOT NULL DEFAULT 5,
        SecurityRequirements nvarchar(max) NOT NULL DEFAULT '[]',
        CustomPromptTemplate nvarchar(max) NOT NULL DEFAULT '',
        CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
        LastUpdated datetime2 NOT NULL DEFAULT GETUTCDATE(),
        
        -- Self-referencing foreign key
        CONSTRAINT FK_IndustryClassifications_Parent FOREIGN KEY (ParentIndustryId) 
            REFERENCES IndustryClassifications(Id)
    );
    
    -- Create indexes for better query performance
    CREATE INDEX IX_IndustryClassifications_IndustryCode ON IndustryClassifications (IndustryCode);
    CREATE INDEX IX_IndustryClassifications_ParentIndustry ON IndustryClassifications (ParentIndustryId);
    
    PRINT 'IndustryClassifications table created successfully';
END
ELSE
BEGIN
    PRINT 'IndustryClassifications table already exists';
END

-- Create AssessmentIndustryClassifications table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AssessmentIndustryClassifications')
BEGIN
    CREATE TABLE AssessmentIndustryClassifications (
        Id int IDENTITY(1,1) PRIMARY KEY,
        AssessmentId int NOT NULL,
        IndustryClassificationId int NOT NULL,
        ClassificationConfidence float NOT NULL DEFAULT 0.0,
        ClassificationMethod nvarchar(50) NOT NULL DEFAULT '',
        ClassificationReason nvarchar(max) NOT NULL DEFAULT '',
        IsVerified bit NOT NULL DEFAULT 0,
        ClassifiedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
        LastUpdated datetime2 NOT NULL DEFAULT GETUTCDATE(),
        
        -- Foreign keys
        CONSTRAINT FK_AssessmentIndustryClassifications_Assessment FOREIGN KEY (AssessmentId) 
            REFERENCES Assessments(Id) ON DELETE CASCADE,
        CONSTRAINT FK_AssessmentIndustryClassifications_Industry FOREIGN KEY (IndustryClassificationId) 
            REFERENCES IndustryClassifications(Id) ON DELETE CASCADE,
            
        -- Unique constraint - one classification per assessment
        CONSTRAINT UQ_AssessmentIndustryClassifications_Assessment UNIQUE (AssessmentId)
    );
    
    -- Create indexes
    CREATE INDEX IX_AssessmentIndustryClassifications_Assessment ON AssessmentIndustryClassifications (AssessmentId);
    CREATE INDEX IX_AssessmentIndustryClassifications_Industry ON AssessmentIndustryClassifications (IndustryClassificationId);
    
    PRINT 'AssessmentIndustryClassifications table created successfully';
END
ELSE
BEGIN
    PRINT 'AssessmentIndustryClassifications table already exists';
END

-- Create IndustryBenchmarks table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IndustryBenchmarks')
BEGIN
    CREATE TABLE IndustryBenchmarks (
        Id int IDENTITY(1,1) PRIMARY KEY,
        IndustryClassificationId int NOT NULL,
        MetricName nvarchar(255) NOT NULL,
        MetricCategory nvarchar(100) NOT NULL,
        BenchmarkValue float NOT NULL DEFAULT 0.0,
        Unit nvarchar(50) NOT NULL DEFAULT '',
        PercentileData nvarchar(max) NOT NULL DEFAULT '{}',
        DataSource nvarchar(255) NOT NULL DEFAULT '',
        SampleSize int NOT NULL DEFAULT 0,
        LastUpdated datetime2 NOT NULL DEFAULT GETUTCDATE(),
        ValidUntil datetime2 NOT NULL DEFAULT DATEADD(year, 1, GETUTCDATE()),
        
        -- Foreign key
        CONSTRAINT FK_IndustryBenchmarks_Industry FOREIGN KEY (IndustryClassificationId) 
            REFERENCES IndustryClassifications(Id) ON DELETE CASCADE
    );
    
    -- Create indexes for efficient querying
    CREATE INDEX IX_IndustryBenchmarks_Industry ON IndustryBenchmarks (IndustryClassificationId);
    CREATE INDEX IX_IndustryBenchmarks_Category ON IndustryBenchmarks (IndustryClassificationId, MetricCategory);
    CREATE INDEX IX_IndustryBenchmarks_ValidUntil ON IndustryBenchmarks (ValidUntil);
    
    PRINT 'IndustryBenchmarks table created successfully';
END
ELSE
BEGIN
    PRINT 'IndustryBenchmarks table already exists';
END

GO

PRINT 'Phase 4 Industry Classification tables setup completed successfully';