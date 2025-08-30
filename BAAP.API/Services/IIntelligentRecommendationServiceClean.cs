using BAAP.API.Models;
using BAAP.API.Data;

namespace BAAP.API.Services;

public interface IIntelligentRecommendationServiceClean
{
    Task<RecommendationResult> GenerateRecommendationsAsync(string assessmentId, RecommendationContext context);
    Task<List<StrategicRecommendation>> GetStrategicRecommendationsAsync(string assessmentId);
    Task<List<TacticalRecommendation>> GetTacticalRecommendationsAsync(string assessmentId);
    Task<List<PersonalizedRecommendation>> GetPersonalizedRecommendationsAsync(string userId, string assessmentId);
    Task<RecommendationAnalysis> AnalyzeRecommendationEffectivenessAsync(string assessmentId);
    Task<List<RecommendationTrend>> GetRecommendationTrendsAsync(string assessmentId, TimeSpan period);
    Task UpdateRecommendationFeedbackAsync(string recommendationId, RecommendationFeedback feedback);
}