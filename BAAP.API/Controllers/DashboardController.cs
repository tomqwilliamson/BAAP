using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(BaapDbContext context, ILogger<DashboardController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/dashboard/overview
    [HttpGet("overview")]
    public async Task<ActionResult> GetDashboardOverview()
    {
        try
        {
            var totalApplications = await _context.Applications.CountAsync();
            var totalAssessments = await _context.Assessments.CountAsync();
            
            var averageScore = totalAssessments > 0 
                ? await _context.Assessments.AverageAsync(a => (double)a.OverallScore)
                : 0;

            var criticalIssues = await _context.Applications.SumAsync(a => a.CriticalIssues);

            var totalSavings = await _context.Assessments
                .Where(a => a.PotentialSavings.HasValue)
                .SumAsync(a => a.PotentialSavings!.Value);

            var completedAssessments = await _context.Assessments
                .Where(a => a.Status == "Completed")
                .CountAsync();

            var assessmentProgress = totalAssessments > 0 
                ? (completedAssessments * 100 / totalAssessments) 
                : 0;

            var securityIssues = await _context.Applications.SumAsync(a => a.SecurityIssues);
            
            var avgCloudReadiness = totalApplications > 0
                ? await _context.Applications.AverageAsync(a => (double)a.CloudReadinessScore)
                : 0;

            // Calculate total migration cost across all applications
            var totalMigrationCost = await _context.Applications
                .Where(a => a.EstimatedMigrationCost.HasValue)
                .SumAsync(a => a.EstimatedMigrationCost!.Value);

            // Generate trend data (mock for now - in real app, this would be historical data)
            var trends = GenerateTrendData();

            var result = new
            {
                metrics = new
                {
                    totalApplications,
                    averageScore = (int)Math.Round(averageScore),
                    criticalIssues = criticalIssues,
                    potentialSavings = totalSavings,
                    assessmentProgress,
                    securityIssues,
                    cloudReadiness = (int)Math.Round(avgCloudReadiness),
                    totalMigrationCost = totalMigrationCost
                },
                trends
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard overview");
            return StatusCode(500, "An error occurred while retrieving dashboard overview");
        }
    }

    // GET: api/dashboard/portfolio
    [HttpGet("portfolio")]
    public async Task<ActionResult> GetPortfolioSummary([FromQuery] int? assessmentId = null)
    {
        try
        {
            var query = _context.Applications
                .Include(a => a.Assessment)
                .AsQueryable();

            if (assessmentId.HasValue)
            {
                query = query.Where(a => a.AssessmentId == assessmentId.Value);
            }

            var applications = await query.Select(app => new
            {
                id = app.Id,
                name = app.Name,
                type = app.Type,
                category = app.Category,
                technology = app.Technology,
                linesOfCode = app.LinesOfCode,
                complexityScore = app.ComplexityScore,
                securityRating = app.SecurityRating,
                cloudReadinessScore = app.CloudReadinessScore,
                estimatedMigrationCost = app.EstimatedMigrationCost,
                monthlyCost = app.MonthlyCost,
                lastAnalyzed = app.LastAnalyzedDate,
                criticalFindings = app.CriticalIssues,
                highFindings = app.SecurityIssues,
                assessment = new
                {
                    id = app.Assessment.Id,
                    name = app.Assessment.Name,
                    status = app.Assessment.Status
                }
            }).ToListAsync();

            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving portfolio summary");
            return StatusCode(500, "An error occurred while retrieving portfolio summary");
        }
    }

    private static object[] GenerateTrendData()
    {
        var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
        var random = new Random();
        
        return months.Select(month => new
        {
            month,
            score = random.Next(65, 95) // Generate random scores between 65-95
        }).ToArray();
    }
}