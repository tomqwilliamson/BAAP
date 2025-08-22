using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StakeholdersController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<StakeholdersController> _logger;

    public StakeholdersController(BaapDbContext context, ILogger<StakeholdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/stakeholders/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult> GetStakeholders(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Stakeholders)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            var stakeholders = assessment.Stakeholders.Select(s => new
            {
                id = s.Id,
                name = s.Name,
                role = s.Role,
                department = s.Department,
                email = s.Email,
                influenceLevel = s.InfluenceLevel,
                interestLevel = s.InterestLevel,
                notes = s.Notes
            });

            var summary = new
            {
                total = stakeholders.Count(),
                byRole = stakeholders.GroupBy(s => s.role).ToDictionary(g => g.Key, g => g.Count()),
                byDepartment = stakeholders.GroupBy(s => s.department).ToDictionary(g => g.Key, g => g.Count()),
                highInfluence = stakeholders.Count(s => s.influence == "High")
            };

            return Ok(new
            {
                summary,
                stakeholders
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving stakeholders for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving stakeholders");
        }
    }

    // GET: api/stakeholders/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult> GetStakeholder(int id)
    {
        try
        {
            var stakeholder = await _context.Stakeholders
                .Include(s => s.Assessment)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stakeholder == null)
            {
                return NotFound($"Stakeholder with ID {id} not found");
            }

            var result = new
            {
                id = stakeholder.Id,
                name = stakeholder.Name,
                role = stakeholder.Role,
                department = stakeholder.Department,
                email = stakeholder.Email,
                influenceLevel = stakeholder.InfluenceLevel,
                interestLevel = stakeholder.InterestLevel,
                notes = stakeholder.Notes,
                assessment = new
                {
                    id = stakeholder.Assessment.Id,
                    name = stakeholder.Assessment.Name
                }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving stakeholder with ID {StakeholderId}", id);
            return StatusCode(500, "An error occurred while retrieving the stakeholder");
        }
    }

    // POST: api/stakeholders
    [HttpPost]
    public async Task<ActionResult> CreateStakeholder([FromBody] CreateStakeholderRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId);
            if (!assessmentExists)
            {
                return BadRequest("Assessment not found");
            }

            var stakeholder = new Stakeholder
            {
                Name = request.Name,
                Role = request.Role,
                Department = request.Department ?? "",
                Email = request.Email ?? "",
                InfluenceLevel = request.InfluenceLevel ?? "Medium",
                InterestLevel = request.InterestLevel ?? "Medium",
                Notes = request.Notes ?? "",
                AssessmentId = request.AssessmentId
            };

            _context.Stakeholders.Add(stakeholder);
            await _context.SaveChangesAsync();

            var createdStakeholder = await _context.Stakeholders
                .Include(s => s.Assessment)
                .FirstOrDefaultAsync(s => s.Id == stakeholder.Id);

            return CreatedAtAction(nameof(GetStakeholder), new { id = stakeholder.Id }, createdStakeholder);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating stakeholder");
            return StatusCode(500, "An error occurred while creating the stakeholder");
        }
    }

    // PUT: api/stakeholders/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateStakeholder(int id, [FromBody] UpdateStakeholderRequest request)
    {
        try
        {
            var stakeholder = await _context.Stakeholders.FindAsync(id);
            if (stakeholder == null)
            {
                return NotFound($"Stakeholder with ID {id} not found");
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(request.Name))
                stakeholder.Name = request.Name;
            if (!string.IsNullOrEmpty(request.Role))
                stakeholder.Role = request.Role;
            if (request.Department != null)
                stakeholder.Department = request.Department;
            if (request.Email != null)
                stakeholder.Email = request.Email;
            if (request.InfluenceLevel != null)
                stakeholder.InfluenceLevel = request.InfluenceLevel;
            if (request.InterestLevel != null)
                stakeholder.InterestLevel = request.InterestLevel;
            if (request.Notes != null)
                stakeholder.Notes = request.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating stakeholder with ID {StakeholderId}", id);
            return StatusCode(500, "An error occurred while updating the stakeholder");
        }
    }

    // DELETE: api/stakeholders/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteStakeholder(int id)
    {
        try
        {
            var stakeholder = await _context.Stakeholders.FindAsync(id);
            if (stakeholder == null)
            {
                return NotFound($"Stakeholder with ID {id} not found");
            }

            _context.Stakeholders.Remove(stakeholder);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Stakeholder deleted successfully", id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting stakeholder with ID {StakeholderId}", id);
            return StatusCode(500, "An error occurred while deleting the stakeholder");
        }
    }

    // POST: api/stakeholders/bulk-import
    [HttpPost("bulk-import")]
    public async Task<ActionResult> BulkImportStakeholders([FromBody] BulkImportStakeholdersRequest request)
    {
        try
        {
            if (request.Stakeholders == null || !request.Stakeholders.Any())
            {
                return BadRequest("No stakeholders provided for import");
            }

            var stakeholders = new List<Stakeholder>();
            var errors = new List<string>();

            foreach (var stakeholderRequest in request.Stakeholders)
            {
                try
                {
                    // Validate assessment exists
                    var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == stakeholderRequest.AssessmentId);
                    if (!assessmentExists)
                    {
                        errors.Add($"Assessment not found for stakeholder: {stakeholderRequest.Name}");
                        continue;
                    }

                    var stakeholder = new Stakeholder
                    {
                        Name = stakeholderRequest.Name,
                        Role = stakeholderRequest.Role,
                        Department = stakeholderRequest.Department ?? "",
                        Email = stakeholderRequest.Email ?? "",
                        InfluenceLevel = stakeholderRequest.InfluenceLevel ?? "Medium",
                        InterestLevel = stakeholderRequest.InterestLevel ?? "Medium",
                        Notes = stakeholderRequest.Notes ?? "",
                        AssessmentId = stakeholderRequest.AssessmentId
                    };

                    stakeholders.Add(stakeholder);
                }
                catch (Exception ex)
                {
                    errors.Add($"Error processing stakeholder {stakeholderRequest.Name}: {ex.Message}");
                }
            }

            if (stakeholders.Any())
            {
                _context.Stakeholders.AddRange(stakeholders);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Bulk import completed",
                imported = stakeholders.Count,
                errors = errors.Count,
                errorDetails = errors
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk import of stakeholders");
            return StatusCode(500, "An error occurred during bulk import");
        }
    }
}

public class CreateStakeholderRequest
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? Email { get; set; }
    public string? InfluenceLevel { get; set; } // Low, Medium, High
    public string? InterestLevel { get; set; } // Low, Medium, High
    public string? Notes { get; set; }
    public int AssessmentId { get; set; }
}

public class UpdateStakeholderRequest
{
    public string? Name { get; set; }
    public string? Role { get; set; }
    public string? Department { get; set; }
    public string? Email { get; set; }
    public string? InfluenceLevel { get; set; }
    public string? InterestLevel { get; set; }
    public string? Notes { get; set; }
}

public class BulkImportStakeholdersRequest
{
    public List<CreateStakeholderRequest> Stakeholders { get; set; } = new();
}