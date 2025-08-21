using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<ApplicationsController> _logger;

    public ApplicationsController(BaapDbContext context, ILogger<ApplicationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/applications/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Application>> GetApplication(int id)
    {
        try
        {
            var application = await _context.Applications
                .Include(a => a.Assessment)
                .Include(a => a.SecurityFindings)
                .Include(a => a.CodeMetrics)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound($"Application with ID {id} not found");
            }

            return Ok(application);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application with ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while retrieving the application");
        }
    }

    // POST: api/applications/{id}/analyze
    [HttpPost("{id}/analyze")]
    public async Task<ActionResult> AnalyzeApplication(int id)
    {
        try
        {
            var application = await _context.Applications
                .Include(a => a.SecurityFindings)
                .Include(a => a.CodeMetrics)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound($"Application with ID {id} not found");
            }

            // Simulate analysis process
            application.LastAnalyzedDate = DateTime.UtcNow;
            
            // Update scores based on analysis (in real implementation, this would be actual analysis results)
            var random = new Random();
            application.ComplexityScore = random.Next(50, 100);
            application.SecurityRating = random.Next(60, 95);
            application.CloudReadinessScore = random.Next(65, 90);

            await _context.SaveChangesAsync();

            var result = new
            {
                message = "Analysis completed successfully",
                application = new
                {
                    id = application.Id,
                    name = application.Name,
                    complexityScore = application.ComplexityScore,
                    securityRating = application.SecurityRating,
                    cloudReadinessScore = application.CloudReadinessScore,
                    lastAnalyzed = application.LastAnalyzedDate
                },
                analysisResults = new
                {
                    codeQuality = new
                    {
                        score = application.ComplexityScore,
                        issues = application.CodeMetrics.Count(),
                        recommendations = new[]
                        {
                            "Reduce cyclomatic complexity in core modules",
                            "Improve code coverage to 85%+",
                            "Refactor duplicate code blocks"
                        }
                    },
                    security = new
                    {
                        score = application.SecurityRating,
                        vulnerabilities = application.SecurityFindings.Count(),
                        critical = application.SecurityFindings.Count(sf => sf.Severity == "Critical"),
                        high = application.SecurityFindings.Count(sf => sf.Severity == "High")
                    },
                    cloudReadiness = new
                    {
                        score = application.CloudReadinessScore,
                        blockers = random.Next(0, 5),
                        recommendations = new[]
                        {
                            "Update to cloud-native authentication",
                            "Implement distributed caching",
                            "Add health check endpoints"
                        }
                    }
                }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing application with ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while analyzing the application");
        }
    }

    // GET: api/applications/{id}/security-findings
    [HttpGet("{id}/security-findings")]
    public async Task<ActionResult> GetSecurityFindings(int id)
    {
        try
        {
            var application = await _context.Applications
                .Include(a => a.SecurityFindings)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound($"Application with ID {id} not found");
            }

            var findings = application.SecurityFindings.Select(sf => new
            {
                id = sf.Id,
                title = sf.Title,
                description = sf.Description,
                severity = sf.Severity,
                category = sf.Category,
                fileName = sf.FileName,
                lineNumber = sf.LineNumber,
                source = sf.Source,
                isResolved = sf.IsResolved,
                createdDate = sf.CreatedDate,
                resolvedDate = sf.ResolvedDate
            });

            var summary = new
            {
                total = findings.Count(),
                critical = findings.Count(f => f.severity == "Critical"),
                high = findings.Count(f => f.severity == "High"),
                medium = findings.Count(f => f.severity == "Medium"),
                low = findings.Count(f => f.severity == "Low"),
                resolved = findings.Count(f => f.isResolved)
            };

            return Ok(new
            {
                summary,
                findings
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving security findings for application ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while retrieving security findings");
        }
    }

    // GET: api/applications/{id}/code-metrics
    [HttpGet("{id}/code-metrics")]
    public async Task<ActionResult> GetCodeMetrics(int id)
    {
        try
        {
            var application = await _context.Applications
                .Include(a => a.CodeMetrics)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound($"Application with ID {id} not found");
            }

            var metrics = application.CodeMetrics.Select(cm => new
            {
                id = cm.Id,
                metricName = cm.MetricName,
                value = cm.Value,
                unit = cm.Unit,
                category = cm.Category,
                measuredDate = cm.MeasuredDate
            });

            var summary = new
            {
                totalMetrics = metrics.Count(),
                categories = metrics.GroupBy(m => m.category)
                    .ToDictionary(g => g.Key, g => g.Count()),
                lastMeasured = metrics.Any() 
                    ? metrics.Max(m => m.measuredDate) 
                    : (DateTime?)null
            };

            return Ok(new
            {
                summary,
                metrics
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving code metrics for application ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while retrieving code metrics");
        }
    }
}