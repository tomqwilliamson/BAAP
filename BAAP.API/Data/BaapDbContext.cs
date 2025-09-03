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
    public DbSet<DocumentEmbedding> DocumentEmbeddings { get; set; } = null!;
    
    // Architecture Review models
    public DbSet<ArchitectureReview> ArchitectureReviews { get; set; } = null!;
    public DbSet<ArchitecturePattern> ArchitecturePatterns { get; set; } = null!;
    public DbSet<TechnologyStack> TechnologyStacks { get; set; } = null!;
    public DbSet<CodebaseStats> CodebaseStats { get; set; } = null!;
    
    // Development Practices
    public DbSet<DevelopmentPractices> DevelopmentPractices { get; set; } = null!;
    
    // AI Analysis Results
    public DbSet<AIAnalysisResult> AIAnalysisResults { get; set; } = null!;
    
    // Phase 4: Industry Classification models
    public DbSet<IndustryClassification> IndustryClassifications { get; set; } = null!;
    public DbSet<AssessmentIndustryClassification> AssessmentIndustryClassifications { get; set; } = null!;
    public DbSet<IndustryBenchmark> IndustryBenchmarks { get; set; } = null!;

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

        // Configure DocumentEmbedding entity
        modelBuilder.Entity<DocumentEmbedding>()
            .HasOne(de => de.Assessment)
            .WithMany()
            .HasForeignKey(de => de.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure complex properties as JSON
        modelBuilder.Entity<DocumentEmbedding>()
            .Property(de => de.KeyFindings)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

        modelBuilder.Entity<DocumentEmbedding>()
            .Property(de => de.Metadata)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new Dictionary<string, object>());

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

        // AI Analysis Results relationship
        modelBuilder.Entity<AIAnalysisResult>()
            .HasOne(aar => aar.Assessment)
            .WithMany()
            .HasForeignKey(aar => aar.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Add unique constraint for AssessmentId + ModuleName combination
        modelBuilder.Entity<AIAnalysisResult>()
            .HasIndex(aar => new { aar.AssessmentId, aar.ModuleName })
            .IsUnique();

        // Phase 4: Industry Classification configurations
        modelBuilder.Entity<IndustryClassification>(entity =>
        {
            entity.HasKey(ic => ic.Id);
            entity.HasIndex(ic => ic.IndustryCode).IsUnique();
            
            // Self-referencing relationship for hierarchical industries
            entity.HasOne(ic => ic.ParentIndustry)
                .WithMany(ic => ic.SubIndustries)
                .HasForeignKey(ic => ic.ParentIndustryId)
                .OnDelete(DeleteBehavior.Restrict);

            // JSON conversions for complex properties
            entity.Property(ic => ic.ComplianceFrameworks)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.TechnologyPatterns)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.RegulatoryConsiderations)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.KeyPerformanceIndicators)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.RiskFactors)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.BestPractices)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());

            entity.Property(ic => ic.SecurityRequirements)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new List<string>());
        });

        modelBuilder.Entity<AssessmentIndustryClassification>(entity =>
        {
            entity.HasKey(aic => aic.Id);
            
            entity.HasOne(aic => aic.Assessment)
                .WithMany()
                .HasForeignKey(aic => aic.AssessmentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(aic => aic.IndustryClassification)
                .WithMany()
                .HasForeignKey(aic => aic.IndustryClassificationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint - one classification per assessment
            entity.HasIndex(aic => aic.AssessmentId).IsUnique();
        });

        modelBuilder.Entity<IndustryBenchmark>(entity =>
        {
            entity.HasKey(ib => ib.Id);
            
            entity.HasOne(ib => ib.IndustryClassification)
                .WithMany()
                .HasForeignKey(ib => ib.IndustryClassificationId)
                .OnDelete(DeleteBehavior.Cascade);

            // JSON conversion for percentile data
            entity.Property(ib => ib.PercentileData)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null!),
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, double>>(v, (System.Text.Json.JsonSerializerOptions)null!) ?? new Dictionary<string, double>());

            // Index for efficient querying
            entity.HasIndex(ib => new { ib.IndustryClassificationId, ib.MetricCategory });
        });
    }
}