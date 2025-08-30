using BAAP.API.Models;
using BAAP.API.Data;

namespace BAAP.API.Services;

public interface IPredictiveAnalyticsServiceClean
{
    Task<MigrationTimelinePrediction> PredictMigrationTimelineAsync(string assessmentId);
    Task<ResourceOptimizationPrediction> PredictResourceOptimizationsAsync(string assessmentId);
    Task<List<PerformanceBottleneck>> PredictBottlenecksAsync(string assessmentId);
    Task<ScalingRecommendation> PredictScalingNeedsAsync(string assessmentId, TimeSpan forecastPeriod);
    Task<List<PredictiveAlert>> GeneratePredictiveAlertsAsync(string assessmentId);
    Task<TrendAnalysis> AnalyzeTrendsAsync(string assessmentId, TimeSpan period);
}