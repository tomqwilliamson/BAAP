using BAAP.API.Models;

namespace BAAP.API.Services;

public interface IAIAnalysisService
{
    Task<string> AnalyzeBusinessContextAsync(BusinessContextRequest request);
    Task<string> AnalyzeArchitectureAsync(ArchitectureAnalysisRequest request);
    Task<string> AnalyzeInfrastructureAsync(InfrastructureAnalysisRequest request);
    Task<string> AnalyzeDataArchitectureAsync(DataArchitectureAnalysisRequest request);
    Task<string> AnalyzeDevOpsAsync(DevOpsAnalysisRequest request);
    Task<string> AnalyzeSecurityAsync(SecurityAnalysisRequest request);
    Task<string> AnalyzeCloudReadinessAsync(CloudReadinessAnalysisRequest request);
    Task<string> GenerateRecommendationsAsync(FinalRecommendationsRequest request);
    Task<DocumentProcessingResult> ProcessDocumentAsync(Stream documentStream, string fileName, string contentType);
    Task<bool> IsServiceAvailableAsync();
}

public class BusinessContextRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string BusinessDrivers { get; set; } = string.Empty;
    public string TimelineRequirements { get; set; } = string.Empty;
    public string BudgetConstraints { get; set; } = string.Empty;
    public string ComplianceRequirements { get; set; } = string.Empty;
    public List<string> UploadedDocuments { get; set; } = new();
}

public class ArchitectureAnalysisRequest
{
    public List<string> CodeRepositories { get; set; } = new();
    public List<string> ArchitectureDiagrams { get; set; } = new();
    public string TechnologyStack { get; set; } = string.Empty;
    public string IntegrationPatterns { get; set; } = string.Empty;
    public List<string> UploadedDocuments { get; set; } = new();
}

public class InfrastructureAnalysisRequest
{
    public List<InfrastructureAsset> Assets { get; set; } = new();
    public string AzureMigrateData { get; set; } = string.Empty;
    public List<string> PerformanceMetrics { get; set; } = new();
    public List<string> UploadedDocuments { get; set; } = new();
}

public class DataArchitectureAnalysisRequest
{
    public List<DatabaseSystem> Databases { get; set; } = new();
    public string DataGovernance { get; set; } = string.Empty;
    public string DataFlows { get; set; } = string.Empty;
    public List<string> UploadedDocuments { get; set; } = new();
}

public class DevOpsAnalysisRequest
{
    public string BuildProcesses { get; set; } = string.Empty;
    public string DeploymentPipelines { get; set; } = string.Empty;
    public string TestingStrategy { get; set; } = string.Empty;
    public string MonitoringTools { get; set; } = string.Empty;
    public List<string> UploadedDocuments { get; set; } = new();
}

public class SecurityAnalysisRequest
{
    public List<string> SecurityPolicies { get; set; } = new();
    public string AccessControls { get; set; } = string.Empty;
    public string ComplianceFrameworks { get; set; } = string.Empty;
    public List<string> VulnerabilityReports { get; set; } = new();
    public List<string> UploadedDocuments { get; set; } = new();
}

public class CloudReadinessAnalysisRequest
{
    public List<ApplicationProfile> Applications { get; set; } = new();
    public string DependencyMapping { get; set; } = string.Empty;
    public string NetworkRequirements { get; set; } = string.Empty;
    public List<string> UploadedDocuments { get; set; } = new();
}

public class FinalRecommendationsRequest
{
    public string BusinessContextResults { get; set; } = string.Empty;
    public string ArchitectureResults { get; set; } = string.Empty;
    public string InfrastructureResults { get; set; } = string.Empty;
    public string DataResults { get; set; } = string.Empty;
    public string DevOpsResults { get; set; } = string.Empty;
    public string SecurityResults { get; set; } = string.Empty;
    public string CloudReadinessResults { get; set; } = string.Empty;
}

public class DocumentProcessingResult
{
    public bool Success { get; set; }
    public string ExtractedText { get; set; } = string.Empty;
    public List<string> KeyFindings { get; set; } = new();
    public string DocumentType { get; set; } = string.Empty;
    public string ProcessingError { get; set; } = string.Empty;
}

public class InfrastructureAsset
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public Dictionary<string, object> Specifications { get; set; } = new();
    public Dictionary<string, double> PerformanceMetrics { get; set; } = new();
}

public class DatabaseSystem
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public long SizeGB { get; set; }
    public Dictionary<string, object> Configuration { get; set; } = new();
}

public class ApplicationProfile
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<string> Dependencies { get; set; } = new();
    public Dictionary<string, string> TechnicalDetails { get; set; } = new();
}