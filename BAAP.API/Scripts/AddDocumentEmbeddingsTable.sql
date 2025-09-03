-- Add DocumentEmbeddings table for Phase 3 Vector Search functionality
-- This script adds only the new table without affecting existing Application table columns

USE baap_dev;
GO

-- Create DocumentEmbeddings table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DocumentEmbeddings')
BEGIN
    CREATE TABLE DocumentEmbeddings (
        Id int IDENTITY(1,1) PRIMARY KEY,
        FileName nvarchar(255) NOT NULL,
        ContentType nvarchar(100) NOT NULL,
        ExtractedText nvarchar(max) NOT NULL,
        EmbeddingVector nvarchar(max) NOT NULL,
        AssessmentId int NOT NULL,
        ModuleType nvarchar(50) NOT NULL,
        KeyFindings nvarchar(max) NULL,
        Metadata nvarchar(max) NULL,
        CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
        LastUpdated datetime2 NOT NULL DEFAULT GETUTCDATE(),
        ChunkIndex int NOT NULL DEFAULT 0,
        TotalChunks int NOT NULL DEFAULT 1,
        
        CONSTRAINT FK_DocumentEmbeddings_Assessment FOREIGN KEY (AssessmentId) REFERENCES Assessments(Id) ON DELETE CASCADE
    );
    
    -- Create indexes for better query performance
    CREATE INDEX IX_DocumentEmbeddings_AssessmentId ON DocumentEmbeddings (AssessmentId);
    CREATE INDEX IX_DocumentEmbeddings_ModuleType ON DocumentEmbeddings (ModuleType);
    CREATE INDEX IX_DocumentEmbeddings_FileName ON DocumentEmbeddings (FileName);
    CREATE INDEX IX_DocumentEmbeddings_CreatedAt ON DocumentEmbeddings (CreatedAt);
    
    PRINT 'DocumentEmbeddings table created successfully with indexes';
END
ELSE
BEGIN
    PRINT 'DocumentEmbeddings table already exists';
END

GO