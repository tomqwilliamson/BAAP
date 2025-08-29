using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using BAAP.API.Data;
using BAAP.API.Models;
using BAAP.API.Hubs;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CloudReadinessController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<CloudReadinessController> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public CloudReadinessController(
        BaapDbContext context,
        ILogger<CloudReadinessController> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    // GET: api/cloudreadiness/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult> GetCloudReadiness(int assessmentId, [FromQuery] string domain = "all")
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            var result = domain.ToLower() switch
            {
                "security" => GenerateSecurityDomainData(assessment),
                "applications" => GenerateApplicationDomainData(assessment),
                "infrastructure" => GenerateInfrastructureDomainData(),
                "data" => GenerateDataDomainData(),
                _ => GenerateAllDomainsData(assessment)
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cloud readiness for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving cloud readiness data");
        }
    }

    // POST: api/cloudreadiness/assessment/{assessmentId}/analyze
    [HttpPost("assessment/{assessmentId}/analyze")]
    public async Task<ActionResult> AnalyzeCloudReadiness(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Simulate cloud readiness analysis
            var analysisResult = await PerformCloudReadinessAnalysis(assessment);

            // Update assessment scores based on analysis
            assessment.CloudReadinessScore = analysisResult.OverallScore;
            await _context.SaveChangesAsync();

            // Send notification
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                Type = "analysis",
                Module = "cloud-readiness",
                AssessmentName = assessment.Name,
                Duration = "2s", // This should be calculated from actual duration
                Timestamp = DateTime.UtcNow
            });

            return Ok(analysisResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing cloud readiness for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while analyzing cloud readiness");
        }
    }

    // PUT: api/cloudreadiness/assessment/{assessmentId}
    [HttpPut("assessment/{assessmentId}")]
    public async Task<ActionResult> UpdateCloudReadiness(int assessmentId, [FromBody] UpdateCloudReadinessRequest request)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(assessmentId);
            
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            if (request.CloudReadinessScore.HasValue)
            {
                assessment.CloudReadinessScore = request.CloudReadinessScore.Value;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                assessmentId = assessment.Id,
                cloudReadinessScore = assessment.CloudReadinessScore,
                message = "Cloud readiness score updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating cloud readiness for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating cloud readiness");
        }
    }

    private object GenerateSecurityDomainData(Assessment assessment)
    {
        var securityFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).ToList();
        var critical = securityFindings.Count(sf => sf.Severity == "Critical");
        var high = securityFindings.Count(sf => sf.Severity == "High");
        var medium = securityFindings.Count(sf => sf.Severity == "Medium");
        var low = securityFindings.Count(sf => sf.Severity == "Low");

        return new
        {
            summary = new { critical, high, medium, low, total = securityFindings.Count },
            overallScore = assessment.SecurityScore,
            details = new
            {
                vulnerabilities = new { critical, high, medium, low },
                compliance = new
                {
                    pci = new { status = "Partial", score = 78 },
                    sox = new { status = "Compliant", score = 92 },
                    gdpr = new { status = "Compliant", score = 88 }
                }
            }
        };
    }

    private object GenerateApplicationDomainData(Assessment assessment)
    {
        return new
        {
            applications = assessment.Applications.Select(app => new
            {
                id = app.Id,
                name = app.Name,
                type = app.Type,
                cloudReadinessScore = app.CloudReadinessScore,
                complexity = app.ComplexityScore,
                estimatedCost = app.EstimatedMigrationCost
            }),
            summary = new
            {
                totalApplications = assessment.Applications.Count,
                averageReadiness = assessment.Applications.Any() 
                    ? assessment.Applications.Average(a => a.CloudReadinessScore) 
                    : 0,
                readyForMigration = assessment.Applications.Count(a => a.CloudReadinessScore >= 80)
            }
        };
    }

    private object GenerateInfrastructureDomainData()
    {
        return new
        {
            compute = new { vmCompatibility = 85, containerReadiness = 72 },
            networking = new { vnetConfiguration = 90, loadBalancerSetup = 78 },
            storage = new { dataTransfer = 88, performanceOptimization = 75 }
        };
    }

    private object GenerateDataDomainData()
    {
        return new
        {
            databases = new[]
            {
                new { name = "ProductionDB", type = "SQL Server 2016", compatibility = "Azure SQL DB", readiness = 92 },
                new { name = "AnalyticsDB", type = "SQL Server 2014", compatibility = "Azure SQL MI", readiness = 75 }
            },
            migration = new
            {
                strategy = "Hybrid approach with phased migration",
                estimatedDowntime = "4-6 hours",
                riskLevel = "Medium"
            }
        };
    }

    private object GenerateAllDomainsData(Assessment assessment)
    {
        return new
        {
            overallScore = assessment.CloudReadinessScore,
            domains = new
            {
                security = GenerateSecurityDomainData(assessment),
                applications = GenerateApplicationDomainData(assessment),
                infrastructure = GenerateInfrastructureDomainData(),
                data = GenerateDataDomainData()
            }
        };
    }

    private async Task<CloudReadinessAnalysisResult> PerformCloudReadinessAnalysis(Assessment assessment)
    {
        // Simulate analysis processing time
        await Task.Delay(2000);

        var random = new Random();
        var overallScore = random.Next(65, 90);

        return new CloudReadinessAnalysisResult
        {
            OverallScore = overallScore,
            AnalysisDate = DateTime.UtcNow,
            Summary = new
            {
                readyApplications = assessment.Applications.Count(a => a.CloudReadinessScore >= 80),
                requiresWork = assessment.Applications.Count(a => a.CloudReadinessScore < 60),
                recommendedApproach = overallScore >= 75 ? "Aggressive migration" : "Phased approach"
            }
        };
    }
}

public class UpdateCloudReadinessRequest
{
    public int? CloudReadinessScore { get; set; }
}

public class CloudReadinessAnalysisResult
{
    public int OverallScore { get; set; }
    public DateTime AnalysisDate { get; set; }
    public object? Summary { get; set; }
}