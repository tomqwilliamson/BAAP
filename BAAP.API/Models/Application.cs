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
    
    public int LinesOfCode { get; set; } = 0;
    public int ComplexityScore { get; set; } = 0;
    public int SecurityRating { get; set; } = 0;
    public int CloudReadinessScore { get; set; } = 0;
    
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