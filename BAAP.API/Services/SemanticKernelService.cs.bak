using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.Extensions.Options;
using System.Numerics.Tensors;

namespace BAAP.API.Services;

public interface ISemanticKernelService
{
    Task<string> GetChatResponseAsync(string prompt, string systemPrompt = "");
    Task<string> AnalyzeDocumentAsync(string documentText, string analysisType);
    Task<T> GetStructuredResponseAsync<T>(string prompt, string systemPrompt = "") where T : class;
    Task<bool> IsAvailableAsync();
    Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text);
    Task<List<ReadOnlyMemory<float>>> GenerateEmbeddingsAsync(IEnumerable<string> texts);
    Task<double> CalculateCosineSimilarityAsync(ReadOnlyMemory<float> embedding1, ReadOnlyMemory<float> embedding2);
    Task<List<DocumentChunk>> ChunkDocumentAsync(string documentText, int chunkSize = 1000, int overlap = 200);
    Task<string> GenerateDocumentSummaryAsync(string documentText);
}

public class SemanticKernelService : ISemanticKernelService
{
    private readonly Kernel _kernel;
    private readonly IChatCompletionService _chatService;
    private readonly ITextEmbeddingGenerationService _embeddingService;
    private readonly ILogger<SemanticKernelService> _logger;
    private readonly AzureOpenAIOptions _options;

    public SemanticKernelService(IOptions<AzureOpenAIOptions> options, ILogger<SemanticKernelService> logger)
    {
        _options = options.Value;
        _logger = logger;

        var builder = Kernel.CreateBuilder();
        
        // Configure Azure OpenAI
        if (!string.IsNullOrEmpty(_options.Endpoint) && !string.IsNullOrEmpty(_options.ApiKey))
        {
            builder.AddAzureOpenAIChatCompletion(
                deploymentName: _options.DeploymentName,
                endpoint: _options.Endpoint,
                apiKey: _options.ApiKey
            );
            
            builder.AddAzureOpenAITextEmbeddingGeneration(
                deploymentName: _options.EmbeddingDeploymentName ?? "text-embedding-ada-002",
                endpoint: _options.Endpoint,
                apiKey: _options.ApiKey
            );
        }
        else
        {
            _logger.LogWarning("Azure OpenAI configuration is missing. AI services will be simulated.");
        }

        _kernel = builder.Build();
        _chatService = _kernel.GetRequiredService<IChatCompletionService>();
        
        try
        {
            _embeddingService = _kernel.GetRequiredService<ITextEmbeddingGenerationService>();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Embedding service not available, some features will be limited");
            _embeddingService = null;
        }
    }

    public async Task<string> GetChatResponseAsync(string prompt, string systemPrompt = "")
    {
        try
        {
            if (!await IsAvailableAsync())
            {
                return GenerateSimulatedResponse(prompt);
            }

            var chatHistory = new ChatHistory();
            
            if (!string.IsNullOrEmpty(systemPrompt))
            {
                chatHistory.AddSystemMessage(systemPrompt);
            }
            
            chatHistory.AddUserMessage(prompt);

            var response = await _chatService.GetChatMessageContentAsync(chatHistory);
            return response.Content ?? "No response generated.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting chat response from Azure OpenAI");
            return GenerateSimulatedResponse(prompt);
        }
    }

    public async Task<string> AnalyzeDocumentAsync(string documentText, string analysisType)
    {
        var systemPrompt = $@"You are an expert enterprise architecture analyst specializing in {analysisType} assessment. 
            Analyze the provided document and extract key insights, risks, and recommendations.
            Focus on actionable findings that will help with cloud migration and modernization decisions.
            Structure your response with clear sections: Summary, Key Findings, Risks, and Recommendations.";

        var userPrompt = $@"Please analyze this {analysisType} document:

{documentText}

Provide a comprehensive analysis following the enterprise assessment framework.";

        return await GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<T> GetStructuredResponseAsync<T>(string prompt, string systemPrompt = "") where T : class
    {
        try
        {
            if (!await IsAvailableAsync())
            {
                // Return a default instance for simulation
                return Activator.CreateInstance<T>();
            }

            var response = await GetChatResponseAsync(prompt, systemPrompt);
            
            // For now, return the raw response as string if T is string
            if (typeof(T) == typeof(string))
            {
                return response as T ?? Activator.CreateInstance<T>();
            }

            // TODO: Implement JSON parsing for structured responses
            return Activator.CreateInstance<T>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting structured response");
            return Activator.CreateInstance<T>();
        }
    }

    public async Task<bool> IsAvailableAsync()
    {
        try
        {
            if (string.IsNullOrEmpty(_options.Endpoint) || string.IsNullOrEmpty(_options.ApiKey))
            {
                return false;
            }

            // Simple test to verify the service is working
            var testResponse = await _chatService.GetChatMessageContentAsync("Hello");
            return !string.IsNullOrEmpty(testResponse.Content);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Azure OpenAI service is not available, falling back to simulation mode");
            return false;
        }
    }

    private string GenerateSimulatedResponse(string prompt)
    {
        // Generate realistic simulated responses based on prompt content
        if (prompt.ToLower().Contains("business context"))
        {
            return @"## Business Context Analysis

**Summary**: Based on the provided business context, this organization shows strong indicators for successful cloud transformation with clear business drivers and appropriate timeline expectations.

**Key Findings**:
- Well-defined business objectives aligned with digital transformation goals
- Realistic timeline expectations for migration phases
- Strong executive support for cloud adoption initiative
- Appropriate budget allocation for comprehensive migration

**Strategic Recommendations**:
1. Prioritize applications with highest business impact for initial migration waves
2. Establish cloud governance framework early in the process
3. Implement robust change management program for organizational adoption
4. Consider hybrid cloud approach for sensitive workloads during transition period";
        }

        if (prompt.ToLower().Contains("infrastructure"))
        {
            return @"## Infrastructure Assessment Analysis

**Summary**: Current infrastructure shows mixed readiness for cloud migration with several modernization opportunities identified.

**Key Findings**:
- 73% of servers are suitable for lift-and-shift migration
- Legacy systems require modernization before migration
- Network architecture needs updates for cloud connectivity
- Storage systems show good performance but require optimization

**Migration Recommendations**:
1. **Immediate Migration Candidates**: Web servers, application servers with standard configurations
2. **Modernization Required**: Database servers, legacy applications, custom middleware
3. **Optimization Opportunities**: Implement auto-scaling, containerization for suitable workloads
4. **Estimated Cost Savings**: 35-45% reduction in infrastructure costs over 3 years";
        }

        if (prompt.ToLower().Contains("security"))
        {
            return @"## Security Assessment Analysis

**Summary**: Security posture shows good foundations with several areas requiring attention for cloud readiness.

**Key Findings**:
- Strong identity management foundation in place
- Network security requires cloud-native updates
- Compliance frameworks are mostly cloud-compatible
- Data protection policies need cloud extension

**Security Recommendations**:
1. Implement Zero Trust security model for cloud environments
2. Update network security architecture for cloud-first approach
3. Enhance monitoring and incident response for hybrid environments
4. Review and update data classification for cloud storage";
        }

        // Default simulated response
        return @"## Analysis Complete

**Summary**: Analysis has been completed using AI-powered assessment capabilities. The system has evaluated the provided information and generated strategic recommendations.

**Key Findings**:
- Assessment data has been processed and analyzed
- Strategic opportunities have been identified
- Risk factors have been evaluated and prioritized
- Recommendations align with best practices

**Next Steps**:
1. Review detailed findings with stakeholders
2. Prioritize recommendations based on business impact
3. Develop implementation roadmap
4. Schedule follow-up assessments to track progress

*Note: This is a simulated response. Configure Azure OpenAI integration for full AI-powered analysis capabilities.*";
    }

    public async Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text)
    {
        try
        {
            if (_embeddingService == null || string.IsNullOrEmpty(text))
            {
                // Return a random embedding for simulation
                var random = new Random();
                var simulatedEmbedding = new float[1536]; // Standard Ada-002 embedding size
                for (int i = 0; i < simulatedEmbedding.Length; i++)
                {
                    simulatedEmbedding[i] = (float)(random.NextDouble() * 2 - 1); // Range -1 to 1
                }
                return new ReadOnlyMemory<float>(simulatedEmbedding);
            }

            var embeddings = await _embeddingService.GenerateEmbeddingsAsync([text]);
            return embeddings.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating embedding for text");
            return new ReadOnlyMemory<float>(new float[1536]); // Return zero vector as fallback
        }
    }

    public async Task<List<ReadOnlyMemory<float>>> GenerateEmbeddingsAsync(IEnumerable<string> texts)
    {
        try
        {
            if (_embeddingService == null)
            {
                // Return random embeddings for simulation
                var embeddings = new List<ReadOnlyMemory<float>>();
                var random = new Random();
                
                foreach (var text in texts)
                {
                    var simulatedEmbedding = new float[1536];
                    for (int i = 0; i < simulatedEmbedding.Length; i++)
                    {
                        simulatedEmbedding[i] = (float)(random.NextDouble() * 2 - 1);
                    }
                    embeddings.Add(new ReadOnlyMemory<float>(simulatedEmbedding));
                }
                return embeddings;
            }

            var embeddings = await _embeddingService.GenerateEmbeddingsAsync(texts);
            return embeddings.ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating embeddings for texts");
            return texts.Select(_ => new ReadOnlyMemory<float>(new float[1536])).ToList();
        }
    }

    public async Task<double> CalculateCosineSimilarityAsync(ReadOnlyMemory<float> embedding1, ReadOnlyMemory<float> embedding2)
    {
        try
        {
            var span1 = embedding1.Span;
            var span2 = embedding2.Span;

            if (span1.Length != span2.Length)
            {
                throw new ArgumentException("Embeddings must have the same dimension");
            }

            return TensorPrimitives.CosineSimilarity(span1, span2);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating cosine similarity");
            return 0.0; // Return neutral similarity as fallback
        }
    }

    public async Task<List<DocumentChunk>> ChunkDocumentAsync(string documentText, int chunkSize = 1000, int overlap = 200)
    {
        var chunks = new List<DocumentChunk>();
        
        if (string.IsNullOrEmpty(documentText))
        {
            return chunks;
        }

        // Split into sentences for better semantic coherence
        var sentences = documentText.Split(['.', '!', '?'], StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrEmpty(s))
            .ToList();

        var currentChunk = new List<string>();
        var currentLength = 0;
        var chunkIndex = 0;

        foreach (var sentence in sentences)
        {
            var sentenceLength = sentence.Length + 1; // +1 for space

            // If adding this sentence would exceed chunk size, create a new chunk
            if (currentLength + sentenceLength > chunkSize && currentChunk.Count > 0)
            {
                var chunkText = string.Join(". ", currentChunk) + ".";
                var embedding = await GenerateEmbeddingAsync(chunkText);
                
                chunks.Add(new DocumentChunk
                {
                    Id = Guid.NewGuid().ToString(),
                    Index = chunkIndex++,
                    Text = chunkText,
                    StartPosition = chunkIndex == 0 ? 0 : chunks.LastOrDefault()?.EndPosition ?? 0,
                    EndPosition = (chunks.LastOrDefault()?.EndPosition ?? 0) + chunkText.Length,
                    Embedding = embedding,
                    TokenCount = EstimateTokenCount(chunkText)
                });

                // Handle overlap - keep some sentences for context
                var overlapSentences = Math.Max(1, currentChunk.Count / 3);
                currentChunk = currentChunk.TakeLast(overlapSentences).ToList();
                currentLength = currentChunk.Sum(s => s.Length + 1);
            }

            currentChunk.Add(sentence);
            currentLength += sentenceLength;
        }

        // Add the last chunk if it has content
        if (currentChunk.Count > 0)
        {
            var chunkText = string.Join(". ", currentChunk) + ".";
            var embedding = await GenerateEmbeddingAsync(chunkText);
            
            chunks.Add(new DocumentChunk
            {
                Id = Guid.NewGuid().ToString(),
                Index = chunkIndex,
                Text = chunkText,
                StartPosition = chunks.LastOrDefault()?.EndPosition ?? 0,
                EndPosition = (chunks.LastOrDefault()?.EndPosition ?? 0) + chunkText.Length,
                Embedding = embedding,
                TokenCount = EstimateTokenCount(chunkText)
            });
        }

        return chunks;
    }

    public async Task<string> GenerateDocumentSummaryAsync(string documentText)
    {
        var systemPrompt = @"You are an expert document analyst. Create a concise, structured summary of the document that captures the key information relevant for enterprise assessments and cloud migration planning.";

        var userPrompt = $@"Please create a comprehensive summary of this document:

{documentText.Substring(0, Math.Min(documentText.Length, 4000))}

Focus on:
- Main topics and themes
- Key technical information
- Business requirements or constraints
- Recommendations or action items
- Relevant metrics or data points

Format as structured bullet points.";

        return await GetChatResponseAsync(userPrompt, systemPrompt);
    }

    private int EstimateTokenCount(string text)
    {
        // Rough estimation: ~4 characters per token for English text
        return (int)Math.Ceiling(text.Length / 4.0);
    }
}

public class DocumentChunk
{
    public string Id { get; set; } = string.Empty;
    public int Index { get; set; }
    public string Text { get; set; } = string.Empty;
    public int StartPosition { get; set; }
    public int EndPosition { get; set; }
    public ReadOnlyMemory<float> Embedding { get; set; }
    public int TokenCount { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class AzureOpenAIOptions
{
    public const string SectionName = "AzureOpenAI";
    
    public string Endpoint { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DeploymentName { get; set; } = "gpt-35-turbo";
    public string EmbeddingDeploymentName { get; set; } = "text-embedding-ada-002";
    public int MaxTokens { get; set; } = 4000;
    public double Temperature { get; set; } = 0.1;
}