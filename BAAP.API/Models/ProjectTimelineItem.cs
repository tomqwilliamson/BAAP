using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class ProjectTimelineItem
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Phase { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    [Range(0, 100)]
    public int Progress { get; set; } = 0;
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Not Started"; // Not Started, In Progress, Completed, On Hold
    
    public string? Dependencies { get; set; }
    public string? Owner { get; set; }
    public string? Notes { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
    
    // Calculated properties
    [NotMapped]
    public int DurationDays => (EndDate - StartDate).Days;
}