namespace BAAP.API.Models;

public class DocumentProcessingResult
{
    public bool Success { get; set; }
    public string ExtractedText { get; set; } = string.Empty;
    public List<string> KeyFindings { get; set; } = new();
    public string DocumentType { get; set; } = string.Empty;
    public string ProcessingError { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
    public int CharacterCount => ExtractedText.Length;
    public TimeSpan ProcessingTime { get; set; }
}