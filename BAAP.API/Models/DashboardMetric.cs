using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

public class DashboardMetric
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string MetricName { get; set; } = string.Empty;
    
    public double Value { get; set; }
    
    [StringLength(50)]
    public string? Unit { get; set; }
    
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // Applications, Security, Cost, etc.
    
    public DateTime RecordedDate { get; set; } = DateTime.UtcNow;
    
    // Optional foreign key for assessment-specific metrics
    public int? AssessmentId { get; set; }
    public virtual Assessment? Assessment { get; set; }
}