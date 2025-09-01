using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevelopmentPracticesController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<DevelopmentPracticesController> _logger;

    public DevelopmentPracticesController(BaapDbContext context, ILogger<DevelopmentPracticesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/DevelopmentPractices
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DevelopmentPractices>>> GetDevelopmentPractices()
    {
        try
        {
            var practices = await _context.DevelopmentPractices
                .Include(dp => dp.Assessment)
                .OrderByDescending(dp => dp.CreatedAt)
                .ToListAsync();

            return Ok(practices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving development practices");
            return StatusCode(500, "An error occurred while retrieving development practices");
        }
    }

    // GET: api/DevelopmentPractices/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DevelopmentPractices>> GetDevelopmentPractices(int id)
    {
        try
        {
            var developmentPractices = await _context.DevelopmentPractices
                .Include(dp => dp.Assessment)
                .FirstOrDefaultAsync(dp => dp.Id == id);

            if (developmentPractices == null)
            {
                return NotFound($"Development practices with ID {id} not found");
            }

            return Ok(developmentPractices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving development practices with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving development practices");
        }
    }

    // GET: api/DevelopmentPractices/assessment/5
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult<DevelopmentPractices>> GetDevelopmentPracticesByAssessment(int assessmentId)
    {
        try
        {
            var practices = await _context.DevelopmentPractices
                .Include(dp => dp.Assessment)
                .FirstOrDefaultAsync(dp => dp.AssessmentId == assessmentId);

            if (practices == null)
            {
                return NotFound($"No development practices found for assessment {assessmentId}");
            }

            return Ok(practices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving development practices for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving development practices");
        }
    }

    // PUT: api/DevelopmentPractices/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDevelopmentPractices(int id, DevelopmentPractices developmentPractices)
    {
        if (id != developmentPractices.Id)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            // Verify assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == developmentPractices.AssessmentId);
            if (!assessmentExists)
            {
                return BadRequest($"Assessment with ID {developmentPractices.AssessmentId} does not exist");
            }

            developmentPractices.UpdatedAt = DateTime.UtcNow;
            _context.Entry(developmentPractices).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DevelopmentPracticesExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating development practices with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating development practices");
        }
    }

    // POST: api/DevelopmentPractices
    [HttpPost]
    public async Task<ActionResult<DevelopmentPractices>> PostDevelopmentPractices(DevelopmentPractices developmentPractices)
    {
        try
        {
            // Verify assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == developmentPractices.AssessmentId);
            if (!assessmentExists)
            {
                return BadRequest($"Assessment with ID {developmentPractices.AssessmentId} does not exist");
            }

            // Check if development practices already exist for this assessment
            var existingPractices = await _context.DevelopmentPractices
                .FirstOrDefaultAsync(dp => dp.AssessmentId == developmentPractices.AssessmentId);

            if (existingPractices != null)
            {
                return Conflict($"Development practices already exist for assessment {developmentPractices.AssessmentId}. Use PUT to update.");
            }

            developmentPractices.CreatedAt = DateTime.UtcNow;
            developmentPractices.UpdatedAt = DateTime.UtcNow;

            _context.DevelopmentPractices.Add(developmentPractices);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDevelopmentPractices", new { id = developmentPractices.Id }, developmentPractices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating development practices");
            return StatusCode(500, "An error occurred while creating development practices");
        }
    }

    // POST: api/DevelopmentPractices/assessment/5
    [HttpPost("assessment/{assessmentId}")]
    public async Task<ActionResult<DevelopmentPractices>> CreateOrUpdateDevelopmentPractices(int assessmentId, DevelopmentPractices developmentPractices)
    {
        try
        {
            // Verify assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return BadRequest($"Assessment with ID {assessmentId} does not exist");
            }

            // Check if practices already exist
            var existingPractices = await _context.DevelopmentPractices
                .FirstOrDefaultAsync(dp => dp.AssessmentId == assessmentId);

            if (existingPractices != null)
            {
                // Update existing practices
                existingPractices.PrimaryMethodology = developmentPractices.PrimaryMethodology;
                existingPractices.SprintLength = developmentPractices.SprintLength;
                existingPractices.ReleaseFrequency = developmentPractices.ReleaseFrequency;
                existingPractices.HasDedicatedQA = developmentPractices.HasDedicatedQA;
                existingPractices.ManualTesting = developmentPractices.ManualTesting;
                existingPractices.AutomatedTesting = developmentPractices.AutomatedTesting;
                existingPractices.UnitTesting = developmentPractices.UnitTesting;
                existingPractices.IntegrationTesting = developmentPractices.IntegrationTesting;
                existingPractices.E2ETesting = developmentPractices.E2ETesting;
                existingPractices.PerformanceTesting = developmentPractices.PerformanceTesting;
                existingPractices.CodeCoverageTarget = developmentPractices.CodeCoverageTarget;
                existingPractices.TotalTeamSize = developmentPractices.TotalTeamSize;
                existingPractices.NumberOfScrumTeams = developmentPractices.NumberOfScrumTeams;
                
                // Role counts
                existingPractices.SoftwareDevelopers = developmentPractices.SoftwareDevelopers;
                existingPractices.SeniorLeadDevelopers = developmentPractices.SeniorLeadDevelopers;
                existingPractices.QAEngineers = developmentPractices.QAEngineers;
                existingPractices.DatabaseEngineers = developmentPractices.DatabaseEngineers;
                existingPractices.DevOpsEngineers = developmentPractices.DevOpsEngineers;
                existingPractices.BusinessAnalysts = developmentPractices.BusinessAnalysts;
                existingPractices.ProductManagers = developmentPractices.ProductManagers;
                existingPractices.ProjectManagers = developmentPractices.ProjectManagers;
                existingPractices.ScrumMasters = developmentPractices.ScrumMasters;
                existingPractices.UIUXDesigners = developmentPractices.UIUXDesigners;
                existingPractices.Architects = developmentPractices.Architects;

                // Development practices
                existingPractices.CodeReviews = developmentPractices.CodeReviews;
                existingPractices.PairProgramming = developmentPractices.PairProgramming;
                existingPractices.TestDrivenDevelopment = developmentPractices.TestDrivenDevelopment;
                existingPractices.BehaviorDrivenDevelopment = developmentPractices.BehaviorDrivenDevelopment;
                existingPractices.ContinuousIntegration = developmentPractices.ContinuousIntegration;
                existingPractices.ContinuousDeployment = developmentPractices.ContinuousDeployment;
                existingPractices.FeatureFlags = developmentPractices.FeatureFlags;
                existingPractices.ABTesting = developmentPractices.ABTesting;
                existingPractices.CodeDocumentationStandards = developmentPractices.CodeDocumentationStandards;
                existingPractices.APIDocumentation = developmentPractices.APIDocumentation;
                existingPractices.TechnicalDebtManagement = developmentPractices.TechnicalDebtManagement;
                existingPractices.PerformanceMonitoring = developmentPractices.PerformanceMonitoring;

                // Communication tools
                existingPractices.MicrosoftTeams = developmentPractices.MicrosoftTeams;
                existingPractices.Slack = developmentPractices.Slack;
                existingPractices.Discord = developmentPractices.Discord;
                existingPractices.Email = developmentPractices.Email;
                existingPractices.OtherCommunicationTools = developmentPractices.OtherCommunicationTools;

                // Project management tools
                existingPractices.AzureDevOps = developmentPractices.AzureDevOps;
                existingPractices.Jira = developmentPractices.Jira;
                existingPractices.GitHubProjects = developmentPractices.GitHubProjects;
                existingPractices.Trello = developmentPractices.Trello;
                existingPractices.Asana = developmentPractices.Asana;
                existingPractices.MondayCom = developmentPractices.MondayCom;
                existingPractices.OtherProjectManagementTools = developmentPractices.OtherProjectManagementTools;

                // Meeting cadence
                existingPractices.DailyStandups = developmentPractices.DailyStandups;
                existingPractices.SprintPlanning = developmentPractices.SprintPlanning;
                existingPractices.SprintReviews = developmentPractices.SprintReviews;
                existingPractices.Retrospectives = developmentPractices.Retrospectives;
                existingPractices.BacklogGrooming = developmentPractices.BacklogGrooming;
                existingPractices.ArchitectureReviews = developmentPractices.ArchitectureReviews;

                // Technology
                existingPractices.PrimaryProgrammingLanguages = developmentPractices.PrimaryProgrammingLanguages;
                existingPractices.VisualStudio = developmentPractices.VisualStudio;
                existingPractices.VSCode = developmentPractices.VSCode;
                existingPractices.IntelliJIDEA = developmentPractices.IntelliJIDEA;
                existingPractices.Eclipse = developmentPractices.Eclipse;
                existingPractices.OtherIDEs = developmentPractices.OtherIDEs;

                existingPractices.UpdatedAt = DateTime.UtcNow;
                existingPractices.UpdatedBy = developmentPractices.UpdatedBy;

                await _context.SaveChangesAsync();
                return Ok(existingPractices);
            }
            else
            {
                // Create new practices
                developmentPractices.AssessmentId = assessmentId;
                developmentPractices.CreatedAt = DateTime.UtcNow;
                developmentPractices.UpdatedAt = DateTime.UtcNow;

                _context.DevelopmentPractices.Add(developmentPractices);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetDevelopmentPractices", new { id = developmentPractices.Id }, developmentPractices);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating/updating development practices for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while saving development practices");
        }
    }

    // DELETE: api/DevelopmentPractices/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDevelopmentPractices(int id)
    {
        try
        {
            var developmentPractices = await _context.DevelopmentPractices.FindAsync(id);
            if (developmentPractices == null)
            {
                return NotFound();
            }

            _context.DevelopmentPractices.Remove(developmentPractices);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting development practices with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting development practices");
        }
    }

    // GET: api/DevelopmentPractices/summary
    [HttpGet("summary")]
    public async Task<ActionResult> GetDevelopmentPracticesSummary()
    {
        try
        {
            var totalPractices = await _context.DevelopmentPractices.CountAsync();
            var methodologies = await _context.DevelopmentPractices
                .GroupBy(dp => dp.PrimaryMethodology)
                .Select(g => new { Methodology = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            var avgTeamSize = await _context.DevelopmentPractices
                .Where(dp => dp.TotalTeamSize > 0)
                .AverageAsync(dp => (double?)dp.TotalTeamSize) ?? 0;

            var summary = new
            {
                TotalAssessments = totalPractices,
                MethodologyDistribution = methodologies,
                AverageTeamSize = Math.Round(avgTeamSize, 1),
                LastUpdated = DateTime.UtcNow
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating development practices summary");
            return StatusCode(500, "An error occurred while generating summary");
        }
    }

    private bool DevelopmentPracticesExists(int id)
    {
        return _context.DevelopmentPractices.Any(e => e.Id == id);
    }
}