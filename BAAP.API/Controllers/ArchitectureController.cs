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
public class ArchitectureController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<ArchitectureController> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public ArchitectureController(
        BaapDbContext context,
        ILogger<ArchitectureController> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    // GET: api/architecture/assessment/{assessmentId}
    [HttpGet("assessment/{assessmentId}")]
    public async Task<ActionResult<ArchitectureReviewDto>> GetArchitectureReview(int assessmentId)
    {
        try
        {
            var architectureReview = await _context.ArchitectureReviews
                .Include(ar => ar.ArchitecturePatterns)
                .Include(ar => ar.TechnologyStacks)
                .Include(ar => ar.Assessment)
                .FirstOrDefaultAsync(ar => ar.AssessmentId == assessmentId);

            if (architectureReview == null)
            {
                return NotFound($"Architecture review not found for assessment ID: {assessmentId}");
            }

            var codebaseStats = await _context.CodebaseStats
                .Where(cs => cs.ArchitectureReviewId == architectureReview.Id)
                .ToListAsync();

            var dto = MapToDto(architectureReview, codebaseStats);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving architecture review for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving the architecture review");
        }
    }

    // POST: api/architecture/assessment/{assessmentId}
    [HttpPost("assessment/{assessmentId}")]
    public async Task<ActionResult<ArchitectureReviewDto>> CreateArchitectureReview(
        int assessmentId,
        [FromBody] ArchitectureReviewDto dto)
    {
        try
        {
            // Check if assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
            if (!assessmentExists)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Check if architecture review already exists for this assessment
            var existingReview = await _context.ArchitectureReviews
                .FirstOrDefaultAsync(ar => ar.AssessmentId == assessmentId);

            if (existingReview != null)
            {
                return Conflict($"Architecture review already exists for assessment ID: {assessmentId}");
            }

            var architectureReview = MapFromDto(dto, assessmentId);
            _context.ArchitectureReviews.Add(architectureReview);
            await _context.SaveChangesAsync();

            // Add related data
            if (dto.ArchitecturePatterns?.Any() == true)
            {
                foreach (var patternDto in dto.ArchitecturePatterns)
                {
                    var pattern = new ArchitecturePattern
                    {
                        ArchitectureReviewId = architectureReview.Id,
                        PatternName = patternDto.PatternName,
                        Usage = patternDto.Usage,
                        Quality = patternDto.Quality,
                        Recommendation = patternDto.Recommendation,
                        Maturity = patternDto.Maturity
                    };
                    _context.ArchitecturePatterns.Add(pattern);
                }
            }

            if (dto.TechnologyStack?.Any() == true)
            {
                foreach (var techDto in dto.TechnologyStack)
                {
                    var tech = new TechnologyStack
                    {
                        ArchitectureReviewId = architectureReview.Id,
                        Category = techDto.Category,
                        Technology = techDto.Technology,
                        Version = techDto.Version,
                        Status = techDto.Status,
                        Risk = techDto.Risk,
                        Recommendation = techDto.Recommendation
                    };
                    _context.TechnologyStacks.Add(tech);
                }
            }

            if (dto.CodebaseStats?.Any() == true)
            {
                foreach (var statsDto in dto.CodebaseStats)
                {
                    var stats = new CodebaseStats
                    {
                        ArchitectureReviewId = architectureReview.Id,
                        Language = statsDto.Language,
                        LinesOfCode = statsDto.LinesOfCode,
                        Percentage = statsDto.Percentage,
                        FileCount = statsDto.FileCount
                    };
                    _context.CodebaseStats.Add(stats);
                }
            }

            await _context.SaveChangesAsync();

            // Send notification
            await _hubContext.Clients.All.SendAsync("ArchitectureReviewCreated", new
            {
                AssessmentId = assessmentId,
                Message = "Architecture review created successfully"
            });

            _logger.LogInformation("Architecture review created for assessment {AssessmentId}", assessmentId);
            
            return CreatedAtAction(
                nameof(GetArchitectureReview), 
                new { assessmentId }, 
                MapToDto(architectureReview, dto.CodebaseStats?.Select(cs => new CodebaseStats
                {
                    Id = cs.Id,
                    Language = cs.Language,
                    LinesOfCode = cs.LinesOfCode,
                    Percentage = cs.Percentage,
                    FileCount = cs.FileCount
                }).ToList() ?? new List<CodebaseStats>()));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating architecture review for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while creating the architecture review");
        }
    }

    // PUT: api/architecture/assessment/{assessmentId}
    [HttpPut("assessment/{assessmentId}")]
    public async Task<IActionResult> UpdateArchitectureReview(
        int assessmentId,
        [FromBody] ArchitectureReviewDto dto)
    {
        try
        {
            var existingReview = await _context.ArchitectureReviews
                .Include(ar => ar.ArchitecturePatterns)
                .Include(ar => ar.TechnologyStacks)
                .FirstOrDefaultAsync(ar => ar.AssessmentId == assessmentId);

            if (existingReview == null)
            {
                return NotFound($"Architecture review not found for assessment ID: {assessmentId}");
            }

            // Update main review
            UpdateArchitectureReviewFromDto(existingReview, dto);

            // Update patterns
            _context.ArchitecturePatterns.RemoveRange(existingReview.ArchitecturePatterns);
            if (dto.ArchitecturePatterns?.Any() == true)
            {
                foreach (var patternDto in dto.ArchitecturePatterns)
                {
                    var pattern = new ArchitecturePattern
                    {
                        ArchitectureReviewId = existingReview.Id,
                        PatternName = patternDto.PatternName,
                        Usage = patternDto.Usage,
                        Quality = patternDto.Quality,
                        Recommendation = patternDto.Recommendation,
                        Maturity = patternDto.Maturity
                    };
                    _context.ArchitecturePatterns.Add(pattern);
                }
            }

            // Update technology stack
            _context.TechnologyStacks.RemoveRange(existingReview.TechnologyStacks);
            if (dto.TechnologyStack?.Any() == true)
            {
                foreach (var techDto in dto.TechnologyStack)
                {
                    var tech = new TechnologyStack
                    {
                        ArchitectureReviewId = existingReview.Id,
                        Category = techDto.Category,
                        Technology = techDto.Technology,
                        Version = techDto.Version,
                        Status = techDto.Status,
                        Risk = techDto.Risk,
                        Recommendation = techDto.Recommendation
                    };
                    _context.TechnologyStacks.Add(tech);
                }
            }

            // Update codebase stats
            var existingStats = await _context.CodebaseStats
                .Where(cs => cs.ArchitectureReviewId == existingReview.Id)
                .ToListAsync();
            
            _context.CodebaseStats.RemoveRange(existingStats);
            if (dto.CodebaseStats?.Any() == true)
            {
                foreach (var statsDto in dto.CodebaseStats)
                {
                    var stats = new CodebaseStats
                    {
                        ArchitectureReviewId = existingReview.Id,
                        Language = statsDto.Language,
                        LinesOfCode = statsDto.LinesOfCode,
                        Percentage = statsDto.Percentage,
                        FileCount = statsDto.FileCount
                    };
                    _context.CodebaseStats.Add(stats);
                }
            }

            await _context.SaveChangesAsync();

            // Send notification
            await _hubContext.Clients.All.SendAsync("ArchitectureReviewUpdated", new
            {
                AssessmentId = assessmentId,
                Message = "Architecture review updated successfully"
            });

            _logger.LogInformation("Architecture review updated for assessment {AssessmentId}", assessmentId);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating architecture review for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while updating the architecture review");
        }
    }

    // DELETE: api/architecture/assessment/{assessmentId}
    [HttpDelete("assessment/{assessmentId}")]
    public async Task<IActionResult> DeleteArchitectureReview(int assessmentId)
    {
        try
        {
            var architectureReview = await _context.ArchitectureReviews
                .FirstOrDefaultAsync(ar => ar.AssessmentId == assessmentId);

            if (architectureReview == null)
            {
                return NotFound($"Architecture review not found for assessment ID: {assessmentId}");
            }

            _context.ArchitectureReviews.Remove(architectureReview);
            await _context.SaveChangesAsync();

            // Send notification
            await _hubContext.Clients.All.SendAsync("ArchitectureReviewDeleted", new
            {
                AssessmentId = assessmentId,
                Message = "Architecture review deleted successfully"
            });

            _logger.LogInformation("Architecture review deleted for assessment {AssessmentId}", assessmentId);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting architecture review for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while deleting the architecture review");
        }
    }

    private ArchitectureReviewDto MapToDto(ArchitectureReview review, List<CodebaseStats> codebaseStats)
    {
        return new ArchitectureReviewDto
        {
            Id = review.Id,
            AssessmentId = review.AssessmentId,
            HealthMetrics = new HealthMetricsDto
            {
                Maintainability = review.MaintainabilityScore,
                Complexity = review.ComplexityScore,
                Coupling = review.CouplingScore,
                Cohesion = review.CohesionScore,
                TestCoverage = review.TestCoverageScore,
                TechnicalDebt = review.TechnicalDebtScore
            },
            CodeQuality = new CodeQualityDto
            {
                CodeSmells = review.CodeSmells,
                DuplicatedLines = review.DuplicatedLines,
                Vulnerabilities = review.Vulnerabilities,
                Bugs = review.Bugs,
                SecurityHotspots = review.SecurityHotspots
            },
            RepositoryInfo = new RepositoryInfoDto
            {
                Url = review.RepositoryUrl,
                Type = review.RepositoryType,
                Status = review.RepositoryStatus,
                LastCommitHash = review.LastCommitHash,
                LastCommitDate = review.LastCommitDate
            },
            Analysis = new AnalysisDto
            {
                ArchitectureAnalysis = review.ArchitectureAnalysis,
                HealthAnalysis = review.HealthAnalysis,
                PatternsAnalysis = review.PatternsAnalysis,
                TechnologyAnalysis = review.TechnologyAnalysis,
                MaintainabilityAnalysis = review.MaintainabilityAnalysis,
                RecommendationsAnalysis = review.RecommendationsAnalysis
            },
            ArchitecturePatterns = review.ArchitecturePatterns.Select(ap => new ArchitecturePatternDto
            {
                Id = ap.Id,
                PatternName = ap.PatternName,
                Usage = ap.Usage,
                Quality = ap.Quality,
                Recommendation = ap.Recommendation,
                Maturity = ap.Maturity
            }).ToList(),
            TechnologyStack = review.TechnologyStacks.Select(ts => new TechnologyStackDto
            {
                Id = ts.Id,
                Category = ts.Category,
                Technology = ts.Technology,
                Version = ts.Version,
                Status = ts.Status,
                Risk = ts.Risk,
                Recommendation = ts.Recommendation
            }).ToList(),
            CodebaseStats = codebaseStats.Select(cs => new CodebaseStatsDto
            {
                Id = cs.Id,
                Language = cs.Language,
                LinesOfCode = cs.LinesOfCode,
                Percentage = cs.Percentage,
                FileCount = cs.FileCount
            }).ToList(),
            CreatedDate = review.CreatedDate,
            LastUpdatedDate = review.LastUpdatedDate
        };
    }

    private ArchitectureReview MapFromDto(ArchitectureReviewDto dto, int assessmentId)
    {
        return new ArchitectureReview
        {
            AssessmentId = assessmentId,
            MaintainabilityScore = dto.HealthMetrics.Maintainability,
            ComplexityScore = dto.HealthMetrics.Complexity,
            CouplingScore = dto.HealthMetrics.Coupling,
            CohesionScore = dto.HealthMetrics.Cohesion,
            TestCoverageScore = dto.HealthMetrics.TestCoverage,
            TechnicalDebtScore = dto.HealthMetrics.TechnicalDebt,
            CodeSmells = dto.CodeQuality.CodeSmells,
            DuplicatedLines = dto.CodeQuality.DuplicatedLines,
            Vulnerabilities = dto.CodeQuality.Vulnerabilities,
            Bugs = dto.CodeQuality.Bugs,
            SecurityHotspots = dto.CodeQuality.SecurityHotspots,
            RepositoryUrl = dto.RepositoryInfo.Url,
            RepositoryType = dto.RepositoryInfo.Type,
            RepositoryStatus = dto.RepositoryInfo.Status,
            LastCommitHash = dto.RepositoryInfo.LastCommitHash,
            LastCommitDate = dto.RepositoryInfo.LastCommitDate,
            ArchitectureAnalysis = dto.Analysis.ArchitectureAnalysis,
            HealthAnalysis = dto.Analysis.HealthAnalysis,
            PatternsAnalysis = dto.Analysis.PatternsAnalysis,
            TechnologyAnalysis = dto.Analysis.TechnologyAnalysis,
            MaintainabilityAnalysis = dto.Analysis.MaintainabilityAnalysis,
            RecommendationsAnalysis = dto.Analysis.RecommendationsAnalysis,
            CreatedDate = DateTime.UtcNow
        };
    }

    private void UpdateArchitectureReviewFromDto(ArchitectureReview review, ArchitectureReviewDto dto)
    {
        review.MaintainabilityScore = dto.HealthMetrics.Maintainability;
        review.ComplexityScore = dto.HealthMetrics.Complexity;
        review.CouplingScore = dto.HealthMetrics.Coupling;
        review.CohesionScore = dto.HealthMetrics.Cohesion;
        review.TestCoverageScore = dto.HealthMetrics.TestCoverage;
        review.TechnicalDebtScore = dto.HealthMetrics.TechnicalDebt;
        review.CodeSmells = dto.CodeQuality.CodeSmells;
        review.DuplicatedLines = dto.CodeQuality.DuplicatedLines;
        review.Vulnerabilities = dto.CodeQuality.Vulnerabilities;
        review.Bugs = dto.CodeQuality.Bugs;
        review.SecurityHotspots = dto.CodeQuality.SecurityHotspots;
        review.RepositoryUrl = dto.RepositoryInfo.Url;
        review.RepositoryType = dto.RepositoryInfo.Type;
        review.RepositoryStatus = dto.RepositoryInfo.Status;
        review.LastCommitHash = dto.RepositoryInfo.LastCommitHash;
        review.LastCommitDate = dto.RepositoryInfo.LastCommitDate;
        review.ArchitectureAnalysis = dto.Analysis.ArchitectureAnalysis;
        review.HealthAnalysis = dto.Analysis.HealthAnalysis;
        review.PatternsAnalysis = dto.Analysis.PatternsAnalysis;
        review.TechnologyAnalysis = dto.Analysis.TechnologyAnalysis;
        review.MaintainabilityAnalysis = dto.Analysis.MaintainabilityAnalysis;
        review.RecommendationsAnalysis = dto.Analysis.RecommendationsAnalysis;
        review.LastUpdatedDate = DateTime.UtcNow;
    }
}