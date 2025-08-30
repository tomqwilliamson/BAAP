using System.Collections.Concurrent;
using System.Text.Json;

namespace BAAP.API.Services;

public class VectorStorageService : IVectorStorageService
{
    private readonly ISemanticKernelService _semanticKernelService;
    private readonly ILogger<VectorStorageService> _logger;
    
    // In-memory storage for demo - in production, use a vector database like Azure AI Search, Pinecone, or Weaviate
    private readonly ConcurrentDictionary<string, ProcessedDocument> _documents = new();
    private readonly ConcurrentDictionary<string, List<DocumentChunk>> _documentChunks = new();

    public VectorStorageService(ISemanticKernelService semanticKernelService, ILogger<VectorStorageService> logger)
    {
        _semanticKernelService = semanticKernelService;
        _logger = logger;
    }

    public async Task<string> StoreDocumentAsync(ProcessedDocument document)
    {
        try
        {
            // Generate document-level embedding from summary
            document.DocumentEmbedding = await _semanticKernelService.GenerateEmbeddingAsync(
                document.Summary.Length > 0 ? document.Summary : document.ExtractedText.Substring(0, Math.Min(1000, document.ExtractedText.Length))
            );

            // Chunk the document and generate embeddings
            document.Chunks = await _semanticKernelService.ChunkDocumentAsync(document.ExtractedText);

            // Store in our in-memory collections
            _documents[document.Id] = document;
            _documentChunks[document.Id] = document.Chunks;

            _logger.LogInformation("Stored document {DocumentId} with {ChunkCount} chunks", document.Id, document.Chunks.Count);
            return document.Id;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error storing document {DocumentId}", document.Id);
            throw;
        }
    }

    public async Task<ProcessedDocument> GetDocumentAsync(string documentId)
    {
        _documents.TryGetValue(documentId, out var document);
        return document ?? new ProcessedDocument();
    }

    public async Task<List<ProcessedDocument>> GetAllDocumentsAsync()
    {
        return _documents.Values.OrderByDescending(d => d.UploadedAt).ToList();
    }

    public async Task<List<DocumentChunk>> SearchSimilarChunksAsync(string query, int maxResults = 5, double minimumSimilarity = 0.7)
    {
        try
        {
            var queryEmbedding = await _semanticKernelService.GenerateEmbeddingAsync(query);
            var results = new List<(DocumentChunk chunk, double similarity)>();

            // Search through all chunks
            foreach (var chunks in _documentChunks.Values)
            {
                foreach (var chunk in chunks)
                {
                    var similarity = await _semanticKernelService.CalculateCosineSimilarityAsync(queryEmbedding, chunk.Embedding);
                    
                    if (similarity >= minimumSimilarity)
                    {
                        results.Add((chunk, similarity));
                    }
                }
            }

            return results
                .OrderByDescending(r => r.similarity)
                .Take(maxResults)
                .Select(r => r.chunk)
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching similar chunks for query: {Query}", query);
            return new List<DocumentChunk>();
        }
    }

    public async Task<List<ProcessedDocument>> FindSimilarDocumentsAsync(string documentId, int maxResults = 5)
    {
        try
        {
            if (!_documents.TryGetValue(documentId, out var sourceDocument))
            {
                return new List<ProcessedDocument>();
            }

            var similarities = new List<(ProcessedDocument doc, double similarity)>();

            foreach (var doc in _documents.Values)
            {
                if (doc.Id == documentId) continue;

                var similarity = await _semanticKernelService.CalculateCosineSimilarityAsync(
                    sourceDocument.DocumentEmbedding, 
                    doc.DocumentEmbedding
                );

                similarities.Add((doc, similarity));
            }

            return similarities
                .OrderByDescending(s => s.similarity)
                .Take(maxResults)
                .Select(s => s.doc)
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding similar documents for {DocumentId}", documentId);
            return new List<ProcessedDocument>();
        }
    }

    public async Task<bool> DeleteDocumentAsync(string documentId)
    {
        var documentRemoved = _documents.TryRemove(documentId, out _);
        var chunksRemoved = _documentChunks.TryRemove(documentId, out _);
        
        _logger.LogInformation("Deleted document {DocumentId}: Document={DocumentRemoved}, Chunks={ChunksRemoved}", 
            documentId, documentRemoved, chunksRemoved);
            
        return documentRemoved && chunksRemoved;
    }

    public async Task<DocumentSearchResult> SemanticSearchAsync(string query, string[] documentTypes = null, int maxResults = 10)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        try
        {
            var queryEmbedding = await _semanticKernelService.GenerateEmbeddingAsync(query);
            var results = new List<SearchResultItem>();
            var maxSimilarity = 0.0;

            var documentsToSearch = _documents.Values.AsEnumerable();
            
            // Filter by document types if specified
            if (documentTypes != null && documentTypes.Length > 0)
            {
                documentsToSearch = documentsToSearch.Where(d => documentTypes.Contains(d.DocumentType));
            }

            foreach (var document in documentsToSearch)
            {
                // Calculate document-level similarity
                var documentSimilarity = await _semanticKernelService.CalculateCosineSimilarityAsync(
                    queryEmbedding, 
                    document.DocumentEmbedding
                );

                // Find the most relevant chunk
                var bestChunk = "";
                var bestChunkSimilarity = 0.0;

                if (_documentChunks.TryGetValue(document.Id, out var chunks))
                {
                    foreach (var chunk in chunks)
                    {
                        var chunkSimilarity = await _semanticKernelService.CalculateCosineSimilarityAsync(
                            queryEmbedding, 
                            chunk.Embedding
                        );

                        if (chunkSimilarity > bestChunkSimilarity)
                        {
                            bestChunkSimilarity = chunkSimilarity;
                            bestChunk = chunk.Text;
                        }
                    }
                }

                // Use the higher of document or chunk similarity
                var finalSimilarity = Math.Max(documentSimilarity, bestChunkSimilarity);
                
                if (finalSimilarity > 0.5) // Minimum threshold
                {
                    maxSimilarity = Math.Max(maxSimilarity, finalSimilarity);
                    
                    results.Add(new SearchResultItem
                    {
                        DocumentId = document.Id,
                        FileName = document.FileName,
                        DocumentType = document.DocumentType,
                        RelevantChunk = bestChunk.Length > 200 ? bestChunk.Substring(0, 200) + "..." : bestChunk,
                        Similarity = finalSimilarity,
                        MatchingKeyFindings = document.KeyFindings
                            .Where(finding => finding.ToLower().Contains(query.ToLower().Split(' ')[0]))
                            .ToList()
                    });
                }
            }

            stopwatch.Stop();

            return new DocumentSearchResult
            {
                Results = results.OrderByDescending(r => r.Similarity).Take(maxResults).ToList(),
                Query = query,
                TotalResults = results.Count,
                MaxSimilarity = maxSimilarity,
                SearchTime = stopwatch.Elapsed
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing semantic search for query: {Query}", query);
            stopwatch.Stop();
            
            return new DocumentSearchResult
            {
                Query = query,
                SearchTime = stopwatch.Elapsed
            };
        }
    }

    public async Task<List<DocumentInsight>> AnalyzeDocumentRelationshipsAsync()
    {
        var insights = new List<DocumentInsight>();

        try
        {
            foreach (var document in _documents.Values)
            {
                var relatedDocuments = await FindSimilarDocumentsAsync(document.Id, 5);
                
                var insight = new DocumentInsight
                {
                    DocumentId = document.Id,
                    FileName = document.FileName,
                    AnalysisCategory = DetermineAnalysisCategory(document.DocumentType),
                    KeyThemes = ExtractKeyThemes(document),
                    TechnicalConcepts = ExtractTechnicalConcepts(document),
                    RelatedDocuments = relatedDocuments.Select(rd => new RelatedDocument
                    {
                        DocumentId = rd.Id,
                        FileName = rd.FileName,
                        Similarity = 0.8, // Would calculate actual similarity
                        RelationshipType = DetermineRelationshipType(document, rd)
                    }).ToList()
                };

                insights.Add(insight);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing document relationships");
        }

        return insights;
    }

    public async Task<DocumentClassificationResult> ClassifyDocumentAsync(string documentText)
    {
        try
        {
            var systemPrompt = @"You are an expert document classifier specializing in enterprise architecture and cloud migration documents. Classify the document into one of these categories:

1. Business Requirements - Business objectives, drivers, constraints, success criteria
2. Technical Architecture - System designs, architecture diagrams, technical specifications
3. Infrastructure Documentation - Server inventories, network diagrams, infrastructure specs
4. Security Documentation - Security policies, compliance requirements, risk assessments
5. Data Architecture - Database schemas, data flows, data governance policies
6. DevOps Documentation - CI/CD processes, deployment procedures, operational runbooks
7. Project Management - Timelines, project plans, resource allocation, budgets
8. Compliance & Governance - Regulatory requirements, audit reports, governance frameworks

Analyze the document content and provide:
- Primary category (most likely classification)
- Confidence score (0-1)
- Top 3 category predictions with reasoning
- Key indicators that led to the classification";

            var userPrompt = $@"Classify this document:

{documentText.Substring(0, Math.Min(documentText.Length, 2000))}

Provide classification analysis with reasoning.";

            var response = await _semanticKernelService.GetChatResponseAsync(userPrompt, systemPrompt);

            // Parse the response and extract classification info
            // In a real implementation, you might use structured output or JSON mode
            return ParseClassificationResponse(response, documentText);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error classifying document");
            return new DocumentClassificationResult
            {
                PrimaryCategory = "Technical Documentation",
                Confidence = 0.5,
                KeyIndicators = new List<string> { "Classification failed, using default category" }
            };
        }
    }

    private string DetermineAnalysisCategory(string documentType)
    {
        return documentType switch
        {
            "Business Requirements" => "Business Context",
            "Technical Architecture" => "Architecture Review",
            "Infrastructure Documentation" => "Infrastructure Assessment",
            "Security Documentation" => "Security Assessment",
            "Data Architecture" => "Data Architecture Assessment",
            "DevOps Documentation" => "DevOps Assessment",
            _ => "General Assessment"
        };
    }

    private List<string> ExtractKeyThemes(ProcessedDocument document)
    {
        var themes = new List<string>();
        var text = document.ExtractedText.ToLower();

        var themeKeywords = new Dictionary<string, string[]>
        {
            ["Cloud Migration"] = new[] { "cloud", "migration", "azure", "aws", "gcp" },
            ["Security"] = new[] { "security", "authentication", "authorization", "compliance" },
            ["Performance"] = new[] { "performance", "scalability", "optimization", "latency" },
            ["Data Management"] = new[] { "database", "data", "storage", "backup", "recovery" },
            ["DevOps"] = new[] { "ci/cd", "deployment", "pipeline", "automation", "testing" },
            ["Architecture"] = new[] { "architecture", "design", "pattern", "microservices", "api" }
        };

        foreach (var theme in themeKeywords)
        {
            if (theme.Value.Any(keyword => text.Contains(keyword)))
            {
                themes.Add(theme.Key);
            }
        }

        return themes;
    }

    private List<string> ExtractTechnicalConcepts(ProcessedDocument document)
    {
        var concepts = new List<string>();
        var text = document.ExtractedText.ToLower();

        var technicalTerms = new[]
        {
            "kubernetes", "docker", "containers", "microservices", "rest api", "graphql",
            "sql server", "postgresql", "mongodb", "redis", "elasticsearch",
            "react", "angular", "vue", "node.js", "python", "java", "c#",
            "azure", "aws", "terraform", "ansible", "jenkins", "github actions"
        };

        foreach (var term in technicalTerms)
        {
            if (text.Contains(term))
            {
                concepts.Add(term);
            }
        }

        return concepts.Take(10).ToList();
    }

    private string DetermineRelationshipType(ProcessedDocument doc1, ProcessedDocument doc2)
    {
        if (doc1.DocumentType == doc2.DocumentType)
            return "Similar Content";
        
        if (IsSequentialRelationship(doc1.DocumentType, doc2.DocumentType))
            return "Sequential";
            
        return "Complementary";
    }

    private bool IsSequentialRelationship(string type1, string type2)
    {
        var sequentialPairs = new[]
        {
            ("Business Requirements", "Technical Architecture"),
            ("Technical Architecture", "Infrastructure Documentation"),
            ("Infrastructure Documentation", "DevOps Documentation")
        };

        return sequentialPairs.Any(pair => 
            (pair.Item1 == type1 && pair.Item2 == type2) || 
            (pair.Item1 == type2 && pair.Item2 == type1));
    }

    private DocumentClassificationResult ParseClassificationResponse(string response, string documentText)
    {
        // Simple parsing - in production, use structured output
        var categories = new[]
        {
            "Business Requirements", "Technical Architecture", "Infrastructure Documentation",
            "Security Documentation", "Data Architecture", "DevOps Documentation",
            "Project Management", "Compliance & Governance"
        };

        var primaryCategory = categories.FirstOrDefault(cat => response.ToLower().Contains(cat.ToLower())) 
            ?? "Technical Documentation";

        return new DocumentClassificationResult
        {
            PrimaryCategory = primaryCategory,
            Confidence = 0.85,
            Predictions = categories.Take(3).Select(cat => new CategoryPrediction
            {
                Category = cat,
                Confidence = cat == primaryCategory ? 0.85 : 0.3,
                Reasoning = $"Document contains indicators for {cat}"
            }).ToList(),
            KeyIndicators = ExtractKeyIndicators(documentText, primaryCategory)
        };
    }

    private List<string> ExtractKeyIndicators(string text, string category)
    {
        var indicators = new List<string>();
        var lowerText = text.ToLower();

        var categoryIndicators = new Dictionary<string, string[]>
        {
            ["Business Requirements"] = new[] { "requirements", "objectives", "goals", "success criteria" },
            ["Technical Architecture"] = new[] { "architecture", "design", "components", "system" },
            ["Infrastructure Documentation"] = new[] { "servers", "infrastructure", "network", "hardware" },
            ["Security Documentation"] = new[] { "security", "compliance", "risk", "authentication" },
            ["Data Architecture"] = new[] { "database", "data", "schema", "etl" }
        };

        if (categoryIndicators.TryGetValue(category, out var keywords))
        {
            indicators.AddRange(keywords.Where(keyword => lowerText.Contains(keyword)));
        }

        return indicators.Take(5).ToList();
    }
}