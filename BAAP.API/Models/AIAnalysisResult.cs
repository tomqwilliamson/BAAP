using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

public class AIAnalysisResult
{
    public int Id { get; set; }
    
    [Required]
    public int AssessmentId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string ModuleName { get; set; } = string.Empty; // businesscontext, architecturereview, etc.
    
    [Required]
    public string ResultsJson { get; set; } = string.Empty; // JSON serialized analysis results
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
    
    [StringLength(20)]
    public string AnalysisMode { get; set; } = "Simulation"; // "AI", "Simulation"
    
    [StringLength(100)]
    public string Version { get; set; } = "1.0"; // For schema versioning
    
    // Navigation properties
    public virtual Assessment Assessment { get; set; } = null!;
}

// Request/Response models for API
public class SaveAIAnalysisResultRequest
{
    public int AssessmentId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public object AnalysisResults { get; set; } = new object();
    public string AnalysisMode { get; set; } = "Simulation";
}

public class AIAnalysisResultResponse
{
    public int Id { get; set; }
    public int AssessmentId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public object AnalysisResults { get; set; } = new object();
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    public string AnalysisMode { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
}