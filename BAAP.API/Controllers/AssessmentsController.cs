using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssessmentsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<AssessmentsController> _logger;

    public AssessmentsController(BaapDbContext context, ILogger<AssessmentsController> logger)
    {
        _context = context;
        _logger = logger;
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
            _logger.LogError(ex, "Error retrieving assessments");
            return StatusCode(500, "An error occurred while retrieving assessments");
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

            return CreatedAtAction(nameof(GetAssessment), new { id = assessment.Id }, assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating assessment");
            return StatusCode(500, "An error occurred while creating the assessment");
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

    // PUT: api/assessments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAssessment(int id, Assessment assessment)
    {
        try
        {
            if (id != assessment.Id)
            {
                return BadRequest("Assessment ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(assessment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssessmentExists(id))
                {
                    return NotFound($"Assessment with ID {id} not found");
                }
                throw;
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating assessment with ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while updating the assessment");
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

    private bool AssessmentExists(int id)
    {
        return _context.Assessments.Any(e => e.Id == id);
    }
}