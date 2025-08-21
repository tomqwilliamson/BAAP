using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class BusinessDriver
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Priority { get; set; } = string.Empty; // Critical, High, Medium, Low
    
    [Range(0, 100)]
    public int Impact { get; set; } = 0;
    
    [Range(0, 100)]
    public int Urgency { get; set; } = 0;
    
    public string? BusinessValue { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}