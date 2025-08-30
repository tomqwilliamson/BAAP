namespace BAAP.API.Models;

// Core recommendation models
public class RecommendationResult
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime GeneratedDate { get; set; }
    public RecommendationContext Context { get; set; } = new();
    public List<StrategicRecommendation> StrategicRecommendations { get; set; } = new();
    public List<TacticalRecommendation> TacticalRecommendations { get; set; } = new();
    public List<PersonalizedRecommendation> PersonalizedRecommendations { get; set; } = new();
    public string AIInsights { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public BusinessImpactSummary ExpectedBusinessImpact { get; set; } = new();
    public RecommendationRoadmap ImplementationRoadmap { get; set; } = new();
    public List<SuccessMetric> SuccessMetrics { get; set; } = new();
    public DateTime NextReviewDate { get; set; }
}

public class RecommendationContext
{
    public string UserId { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
    public ExperienceLevel Experience { get; set; } = ExperienceLevel.Intermediate;
    public OrganizationSize OrganizationSize { get; set; } = OrganizationSize.Medium;
    public string Industry { get; set; } = string.Empty;
    public RiskTolerance RiskTolerance { get; set; } = RiskTolerance.Medium;
    public BudgetConstraints BudgetConstraints { get; set; } = BudgetConstraints.Standard;
    public TimelinePressure TimelinePressure { get; set; } = TimelinePressure.Moderate;
    public RecommendationFocus Focus { get; set; } = RecommendationFocus.Balanced;
    public List<string> PriorityAreas { get; set; } = new();
    public Dictionary<string, object> CustomAttributes { get; set; } = new();
}

// Base recommendation class
public abstract class BaseRecommendation
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RecommendationCategory Category { get; set; }
    public RecommendationPriority Priority { get; set; }
    public BusinessImpactLevel BusinessImpact { get; set; }
    public ImplementationComplexity ImplementationComplexity { get; set; }
    public int TimelineWeeks { get; set; }
    public double ConfidenceScore { get; set; }
    public string BusinessJustification { get; set; } = string.Empty;
    public List<string> Benefits { get; set; } = new();
    public List<string> Risks { get; set; } = new();
    public List<string> Prerequisites { get; set; } = new();
    public List<string> Dependencies { get; set; } = new();
    public double EstimatedCost { get; set; }
    public double EstimatedSavings { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
    public RecommendationStatus Status { get; set; } = RecommendationStatus.New;
    
    // ML scoring fields
    public double RelevanceScore { get; set; }
    public double FeasibilityScore { get; set; }
    public double ImpactScore { get; set; }
    public double OverallScore { get; set; }
}

// Strategic recommendations
public class StrategicRecommendation : BaseRecommendation
{
    public StrategicAlignment StrategicAlignment { get; set; }
    public InnovationPotential InnovationPotential { get; set; }
    public CompetitiveAdvantage CompetitiveAdvantage { get; set; }
    public List<BusinessDriver> AlignedBusinessDrivers { get; set; } = new();
    public List<KPI> TargetKPIs { get; set; } = new();
    public MarketImpact MarketImpact { get; set; } = new();
    public string VisionAlignment { get; set; } = string.Empty;
    public List<StrategicOutcome> ExpectedOutcomes { get; set; } = new();
}

// Tactical recommendations
public class TacticalRecommendation : BaseRecommendation
{
    public List<ExecutionStep> ExecutionSteps { get; set; } = new();
    public List<ResourceRequirement> ResourceRequirements { get; set; } = new();
    public List<string> Tools { get; set; } = new();
    public List<string> Technologies { get; set; } = new();
    public QualityGate QualityGates { get; set; } = new();
    public TestingStrategy TestingStrategy { get; set; } = new();
    public RollbackPlan RollbackPlan { get; set; } = new();
    public MonitoringRequirements MonitoringRequirements { get; set; } = new();
    public ComplianceConsiderations ComplianceConsiderations { get; set; } = new();
}

// Personalized recommendations
public class PersonalizedRecommendation
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public BaseRecommendation BaseRecommendation { get; set; } = new StrategicRecommendation();
    public string PersonalizationReason { get; set; } = string.Empty;
    public double UserRelevance { get; set; }
    public string CustomizedContent { get; set; } = string.Empty;
    public List<PersonalizedInsight> Insights { get; set; } = new();
    public CommunicationStyle PreferredCommunication { get; set; }
    public List<string> NextActions { get; set; } = new();
    public List<LearningResource> SuggestedResources { get; set; } = new();
    public DateTime LastViewed { get; set; }
    public bool IsBookmarked { get; set; }
    public UserEngagement UserEngagement { get; set; } = new();
}

// Feedback and learning models
public class RecommendationFeedback
{
    public string Id { get; set; } = string.Empty;
    public string RecommendationId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5 scale
    public string Comments { get; set; } = string.Empty;
    public ImplementationStatus ImplementationStatus { get; set; }
    public BusinessImpact BusinessImpact { get; set; }
    public List<string> ChallengesFaced { get; set; } = new();
    public List<string> UnexpectedBenefits { get; set; } = new();
    public DateTime SubmittedDate { get; set; }
    public bool IsVerified { get; set; }
    public string VerificationNotes { get; set; } = string.Empty;
}

public class UserFeedback
{
    public string UserId { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comments { get; set; } = string.Empty;
    public ImplementationStatus ImplementationStatus { get; set; }
    public BusinessImpact BusinessImpact { get; set; }
    public List<string> Tags { get; set; } = new();
}

// ML and AI models
public class RecommendationEngine
{
    public DateTime LastUpdated { get; set; }
    public int FeedbackProcessed { get; set; }
    public double ModelAccuracy { get; set; }
    public List<string> TopFeatures { get; set; } = new();
    public Dictionary<string, double> RecommendationWeights { get; set; } = new();
    public Dictionary<string, double> PersonalizationFactors { get; set; } = new();
    public Dictionary<string, double> ConfidenceThresholds { get; set; } = new();
    public List<ModelMetric> PerformanceMetrics { get; set; } = new();
    public string Version { get; set; } = "1.0";
    public DateTime NextRetrainingDate { get; set; }
}

// Insights and analytics
public class RecommendationInsight
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public InsightCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> KeyFindings { get; set; } = new();
    public List<string> ActionItems { get; set; } = new();
    public BusinessImpactLevel BusinessImpact { get; set; }
    public UrgencyLevel Urgency { get; set; }
    public double ConfidenceLevel { get; set; }
    public List<string> SupportingData { get; set; } = new();
    public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
    public List<Trend> RelatedTrends { get; set; } = new();
}

public class RecommendationTrend
{
    public string AssessmentId { get; set; } = string.Empty;
    public TimeSpan AnalysisPeriod { get; set; }
    public DateTime GeneratedDate { get; set; }
    public List<TrendIndicator> TrendIndicators { get; set; } = new();
    public List<RecommendationChange> RecommendationEvolution { get; set; } = new();
    public AccuracyMetrics AccuracyMetrics { get; set; } = new();
    public List<PredictedTrend> PredictedTrends { get; set; } = new();
    public SeasonalPatterns SeasonalPatterns { get; set; } = new();
    public List<AnomalyDetection> Anomalies { get; set; } = new();
}

// Automation models
public class AutomatedRecommendation
{
    public string AssessmentId { get; set; } = string.Empty;
    public AutomationLevel AutomationLevel { get; set; }
    public DateTime GeneratedDate { get; set; }
    public List<AutomatedAction> AutomatedActions { get; set; } = new();
    public bool RequiresApproval { get; set; }
    public double ConfidenceThreshold { get; set; }
    public AutomationExecutionPlan ExecutionPlan { get; set; } = new();
    public List<AutomationRule> Rules { get; set; } = new();
    public SafeguardMeasures Safeguards { get; set; } = new();
    public AuditTrail AuditTrail { get; set; } = new();
}

public class AutomatedAction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ActionType Type { get; set; }
    public List<ActionParameter> Parameters { get; set; } = new();
    public List<string> Preconditions { get; set; } = new();
    public List<string> PostConditions { get; set; } = new();
    public double ConfidenceScore { get; set; }
    public RiskLevel RiskLevel { get; set; }
    public bool RequiresHumanApproval { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
    public AutomationStatus Status { get; set; } = AutomationStatus.Pending;
}

// Impact prediction models
public class RecommendationImpact
{
    public string RecommendationId { get; set; } = string.Empty;
    public DateTime PredictionDate { get; set; }
    public double SuccessProbability { get; set; }
    public FinancialImpact FinancialImpact { get; set; } = new();
    public OperationalImpact OperationalImpact { get; set; } = new();
    public TechnicalImpact TechnicalImpact { get; set; } = new();
    public StrategicImpact StrategicImpact { get; set; } = new();
    public List<RiskFactor> RiskFactors { get; set; } = new();
    public List<SuccessFactor> SuccessFactors { get; set; } = new();
    public string AIAnalysis { get; set; } = string.Empty;
    public double ConfidenceLevel { get; set; }
    public ImpactTimeframe Timeframe { get; set; } = new();
}

public class ImplementationContext
{
    public OrganizationSize OrganizationSize { get; set; }
    public string Industry { get; set; } = string.Empty;
    public TimeSpan PlannedTimeline { get; set; }
    public ResourceAvailability ResourceAvailability { get; set; }
    public ChangeReadiness ChangeReadiness { get; set; }
    public List<string> Constraints { get; set; } = new();
    public List<string> Enablers { get; set; } = new();
}

// Supporting models
public class BusinessImpactSummary
{
    public double TotalCostSavings { get; set; }
    public double TotalImplementationCost { get; set; }
    public double NetBenefit { get; set; }
    public int ROIMonths { get; set; }
    public EfficiencyGains EfficiencyGains { get; set; } = new();
    public List<BusinessMetricImprovement> MetricImprovements { get; set; } = new();
    public CompetitiveAdvantageGain CompetitiveAdvantage { get; set; } = new();
}

public class RecommendationRoadmap
{
    public List<RoadmapPhase> Phases { get; set; } = new();
    public List<RoadmapMilestone> Milestones { get; set; } = new();
    public List<RoadmapDependency> Dependencies { get; set; } = new();
    public TimeSpan TotalDuration { get; set; }
    public List<ResourceAllocation> ResourcePlan { get; set; } = new();
    public List<RoadmapRisk> Risks { get; set; } = new();
}

public class SuccessMetric
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MetricType Type { get; set; }
    public double BaselineValue { get; set; }
    public double TargetValue { get; set; }
    public string Unit { get; set; } = string.Empty;
    public MeasurementFrequency Frequency { get; set; }
    public string DataSource { get; set; } = string.Empty;
    public List<string> CollectionMethods { get; set; } = new();
}

public class UserProfile
{
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    public List<string> SkillAreas { get; set; } = new();
    public List<string> Interests { get; set; } = new();
    public UserPreferences Preferences { get; set; } = new();
    public List<string> RecentActivities { get; set; } = new();
    public Dictionary<string, double> PersonalizationScores { get; set; } = new();
}

public class UserPreferences
{
    public CommunicationStyle CommunicationStyle { get; set; }
    public DetailLevel DetailLevel { get; set; }
    public NotificationFrequency NotificationFrequency { get; set; }
    public List<RecommendationCategory> PreferredCategories { get; set; } = new();
    public List<string> ExcludedTopics { get; set; } = new();
    public bool AutoImplementation { get; set; } = false;
    public double RiskTolerance { get; set; } = 0.5;
}

// Impact models
public class FinancialImpact
{
    public double CostSavings { get; set; }
    public double Implementation { get; set; }
    public double NetBenefit { get; set; }
    public int ROIMonths { get; set; }
    public CashFlowProjection CashFlow { get; set; } = new();
    public List<CostComponent> CostBreakdown { get; set; } = new();
}

public class OperationalImpact
{
    public double EfficiencyGain { get; set; }
    public ProcessChangeScope ProcessChangeScope { get; set; }
    public DisruptionLevel DisruptionLevel { get; set; }
    public UserImpactLevel UserImpact { get; set; }
    public List<ProcessChange> ProcessChanges { get; set; } = new();
    public TrainingRequirements Training { get; set; } = new();
}

public class TechnicalImpact
{
    public double PerformanceImprovement { get; set; }
    public ComplexityChange ComplexityChange { get; set; }
    public MaintenanceImpact MaintenanceImpact { get; set; }
    public ScalabilityGain ScalabilityGain { get; set; }
    public List<TechnicalMetricChange> MetricChanges { get; set; } = new();
    public ArchitectureImplications Architecture { get; set; } = new();
}

public class StrategicImpact
{
    public InnovationPotential Innovation { get; set; }
    public CompetitiveAdvantage Competitive { get; set; }
    public MarketPositioning Market { get; set; } = new();
    public CapabilityEnhancement Capabilities { get; set; } = new();
    public List<StrategicObjective> AlignedObjectives { get; set; } = new();
}

// Enums
public enum RecommendationCategory
{
    Strategy,
    Technology,
    Process,
    Cost,
    Risk,
    Security,
    Compliance,
    Performance,
    Optimization,
    Innovation
}

public enum RecommendationPriority
{
    Low,
    Medium,
    High,
    Critical
}

public enum BusinessImpactLevel
{
    Low,
    Medium,
    High,
    Critical
}

public enum ImplementationComplexity
{
    Low,
    Medium,
    High,
    VeryHigh
}

public enum RecommendationStatus
{
    New,
    UnderReview,
    Approved,
    InProgress,
    Completed,
    Rejected,
    OnHold
}

public enum StrategicAlignment
{
    Low,
    Medium,
    High,
    Critical
}

public enum InnovationPotential
{
    Low,
    Medium,
    High,
    Breakthrough
}

public enum CompetitiveAdvantage
{
    None,
    Minimal,
    Moderate,
    Significant,
    GameChanging
}

public enum ExperienceLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert,
    Senior
}

public enum OrganizationSize
{
    Small,
    Medium,
    Large,
    Enterprise
}

public enum RiskTolerance
{
    VeryLow,
    Low,
    Medium,
    High,
    VeryHigh
}

public enum BudgetConstraints
{
    Tight,
    Limited,
    Standard,
    Flexible,
    Unlimited
}

public enum TimelinePressure
{
    Relaxed,
    Moderate,
    Urgent,
    Critical
}

public enum RecommendationFocus
{
    Strategic,
    Tactical,
    Cost,
    Risk,
    Innovation,
    Compliance,
    Performance,
    Balanced,
    Personalized
}

public enum ImplementationStatus
{
    NotStarted,
    Planning,
    InProgress,
    Completed,
    Cancelled,
    OnHold
}

public enum BusinessImpact
{
    Negative,
    None,
    Low,
    Medium,
    High,
    Transformational
}

public enum InsightCategory
{
    Portfolio,
    Technology,
    Financial,
    Risk,
    Performance,
    Strategy,
    Operations
}

public enum UrgencyLevel
{
    Low,
    Medium,
    High,
    Critical
}

public enum AutomationLevel
{
    Basic,
    Intermediate,
    Advanced,
    Full
}

public enum ActionType
{
    Analysis,
    Configuration,
    Deployment,
    Monitoring,
    Optimization,
    Reporting
}

public enum AutomationStatus
{
    Pending,
    Approved,
    Executing,
    Completed,
    Failed,
    Cancelled
}

public enum CommunicationStyle
{
    Technical,
    Business,
    Executive,
    Detailed,
    Summary
}

public enum DetailLevel
{
    Summary,
    Standard,
    Detailed,
    Comprehensive
}

public enum NotificationFrequency
{
    Immediate,
    Hourly,
    Daily,
    Weekly,
    Monthly
}

public enum MetricType
{
    Financial,
    Operational,
    Technical,
    Quality,
    User,
    Business
}

public enum MeasurementFrequency
{
    RealTime,
    Hourly,
    Daily,
    Weekly,
    Monthly,
    Quarterly
}

public enum ProcessChangeScope
{
    Minimal,
    Moderate,
    Significant,
    Transformational
}

public enum DisruptionLevel
{
    None,
    Low,
    Medium,
    High,
    Severe
}

public enum UserImpactLevel
{
    None,
    Low,
    Medium,
    High,
    Severe
}

public enum ComplexityChange
{
    Simplified,
    NoChange,
    Increased,
    Reduced,
    Transformed
}

public enum MaintenanceImpact
{
    Reduced,
    NoChange,
    Increased,
    Improved,
    Automated
}

public enum ScalabilityGain
{
    None,
    Minimal,
    Moderate,
    Significant,
    Unlimited
}

public enum ResourceAvailability
{
    Limited,
    Adequate,
    Abundant,
    Constrained
}

public enum ChangeReadiness
{
    Low,
    Medium,
    High,
    Ready
}

// Additional supporting classes (simplified)
public class ExecutionStep
{
    public int Step { get; set; }
    public string Action { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public List<string> Resources { get; set; } = new();
    public List<string> Dependencies { get; set; } = new();
}

// ResourceRequirement is defined in PredictiveAnalyticsModels.cs

public class PersonalizedInsight
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public InsightType Type { get; set; }
    public double Relevance { get; set; }
}

public class LearningResource
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public ResourceType Type { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public TimeSpan EstimatedTime { get; set; }
}

public class UserEngagement
{
    public int Views { get; set; }
    public TimeSpan TimeSpent { get; set; }
    public double InteractionScore { get; set; }
    public DateTime LastEngaged { get; set; }
}

public enum InsightType
{
    Tip,
    Warning,
    Opportunity,
    Best_Practice,
    Lesson_Learned
}

public enum ResourceType
{
    Documentation,
    Video,
    Tutorial,
    Course,
    Workshop,
    Tool
}

public enum DifficultyLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
}

// Note: BusinessDriver is defined in separate file BusinessDriver.cs

// Supporting model classes
public class KPI
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double TargetValue { get; set; }
    public double CurrentValue { get; set; }
    public string Unit { get; set; } = string.Empty;
}

public class MarketImpact
{
    public string MarketSegment { get; set; } = string.Empty;
    public double Impact { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class StrategicOutcome
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double ExpectedValue { get; set; }
    public TimeSpan TimeToRealize { get; set; }
}

public class TrendIndicator
{
    public string Name { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public double Value { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class RecommendationChange
{
    public string ChangeType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Reason { get; set; } = string.Empty;
}

public class AccuracyMetrics
{
    public double PrecisionScore { get; set; }
    public double RecallScore { get; set; }
    public double F1Score { get; set; }
    public double ConfidenceInterval { get; set; }
}

public class PredictedTrend
{
    public string TrendType { get; set; } = string.Empty;
    public List<double> Values { get; set; } = new();
    public List<DateTime> Timestamps { get; set; } = new();
    public double ConfidenceScore { get; set; }
}

public class SeasonalPatterns
{
    public string Pattern { get; set; } = string.Empty;
    public List<double> SeasonalFactors { get; set; } = new();
    public string Period { get; set; } = string.Empty;
}

public class AutomationExecutionPlan
{
    public List<string> Steps { get; set; } = new();
    public Dictionary<string, object> Parameters { get; set; } = new();
    public string Schedule { get; set; } = string.Empty;
    public List<string> Prerequisites { get; set; } = new();
}

public class QualityGate
{
    public string Name { get; set; } = string.Empty;
    public List<string> Criteria { get; set; } = new();
    public string Status { get; set; } = string.Empty;
}

public class TestingStrategy
{
    public string Approach { get; set; } = string.Empty;
    public List<string> TestTypes { get; set; } = new();
    public string Coverage { get; set; } = string.Empty;
}

public class RollbackPlan
{
    public List<string> Steps { get; set; } = new();
    public string TriggerConditions { get; set; } = string.Empty;
    public TimeSpan EstimatedTime { get; set; }
}

public class MonitoringRequirements
{
    public List<string> Metrics { get; set; } = new();
    public string Frequency { get; set; } = string.Empty;
    public List<string> Alerts { get; set; } = new();
}

public class ComplianceConsiderations
{
    public List<string> Requirements { get; set; } = new();
    public string Framework { get; set; } = string.Empty;
    public List<string> AuditRequirements { get; set; } = new();
}

public class ModelMetric
{
    public string Name { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class RecommendationAnalysis
{
    public string AssessmentId { get; set; } = string.Empty;
    public double OverallEffectiveness { get; set; }
    public List<RecommendationMetric> RecommendationMetrics { get; set; } = new();
    public DateTime AnalysisDate { get; set; } = DateTime.UtcNow;
}

public class RecommendationMetric
{
    public string MetricName { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
}

// Duplicate RecommendationTrend and RecommendationFeedback removed - keeping the earlier definitions

public class AutomationRule { }
public class SafeguardMeasures { }
public class AuditTrail { }
public class ActionParameter { }
public class RiskFactor { }
public class SuccessFactor { }
public class ImpactTimeframe { }
public class EfficiencyGains { }
public class BusinessMetricImprovement { }
public class CompetitiveAdvantageGain { }
public class RoadmapPhase { }
public class RoadmapMilestone { }
public class RoadmapDependency { }
public class ResourceAllocation { }
public class RoadmapRisk { }
public class CashFlowProjection { }
public class CostComponent { }
public class ProcessChange { }
public class TrainingRequirements { }
public class TechnicalMetricChange { }
public class ArchitectureImplications { }
public class MarketPositioning { }
public class CapabilityEnhancement { }
public class StrategicObjective { }
public class Trend { }