using Microsoft.AspNetCore.Mvc;
using BAAP.API.Services;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly IDocumentProcessingService _documentProcessingService;
    private readonly IVectorStorageService _vectorStorageService;
    private readonly ILogger<DocumentController> _logger;

    public DocumentController(
        IDocumentProcessingService documentProcessingService,
        IVectorStorageService vectorStorageService,
        ILogger<DocumentController> logger)
    {
        _documentProcessingService = documentProcessingService;
        _vectorStorageService = vectorStorageService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (!_documentProcessingService.IsSupportedFormat(file.ContentType))
            {
                return BadRequest($"Unsupported file format: {file.ContentType}");
            }

            using var stream = file.OpenReadStream();
            var processedDocument = await _documentProcessingService.ProcessAndStoreDocumentAsync(
                stream, file.FileName, file.ContentType);

            return Ok(new
            {
                documentId = processedDocument.Id,
                fileName = processedDocument.FileName,
                documentType = processedDocument.DocumentType,
                summary = processedDocument.Summary,
                keyFindings = processedDocument.KeyFindings,
                uploadedAt = processedDocument.UploadedAt,
                sizeBytes = processedDocument.SizeBytes,
                chunkCount = processedDocument.Chunks?.Count ?? 0,
                metadata = processedDocument.Metadata
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, "An error occurred while processing the document");
        }
    }

    [HttpGet("{documentId}")]
    public async Task<IActionResult> GetDocument(string documentId)
    {
        try
        {
            var document = await _vectorStorageService.GetDocumentAsync(documentId);
            
            if (string.IsNullOrEmpty(document.Id))
            {
                return NotFound($"Document with ID {documentId} not found");
            }

            return Ok(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving document {DocumentId}", documentId);
            return StatusCode(500, "An error occurred while retrieving the document");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDocuments()
    {
        try
        {
            var documents = await _vectorStorageService.GetAllDocumentsAsync();
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all documents");
            return StatusCode(500, "An error occurred while retrieving documents");
        }
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchDocuments([FromBody] DocumentSearchRequest request)
    {
        try
        {
            var searchResult = await _vectorStorageService.SemanticSearchAsync(
                request.Query, 
                request.DocumentTypes, 
                request.MaxResults ?? 10);

            return Ok(searchResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching documents for query: {Query}", request.Query);
            return StatusCode(500, "An error occurred while searching documents");
        }
    }

    [HttpGet("{documentId}/similar")]
    public async Task<IActionResult> FindSimilarDocuments(string documentId, [FromQuery] int maxResults = 5)
    {
        try
        {
            var similarDocuments = await _vectorStorageService.FindSimilarDocumentsAsync(documentId, maxResults);
            return Ok(similarDocuments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding similar documents for {DocumentId}", documentId);
            return StatusCode(500, "An error occurred while finding similar documents");
        }
    }

    [HttpPost("analyze-relationships")]
    public async Task<IActionResult> AnalyzeDocumentRelationships()
    {
        try
        {
            var insights = await _vectorStorageService.AnalyzeDocumentRelationshipsAsync();
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing document relationships");
            return StatusCode(500, "An error occurred while analyzing document relationships");
        }
    }

    [HttpPost("chat")]
    public async Task<IActionResult> ChatWithDocuments([FromBody] DocumentChatRequest request)
    {
        try
        {
            // Find relevant document chunks using semantic search
            var relevantChunks = await _vectorStorageService.SearchSimilarChunksAsync(
                request.Query, 
                request.MaxChunks ?? 5,
                request.MinimumSimilarity ?? 0.7);

            if (!relevantChunks.Any())
            {
                return Ok(new DocumentChatResponse
                {
                    Response = "I couldn't find any relevant information in the uploaded documents to answer your question.",
                    SourceDocuments = new List<string>(),
                    Confidence = 0.0
                });
            }

            // Prepare context from relevant chunks
            var context = string.Join("\n\n", relevantChunks.Select(chunk => 
                $"Document Context:\n{chunk.Text}"));

            var systemPrompt = @"You are an expert enterprise consultant and cloud migration specialist. 
                Answer the user's question based ONLY on the provided document context. 
                If the context doesn't contain relevant information, clearly state that.
                Provide specific, actionable insights and cite the relevant information from the documents.
                Structure your response professionally with clear recommendations when appropriate.";

            var userPrompt = $@"Based on the following document context, please answer this question: {request.Query}

Document Context:
{context}

Please provide a comprehensive answer based on the available information.";

            // Use semantic kernel to generate response
            var semanticKernelService = HttpContext.RequestServices.GetRequiredService<ISemanticKernelService>();
            var response = await semanticKernelService.GetChatResponseAsync(userPrompt, systemPrompt);

            // Get unique source document names
            var sourceDocuments = relevantChunks
                .Select(chunk => chunk.Metadata.GetValueOrDefault("FileName", "Unknown")?.ToString())
                .Where(name => !string.IsNullOrEmpty(name))
                .Distinct()
                .ToList();

            return Ok(new DocumentChatResponse
            {
                Response = response,
                SourceDocuments = sourceDocuments,
                Confidence = relevantChunks.Any() ? relevantChunks.Average(c => 0.8) : 0.0, // Simplified confidence
                RelevantChunks = relevantChunks.Select(c => c.Text.Substring(0, Math.Min(c.Text.Length, 200)) + "...").ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in document chat for query: {Query}", request.Query);
            return StatusCode(500, "An error occurred while processing your question");
        }
    }

    [HttpDelete("{documentId}")]
    public async Task<IActionResult> DeleteDocument(string documentId)
    {
        try
        {
            var deleted = await _vectorStorageService.DeleteDocumentAsync(documentId);
            
            if (!deleted)
            {
                return NotFound($"Document with ID {documentId} not found");
            }

            return Ok(new { message = "Document deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting document {DocumentId}", documentId);
            return StatusCode(500, "An error occurred while deleting the document");
        }
    }
}

public class DocumentSearchRequest
{
    public string Query { get; set; } = string.Empty;
    public string[]? DocumentTypes { get; set; }
    public int? MaxResults { get; set; }
}

public class DocumentChatRequest
{
    public string Query { get; set; } = string.Empty;
    public int? MaxChunks { get; set; }
    public double? MinimumSimilarity { get; set; }
}

public class DocumentChatResponse
{
    public string Response { get; set; } = string.Empty;
    public List<string> SourceDocuments { get; set; } = new();
    public double Confidence { get; set; }
    public List<string> RelevantChunks { get; set; } = new();
}