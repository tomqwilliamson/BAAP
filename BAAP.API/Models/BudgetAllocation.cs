using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class BudgetAllocation
{
    public int Id { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal AssessmentCost { get; set; } = 0;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Implementation { get; set; } = 0;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Maintenance { get; set; } = 0;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Training { get; set; } = 0;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Contingency { get; set; } = 0;
    
    public string? Notes { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }
    
    // Foreign key
    public int AssessmentId { get; set; }
    [ForeignKey("AssessmentId")]
    public virtual Assessment Assessment { get; set; } = null!;
    
    // Calculated properties
    [NotMapped]
    public decimal TotalBudget => AssessmentCost + Implementation + Maintenance + Training + Contingency;
}