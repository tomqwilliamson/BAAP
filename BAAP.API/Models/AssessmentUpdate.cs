using System;

namespace BAAP.API.Models;

public class AssessmentUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? BusinessContext { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? PotentialSavings { get; set; }
    public int? OverallScore { get; set; }
    public int? SecurityScore { get; set; }
    public int? CloudReadinessScore { get; set; }
    public int? CodeQualityScore { get; set; }
    public int? InfrastructureScore { get; set; }
    public int? DevOpsMaturityScore { get; set; }
    public int? DatabaseOptimizationScore { get; set; }
    public int? DocumentationScore { get; set; }
    public int? ApplicationCount { get; set; }
    public string? Timeline { get; set; }
    public decimal? Budget { get; set; }
    
    // AI Analysis timestamps for each module
    public DateTime? BusinessContextLastAiAnalysis { get; set; }
    public DateTime? ArchitectureReviewLastAiAnalysis { get; set; }
    public DateTime? InfrastructureLastAiAnalysis { get; set; }
    public DateTime? DataArchitectureLastAiAnalysis { get; set; }
    public DateTime? DevOpsLastAiAnalysis { get; set; }
    public DateTime? SecurityLastAiAnalysis { get; set; }
    public DateTime? CloudMigrationLastAiAnalysis { get; set; }
    public DateTime? RecommendationsLastAiAnalysis { get; set; }
}
