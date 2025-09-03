using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class Application
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty; // React SPA, ASP.NET MVC, etc.
    
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // Customer-Facing, Internal, etc.
    
    [StringLength(100)]
    public string Technology { get; set; } = string.Empty;
    
    // Enhanced categorization and business context
    [StringLength(100)]
    public string? BusinessDomain { get; set; } // Finance, Sales, Marketing, Operations, etc.
    
    [StringLength(500)] 
    public string? Tags { get; set; } // JSON array: ["critical", "legacy", "cloud-ready"]
    
    [StringLength(50)]
    public string? DeploymentModel { get; set; } // OnPremise, Cloud, Hybrid
    
    [StringLength(20)]
    public string? BusinessCriticality { get; set; } // Critical, Important, Standard
    
    public int ModernizationPriority { get; set; } = 3; // 1-5 scale (1=highest priority)
    
    [StringLength(500)]
    public string? RepositoryUrl { get; set; } // Git repository URL
    
    [StringLength(200)]
    public string? TechnologyStack { get; set; } // Full tech stack description
    
    public int LinesOfCode { get; set; } = 0;
    public int ComplexityScore { get; set; } = 0;
    public int SecurityRating { get; set; } = 0;
    public int CloudReadinessScore { get; set; } = 0;
    
    // Dashboard metrics
    public int CriticalIssues { get; set; } = 0;
    public int SecurityIssues { get; set; } = 0;
    public int CriticalFindings { get; set; } = 0;
    public int HighFindings { get; set; } = 0;
    
    public decimal? EstimatedMigrationCost { get; set; }
    public decimal? MonthlyCost { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastAnalyzedDate { get; set; }
    
    // Foreign key
    public int? AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
    
    // Navigation properties
    public virtual ICollection<SecurityFinding> SecurityFindings { get; set; } = new List<SecurityFinding>();
    public virtual ICollection<CodeMetric> CodeMetrics { get; set; } = new List<CodeMetric>();
}