using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BAAP.API.Services;

public class DataSeederService
{
    private readonly BaapDbContext _context;
    private readonly ILogger<DataSeederService> _logger;
    private readonly IWebHostEnvironment _environment;

    public DataSeederService(BaapDbContext context, ILogger<DataSeederService> logger, IWebHostEnvironment environment)
    {
        _context = context;
        _logger = logger;
        _environment = environment;
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

            _logger.LogInformation("Seeding database with comprehensive mock data...");

            // Seed assessments first (from extracted mock data)
            var assessments = await SeedAssessments();
            
            // Seed applications
            await SeedApplications(assessments);
            
            // Seed security findings
            await SeedSecurityFindings();
            
            // Seed business drivers
            await SeedBusinessDrivers(assessments);
            
            // Seed stakeholders
            await SeedStakeholders(assessments);
            
            // Seed recommendations
            await SeedRecommendations(assessments);

            await _context.SaveChangesAsync();
            _logger.LogInformation("Database seeding completed successfully with {AssessmentCount} assessments.", assessments.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }

    private async Task<List<Assessment>> SeedAssessments()
    {
        var assessments = new List<Assessment>
        {
            new Assessment
            {
                Name = "Q4 2024 Portfolio Assessment",
                Description = "Comprehensive assessment of the application portfolio for cloud migration readiness and optimization opportunities.",
                Status = "Completed",
                CreatedDate = DateTime.Parse("2024-12-15T10:30:00Z").ToUniversalTime(),
                StartedDate = DateTime.Parse("2024-12-16T10:30:00Z").ToUniversalTime(),
                EstimatedCost = 3200000m,
                PotentialSavings = 1240000m,
                OverallScore = 76,
                SecurityScore = 68,
                CloudReadinessScore = 72
            },
            new Assessment
            {
                Name = "Security Compliance Review",
                Description = "Security-focused assessment to identify vulnerabilities and compliance gaps across key applications.",
                Status = "InProgress",
                CreatedDate = DateTime.Parse("2024-12-18T14:45:00Z").ToUniversalTime(),
                StartedDate = DateTime.Parse("2024-12-19T14:45:00Z").ToUniversalTime(),
                EstimatedCost = 1500000m,
                PotentialSavings = 850000m,
                OverallScore = 68,
                SecurityScore = 65,
                CloudReadinessScore = 70
            },
            new Assessment
            {
                Name = "Cloud Migration Readiness",
                Description = "Evaluation of legacy systems for cloud migration potential and modernization strategies.",
                Status = "Analyzing",
                CreatedDate = DateTime.Parse("2024-12-20T09:15:00Z").ToUniversalTime(),
                StartedDate = DateTime.Parse("2024-12-21T09:15:00Z").ToUniversalTime(),
                EstimatedCost = 4500000m,
                PotentialSavings = 2100000m,
                OverallScore = 82,
                SecurityScore = 75,
                CloudReadinessScore = 85
            }
        };

        _context.Assessments.AddRange(assessments);
        await _context.SaveChangesAsync();
        return assessments;
    }

    private async Task SeedApplications(List<Assessment> assessments)
    {
        var applications = new[]
        {
            new Application
            {
                Name = "Customer Portal Web App",
                Description = "Customer-facing web application for account management and support",
                Type = "React SPA",
                Category = "Customer-Facing",
                Technology = "React, Node.js, PostgreSQL",
                LinesOfCode = 45000,
                ComplexityScore = 72,
                SecurityRating = 72,
                CloudReadinessScore = 85,
                EstimatedMigrationCost = 125000m,
                MonthlyCost = 2400m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-20T10:30:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Internal ERP System",
                Description = "Internal HR management system",
                Type = ".NET Core API",
                Category = "Business Critical",
                Technology = ".NET Core, SQL Server",
                LinesOfCode = 89000,
                ComplexityScore = 85,
                SecurityRating = 60,
                CloudReadinessScore = 72,
                EstimatedMigrationCost = 275000m,
                MonthlyCost = 5200m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-19T14:15:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Mobile Banking App",
                Description = "Mobile application for banking services",
                Type = "React Native",
                Category = "Customer-Facing",
                Technology = "React Native, Express.js, MongoDB",
                LinesOfCode = 62000,
                ComplexityScore = 68,
                SecurityRating = 88,
                CloudReadinessScore = 91,
                EstimatedMigrationCost = 85000m,
                MonthlyCost = 1800m,
                AssessmentId = assessments[1].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-18T09:45:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Legacy Payment Gateway",
                Description = "Critical payment processing system",
                Type = "Java Spring",
                Category = "Business Critical",
                Technology = "Java, Spring Boot, Oracle DB",
                LinesOfCode = 125000,
                ComplexityScore = 92,
                SecurityRating = 45,
                CloudReadinessScore = 58,
                EstimatedMigrationCost = 450000m,
                MonthlyCost = 8500m,
                AssessmentId = assessments[2].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-17T16:20:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Employee Management System",
                Description = "HR management and payroll system",
                Type = "ASP.NET MVC",
                Category = "Internal",
                Technology = ".NET Framework 4.8, SQL Server",
                LinesOfCode = 67800,
                ComplexityScore = 78,
                SecurityRating = 55,
                CloudReadinessScore = 60,
                EstimatedMigrationCost = 180000m,
                MonthlyCost = 4200m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-16T11:00:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Data Analytics Platform",
                Description = "Business intelligence and reporting platform",
                Type = "Python Django",
                Category = "Business Intelligence",
                Technology = "Python, Django, PostgreSQL, Redis",
                LinesOfCode = 89500,
                ComplexityScore = 85,
                SecurityRating = 75,
                CloudReadinessScore = 80,
                EstimatedMigrationCost = 200000m,
                MonthlyCost = 3800m,
                AssessmentId = assessments[1].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-15T13:20:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "E-commerce API",
                Description = "Backend API for e-commerce operations",
                Type = "Node.js API",
                Category = "Customer-Facing",
                Technology = "Node.js, Express, MongoDB",
                LinesOfCode = 58900,
                ComplexityScore = 70,
                SecurityRating = 68,
                CloudReadinessScore = 82,
                EstimatedMigrationCost = 110000m,
                MonthlyCost = 2100m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-14T16:45:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Document Management System",
                Description = "Internal document storage and collaboration",
                Type = "SharePoint",
                Category = "Internal",
                Technology = "SharePoint, SQL Server",
                LinesOfCode = 25600,
                ComplexityScore = 60,
                SecurityRating = 62,
                CloudReadinessScore = 55,
                EstimatedMigrationCost = 95000m,
                MonthlyCost = 1500m,
                AssessmentId = assessments[2].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-13T10:15:00Z").ToUniversalTime()
            }
        };

        _context.Applications.AddRange(applications);
        await _context.SaveChangesAsync();
    }

    private async Task SeedSecurityFindings()
    {
        var applications = await _context.Applications.ToListAsync();
        
        var securityFindings = new[]
        {
            new SecurityFinding
            {
                Title = "SQL Injection Vulnerability",
                Description = "User input is not properly sanitized in database queries",
                Severity = "Critical",
                Category = "A03:2021 – Injection",
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
                Category = "A07:2021 – Cross-Site Scripting",
                FileName = "profile.js",
                LineNumber = 123,
                Source = "DAST",
                ApplicationId = applications[0].Id
            },
            new SecurityFinding
            {
                Title = "Missing Security Headers",
                Description = "Essential security headers not implemented",
                Severity = "Medium",
                Category = "A05:2021 – Security Misconfiguration",
                FileName = "web.config",
                LineNumber = 15,
                Source = "Manual Review",
                ApplicationId = applications[0].Id
            },
            new SecurityFinding
            {
                Title = "Weak Password Policy",
                Description = "Password requirements do not meet security standards",
                Severity = "High",
                Category = "A07:2021 – Identification and Authentication Failures",
                FileName = "AuthService.cs",
                LineNumber = 78,
                Source = "Code Review",
                ApplicationId = applications[1].Id
            },
            new SecurityFinding
            {
                Title = "Outdated Dependencies",
                Description = "Multiple dependencies with known vulnerabilities",
                Severity = "Medium",
                Category = "A06:2021 – Vulnerable Components",
                FileName = "package.json",
                LineNumber = 1,
                Source = "Dependency Check",
                ApplicationId = applications[1].Id
            },
            new SecurityFinding
            {
                Title = "Insecure Direct Object References",
                Description = "Users can access unauthorized resources",
                Severity = "High",
                Category = "A01:2021 – Broken Access Control",
                FileName = "UserController.java",
                LineNumber = 156,
                Source = "Penetration Test",
                ApplicationId = applications[3].Id
            },
            new SecurityFinding
            {
                Title = "Hard-coded Secrets",
                Description = "API keys and secrets hard-coded in source",
                Severity = "Critical",
                Category = "A02:2021 – Cryptographic Failures",
                FileName = "config.java",
                LineNumber = 23,
                Source = "Secret Scanner",
                ApplicationId = applications[3].Id
            },
            new SecurityFinding
            {
                Title = "Missing Input Validation",
                Description = "User inputs not properly validated",
                Severity = "Medium",
                Category = "A03:2021 – Injection",
                FileName = "FormHandler.cs",
                LineNumber = 89,
                Source = "Code Review",
                ApplicationId = applications[1].Id
            },
            new SecurityFinding
            {
                Title = "Insufficient Logging",
                Description = "Security events not properly logged",
                Severity = "Low",
                Category = "A09:2021 – Security Logging Failures",
                FileName = "Logger.py",
                LineNumber = 67,
                Source = "Audit",
                ApplicationId = applications.Count > 5 ? applications[5].Id : applications[0].Id
            },
            new SecurityFinding
            {
                Title = "Broken Authentication",
                Description = "Session management vulnerabilities",
                Severity = "High",
                Category = "A07:2021 – Identification and Authentication Failures",
                FileName = "auth.js",
                LineNumber = 234,
                Source = "DAST",
                ApplicationId = applications[2].Id
            }
        };

        _context.SecurityFindings.AddRange(securityFindings);
    }

    private async Task SeedBusinessDrivers(List<Assessment> assessments)
    {
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
                AssessmentId = assessments[0].Id
            },
            new BusinessDriver
            {
                Name = "Cost Optimization",
                Description = "Reduce operational costs through cloud migration and infrastructure optimization",
                Priority = "High",
                Impact = 82,
                Urgency = 75,
                BusinessValue = "Annual savings of $800,000+ on infrastructure",
                AssessmentId = assessments[0].Id
            },
            new BusinessDriver
            {
                Name = "Security Compliance",
                Description = "Achieve regulatory compliance and improve security posture",
                Priority = "Critical",
                Impact = 90,
                Urgency = 92,
                BusinessValue = "Risk mitigation and regulatory compliance",
                AssessmentId = assessments[1].Id
            },
            new BusinessDriver
            {
                Name = "Scalability Requirements",
                Description = "Support business growth through scalable infrastructure",
                Priority = "High",
                Impact = 78,
                Urgency = 70,
                BusinessValue = "Enable 3x business growth without infrastructure constraints",
                AssessmentId = assessments[0].Id
            },
            new BusinessDriver
            {
                Name = "Innovation Enablement",
                Description = "Enable faster time-to-market for new products and features",
                Priority = "Medium",
                Impact = 75,
                Urgency = 65,
                BusinessValue = "Reduce development cycles from 6 months to 2 months",
                AssessmentId = assessments[2].Id
            },
            new BusinessDriver
            {
                Name = "Disaster Recovery Improvement",
                Description = "Enhance business continuity and disaster recovery capabilities",
                Priority = "High",
                Impact = 85,
                Urgency = 80,
                BusinessValue = "Reduce RTO from 24 hours to 4 hours",
                AssessmentId = assessments[1].Id
            }
        };

        _context.BusinessDrivers.AddRange(businessDrivers);
    }

    private async Task SeedStakeholders(List<Assessment> assessments)
    {
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
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Sarah Johnson",
                Role = "Head of Digital",
                Department = "Digital",
                Email = "sarah.johnson@company.com",
                InfluenceLevel = "High",
                InterestLevel = "High",
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Michael Brown",
                Role = "CISO",
                Department = "Security",
                Email = "michael.brown@company.com",
                InfluenceLevel = "High",
                InterestLevel = "High",
                AssessmentId = assessments[1].Id
            },
            new Stakeholder
            {
                Name = "Emily Davis",
                Role = "VP of Operations",
                Department = "Operations",
                Email = "emily.davis@company.com",
                InfluenceLevel = "Medium",
                InterestLevel = "High",
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Robert Wilson",
                Role = "Lead Developer",
                Department = "Development",
                Email = "robert.wilson@company.com",
                InfluenceLevel = "Medium",
                InterestLevel = "High",
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Lisa Anderson",
                Role = "Security Architect",
                Department = "Security",
                Email = "lisa.anderson@company.com",
                InfluenceLevel = "Medium",
                InterestLevel = "High",
                AssessmentId = assessments[1].Id
            },
            new Stakeholder
            {
                Name = "David Martinez",
                Role = "Infrastructure Manager",
                Department = "IT Infrastructure",
                Email = "david.martinez@company.com",
                InfluenceLevel = "Medium",
                InterestLevel = "Medium",
                AssessmentId = assessments[2].Id
            },
            new Stakeholder
            {
                Name = "Jennifer Lee",
                Role = "Business Analyst",
                Department = "Business",
                Email = "jennifer.lee@company.com",
                InfluenceLevel = "Low",
                InterestLevel = "Medium",
                AssessmentId = assessments[0].Id
            }
        };

        _context.Stakeholders.AddRange(stakeholders);
    }

    private async Task SeedRecommendations(List<Assessment> assessments)
    {
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
                AssessmentId = assessments[0].Id
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
                AssessmentId = assessments[0].Id
            },
            new Recommendation
            {
                Title = "Cloud Migration Strategy",
                Description = "Develop and execute comprehensive cloud migration plan",
                Category = "Infrastructure",
                Priority = "Critical",
                Effort = "Large",
                EstimatedCost = 650000m,
                PotentialSavings = 1200000m,
                TimeframeWeeks = 52,
                AssessmentId = assessments[0].Id
            },
            new Recommendation
            {
                Title = "Security Posture Enhancement",
                Description = "Address critical security vulnerabilities across all applications",
                Category = "Security",
                Priority = "Critical",
                Effort = "Medium",
                EstimatedCost = 200000m,
                PotentialSavings = 800000m,
                TimeframeWeeks = 20,
                AssessmentId = assessments[1].Id
            },
            new Recommendation
            {
                Title = "DevOps Pipeline Optimization",
                Description = "Implement advanced CI/CD practices and infrastructure automation",
                Category = "DevOps",
                Priority = "High",
                Effort = "Medium",
                EstimatedCost = 120000m,
                PotentialSavings = 250000m,
                TimeframeWeeks = 8,
                AssessmentId = assessments[0].Id
            },
            new Recommendation
            {
                Title = "Database Modernization",
                Description = "Upgrade and optimize database systems for cloud readiness",
                Category = "Database",
                Priority = "High",
                Effort = "Large",
                EstimatedCost = 300000m,
                PotentialSavings = 400000m,
                TimeframeWeeks = 24,
                AssessmentId = assessments[2].Id
            },
            new Recommendation
            {
                Title = "API Gateway Implementation",
                Description = "Deploy centralized API management and security gateway",
                Category = "Architecture",
                Priority = "Medium",
                Effort = "Medium",
                EstimatedCost = 80000m,
                PotentialSavings = 150000m,
                TimeframeWeeks = 10,
                AssessmentId = assessments[0].Id
            },
            new Recommendation
            {
                Title = "Monitoring and Observability",
                Description = "Implement comprehensive monitoring and alerting solutions",
                Category = "Infrastructure",
                Priority = "High",
                Effort = "Small",
                EstimatedCost = 50000m,
                PotentialSavings = 100000m,
                TimeframeWeeks = 6,
                AssessmentId = assessments[0].Id
            },
            new Recommendation
            {
                Title = "Identity and Access Management",
                Description = "Modernize IAM systems with single sign-on and MFA",
                Category = "Security",
                Priority = "High",
                Effort = "Medium",
                EstimatedCost = 150000m,
                PotentialSavings = 300000m,
                TimeframeWeeks = 14,
                AssessmentId = assessments[1].Id
            },
            new Recommendation
            {
                Title = "Backup and Disaster Recovery",
                Description = "Implement automated backup and disaster recovery systems",
                Category = "Infrastructure",
                Priority = "High",
                Effort = "Medium",
                EstimatedCost = 100000m,
                PotentialSavings = 200000m,
                TimeframeWeeks = 12,
                AssessmentId = assessments[2].Id
            }
        };

        _context.Recommendations.AddRange(recommendations);
    }
}