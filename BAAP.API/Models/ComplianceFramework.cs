using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class ComplianceFramework
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty; // GDPR, HIPAA, SOX, PCI DSS, etc.
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty; // Compliant, Partial, In Progress, Non-Compliant
    
    public int CoveragePercent { get; set; } = 0;
    
    public string? Notes { get; set; }
    
    [StringLength(50)]
    public string? AssessmentType { get; set; } // Data, Security, Infrastructure, etc.
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastAssessedDate { get; set; }
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}