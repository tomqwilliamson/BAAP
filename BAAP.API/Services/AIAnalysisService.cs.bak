using BAAP.API.Models;
using Microsoft.Extensions.Options;

namespace BAAP.API.Services;

public class AIAnalysisService : IAIAnalysisService
{
    private readonly ISemanticKernelService _semanticKernel;
    private readonly IDocumentProcessingService _documentProcessor;
    private readonly ILogger<AIAnalysisService> _logger;
    private readonly AIAnalysisOptions _options;

    public AIAnalysisService(
        ISemanticKernelService semanticKernel,
        IDocumentProcessingService documentProcessor,
        IOptions<AIAnalysisOptions> options,
        ILogger<AIAnalysisService> logger)
    {
        _semanticKernel = semanticKernel;
        _documentProcessor = documentProcessor;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<string> AnalyzeBusinessContextAsync(BusinessContextRequest request)
    {
        var systemPrompt = @"You are a senior enterprise architect specializing in digital transformation and cloud migration strategy. 
            Analyze the business context and provide strategic recommendations for cloud adoption.
            Focus on business alignment, risk mitigation, and value realization opportunities.";

        var userPrompt = $@"Analyze this business context for cloud migration planning:

Company: {request.CompanyName}
Industry: {request.Industry}
Business Drivers: {request.BusinessDrivers}
Timeline: {request.TimelineRequirements}
Budget: {request.BudgetConstraints}
Compliance Requirements: {request.ComplianceRequirements}

Provide analysis covering:
1. Business readiness assessment
2. Strategic alignment opportunities
3. Risk factors and mitigation strategies
4. Success criteria and KPIs
5. Organizational change management recommendations";

        // Process any uploaded documents
        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "business-context");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nAdditional context from uploaded documents:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeArchitectureAsync(ArchitectureAnalysisRequest request)
    {
        var systemPrompt = @"You are an expert solution architect with deep experience in application modernization and cloud-native architectures.
            Analyze the current architecture and provide modernization recommendations using the 6 R's framework:
            Rehost, Replatform, Refactor, Rearchitect, Rebuild, Replace.";

        var userPrompt = $@"Analyze this application architecture for cloud modernization:

Technology Stack: {request.TechnologyStack}
Integration Patterns: {request.IntegrationPatterns}
Code Repositories: {string.Join(", ", request.CodeRepositories)}

Provide detailed analysis covering:
1. Architecture assessment and complexity analysis
2. Modernization strategy using 6 R's framework
3. Technology stack recommendations
4. Integration and API strategy
5. Performance and scalability considerations
6. Security architecture improvements";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "architecture");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nArchitecture documentation analysis:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeInfrastructureAsync(InfrastructureAnalysisRequest request)
    {
        var systemPrompt = @"You are an infrastructure architect specializing in Azure cloud migrations and infrastructure optimization.
            Analyze the infrastructure and provide detailed migration recommendations with cost optimization opportunities.";

        var infrastructureDetails = SerializeInfrastructureAssets(request.Assets);
        
        var userPrompt = $@"Analyze this infrastructure for Azure cloud migration:

Infrastructure Assets:
{infrastructureDetails}

Azure Migrate Data: {request.AzureMigrateData}
Performance Metrics: {string.Join(", ", request.PerformanceMetrics)}

Provide comprehensive analysis covering:
1. Migration readiness assessment for each asset
2. Azure service mapping recommendations
3. Right-sizing and cost optimization opportunities
4. Performance benchmarking and improvement areas
5. Network and connectivity requirements
6. Migration wave planning and dependencies
7. Expected cost savings and ROI projections";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "infrastructure");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nInfrastructure documentation insights:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeDataArchitectureAsync(DataArchitectureAnalysisRequest request)
    {
        var systemPrompt = @"You are a data architect with expertise in cloud data platforms, data governance, and modern data architectures.
            Analyze the data landscape and provide modernization recommendations for Azure data services.";

        var databaseDetails = SerializeDatabaseSystems(request.Databases);

        var userPrompt = $@"Analyze this data architecture for cloud modernization:

Database Systems:
{databaseDetails}

Data Governance: {request.DataGovernance}
Data Flows: {request.DataFlows}

Provide detailed analysis covering:
1. Data platform modernization strategy
2. Azure data services mapping (SQL Database, Cosmos DB, Synapse, etc.)
3. Data migration complexity and approach
4. Data governance and compliance framework
5. Performance optimization opportunities
6. Data security and privacy recommendations
7. Modern analytics and BI capabilities";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "data-architecture");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nData architecture documentation:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeDevOpsAsync(DevOpsAnalysisRequest request)
    {
        var systemPrompt = @"You are a DevOps engineer with deep expertise in Azure DevOps, GitHub Actions, and modern CI/CD practices.
            Assess the current DevOps maturity and provide cloud-native DevOps transformation recommendations.";

        var userPrompt = $@"Analyze this DevOps environment for cloud transformation:

Build Processes: {request.BuildProcesses}
Deployment Pipelines: {request.DeploymentPipelines}
Testing Strategy: {request.TestingStrategy}
Monitoring Tools: {request.MonitoringTools}

Provide comprehensive analysis covering:
1. DevOps maturity assessment
2. CI/CD pipeline modernization recommendations
3. Azure DevOps or GitHub Actions implementation strategy
4. Infrastructure as Code (IaC) adoption plan
5. Testing automation and quality gates
6. Monitoring and observability improvements
7. Security integration (DevSecOps) recommendations";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "devops");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nDevOps documentation analysis:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeSecurityAsync(SecurityAnalysisRequest request)
    {
        var systemPrompt = @"You are a cybersecurity architect specializing in cloud security, Zero Trust architecture, and compliance frameworks.
            Assess the security posture and provide cloud security transformation recommendations.";

        var userPrompt = $@"Analyze this security landscape for cloud migration:

Security Policies: {string.Join(", ", request.SecurityPolicies)}
Access Controls: {request.AccessControls}
Compliance Frameworks: {request.ComplianceFrameworks}
Vulnerability Reports: {string.Join(", ", request.VulnerabilityReports)}

Provide detailed security analysis covering:
1. Current security posture assessment
2. Cloud security architecture recommendations
3. Zero Trust implementation strategy
4. Identity and access management modernization
5. Data protection and encryption strategy
6. Compliance framework alignment
7. Security monitoring and incident response improvements
8. DevSecOps integration recommendations";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "security");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nSecurity documentation insights:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> AnalyzeCloudReadinessAsync(CloudReadinessAnalysisRequest request)
    {
        var systemPrompt = @"You are a cloud migration specialist with expertise in comprehensive readiness assessments and migration planning.
            Synthesize all assessment data to provide an overall cloud readiness score and strategic migration roadmap.";

        var applicationDetails = SerializeApplicationProfiles(request.Applications);

        var userPrompt = $@"Analyze overall cloud readiness based on this comprehensive assessment data:

Applications:
{applicationDetails}

Dependency Mapping: {request.DependencyMapping}
Network Requirements: {request.NetworkRequirements}

Provide strategic cloud readiness analysis covering:
1. Overall cloud readiness score and assessment
2. Application portfolio analysis and prioritization
3. Migration wave planning with dependencies
4. Risk assessment and mitigation strategies
5. Resource and timeline estimation
6. Change management and training requirements
7. Success metrics and governance framework
8. Strategic roadmap with key milestones";

        var documentInsights = await ProcessUploadedDocumentsAsync(request.UploadedDocuments, "cloud-readiness");
        if (!string.IsNullOrEmpty(documentInsights))
        {
            userPrompt += $"\n\nCloud readiness documentation:\n{documentInsights}";
        }

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<string> GenerateRecommendationsAsync(FinalRecommendationsRequest request)
    {
        var systemPrompt = @"You are a senior enterprise architect and transformation leader with expertise in synthesizing complex assessments into actionable strategic recommendations.
            Create a comprehensive transformation strategy based on all assessment results.";

        var userPrompt = $@"Generate strategic recommendations based on this comprehensive assessment:

BUSINESS CONTEXT RESULTS:
{request.BusinessContextResults}

ARCHITECTURE ASSESSMENT:
{request.ArchitectureResults}

INFRASTRUCTURE ANALYSIS:
{request.InfrastructureResults}

DATA ARCHITECTURE REVIEW:
{request.DataResults}

DEVOPS ASSESSMENT:
{request.DevOpsResults}

SECURITY ANALYSIS:
{request.SecurityResults}

CLOUD READINESS EVALUATION:
{request.CloudReadinessResults}

Provide executive-level strategic recommendations covering:
1. **Executive Summary** - Key findings and strategic direction
2. **Strategic Roadmap** - Phased transformation approach with timelines
3. **Investment Prioritization** - ROI-based recommendation ranking
4. **Risk Mitigation Strategy** - Critical risks and mitigation plans
5. **Resource Requirements** - Skills, tools, and organizational needs
6. **Success Metrics** - KPIs and measurement framework
7. **Quick Wins** - Immediate opportunities for value realization
8. **Long-term Vision** - Future state architecture and capabilities
9. **Change Management** - Organizational transformation strategy
10. **Financial Projections** - Cost-benefit analysis and ROI timeline";

        return await _semanticKernel.GetChatResponseAsync(userPrompt, systemPrompt);
    }

    public async Task<DocumentProcessingResult> ProcessDocumentAsync(Stream documentStream, string fileName, string contentType)
    {
        return await _documentProcessor.ProcessDocumentAsync(documentStream, fileName, contentType);
    }

    public async Task<bool> IsServiceAvailableAsync()
    {
        return await _semanticKernel.IsAvailableAsync();
    }

    private async Task<string> ProcessUploadedDocumentsAsync(List<string> documentIds, string analysisContext)
    {
        if (!documentIds.Any())
            return string.Empty;

        var insights = new List<string>();
        
        foreach (var documentId in documentIds)
        {
            try
            {
                // In a real implementation, you would retrieve the document content from storage
                // For now, we'll simulate document processing
                var documentContent = $"Document {documentId} content for {analysisContext} analysis";
                var analysis = await _semanticKernel.AnalyzeDocumentAsync(documentContent, analysisContext);
                insights.Add($"Document {documentId}: {analysis}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing document {DocumentId}", documentId);
            }
        }

        return string.Join("\n\n", insights);
    }

    private string SerializeInfrastructureAssets(List<InfrastructureAsset> assets)
    {
        if (!assets.Any())
            return "No infrastructure assets provided.";

        var result = new List<string>();
        foreach (var asset in assets)
        {
            var specs = string.Join(", ", asset.Specifications.Select(kvp => $"{kvp.Key}: {kvp.Value}"));
            var metrics = string.Join(", ", asset.PerformanceMetrics.Select(kvp => $"{kvp.Key}: {kvp.Value}"));
            
            result.Add($"Asset: {asset.Name} ({asset.Type})\n  Specifications: {specs}\n  Performance: {metrics}");
        }
        
        return string.Join("\n\n", result);
    }

    private string SerializeDatabaseSystems(List<DatabaseSystem> databases)
    {
        if (!databases.Any())
            return "No database systems provided.";

        var result = new List<string>();
        foreach (var db in databases)
        {
            var config = string.Join(", ", db.Configuration.Select(kvp => $"{kvp.Key}: {kvp.Value}"));
            result.Add($"Database: {db.Name} ({db.Type} {db.Version})\n  Size: {db.SizeGB}GB\n  Configuration: {config}");
        }

        return string.Join("\n\n", result);
    }

    private string SerializeApplicationProfiles(List<ApplicationProfile> applications)
    {
        if (!applications.Any())
            return "No applications provided.";

        var result = new List<string>();
        foreach (var app in applications)
        {
            var dependencies = string.Join(", ", app.Dependencies);
            var details = string.Join(", ", app.TechnicalDetails.Select(kvp => $"{kvp.Key}: {kvp.Value}"));
            
            result.Add($"Application: {app.Name} ({app.Type})\n  Dependencies: {dependencies}\n  Details: {details}");
        }

        return string.Join("\n\n", result);
    }
}

public class AIAnalysisOptions
{
    public const string SectionName = "AIAnalysis";
    
    public int MaxDocumentSizeMB { get; set; } = 10;
    public int MaxDocumentsPerAnalysis { get; set; } = 5;
    public bool EnableSimulationMode { get; set; } = true;
    public int AnalysisTimeoutMinutes { get; set; } = 10;
}