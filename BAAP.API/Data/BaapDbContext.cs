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
    public DbSet<AssessmentFile> AssessmentFiles { get; set; } = null!;

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

        // Configure decimal precision for currency fields
        modelBuilder.Entity<Assessment>()
            .Property(a => a.EstimatedCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Assessment>()
            .Property(a => a.PotentialSavings)
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
    }
}