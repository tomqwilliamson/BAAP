using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class DatabaseInstance
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty; // SQL Server, PostgreSQL, MongoDB, etc.
    
    [StringLength(50)]
    public string Version { get; set; } = string.Empty;
    
    [StringLength(20)]
    public string Size { get; set; } = string.Empty; // "485 GB"
    
    public int ReadinessPercent { get; set; } = 0;
    
    public int IssueCount { get; set; } = 0;
    
    [StringLength(100)]
    public string? AzureTargetService { get; set; }
    
    public int SchemaCount { get; set; } = 0;
    
    public int TableCount { get; set; } = 0;
    
    public string? Details { get; set; }
    
    [StringLength(50)]
    public string? CompatibilityStatus { get; set; } // Ready, Warning, Needs Work
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}