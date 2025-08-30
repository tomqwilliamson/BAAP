namespace BAAP.API.Models;

// Core monitoring models
public class MonitoringDashboard
{
    public string AssessmentId { get; set; } = string.Empty;
    public DashboardType DashboardType { get; set; }
    public DateTime LastUpdated { get; set; }
    public TimeSpan RefreshInterval { get; set; }
    public List<DashboardWidget> Widgets { get; set; } = new();
    public RealTimeMetrics RealTimeMetrics { get; set; } = new();
    public AlertSummary AlertSummary { get; set; } = new();
    public TrendAnalysis TrendAnalysis { get; set; } = new();
    public List<QuickAction> QuickActions { get; set; } = new();
}

public class DashboardWidget
{
    public string Id { get; set; } = string.Empty;
    public WidgetType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public object Data { get; set; } = new();
    public WidgetSize Size { get; set; }
    public WidgetPosition Position { get; set; } = new();
    public TimeSpan RefreshInterval { get; set; }
    public DateTime LastUpdated { get; set; }
    public bool IsVisible { get; set; } = true;
    public Dictionary<string, object> Configuration { get; set; } = new();
    public List<string> DataSources { get; set; } = new();
}

// Alert models
public class AlertNotification
{
    public string Id { get; set; } = string.Empty;
    public string AssessmentId { get; set; } = string.Empty;
    public AlertType Type { get; set; }
    public AlertCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public AlertSeverity Severity { get; set; }
    public AlertStatus Status { get; set; }
    public AlertPriority Priority { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? AcknowledgedDate { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string AcknowledgedBy { get; set; } = string.Empty;
    public string ResolvedBy { get; set; } = string.Empty;
    public List<string> Actions { get; set; } = new();
    public List<string> AffectedApplications { get; set; } = new();
    public Dictionary<string, object> AdditionalData { get; set; } = new();
    public List<AlertComment> Comments { get; set; } = new();
    public AlertSource Source { get; set; } = new();
    public TimeSpan? TimeToAcknowledge { get; set; }
    public TimeSpan? TimeToResolve { get; set; }
}

public class AlertConfiguration
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<AlertRule> Rules { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public bool IsActive { get; set; }
    public NotificationSettings NotificationSettings { get; set; } = new();
    public EscalationPolicy EscalationPolicy { get; set; } = new();
    public SuppressionRules SuppressionRules { get; set; } = new();
    public AlertThresholds Thresholds { get; set; } = new();
}

public class AlertRule
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public AlertCategory Category { get; set; }
    public string Condition { get; set; } = string.Empty; // Query/expression
    public AlertSeverity Severity { get; set; }
    public bool IsEnabled { get; set; } = true;
    public TimeSpan EvaluationWindow { get; set; }
    public TimeSpan CooldownPeriod { get; set; }
    public Dictionary<string, object> Parameters { get; set; } = new();
    public List<string> Recipients { get; set; } = new();
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
}

// Performance metrics
public class PerformanceMetric
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public double Target { get; set; }
    public double? Threshold { get; set; }
    public DateTime Timestamp { get; set; }
    public TrendDirection Trend { get; set; }
    public MetricStatus Status { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<DataPoint> DataPoints { get; set; } = new();
    public MetricMetadata Metadata { get; set; } = new();
    public List<MetricAlert> Alerts { get; set; } = new();
}

public class KPITrend
{
    public string KPIName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<TimeSeriesPoint> TimeSeriesData { get; set; } = new();
    public double CurrentValue { get; set; }
    public double PreviousValue { get; set; }
    public double PercentageChange { get; set; }
    public TrendDirection Trend { get; set; }
    public double Confidence { get; set; }
    public TrendForecast Forecast { get; set; } = new();
    public string Insights { get; set; } = string.Empty;
    public List<TrendInfluencer> Influencers { get; set; } = new();
    public TrendVolatility Volatility { get; set; } = new();
}

// System health models
public class SystemHealthStatus
{
    public DateTime Timestamp { get; set; }
    public HealthStatus OverallStatus { get; set; }
    public List<ComponentHealth> Components { get; set; } = new();
    public SystemMetrics SystemMetrics { get; set; } = new();
    public List<HealthCheck> HealthChecks { get; set; } = new();
    public PerformanceBaseline Baseline { get; set; } = new();
    public List<string> RecentIssues { get; set; } = new();
}

public class ComponentHealth
{
    public string Name { get; set; } = string.Empty;
    public HealthStatus Status { get; set; }
    public TimeSpan ResponseTime { get; set; }
    public DateTime LastChecked { get; set; }
    public string Details { get; set; } = string.Empty;
    public List<HealthMetric> Metrics { get; set; } = new();
    public List<ComponentDependency> Dependencies { get; set; } = new();
    public ErrorRate ErrorRate { get; set; } = new();
}

public class SystemMetrics
{
    public double CPUUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DiskUsage { get; set; }
    public double NetworkLatency { get; set; }
    public int ActiveSessions { get; set; }
    public int QueueDepth { get; set; }
    public double CacheHitRate { get; set; }
    public double ErrorRate { get; set; }
    public double ThroughputPerSecond { get; set; }
    public TimeSpan AverageResponseTime { get; set; }
}

// Monitoring configuration
public class MonitoringConfiguration
{
    public bool EnablePerformanceMonitoring { get; set; } = true;
    public bool EnableAlertMonitoring { get; set; } = true;
    public bool EnableKPIMonitoring { get; set; } = true;
    public bool EnableHealthMonitoring { get; set; } = true;
    public bool EnablePredictiveMonitoring { get; set; } = false;
    public TimeSpan PerformanceInterval { get; set; } = TimeSpan.FromMinutes(5);
    public TimeSpan AlertCheckInterval { get; set; } = TimeSpan.FromMinutes(1);
    public TimeSpan KPIUpdateInterval { get; set; } = TimeSpan.FromMinutes(15);
    public TimeSpan HealthCheckInterval { get; set; } = TimeSpan.FromMinutes(2);
    public TimeSpan PredictiveAnalysisInterval { get; set; } = TimeSpan.FromHours(1);
    public RetentionPolicy DataRetention { get; set; } = new();
    public List<MonitoringEndpoint> Endpoints { get; set; } = new();
}

// Audit and logging
public class AuditEvent
{
    public string Id { get; set; } = string.Empty;
    public string AssessmentId { get; set; } = string.Empty;
    public AuditEventType EventType { get; set; }
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string ResourceId { get; set; } = string.Empty;
    public string ResourceName { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string IPAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public bool Success { get; set; }
    public Dictionary<string, object> Changes { get; set; } = new();
    public AuditSeverity Severity { get; set; } = AuditSeverity.Info;
    public List<string> Tags { get; set; } = new();
}

// Notification models
public class NotificationSettings
{
    public bool EmailEnabled { get; set; } = true;
    public bool SlackEnabled { get; set; } = false;
    public bool TeamsEnabled { get; set; } = false;
    public bool PushEnabled { get; set; } = true;
    public bool SMSEnabled { get; set; } = false;
    public List<string> EmailRecipients { get; set; } = new();
    public string SlackChannel { get; set; } = string.Empty;
    public string TeamsWebhook { get; set; } = string.Empty;
    public QuietHours QuietHours { get; set; } = new();
    public NotificationFilters Filters { get; set; } = new();
    public DeliveryPreferences Delivery { get; set; } = new();
}

public class NotificationPreferences
{
    public string UserId { get; set; } = string.Empty;
    public NotificationSettings Settings { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public bool IsActive { get; set; } = true;
    public List<ChannelPreference> ChannelPreferences { get; set; } = new();
    public Dictionary<AlertCategory, NotificationRule> CategoryRules { get; set; } = new();
}

// Real-time data models
public class RealTimeMetrics
{
    public DateTime LastUpdated { get; set; }
    public int ActiveUsers { get; set; }
    public int ActiveAssessments { get; set; }
    public int ProcessingQueue { get; set; }
    public double SystemLoad { get; set; }
    public List<LiveMetric> Metrics { get; set; } = new();
    public ConnectionStatus ConnectionStatus { get; set; } = new();
}

public class AlertSummary
{
    public int TotalActive { get; set; }
    public int Critical { get; set; }
    public int High { get; set; }
    public int Medium { get; set; }
    public int Low { get; set; }
    public int NewInLastHour { get; set; }
    public List<TopAlert> TopAlerts { get; set; } = new();
    public AlertTrendSummary Trends { get; set; } = new();
}

public class TrendAnalysis
{
    public List<TrendSummary> ShortTerm { get; set; } = new(); // Last 24 hours
    public List<TrendSummary> MediumTerm { get; set; } = new(); // Last 7 days
    public List<TrendSummary> LongTerm { get; set; } = new(); // Last 30 days
    public List<AnomalyDetection> Anomalies { get; set; } = new();
    public List<PatternRecognition> Patterns { get; set; } = new();
    public PredictiveInsight Predictions { get; set; } = new();
}

// Supporting data models
public class DataPoint
{
    public DateTime Timestamp { get; set; }
    public double Value { get; set; }
    public string Label { get; set; } = string.Empty;
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class TimeSeriesPoint
{
    public DateTime Timestamp { get; set; }
    public double Value { get; set; }
    public double? UpperBound { get; set; }
    public double? LowerBound { get; set; }
    public bool IsAnomaly { get; set; }
    public double? Confidence { get; set; }
}

public class TrendForecast
{
    public List<TimeSeriesPoint> PredictedValues { get; set; } = new();
    public double Confidence { get; set; }
    public TimeSpan ForecastHorizon { get; set; }
    public string Model { get; set; } = string.Empty;
    public List<ForecastAssumption> Assumptions { get; set; } = new();
    public ForecastAccuracy HistoricalAccuracy { get; set; } = new();
}

public class QuickAction
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool RequiresConfirmation { get; set; }
    public List<string> Permissions { get; set; } = new();
}

// Escalation and suppression
public class EscalationPolicy
{
    public bool Enabled { get; set; } = true;
    public List<EscalationLevel> EscalationLevels { get; set; } = new();
    public TimeSpan MaxEscalationTime { get; set; }
    public bool AutoResolve { get; set; } = false;
    public TimeSpan AutoResolveTimeout { get; set; }
}

public class EscalationLevel
{
    public int Level { get; set; }
    public int DelayMinutes { get; set; }
    public List<string> Recipients { get; set; } = new();
    public List<NotificationChannel> Channels { get; set; } = new();
    public bool RequireAcknowledgment { get; set; } = true;
}

public class SuppressionRules
{
    public bool EnableMaintenance { get; set; } = true;
    public List<MaintenanceWindow> MaintenanceWindows { get; set; } = new();
    public bool EnableDuplicateSuppression { get; set; } = true;
    public TimeSpan DuplicateWindow { get; set; } = TimeSpan.FromMinutes(5);
    public bool EnableFlappingSuppression { get; set; } = true;
    public FlappingThresholds FlappingThresholds { get; set; } = new();
}

// Position and sizing
public class WidgetPosition
{
    public int Row { get; set; }
    public int Column { get; set; }
    public int RowSpan { get; set; } = 1;
    public int ColumnSpan { get; set; } = 1;
}

// Metadata and configuration
public class MetricMetadata
{
    public string DataSource { get; set; } = string.Empty;
    public string CalculationMethod { get; set; } = string.Empty;
    public DateTime LastCalculated { get; set; }
    public double DataQuality { get; set; } = 1.0;
    public List<string> Tags { get; set; } = new();
    public Dictionary<string, string> Attributes { get; set; } = new();
}

public class RetentionPolicy
{
    public TimeSpan RealTimeData { get; set; } = TimeSpan.FromDays(7);
    public TimeSpan AggregatedData { get; set; } = TimeSpan.FromDays(90);
    public TimeSpan ArchiveData { get; set; } = TimeSpan.FromDays(365);
    public bool EnableCompression { get; set; } = true;
    public bool EnableArchiving { get; set; } = true;
}

// Enums
public enum DashboardType
{
    Executive,
    Operations,
    Technical,
    Financial,
    Risk,
    Custom
}

public enum WidgetType
{
    Chart,
    Gauge,
    Table,
    Summary,
    Timeline,
    StatusGrid,
    Map,
    Text,
    Image,
    Iframe
}

public enum WidgetSize
{
    Small,
    Medium,
    Large,
    ExtraLarge
}

public enum AlertType
{
    Info,
    Warning,
    Critical,
    Success
}

public enum AlertCategory
{
    System,
    Performance,
    Security,
    Cost,
    Timeline,
    Risk,
    Compliance,
    Quality,
    Business
}

public enum AlertSeverity
{
    Low,
    Medium,
    High,
    Critical
}

public enum AlertStatus
{
    New,
    Active,
    Acknowledged,
    Resolved,
    Suppressed,
    Closed
}

public enum AlertPriority
{
    Low,
    Medium,
    High,
    Critical,
    Urgent
}

public enum TrendDirection
{
    Up,
    Down,
    Stable,
    Unknown
}

public enum MetricStatus
{
    OnTrack,
    NeedsAttention,
    Behind,
    AtRisk,
    Critical
}

public enum HealthStatus
{
    Healthy,
    Degraded,
    Unhealthy,
    Unknown
}

public enum AuditEventType
{
    Login,
    Logout,
    AssessmentCreated,
    AssessmentModified,
    AssessmentDeleted,
    ApplicationAdded,
    ApplicationModified,
    ApplicationDeleted,
    RecommendationGenerated,
    RecommendationImplemented,
    AlertCreated,
    AlertResolved,
    ConfigurationChanged,
    DataExported,
    UserCreated,
    UserModified,
    PermissionChanged
}

public enum AuditSeverity
{
    Info,
    Warning,
    Error,
    Critical
}

public enum NotificationChannel
{
    Email,
    SMS,
    Push,
    Slack,
    Teams,
    Webhook,
    Phone
}

// Supporting classes (simplified)
public class AlertComment
{
    public string Id { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

public class AlertSource
{
    public string System { get; set; } = string.Empty;
    public string Component { get; set; } = string.Empty;
    public string Rule { get; set; } = string.Empty;
}

public class QuietHours
{
    public bool Enabled { get; set; } = false;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public List<DayOfWeek> Days { get; set; } = new();
    public string TimeZone { get; set; } = "UTC";
}

public class AlertThresholds
{
    public Dictionary<string, ThresholdRule> Rules { get; set; } = new();
    public bool EnableAdaptiveThresholds { get; set; } = false;
    public TimeSpan LearningPeriod { get; set; } = TimeSpan.FromDays(30);
}

public class ThresholdRule
{
    public double Warning { get; set; }
    public double Critical { get; set; }
    public string Operator { get; set; } = ">="; // >=, <=, ==, !=, >, <
    public bool IsAdaptive { get; set; } = false;
}

public class MetricAlert
{
    public string Id { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime? LastTriggered { get; set; }
}

public class TrendInfluencer
{
    public string Name { get; set; } = string.Empty;
    public double Impact { get; set; }
    public double Confidence { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class TrendVolatility
{
    public double StandardDeviation { get; set; }
    public double CoefficientOfVariation { get; set; }
    public VolatilityLevel Level { get; set; }
}

public class HealthCheck
{
    public string Name { get; set; } = string.Empty;
    public HealthStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime LastRun { get; set; }
    public TimeSpan Duration { get; set; }
}

public class HealthMetric
{
    public string Name { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool IsHealthy { get; set; }
}

public class ComponentDependency
{
    public string Name { get; set; } = string.Empty;
    public HealthStatus Status { get; set; }
    public bool IsCritical { get; set; }
}

public class ErrorRate
{
    public double Rate { get; set; }
    public int ErrorCount { get; set; }
    public int TotalRequests { get; set; }
    public TimeSpan Window { get; set; }
}

public class MonitoringEndpoint
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Method { get; set; } = "GET";
    public TimeSpan Timeout { get; set; } = TimeSpan.FromSeconds(30);
    public bool IsEnabled { get; set; } = true;
}

public class NotificationFilters
{
    public List<AlertSeverity> MinSeverity { get; set; } = new();
    public List<AlertCategory> Categories { get; set; } = new();
    public List<string> Keywords { get; set; } = new();
    public List<string> ExcludeKeywords { get; set; } = new();
}

public class DeliveryPreferences
{
    public bool BatchNotifications { get; set; } = false;
    public TimeSpan BatchInterval { get; set; } = TimeSpan.FromMinutes(15);
    public int MaxBatchSize { get; set; } = 10;
    public bool EnableDigest { get; set; } = true;
    public TimeSpan DigestInterval { get; set; } = TimeSpan.FromHours(24);
}

public class ChannelPreference
{
    public NotificationChannel Channel { get; set; }
    public bool IsEnabled { get; set; } = true;
    public List<AlertSeverity> Severities { get; set; } = new();
    public Dictionary<string, object> Settings { get; set; } = new();
}

public class NotificationRule
{
    public bool IsEnabled { get; set; } = true;
    public List<NotificationChannel> Channels { get; set; } = new();
    public AlertSeverity MinSeverity { get; set; } = AlertSeverity.Medium;
    public TimeSpan? DelayMinutes { get; set; }
    public bool RequireAcknowledgment { get; set; } = false;
}

public class LiveMetric
{
    public string Name { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public TrendDirection Trend { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class ConnectionStatus
{
    public bool IsConnected { get; set; }
    public int ActiveConnections { get; set; }
    public DateTime LastHeartbeat { get; set; }
    public double Latency { get; set; }
}

public class TopAlert
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public AlertSeverity Severity { get; set; }
    public DateTime CreatedDate { get; set; }
    public int Frequency { get; set; }
}

public class AlertTrendSummary
{
    public double ChangePercentage { get; set; }
    public TrendDirection Direction { get; set; }
    public List<AlertTypeCount> TypeBreakdown { get; set; } = new();
    public TimeSpan AverageResolutionTime { get; set; }
}

public class AlertTypeCount
{
    public AlertSeverity Severity { get; set; }
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class TrendSummary
{
    public string Metric { get; set; } = string.Empty;
    public double Change { get; set; }
    public TrendDirection Direction { get; set; }
    public double Significance { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class AnomalyDetection
{
    public string Metric { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public double ActualValue { get; set; }
    public double ExpectedValue { get; set; }
    public double Severity { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class PatternRecognition
{
    public string Pattern { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public List<string> AffectedMetrics { get; set; } = new();
    public string Description { get; set; } = string.Empty;
}

public class PredictiveInsight
{
    public string Insight { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public DateTime PredictedTime { get; set; }
    public string RecommendedAction { get; set; } = string.Empty;
}

public class ForecastAssumption
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public double Impact { get; set; }
}

public class ForecastAccuracy
{
    public double MeanAbsoluteError { get; set; }
    public double RootMeanSquareError { get; set; }
    public double MeanAbsolutePercentageError { get; set; }
    public double R2Score { get; set; }
}

public class MaintenanceWindow
{
    public string Name { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsRecurring { get; set; }
    public string RecurrencePattern { get; set; } = string.Empty;
    public List<string> AffectedSystems { get; set; } = new();
}

public class FlappingThresholds
{
    public int MaxStateChanges { get; set; } = 5;
    public TimeSpan TimeWindow { get; set; } = TimeSpan.FromMinutes(10);
    public TimeSpan SuppressionDuration { get; set; } = TimeSpan.FromMinutes(30);
}

public class PerformanceBaseline
{
    public Dictionary<string, double> BaselineValues { get; set; } = new();
    public DateTime EstablishedDate { get; set; }
    public TimeSpan BaseliningPeriod { get; set; }
    public double ConfidenceLevel { get; set; }
}

public enum VolatilityLevel
{
    Low,
    Medium,
    High,
    Extreme
}

// Placeholder classes for escalation
public class AlertEscalation { }
public class AlertPattern { }
public class AlertSuppression { }