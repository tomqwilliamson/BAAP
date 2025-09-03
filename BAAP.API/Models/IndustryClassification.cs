using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

/// <summary>
/// Industry classification for specialized AI analysis
/// </summary>
public class IndustryClassification
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string IndustryCode { get; set; } = string.Empty;
    
    [Required]
    public string IndustryName { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Parent industry for hierarchical classification
    /// </summary>
    public int? ParentIndustryId { get; set; }
    public IndustryClassification? ParentIndustry { get; set; }
    
    /// <summary>
    /// Industry-specific compliance frameworks
    /// </summary>
    public List<string> ComplianceFrameworks { get; set; } = new();
    
    /// <summary>
    /// Common technology patterns for this industry
    /// </summary>
    public List<string> TechnologyPatterns { get; set; } = new();
    
    /// <summary>
    /// Regulatory considerations specific to this industry
    /// </summary>
    public List<string> RegulatoryConsiderations { get; set; } = new();
    
    /// <summary>
    /// Key performance indicators relevant to this industry
    /// </summary>
    public List<string> KeyPerformanceIndicators { get; set; } = new();
    
    /// <summary>
    /// Industry-specific risk factors
    /// </summary>
    public List<string> RiskFactors { get; set; } = new();
    
    /// <summary>
    /// Best practices recommendations for this industry
    /// </summary>
    public List<string> BestPractices { get; set; } = new();
    
    /// <summary>
    /// Typical cloud adoption patterns for this industry
    /// </summary>
    public string CloudAdoptionPattern { get; set; } = string.Empty;
    
    /// <summary>
    /// Average migration complexity score (1-10)
    /// </summary>
    public int TypicalComplexityScore { get; set; } = 5;
    
    /// <summary>
    /// Common security requirements for this industry
    /// </summary>
    public List<string> SecurityRequirements { get; set; } = new();
    
    /// <summary>
    /// Industry-specific AI analysis prompts
    /// </summary>
    public string CustomPromptTemplate { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Child industries for hierarchical classification
    /// </summary>
    public List<IndustryClassification> SubIndustries { get; set; } = new();
}

/// <summary>
/// Links assessments to their detected industry classification
/// </summary>
public class AssessmentIndustryClassification
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int AssessmentId { get; set; }
    public Assessment Assessment { get; set; } = null!;
    
    [Required]
    public int IndustryClassificationId { get; set; }
    public IndustryClassification IndustryClassification { get; set; } = null!;
    
    /// <summary>
    /// Confidence score of the industry classification (0.0 - 1.0)
    /// </summary>
    public double ClassificationConfidence { get; set; }
    
    /// <summary>
    /// How the industry was determined (Manual, AI_Analysis, Pattern_Matching)
    /// </summary>
    public string ClassificationMethod { get; set; } = string.Empty;
    
    /// <summary>
    /// Additional context about the classification decision
    /// </summary>
    public string ClassificationReason { get; set; } = string.Empty;
    
    /// <summary>
    /// Whether this classification was manually verified
    /// </summary>
    public bool IsVerified { get; set; } = false;
    
    public DateTime ClassifiedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Industry-specific benchmarks and KPIs
/// </summary>
public class IndustryBenchmark
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int IndustryClassificationId { get; set; }
    public IndustryClassification IndustryClassification { get; set; } = null!;
    
    [Required]
    public string MetricName { get; set; } = string.Empty;
    
    [Required]
    public string MetricCategory { get; set; } = string.Empty; // Performance, Security, Cost, Compliance
    
    public double BenchmarkValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    
    /// <summary>
    /// Percentile rankings (P25, P50, P75, P90)
    /// </summary>
    public Dictionary<string, double> PercentileData { get; set; } = new();
    
    /// <summary>
    /// Data source for the benchmark
    /// </summary>
    public string DataSource { get; set; } = string.Empty;
    
    /// <summary>
    /// Sample size for the benchmark
    /// </summary>
    public int SampleSize { get; set; }
    
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public DateTime ValidUntil { get; set; }
}