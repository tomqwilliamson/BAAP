using Microsoft.AspNetCore.Mvc;
using BAAP.API.Services;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntelligenceController : ControllerBase
{
    private readonly IIntelligentRecommendationServiceClean _recommendationService;
    private readonly IMonitoringServiceClean _monitoringService;
    private readonly IRiskAssessmentServiceClean _riskService;
    private readonly ICostAnalysisServiceClean _costService;
    private readonly IPredictiveAnalyticsServiceClean _predictiveService;

    public IntelligenceController(
        IIntelligentRecommendationServiceClean recommendationService,
        IMonitoringServiceClean monitoringService,
        IRiskAssessmentServiceClean riskService,
        ICostAnalysisServiceClean costService,
        IPredictiveAnalyticsServiceClean predictiveService)
    {
        _recommendationService = recommendationService;
        _monitoringService = monitoringService;
        _riskService = riskService;
        _costService = costService;
        _predictiveService = predictiveService;
    }

    [HttpGet("recommendations/{assessmentId}")]
    public async Task<IActionResult> GetRecommendations(string assessmentId)
    {
        var context = new RecommendationContext();
        var result = await _recommendationService.GenerateRecommendationsAsync(assessmentId, context);
        return Ok(result);
    }

    [HttpGet("dashboard/{assessmentId}")]
    public async Task<IActionResult> GetDashboard(string assessmentId, [FromQuery] DashboardType dashboardType = DashboardType.Executive)
    {
        var dashboard = await _monitoringService.GetDashboardAsync(assessmentId, dashboardType);
        return Ok(dashboard);
    }

    [HttpGet("risks/{assessmentId}")]
    public async Task<IActionResult> GetRiskAssessment(string assessmentId)
    {
        var parameters = new RiskAssessmentParameters { AssessmentId = assessmentId };
        var risks = await _riskService.AssessProjectRisksAsync(assessmentId, parameters);
        return Ok(risks);
    }

    [HttpGet("costs/{assessmentId}")]
    public async Task<IActionResult> GetCostAnalysis(string assessmentId)
    {
        var parameters = new CostAnalysisParameters();
        var costs = await _costService.AnalyzeCostsAsync(assessmentId, parameters);
        return Ok(costs);
    }

    [HttpGet("predictions/{assessmentId}")]
    public async Task<IActionResult> GetPredictions(string assessmentId)
    {
        var timeline = await _predictiveService.PredictMigrationTimelineAsync(assessmentId);
        return Ok(timeline);
    }

    [HttpGet("health")]
    public IActionResult GetHealth()
    {
        return Ok(new { 
            Status = "Healthy", 
            Message = "Intelligence services are operational",
            Services = new[]
            {
                "CleanIntelligentRecommendationService",
                "CleanMonitoringService", 
                "CleanRiskAssessmentService",
                "CleanCostAnalysisService",
                "CleanPredictiveAnalyticsService"
            }
        });
    }
}