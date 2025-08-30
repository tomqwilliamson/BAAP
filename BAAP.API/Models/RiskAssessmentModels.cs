namespace BAAP.API.Models;

public class RiskAssessmentParameters
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<string> ApplicationIds { get; set; } = new();
    public string RiskProfile { get; set; } = string.Empty; // Conservative, Balanced, Aggressive
    public List<string> ComplianceRequirements { get; set; } = new();
    public string TimeHorizon { get; set; } = string.Empty; // Short, Medium, Long
}

public class ComprehensiveRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<ProjectRisk> TechnicalRisks { get; set; } = new();
    public List<BusinessRisk> BusinessRisks { get; set; } = new();
    public List<SecurityRisk> SecurityRisks { get; set; } = new();
    public List<ComplianceRisk> ComplianceRisks { get; set; } = new();
    public double OverallRiskScore { get; set; }
    public string RiskRating { get; set; } = string.Empty; // Low, Medium, High, Critical
    public List<RiskMitigationAction> RecommendedActions { get; set; } = new();
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class RiskScenario
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Probability { get; set; }
    public RiskLevel Impact { get; set; }
    public List<string> TriggerConditions { get; set; } = new();
    public List<RiskMitigationAction> MitigationStrategies { get; set; } = new();
}

public class ProjectRisk
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Technical, Resource, Timeline, etc.
    public string Description { get; set; } = string.Empty;
    public double Probability { get; set; }
    public RiskLevel Impact { get; set; }
    public double RiskScore { get; set; }
    public ActionPriority Priority { get; set; }
    public List<string> MitigationOptions { get; set; } = new();
    public string Owner { get; set; } = string.Empty;
    public DateTime IdentifiedDate { get; set; } = DateTime.UtcNow;
}

public class BusinessRisk
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Market, Operational, Financial, Strategic
    public string Description { get; set; } = string.Empty;
    public double Probability { get; set; }
    public RiskLevel Impact { get; set; }
    public string BusinessFunction { get; set; } = string.Empty;
    public List<string> StakeholdersAffected { get; set; } = new();
    public string FinancialImpact { get; set; } = string.Empty;
}

public class SecurityRisk
{
    public string Id { get; set; } = string.Empty;
    public string ThreatVector { get; set; } = string.Empty;
    public string Vulnerability { get; set; } = string.Empty;
    public double Probability { get; set; }
    public RiskLevel Impact { get; set; }
    public string SecurityDomain { get; set; } = string.Empty; // Data, Network, Application, Identity
    public List<string> ComplianceImplications { get; set; } = new();
    public string RecommendedControls { get; set; } = string.Empty;
}

public class ComplianceRisk
{
    public string Id { get; set; } = string.Empty;
    public string Regulation { get; set; } = string.Empty; // GDPR, SOX, HIPAA, etc.
    public string Requirement { get; set; } = string.Empty;
    public ComplianceAlignment CurrentAlignment { get; set; }
    public string GapDescription { get; set; } = string.Empty;
    public RiskLevel Impact { get; set; }
    public string RemediationPlan { get; set; } = string.Empty;
}

public class RiskMitigationStrategy
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<RiskMitigationAction> Actions { get; set; } = new();
    public string Strategy { get; set; } = string.Empty; // Avoid, Mitigate, Transfer, Accept
    public double TotalCost { get; set; }
    public TimeSpan TimeToImplement { get; set; }
    public double ExpectedRiskReduction { get; set; }
}

public class RiskMitigationAction
{
    public string Id { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ActionPriority Priority { get; set; }
    public double Cost { get; set; }
    public TimeSpan Duration { get; set; }
    public string ResponsibleParty { get; set; } = string.Empty;
    public List<string> Prerequisites { get; set; } = new();
    public double EffectivenessScore { get; set; }
}

public class RiskMonitoringPlan
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<RiskIndicator> KeyRiskIndicators { get; set; } = new();
    public string MonitoringFrequency { get; set; } = string.Empty; // Daily, Weekly, Monthly
    public List<string> ResponsibleParties { get; set; } = new();
    public List<AlertThreshold> AlertThresholds { get; set; } = new();
    public string EscalationProcedure { get; set; } = string.Empty;
}

public class RiskIndicator
{
    public string Name { get; set; } = string.Empty;
    public string Metric { get; set; } = string.Empty;
    public double CurrentValue { get; set; }
    public double ThresholdValue { get; set; }
    public string TrendDirection { get; set; } = string.Empty; // Improving, Stable, Deteriorating
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class AlertThreshold
{
    public string Metric { get; set; } = string.Empty;
    public double WarningLevel { get; set; }
    public double CriticalLevel { get; set; }
    public string AlertRecipients { get; set; } = string.Empty;
    public string AlertMessage { get; set; } = string.Empty;
}

// Additional supporting classes
public class ThreatLandscape
{
    public List<string> EmergingThreats { get; set; } = new();
    public List<string> IndustryRisks { get; set; } = new();
    public string ThreatIntelligence { get; set; } = string.Empty;
}

public class BusinessImpactAnalysis
{
    public string ProcessName { get; set; } = string.Empty;
    public string Criticality { get; set; } = string.Empty;
    public TimeSpan RecoveryTimeObjective { get; set; }
    public TimeSpan RecoveryPointObjective { get; set; }
    public double FinancialImpactPerHour { get; set; }
}

public class StakeholderImpactAssessment
{
    public string StakeholderGroup { get; set; } = string.Empty;
    public RiskLevel ImpactLevel { get; set; }
    public string ImpactDescription { get; set; } = string.Empty;
    public List<string> CommunicationRequirements { get; set; } = new();
}

public class TechnicalRisk
{
    public string Component { get; set; } = string.Empty;
    public string RiskType { get; set; } = string.Empty;
    public double TechnicalComplexity { get; set; }
    public string TechnologyMaturity { get; set; } = string.Empty;
    public List<string> Dependencies { get; set; } = new();
}

public class ArchitectureRisk
{
    public string ArchitecturalPattern { get; set; } = string.Empty;
    public string RiskArea { get; set; } = string.Empty;
    public double Complexity { get; set; }
    public List<string> MitigationStrategies { get; set; } = new();
}

public class TechnologyStackAnalysis
{
    public string Technology { get; set; } = string.Empty;
    public string MaturityLevel { get; set; } = string.Empty;
    public double SupportRisk { get; set; }
    public List<string> Alternatives { get; set; } = new();
}

// Additional risk assessment models
public class ComplianceParameters
{
    public List<string> Regulations { get; set; } = new();
    public string ComplianceFramework { get; set; } = string.Empty;
    public string AssessmentScope { get; set; } = string.Empty;
}

public class ComplianceRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<ComplianceRisk> Risks { get; set; } = new();
    public double OverallComplianceScore { get; set; }
    public List<string> RequiredActions { get; set; } = new();
}

public class SecurityRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<SecurityRisk> Risks { get; set; } = new();
    public ThreatLandscape ThreatLandscape { get; set; } = new();
    public double SecurityPosture { get; set; }
}

public class BusinessRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<BusinessRisk> Risks { get; set; } = new();
    public BusinessImpactAnalysis ImpactAnalysis { get; set; } = new();
    public List<StakeholderImpactAssessment> StakeholderImpacts { get; set; } = new();
}

public class TechnicalRiskAssessment
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<TechnicalRisk> Risks { get; set; } = new();
    public List<ArchitectureRisk> ArchitectureRisks { get; set; } = new();
    public TechnologyStackAnalysis TechnologyAnalysis { get; set; } = new();
}

public class RiskTrend
{
    public string RiskId { get; set; } = string.Empty;
    public List<double> TrendValues { get; set; } = new();
    public List<DateTime> Timestamps { get; set; } = new();
    public string TrendDirection { get; set; } = string.Empty;
}

public class KeyRiskIndicator
{
    public string Name { get; set; } = string.Empty;
    public double Value { get; set; }
    public double Threshold { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class RiskSeverity
{
    public string Level { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double NumericValue { get; set; }
}

public class ComplianceGap
{
    public string Requirement { get; set; } = string.Empty;
    public string CurrentState { get; set; } = string.Empty;
    public string TargetState { get; set; } = string.Empty;
    public string GapDescription { get; set; } = string.Empty;
}

public class DashboardRequirements
{
    public List<string> RequiredMetrics { get; set; } = new();
    public string UpdateFrequency { get; set; } = string.Empty;
    public List<string> UserRoles { get; set; } = new();
}

public class RiskHeatMap
{
    public string AssessmentId { get; set; } = string.Empty;
    public Dictionary<string, Dictionary<string, double>> HeatMapData { get; set; } = new();
    public List<string> RiskCategories { get; set; } = new();
    public List<string> ImpactLevels { get; set; } = new();
}

public class EscalationProcedure
{
    public string Level { get; set; } = string.Empty;
    public List<string> ResponsibleParties { get; set; } = new();
    public TimeSpan TimeFrame { get; set; }
    public string Actions { get; set; } = string.Empty;
}

public class RiskGovernanceFramework
{
    public string Name { get; set; } = string.Empty;
    public List<string> Policies { get; set; } = new();
    public List<string> Procedures { get; set; } = new();
    public string Authority { get; set; } = string.Empty;
}

public class ReportingSchedule
{
    public string Frequency { get; set; } = string.Empty;
    public List<string> Recipients { get; set; } = new();
    public string Format { get; set; } = string.Empty;
    public DateTime NextReport { get; set; }
}

public class EscalationTrigger
{
    public string Condition { get; set; } = string.Empty;
    public double Threshold { get; set; }
    public string Action { get; set; } = string.Empty;
    public List<string> Recipients { get; set; } = new();
}