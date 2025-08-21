using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

public class SecurityFinding
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Severity { get; set; } = string.Empty; // Critical, High, Medium, Low
    
    [StringLength(100)]
    public string Category { get; set; } = string.Empty; // SQL Injection, XSS, etc.
    
    [StringLength(255)]
    public string? FileName { get; set; }
    
    public int? LineNumber { get; set; }
    
    [StringLength(100)]
    public string Source { get; set; } = string.Empty; // SAST, DAST, Manual Review, etc.
    
    public bool IsResolved { get; set; } = false;
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedDate { get; set; }
    
    // Foreign key
    public int ApplicationId { get; set; }
    [ForeignKey("ApplicationId")]
    public virtual Application Application { get; set; } = null!;
}