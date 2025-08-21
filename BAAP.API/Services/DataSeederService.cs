using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BAAP.API.Services;

public class DataSeederService
{
    private readonly BaapDbContext _context;
    private readonly ILogger<DataSeederService> _logger;

    public DataSeederService(BaapDbContext context, ILogger<DataSeederService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedDataAsync()
    {
        try
        {
            // Check if data already exists
            if (await _context.Assessments.AnyAsync())
            {
                _logger.LogInformation("Database already contains data, skipping seeding.");
                return;
            }

            _logger.LogInformation("Seeding database with sample data...");

            // Create sample assessment
            var assessment = new Assessment
            {
                Name = "Enterprise Application Modernization Initiative",
                Description = "Comprehensive assessment and modernization of legacy applications to support digital transformation and improve operational efficiency",
                Status = "In Progress",
                CreatedDate = DateTime.UtcNow.AddDays(-30),
                StartedDate = DateTime.UtcNow.AddDays(-25),
                EstimatedCost = 3200000m,
                PotentialSavings = 1240000m,
                OverallScore = 76,
                SecurityScore = 68,
                CloudReadinessScore = 72
            };

            _context.Assessments.Add(assessment);
            await _context.SaveChangesAsync();

            // Create sample applications
            var applications = new[]
            {
                new Application
                {
                    Name = "Customer Portal Web App",
                    Description = "Customer-facing web application for account management and support",
                    Type = "React SPA",
                    Category = "Customer-Facing",
                    Technology = "React, Node.js, PostgreSQL",
                    LinesOfCode = 45670,
                    ComplexityScore = 78,
                    SecurityRating = 72,
                    CloudReadinessScore = 85,
                    EstimatedMigrationCost = 125000m,
                    MonthlyCost = 2850m,
                    AssessmentId = assessment.Id,
                    LastAnalyzedDate = DateTime.UtcNow.AddDays(-2)
                },
                new Application
                {
                    Name = "Employee Management System",
                    Description = "Internal HR management system",
                    Type = "ASP.NET MVC",
                    Category = "Internal",
                    Technology = ".NET Framework 4.8, SQL Server",
                    LinesOfCode = 67800,
                    ComplexityScore = 92,
                    SecurityRating = 65,
                    CloudReadinessScore = 60,
                    EstimatedMigrationCost = 180000m,
                    MonthlyCost = 4200m,
                    AssessmentId = assessment.Id,
                    LastAnalyzedDate = DateTime.UtcNow.AddDays(-5)
                },
                new Application
                {
                    Name = "Mobile Banking App",
                    Description = "Mobile application for banking services",
                    Type = "React Native",
                    Category = "Customer-Facing",
                    Technology = "React Native, Express.js, MongoDB",
                    LinesOfCode = 32400,
                    ComplexityScore = 68,
                    SecurityRating = 88,
                    CloudReadinessScore = 78,
                    EstimatedMigrationCost = 95000m,
                    MonthlyCost = 1950m,
                    AssessmentId = assessment.Id,
                    LastAnalyzedDate = DateTime.UtcNow.AddDays(-1)
                }
            };

            _context.Applications.AddRange(applications);
            await _context.SaveChangesAsync();

            // Create security findings
            var securityFindings = new[]
            {
                new SecurityFinding
                {
                    Title = "SQL Injection Vulnerability",
                    Description = "User input not properly sanitized in search functionality",
                    Severity = "Critical",
                    Category = "Injection",
                    FileName = "SearchController.cs",
                    LineNumber = 45,
                    Source = "SAST",
                    ApplicationId = applications[0].Id
                },
                new SecurityFinding
                {
                    Title = "Cross-Site Scripting (XSS)",
                    Description = "Reflected XSS in user profile page",
                    Severity = "High",
                    Category = "XSS",
                    FileName = "profile.js",
                    LineNumber = 123,
                    Source = "DAST",
                    ApplicationId = applications[0].Id
                },
                new SecurityFinding
                {
                    Title = "Outdated Dependencies",
                    Description = "Multiple dependencies with known vulnerabilities",
                    Severity = "Medium",
                    Category = "Components",
                    Source = "Dependency Check",
                    ApplicationId = applications[1].Id
                }
            };

            _context.SecurityFindings.AddRange(securityFindings);

            // Create business drivers
            var businessDrivers = new[]
            {
                new BusinessDriver
                {
                    Name = "Digital Transformation Acceleration",
                    Description = "Modernize core business applications to support digital-first customer experiences",
                    Priority = "Critical",
                    Impact = 95,
                    Urgency = 88,
                    BusinessValue = "Competitive advantage and customer satisfaction",
                    AssessmentId = assessment.Id
                },
                new BusinessDriver
                {
                    Name = "Cost Optimization",
                    Description = "Reduce operational costs through cloud migration and infrastructure optimization",
                    Priority = "High",
                    Impact = 82,
                    Urgency = 75,
                    BusinessValue = "Annual savings of $800,000+ on infrastructure",
                    AssessmentId = assessment.Id
                }
            };

            _context.BusinessDrivers.AddRange(businessDrivers);

            // Create stakeholders
            var stakeholders = new[]
            {
                new Stakeholder
                {
                    Name = "John Smith",
                    Role = "CTO",
                    Department = "Technology",
                    Email = "john.smith@company.com",
                    InfluenceLevel = "High",
                    InterestLevel = "High",
                    AssessmentId = assessment.Id
                },
                new Stakeholder
                {
                    Name = "Sarah Johnson",
                    Role = "Head of Digital",
                    Department = "Digital",
                    Email = "sarah.johnson@company.com",
                    InfluenceLevel = "High",
                    InterestLevel = "High",
                    AssessmentId = assessment.Id
                }
            };

            _context.Stakeholders.AddRange(stakeholders);

            // Create recommendations
            var recommendations = new[]
            {
                new Recommendation
                {
                    Title = "Implement Zero Trust Security Model",
                    Description = "Deploy comprehensive zero trust architecture to enhance security posture",
                    Category = "Security",
                    Priority = "Critical",
                    Effort = "Large",
                    EstimatedCost = 250000m,
                    PotentialSavings = 500000m,
                    TimeframeWeeks = 16,
                    AssessmentId = assessment.Id
                },
                new Recommendation
                {
                    Title = "Containerize Legacy Applications",
                    Description = "Modernize applications using Docker containers for better scalability",
                    Category = "Modernization",
                    Priority = "High",
                    Effort = "Medium",
                    EstimatedCost = 180000m,
                    PotentialSavings = 300000m,
                    TimeframeWeeks = 12,
                    AssessmentId = assessment.Id
                }
            };

            _context.Recommendations.AddRange(recommendations);

            await _context.SaveChangesAsync();

            _logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }
}