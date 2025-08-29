using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using BAAP.API.Data;
using BAAP.API.Models;
using BAAP.API.Hubs;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<ApplicationsController> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public ApplicationsController(
        BaapDbContext context,
        ILogger<ApplicationsController> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    // GET: api/applications
    [HttpGet]
    public async Task<ActionResult> GetApplications(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? type = null,
        [FromQuery] string? technology = null,
        [FromQuery] int? assessmentId = null)
    {
        try
        {
            var query = _context.Applications
                .Include(a => a.Assessment)
                .Include(a => a.SecurityFindings)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Name.Contains(search) || (a.Description != null && a.Description.Contains(search)));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(a => a.Type == type);
            }

            if (!string.IsNullOrEmpty(technology))
            {
                query = query.Where(a => a.Technology.Contains(technology));
            }

            if (assessmentId.HasValue)
            {
                query = query.Where(a => a.AssessmentId == assessmentId.Value);
            }

            var totalCount = await query.CountAsync();
            var applications = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    id = a.Id,
                    name = a.Name,
                    description = a.Description,
                    type = a.Type,
                    category = a.Category,
                    technology = a.Technology,
                    linesOfCode = a.LinesOfCode,
                    complexityScore = a.ComplexityScore,
                    securityRating = a.SecurityRating,
                    cloudReadinessScore = a.CloudReadinessScore,
                    estimatedMigrationCost = a.EstimatedMigrationCost,
                    monthlyCost = a.MonthlyCost,
                    lastAnalyzed = a.LastAnalyzedDate,
                    securityFindings = a.SecurityFindings.Count,
                    criticalFindings = a.SecurityFindings.Count(sf => sf.Severity == "Critical"),
                    assessment = a.Assessment == null ? null : new
                    {
                        id = a.Assessment.Id,
                        name = a.Assessment.Name,
                        status = a.Assessment.Status
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                data = applications,
                pagination = new
                {
                    page,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    hasNext = page * pageSize < totalCount,
                    hasPrevious = page > 1
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return StatusCode(500, "An error occurred while retrieving applications");
        }
    }

    // POST: api/applications
    [HttpPost]
    public async Task<ActionResult<Application>> CreateApplication([FromBody] CreateApplicationRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate assessment exists if provided
            if (request.AssessmentId.HasValue)
            {
                var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId.Value);
                if (!assessmentExists)
                {
                    return BadRequest("Assessment not found");
                }
            }

            var application = new Application
            {
                Name = request.Name,
                Description = request.Description ?? "",
                Type = request.Type,
                Category = request.Category ?? "",
                Technology = request.Technology ?? "",
                LinesOfCode = request.LinesOfCode ?? 0,
                ComplexityScore = request.ComplexityScore ?? 0,
                SecurityRating = request.SecurityRating ?? 0,
                CloudReadinessScore = request.CloudReadinessScore ?? 0,
                EstimatedMigrationCost = request.EstimatedMigrationCost,
                MonthlyCost = request.MonthlyCost,
                AssessmentId = request.AssessmentId,
                CreatedDate = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            // Return the created application with related data
            var createdApp = await _context.Applications
                .Include(a => a.Assessment)
                .FirstOrDefaultAsync(a => a.Id == application.Id);

            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, createdApp);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating application");
            return StatusCode(500, "An error occurred while creating the application");
        }
    }

    // PUT: api/applications/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateApplication(int id, [FromBody] UpdateApplicationRequest request)
    {
        try
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return NotFound($"Application with ID {id} not found");
            }

            // Validate assessment exists if provided
            if (request.AssessmentId.HasValue)
            {
                var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId.Value);
                if (!assessmentExists)
                {
                    return BadRequest("Assessment not found");
                }
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(request.Name))
                application.Name = request.Name;
            if (request.Description != null)
                application.Description = request.Description;
            if (!string.IsNullOrEmpty(request.Type))
                application.Type = request.Type;
            if (request.Category != null)
                application.Category = request.Category;
            if (request.Technology != null)
                application.Technology = request.Technology;
            if (request.LinesOfCode.HasValue)
                application.LinesOfCode = request.LinesOfCode.Value;
            if (request.ComplexityScore.HasValue)
                application.ComplexityScore = request.ComplexityScore.Value;
            if (request.SecurityRating.HasValue)
                application.SecurityRating = request.SecurityRating.Value;
            if (request.CloudReadinessScore.HasValue)
                application.CloudReadinessScore = request.CloudReadinessScore.Value;
            if (request.EstimatedMigrationCost.HasValue)
                application.EstimatedMigrationCost = request.EstimatedMigrationCost;
            if (request.MonthlyCost.HasValue)
                application.MonthlyCost = request.MonthlyCost;
            if (request.AssessmentId.HasValue)
                application.AssessmentId = request.AssessmentId;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application with ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while updating the application");
        }
    }

    // DELETE: api/applications/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApplication(int id)
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

            // Remove related data first
            _context.SecurityFindings.RemoveRange(application.SecurityFindings);
            _context.CodeMetrics.RemoveRange(application.CodeMetrics);
            _context.Applications.Remove(application);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Application deleted successfully", id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting application with ID {ApplicationId}", id);
            return StatusCode(500, "An error occurred while deleting the application");
        }
    }

    // POST: api/applications/bulk-import
    [HttpPost("bulk-import")]
    public async Task<ActionResult> BulkImportApplications([FromBody] BulkImportApplicationsRequest request)
    {
        try
        {
            if (request.Applications == null || !request.Applications.Any())
            {
                return BadRequest("No applications provided for import");
            }

            var applications = new List<Application>();
            var errors = new List<string>();

            foreach (var appRequest in request.Applications)
            {
                try
                {
                    // Validate assessment exists if provided
                    if (appRequest.AssessmentId.HasValue)
                    {
                        var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == appRequest.AssessmentId.Value);
                        if (!assessmentExists)
                        {
                            errors.Add($"Assessment not found for application: {appRequest.Name}");
                            continue;
                        }
                    }

                    var application = new Application
                    {
                        Name = appRequest.Name,
                        Description = appRequest.Description ?? "",
                        Type = appRequest.Type,
                        Category = appRequest.Category ?? "",
                        Technology = appRequest.Technology ?? "",
                        LinesOfCode = appRequest.LinesOfCode ?? 0,
                        AssessmentId = appRequest.AssessmentId,
                        CreatedDate = DateTime.UtcNow
                    };

                    applications.Add(application);
                }
                catch (Exception ex)
                {
                    errors.Add($"Error processing application {appRequest.Name}: {ex.Message}");
                }
            }

            if (applications.Any())
            {
                _context.Applications.AddRange(applications);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Bulk import completed",
                imported = applications.Count,
                errors = errors.Count,
                errorDetails = errors
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk import");
            return StatusCode(500, "An error occurred during bulk import");
        }
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

public class CreateApplicationRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Technology { get; set; }
    public int? LinesOfCode { get; set; }
    public int? ComplexityScore { get; set; }
    public int? SecurityRating { get; set; }
    public int? CloudReadinessScore { get; set; }
    public decimal? EstimatedMigrationCost { get; set; }
    public decimal? MonthlyCost { get; set; }
    public int? AssessmentId { get; set; }
}

public class UpdateApplicationRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public string? Category { get; set; }
    public string? Technology { get; set; }
    public int? LinesOfCode { get; set; }
    public int? ComplexityScore { get; set; }
    public int? SecurityRating { get; set; }
    public int? CloudReadinessScore { get; set; }
    public decimal? EstimatedMigrationCost { get; set; }
    public decimal? MonthlyCost { get; set; }
    public int? AssessmentId { get; set; }
}

public class BulkImportApplicationsRequest
{
    public List<CreateApplicationRequest> Applications { get; set; } = new();
}