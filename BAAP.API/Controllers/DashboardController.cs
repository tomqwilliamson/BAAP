using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using BAAP.API.Services;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<DashboardController> _logger;
    private readonly DataSeederService _dataSeeder;

    public DashboardController(BaapDbContext context, ILogger<DashboardController> logger, DataSeederService dataSeeder)
    {
        _context = context;
        _logger = logger;
        _dataSeeder = dataSeeder;
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
                criticalIssues = app.CriticalIssues,
                securityIssues = app.SecurityIssues,
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

    // GET: api/dashboard/debug
    [HttpGet("debug")]
    public async Task<ActionResult> GetDebugInfo()
    {
        try
        {
            var apps = await _context.Applications
                .Select(a => new { 
                    a.Id, 
                    a.Name, 
                    a.CriticalIssues, 
                    a.SecurityIssues 
                })
                .ToListAsync();
                
            var totalCritical = await _context.Applications.SumAsync(a => a.CriticalIssues);
            var totalSecurity = await _context.Applications.SumAsync(a => a.SecurityIssues);
                
            return Ok(new { apps, totalCritical, totalSecurity });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST: api/dashboard/fix-data
    [HttpPost("fix-data")]
    public async Task<ActionResult> FixApplicationData()
    {
        try
        {
            var applications = await _context.Applications.ToListAsync();
            
            // Update each application with realistic critical and security issue counts
            var updates = new Dictionary<int, (int critical, int security)>
            {
                { 1, (3, 8) },   // Customer Portal
                { 2, (5, 12) },  // Payment Service  
                { 3, (2, 6) },   // Core Banking System
                { 4, (1, 4) },   // Data Processing Pipeline
                { 5, (4, 9) },   // Inventory Management System
                { 6, (2, 7) },   // User Authentication Service
                { 7, (6, 15) },  // Account Management System - Legacy COBOL system
                { 8, (2, 5) }    // Real-time Analytics Engine - Scala system
            };

            foreach (var app in applications)
            {
                if (updates.ContainsKey(app.Id))
                {
                    app.CriticalIssues = updates[app.Id].critical;
                    app.SecurityIssues = updates[app.Id].security;
                }
            }

            await _context.SaveChangesAsync();
            
            // Return updated totals
            var totalCritical = await _context.Applications.SumAsync(a => a.CriticalIssues);
            var totalSecurity = await _context.Applications.SumAsync(a => a.SecurityIssues);
            
            return Ok(new { 
                message = "Application data updated successfully",
                totalCritical, 
                totalSecurity,
                updatedApps = applications.Select(a => new { a.Id, a.Name, a.CriticalIssues, a.SecurityIssues })
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST: api/dashboard/seed-issues
    [HttpPost("seed-issues")]
    public async Task<ActionResult> SeedApplicationIssues()
    {
        try
        {
            await _dataSeeder.UpdateApplicationIssuesAsync();
            
            // Return updated totals
            var totalCritical = await _context.Applications.SumAsync(a => a.CriticalIssues);
            var totalSecurity = await _context.Applications.SumAsync(a => a.SecurityIssues);
            
            return Ok(new { 
                message = "Application critical and security issues updated successfully",
                totalCritical, 
                totalSecurity
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application issues");
            return BadRequest(ex.Message);
        }
    }

    // POST: api/dashboard/seed-business-context
    [HttpPost("seed-business-context")]
    public async Task<ActionResult> SeedBusinessContextData()
    {
        try
        {
            var assessments = await _context.Assessments.ToListAsync();
            
            if (!assessments.Any())
            {
                return BadRequest("No assessments found. Please seed assessments first.");
            }

            // Check if data already exists
            var existingBudgets = await _context.BudgetAllocations.AnyAsync();
            var existingTimelines = await _context.ProjectTimelineItems.AnyAsync();
            var existingRisks = await _context.BusinessContextRisks.AnyAsync();
            
            if (existingBudgets || existingTimelines || existingRisks)
            {
                return Ok(new { message = "Business context data already exists." });
            }

            // Seed business context data
            await _dataSeeder.SeedBudgetAllocations(assessments);
            await _dataSeeder.SeedProjectTimelines(assessments);
            await _dataSeeder.SeedBusinessContextRisks(assessments);
            
            await _context.SaveChangesAsync();
            
            // Return summary of seeded data
            var budgetCount = await _context.BudgetAllocations.CountAsync();
            var timelineCount = await _context.ProjectTimelineItems.CountAsync();
            var riskCount = await _context.BusinessContextRisks.CountAsync();
            
            return Ok(new { 
                message = "Business context data seeded successfully",
                budgetAllocations = budgetCount,
                timelineItems = timelineCount,
                risks = riskCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding business context data");
            return BadRequest(ex.Message);
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