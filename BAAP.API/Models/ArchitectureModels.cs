using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class ArchitectureReview
{
    public int Id { get; set; }
    
    [Required]
    public int AssessmentId { get; set; }
    
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
    
    // Architecture Health Metrics
    public int MaintainabilityScore { get; set; } = 0;
    public int ComplexityScore { get; set; } = 0;
    public int CouplingScore { get; set; } = 0;
    public int CohesionScore { get; set; } = 0;
    public int TestCoverageScore { get; set; } = 0;
    public int TechnicalDebtScore { get; set; } = 0;
    
    // Code Quality Metrics
    public int CodeSmells { get; set; } = 0;
    public double DuplicatedLines { get; set; } = 0;
    public int Vulnerabilities { get; set; } = 0;
    public int Bugs { get; set; } = 0;
    public int SecurityHotspots { get; set; } = 0;
    
    // Repository Information
    public string? RepositoryUrl { get; set; }
    public string? RepositoryType { get; set; } // github, azure-devops, gitlab
    public string? RepositoryStatus { get; set; } // connected, disconnected
    public string? LastCommitHash { get; set; }
    public DateTime? LastCommitDate { get; set; }
    
    // Analysis Results
    public string? ArchitectureAnalysis { get; set; }
    public string? HealthAnalysis { get; set; }
    public string? PatternsAnalysis { get; set; }
    public string? TechnologyAnalysis { get; set; }
    public string? MaintainabilityAnalysis { get; set; }
    public string? RecommendationsAnalysis { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastUpdatedDate { get; set; }
    public string? LastUpdatedBy { get; set; }
    
    // Navigation properties
    public virtual ICollection<ArchitecturePattern> ArchitecturePatterns { get; set; } = new List<ArchitecturePattern>();
    public virtual ICollection<TechnologyStack> TechnologyStacks { get; set; } = new List<TechnologyStack>();
}

public class ArchitecturePattern
{
    public int Id { get; set; }
    
    [Required]
    public int ArchitectureReviewId { get; set; }
    
    [ForeignKey("ArchitectureReviewId")]
    public virtual ArchitectureReview ArchitectureReview { get; set; } = null!;
    
    [Required]
    [StringLength(100)]
    public string PatternName { get; set; } = string.Empty;
    
    public int Usage { get; set; } = 0; // Percentage 0-100
    
    [StringLength(50)]
    public string Quality { get; set; } = string.Empty; // Good, Fair, Poor
    
    public string? Recommendation { get; set; }
    
    [StringLength(50)]
    public string Maturity { get; set; } = string.Empty; // Basic, Intermediate, Advanced, Legacy
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

public class TechnologyStack
{
    public int Id { get; set; }
    
    [Required]
    public int ArchitectureReviewId { get; set; }
    
    [ForeignKey("ArchitectureReviewId")]
    public virtual ArchitectureReview ArchitectureReview { get; set; } = null!;
    
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // Frontend Framework, Backend Runtime, etc.
    
    [Required]
    [StringLength(100)]
    public string Technology { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string Version { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string Status { get; set; } = string.Empty; // Current, Outdated, Legacy
    
    [StringLength(50)]
    public string Risk { get; set; } = string.Empty; // Low, Medium, High, Critical
    
    public string? Recommendation { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

public class CodebaseStats
{
    public int Id { get; set; }
    
    [Required]
    public int ArchitectureReviewId { get; set; }
    
    [ForeignKey("ArchitectureReviewId")]
    public virtual ArchitectureReview ArchitectureReview { get; set; } = null!;
    
    [Required]
    [StringLength(50)]
    public string Language { get; set; } = string.Empty;
    
    public int LinesOfCode { get; set; } = 0;
    public double Percentage { get; set; } = 0;
    public int FileCount { get; set; } = 0;
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

// DTOs for API responses
public class ArchitectureReviewDto
{
    public int Id { get; set; }
    public int AssessmentId { get; set; }
    
    // Health Metrics
    public HealthMetricsDto HealthMetrics { get; set; } = new();
    
    // Code Quality
    public CodeQualityDto CodeQuality { get; set; } = new();
    
    // Repository Info
    public RepositoryInfoDto RepositoryInfo { get; set; } = new();
    
    // Analysis Results
    public AnalysisDto Analysis { get; set; } = new();
    
    // Related Data
    public List<ArchitecturePatternDto> ArchitecturePatterns { get; set; } = new();
    public List<TechnologyStackDto> TechnologyStack { get; set; } = new();
    public List<CodebaseStatsDto> CodebaseStats { get; set; } = new();
    
    public DateTime CreatedDate { get; set; }
    public DateTime? LastUpdatedDate { get; set; }
}

public class HealthMetricsDto
{
    public int Maintainability { get; set; }
    public int Complexity { get; set; }
    public int Coupling { get; set; }
    public int Cohesion { get; set; }
    public int TestCoverage { get; set; }
    public int TechnicalDebt { get; set; }
}

public class CodeQualityDto
{
    public int CodeSmells { get; set; }
    public double DuplicatedLines { get; set; }
    public int Vulnerabilities { get; set; }
    public int Bugs { get; set; }
    public int SecurityHotspots { get; set; }
}

public class RepositoryInfoDto
{
    public string? Url { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
    public string? LastCommitHash { get; set; }
    public DateTime? LastCommitDate { get; set; }
}

public class AnalysisDto
{
    public string? ArchitectureAnalysis { get; set; }
    public string? HealthAnalysis { get; set; }
    public string? PatternsAnalysis { get; set; }
    public string? TechnologyAnalysis { get; set; }
    public string? MaintainabilityAnalysis { get; set; }
    public string? RecommendationsAnalysis { get; set; }
}

public class ArchitecturePatternDto
{
    public int Id { get; set; }
    public string PatternName { get; set; } = string.Empty;
    public int Usage { get; set; }
    public string Quality { get; set; } = string.Empty;
    public string? Recommendation { get; set; }
    public string Maturity { get; set; } = string.Empty;
}

public class TechnologyStackDto
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Technology { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Risk { get; set; } = string.Empty;
    public string? Recommendation { get; set; }
}

public class CodebaseStatsDto
{
    public int Id { get; set; }
    public string Language { get; set; } = string.Empty;
    public int LinesOfCode { get; set; }
    public double Percentage { get; set; }
    public int FileCount { get; set; }
}