using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class CodeMetric
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string MetricName { get; set; } = string.Empty;
    
    public double Value { get; set; }
    
    [StringLength(50)]
    public string? Unit { get; set; }
    
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // Complexity, Maintainability, etc.
    
    public DateTime MeasuredDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int ApplicationId { get; set; }
    [ForeignKey("ApplicationId")]
    public virtual Application Application { get; set; } = null!;
}