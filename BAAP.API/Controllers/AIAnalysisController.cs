using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BAAP.API.Services;
using BAAP.API.Hubs;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIAnalysisController : ControllerBase
{
    private readonly IAIAnalysisService _aiAnalysisService;
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly ILogger<AIAnalysisController> _logger;

    public AIAnalysisController(
        IAIAnalysisService aiAnalysisService,
        IHubContext<NotificationHub> notificationHub,
        ILogger<AIAnalysisController> logger)
    {
        _aiAnalysisService = aiAnalysisService;
        _notificationHub = notificationHub;
        _logger = logger;
    }

    [HttpPost("business-context")]
    public async Task<ActionResult<string>> AnalyzeBusinessContext([FromBody] BusinessContextRequest request)
    {
        try
        {
            _logger.LogInformation("Starting business context analysis");
            
            // Send start notification
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "business-context",
                AssessmentName = request.CompanyName,
                Message = "Business context analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeBusinessContextAsync(request);

            // Send completion notification
            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis", 
                Module = "business-context",
                AssessmentName = request.CompanyName,
                Duration = "45s",
                Message = "Business context analysis completed"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in business context analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "business-context",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("architecture")]
    public async Task<ActionResult<string>> AnalyzeArchitecture([FromBody] ArchitectureAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting architecture analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "architecture", 
                Message = "Architecture analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeArchitectureAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "architecture",
                Duration = "2m 15s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in architecture analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "architecture",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("infrastructure")]
    public async Task<ActionResult<string>> AnalyzeInfrastructure([FromBody] InfrastructureAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting infrastructure analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "infrastructure",
                Message = "Infrastructure analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeInfrastructureAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "infrastructure", 
                Duration = "1m 30s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in infrastructure analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "infrastructure",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("data-architecture")]
    public async Task<ActionResult<string>> AnalyzeDataArchitecture([FromBody] DataArchitectureAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting data architecture analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "data-architecture",
                Message = "Data architecture analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeDataArchitectureAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "data-architecture",
                Duration = "1m 45s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in data architecture analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "data-architecture", 
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("devops")]
    public async Task<ActionResult<string>> AnalyzeDevOps([FromBody] DevOpsAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting DevOps analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "devops",
                Message = "DevOps analysis started" 
            });

            var result = await _aiAnalysisService.AnalyzeDevOpsAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "devops",
                Duration = "1m 20s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DevOps analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "devops",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("security")]
    public async Task<ActionResult<string>> AnalyzeSecurity([FromBody] SecurityAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting security analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "security",
                Message = "Security analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeSecurityAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "security",
                Duration = "2m 5s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in security analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "security",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("cloud-readiness")]
    public async Task<ActionResult<string>> AnalyzeCloudReadiness([FromBody] CloudReadinessAnalysisRequest request)
    {
        try
        {
            _logger.LogInformation("Starting cloud readiness analysis");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "cloud-readiness",
                Message = "Cloud readiness analysis started"
            });

            var result = await _aiAnalysisService.AnalyzeCloudReadinessAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis",
                Module = "cloud-readiness",
                Duration = "3m 10s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in cloud readiness analysis");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "cloud-readiness",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("recommendations")]
    public async Task<ActionResult<string>> GenerateRecommendations([FromBody] FinalRecommendationsRequest request)
    {
        try
        {
            _logger.LogInformation("Starting final recommendations generation");
            
            await _notificationHub.Clients.All.SendAsync("AnalysisStarted", new
            {
                Type = "analysis",
                Module = "recommendations",
                Message = "Generating AI-powered recommendations"
            });

            var result = await _aiAnalysisService.GenerateRecommendationsAsync(request);

            await _notificationHub.Clients.All.SendAsync("AnalysisCompleted", new
            {
                Type = "analysis", 
                Module = "recommendations",
                Duration = "4m 30s"
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in recommendations generation");
            await _notificationHub.Clients.All.SendAsync("AnalysisError", new
            {
                Module = "recommendations",
                Error = ex.Message
            });
            return StatusCode(500, $"Analysis failed: {ex.Message}");
        }
    }

    [HttpPost("upload-document")]
    public async Task<ActionResult<DocumentProcessingResult>> UploadDocument(IFormFile document)
    {
        try
        {
            if (document == null || document.Length == 0)
            {
                return BadRequest("No document provided");
            }

            if (document.Length > 10 * 1024 * 1024) // 10MB limit
            {
                return BadRequest("Document size exceeds 10MB limit");
            }

            using var stream = document.OpenReadStream();
            var result = await _aiAnalysisService.ProcessDocumentAsync(stream, document.FileName, document.ContentType);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing uploaded document");
            return StatusCode(500, $"Document processing failed: {ex.Message}");
        }
    }

    [HttpGet("status")]
    public async Task<ActionResult<object>> GetStatus()
    {
        var isAvailable = await _aiAnalysisService.IsServiceAvailableAsync();
        
        return Ok(new
        {
            ServiceAvailable = isAvailable,
            Mode = isAvailable ? "AI-Powered" : "Simulation",
            Capabilities = new[]
            {
                "Business Context Analysis",
                "Architecture Review", 
                "Infrastructure Assessment",
                "Data Architecture Analysis",
                "DevOps Assessment",
                "Security Analysis",
                "Cloud Readiness Evaluation",
                "Strategic Recommendations",
                "Document Processing"
            }
        });
    }
}