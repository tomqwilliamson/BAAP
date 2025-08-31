using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class BusinessContextRisk
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Category { get; set; } = string.Empty; // Technical, Business, Security, Compliance, etc.
    
    [Required]
    [StringLength(50)]
    public string Probability { get; set; } = string.Empty; // Low, Medium, High
    
    [Required]
    [StringLength(50)]
    public string Impact { get; set; } = string.Empty; // Low, Medium, High
    
    [Range(1, 25)]
    public int RiskScore { get; set; } = 1; // Calculated: Probability x Impact (1-25)
    
    public string? Mitigation { get; set; }
    public string? Owner { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "Open"; // Open, Mitigated, Closed
    
    public DateTime? DueDate { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}