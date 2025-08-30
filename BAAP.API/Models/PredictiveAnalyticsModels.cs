namespace BAAP.API.Models;

// Core prediction models
public class MigrationTimelinePrediction
{
    public string AssessmentId { get; set; } = string.Empty;
    public TimeSpan OptimisticTimeline { get; set; }
    public TimeSpan RealisticTimeline { get; set; }
    public TimeSpan PessimisticTimeline { get; set; }
    public Dictionary<string, TimeSpan> PhaseBreakdown { get; set; } = new();
    public double ConfidenceScore { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string AIInsights { get; set; } = string.Empty;
}

public class TimelineScenario
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeSpan TotalDuration { get; set; }
    public double Probability { get; set; }
    public List<string> KeyAssumptions { get; set; } = new();
    public RiskLevel RiskLevel { get; set; }
    public double ResourceEfficiency { get; set; }
    public List<CriticalActivity> PhaseBreakdown { get; set; } = new();
    public List<DateTime> MilestoneDates { get; set; } = new();
}

public class TimelineParameters
{
    public int TeamSize { get; set; }
    public double ResourceAvailability { get; set; }
    public List<string> PreferredTechnologies { get; set; } = new();
    public OptimizationGoal OptimizationGoal { get; set; }
    public double RiskTolerance { get; set; }
}

// Critical path analysis
public class CriticalPathAnalysis
{
    public TimeSpan TotalDuration { get; set; }
    public List<CriticalActivity> CriticalActivities { get; set; } = new();
    public List<string> Bottlenecks { get; set; } = new();
    public List<string> ParallelizationOpportunities { get; set; } = new();
    public List<string> ResourceConstraints { get; set; } = new();
    public List<string> OptimizationSuggestions { get; set; } = new();
    public DateTime AnalysisDate { get; set; }
}

public class CriticalActivity
{
    public string Name { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public List<string> Dependencies { get; set; } = new();
    public string Phase { get; set; } = string.Empty;
    public ResourceType ResourceRequirement { get; set; }
    public bool IsCritical { get; set; }
    public TimeSpan BufferTime { get; set; }
}

// Bottleneck identification
public class MigrationBottleneck
{
    public BottleneckType Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public BottleneckImpact Impact { get; set; }
    public List<string> AffectedApplications { get; set; } = new();
    public TimeSpan EstimatedDelay { get; set; }
    public List<string> MitigationStrategies { get; set; } = new();
}

// Timeline optimization
public class TimelineOptimizationSuggestions
{
    public List<OptimizationSuggestion> Suggestions { get; set; } = new();
    public TimeSpan PotentialTimeSavings { get; set; }
    public OptimizationComplexity ImplementationComplexity { get; set; }
    public string RecommendedApproach { get; set; } = string.Empty;
    public string RiskAssessment { get; set; } = string.Empty;
    public string CostBenefitAnalysis { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
}

public class OptimizationSuggestion
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeSpan EstimatedTimeSavings { get; set; }
    public OptimizationComplexity ImplementationComplexity { get; set; }
    public double CostImpact { get; set; }
    public List<string> Prerequisites { get; set; } = new();
    public List<string> Risks { get; set; } = new();
    public int Priority { get; set; }
}

public class OptimizationCriteria
{
    public OptimizationGoal OptimizeFor { get; set; }
    public double MaxCostIncrease { get; set; }
    public double RiskTolerance { get; set; }
    public int MinTimeSavingsDays { get; set; }
    public List<string> ConstrainedResources { get; set; } = new();
}

// Resource prediction
public class ResourceAllocationPrediction
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime PredictionDate { get; set; }
    public TimeSpan TimelineDuration { get; set; }
    public List<PhaseResourceRequirement> PhaseResources { get; set; } = new();
    public ResourceRequirement TotalResourceRequirement { get; set; } = new();
    public ResourceRequirement PeakResourceRequirement { get; set; } = new();
    public List<SkillGap> SkillGapAnalysis { get; set; } = new();
}

public class PhaseResourceRequirement
{
    public string Phase { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public List<ResourceNeed> ResourceNeeds { get; set; } = new();
    public double ParallelizationFactor { get; set; } = 1.0;
}

public class ResourceNeed
{
    public string Role { get; set; } = string.Empty;
    public double FTE { get; set; }
    public ResourceCriticality Criticality { get; set; }
    public List<string> SkillsRequired { get; set; } = new();
    public string AlternativeRoles { get; set; } = string.Empty;
}

public class ResourceRequirement
{
    public Dictionary<string, double> RoleRequirements { get; set; } = new();
    public double TotalFTE { get; set; }
    public TimeSpan Duration { get; set; }
    public double UtilizationRate { get; set; }
}

public class SkillGap
{
    public string Skill { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int RequiredLevel { get; set; }
    public int CurrentLevel { get; set; }
    public int GapSize => RequiredLevel - CurrentLevel;
    public List<string> TrainingOptions { get; set; } = new();
    public List<string> ExternalSources { get; set; } = new();
}

public class ResourceConstraint
{
    public string ResourceType { get; set; } = string.Empty;
    public double AvailableCapacity { get; set; }
    public double RequiredCapacity { get; set; }
    public double UtilizationRate => RequiredCapacity / AvailableCapacity;
    public TimeSpan ConstraintPeriod { get; set; }
}

// Milestone prediction
public class MilestonePrediction
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PredictedDate { get; set; }
    public double Confidence { get; set; }
    public bool CriticalPath { get; set; }
    public List<string> Dependencies { get; set; } = new();
    public List<string> SuccessCriteria { get; set; } = new();
    public List<TimelineRisk> Risks { get; set; } = new();
}

// Risk assessment
public class TimelineRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public double OverallRiskScore { get; set; }
    public RiskLevel RiskLevel { get; set; }
    public List<TimelineRisk> IdentifiedRisks { get; set; } = new();
    public RiskMitigationPlan MitigationPlan { get; set; } = new();
    public List<string> ContingencyRecommendations { get; set; } = new();
    public RiskMonitoringStrategy MonitoringStrategy { get; set; } = new();
    public DateTime AssessmentDate { get; set; }
}

public class TimelineRisk
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RiskCategory Category { get; set; }
    public RiskImpact Impact { get; set; }
    public double Probability { get; set; }
    public TimeSpan EstimatedDelay { get; set; }
    public List<string> MitigationStrategies { get; set; } = new();
    public List<string> EarlyWarningIndicators { get; set; } = new();
    public string Owner { get; set; } = string.Empty;
}

public class RiskMitigationPlan
{
    public List<MitigationAction> Actions { get; set; } = new();
    public Dictionary<RiskLevel, List<string>> ResponseStrategies { get; set; } = new();
    public List<ContingencyPlan> ContingencyPlans { get; set; } = new();
    public RiskMonitoringFrequency MonitoringFrequency { get; set; }
}

public class MitigationAction
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public DateTime TargetDate { get; set; }
    public MitigationStatus Status { get; set; }
    public double EffectivenessRating { get; set; }
}

public class ContingencyPlan
{
    public string TriggerCondition { get; set; } = string.Empty;
    public List<string> Actions { get; set; } = new();
    public List<string> ResourceRequirements { get; set; } = new();
    public TimeSpan ActivationTime { get; set; }
    public double CostImpact { get; set; }
}

public class RiskMonitoringStrategy
{
    public Dictionary<string, List<string>> RiskIndicators { get; set; } = new();
    public Dictionary<string, RiskMonitoringFrequency> MonitoringFrequency { get; set; } = new();
    public List<string> EscalationProcedures { get; set; } = new();
    public List<string> ReportingSchedule { get; set; } = new();
}

// Supporting enums
public enum MitigationStatus
{
    NotStarted,
    InProgress,
    Completed,
    OnHold,
    Cancelled
}

public enum RiskMonitoringFrequency
{
    Daily,
    Weekly,
    Biweekly,
    Monthly,
    Quarterly
}

// Additional missing model classes
public class ResourceOptimization
{
    public string ResourceType { get; set; } = string.Empty;
    public string CurrentConfiguration { get; set; } = string.Empty;
    public string OptimizedConfiguration { get; set; } = string.Empty;
    public double EstimatedSavings { get; set; }
    public OptimizationComplexity Complexity { get; set; }
}

public class ResourceOptimizationPrediction
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<ResourceOptimization> OptimizedResources { get; set; } = new();
    public double TotalSavings { get; set; }
    public string PerformanceImpact { get; set; } = string.Empty;
}

public class PerformanceBottleneck
{
    public string ComponentName { get; set; } = string.Empty;
    public BottleneckType Type { get; set; }
    public BottleneckImpact Impact { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> RecommendedActions { get; set; } = new();
}

public class ScalingRecommendation
{
    public string AssessmentId { get; set; } = string.Empty;
    public TimeSpan ForecastPeriod { get; set; }
    public List<ScalingAction> RecommendedActions { get; set; } = new();
    public double ConfidenceScore { get; set; }
}

public class ScalingAction
{
    public string ActionType { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public string RecommendedChange { get; set; } = string.Empty;
    public DateTime RecommendedDate { get; set; }
}

public class PredictiveAlert
{
    public string Id { get; set; } = string.Empty;
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public double PredictedProbability { get; set; }
    public DateTime PredictedDate { get; set; }
    public RiskLevel Severity { get; set; }
}

// TrendAnalysis is defined in MonitoringModels.cs