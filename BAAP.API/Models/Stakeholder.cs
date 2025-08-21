using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class Stakeholder
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Role { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string Department { get; set; } = string.Empty;
    
    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }
    
    [StringLength(100)]
    public string InfluenceLevel { get; set; } = string.Empty; // High, Medium, Low
    
    [StringLength(100)]
    public string InterestLevel { get; set; } = string.Empty; // High, Medium, Low
    
    public string? Notes { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}