using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

public class Assessment
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    public string Status { get; set; } = "Draft"; // Draft, In Progress, Completed
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? StartedDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    
    public decimal? EstimatedCost { get; set; }
    public decimal? PotentialSavings { get; set; }
    
    public int OverallScore { get; set; } = 0;
    public int SecurityScore { get; set; } = 0;
    public int CloudReadinessScore { get; set; } = 0;
    
    public string? Type { get; set; }
    public string? Scope { get; set; }
    public string? BusinessObjective { get; set; }
    public string? Timeline { get; set; }
    public decimal? Budget { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<BusinessDriver> BusinessDrivers { get; set; } = new List<BusinessDriver>();
    public virtual ICollection<Stakeholder> Stakeholders { get; set; } = new List<Stakeholder>();
    public virtual ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();
}