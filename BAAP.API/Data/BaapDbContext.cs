using Microsoft.EntityFrameworkCore;
using BAAP.API.Models;
using BAAP.API.Controllers;

namespace BAAP.API.Data;

public class BaapDbContext : DbContext
{
    public BaapDbContext(DbContextOptions<BaapDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Assessment> Assessments { get; set; } = null!;
    public DbSet<Application> Applications { get; set; } = null!;
    public DbSet<SecurityFinding> SecurityFindings { get; set; } = null!;
    public DbSet<BusinessDriver> BusinessDrivers { get; set; } = null!;
    public DbSet<Stakeholder> Stakeholders { get; set; } = null!;
    public DbSet<Recommendation> Recommendations { get; set; } = null!;
    public DbSet<CodeMetric> CodeMetrics { get; set; } = null!;
    public DbSet<DashboardMetric> DashboardMetrics { get; set; } = null!;
    public DbSet<BAAP.API.Controllers.AssessmentFile> AssessmentFiles { get; set; } = null!;
    public DbSet<InfrastructureServer> InfrastructureServers { get; set; } = null!;
    public DbSet<DatabaseInstance> DatabaseInstances { get; set; } = null!;
    public DbSet<SecurityVulnerability> SecurityVulnerabilities { get; set; } = null!;
    public DbSet<ComplianceFramework> ComplianceFrameworks { get; set; } = null!;
    public DbSet<BudgetAllocation> BudgetAllocations { get; set; } = null!;
    public DbSet<ProjectTimelineItem> ProjectTimelineItems { get; set; } = null!;
    public DbSet<BusinessContextRisk> BusinessContextRisks { get; set; } = null!;
    
    // Architecture Review models
    public DbSet<ArchitectureReview> ArchitectureReviews { get; set; } = null!;
    public DbSet<ArchitecturePattern> ArchitecturePatterns { get; set; } = null!;
    public DbSet<TechnologyStack> TechnologyStacks { get; set; } = null!;
    public DbSet<CodebaseStats> CodebaseStats { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<Application>()
            .HasOne(a => a.Assessment)
            .WithMany(assessment => assessment.Applications)
            .HasForeignKey(a => a.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SecurityFinding>()
            .HasOne(sf => sf.Application)
            .WithMany(a => a.SecurityFindings)
            .HasForeignKey(sf => sf.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CodeMetric>()
            .HasOne(cm => cm.Application)
            .WithMany(a => a.CodeMetrics)
            .HasForeignKey(cm => cm.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BusinessDriver>()
            .HasOne(bd => bd.Assessment)
            .WithMany(a => a.BusinessDrivers)
            .HasForeignKey(bd => bd.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Stakeholder>()
            .HasOne(s => s.Assessment)
            .WithMany(a => a.Stakeholders)
            .HasForeignKey(s => s.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Recommendation>()
            .HasOne(r => r.Assessment)
            .WithMany(a => a.Recommendations)
            .HasForeignKey(r => r.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DashboardMetric>()
            .HasOne(dm => dm.Assessment)
            .WithMany()
            .HasForeignKey(dm => dm.AssessmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<AssessmentFile>()
            .HasOne(af => af.Assessment)
            .WithMany()
            .HasForeignKey(af => af.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InfrastructureServer>()
            .HasOne(s => s.Assessment)
            .WithMany()
            .HasForeignKey(s => s.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DatabaseInstance>()
            .HasOne(db => db.Assessment)
            .WithMany()
            .HasForeignKey(db => db.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SecurityVulnerability>()
            .HasOne(sv => sv.Assessment)
            .WithMany()
            .HasForeignKey(sv => sv.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ComplianceFramework>()
            .HasOne(cf => cf.Assessment)
            .WithMany()
            .HasForeignKey(cf => cf.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BudgetAllocation>()
            .HasOne(ba => ba.Assessment)
            .WithMany()
            .HasForeignKey(ba => ba.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectTimelineItem>()
            .HasOne(pti => pti.Assessment)
            .WithMany()
            .HasForeignKey(pti => pti.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BusinessContextRisk>()
            .HasOne(bcr => bcr.Assessment)
            .WithMany()
            .HasForeignKey(bcr => bcr.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure decimal precision for currency fields
        modelBuilder.Entity<Assessment>()
            .Property(a => a.EstimatedCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Assessment>()
            .Property(a => a.PotentialSavings)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Assessment>()
            .Property(a => a.Budget)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Application>()
            .Property(a => a.EstimatedMigrationCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Application>()
            .Property(a => a.MonthlyCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Recommendation>()
            .Property(r => r.EstimatedCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Recommendation>()
            .Property(r => r.PotentialSavings)
            .HasPrecision(18, 2);

        // Architecture Review relationships
        modelBuilder.Entity<ArchitectureReview>()
            .HasOne(ar => ar.Assessment)
            .WithMany()
            .HasForeignKey(ar => ar.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ArchitecturePattern>()
            .HasOne(ap => ap.ArchitectureReview)
            .WithMany(ar => ar.ArchitecturePatterns)
            .HasForeignKey(ap => ap.ArchitectureReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TechnologyStack>()
            .HasOne(ts => ts.ArchitectureReview)
            .WithMany(ar => ar.TechnologyStacks)
            .HasForeignKey(ts => ts.ArchitectureReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CodebaseStats>()
            .HasOne(cs => cs.ArchitectureReview)
            .WithMany()
            .HasForeignKey(cs => cs.ArchitectureReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}