using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

public class DocumentEmbedding
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string FileName { get; set; } = string.Empty;
    
    [Required]
    public string ContentType { get; set; } = string.Empty;
    
    [Required]
    public string ExtractedText { get; set; } = string.Empty;
    
    // Vector embedding as JSON array (since EF Core doesn't support vector types natively)
    [Required]
    public string EmbeddingVector { get; set; } = string.Empty;
    
    [Required]
    public int AssessmentId { get; set; }
    
    [Required]
    public string ModuleType { get; set; } = string.Empty; // e.g., "business", "architecture", "infrastructure"
    
    public List<string> KeyFindings { get; set; } = new();
    
    public Dictionary<string, object> Metadata { get; set; } = new();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    
    public int ChunkIndex { get; set; } = 0; // For large documents split into chunks
    
    public int TotalChunks { get; set; } = 1;
    
    // Navigation properties
    public Assessment Assessment { get; set; } = null!;
}

public class SemanticSearchRequest
{
    [Required]
    public string Query { get; set; } = string.Empty;
    
    public int? AssessmentId { get; set; } // null for cross-assessment search
    
    public List<string>? ModuleTypes { get; set; } // Filter by specific modules
    
    public int TopK { get; set; } = 5; // Number of results to return
    
    public double SimilarityThreshold { get; set; } = 0.7; // Minimum similarity score
}

public class SemanticSearchResult
{
    public int DocumentId { get; set; }
    
    public string FileName { get; set; } = string.Empty;
    
    public string RelevantText { get; set; } = string.Empty;
    
    public double SimilarityScore { get; set; }
    
    public int AssessmentId { get; set; }
    
    public string AssessmentName { get; set; } = string.Empty;
    
    public string ModuleType { get; set; } = string.Empty;
    
    public List<string> KeyFindings { get; set; } = new();
    
    public Dictionary<string, object> Metadata { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
}

public class CrossAssessmentInsight
{
    public string Pattern { get; set; } = string.Empty;
    
    public List<SemanticSearchResult> RelatedDocuments { get; set; } = new();
    
    public string Recommendation { get; set; } = string.Empty;
    
    public double ConfidenceScore { get; set; }
    
    public List<int> AssessmentIds { get; set; } = new();
}

public class DocumentChunk
{
    public string Text { get; set; } = string.Empty;
    
    public int ChunkIndex { get; set; }
    
    public int StartPosition { get; set; }
    
    public int EndPosition { get; set; }
    
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class EmbeddingGenerationRequest
{
    [Required]
    public string Text { get; set; } = string.Empty;
    
    public string DocumentType { get; set; } = string.Empty;
    
    public Dictionary<string, object> Context { get; set; } = new();
}

public class EmbeddingGenerationResult
{
    public bool Success { get; set; }
    
    public float[] Embedding { get; set; } = Array.Empty<float>();
    
    public string ErrorMessage { get; set; } = string.Empty;
    
    public TimeSpan ProcessingTime { get; set; }
    
    public int TokenCount { get; set; }
}