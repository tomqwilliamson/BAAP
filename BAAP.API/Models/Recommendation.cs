using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class Recommendation
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // Security, Performance, Architecture, etc.
    
    [Required]
    [StringLength(50)]
    public string Priority { get; set; } = string.Empty; // Critical, High, Medium, Low
    
    [Required]
    [StringLength(50)]
    public string Effort { get; set; } = string.Empty; // Small, Medium, Large, XLarge
    
    public decimal? EstimatedCost { get; set; }
    public decimal? PotentialSavings { get; set; }
    
    public int? TimeframeWeeks { get; set; }
    
    public string? Implementation { get; set; }
    public string? Benefits { get; set; }
    public string? Risks { get; set; }
    
    public bool IsAccepted { get; set; } = false;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}