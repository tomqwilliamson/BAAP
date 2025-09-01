using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/business-drivers")]
//[Authorize]
public class BusinessDriversController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<BusinessDriversController> _logger;

    public BusinessDriversController(BaapDbContext context, ILogger<BusinessDriversController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/business-drivers/assessment/{assessmentId}
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
                businessValue = bd.BusinessValue
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

    // PUT: api/business-drivers/assessment/{assessmentId}/update
    [HttpPut("assessment/{assessmentId}/update")]
    public async Task<ActionResult> UpdateBusinessDrivers(int assessmentId, [FromBody] UpdateBusinessDriversRequest request)
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

            // Remove existing business drivers
            _context.BusinessDrivers.RemoveRange(assessment.BusinessDrivers);

            // Add new business drivers
            var newBusinessDrivers = request.BusinessDrivers.Select(bd => new BusinessDriver
            {
                Name = bd.Name,
                Description = bd.Description ?? "",
                Priority = bd.Priority,
                Impact = bd.Impact,
                Urgency = bd.Urgency,
                BusinessValue = bd.BusinessValue ?? "",
                AssessmentId = assessmentId
            }).ToList();

            assessment.BusinessDrivers = newBusinessDrivers;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Business drivers updated successfully",
                businessDrivers = newBusinessDrivers.Select(bd => new
                {
                    id = bd.Id,
                    name = bd.Name,
                    description = bd.Description,
                    priority = bd.Priority,
                    impact = bd.Impact,
                    urgency = bd.Urgency,
                    businessValue = bd.BusinessValue
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business drivers for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating business drivers");
        }
    }

    // PUT: api/business-drivers/assessment/{assessmentId} - UI expects this specific route
    [HttpPut("assessment/{assessmentId}")]
    public async Task<ActionResult> UpdateBusinessDriversForUI(int assessmentId, [FromBody] UpdateBusinessDriversRequest request)
    {
        // Delegate to the existing method to avoid code duplication
        return await UpdateBusinessDrivers(assessmentId, request);
    }

    // GET: api/business-drivers/{id}
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

    // POST: api/business-drivers
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

    // PUT: api/business-drivers/{id}
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

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business driver with ID {BusinessDriverId}", id);
            return StatusCode(500, "An error occurred while updating the business driver");
        }
    }

    // DELETE: api/business-drivers/{id}
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

    // POST: api/business-drivers/bulk-import
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
                        Priority = bdRequest.Priority ?? "Medium",
                        Impact = bdRequest.Impact ?? 50,
                        Urgency = bdRequest.Urgency ?? 50,
                        BusinessValue = bdRequest.BusinessValue ?? "",
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

    // PUT: api/business-drivers/assessment/{assessmentId}/replace
    [HttpPut("assessment/{assessmentId}/replace")]
    public async Task<ActionResult> UpdateAssessmentBusinessDrivers(int assessmentId, [FromBody] UpdateAssessmentBusinessDriversRequest request)
    {
        try
        {
            // Validate assessment exists
            var assessment = await _context.Assessments
                .Include(a => a.BusinessDrivers)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Remove existing business drivers for this assessment
            _context.BusinessDrivers.RemoveRange(assessment.BusinessDrivers);

            // Add new business drivers
            if (request.BusinessDrivers != null && request.BusinessDrivers.Any())
            {
                var newBusinessDrivers = request.BusinessDrivers.Select(bd => new BusinessDriver
                {
                    Name = bd.Name,
                    Description = bd.Description ?? "",
                    Priority = bd.Priority ?? "Medium",
                    Impact = bd.Impact ?? 50,
                    Urgency = bd.Urgency ?? 50,
                    BusinessValue = bd.BusinessValue ?? "",
                    AssessmentId = assessmentId
                }).ToList();

                _context.BusinessDrivers.AddRange(newBusinessDrivers);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Business drivers updated successfully",
                assessmentId = assessmentId,
                count = request.BusinessDrivers?.Count ?? 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business drivers for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating business drivers");
        }
    }

    // PUT: api/business-drivers/context/{assessmentId}
    [HttpPut("context/{assessmentId}")]
    public async Task<ActionResult> UpdateBusinessContext(int assessmentId, [FromBody] UpdateBusinessContextRequest request)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(assessmentId);
            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            assessment.BusinessContext = request.BusinessContext;
            assessment.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Business context updated successfully",
                assessmentId = assessmentId,
                businessContext = assessment.BusinessContext
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business context for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating business context");
        }
    }

    // GET: api/business-drivers/context/{assessmentId}
    [HttpGet("context/{assessmentId}")]
    public async Task<ActionResult> GetBusinessContext(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Where(a => a.Id == assessmentId)
                .Select(a => new { 
                    id = a.Id, 
                    name = a.Name, 
                    businessContext = "Temporarily disabled" // a.BusinessContext 
                })
                .FirstOrDefaultAsync();

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            return Ok(assessment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business context for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving business context");
        }
    }

    // GET: api/business-drivers/templates
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
}

public class BulkImportBusinessDriversRequest
{
    public List<CreateBusinessDriverRequest> BusinessDrivers { get; set; } = new();
}

public class UpdateAssessmentBusinessDriversRequest
{
    public List<BusinessDriverData> BusinessDrivers { get; set; } = new();
}

public class BusinessDriverData
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public int? Impact { get; set; }
    public int? Urgency { get; set; }
    public string? BusinessValue { get; set; }
}

public class UpdateBusinessContextRequest
{
    public string? BusinessContext { get; set; }
}