-- Migration: Enhanced Application Schema for Better Categorization and Business Context
-- Date: 2024-01-02
-- Purpose: Add new fields to support multi-app portfolio management

-- Add new columns to Applications table
ALTER TABLE Applications
ADD BusinessDomain NVARCHAR(100) NULL,
    Tags NVARCHAR(500) NULL,
    DeploymentModel NVARCHAR(50) NULL,
    BusinessCriticality NVARCHAR(20) NULL,
    ModernizationPriority INT NOT NULL DEFAULT 3,
    RepositoryUrl NVARCHAR(500) NULL,
    TechnologyStack NVARCHAR(200) NULL;

GO

-- Update existing records with sensible defaults based on business domain patterns
UPDATE Applications 
SET BusinessDomain = CASE 
    WHEN Category LIKE '%Customer%' OR Category LIKE '%External%' THEN 'Customer Experience'
    WHEN Category LIKE '%Financial%' OR Category LIKE '%Finance%' THEN 'Finance'
    WHEN Category LIKE '%Internal%' OR Category LIKE '%Employee%' THEN 'Operations'
    WHEN Category LIKE '%Analytics%' OR Category LIKE '%Reporting%' THEN 'Analytics'
    WHEN Category LIKE '%Security%' OR Category LIKE '%Compliance%' THEN 'Security & Compliance'
    WHEN Category LIKE '%Infrastructure%' OR Category LIKE '%System%' THEN 'IT Infrastructure'
    ELSE 'General Business'
END,
BusinessCriticality = CASE
    WHEN Category LIKE '%Critical%' OR Type LIKE '%Database%' OR Type LIKE '%API%' THEN 'Critical'
    WHEN Category LIKE '%Customer%' OR Category LIKE '%Financial%' THEN 'Important'
    ELSE 'Standard'
END,
DeploymentModel = CASE
    WHEN Technology LIKE '%Azure%' OR Technology LIKE '%AWS%' OR Technology LIKE '%Cloud%' THEN 'Cloud'
    WHEN Technology LIKE '%Hybrid%' THEN 'Hybrid' 
    ELSE 'OnPremise'
END,
ModernizationPriority = CASE
    WHEN CloudReadinessScore < 50 AND BusinessCriticality = 'Critical' THEN 1
    WHEN CloudReadinessScore < 70 AND BusinessCriticality = 'Important' THEN 2
    WHEN CloudReadinessScore < 80 THEN 3
    WHEN CloudReadinessScore >= 80 THEN 4
    ELSE 3
END,
Tags = CASE
    WHEN CloudReadinessScore >= 80 THEN '["cloud-ready"]'
    WHEN CloudReadinessScore < 50 THEN '["legacy"]'
    WHEN SecurityRating < 60 THEN '["security-risk"]'
    WHEN ComplexityScore > 80 THEN '["complex"]'
    ELSE '["standard"]'
END;

-- Add indexes for better query performance
CREATE INDEX IX_Applications_BusinessDomain ON Applications (BusinessDomain);
CREATE INDEX IX_Applications_BusinessCriticality ON Applications (BusinessCriticality);
CREATE INDEX IX_Applications_DeploymentModel ON Applications (DeploymentModel);
CREATE INDEX IX_Applications_ModernizationPriority ON Applications (ModernizationPriority);

GO

-- Create a view for common application queries with enhanced categorization
CREATE VIEW vw_ApplicationPortfolio AS
SELECT 
    a.Id,
    a.Name,
    a.Description,
    a.Type,
    a.Category,
    a.BusinessDomain,
    a.BusinessCriticality,
    a.DeploymentModel,
    a.ModernizationPriority,
    a.Technology,
    a.TechnologyStack,
    a.RepositoryUrl,
    a.Tags,
    a.CloudReadinessScore,
    a.SecurityRating,
    a.ComplexityScore,
    a.EstimatedMigrationCost,
    a.MonthlyCost,
    a.CriticalIssues,
    a.SecurityIssues,
    a.LastAnalyzedDate,
    ass.Name as AssessmentName,
    ass.Status as AssessmentStatus,
    -- Calculated fields
    CASE 
        WHEN a.CloudReadinessScore >= 80 THEN 'Ready'
        WHEN a.CloudReadinessScore >= 60 THEN 'Moderate'
        ELSE 'Needs Work'
    END as CloudReadinessLevel,
    CASE
        WHEN a.SecurityRating >= 80 THEN 'Low Risk'
        WHEN a.SecurityRating >= 60 THEN 'Medium Risk'
        ELSE 'High Risk'
    END as SecurityRiskLevel
FROM Applications a
LEFT JOIN Assessments ass ON a.AssessmentId = ass.Id;

GO

PRINT 'Enhanced Application Schema migration completed successfully';
PRINT 'Added fields: BusinessDomain, Tags, DeploymentModel, BusinessCriticality, ModernizationPriority, RepositoryUrl, TechnologyStack';
PRINT 'Updated existing records with intelligent defaults';
PRINT 'Created indexes and portfolio view for better performance';