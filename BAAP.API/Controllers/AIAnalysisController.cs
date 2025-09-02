using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using System.Text.Json;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize] // Temporarily disabled for development
public class AIAnalysisController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<AIAnalysisController> _logger;

    public AIAnalysisController(BaapDbContext context, ILogger<AIAnalysisController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/AIAnalysis/{assessmentId}/{moduleName}
    [HttpGet("{assessmentId}/{moduleName}")]
    public async Task<ActionResult<AIAnalysisResultResponse>> GetAnalysisResult(int assessmentId, string moduleName)
    {
        try
        {
            var result = await _context.AIAnalysisResults
                .FirstOrDefaultAsync(r => r.AssessmentId == assessmentId && 
                                         r.ModuleName.ToLower() == moduleName.ToLower());

            if (result == null)
            {
                return NotFound($"No AI analysis results found for assessment {assessmentId}, module {moduleName}");
            }

            // Deserialize JSON results
            object analysisResults;
            try
            {
                analysisResults = JsonSerializer.Deserialize<object>(result.ResultsJson);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize analysis results for assessment {AssessmentId}, module {ModuleName}", assessmentId, moduleName);
                analysisResults = new { error = "Failed to deserialize results" };
            }

            var response = new AIAnalysisResultResponse
            {
                Id = result.Id,
                AssessmentId = result.AssessmentId,
                ModuleName = result.ModuleName,
                AnalysisResults = analysisResults,
                CreatedDate = result.CreatedDate,
                LastModifiedDate = result.LastModifiedDate,
                AnalysisMode = result.AnalysisMode,
                Version = result.Version
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving AI analysis results for assessment {AssessmentId}, module {ModuleName}", assessmentId, moduleName);
            return StatusCode(500, "An error occurred while retrieving analysis results");
        }
    }

    // POST: api/AIAnalysis
    [HttpPost]
    public async Task<ActionResult<AIAnalysisResultResponse>> SaveAnalysisResult([FromBody] SaveAIAnalysisResultRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verify assessment exists
            var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == request.AssessmentId);
            if (!assessmentExists)
            {
                return NotFound($"Assessment with ID {request.AssessmentId} not found");
            }

            // Serialize analysis results to JSON
            string resultsJson;
            try
            {
                resultsJson = JsonSerializer.Serialize(request.AnalysisResults, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to serialize analysis results for assessment {AssessmentId}, module {ModuleName}", request.AssessmentId, request.ModuleName);
                return BadRequest("Failed to serialize analysis results");
            }

            // Check if results already exist (upsert pattern)
            var existingResult = await _context.AIAnalysisResults
                .FirstOrDefaultAsync(r => r.AssessmentId == request.AssessmentId && 
                                         r.ModuleName.ToLower() == request.ModuleName.ToLower());

            if (existingResult != null)
            {
                // Update existing results
                existingResult.ResultsJson = resultsJson;
                existingResult.LastModifiedDate = DateTime.UtcNow;
                existingResult.AnalysisMode = request.AnalysisMode;
                
                await _context.SaveChangesAsync();

                var updateResponse = new AIAnalysisResultResponse
                {
                    Id = existingResult.Id,
                    AssessmentId = existingResult.AssessmentId,
                    ModuleName = existingResult.ModuleName,
                    AnalysisResults = request.AnalysisResults,
                    CreatedDate = existingResult.CreatedDate,
                    LastModifiedDate = existingResult.LastModifiedDate,
                    AnalysisMode = existingResult.AnalysisMode,
                    Version = existingResult.Version
                };

                return Ok(updateResponse);
            }
            else
            {
                // Create new results
                var newResult = new AIAnalysisResult
                {
                    AssessmentId = request.AssessmentId,
                    ModuleName = request.ModuleName.ToLower(),
                    ResultsJson = resultsJson,
                    CreatedDate = DateTime.UtcNow,
                    LastModifiedDate = DateTime.UtcNow,
                    AnalysisMode = request.AnalysisMode,
                    Version = "1.0"
                };

                _context.AIAnalysisResults.Add(newResult);
                await _context.SaveChangesAsync();

                var createResponse = new AIAnalysisResultResponse
                {
                    Id = newResult.Id,
                    AssessmentId = newResult.AssessmentId,
                    ModuleName = newResult.ModuleName,
                    AnalysisResults = request.AnalysisResults,
                    CreatedDate = newResult.CreatedDate,
                    LastModifiedDate = newResult.LastModifiedDate,
                    AnalysisMode = newResult.AnalysisMode,
                    Version = newResult.Version
                };

                return CreatedAtAction(nameof(GetAnalysisResult), 
                    new { assessmentId = newResult.AssessmentId, moduleName = newResult.ModuleName }, 
                    createResponse);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving AI analysis results for assessment {AssessmentId}, module {ModuleName}", 
                request.AssessmentId, request.ModuleName);
            return StatusCode(500, "An error occurred while saving analysis results");
        }
    }

    // GET: api/AIAnalysis/{assessmentId}
    [HttpGet("{assessmentId}")]
    public async Task<ActionResult<IEnumerable<AIAnalysisResultResponse>>> GetAllAnalysisResults(int assessmentId)
    {
        try
        {
            var results = await _context.AIAnalysisResults
                .Where(r => r.AssessmentId == assessmentId)
                .ToListAsync();

            var responses = results.Select(result =>
            {
                object analysisResults;
                try
                {
                    analysisResults = JsonSerializer.Deserialize<object>(result.ResultsJson);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize analysis results for assessment {AssessmentId}, module {ModuleName}", assessmentId, result.ModuleName);
                    analysisResults = new { error = "Failed to deserialize results" };
                }

                return new AIAnalysisResultResponse
                {
                    Id = result.Id,
                    AssessmentId = result.AssessmentId,
                    ModuleName = result.ModuleName,
                    AnalysisResults = analysisResults,
                    CreatedDate = result.CreatedDate,
                    LastModifiedDate = result.LastModifiedDate,
                    AnalysisMode = result.AnalysisMode,
                    Version = result.Version
                };
            }).ToList();

            return Ok(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all AI analysis results for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving analysis results");
        }
    }

    // DELETE: api/AIAnalysis/{assessmentId}/{moduleName}
    [HttpDelete("{assessmentId}/{moduleName}")]
    public async Task<ActionResult> DeleteAnalysisResult(int assessmentId, string moduleName)
    {
        try
        {
            var result = await _context.AIAnalysisResults
                .FirstOrDefaultAsync(r => r.AssessmentId == assessmentId && 
                                         r.ModuleName.ToLower() == moduleName.ToLower());

            if (result == null)
            {
                return NotFound($"No AI analysis results found for assessment {assessmentId}, module {moduleName}");
            }

            _context.AIAnalysisResults.Remove(result);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"AI analysis results deleted for assessment {assessmentId}, module {moduleName}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting AI analysis results for assessment {AssessmentId}, module {ModuleName}", assessmentId, moduleName);
            return StatusCode(500, "An error occurred while deleting analysis results");
        }
    }
}