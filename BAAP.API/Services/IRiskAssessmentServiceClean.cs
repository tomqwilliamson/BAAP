using BAAP.API.Models;

namespace BAAP.API.Services;

public interface IRiskAssessmentServiceClean
{
    Task<ComprehensiveRiskAssessment> AssessProjectRisksAsync(string assessmentId, RiskAssessmentParameters parameters);
    Task<List<RiskScenario>> GenerateRiskScenariosAsync(string assessmentId);
    Task<RiskMitigationStrategy> DevelopMitigationStrategyAsync(string assessmentId, List<ProjectRisk> prioritizedRisks);
    Task<RiskMonitoringPlan> CreateMonitoringPlanAsync(string assessmentId, List<ProjectRisk> risks);
    Task<ComplianceRiskAssessment> AssessComplianceRisksAsync(string assessmentId, ComplianceParameters parameters);
    Task<SecurityRiskAssessment> AssessSecurityRisksAsync(string assessmentId);
    Task<BusinessRiskAssessment> AssessBusinessRisksAsync(string assessmentId);
    Task<TechnicalRiskAssessment> AssessTechnicalRisksAsync(string assessmentId);
    Task<List<RiskTrend>> GetRiskTrendsAsync(string assessmentId, TimeSpan period);
    Task<RiskHeatMap> GenerateRiskHeatMapAsync(string assessmentId);
}