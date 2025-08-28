using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class SearchController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<SearchController> _logger;

    public SearchController(BaapDbContext context, ILogger<SearchController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/search
    [HttpGet]
    public async Task<ActionResult> GlobalSearch(
        [FromQuery] string query,
        [FromQuery] string[]? types = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                return BadRequest("Search query must be at least 2 characters long");
            }

            var results = new List<object>();
            var searchTypes = types?.ToList() ?? new List<string> { "assessments", "applications", "stakeholders", "businessdrivers", "recommendations", "securityfindings" };

            // Search Assessments
            if (searchTypes.Contains("assessments"))
            {
                var assessments = await _context.Assessments
                    .Where(a => a.Name.Contains(query) || 
                               (a.Description != null && a.Description.Contains(query)) ||
                               (a.BusinessObjective != null && a.BusinessObjective.Contains(query)))
                    .Select(a => new
                    {
                        type = "assessment",
                        id = a.Id,
                        title = a.Name,
                        description = a.Description,
                        status = a.Status,
                        createdDate = a.CreatedDate,
                        overallScore = a.OverallScore,
                        url = $"/assessments/{a.Id}"
                    })
                    .ToListAsync();

                results.AddRange(assessments);
            }

            // Search Applications
            if (searchTypes.Contains("applications"))
            {
                var applications = await _context.Applications
                    .Include(app => app.Assessment)
                    .Where(app => app.Name.Contains(query) || 
                                 (app.Description != null && app.Description.Contains(query)) ||
                                 app.Technology.Contains(query) ||
                                 app.Type.Contains(query))
                    .Select(app => new
                    {
                        type = "application",
                        id = app.Id,
                        title = app.Name,
                        description = app.Description,
                        technology = app.Technology,
                        appType = app.Type,
                        complexityScore = app.ComplexityScore,
                        securityRating = app.SecurityRating,
                        cloudReadinessScore = app.CloudReadinessScore,
                        assessmentName = app.Assessment != null ? app.Assessment.Name : null,
                        url = $"/applications/{app.Id}"
                    })
                    .ToListAsync();

                results.AddRange(applications);
            }

            // Search Stakeholders
            if (searchTypes.Contains("stakeholders"))
            {
                var stakeholders = await _context.Stakeholders
                    .Include(s => s.Assessment)
                    .Where(s => s.Name.Contains(query) || 
                               (s.Role != null && s.Role.Contains(query)) ||
                               (s.Department != null && s.Department.Contains(query)) ||
                               (s.Email != null && s.Email.Contains(query)))
                    .Select(s => new
                    {
                        type = "stakeholder",
                        id = s.Id,
                        title = s.Name,
                        description = $"{s.Role} - {s.Department}",
                        role = s.Role,
                        department = s.Department,
                        email = s.Email,
                        influenceLevel = s.InfluenceLevel,
                        assessmentName = s.Assessment.Name,
                        url = $"/stakeholders/{s.Id}"
                    })
                    .ToListAsync();

                results.AddRange(stakeholders);
            }

            // Search Business Drivers
            if (searchTypes.Contains("businessdrivers"))
            {
                var businessDrivers = await _context.BusinessDrivers
                    .Include(bd => bd.Assessment)
                    .Where(bd => bd.Name.Contains(query) || 
                                (bd.Description != null && bd.Description.Contains(query)))
                    .Select(bd => new
                    {
                        type = "businessdriver",
                        id = bd.Id,
                        title = bd.Name,
                        description = bd.Description,
                        priority = bd.Priority,
                        impact = bd.Impact,
                        urgency = bd.Urgency,
                        assessmentName = bd.Assessment.Name,
                        url = $"/businessdrivers/{bd.Id}"
                    })
                    .ToListAsync();

                results.AddRange(businessDrivers);
            }

            // Search Recommendations
            if (searchTypes.Contains("recommendations"))
            {
                var recommendations = await _context.Recommendations
                    .Include(r => r.Assessment)
                    .Where(r => r.Title.Contains(query) || 
                               (r.Description != null && r.Description.Contains(query)) ||
                               (r.Category != null && r.Category.Contains(query)))
                    .Select(r => new
                    {
                        type = "recommendation",
                        id = r.Id,
                        title = r.Title,
                        description = r.Description,
                        category = r.Category,
                        priority = r.Priority,
                        effort = r.Effort,
                        estimatedCost = r.EstimatedCost,
                        potentialSavings = r.PotentialSavings,
                        isAccepted = r.IsAccepted,
                        assessmentName = r.Assessment.Name,
                        url = $"/recommendations/{r.Id}"
                    })
                    .ToListAsync();

                results.AddRange(recommendations);
            }

            // Search Security Findings
            if (searchTypes.Contains("securityfindings"))
            {
                var securityFindings = await _context.SecurityFindings
                    .Include(sf => sf.Application)
                    .Where(sf => sf.Title.Contains(query) || 
                                (sf.Description != null && sf.Description.Contains(query)) ||
                                (sf.Category != null && sf.Category.Contains(query)))
                    .Select(sf => new
                    {
                        type = "securityfinding",
                        id = sf.Id,
                        title = sf.Title,
                        description = sf.Description,
                        severity = sf.Severity,
                        category = sf.Category,
                        fileName = sf.FileName,
                        isResolved = sf.IsResolved,
                        applicationName = sf.Application.Name,
                        url = $"/security/findings/{sf.Id}"
                    })
                    .ToListAsync();

                results.AddRange(securityFindings);
            }

            // Apply pagination
            var totalCount = results.Count;
            var paginatedResults = results
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Group results by type for better presentation
            var groupedResults = paginatedResults
                .GroupBy(r => ((dynamic)r).type)
                .ToDictionary(g => g.Key, g => g.ToList());

            return Ok(new
            {
                query,
                results = new
                {
                    data = paginatedResults,
                    groupedByType = groupedResults,
                    pagination = new
                    {
                        page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                        hasNext = page * pageSize < totalCount,
                        hasPrevious = page > 1
                    }
                },
                summary = new
                {
                    totalResults = totalCount,
                    resultsByType = results.GroupBy(r => ((dynamic)r).type).ToDictionary(g => g.Key, g => g.Count())
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing global search for query: {Query}", query);
            return StatusCode(500, "An error occurred while performing the search");
        }
    }

    // GET: api/search/applications
    [HttpGet("applications")]
    public async Task<ActionResult> SearchApplications(
        [FromQuery] string? query = null,
        [FromQuery] string? type = null,
        [FromQuery] string? technology = null,
        [FromQuery] string? category = null,
        [FromQuery] int? minComplexity = null,
        [FromQuery] int? maxComplexity = null,
        [FromQuery] int? minSecurityRating = null,
        [FromQuery] int? minCloudReadiness = null,
        [FromQuery] int? assessmentId = null,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortOrder = "asc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var queryable = _context.Applications
                .Include(app => app.Assessment)
                .Include(app => app.SecurityFindings)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(query))
            {
                queryable = queryable.Where(app => 
                    app.Name.Contains(query) || 
                    (app.Description != null && app.Description.Contains(query)) ||
                    app.Technology.Contains(query));
            }

            if (!string.IsNullOrEmpty(type))
            {
                queryable = queryable.Where(app => app.Type == type);
            }

            if (!string.IsNullOrEmpty(technology))
            {
                queryable = queryable.Where(app => app.Technology.Contains(technology));
            }

            if (!string.IsNullOrEmpty(category))
            {
                queryable = queryable.Where(app => app.Category == category);
            }

            if (minComplexity.HasValue)
            {
                queryable = queryable.Where(app => app.ComplexityScore >= minComplexity.Value);
            }

            if (maxComplexity.HasValue)
            {
                queryable = queryable.Where(app => app.ComplexityScore <= maxComplexity.Value);
            }

            if (minSecurityRating.HasValue)
            {
                queryable = queryable.Where(app => app.SecurityRating >= minSecurityRating.Value);
            }

            if (minCloudReadiness.HasValue)
            {
                queryable = queryable.Where(app => app.CloudReadinessScore >= minCloudReadiness.Value);
            }

            if (assessmentId.HasValue)
            {
                queryable = queryable.Where(app => app.AssessmentId == assessmentId.Value);
            }

            // Apply sorting
            queryable = sortBy.ToLower() switch
            {
                "name" => sortOrder.ToLower() == "desc" 
                    ? queryable.OrderByDescending(app => app.Name)
                    : queryable.OrderBy(app => app.Name),
                "type" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(app => app.Type)
                    : queryable.OrderBy(app => app.Type),
                "complexity" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(app => app.ComplexityScore)
                    : queryable.OrderBy(app => app.ComplexityScore),
                "security" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(app => app.SecurityRating)
                    : queryable.OrderBy(app => app.SecurityRating),
                "cloudreadiness" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(app => app.CloudReadinessScore)
                    : queryable.OrderBy(app => app.CloudReadinessScore),
                "created" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(app => app.CreatedDate)
                    : queryable.OrderBy(app => app.CreatedDate),
                _ => queryable.OrderBy(app => app.Name)
            };

            var totalCount = await queryable.CountAsync();
            var applications = await queryable
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(app => new
                {
                    id = app.Id,
                    name = app.Name,
                    description = app.Description,
                    type = app.Type,
                    category = app.Category,
                    technology = app.Technology,
                    linesOfCode = app.LinesOfCode,
                    complexityScore = app.ComplexityScore,
                    securityRating = app.SecurityRating,
                    cloudReadinessScore = app.CloudReadinessScore,
                    estimatedMigrationCost = app.EstimatedMigrationCost,
                    monthlyCost = app.MonthlyCost,
                    lastAnalyzed = app.LastAnalyzedDate,
                    securityFindings = app.SecurityFindings.Count,
                    criticalFindings = app.SecurityFindings.Count(sf => sf.Severity == "Critical"),
                    assessment = app.Assessment == null ? null : new
                    {
                        id = app.Assessment.Id,
                        name = app.Assessment.Name
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
                },
                filters = new
                {
                    query,
                    type,
                    technology,
                    category,
                    minComplexity,
                    maxComplexity,
                    minSecurityRating,
                    minCloudReadiness,
                    assessmentId,
                    sortBy,
                    sortOrder
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching applications");
            return StatusCode(500, "An error occurred while searching applications");
        }
    }

    // GET: api/search/assessments
    [HttpGet("assessments")]
    public async Task<ActionResult> SearchAssessments(
        [FromQuery] string? query = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? createdAfter = null,
        [FromQuery] DateTime? createdBefore = null,
        [FromQuery] int? minScore = null,
        [FromQuery] int? maxScore = null,
        [FromQuery] string sortBy = "created",
        [FromQuery] string sortOrder = "desc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var queryable = _context.Assessments
                .Include(a => a.Applications)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(query))
            {
                queryable = queryable.Where(a => 
                    a.Name.Contains(query) || 
                    (a.Description != null && a.Description.Contains(query)) ||
                    (a.BusinessObjective != null && a.BusinessObjective.Contains(query)));
            }

            if (!string.IsNullOrEmpty(status))
            {
                queryable = queryable.Where(a => a.Status == status);
            }

            if (createdAfter.HasValue)
            {
                queryable = queryable.Where(a => a.CreatedDate >= createdAfter.Value);
            }

            if (createdBefore.HasValue)
            {
                queryable = queryable.Where(a => a.CreatedDate <= createdBefore.Value);
            }

            if (minScore.HasValue)
            {
                queryable = queryable.Where(a => a.OverallScore >= minScore.Value);
            }

            if (maxScore.HasValue)
            {
                queryable = queryable.Where(a => a.OverallScore <= maxScore.Value);
            }

            // Apply sorting
            queryable = sortBy.ToLower() switch
            {
                "name" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(a => a.Name)
                    : queryable.OrderBy(a => a.Name),
                "status" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(a => a.Status)
                    : queryable.OrderBy(a => a.Status),
                "score" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(a => a.OverallScore)
                    : queryable.OrderBy(a => a.OverallScore),
                "created" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(a => a.CreatedDate)
                    : queryable.OrderBy(a => a.CreatedDate),
                "completed" => sortOrder.ToLower() == "desc"
                    ? queryable.OrderByDescending(a => a.CompletedDate)
                    : queryable.OrderBy(a => a.CompletedDate),
                _ => queryable.OrderByDescending(a => a.CreatedDate)
            };

            var totalCount = await queryable.CountAsync();
            var assessments = await queryable
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    id = a.Id,
                    name = a.Name,
                    description = a.Description,
                    status = a.Status,
                    overallScore = a.OverallScore,
                    createdDate = a.CreatedDate,
                    startedDate = a.StartedDate,
                    completedDate = a.CompletedDate,
                    estimatedCost = a.EstimatedCost,
                    potentialSavings = a.PotentialSavings,
                    applicationCount = a.Applications.Count,
                    stakeholderCount = a.Stakeholders.Count,
                    businessDriverCount = a.BusinessDrivers.Count,
                    recommendationCount = a.Recommendations.Count
                })
                .ToListAsync();

            return Ok(new
            {
                data = assessments,
                pagination = new
                {
                    page,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    hasNext = page * pageSize < totalCount,
                    hasPrevious = page > 1
                },
                filters = new
                {
                    query,
                    status,
                    createdAfter,
                    createdBefore,
                    minScore,
                    maxScore,
                    sortBy,
                    sortOrder
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching assessments");
            return StatusCode(500, "An error occurred while searching assessments");
        }
    }

    // GET: api/search/suggestions
    [HttpGet("suggestions")]
    public async Task<ActionResult> GetSearchSuggestions([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                return Ok(new { suggestions = Array.Empty<object>() });
            }

            var suggestions = new List<object>();

            // Assessment name suggestions
            var assessmentNames = await _context.Assessments
                .Where(a => a.Name.Contains(query))
                .Take(5)
                .Select(a => new { type = "assessment", value = a.Name, id = a.Id })
                .ToListAsync();
            suggestions.AddRange(assessmentNames);

            // Application name suggestions
            var applicationNames = await _context.Applications
                .Where(app => app.Name.Contains(query))
                .Take(5)
                .Select(app => new { type = "application", value = app.Name, id = app.Id })
                .ToListAsync();
            suggestions.AddRange(applicationNames);

            // Technology suggestions
            var technologies = await _context.Applications
                .Where(app => app.Technology.Contains(query))
                .Select(app => app.Technology)
                .Distinct()
                .Take(3)
                .Select(tech => new { type = "technology", value = tech, id = (int?)null })
                .ToListAsync();
            suggestions.AddRange(technologies);

            // Stakeholder name suggestions
            var stakeholderNames = await _context.Stakeholders
                .Where(s => s.Name.Contains(query))
                .Take(3)
                .Select(s => new { type = "stakeholder", value = s.Name, id = s.Id })
                .ToListAsync();
            suggestions.AddRange(stakeholderNames);

            return Ok(new
            {
                query,
                suggestions = suggestions.Take(10).ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting search suggestions for query: {Query}", query);
            return StatusCode(500, "An error occurred while getting search suggestions");
        }
    }
}