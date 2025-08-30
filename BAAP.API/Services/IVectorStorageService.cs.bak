namespace BAAP.API.Services;

public interface IVectorStorageService
{
    Task<string> StoreDocumentAsync(ProcessedDocument document);
    Task<ProcessedDocument> GetDocumentAsync(string documentId);
    Task<List<ProcessedDocument>> GetAllDocumentsAsync();
    Task<List<DocumentChunk>> SearchSimilarChunksAsync(string query, int maxResults = 5, double minimumSimilarity = 0.7);
    Task<List<ProcessedDocument>> FindSimilarDocumentsAsync(string documentId, int maxResults = 5);
    Task<bool> DeleteDocumentAsync(string documentId);
    Task<DocumentSearchResult> SemanticSearchAsync(string query, string[] documentTypes = null, int maxResults = 10);
    Task<List<DocumentInsight>> AnalyzeDocumentRelationshipsAsync();
    Task<DocumentClassificationResult> ClassifyDocumentAsync(string documentText);
}

public class ProcessedDocument
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string ExtractedText { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<string> KeyFindings { get; set; } = new();
    public string DocumentType { get; set; } = string.Empty;
    public List<DocumentChunk> Chunks { get; set; } = new();
    public Dictionary<string, object> Metadata { get; set; } = new();
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public long SizeBytes { get; set; }
    public ReadOnlyMemory<float> DocumentEmbedding { get; set; }
}

public class DocumentSearchResult
{
    public List<SearchResultItem> Results { get; set; } = new();
    public string Query { get; set; } = string.Empty;
    public int TotalResults { get; set; }
    public double MaxSimilarity { get; set; }
    public TimeSpan SearchTime { get; set; }
}

public class SearchResultItem
{
    public string DocumentId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string RelevantChunk { get; set; } = string.Empty;
    public double Similarity { get; set; }
    public List<string> MatchingKeyFindings { get; set; } = new();
}

public class DocumentInsight
{
    public string DocumentId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public List<RelatedDocument> RelatedDocuments { get; set; } = new();
    public List<string> KeyThemes { get; set; } = new();
    public List<string> TechnicalConcepts { get; set; } = new();
    public string AnalysisCategory { get; set; } = string.Empty;
}

public class RelatedDocument
{
    public string DocumentId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public double Similarity { get; set; }
    public string RelationshipType { get; set; } = string.Empty; // "Similar Content", "Complementary", "Sequential"
}

public class DocumentClassificationResult
{
    public string PrimaryCategory { get; set; } = string.Empty;
    public List<CategoryPrediction> Predictions { get; set; } = new();
    public double Confidence { get; set; }
    public List<string> KeyIndicators { get; set; } = new();
}

public class CategoryPrediction
{
    public string Category { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Reasoning { get; set; } = string.Empty;
}