using BAAP.API.Models;
using BAAP.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BAAP.API.Controllers;

/// <summary>
/// Controller for Phase 4 industry classification and specialized AI analysis
/// </summary>
[ApiController]
[Route("api/industry")]
public class IndustryClassificationController : ControllerBase
{
    private readonly IIndustryClassificationService _industryService;
    private readonly ILogger<IndustryClassificationController> _logger;

    public IndustryClassificationController(
        IIndustryClassificationService industryService,
        ILogger<IndustryClassificationController> logger)
    {
        _industryService = industryService;
        _logger = logger;
    }

    /// <summary>
    /// Get all available industry classifications
    /// </summary>
    [HttpGet("classifications")]
    public async Task<ActionResult<List<IndustryClassification>>> GetIndustryClassifications()
    {
        try
        {
            var classifications = await _industryService.GetAllIndustryClassificationsAsync();
            return Ok(classifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get industry classifications");
            return StatusCode(500, new { message = "Failed to retrieve industry classifications", error = ex.Message });
        }
    }

    /// <summary>
    /// Search industry classifications by keyword
    /// </summary>
    [HttpGet("classifications/search")]
    public async Task<ActionResult<List<IndustryClassification>>> SearchIndustryClassifications([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Search query is required" });
            }

            var results = await _industryService.SearchIndustryClassificationsAsync(query);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search industry classifications");
            return StatusCode(500, new { message = "Failed to search industry classifications", error = ex.Message });
        }
    }

    /// <summary>
    /// Classify an assessment's industry automatically
    /// </summary>
    [HttpPost("classify/{assessmentId}")]
    public async Task<ActionResult<AssessmentIndustryClassification>> ClassifyAssessment(int assessmentId)
    {
        try
        {
            _logger.LogInformation("Classifying assessment {AssessmentId} for industry", assessmentId);
            
            var classification = await _industryService.ClassifyAssessmentAsync(assessmentId);
            
            _logger.LogInformation("Assessment {AssessmentId} classified as {Industry} with {Confidence}% confidence",
                assessmentId, classification.IndustryClassification.IndustryName, 
                (classification.ClassificationConfidence * 100).ToString("F1"));
            
            return Ok(classification);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to classify assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to classify assessment", error = ex.Message });
        }
    }

    /// <summary>
    /// Update assessment's industry classification manually
    /// </summary>
    [HttpPut("classify/{assessmentId}")]
    public async Task<ActionResult<AssessmentIndustryClassification>> UpdateAssessmentClassification(
        int assessmentId, 
        [FromBody] UpdateClassificationRequest request)
    {
        try
        {
            var classification = await _industryService.UpdateIndustryClassificationAsync(
                assessmentId, 
                request.IndustryClassificationId, 
                request.IsVerified);
            
            return Ok(classification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update classification for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to update classification", error = ex.Message });
        }
    }

    /// <summary>
    /// Get industry-specific AI analysis for an assessment module
    /// </summary>
    [HttpPost("analysis/{assessmentId}/{moduleType}")]
    public async Task<ActionResult<IndustryAnalysisResponse>> GetIndustrySpecificAnalysis(
        int assessmentId,
        string moduleType,
        [FromBody] IndustryAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Getting industry-specific analysis for assessment {AssessmentId}, module {ModuleType}",
                assessmentId, moduleType);

            var startTime = DateTime.UtcNow;
            
            var analysis = await _industryService.GetIndustrySpecificAnalysisAsync(
                assessmentId, moduleType, request.AnalysisRequest);

            var endTime = DateTime.UtcNow;
            var processingTime = endTime - startTime;

            var response = new IndustryAnalysisResponse
            {
                Analysis = analysis,
                ProcessingTimeMs = processingTime.TotalMilliseconds,
                GeneratedAt = endTime,
                ModuleType = moduleType,
                AssessmentId = assessmentId,
                IsIndustrySpecific = true
            };

            _logger.LogInformation("Industry-specific analysis completed in {Duration}ms for assessment {AssessmentId}",
                processingTime.TotalMilliseconds, assessmentId);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get industry-specific analysis for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to generate industry-specific analysis", error = ex.Message });
        }
    }

    /// <summary>
    /// Get industry benchmarks for comparison
    /// </summary>
    [HttpGet("benchmarks/{industryClassificationId}")]
    public async Task<ActionResult<List<IndustryBenchmark>>> GetIndustryBenchmarks(int industryClassificationId)
    {
        try
        {
            var benchmarks = await _industryService.GetIndustryBenchmarksAsync(industryClassificationId);
            return Ok(benchmarks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get industry benchmarks");
            return StatusCode(500, new { message = "Failed to retrieve industry benchmarks", error = ex.Message });
        }
    }

    /// <summary>
    /// Get industry-specific recommendations
    /// </summary>
    [HttpGet("recommendations/{assessmentId}")]
    public async Task<ActionResult<List<IndustrySpecificRecommendation>>> GetIndustryRecommendations(
        int assessmentId, 
        [FromQuery] string moduleType = "all")
    {
        try
        {
            var recommendations = await _industryService.GetIndustryRecommendationsAsync(assessmentId, moduleType);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get industry recommendations for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to retrieve industry recommendations", error = ex.Message });
        }
    }

    /// <summary>
    /// Get compliance requirements for the assessment's industry
    /// </summary>
    [HttpGet("compliance/{assessmentId}")]
    public async Task<ActionResult<List<ComplianceRequirement>>> GetComplianceRequirements(int assessmentId)
    {
        try
        {
            var requirements = await _industryService.GetComplianceRequirementsAsync(assessmentId);
            return Ok(requirements);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get compliance requirements for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to retrieve compliance requirements", error = ex.Message });
        }
    }

    /// <summary>
    /// Get industry knowledge base entries
    /// </summary>
    [HttpGet("knowledge/{industryClassificationId}")]
    public async Task<ActionResult<List<IndustryKnowledgeBase>>> GetIndustryKnowledgeBase(int industryClassificationId)
    {
        try
        {
            var knowledgeBase = await _industryService.GetIndustryKnowledgeBaseAsync(industryClassificationId);
            return Ok(knowledgeBase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get industry knowledge base");
            return StatusCode(500, new { message = "Failed to retrieve industry knowledge base", error = ex.Message });
        }
    }

    /// <summary>
    /// Generate comprehensive industry intelligence report
    /// </summary>
    [HttpGet("intelligence-report/{assessmentId}")]
    public async Task<ActionResult<IndustryIntelligenceReport>> GetIndustryIntelligenceReport(int assessmentId)
    {
        try
        {
            _logger.LogInformation("Generating industry intelligence report for assessment {AssessmentId}", assessmentId);
            
            var report = await _industryService.GenerateIndustryReportAsync(assessmentId);
            
            _logger.LogInformation("Industry intelligence report generated for assessment {AssessmentId}, industry: {Industry}",
                assessmentId, report.Industry.IndustryName);
            
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate industry intelligence report for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { message = "Failed to generate industry intelligence report", error = ex.Message });
        }
    }
}

/// <summary>
/// Request model for updating industry classification
/// </summary>
public class UpdateClassificationRequest
{
    public int IndustryClassificationId { get; set; }
    public bool IsVerified { get; set; } = true;
}

/// <summary>
/// Request model for industry-specific analysis
/// </summary>
public class IndustryAnalysisRequest
{
    public string AnalysisRequest { get; set; } = string.Empty;
}

/// <summary>
/// Response model for industry-specific analysis
/// </summary>
public class IndustryAnalysisResponse
{
    public string Analysis { get; set; } = string.Empty;
    public double ProcessingTimeMs { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string ModuleType { get; set; } = string.Empty;
    public int AssessmentId { get; set; }
    public bool IsIndustrySpecific { get; set; }
}