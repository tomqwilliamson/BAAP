using BAAP.API.Models;

namespace BAAP.API.Services;

public interface IVectorSearchService
{
    /// <summary>
    /// Generates embeddings for a text chunk using Azure OpenAI
    /// </summary>
    Task<EmbeddingGenerationResult> GenerateEmbeddingAsync(string text);
    
    /// <summary>
    /// Processes a document and creates embeddings for semantic search
    /// </summary>
    Task<List<DocumentEmbedding>> ProcessDocumentForSearchAsync(
        Stream documentStream, 
        string fileName, 
        string contentType, 
        int assessmentId, 
        string moduleType);
    
    /// <summary>
    /// Performs semantic search across documents
    /// </summary>
    Task<List<SemanticSearchResult>> SearchDocumentsAsync(SemanticSearchRequest request);
    
    /// <summary>
    /// Finds cross-assessment insights and patterns
    /// </summary>
    Task<List<CrossAssessmentInsight>> FindCrossAssessmentInsightsAsync(
        int currentAssessmentId, 
        string moduleType,
        int maxInsights = 3);
    
    /// <summary>
    /// Gets similar documents to a given document
    /// </summary>
    Task<List<SemanticSearchResult>> FindSimilarDocumentsAsync(
        int documentId, 
        int topK = 5, 
        double similarityThreshold = 0.7);
    
    /// <summary>
    /// Splits large documents into manageable chunks for embedding
    /// </summary>
    List<DocumentChunk> ChunkDocument(string text, int maxChunkSize = 2000, int overlapSize = 200);
    
    /// <summary>
    /// Calculates cosine similarity between two embedding vectors
    /// </summary>
    double CalculateSimilarity(float[] embedding1, float[] embedding2);
    
    /// <summary>
    /// Gets contextual AI analysis enhanced with semantic search results
    /// </summary>
    Task<string> GetEnhancedAIAnalysisAsync(
        string originalAnalysisRequest,
        string moduleType,
        int assessmentId,
        List<SemanticSearchResult>? relevantDocuments = null);
        
    /// <summary>
    /// Rebuilds embeddings for all documents (maintenance operation)
    /// </summary>
    Task<bool> RebuildAllEmbeddingsAsync();
    
    /// <summary>
    /// Gets embedding statistics for monitoring
    /// </summary>
    Task<VectorSearchStats> GetEmbeddingStatsAsync();
}

public class VectorSearchStats
{
    public int TotalDocuments { get; set; }
    
    public int TotalEmbeddings { get; set; }
    
    public Dictionary<string, int> DocumentsByModule { get; set; } = new();
    
    public Dictionary<int, int> DocumentsByAssessment { get; set; } = new();
    
    public DateTime LastRebuildDate { get; set; }
    
    public TimeSpan AverageSearchTime { get; set; }
    
    public long TotalVectorDimensions { get; set; }
}