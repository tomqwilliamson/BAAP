using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BusinessDriversController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<BusinessDriversController> _logger;

    public BusinessDriversController(BaapDbContext context, ILogger<BusinessDriversController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/businessdrivers/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult> GetBusinessDrivers(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.BusinessDrivers)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            var businessDrivers = assessment.BusinessDrivers.Select(bd => new
            {
                id = bd.Id,
                name = bd.Name,
                description = bd.Description,
                priority = bd.Priority,
                impact = bd.Impact,
                urgency = bd.Urgency,
                businessValue = bd.BusinessValue,
                notes = bd.Notes
            });

            var summary = new
            {
                total = businessDrivers.Count(),
                byPriority = businessDrivers.GroupBy(bd => bd.priority).ToDictionary(g => g.Key, g => g.Count()),
                highPriority = businessDrivers.Count(bd => bd.priority == "High"),
                highImpact = businessDrivers.Count(bd => bd.impact >= 80)
            };

            return Ok(new
            {
                summary,
                businessDrivers
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business drivers for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving business drivers");
        }
    }

    // GET: api/businessdrivers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult> GetBusinessDriver(int id)
    {
        try
        {
            var businessDriver = await _context.BusinessDrivers
                .Include(bd => bd.Assessment)
                .FirstOrDefaultAsync(bd => bd.Id == id);

            if (businessDriver == null)
            {
                return NotFound($"Business driver with ID {id} not found");
            }

            var result = new
            {
                id = businessDriver.Id,
                name = businessDriver.Name,
                description = businessDriver.Description,
                priority = businessDriver.Priority,
                impact = businessDriver.Impact,
                urgency = businessDriver.Urgency,
                businessValue = businessDriver.BusinessValue,
                notes = businessDriver.Notes,
                assessment = new
                {
                    id = businessDriver.Assessment.Id,
                    name = businessDriver.Assessment.Name
                }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business driver with ID {BusinessDriverId}", id);
            return StatusCode(500, "An error occurred while retrieving the business driver");
        }
    }

    // POST: api/businessdrivers
    [HttpPost]
    public async Task<ActionResult> CreateBusinessDriver([FromBody] CreateBusinessDriverRequest request)
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

            var businessDriver = new BusinessDriver
            {
                Name = request.Name,
                Description = request.Description ?? "",
                Priority = request.Priority ?? "Medium",
                Impact = request.Impact ?? 50,
                Urgency = request.Urgency ?? 50,
                BusinessValue = request.BusinessValue ?? "",
                Notes = request.Notes ?? "",
                AssessmentId = request.AssessmentId
            };

            _context.BusinessDrivers.Add(businessDriver);
            await _context.SaveChangesAsync();

            var createdBusinessDriver = await _context.BusinessDrivers
                .Include(bd => bd.Assessment)
                .FirstOrDefaultAsync(bd => bd.Id == businessDriver.Id);

            return CreatedAtAction(nameof(GetBusinessDriver), new { id = businessDriver.Id }, createdBusinessDriver);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating business driver");
            return StatusCode(500, "An error occurred while creating the business driver");
        }
    }

    // PUT: api/businessdrivers/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBusinessDriver(int id, [FromBody] UpdateBusinessDriverRequest request)
    {
        try
        {
            var businessDriver = await _context.BusinessDrivers.FindAsync(id);
            if (businessDriver == null)
            {
                return NotFound($"Business driver with ID {id} not found");
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(request.Name))
                businessDriver.Name = request.Name;
            if (request.Description != null)
                businessDriver.Description = request.Description;
            if (request.Priority != null)
                businessDriver.Priority = request.Priority;
            if (request.Impact.HasValue)
                businessDriver.Impact = request.Impact.Value;
            if (request.Urgency.HasValue)
                businessDriver.Urgency = request.Urgency.Value;
            if (request.BusinessValue != null)
                businessDriver.BusinessValue = request.BusinessValue;
            if (request.Notes != null)
                businessDriver.Notes = request.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business driver with ID {BusinessDriverId}", id);
            return StatusCode(500, "An error occurred while updating the business driver");
        }
    }

    // DELETE: api/businessdrivers/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBusinessDriver(int id)
    {
        try
        {
            var businessDriver = await _context.BusinessDrivers.FindAsync(id);
            if (businessDriver == null)
            {
                return NotFound($"Business driver with ID {id} not found");
            }

            _context.BusinessDrivers.Remove(businessDriver);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Business driver deleted successfully", id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting business driver with ID {BusinessDriverId}", id);
            return StatusCode(500, "An error occurred while deleting the business driver");
        }
    }

    // POST: api/businessdrivers/bulk-import
    [HttpPost("bulk-import")]
    public async Task<ActionResult> BulkImportBusinessDrivers([FromBody] BulkImportBusinessDriversRequest request)
    {
        try
        {
            if (request.BusinessDrivers == null || !request.BusinessDrivers.Any())
            {
                return BadRequest("No business drivers provided for import");
            }

            var businessDrivers = new List<BusinessDriver>();
            var errors = new List<string>();

            foreach (var bdRequest in request.BusinessDrivers)
            {
                try
                {
                    // Validate assessment exists
                    var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == bdRequest.AssessmentId);
                    if (!assessmentExists)
                    {
                        errors.Add($"Assessment not found for business driver: {bdRequest.Name}");
                        continue;
                    }

                    var businessDriver = new BusinessDriver
                    {
                        Name = bdRequest.Name,
                        Description = bdRequest.Description ?? "",
                        Category = bdRequest.Category ?? "General",
                        Priority = bdRequest.Priority ?? "Medium",
                        Impact = bdRequest.Impact ?? "Medium",
                        Timeframe = bdRequest.Timeframe ?? "",
                        SuccessCriteria = bdRequest.SuccessCriteria ?? "",
                        Notes = bdRequest.Notes ?? "",
                        AssessmentId = bdRequest.AssessmentId
                    };

                    businessDrivers.Add(businessDriver);
                }
                catch (Exception ex)
                {
                    errors.Add($"Error processing business driver {bdRequest.Name}: {ex.Message}");
                }
            }

            if (businessDrivers.Any())
            {
                _context.BusinessDrivers.AddRange(businessDrivers);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Bulk import completed",
                imported = businessDrivers.Count,
                errors = errors.Count,
                errorDetails = errors
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk import of business drivers");
            return StatusCode(500, "An error occurred during bulk import");
        }
    }

    // GET: api/businessdrivers/templates
    [HttpGet("templates")]
    public ActionResult GetBusinessDriverTemplates()
    {
        try
        {
            var templates = new[]
            {
                new
                {
                    category = "Cost Reduction",
                    drivers = new[]
                    {
                        new { name = "Reduce Infrastructure Costs", description = "Lower operational expenses through cloud migration", priority = "High", impact = "High" },
                        new { name = "Optimize License Costs", description = "Consolidate and optimize software licensing", priority = "Medium", impact = "Medium" }
                    }
                },
                new
                {
                    category = "Digital Transformation",
                    drivers = new[]
                    {
                        new { name = "Modernize Legacy Systems", description = "Update aging technology infrastructure", priority = "High", impact = "Critical" },
                        new { name = "Improve Agility", description = "Increase speed of software delivery", priority = "High", impact = "High" }
                    }
                },
                new
                {
                    category = "Compliance & Security",
                    drivers = new[]
                    {
                        new { name = "Regulatory Compliance", description = "Meet industry regulatory requirements", priority = "Critical", impact = "Critical" },
                        new { name = "Enhanced Security", description = "Improve overall security posture", priority = "High", impact = "High" }
                    }
                },
                new
                {
                    category = "Business Growth",
                    drivers = new[]
                    {
                        new { name = "Scalability", description = "Support business growth and expansion", priority = "Medium", impact = "High" },
                        new { name = "Market Competitiveness", description = "Stay competitive in the market", priority = "High", impact = "Medium" }
                    }
                }
            };

            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business driver templates");
            return StatusCode(500, "An error occurred while retrieving templates");
        }
    }
}

public class CreateBusinessDriverRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Priority { get; set; } // Low, Medium, High, Critical
    public int? Impact { get; set; } // 0-100
    public int? Urgency { get; set; } // 0-100
    public string? BusinessValue { get; set; }
    public string? Notes { get; set; }
    public int AssessmentId { get; set; }
}

public class UpdateBusinessDriverRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public int? Impact { get; set; }
    public int? Urgency { get; set; }
    public string? BusinessValue { get; set; }
    public string? Notes { get; set; }
}

public class BulkImportBusinessDriversRequest
{
    public List<CreateBusinessDriverRequest> BusinessDrivers { get; set; } = new();
}