using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<RecommendationsController> _logger;

    public RecommendationsController(BaapDbContext context, ILogger<RecommendationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/recommendations/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult> GetRecommendations(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            var recommendations = assessment.Recommendations.Select(r => new
            {
                id = r.Id,
                title = r.Title,
                description = r.Description,
                category = r.Category,
                priority = r.Priority,
                effort = r.Effort,
                estimatedCost = r.EstimatedCost,
                potentialSavings = r.PotentialSavings,
                timeframeWeeks = r.TimeframeWeeks,
                implementation = r.Implementation,
                benefits = r.Benefits,
                risks = r.Risks,
                isAccepted = r.IsAccepted,
                createdDate = r.CreatedDate
            });

            var summary = new
            {
                total = recommendations.Count(),
                byPriority = recommendations.GroupBy(r => r.priority)
                    .ToDictionary(g => g.Key, g => g.Count()),
                byCategory = recommendations.GroupBy(r => r.category)
                    .ToDictionary(g => g.Key, g => g.Count()),
                totalEstimatedCost = recommendations.Sum(r => r.estimatedCost ?? 0),
                totalPotentialSavings = recommendations.Sum(r => r.potentialSavings ?? 0),
                accepted = recommendations.Count(r => r.isAccepted)
            };

            return Ok(new
            {
                summary,
                recommendations
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recommendations for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving recommendations");
        }
    }

    // POST: api/recommendations/assessment/{assessmentId}/generate
    [HttpPost("assessment/{assessmentId}/generate")]
    public async Task<ActionResult> GenerateRecommendations(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.BusinessDrivers)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Simulate AI-powered recommendation generation
            var generatedRecommendations = await GenerateAiRecommendations(assessment);

            // Add new recommendations to database
            _context.Recommendations.AddRange(generatedRecommendations);
            await _context.SaveChangesAsync();

            var result = new
            {
                message = "Recommendations generated successfully",
                generatedCount = generatedRecommendations.Count(),
                recommendations = generatedRecommendations.Select(r => new
                {
                    id = r.Id,
                    title = r.Title,
                    category = r.Category,
                    priority = r.Priority,
                    estimatedCost = r.EstimatedCost,
                    potentialSavings = r.PotentialSavings
                })
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating recommendations for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while generating recommendations");
        }
    }

    // PUT: api/recommendations/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateRecommendation(int id, [FromBody] UpdateRecommendationRequest request)
    {
        try
        {
            var recommendation = await _context.Recommendations.FindAsync(id);
            
            if (recommendation == null)
            {
                return NotFound($"Recommendation with ID {id} not found");
            }

            // Update only the fields provided
            if (request.IsAccepted.HasValue)
                recommendation.IsAccepted = request.IsAccepted.Value;
            
            if (!string.IsNullOrEmpty(request.Priority))
                recommendation.Priority = request.Priority;

            if (request.EstimatedCost.HasValue)
                recommendation.EstimatedCost = request.EstimatedCost.Value;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = recommendation.Id,
                title = recommendation.Title,
                isAccepted = recommendation.IsAccepted,
                priority = recommendation.Priority,
                estimatedCost = recommendation.EstimatedCost
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating recommendation with ID {RecommendationId}", id);
            return StatusCode(500, "An error occurred while updating the recommendation");
        }
    }

    // GET: api/recommendations/comprehensive-analysis/{assessmentId}
    [HttpGet("comprehensive-analysis/{assessmentId}")]
    public async Task<ActionResult> GetComprehensiveAnalysis(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Generate comprehensive analysis similar to your frontend mock data
            var analysis = GenerateComprehensiveAnalysis(assessment);

            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating comprehensive analysis for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while generating comprehensive analysis");
        }
    }

    private async Task<List<Recommendation>> GenerateAiRecommendations(Assessment assessment)
    {
        // Simulate AI analysis delay
        await Task.Delay(1000);

        var recommendations = new List<Recommendation>();
        var random = new Random();

        // Security-based recommendations
        var criticalFindings = assessment.Applications
            .SelectMany(a => a.SecurityFindings)
            .Where(sf => sf.Severity == "Critical")
            .Count();

        if (criticalFindings > 0)
        {
            recommendations.Add(new Recommendation
            {
                Title = "Implement Security Code Review Process",
                Description = "Establish automated security scanning and mandatory code reviews to prevent critical vulnerabilities",
                Category = "Security",
                Priority = "Critical",
                Effort = "Medium",
                EstimatedCost = random.Next(50000, 150000),
                PotentialSavings = random.Next(200000, 500000),
                TimeframeWeeks = random.Next(8, 16),
                AssessmentId = assessment.Id
            });
        }

        // Performance recommendations
        if (assessment.Applications.Any(a => a.ComplexityScore > 80))
        {
            recommendations.Add(new Recommendation
            {
                Title = "Refactor High-Complexity Components",
                Description = "Break down complex modules to improve maintainability and reduce technical debt",
                Category = "Performance",
                Priority = "High",
                Effort = "Large",
                EstimatedCost = random.Next(100000, 200000),
                PotentialSavings = random.Next(300000, 600000),
                TimeframeWeeks = random.Next(12, 20),
                AssessmentId = assessment.Id
            });
        }

        // Cloud readiness recommendations
        var lowCloudReadiness = assessment.Applications
            .Where(a => a.CloudReadinessScore < 70)
            .Count();

        if (lowCloudReadiness > 0)
        {
            recommendations.Add(new Recommendation
            {
                Title = "Cloud-Native Architecture Migration",
                Description = "Modernize applications to leverage cloud-native patterns and services",
                Category = "Modernization",
                Priority = "High",
                Effort = "XLarge",
                EstimatedCost = random.Next(200000, 400000),
                PotentialSavings = random.Next(500000, 1000000),
                TimeframeWeeks = random.Next(20, 32),
                AssessmentId = assessment.Id
            });
        }

        return recommendations;
    }

    private object GenerateComprehensiveAnalysis(Assessment assessment)
    {
        var totalFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count();
        var criticalFindings = assessment.Applications.SelectMany(a => a.SecurityFindings)
            .Count(sf => sf.Severity == "Critical");

        return new
        {
            executiveSummary = new
            {
                overallReadinessScore = assessment.OverallScore,
                totalFindings = totalFindings,
                criticalIssues = criticalFindings,
                estimatedMigrationCost = assessment.EstimatedCost,
                potentialSavings = assessment.PotentialSavings,
                recommendedTimeframe = "12-18 months"
            },
            domainAnalysis = new
            {
                security = new
                {
                    score = assessment.SecurityScore,
                    findings = totalFindings,
                    critical = criticalFindings,
                    recommendations = assessment.Recommendations.Where(r => r.Category == "Security").Count()
                },
                performance = new
                {
                    averageComplexity = assessment.Applications.Any() 
                        ? assessment.Applications.Average(a => a.ComplexityScore) 
                        : 0,
                    recommendations = assessment.Recommendations.Where(r => r.Category == "Performance").Count()
                },
                cloudReadiness = new
                {
                    score = assessment.CloudReadinessScore,
                    readyApplications = assessment.Applications.Count(a => a.CloudReadinessScore >= 80),
                    blockers = assessment.Applications.Count(a => a.CloudReadinessScore < 60)
                }
            },
            recommendations = assessment.Recommendations.GroupBy(r => r.Priority)
                .ToDictionary(g => g.Key.ToLower(), g => g.Select(r => new
                {
                    title = r.Title,
                    category = r.Category,
                    effort = r.Effort,
                    cost = r.EstimatedCost,
                    savings = r.PotentialSavings
                }).ToList())
        };
    }
}

public class UpdateRecommendationRequest
{
    public bool? IsAccepted { get; set; }
    public string? Priority { get; set; }
    public decimal? EstimatedCost { get; set; }
}