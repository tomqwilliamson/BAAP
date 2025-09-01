using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAAP.API.Models;

[Table("DevelopmentPractices")]
public class DevelopmentPractices
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AssessmentId { get; set; }

    // Development Methodology
    [StringLength(50)]
    public string? PrimaryMethodology { get; set; } // Agile/Scrum, Kanban, Waterfall, etc.

    [StringLength(20)]
    public string? SprintLength { get; set; } // 1 week, 2 weeks, etc.

    [StringLength(20)]
    public string? ReleaseFrequency { get; set; } // Daily, Weekly, Monthly, etc.

    // Quality Assurance
    public bool HasDedicatedQA { get; set; }

    public bool ManualTesting { get; set; }
    public bool AutomatedTesting { get; set; }
    public bool UnitTesting { get; set; }
    public bool IntegrationTesting { get; set; }
    public bool E2ETesting { get; set; }
    public bool PerformanceTesting { get; set; }

    [StringLength(20)]
    public string? CodeCoverageTarget { get; set; } // No formal target, 50-60%, etc.

    // Team Structure
    public int TotalTeamSize { get; set; }
    public int NumberOfScrumTeams { get; set; }

    // Role Counts
    public int SoftwareDevelopers { get; set; }
    public int SeniorLeadDevelopers { get; set; }
    public int QAEngineers { get; set; }
    public int DatabaseEngineers { get; set; }
    public int DevOpsEngineers { get; set; }
    public int BusinessAnalysts { get; set; }
    public int ProductManagers { get; set; }
    public int ProjectManagers { get; set; }
    public int ScrumMasters { get; set; }
    public int UIUXDesigners { get; set; }
    public int Architects { get; set; }

    // Development Practices
    public bool CodeReviews { get; set; }
    public bool PairProgramming { get; set; }
    public bool TestDrivenDevelopment { get; set; }
    public bool BehaviorDrivenDevelopment { get; set; }
    public bool ContinuousIntegration { get; set; }
    public bool ContinuousDeployment { get; set; }
    public bool FeatureFlags { get; set; }
    public bool ABTesting { get; set; }
    public bool CodeDocumentationStandards { get; set; }
    public bool APIDocumentation { get; set; }
    public bool TechnicalDebtManagement { get; set; }
    public bool PerformanceMonitoring { get; set; }

    // Communication Tools
    public bool MicrosoftTeams { get; set; }
    public bool Slack { get; set; }
    public bool Discord { get; set; }
    public bool Email { get; set; }
    public bool OtherCommunicationTools { get; set; }

    // Project Management Tools
    public bool AzureDevOps { get; set; }
    public bool Jira { get; set; }
    public bool GitHubProjects { get; set; }
    public bool Trello { get; set; }
    public bool Asana { get; set; }
    public bool MondayCom { get; set; }
    public bool OtherProjectManagementTools { get; set; }

    // Meeting Cadence
    public bool DailyStandups { get; set; }
    public bool SprintPlanning { get; set; }
    public bool SprintReviews { get; set; }
    public bool Retrospectives { get; set; }
    public bool BacklogGrooming { get; set; }
    public bool ArchitectureReviews { get; set; }

    // Technology Stack
    [StringLength(500)]
    public string? PrimaryProgrammingLanguages { get; set; }

    public bool VisualStudio { get; set; }
    public bool VSCode { get; set; }
    public bool IntelliJIDEA { get; set; }
    public bool Eclipse { get; set; }
    public bool OtherIDEs { get; set; }

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    // Navigation property
    [ForeignKey("AssessmentId")]
    public virtual Assessment? Assessment { get; set; }
}