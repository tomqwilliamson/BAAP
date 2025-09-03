using Microsoft.AspNetCore.Mvc;
using BAAP.API.Models;
using BAAP.API.Services;
using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VectorSearchController : ControllerBase
{
    private readonly IVectorSearchService _vectorSearchService;
    private readonly ILogger<VectorSearchController> _logger;

    public VectorSearchController(
        IVectorSearchService vectorSearchService,
        ILogger<VectorSearchController> logger)
    {
        _vectorSearchService = vectorSearchService;
        _logger = logger;
    }

    /// <summary>
    /// Upload and process a document for semantic search
    /// </summary>
    [HttpPost("documents/{assessmentId}/{moduleType}")]
    public async Task<ActionResult<List<DocumentEmbedding>>> UploadDocument(
        int assessmentId, 
        string moduleType, 
        IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided");
            }

            // Validate file size (10MB limit)
            const int maxFileSize = 10 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return BadRequest("File size exceeds 10MB limit");
            }

            // Validate module type
            var validModules = new[] { "business", "architecture", "infrastructure", "data", "devops", "security", "cloud", "recommendations" };
            if (!validModules.Contains(moduleType.ToLower()))
            {
                return BadRequest($"Invalid module type. Must be one of: {string.Join(", ", validModules)}");
            }

            using var stream = file.OpenReadStream();
            var documentEmbeddings = await _vectorSearchService.ProcessDocumentForSearchAsync(
                stream, 
                file.FileName, 
                file.ContentType, 
                assessmentId, 
                moduleType.ToLower());

            _logger.LogInformation("Successfully processed document {FileName} for assessment {AssessmentId}", 
                file.FileName, assessmentId);

            return Ok(new
            {
                success = true,
                message = $"Document processed successfully. Created {documentEmbeddings.Count} text chunks for search.",
                documentEmbeddings = documentEmbeddings.Select(de => new
                {
                    id = de.Id,
                    fileName = de.FileName,
                    moduleType = de.ModuleType,
                    chunkIndex = de.ChunkIndex,
                    totalChunks = de.TotalChunks,
                    keyFindings = de.KeyFindings,
                    createdAt = de.CreatedAt
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing document for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { success = false, message = "Failed to process document", error = ex.Message });
        }
    }

    /// <summary>
    /// Perform semantic search across documents
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<List<SemanticSearchResult>>> SearchDocuments(
        [FromBody] SemanticSearchRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest("Search query is required");
            }

            var results = await _vectorSearchService.SearchDocumentsAsync(request);

            _logger.LogInformation("Semantic search completed. Found {Count} results for query: {Query}", 
                results.Count, request.Query);

            return Ok(new
            {
                query = request.Query,
                resultCount = results.Count,
                results = results
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing semantic search for query: {Query}", request.Query);
            return StatusCode(500, new { success = false, message = "Search failed", error = ex.Message });
        }
    }

    /// <summary>
    /// Find cross-assessment insights and patterns
    /// </summary>
    [HttpGet("insights/{assessmentId}/{moduleType}")]
    public async Task<ActionResult<List<CrossAssessmentInsight>>> GetCrossAssessmentInsights(
        int assessmentId, 
        string moduleType, 
        [FromQuery] int maxInsights = 3)
    {
        try
        {
            var insights = await _vectorSearchService.FindCrossAssessmentInsightsAsync(
                assessmentId, 
                moduleType, 
                maxInsights);

            _logger.LogInformation("Found {Count} cross-assessment insights for assessment {AssessmentId}, module {ModuleType}", 
                insights.Count, assessmentId, moduleType);

            return Ok(new
            {
                assessmentId = assessmentId,
                moduleType = moduleType,
                insightCount = insights.Count,
                insights = insights
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding cross-assessment insights for assessment {AssessmentId}", assessmentId);
            return StatusCode(500, new { success = false, message = "Failed to find insights", error = ex.Message });
        }
    }

    /// <summary>
    /// Find similar documents to a given document
    /// </summary>
    [HttpGet("similar/{documentId}")]
    public async Task<ActionResult<List<SemanticSearchResult>>> GetSimilarDocuments(
        int documentId,
        [FromQuery] int topK = 5,
        [FromQuery] double similarityThreshold = 0.7)
    {
        try
        {
            var similarDocuments = await _vectorSearchService.FindSimilarDocumentsAsync(
                documentId, 
                topK, 
                similarityThreshold);

            _logger.LogInformation("Found {Count} similar documents to document {DocumentId}", 
                similarDocuments.Count, documentId);

            return Ok(new
            {
                sourceDocumentId = documentId,
                similarityThreshold = similarityThreshold,
                resultCount = similarDocuments.Count,
                results = similarDocuments
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding similar documents for document {DocumentId}", documentId);
            return StatusCode(500, new { success = false, message = "Failed to find similar documents", error = ex.Message });
        }
    }

    /// <summary>
    /// Get enhanced AI analysis with semantic search context
    /// </summary>
    [HttpPost("enhanced-analysis")]
    public async Task<ActionResult<string>> GetEnhancedAnalysis(
        [FromBody] EnhancedAnalysisRequest request)
    {
        try
        {
            var enhancedAnalysis = await _vectorSearchService.GetEnhancedAIAnalysisAsync(
                request.OriginalRequest,
                request.ModuleType,
                request.AssessmentId,
                request.RelevantDocuments);

            _logger.LogInformation("Generated enhanced AI analysis for assessment {AssessmentId}, module {ModuleType}", 
                request.AssessmentId, request.ModuleType);

            return Ok(new
            {
                originalRequest = request.OriginalRequest,
                enhancedRequest = enhancedAnalysis,
                contextDocuments = request.RelevantDocuments?.Count ?? 0,
                enhancementApplied = enhancedAnalysis != request.OriginalRequest
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating enhanced AI analysis for assessment {AssessmentId}", request.AssessmentId);
            return StatusCode(500, new { success = false, message = "Failed to generate enhanced analysis", error = ex.Message });
        }
    }

    /// <summary>
    /// Get vector search statistics
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<VectorSearchStats>> GetSearchStats()
    {
        try
        {
            var stats = await _vectorSearchService.GetEmbeddingStatsAsync();

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving vector search statistics");
            return StatusCode(500, new { success = false, message = "Failed to retrieve statistics", error = ex.Message });
        }
    }

    /// <summary>
    /// Rebuild all embeddings (admin operation)
    /// </summary>
    [HttpPost("rebuild")]
    public async Task<ActionResult> RebuildEmbeddings()
    {
        try
        {
            var success = await _vectorSearchService.RebuildAllEmbeddingsAsync();

            if (success)
            {
                return Ok(new { success = true, message = "Embeddings rebuild completed successfully" });
            }
            else
            {
                return StatusCode(500, new { success = false, message = "Embeddings rebuild failed" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rebuilding embeddings");
            return StatusCode(500, new { success = false, message = "Embeddings rebuild failed", error = ex.Message });
        }
    }

    /// <summary>
    /// Test embedding generation for debugging
    /// </summary>
    [HttpPost("test-embedding")]
    public async Task<ActionResult<EmbeddingGenerationResult>> TestEmbedding(
        [FromBody] TestEmbeddingRequest request)
    {
        try
        {
            var result = await _vectorSearchService.GenerateEmbeddingAsync(request.Text);

            // Don't return the full embedding array to avoid large responses
            return Ok(new
            {
                success = result.Success,
                embeddingDimension = result.Embedding.Length,
                tokenCount = result.TokenCount,
                processingTime = result.ProcessingTime.TotalMilliseconds,
                errorMessage = result.ErrorMessage,
                sampleEmbeddingValues = result.Embedding.Take(5).ToArray() // First 5 values for debugging
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing embedding generation");
            return StatusCode(500, new { success = false, message = "Embedding test failed", error = ex.Message });
        }
    }
}

// Request models
public class EnhancedAnalysisRequest
{
    [Required]
    public string OriginalRequest { get; set; } = string.Empty;
    
    [Required]
    public string ModuleType { get; set; } = string.Empty;
    
    [Required]
    public int AssessmentId { get; set; }
    
    public List<SemanticSearchResult>? RelevantDocuments { get; set; }
}

public class TestEmbeddingRequest
{
    [Required]
    [MinLength(1)]
    public string Text { get; set; } = string.Empty;
}