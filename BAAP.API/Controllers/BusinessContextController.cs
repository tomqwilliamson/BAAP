using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessContextController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<BusinessContextController> _logger;

    public BusinessContextController(BaapDbContext context, ILogger<BusinessContextController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/businesscontext/{assessmentId}
    [HttpGet("{assessmentId}")]
    public async Task<ActionResult> GetBusinessContext(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments.FindAsync(assessmentId);
            if (assessment == null)
            {
                return NotFound("Assessment not found");
            }

            var businessContext = new
            {
                ProjectInfo = new
                {
                    Name = assessment.Name,
                    Description = assessment.Description,
                    Duration = assessment.Timeline,
                    TotalBudget = assessment.Budget?.ToString("C") ?? ""
                },
                BudgetAllocation = await _context.BudgetAllocations
                    .Where(ba => ba.AssessmentId == assessmentId)
                    .FirstOrDefaultAsync(),
                BusinessDrivers = await _context.BusinessDrivers
                    .Where(bd => bd.AssessmentId == assessmentId)
                    .ToListAsync(),
                Stakeholders = await _context.Stakeholders
                    .Where(s => s.AssessmentId == assessmentId)
                    .ToListAsync(),
                ProjectTimeline = await _context.ProjectTimelineItems
                    .Where(pti => pti.AssessmentId == assessmentId)
                    .OrderBy(pti => pti.StartDate)
                    .ToListAsync(),
                Risks = await _context.BusinessContextRisks
                    .Where(bcr => bcr.AssessmentId == assessmentId)
                    .ToListAsync()
            };

            return Ok(businessContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business context for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving business context");
        }
    }

    // Budget Allocation CRUD Operations
    
    // GET: api/businesscontext/{assessmentId}/budget
    [HttpGet("{assessmentId}/budget")]
    public async Task<ActionResult> GetBudgetAllocation(int assessmentId)
    {
        try
        {
            var budgetAllocation = await _context.BudgetAllocations
                .FirstOrDefaultAsync(ba => ba.AssessmentId == assessmentId);

            if (budgetAllocation == null)
            {
                // Return default/empty budget allocation
                return Ok(new BudgetAllocation 
                { 
                    AssessmentId = assessmentId,
                    AssessmentCost = 0,
                    Implementation = 0,
                    Maintenance = 0,
                    Training = 0,
                    Contingency = 0
                });
            }

            return Ok(budgetAllocation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving budget allocation for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving budget allocation");
        }
    }

    // POST: api/businesscontext/{assessmentId}/budget
    [HttpPost("{assessmentId}/budget")]
    public async Task<ActionResult> CreateBudgetAllocation(int assessmentId, [FromBody] BudgetAllocationRequest request)
    {
        try
        {
            // Check if assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return NotFound("Assessment not found");
            }

            // Check if budget allocation already exists
            var existing = await _context.BudgetAllocations
                .FirstOrDefaultAsync(ba => ba.AssessmentId == assessmentId);

            if (existing != null)
            {
                return Conflict("Budget allocation already exists for this assessment. Use PUT to update.");
            }

            var budgetAllocation = new BudgetAllocation
            {
                AssessmentId = assessmentId,
                AssessmentCost = request.AssessmentCost,
                Implementation = request.Implementation,
                Maintenance = request.Maintenance,
                Training = request.Training,
                Contingency = request.Contingency,
                Notes = request.Notes
            };

            _context.BudgetAllocations.Add(budgetAllocation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBudgetAllocation), new { assessmentId }, budgetAllocation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating budget allocation for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while creating budget allocation");
        }
    }

    // PUT: api/businesscontext/{assessmentId}/budget
    [HttpPut("{assessmentId}/budget")]
    public async Task<ActionResult> UpdateBudgetAllocation(int assessmentId, [FromBody] BudgetAllocationRequest request)
    {
        try
        {
            var budgetAllocation = await _context.BudgetAllocations
                .FirstOrDefaultAsync(ba => ba.AssessmentId == assessmentId);

            if (budgetAllocation == null)
            {
                // Create if doesn't exist
                return await CreateBudgetAllocation(assessmentId, request);
            }

            budgetAllocation.AssessmentCost = request.AssessmentCost;
            budgetAllocation.Implementation = request.Implementation;
            budgetAllocation.Maintenance = request.Maintenance;
            budgetAllocation.Training = request.Training;
            budgetAllocation.Contingency = request.Contingency;
            budgetAllocation.Notes = request.Notes;
            budgetAllocation.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(budgetAllocation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating budget allocation for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating budget allocation");
        }
    }

    // Timeline CRUD Operations

    // GET: api/businesscontext/{assessmentId}/timeline
    [HttpGet("{assessmentId}/timeline")]
    public async Task<ActionResult> GetProjectTimeline(int assessmentId)
    {
        try
        {
            var timeline = await _context.ProjectTimelineItems
                .Where(pti => pti.AssessmentId == assessmentId)
                .OrderBy(pti => pti.StartDate)
                .ToListAsync();

            return Ok(timeline);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project timeline for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving project timeline");
        }
    }

    // POST: api/businesscontext/{assessmentId}/timeline
    [HttpPost("{assessmentId}/timeline")]
    public async Task<ActionResult> CreateTimelineItem(int assessmentId, [FromBody] ProjectTimelineItemRequest request)
    {
        try
        {
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return NotFound("Assessment not found");
            }

            var timelineItem = new ProjectTimelineItem
            {
                AssessmentId = assessmentId,
                Phase = request.Phase,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Progress = request.Progress,
                Status = request.Status ?? "Not Started",
                Dependencies = request.Dependencies,
                Owner = request.Owner,
                Notes = request.Notes
            };

            _context.ProjectTimelineItems.Add(timelineItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectTimeline), new { assessmentId }, timelineItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating timeline item for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while creating timeline item");
        }
    }

    // PUT: api/businesscontext/timeline/{id}
    [HttpPut("timeline/{id}")]
    public async Task<ActionResult> UpdateTimelineItem(int id, [FromBody] ProjectTimelineItemRequest request)
    {
        try
        {
            var timelineItem = await _context.ProjectTimelineItems.FindAsync(id);
            if (timelineItem == null)
            {
                return NotFound("Timeline item not found");
            }

            timelineItem.Phase = request.Phase;
            timelineItem.Description = request.Description;
            timelineItem.StartDate = request.StartDate;
            timelineItem.EndDate = request.EndDate;
            timelineItem.Progress = request.Progress;
            timelineItem.Status = request.Status ?? timelineItem.Status;
            timelineItem.Dependencies = request.Dependencies;
            timelineItem.Owner = request.Owner;
            timelineItem.Notes = request.Notes;
            timelineItem.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(timelineItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating timeline item {Id}", id);
            return StatusCode(500, "An error occurred while updating timeline item");
        }
    }

    // DELETE: api/businesscontext/timeline/{id}
    [HttpDelete("timeline/{id}")]
    public async Task<ActionResult> DeleteTimelineItem(int id)
    {
        try
        {
            var timelineItem = await _context.ProjectTimelineItems.FindAsync(id);
            if (timelineItem == null)
            {
                return NotFound("Timeline item not found");
            }

            _context.ProjectTimelineItems.Remove(timelineItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Timeline item deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting timeline item {Id}", id);
            return StatusCode(500, "An error occurred while deleting timeline item");
        }
    }

    // Risk CRUD Operations

    // GET: api/businesscontext/{assessmentId}/risks
    [HttpGet("{assessmentId}/risks")]
    public async Task<ActionResult> GetBusinessRisks(int assessmentId)
    {
        try
        {
            var risks = await _context.BusinessContextRisks
                .Where(bcr => bcr.AssessmentId == assessmentId)
                .OrderByDescending(bcr => bcr.RiskScore)
                .ToListAsync();

            return Ok(risks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving business risks for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving business risks");
        }
    }

    // POST: api/businesscontext/{assessmentId}/risks
    [HttpPost("{assessmentId}/risks")]
    public async Task<ActionResult> CreateBusinessRisk(int assessmentId, [FromBody] BusinessRiskRequest request)
    {
        try
        {
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return NotFound("Assessment not found");
            }

            var risk = new BusinessContextRisk
            {
                AssessmentId = assessmentId,
                Name = request.Name,
                Description = request.Description,
                Category = request.Category,
                Probability = request.Probability,
                Impact = request.Impact,
                RiskScore = CalculateRiskScore(request.Probability, request.Impact),
                Mitigation = request.Mitigation,
                Owner = request.Owner,
                Status = request.Status ?? "Open",
                DueDate = request.DueDate
            };

            _context.BusinessContextRisks.Add(risk);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusinessRisks), new { assessmentId }, risk);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating business risk for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while creating business risk");
        }
    }

    // PUT: api/businesscontext/risks/{id}
    [HttpPut("risks/{id}")]
    public async Task<ActionResult> UpdateBusinessRisk(int id, [FromBody] BusinessRiskRequest request)
    {
        try
        {
            var risk = await _context.BusinessContextRisks.FindAsync(id);
            if (risk == null)
            {
                return NotFound("Business risk not found");
            }

            risk.Name = request.Name;
            risk.Description = request.Description;
            risk.Category = request.Category;
            risk.Probability = request.Probability;
            risk.Impact = request.Impact;
            risk.RiskScore = CalculateRiskScore(request.Probability, request.Impact);
            risk.Mitigation = request.Mitigation;
            risk.Owner = request.Owner;
            risk.Status = request.Status ?? risk.Status;
            risk.DueDate = request.DueDate;
            risk.LastModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(risk);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating business risk {Id}", id);
            return StatusCode(500, "An error occurred while updating business risk");
        }
    }

    // DELETE: api/businesscontext/risks/{id}
    [HttpDelete("risks/{id}")]
    public async Task<ActionResult> DeleteBusinessRisk(int id)
    {
        try
        {
            var risk = await _context.BusinessContextRisks.FindAsync(id);
            if (risk == null)
            {
                return NotFound("Business risk not found");
            }

            _context.BusinessContextRisks.Remove(risk);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Business risk deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting business risk {Id}", id);
            return StatusCode(500, "An error occurred while deleting business risk");
        }
    }

    private int CalculateRiskScore(string probability, string impact)
    {
        var probValue = probability.ToLower() switch
        {
            "low" => 1,
            "medium" => 3,
            "high" => 5,
            _ => 1
        };

        var impactValue = impact.ToLower() switch
        {
            "low" => 1,
            "medium" => 3,
            "high" => 5,
            _ => 1
        };

        return probValue * impactValue;
    }
}

// Request DTOs
public class BudgetAllocationRequest
{
    public decimal AssessmentCost { get; set; }
    public decimal Implementation { get; set; }
    public decimal Maintenance { get; set; }
    public decimal Training { get; set; }
    public decimal Contingency { get; set; }
    public string? Notes { get; set; }
}

public class ProjectTimelineItemRequest
{
    public string Phase { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Progress { get; set; }
    public string? Status { get; set; }
    public string? Dependencies { get; set; }
    public string? Owner { get; set; }
    public string? Notes { get; set; }
}

public class BusinessRiskRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Probability { get; set; } = string.Empty;
    public string Impact { get; set; } = string.Empty;
    public string? Mitigation { get; set; }
    public string? Owner { get; set; }
    public string? Status { get; set; }
    public DateTime? DueDate { get; set; }
}