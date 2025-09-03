using BAAP.API.Models;

namespace BAAP.API.Services;

/// <summary>
/// Service interface for industry classification and specialized AI analysis
/// </summary>
public interface IIndustryClassificationService
{
    /// <summary>
    /// Automatically classify an assessment's industry based on its content
    /// </summary>
    Task<AssessmentIndustryClassification> ClassifyAssessmentAsync(int assessmentId);
    
    /// <summary>
    /// Get industry-specific AI analysis with specialized prompts and context
    /// </summary>
    Task<string> GetIndustrySpecificAnalysisAsync(
        int assessmentId, 
        string moduleType, 
        string baseAnalysisRequest);
    
    /// <summary>
    /// Get industry benchmarks for comparison
    /// </summary>
    Task<List<IndustryBenchmark>> GetIndustryBenchmarksAsync(int industryClassificationId);
    
    /// <summary>
    /// Get industry-specific recommendations
    /// </summary>
    Task<List<IndustrySpecificRecommendation>> GetIndustryRecommendationsAsync(
        int assessmentId, 
        string moduleType);
    
    /// <summary>
    /// Get compliance requirements for the assessment's industry
    /// </summary>
    Task<List<ComplianceRequirement>> GetComplianceRequirementsAsync(int assessmentId);
    
    /// <summary>
    /// Update assessment's industry classification manually
    /// </summary>
    Task<AssessmentIndustryClassification> UpdateIndustryClassificationAsync(
        int assessmentId, 
        int industryClassificationId, 
        bool isVerified = true);
    
    /// <summary>
    /// Get all available industry classifications
    /// </summary>
    Task<List<IndustryClassification>> GetAllIndustryClassificationsAsync();
    
    /// <summary>
    /// Search for industry classifications by name or characteristics
    /// </summary>
    Task<List<IndustryClassification>> SearchIndustryClassificationsAsync(string searchTerm);
    
    /// <summary>
    /// Get industry-specific knowledge base entries
    /// </summary>
    Task<List<IndustryKnowledgeBase>> GetIndustryKnowledgeBaseAsync(int industryClassificationId);
    
    /// <summary>
    /// Generate industry intelligence report
    /// </summary>
    Task<IndustryIntelligenceReport> GenerateIndustryReportAsync(int assessmentId);
}

/// <summary>
/// Industry-specific recommendation with specialized context
/// </summary>
public class IndustrySpecificRecommendation
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string IndustryContext { get; set; } = string.Empty;
    public List<string> RegulatoryImplications { get; set; } = new();
    public List<string> IndustryBestPractices { get; set; } = new();
    public double EstimatedImpact { get; set; }
    public int IndustryClassificationId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Industry-specific compliance requirement
/// </summary>
public class ComplianceRequirement
{
    public int Id { get; set; }
    public string Framework { get; set; } = string.Empty;
    public string Requirement { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public List<string> TechnicalControls { get; set; } = new();
    public List<string> AuditCriteria { get; set; } = new();
    public int IndustryClassificationId { get; set; }
}

/// <summary>
/// Industry knowledge base entry
/// </summary>
public class IndustryKnowledgeBase
{
    public int Id { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Keywords { get; set; } = new();
    public List<string> RelatedTopics { get; set; } = new();
    public string SourceUrl { get; set; } = string.Empty;
    public double RelevanceScore { get; set; }
    public int IndustryClassificationId { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Comprehensive industry intelligence report
/// </summary>
public class IndustryIntelligenceReport
{
    public int AssessmentId { get; set; }
    public IndustryClassification Industry { get; set; } = null!;
    public List<IndustryBenchmark> BenchmarkComparison { get; set; } = new();
    public List<ComplianceRequirement> ComplianceGaps { get; set; } = new();
    public List<IndustrySpecificRecommendation> PrioritizedRecommendations { get; set; } = new();
    public Dictionary<string, object> IndustryMetrics { get; set; } = new();
    public List<string> IndustryTrends { get; set; } = new();
    public List<string> PeerBestPractices { get; set; } = new();
    public double IndustryReadinessScore { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}