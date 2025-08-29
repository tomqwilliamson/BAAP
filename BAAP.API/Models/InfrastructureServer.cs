using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class InfrastructureServer
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty; // IIS, SQL Server, Linux, etc.
    
    public int ServerCount { get; set; } = 1;
    
    public int UtilizationPercent { get; set; } = 0;
    
    [StringLength(50)]
    public string CloudReadiness { get; set; } = "Medium"; // High, Medium, Low
    
    [StringLength(100)]
    public string? CurrentHosting { get; set; }
    
    [StringLength(100)]
    public string? RecommendedAzureTarget { get; set; }
    
    [StringLength(50)]
    public string? MigrationEffort { get; set; } // Low, Medium, High
    
    [StringLength(50)]
    public string? EstimatedMonthlyCost { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
}