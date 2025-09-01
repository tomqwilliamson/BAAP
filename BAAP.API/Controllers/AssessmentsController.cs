using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using BAAP.API.Data;
using BAAP.API.Models;
using BAAP.API.Hubs;
using BAAP.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize] // Temporarily disabled for development
public class AssessmentsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<AssessmentsController> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly DataSeederService _dataSeederService;

    public AssessmentsController(
        BaapDbContext context,
        ILogger<AssessmentsController> logger,
        IHubContext<NotificationHub> hubContext,
        DataSeederService dataSeederService)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
        _dataSeederService = dataSeederService;
    }

    // GET: api/assessments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Assessment>>> GetAssessments()
    {
        try
        {
            var assessments = await _context.Assessments
                .Include(a => a.Applications)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Stakeholders)
                .Include(a => a.Recommendations)
                .ToListAsync();

            return Ok(assessments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving assessments: {ErrorMessage}", ex.Message);
            return StatusCode(500, $"An error occurred while retrieving assessments: {ex.Message}");
        }
    }

    // GET: api/assessments/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Assessment>> GetAssessment(int id)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Stakeholders)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            return Ok(assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while retrieving the assessment");
        }
    }

    // POST: api/assessments
    [HttpPost]
    public async Task<ActionResult<Assessment>> CreateAssessment(Assessment assessment)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            assessment.CreatedDate = DateTime.UtcNow;
            assessment.Status = "Draft";

            _context.Assessments.Add(assessment);
            await _context.SaveChangesAsync();

            // Seed default data for the new assessment to prevent component crashes
            try
            {
                await _dataSeederService.SeedDefaultDataForNewAssessment(assessment.Id);
                _logger.LogInformation("Default data seeded successfully for new assessment ID {AssessmentId}", assessment.Id);
            }
            catch (Exception seedEx)
            {
                _logger.LogWarning(seedEx, "Failed to seed default data for assessment ID {AssessmentId}, but assessment was created successfully", assessment.Id);
            }

            return CreatedAtAction(nameof(GetAssessment), new { id = assessment.Id }, assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating assessment");
            return StatusCode(500, "An error occurred while creating the assessment");
        }
    }

    // PUT: api/assessments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAssessment(int id, AssessmentUpdate assessmentUpdate)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(id);
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            // Update only the fields that are provided
            if (assessmentUpdate.Name != null) assessment.Name = assessmentUpdate.Name;
            if (assessmentUpdate.Description != null) assessment.Description = assessmentUpdate.Description;
            if (assessmentUpdate.Status != null) assessment.Status = assessmentUpdate.Status;
            if (assessmentUpdate.BusinessContext != null) assessment.BusinessContext = assessmentUpdate.BusinessContext;
            if (assessmentUpdate.EstimatedCost.HasValue) assessment.EstimatedCost = assessmentUpdate.EstimatedCost.Value;
            if (assessmentUpdate.PotentialSavings.HasValue) assessment.PotentialSavings = assessmentUpdate.PotentialSavings.Value;
            if (assessmentUpdate.OverallScore.HasValue) assessment.OverallScore = assessmentUpdate.OverallScore.Value;
            if (assessmentUpdate.SecurityScore.HasValue) assessment.SecurityScore = assessmentUpdate.SecurityScore.Value;
            if (assessmentUpdate.CloudReadinessScore.HasValue) assessment.CloudReadinessScore = assessmentUpdate.CloudReadinessScore.Value;
            if (assessmentUpdate.CodeQualityScore.HasValue) assessment.CodeQualityScore = assessmentUpdate.CodeQualityScore.Value;
            if (assessmentUpdate.InfrastructureScore.HasValue) assessment.InfrastructureScore = assessmentUpdate.InfrastructureScore.Value;
            if (assessmentUpdate.DevOpsMaturityScore.HasValue) assessment.DevOpsMaturityScore = assessmentUpdate.DevOpsMaturityScore.Value;
            if (assessmentUpdate.DatabaseOptimizationScore.HasValue) assessment.DatabaseOptimizationScore = assessmentUpdate.DatabaseOptimizationScore.Value;
            if (assessmentUpdate.DocumentationScore.HasValue) assessment.DocumentationScore = assessmentUpdate.DocumentationScore.Value;
            if (assessmentUpdate.ApplicationCount.HasValue) assessment.ApplicationCount = assessmentUpdate.ApplicationCount.Value;
            if (assessmentUpdate.Timeline != null) assessment.Timeline = assessmentUpdate.Timeline;
            if (assessmentUpdate.Budget.HasValue) assessment.Budget = assessmentUpdate.Budget.Value;

            assessment.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while updating the assessment");
        }
    }

    // POST: api/assessments/{id}/start
    [HttpPost("{id}/start")]
    public async Task<ActionResult<Assessment>> StartAssessment(int id)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(id);
            
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            if (assessment.Status != "Draft")
            {
                return BadRequest("Assessment can only be started from Draft status");
            }

            assessment.Status = "In Progress";
            assessment.StartedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while starting the assessment");
        }
    }

    // GET: api/assessments/{id}/data
    [HttpGet("{id}/data")]
    public async Task<ActionResult> GetAssessmentData(int id, [FromQuery] string domain = "all")
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            // Return filtered data based on domain parameter
            object result = domain.ToLower() switch
            {
                "security" => new
                {
                    applications = assessment.Applications.Select(app => new
                    {
                        id = app.Id,
                        name = app.Name,
                        securityFindings = app.SecurityFindings,
                        securityRating = app.SecurityRating
                    })
                },
                "applications" => new
                {
                    applications = assessment.Applications.Select(app => new
                    {
                        id = app.Id,
                        name = app.Name,
                        type = app.Type,
                        technology = app.Technology,
                        linesOfCode = app.LinesOfCode,
                        complexityScore = app.ComplexityScore
                    })
                },
                _ => new
                {
                    assessment = new
                    {
                        id = assessment.Id,
                        name = assessment.Name,
                        status = assessment.Status,
                        overallScore = assessment.OverallScore
                    },
                    applications = assessment.Applications
                }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving assessment data for ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while retrieving assessment data");
        }
    }

    // DELETE: api/assessments/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAssessment(int id)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            // Remove all related data
            foreach (var application in assessment.Applications)
            {
                _context.SecurityFindings.RemoveRange(application.SecurityFindings);
                _context.CodeMetrics.RemoveRange(application.CodeMetrics);
            }
            
            _context.Applications.RemoveRange(assessment.Applications);
            _context.Stakeholders.RemoveRange(assessment.Stakeholders);
            _context.BusinessDrivers.RemoveRange(assessment.BusinessDrivers);
            _context.Recommendations.RemoveRange(assessment.Recommendations);
            _context.Assessments.Remove(assessment);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Assessment deleted successfully", id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while deleting the assessment");
        }
    }

    // POST: api/assessments/{id}/complete
    [HttpPost("{id}/complete")]
    public async Task<ActionResult> CompleteAssessment(int id, [FromBody] CompleteAssessmentRequest request)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(id);
            
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            if (assessment.Status == "Completed")
            {
                return BadRequest("Assessment is already completed");
            }

            assessment.Status = "Completed";
            assessment.CompletedDate = DateTime.UtcNow;
            
            if (request.FinalNotes != null)
            {
                assessment.Notes = request.FinalNotes;
            }

            if (request.OverallScore.HasValue)
            {
                assessment.OverallScore = request.OverallScore.Value;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = assessment.Id,
                name = assessment.Name,
                status = assessment.Status,
                completedDate = assessment.CompletedDate,
                overallScore = assessment.OverallScore,
                message = "Assessment completed successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while completing the assessment");
        }
    }

    // POST: api/assessments/{id}/applications
    [HttpPost("{id}/applications")]
    public async Task<ActionResult> AddApplicationToAssessment(int id, [FromBody] AddApplicationRequest request)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(id);
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            var application = await _context.Applications.FindAsync(request.ApplicationId);
            if (application == null)
            {
                return NotFound($"Application with ID {request.ApplicationId} not found");
            }

            if (application.AssessmentId != null)
            {
                return BadRequest("Application is already assigned to an assessment");
            }

            application.AssessmentId = id;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Application added to assessment successfully",
                assessmentId = id,
                applicationId = request.ApplicationId,
                applicationName = application.Name
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding application to assessment ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while adding application to assessment");
        }
    }

    // DELETE: api/assessments/{id}/applications/{appId}
    [HttpDelete("{id}/applications/{appId}")]
    public async Task<ActionResult> RemoveApplicationFromAssessment(int id, int appId)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(id);
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            var application = await _context.Applications.FindAsync(appId);
            if (application == null)
            {
                return NotFound($"Application with ID {appId} not found");
            }

            if (application.AssessmentId != id)
            {
                return BadRequest("Application is not assigned to this assessment");
            }

            application.AssessmentId = null;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Application removed from assessment successfully",
                assessmentId = id,
                applicationId = appId,
                applicationName = application.Name
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing application from assessment ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while removing application from assessment");
        }
    }

    // GET: api/assessments/{id}/progress
    [HttpGet("{id}/progress")]
    public async Task<ActionResult> GetAssessmentProgress(int id)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            var totalApplications = assessment.Applications.Count;
            var analyzedApplications = assessment.Applications.Count(a => a.LastAnalyzedDate != null);
            var totalSecurityFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count();
            var resolvedSecurityFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(sf => sf.IsResolved);
            var totalRecommendations = assessment.Recommendations.Count;
            var acceptedRecommendations = assessment.Recommendations.Count(r => r.IsAccepted);

            var progress = new
            {
                overall = new
                {
                    percentage = CalculateOverallProgress(assessment),
                    status = assessment.Status,
                    phase = DetermineCurrentPhase(assessment)
                },
                applications = new
                {
                    total = totalApplications,
                    analyzed = analyzedApplications,
                    percentage = totalApplications > 0 ? (analyzedApplications * 100 / totalApplications) : 0
                },
                security = new
                {
                    totalFindings = totalSecurityFindings,
                    resolvedFindings = resolvedSecurityFindings,
                    percentage = totalSecurityFindings > 0 ? (resolvedSecurityFindings * 100 / totalSecurityFindings) : 0
                },
                stakeholders = new
                {
                    total = assessment.Stakeholders.Count,
                    contacted = assessment.Stakeholders.Count(s => !string.IsNullOrEmpty(s.Email))
                },
                businessDrivers = new
                {
                    total = assessment.BusinessDrivers.Count,
                    highPriority = assessment.BusinessDrivers.Count(bd => bd.Priority == "High")
                },
                recommendations = new
                {
                    total = totalRecommendations,
                    accepted = acceptedRecommendations,
                    percentage = totalRecommendations > 0 ? (acceptedRecommendations * 100 / totalRecommendations) : 0
                }
            };

            return Ok(progress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving progress for assessment ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while retrieving assessment progress");
        }
    }

    // POST: api/assessments/{id}/clone
    [HttpPost("{id}/clone")]
    public async Task<ActionResult> CloneAssessment(int id, [FromBody] CloneAssessmentRequest request)
    {
        try
        {
            var originalAssessment = await _context.Assessments
                .Include(a => a.Applications)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (originalAssessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            // Create new assessment
            var clonedAssessment = new Assessment
            {
                Name = request.Name ?? $"{originalAssessment.Name} - Copy",
                Description = originalAssessment.Description,
                Status = "Draft",
                CreatedDate = DateTime.UtcNow,
                Type = originalAssessment.Type,
                Scope = originalAssessment.Scope,
                BusinessObjective = originalAssessment.BusinessObjective,
                Timeline = originalAssessment.Timeline,
                Budget = originalAssessment.Budget
            };

            _context.Assessments.Add(clonedAssessment);
            await _context.SaveChangesAsync();

            // Clone stakeholders if requested
            if (request.IncludeStakeholders)
            {
                var clonedStakeholders = originalAssessment.Stakeholders.Select(s => new Stakeholder
                {
                    Name = s.Name,
                    Role = s.Role,
                    Department = s.Department,
                    Email = s.Email,
                    InfluenceLevel = s.InfluenceLevel,
                    InterestLevel = s.InterestLevel,
                    Notes = s.Notes,
                    AssessmentId = clonedAssessment.Id
                }).ToList();

                _context.Stakeholders.AddRange(clonedStakeholders);
            }

            // Clone business drivers if requested
            if (request.IncludeBusinessDrivers)
            {
                var clonedBusinessDrivers = originalAssessment.BusinessDrivers.Select(bd => new BusinessDriver
                {
                    Name = bd.Name,
                    Description = bd.Description,
                    Priority = bd.Priority,
                    Impact = bd.Impact,
                    Urgency = bd.Urgency,
                    BusinessValue = bd.BusinessValue,
                    AssessmentId = clonedAssessment.Id
                }).ToList();

                _context.BusinessDrivers.AddRange(clonedBusinessDrivers);
            }

            // Note: Applications are not cloned to prevent duplication
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssessment), new { id = clonedAssessment.Id }, new
            {
                id = clonedAssessment.Id,
                name = clonedAssessment.Name,
                status = clonedAssessment.Status,
                createdDate = clonedAssessment.CreatedDate,
                originalAssessmentId = id,
                stakeholdersCloned = request.IncludeStakeholders,
                businessDriversCloned = request.IncludeBusinessDrivers,
                message = "Assessment cloned successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cloning assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while cloning the assessment");
        }
    }

    private int CalculateOverallProgress(Assessment assessment)
    {
        var progressFactors = new List<int>();

        // Applications analysis progress
        if (assessment.Applications.Any())
        {
            var analyzedApps = assessment.Applications.Count(a => a.LastAnalyzedDate != null);
            progressFactors.Add((analyzedApps * 100) / assessment.Applications.Count);
        }

        // Stakeholder completion
        progressFactors.Add(assessment.Stakeholders.Any() ? 100 : 0);

        // Business drivers completion
        progressFactors.Add(assessment.BusinessDrivers.Any() ? 100 : 0);

        // Status-based progress
        var statusProgress = assessment.Status switch
        {
            "Draft" => 10,
            "In Progress" => 50,
            "Completed" => 100,
            _ => 0
        };
        progressFactors.Add(statusProgress);

        return progressFactors.Any() ? (int)progressFactors.Average() : 0;
    }

    private string DetermineCurrentPhase(Assessment assessment)
    {
        if (assessment.Status == "Completed")
            return "Complete";

        if (!assessment.Applications.Any())
            return "Setup";

        if (!assessment.Applications.Any(a => a.LastAnalyzedDate != null))
            return "Discovery";

        if (assessment.Recommendations.Count == 0)
            return "Analysis";

        if (assessment.Recommendations.Any(r => !r.IsAccepted))
            return "Review";

        return "Finalization";
    }

    private bool AssessmentExists(int id)
    {
        return _context.Assessments.Any(e => e.Id == id);
    }
}

public class CompleteAssessmentRequest
{
    public string? FinalNotes { get; set; }
    public int? OverallScore { get; set; }
}

public class AddApplicationRequest
{
    public int ApplicationId { get; set; }
}

public class CloneAssessmentRequest
{
    public string? Name { get; set; }
    public bool IncludeStakeholders { get; set; } = true;
    public bool IncludeBusinessDrivers { get; set; } = true;
}