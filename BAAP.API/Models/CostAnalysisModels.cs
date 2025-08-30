namespace BAAP.API.Models;

// Core cost analysis models
public class CostAnalysisResult
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime AnalysisDate { get; set; }
    public CurrentCosts CurrentCosts { get; set; } = new();
    public CloudCostPrediction ProjectedCloudCosts { get; set; } = new();
    public MigrationCosts MigrationCosts { get; set; } = new();
    public double AnnualSavings { get; set; }
    public double PaybackPeriodYears { get; set; }
    public double ThreeYearROI { get; set; }
    public double FiveYearROI { get; set; }
    public string AIInsights { get; set; } = string.Empty;
    public double ConfidenceLevel { get; set; }
    public List<string> Assumptions { get; set; } = new();
}

public class CostAnalysisParameters
{
    public int AnalysisPeriodYears { get; set; } = 5;
    public string TargetRegion { get; set; } = "East US";
    public CommitmentLevel CommitmentLevel { get; set; } = CommitmentLevel.OneYear;
    public OptimizationLevel OptimizationLevel { get; set; } = OptimizationLevel.Standard;
    public string DataQuality { get; set; } = "Medium";
    public double InflationRate { get; set; } = 0.03;
    public double GrowthRate { get; set; } = 0.05;
}

public class CurrentCosts
{
    public double InfrastructureCosts { get; set; }
    public double LicensingCosts { get; set; }
    public double OperationalCosts { get; set; }
    public double MaintenanceCosts { get; set; }
    public double TotalAnnualCost { get; set; }
}

public class MigrationCosts
{
    public double PlanningCosts { get; set; }
    public double ExecutionCosts { get; set; }
    public double TrainingCosts { get; set; }
    public double ContingencyCosts { get; set; }
    public double TotalMigrationCost { get; set; }
}

// Cloud cost prediction models
public class CloudCostPrediction
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime PredictionDate { get; set; }
    public string Region { get; set; } = string.Empty;
    public CommitmentLevel CommitmentLevel { get; set; }
    public OptimizationLevel OptimizationLevel { get; set; }
    public double ComputeCosts { get; set; }
    public double StorageCosts { get; set; }
    public double NetworkCosts { get; set; }
    public double ServiceCosts { get; set; }
    public double TotalAnnualCost { get; set; }
    public List<ApplicationCostPrediction> ApplicationPredictions { get; set; } = new();
    public double OptimizationSavings { get; set; }
    public double CommitmentSavings { get; set; }
    public double ConfidenceLevel { get; set; }
}

public class CloudCostParameters
{
    public string Region { get; set; } = "East US";
    public CommitmentLevel CommitmentLevel { get; set; } = CommitmentLevel.OneYear;
    public OptimizationLevel OptimizationLevel { get; set; } = OptimizationLevel.Standard;
    public double GrowthFactor { get; set; } = 1.0;
    public bool IncludeDisasterRecovery { get; set; } = true;
    public bool IncludeBackup { get; set; } = true;
}

public class ApplicationCostPrediction
{
    public string ApplicationName { get; set; } = string.Empty;
    public double ComputeCosts { get; set; }
    public double StorageCosts { get; set; }
    public double NetworkCosts { get; set; }
    public double ServiceCosts { get; set; }
    public double TotalCost { get; set; }
    public string RecommendedSizing { get; set; } = string.Empty;
    public List<string> OptimizationOpportunities { get; set; } = new();
}

// ROI Analysis models
public class ROIAnalysis
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime AnalysisDate { get; set; }
    public int AnalysisPeriodYears { get; set; }
    public double TotalInvestment { get; set; }
    public TangibleBenefits TangibleBenefits { get; set; } = new();
    public IntangibleBenefits IntangibleBenefits { get; set; } = new();
    public List<CashFlow> CashFlowProjections { get; set; } = new();
    public double NetPresentValue { get; set; }
    public double InternalRateOfReturn { get; set; }
    public int PaybackPeriodMonths { get; set; }
    public double ROIPercentage { get; set; }
    public double RiskAdjustedROI { get; set; }
    public SensitivityAnalysis SensitivityAnalysis { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
}

public class ROIParameters
{
    public int AnalysisPeriodYears { get; set; } = 5;
    public string Region { get; set; } = "East US";
    public double DiscountRate { get; set; } = 0.10;
    public double RiskFactor { get; set; } = 0.15;
    public double OperationalEfficiencyGain { get; set; } = 0.20;
    public double MaintenanceReductionFactor { get; set; } = 0.50;
    public double LicenseOptimizationFactor { get; set; } = 0.15;
    public double AgilityValue { get; set; } = 500000;
    public double InnovationValue { get; set; } = 1000000;
    public double SecurityValue { get; set; } = 750000;
    public double DRValue { get; set; } = 300000;
    public double ComplianceValue { get; set; } = 400000;
    public double TalentValue { get; set; } = 600000;
    public double OngoingInvestmentAnnual { get; set; } = 100000;
}

public class TangibleBenefits
{
    public double InfrastructureSavings { get; set; }
    public double OperationalEfficiency { get; set; }
    public double MaintenanceReduction { get; set; }
    public double LicenseOptimization { get; set; }
    public double EnergyEfficiency { get; set; }
    public double ScalabilityBenefits { get; set; }
    public double TotalAnnualBenefit => InfrastructureSavings + OperationalEfficiency + MaintenanceReduction + 
                                       LicenseOptimization + EnergyEfficiency + ScalabilityBenefits;
}

public class IntangibleBenefits
{
    public double ImprovedAgility { get; set; }
    public double InnovationAcceleration { get; set; }
    public double ImprovedSecurityPosture { get; set; }
    public double DisasterRecoveryImprovement { get; set; }
    public double ComplianceSimplification { get; set; }
    public double TalentRetention { get; set; }
    public double TotalValue => ImprovedAgility + InnovationAcceleration + ImprovedSecurityPosture + 
                               DisasterRecoveryImprovement + ComplianceSimplification + TalentRetention;
}

public class CashFlow
{
    public int Year { get; set; }
    public double Investment { get; set; }
    public double TangibleBenefits { get; set; }
    public double IntangibleBenefits { get; set; }
    public double NetCashFlow { get; set; }
    public double CumulativeNetCashFlow { get; set; }
    public double DiscountedCashFlow { get; set; }
}

public class SensitivityAnalysis
{
    public Dictionary<string, double> BaseCase { get; set; } = new();
    public Dictionary<string, double> OptimisticCase { get; set; } = new();
    public Dictionary<string, double> PessimisticCase { get; set; } = new();
    public List<SensitivityVariable> Variables { get; set; } = new();
    public double OverallSensitivityScore { get; set; }
}

public class SensitivityVariable
{
    public string Name { get; set; } = string.Empty;
    public double BaseValue { get; set; }
    public double LowValue { get; set; }
    public double HighValue { get; set; }
    public double ROIImpactLow { get; set; }
    public double ROIImpactHigh { get; set; }
    public double SensitivityScore { get; set; }
}

// Cost optimization models
public class CostOptimizationRecommendations
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime GeneratedDate { get; set; }
    public List<CostOptimizationRecommendation> Recommendations { get; set; } = new();
    public double TotalPotentialSavings { get; set; }
    public int EstimatedImplementationTime { get; set; }
    public PriorityMatrix PriorityMatrix { get; set; } = new();
    public ImplementationRoadmap ImplementationRoadmap { get; set; } = new();
    public List<CostOptimizationRecommendation> QuickWins { get; set; } = new();
}

public class CostOptimizationRecommendation
{
    public OptimizationCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PotentialSavings { get; set; }
    public ImplementationEffort ImplementationEffort { get; set; }
    public OptimizationPriority Priority { get; set; }
    public string Timeline { get; set; } = string.Empty;
    public List<string> Prerequisites { get; set; } = new();
    public RiskLevel RiskLevel { get; set; }
    public List<string> Benefits { get; set; } = new();
    public List<string> Risks { get; set; } = new();
    public string Owner { get; set; } = string.Empty;
}

public class PriorityMatrix
{
    public List<CostOptimizationRecommendation> HighValueLowEffort { get; set; } = new();
    public List<CostOptimizationRecommendation> HighValueHighEffort { get; set; } = new();
    public List<CostOptimizationRecommendation> LowValueLowEffort { get; set; } = new();
    public List<CostOptimizationRecommendation> LowValueHighEffort { get; set; } = new();
}

public class ImplementationRoadmap
{
    public Dictionary<string, List<CostOptimizationRecommendation>> Phases { get; set; } = new();
    public int TotalDurationWeeks { get; set; }
    public List<string> Dependencies { get; set; } = new();
    public List<string> CriticalPath { get; set; } = new();
}

// Cost scenario models
public class CostScenario
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double CloudCostMultiplier { get; set; }
    public double MigrationComplexityFactor { get; set; }
    public OptimizationLevel OptimizationLevel { get; set; }
    public TimeSpan TimeToValue { get; set; }
    public RiskLevel RiskLevel { get; set; }
    public double EstimatedAnnualCost { get; set; }
    public double EstimatedMigrationCost { get; set; }
    public List<string> KeyCharacteristics { get; set; } = new();
    public double ThreeYearROI { get; set; }
    public double FiveYearROI { get; set; }
    public double PaybackPeriod { get; set; }
}

public class ScenarioParameters
{
    public List<OptimizationLevel> OptimizationLevels { get; set; } = new();
    public List<string> Regions { get; set; } = new();
    public List<CommitmentLevel> CommitmentLevels { get; set; } = new();
    public double MinROI { get; set; } = 0.15;
    public double MaxRiskTolerance { get; set; } = 0.70;
    public int MaxPaybackPeriodMonths { get; set; } = 36;
}

// TCO comparison models
public class TCOComparison
{
    public string AssessmentId { get; set; } = string.Empty;
    public int AnalysisPeriodYears { get; set; }
    public DateTime ComparisonDate { get; set; }
    public TCOProjection CurrentTCO { get; set; } = new();
    public TCOProjection CloudTCO { get; set; } = new();
    public double TotalSavings { get; set; }
    public double SavingsPercentage { get; set; }
    public int BreakEvenPoint { get; set; }
    public Dictionary<int, double> CumulativeSavings { get; set; } = new();
    public List<string> KeyFactors { get; set; } = new();
    public List<string> Assumptions { get; set; } = new();
}

public class TCOParameters
{
    public int AnalysisPeriodYears { get; set; } = 5;
    public string Region { get; set; } = "East US";
    public CommitmentLevel CommitmentLevel { get; set; } = CommitmentLevel.OneYear;
    public OptimizationLevel OptimizationLevel { get; set; } = OptimizationLevel.Standard;
    public double InflationRate { get; set; } = 0.03;
    public double GrowthRate { get; set; } = 0.05;
    public bool IncludeRefreshCosts { get; set; } = true;
    public bool IncludeComplianceCosts { get; set; } = true;
}

public class TCOProjection
{
    public string Scenario { get; set; } = string.Empty;
    public Dictionary<int, YearlyTCO> YearlyBreakdown { get; set; } = new();
    public double TotalTCO => YearlyBreakdown.Sum(kvp => kvp.Value.TotalCost);
}

public class YearlyTCO
{
    public int Year { get; set; }
    public double InfrastructureCosts { get; set; }
    public double OperationalCosts { get; set; }
    public double MaintenanceCosts { get; set; }
    public double LicensingCosts { get; set; }
    public double ComplianceCosts { get; set; }
    public double TotalCost { get; set; }
}

// Additional missing models
public class CostComparison
{
    public string AssessmentId { get; set; } = string.Empty;
    public List<DeploymentCostAnalysis> ComparisonResults { get; set; } = new();
    public string RecommendedOption { get; set; } = string.Empty;
    public string Rationale { get; set; } = string.Empty;
}

public class DeploymentCostAnalysis
{
    public string DeploymentType { get; set; } = string.Empty;
    public double InitialCost { get; set; }
    public double MonthlyOperationalCost { get; set; }
    public double ThreeYearTotalCost { get; set; }
    public List<string> CostDrivers { get; set; } = new();
    public List<string> RiskFactors { get; set; } = new();
}

// Cost breakdown models
public class CostBreakdownAnalysis
{
    public string AssessmentId { get; set; } = string.Empty;
    public DateTime AnalysisDate { get; set; }
    public Dictionary<string, double> CurrentCostBreakdown { get; set; } = new();
    public Dictionary<string, double> CloudCostBreakdown { get; set; } = new();
    public Dictionary<string, double> MigrationCostBreakdown { get; set; } = new();
    public List<CostDriver> CostDriverAnalysis { get; set; } = new();
    public VariableCostAnalysis VariableCostAnalysis { get; set; } = new();
    public FixedCostAnalysis FixedCostAnalysis { get; set; } = new();
}

public class CostDriver
{
    public string Name { get; set; } = string.Empty;
    public double CurrentImpact { get; set; }
    public double CloudImpact { get; set; }
    public double ImpactChange { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsControllable { get; set; }
    public List<string> OptimizationActions { get; set; } = new();
}

public class VariableCostAnalysis
{
    public double CurrentVariableCosts { get; set; }
    public double CloudVariableCosts { get; set; }
    public List<VariableCostComponent> Components { get; set; } = new();
    public double ScalabilityFactor { get; set; }
    public double ElasticityBenefit { get; set; }
}

public class VariableCostComponent
{
    public string Name { get; set; } = string.Empty;
    public double UnitCost { get; set; }
    public double Usage { get; set; }
    public double TotalCost { get; set; }
    public string ScalingModel { get; set; } = string.Empty;
}

public class FixedCostAnalysis
{
    public double CurrentFixedCosts { get; set; }
    public double CloudFixedCosts { get; set; }
    public List<FixedCostComponent> Components { get; set; } = new();
    public double UtilizationEfficiency { get; set; }
    public double CapacityOptimization { get; set; }
}

public class FixedCostComponent
{
    public string Name { get; set; } = string.Empty;
    public double AnnualCost { get; set; }
    public double UtilizationRate { get; set; }
    public double EffectiveCost { get; set; }
    public string OptimizationPotential { get; set; } = string.Empty;
}

// Cost saving opportunities
public class CostSavingOpportunity
{
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PotentialSavings { get; set; }
    public double Confidence { get; set; }
    public int ImplementationTimeWeeks { get; set; }
    public ComplexityLevel ComplexityLevel { get; set; }
    public List<string> Prerequisites { get; set; } = new();
    public List<string> Actions { get; set; } = new();
    public List<string> Risks { get; set; } = new();
    public List<string> Success_Metrics { get; set; } = new();
}

// Enums
public enum CommitmentLevel
{
    None,
    OneYear,
    ThreeYear
}

public enum OptimizationLevel
{
    Basic,
    Standard,
    Advanced
}

public enum OptimizationCategory
{
    RightSizing,
    Commitment,
    Automation,
    Storage,
    Network,
    Governance,
    Monitoring
}

public enum ImplementationEffort
{
    Low,
    Medium,
    High,
    VeryHigh
}

public enum OptimizationPriority
{
    Low,
    Medium,
    High,
    Critical
}

public enum ComplexityLevel
{
    Low,
    Medium,
    High,
    VeryHigh
}