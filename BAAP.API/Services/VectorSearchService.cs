using BAAP.API.Models;
using BAAP.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Text;

namespace BAAP.API.Services;

public class VectorSearchService : IVectorSearchService
{
    private readonly BaapDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<VectorSearchService> _logger;
    
    // For now, we'll simulate embeddings. In production, integrate with Azure OpenAI Embeddings API
    private readonly Random _random = new();
    
    public VectorSearchService(
        BaapDbContext context,
        IConfiguration configuration,
        ILogger<VectorSearchService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }
    
    public async Task<EmbeddingGenerationResult> GenerateEmbeddingAsync(string text)
    {
        var startTime = DateTime.UtcNow;
        
        try
        {
            // In production, this would call Azure OpenAI Embeddings API
            // For now, we'll generate a realistic simulation
            var embedding = GenerateSimulatedEmbedding(text);
            
            return new EmbeddingGenerationResult
            {
                Success = true,
                Embedding = embedding,
                ProcessingTime = DateTime.UtcNow - startTime,
                TokenCount = EstimateTokenCount(text)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate embedding for text: {Text}", text.Substring(0, Math.Min(text.Length, 100)));
            
            return new EmbeddingGenerationResult
            {
                Success = false,
                ErrorMessage = ex.Message,
                ProcessingTime = DateTime.UtcNow - startTime
            };
        }
    }
    
    public async Task<List<DocumentEmbedding>> ProcessDocumentForSearchAsync(
        Stream documentStream, 
        string fileName, 
        string contentType, 
        int assessmentId, 
        string moduleType)
    {
        _logger.LogInformation("Processing document for search: {FileName} for assessment {AssessmentId}", fileName, assessmentId);
        
        // First, extract text from the document (simplified for Phase 3)
        var processingResult = await ProcessDocumentSimplifiedAsync(documentStream, fileName, contentType);
        
        if (!processingResult.Success)
        {
            _logger.LogError("Failed to extract text from document: {Error}", processingResult.ProcessingError);
            return new List<DocumentEmbedding>();
        }
        
        // Split document into chunks for better semantic search
        var chunks = ChunkDocument(processingResult.ExtractedText);
        var documentEmbeddings = new List<DocumentEmbedding>();
        
        for (int i = 0; i < chunks.Count; i++)
        {
            var chunk = chunks[i];
            var embeddingResult = await GenerateEmbeddingAsync(chunk.Text);
            
            if (embeddingResult.Success)
            {
                var documentEmbedding = new DocumentEmbedding
                {
                    FileName = fileName,
                    ContentType = contentType,
                    ExtractedText = chunk.Text,
                    EmbeddingVector = JsonSerializer.Serialize(embeddingResult.Embedding),
                    AssessmentId = assessmentId,
                    ModuleType = moduleType,
                    KeyFindings = ExtractKeyFindings(chunk.Text),
                    Metadata = chunk.Metadata,
                    ChunkIndex = chunk.ChunkIndex,
                    TotalChunks = chunks.Count,
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow
                };
                
                documentEmbeddings.Add(documentEmbedding);
            }
        }
        
        // Save to database
        _context.DocumentEmbeddings.AddRange(documentEmbeddings);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Created {Count} document embeddings for {FileName}", documentEmbeddings.Count, fileName);
        
        return documentEmbeddings;
    }
    
    public async Task<List<SemanticSearchResult>> SearchDocumentsAsync(SemanticSearchRequest request)
    {
        _logger.LogInformation("Performing semantic search: {Query}", request.Query);
        
        // Generate embedding for the search query
        var queryEmbeddingResult = await GenerateEmbeddingAsync(request.Query);
        if (!queryEmbeddingResult.Success)
        {
            _logger.LogError("Failed to generate embedding for search query: {Query}", request.Query);
            return new List<SemanticSearchResult>();
        }
        
        // Get all document embeddings (with optional filters)
        var query = _context.DocumentEmbeddings
            .Include(de => de.Assessment)
            .AsQueryable();
        
        if (request.AssessmentId.HasValue)
        {
            query = query.Where(de => de.AssessmentId == request.AssessmentId.Value);
        }
        
        if (request.ModuleTypes != null && request.ModuleTypes.Any())
        {
            query = query.Where(de => request.ModuleTypes.Contains(de.ModuleType));
        }
        
        var documentEmbeddings = await query.ToListAsync();
        var results = new List<SemanticSearchResult>();
        
        // Calculate similarity for each document
        foreach (var docEmbedding in documentEmbeddings)
        {
            try
            {
                var docVector = JsonSerializer.Deserialize<float[]>(docEmbedding.EmbeddingVector);
                if (docVector != null)
                {
                    var similarity = CalculateSimilarity(queryEmbeddingResult.Embedding, docVector);
                    
                    if (similarity >= request.SimilarityThreshold)
                    {
                        results.Add(new SemanticSearchResult
                        {
                            DocumentId = docEmbedding.Id,
                            FileName = docEmbedding.FileName,
                            RelevantText = TruncateText(docEmbedding.ExtractedText, 500),
                            SimilarityScore = similarity,
                            AssessmentId = docEmbedding.AssessmentId,
                            AssessmentName = docEmbedding.Assessment?.Name ?? "Unknown Assessment",
                            ModuleType = docEmbedding.ModuleType,
                            KeyFindings = docEmbedding.KeyFindings,
                            Metadata = docEmbedding.Metadata,
                            CreatedAt = docEmbedding.CreatedAt
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to process embedding for document {DocumentId}", docEmbedding.Id);
            }
        }
        
        // Sort by similarity and take top K results
        var topResults = results
            .OrderByDescending(r => r.SimilarityScore)
            .Take(request.TopK)
            .ToList();
        
        _logger.LogInformation("Found {Count} relevant documents for query: {Query}", topResults.Count, request.Query);
        
        return topResults;
    }
    
    public async Task<List<CrossAssessmentInsight>> FindCrossAssessmentInsightsAsync(
        int currentAssessmentId, 
        string moduleType, 
        int maxInsights = 3)
    {
        _logger.LogInformation("Finding cross-assessment insights for assessment {AssessmentId}, module {ModuleType}", currentAssessmentId, moduleType);
        
        // Get documents from current assessment
        var currentDocuments = await _context.DocumentEmbeddings
            .Where(de => de.AssessmentId == currentAssessmentId && de.ModuleType == moduleType)
            .ToListAsync();
        
        if (!currentDocuments.Any())
        {
            return new List<CrossAssessmentInsight>();
        }
        
        var insights = new List<CrossAssessmentInsight>();
        
        // For each document in current assessment, find similar documents in other assessments
        foreach (var currentDoc in currentDocuments.Take(3)) // Limit to avoid too much processing
        {
            var similarDocuments = await FindSimilarDocumentsAsync(
                currentDoc.Id, 
                topK: 5, 
                similarityThreshold: 0.8);
            
            var crossAssessmentDocs = similarDocuments
                .Where(sd => sd.AssessmentId != currentAssessmentId)
                .ToList();
            
            if (crossAssessmentDocs.Any())
            {
                insights.Add(new CrossAssessmentInsight
                {
                    Pattern = GenerateInsightPattern(currentDoc, crossAssessmentDocs),
                    RelatedDocuments = crossAssessmentDocs,
                    Recommendation = GenerateRecommendation(currentDoc, crossAssessmentDocs),
                    ConfidenceScore = crossAssessmentDocs.Average(d => d.SimilarityScore),
                    AssessmentIds = crossAssessmentDocs.Select(d => d.AssessmentId).Distinct().ToList()
                });
            }
        }
        
        return insights.OrderByDescending(i => i.ConfidenceScore).Take(maxInsights).ToList();
    }
    
    public async Task<List<SemanticSearchResult>> FindSimilarDocumentsAsync(
        int documentId, 
        int topK = 5, 
        double similarityThreshold = 0.7)
    {
        var sourceDocument = await _context.DocumentEmbeddings
            .Include(de => de.Assessment)
            .FirstOrDefaultAsync(de => de.Id == documentId);
        
        if (sourceDocument == null)
        {
            return new List<SemanticSearchResult>();
        }
        
        var sourceVector = JsonSerializer.Deserialize<float[]>(sourceDocument.EmbeddingVector);
        if (sourceVector == null)
        {
            return new List<SemanticSearchResult>();
        }
        
        var allDocuments = await _context.DocumentEmbeddings
            .Include(de => de.Assessment)
            .Where(de => de.Id != documentId) // Exclude the source document
            .ToListAsync();
        
        var results = new List<SemanticSearchResult>();
        
        foreach (var doc in allDocuments)
        {
            try
            {
                var docVector = JsonSerializer.Deserialize<float[]>(doc.EmbeddingVector);
                if (docVector != null)
                {
                    var similarity = CalculateSimilarity(sourceVector, docVector);
                    
                    if (similarity >= similarityThreshold)
                    {
                        results.Add(new SemanticSearchResult
                        {
                            DocumentId = doc.Id,
                            FileName = doc.FileName,
                            RelevantText = TruncateText(doc.ExtractedText, 500),
                            SimilarityScore = similarity,
                            AssessmentId = doc.AssessmentId,
                            AssessmentName = doc.Assessment?.Name ?? "Unknown Assessment",
                            ModuleType = doc.ModuleType,
                            KeyFindings = doc.KeyFindings,
                            Metadata = doc.Metadata,
                            CreatedAt = doc.CreatedAt
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to calculate similarity for document {DocumentId}", doc.Id);
            }
        }
        
        return results.OrderByDescending(r => r.SimilarityScore).Take(topK).ToList();
    }
    
    public List<DocumentChunk> ChunkDocument(string text, int maxChunkSize = 2000, int overlapSize = 200)
    {
        var chunks = new List<DocumentChunk>();
        
        if (string.IsNullOrWhiteSpace(text))
        {
            return chunks;
        }
        
        // Simple sentence-aware chunking
        var sentences = SplitIntoSentences(text);
        var currentChunk = new StringBuilder();
        var chunkIndex = 0;
        var startPosition = 0;
        
        foreach (var sentence in sentences)
        {
            // If adding this sentence would exceed the limit, create a chunk
            if (currentChunk.Length + sentence.Length > maxChunkSize && currentChunk.Length > 0)
            {
                var chunkText = currentChunk.ToString().Trim();
                chunks.Add(new DocumentChunk
                {
                    Text = chunkText,
                    ChunkIndex = chunkIndex,
                    StartPosition = startPosition,
                    EndPosition = startPosition + chunkText.Length,
                    Metadata = new Dictionary<string, object>
                    {
                        ["wordCount"] = chunkText.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length,
                        ["charCount"] = chunkText.Length
                    }
                });
                
                // Handle overlap
                var overlapText = GetOverlapText(chunkText, overlapSize);
                currentChunk.Clear();
                currentChunk.Append(overlapText);
                startPosition += chunkText.Length - overlapText.Length;
                chunkIndex++;
            }
            
            currentChunk.AppendLine(sentence);
        }
        
        // Add the final chunk if there's remaining text
        if (currentChunk.Length > 0)
        {
            var chunkText = currentChunk.ToString().Trim();
            chunks.Add(new DocumentChunk
            {
                Text = chunkText,
                ChunkIndex = chunkIndex,
                StartPosition = startPosition,
                EndPosition = startPosition + chunkText.Length,
                Metadata = new Dictionary<string, object>
                {
                    ["wordCount"] = chunkText.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length,
                    ["charCount"] = chunkText.Length
                }
            });
        }
        
        return chunks;
    }
    
    public double CalculateSimilarity(float[] embedding1, float[] embedding2)
    {
        if (embedding1.Length != embedding2.Length)
        {
            throw new ArgumentException("Embeddings must have the same dimension");
        }
        
        // Calculate cosine similarity
        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;
        
        for (int i = 0; i < embedding1.Length; i++)
        {
            dotProduct += embedding1[i] * embedding2[i];
            magnitude1 += embedding1[i] * embedding1[i];
            magnitude2 += embedding2[i] * embedding2[i];
        }
        
        if (magnitude1 == 0.0 || magnitude2 == 0.0)
        {
            return 0.0;
        }
        
        return dotProduct / (Math.Sqrt(magnitude1) * Math.Sqrt(magnitude2));
    }
    
    public async Task<string> GetEnhancedAIAnalysisAsync(
        string originalAnalysisRequest,
        string moduleType,
        int assessmentId,
        List<SemanticSearchResult>? relevantDocuments = null)
    {
        // If no relevant documents provided, search for them
        if (relevantDocuments == null)
        {
            var searchRequest = new SemanticSearchRequest
            {
                Query = originalAnalysisRequest,
                AssessmentId = assessmentId,
                ModuleTypes = new List<string> { moduleType },
                TopK = 5,
                SimilarityThreshold = 0.7
            };
            
            relevantDocuments = await SearchDocumentsAsync(searchRequest);
        }
        
        // Enhance the original request with context from relevant documents
        var enhancedRequest = originalAnalysisRequest;
        
        if (relevantDocuments.Any())
        {
            var contextBuilder = new StringBuilder();
            contextBuilder.AppendLine("\n\n=== RELEVANT CONTEXT FROM UPLOADED DOCUMENTS ===");
            
            foreach (var doc in relevantDocuments.Take(3)) // Limit to avoid token overflow
            {
                contextBuilder.AppendLine($"\n--- From {doc.FileName} (Similarity: {doc.SimilarityScore:P1}) ---");
                contextBuilder.AppendLine(doc.RelevantText);
                
                if (doc.KeyFindings.Any())
                {
                    contextBuilder.AppendLine("\nKey Findings:");
                    foreach (var finding in doc.KeyFindings.Take(3))
                    {
                        contextBuilder.AppendLine($"• {finding}");
                    }
                }
            }
            
            enhancedRequest += contextBuilder.ToString();
        }
        
        return enhancedRequest;
    }
    
    public async Task<bool> RebuildAllEmbeddingsAsync()
    {
        _logger.LogInformation("Starting rebuild of all embeddings");
        
        try
        {
            // Clear existing embeddings
            var existingEmbeddings = await _context.DocumentEmbeddings.ToListAsync();
            _context.DocumentEmbeddings.RemoveRange(existingEmbeddings);
            await _context.SaveChangesAsync();
            
            // TODO: Re-process all uploaded documents
            // This would require storing original documents or having a way to re-access them
            
            _logger.LogInformation("Completed rebuild of embeddings");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to rebuild embeddings");
            return false;
        }
    }
    
    public async Task<VectorSearchStats> GetEmbeddingStatsAsync()
    {
        var totalDocuments = await _context.DocumentEmbeddings.CountAsync();
        var documentsByModule = await _context.DocumentEmbeddings
            .GroupBy(de => de.ModuleType)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
        var documentsByAssessment = await _context.DocumentEmbeddings
            .GroupBy(de => de.AssessmentId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
        
        return new VectorSearchStats
        {
            TotalDocuments = totalDocuments,
            TotalEmbeddings = totalDocuments,
            DocumentsByModule = documentsByModule,
            DocumentsByAssessment = documentsByAssessment,
            LastRebuildDate = DateTime.MinValue, // TODO: Track this
            AverageSearchTime = TimeSpan.FromMilliseconds(250), // TODO: Actually measure this
            TotalVectorDimensions = 1536 // Standard Azure OpenAI embedding dimension
        };
    }
    
    // Helper methods
    private float[] GenerateSimulatedEmbedding(string text)
    {
        // Generate a deterministic but realistic-looking embedding based on text content
        const int embeddingDimension = 1536; // Azure OpenAI standard dimension
        var embedding = new float[embeddingDimension];
        
        // Use text hash as seed for reproducible embeddings
        var hashCode = text.GetHashCode();
        var random = new Random(hashCode);
        
        // Generate normalized random vector
        for (int i = 0; i < embeddingDimension; i++)
        {
            embedding[i] = (float)(random.NextDouble() * 2.0 - 1.0); // Range: -1 to 1
        }
        
        // Normalize the vector
        var magnitude = Math.Sqrt(embedding.Sum(x => x * x));
        for (int i = 0; i < embeddingDimension; i++)
        {
            embedding[i] = (float)(embedding[i] / magnitude);
        }
        
        return embedding;
    }
    
    private int EstimateTokenCount(string text)
    {
        // Rough estimation: 1 token ≈ 4 characters for English text
        return text.Length / 4;
    }
    
    private List<string> ExtractKeyFindings(string text)
    {
        var findings = new List<string>();
        
        // Simple keyword-based extraction (in production, use more sophisticated NLP)
        var keywordPatterns = new[]
        {
            @"key finding[s]?[:\-]?\s*([^.!?]+)",
            @"important[:\-]?\s*([^.!?]+)",
            @"critical[:\-]?\s*([^.!?]+)",
            @"recommendation[s]?[:\-]?\s*([^.!?]+)",
            @"issue[s]?[:\-]?\s*([^.!?]+)"
        };
        
        foreach (var pattern in keywordPatterns)
        {
            var matches = Regex.Matches(text, pattern, RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                if (match.Groups.Count > 1)
                {
                    var finding = match.Groups[1].Value.Trim();
                    if (finding.Length > 10 && finding.Length < 200)
                    {
                        findings.Add(finding);
                    }
                }
            }
        }
        
        return findings.Take(5).ToList();
    }
    
    private List<string> SplitIntoSentences(string text)
    {
        // Simple sentence splitting
        return text.Split(new[] { '.', '!', '?' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim())
            .Where(s => s.Length > 0)
            .ToList();
    }
    
    private string GetOverlapText(string text, int overlapSize)
    {
        if (text.Length <= overlapSize)
        {
            return text;
        }
        
        return text.Substring(text.Length - overlapSize);
    }
    
    private string TruncateText(string text, int maxLength)
    {
        if (text.Length <= maxLength)
        {
            return text;
        }
        
        return text.Substring(0, maxLength - 3) + "...";
    }
    
    private string GenerateInsightPattern(DocumentEmbedding currentDoc, List<SemanticSearchResult> similarDocs)
    {
        var assessmentCount = similarDocs.Select(d => d.AssessmentId).Distinct().Count();
        return $"Similar {currentDoc.ModuleType} patterns found across {assessmentCount} other assessments";
    }
    
    private string GenerateRecommendation(DocumentEmbedding currentDoc, List<SemanticSearchResult> similarDocs)
    {
        var topSimilar = similarDocs.OrderByDescending(d => d.SimilarityScore).First();
        return $"Consider applying insights from '{topSimilar.AssessmentName}' which had similar {currentDoc.ModuleType} characteristics (similarity: {topSimilar.SimilarityScore:P1})";
    }
    
    private async Task<DocumentProcessingResult> ProcessDocumentSimplifiedAsync(Stream documentStream, string fileName, string contentType)
    {
        try
        {
            var text = "";
            
            // Simple text extraction based on content type
            if (contentType?.Contains("text") == true)
            {
                using var reader = new StreamReader(documentStream);
                text = await reader.ReadToEndAsync();
            }
            else
            {
                // For non-text files, use a placeholder (in production, integrate with document processing libraries)
                text = $"Document: {fileName}\nContent extracted from {contentType} file.\nThis is a placeholder for Phase 3 development.";
            }
            
            return new DocumentProcessingResult
            {
                Success = true,
                ExtractedText = text,
                DocumentType = contentType ?? "unknown"
            };
        }
        catch (Exception ex)
        {
            return new DocumentProcessingResult
            {
                Success = false,
                ProcessingError = ex.Message
            };
        }
    }
}