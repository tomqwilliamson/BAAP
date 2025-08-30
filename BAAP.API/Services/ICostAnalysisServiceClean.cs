using BAAP.API.Models;
using BAAP.API.Data;

namespace BAAP.API.Services;

public interface ICostAnalysisServiceClean
{
    Task<CostAnalysisResult> AnalyzeCostsAsync(string assessmentId, CostAnalysisParameters parameters);
    Task<ROIAnalysis> CalculateROIAsync(string assessmentId, ROIParameters parameters);
    Task<CloudCostPrediction> PredictCloudCostsAsync(string assessmentId, CloudCostParameters parameters);
    Task<CostOptimizationRecommendations> GenerateCostOptimizationsAsync(string assessmentId);
    Task<CostComparison> CompareDeploymentCostsAsync(string assessmentId, List<string> deploymentOptions);
}