using System;

namespace BAAP.API.Models;

public class AssessmentUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? BusinessContext { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? PotentialSavings { get; set; }
    public int? OverallScore { get; set; }
    public int? SecurityScore { get; set; }
    public int? CloudReadinessScore { get; set; }
    public string? Timeline { get; set; }
    public decimal? Budget { get; set; }
}
