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
            
            // Seed code metrics
            await SeedCodeMetrics();
            
            // Seed dashboard metrics
            await SeedDashboardMetrics(assessments);
            
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
                Description = "Comprehensive assessment of the application portfolio for cloud migration readiness and optimization opportunities. This assessment covers 8 core business applications and evaluates security posture, cloud readiness, and modernization potential.",
                Status = "Completed",
                Type = "Portfolio Assessment",
                Scope = "Enterprise Applications",
                BusinessObjective = "Digital transformation and cost optimization through cloud migration",
                Timeline = "6 months",
                Budget = 3500000m,
                Notes = "Assessment completed on time and within budget. All stakeholders engaged successfully. Implementation roadmap developed with 3-phase approach.",
                CreatedDate = DateTime.Parse("2024-12-15T10:30:00Z").ToUniversalTime(),
                StartedDate = DateTime.Parse("2024-12-16T10:30:00Z").ToUniversalTime(),
                CompletedDate = DateTime.Parse("2024-12-22T17:00:00Z").ToUniversalTime(),
                EstimatedCost = 3200000m,
                PotentialSavings = 1240000m,
                OverallScore = 76,
                SecurityScore = 68,
                CloudReadinessScore = 72
            },
            new Assessment
            {
                Name = "Security Compliance Review",
                Description = "Security-focused assessment to identify vulnerabilities and compliance gaps across key applications. Includes OWASP Top 10 analysis, penetration testing, and regulatory compliance evaluation for SOX, PCI DSS, and GDPR requirements.",
                Status = "InProgress",
                Type = "Security Assessment",
                Scope = "Customer-Facing Applications",
                BusinessObjective = "Achieve compliance with security standards and reduce cyber risk",
                Timeline = "4 months",
                Budget = 1800000m,
                Notes = "Phase 1 completed: vulnerability scanning and static analysis. Phase 2 in progress: penetration testing and dynamic analysis. Some critical vulnerabilities identified requiring immediate attention.",
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
                Description = "Evaluation of legacy systems for cloud migration potential and modernization strategies. Includes infrastructure assessment, application dependency mapping, and cost-benefit analysis for Azure migration scenarios.",
                Status = "Analyzing",
                Type = "Migration Assessment",
                Scope = "Legacy Systems",
                BusinessObjective = "Modernize infrastructure and enable scalable growth",
                Timeline = "8 months",
                Budget = 5000000m,
                Notes = "Initial discovery phase completed. Application inventory and dependency mapping in progress. Early findings suggest 70% of applications are cloud-ready with minor modifications.",
                CreatedDate = DateTime.Parse("2024-12-20T09:15:00Z").ToUniversalTime(),
                StartedDate = DateTime.Parse("2024-12-21T09:15:00Z").ToUniversalTime(),
                EstimatedCost = 4500000m,
                PotentialSavings = 2100000m,
                OverallScore = 82,
                SecurityScore = 75,
                CloudReadinessScore = 85
            },
            new Assessment
            {
                Name = "DevOps Transformation Initiative",
                Description = "Assessment of current development and operations practices with roadmap for implementing modern DevOps practices, CI/CD pipelines, and infrastructure as code.",
                Status = "Draft",
                Type = "Process Assessment",
                Scope = "Development and Operations Teams",
                BusinessObjective = "Accelerate delivery cycles and improve software quality",
                Timeline = "5 months",
                Budget = 2200000m,
                Notes = "Stakeholder interviews scheduled. Current state analysis to begin next week. Initial focus on CI/CD pipeline maturity and deployment automation.",
                CreatedDate = DateTime.Parse("2024-12-23T11:20:00Z").ToUniversalTime(),
                EstimatedCost = 1800000m,
                PotentialSavings = 950000m,
                OverallScore = 0,
                SecurityScore = 0,
                CloudReadinessScore = 0
            },
            new Assessment
            {
                Name = "Data Architecture Modernization",
                Description = "Comprehensive review of data architecture, analytics capabilities, and migration strategy for modern data platforms including data lakes, AI/ML readiness, and real-time analytics.",
                Status = "Draft",
                Type = "Data Assessment",
                Scope = "Data and Analytics Platforms",
                BusinessObjective = "Enable data-driven decision making and advanced analytics",
                Timeline = "7 months",
                Budget = 3800000m,
                Notes = "Project charter approved. Data inventory and classification in preparation phase. Focus on real-time analytics capabilities and ML/AI readiness.",
                CreatedDate = DateTime.Parse("2024-12-24T09:30:00Z").ToUniversalTime(),
                EstimatedCost = 3200000m,
                PotentialSavings = 1600000m,
                OverallScore = 0,
                SecurityScore = 0,
                CloudReadinessScore = 0
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
                Description = "Internal document storage and collaboration platform with workflow capabilities",
                Type = "SharePoint",
                Category = "Internal",
                Technology = "SharePoint, SQL Server, .NET Framework",
                LinesOfCode = 25600,
                ComplexityScore = 60,
                SecurityRating = 62,
                CloudReadinessScore = 55,
                EstimatedMigrationCost = 95000m,
                MonthlyCost = 1500m,
                AssessmentId = assessments[2].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-13T10:15:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Supply Chain Management System",
                Description = "Comprehensive supply chain management and logistics platform",
                Type = "Oracle Application",
                Category = "Business Critical",
                Technology = "Oracle, PL/SQL, Java EE",
                LinesOfCode = 145000,
                ComplexityScore = 95,
                SecurityRating = 58,
                CloudReadinessScore = 42,
                EstimatedMigrationCost = 680000m,
                MonthlyCost = 12500m,
                AssessmentId = assessments[2].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-12T08:30:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Customer Support Portal",
                Description = "Self-service customer support with ticketing and knowledge base",
                Type = "Angular SPA",
                Category = "Customer-Facing",
                Technology = "Angular, TypeScript, .NET Core API",
                LinesOfCode = 52000,
                ComplexityScore = 65,
                SecurityRating = 78,
                CloudReadinessScore = 88,
                EstimatedMigrationCost = 98000m,
                MonthlyCost = 2200m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-11T15:20:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Financial Reporting System",
                Description = "Financial reporting and analytics platform for regulatory compliance",
                Type = "Power BI & SSRS",
                Category = "Business Intelligence",
                Technology = "Power BI, SSRS, SQL Server",
                LinesOfCode = 15800,
                ComplexityScore = 55,
                SecurityRating = 72,
                CloudReadinessScore = 75,
                EstimatedMigrationCost = 85000m,
                MonthlyCost = 3200m,
                AssessmentId = assessments[0].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-10T12:45:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Inventory Management API",
                Description = "Real-time inventory tracking and management microservice",
                Type = "Microservice API",
                Category = "Internal",
                Technology = "Go, PostgreSQL, Redis",
                LinesOfCode = 28500,
                ComplexityScore = 58,
                SecurityRating = 82,
                CloudReadinessScore = 92,
                EstimatedMigrationCost = 45000m,
                MonthlyCost = 1200m,
                AssessmentId = assessments[1].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-09T14:10:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Marketing Campaign Manager",
                Description = "Digital marketing campaign management and analytics platform",
                Type = "Vue.js SPA",
                Category = "Marketing",
                Technology = "Vue.js, Laravel, MySQL",
                LinesOfCode = 73000,
                ComplexityScore = 72,
                SecurityRating = 68,
                CloudReadinessScore = 78,
                EstimatedMigrationCost = 135000m,
                MonthlyCost = 2800m,
                AssessmentId = assessments[1].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-08T11:30:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "IoT Device Management Platform",
                Description = "IoT device monitoring and management dashboard",
                Type = "Real-time Dashboard",
                Category = "Operations",
                Technology = "React, Socket.io, InfluxDB",
                LinesOfCode = 38200,
                ComplexityScore = 68,
                SecurityRating = 75,
                CloudReadinessScore = 85,
                EstimatedMigrationCost = 72000m,
                MonthlyCost = 1900m,
                AssessmentId = assessments[3].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-07T16:15:00Z").ToUniversalTime()
            },
            new Application
            {
                Name = "Legacy Mainframe Interface",
                Description = "Interface layer for legacy mainframe systems",
                Type = "COBOL Interface",
                Category = "Legacy Integration",
                Technology = "COBOL, DB2, MQ Series",
                LinesOfCode = 95000,
                ComplexityScore = 98,
                SecurityRating = 35,
                CloudReadinessScore = 25,
                EstimatedMigrationCost = 850000m,
                MonthlyCost = 18500m,
                AssessmentId = assessments[2].Id,
                LastAnalyzedDate = DateTime.Parse("2024-12-06T09:45:00Z").ToUniversalTime()
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
                Description = "Session management vulnerabilities including weak session tokens and improper session invalidation",
                Severity = "High",
                Category = "A07:2021 – Identification and Authentication Failures",
                FileName = "auth.js",
                LineNumber = 234,
                Source = "DAST",
                ApplicationId = applications[2].Id
            },
            new SecurityFinding
            {
                Title = "Sensitive Data Exposure",
                Description = "PII and financial data transmitted without proper encryption",
                Severity = "Critical",
                Category = "A02:2021 – Cryptographic Failures",
                FileName = "PaymentController.java",
                LineNumber = 89,
                Source = "Code Review",
                ApplicationId = applications.Count > 8 ? applications[8].Id : applications[3].Id
            },
            new SecurityFinding
            {
                Title = "Server-Side Request Forgery (SSRF)",
                Description = "Application fetches remote resources without validating user-supplied URLs",
                Severity = "High",
                Category = "A10:2021 – Server-Side Request Forgery",
                FileName = "DocumentProcessor.cs",
                LineNumber = 156,
                Source = "Penetration Test",
                ApplicationId = applications[7].Id
            },
            new SecurityFinding
            {
                Title = "Excessive Data Exposure",
                Description = "API returns more data than necessary, exposing sensitive information",
                Severity = "Medium",
                Category = "API Security",
                FileName = "UserController.go",
                LineNumber = 78,
                Source = "API Security Test",
                ApplicationId = applications.Count > 10 ? applications[10].Id : applications[4].Id
            },
            new SecurityFinding
            {
                Title = "XML External Entities (XXE)",
                Description = "XML parser processes external entities leading to data disclosure",
                Severity = "High",
                Category = "A03:2021 – Injection",
                FileName = "XmlProcessor.py",
                LineNumber = 45,
                Source = "SAST",
                ApplicationId = applications.Count > 9 ? applications[9].Id : applications[5].Id
            }
        };

        _context.SecurityFindings.AddRange(securityFindings);
    }

    private async Task SeedCodeMetrics()
    {
        var applications = await _context.Applications.ToListAsync();
        var random = new Random(42); // Fixed seed for consistent results

        var codeMetrics = new List<CodeMetric>();

        foreach (var app in applications)
        {
            // Complexity metrics
            codeMetrics.AddRange(new[]
            {
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Cyclomatic Complexity",
                    Value = random.Next(1, 15),
                    Unit = "complexity points",
                    Category = "Complexity",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                },
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Technical Debt Ratio",
                    Value = Math.Round(random.NextDouble() * 30, 2),
                    Unit = "percentage",
                    Category = "Maintainability",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                },
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Code Coverage",
                    Value = Math.Round(random.NextDouble() * 40 + 40, 2),
                    Unit = "percentage",
                    Category = "Quality",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                },
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Duplicated Lines",
                    Value = Math.Round(random.NextDouble() * 15, 2),
                    Unit = "percentage",
                    Category = "Maintainability",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                },
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Security Hotspots",
                    Value = random.Next(0, 25),
                    Unit = "count",
                    Category = "Security",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                },
                new CodeMetric
                {
                    ApplicationId = app.Id,
                    MetricName = "Maintainability Index",
                    Value = Math.Round(random.NextDouble() * 40 + 50, 2),
                    Unit = "index",
                    Category = "Maintainability",
                    MeasuredDate = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                }
            });
        }

        _context.CodeMetrics.AddRange(codeMetrics);
    }

    private async Task SeedDashboardMetrics(List<Assessment> assessments)
    {
        var dashboardMetrics = new[]
        {
            // Global metrics
            new DashboardMetric
            {
                MetricName = "Total Applications",
                Value = 15,
                Unit = "count",
                Category = "Portfolio",
                RecordedDate = DateTime.UtcNow.AddDays(-1)
            },
            new DashboardMetric
            {
                MetricName = "Average Security Score",
                Value = 68.5,
                Unit = "score",
                Category = "Security",
                RecordedDate = DateTime.UtcNow.AddDays(-1)
            },
            new DashboardMetric
            {
                MetricName = "Critical Security Issues",
                Value = 23,
                Unit = "count",
                Category = "Security",
                RecordedDate = DateTime.UtcNow.AddHours(-6)
            },
            new DashboardMetric
            {
                MetricName = "Total Migration Cost",
                Value = 2450000,
                Unit = "USD",
                Category = "Cost",
                RecordedDate = DateTime.UtcNow.AddDays(-2)
            },
            new DashboardMetric
            {
                MetricName = "Potential Annual Savings",
                Value = 1850000,
                Unit = "USD",
                Category = "Cost",
                RecordedDate = DateTime.UtcNow.AddDays(-2)
            },
            new DashboardMetric
            {
                MetricName = "Cloud Ready Applications",
                Value = 65,
                Unit = "percentage",
                Category = "Cloud Readiness",
                RecordedDate = DateTime.UtcNow.AddHours(-12)
            },
            new DashboardMetric
            {
                MetricName = "Assessment Progress",
                Value = 75,
                Unit = "percentage",
                Category = "Progress",
                RecordedDate = DateTime.UtcNow.AddHours(-3)
            },
            // Assessment-specific metrics
            new DashboardMetric
            {
                MetricName = "Security Compliance Score",
                Value = 72,
                Unit = "score",
                Category = "Security",
                AssessmentId = assessments[1].Id,
                RecordedDate = DateTime.UtcNow.AddDays(-1)
            },
            new DashboardMetric
            {
                MetricName = "Migration Readiness Score",
                Value = 78,
                Unit = "score",
                Category = "Cloud Readiness",
                AssessmentId = assessments[2].Id,
                RecordedDate = DateTime.UtcNow.AddDays(-3)
            }
        };

        _context.DashboardMetrics.AddRange(dashboardMetrics);
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
                Notes = "Primary sponsor for digital transformation initiative. Strong advocate for cloud migration. Focused on ROI and technical feasibility.",
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
                Notes = "Driving customer experience improvements. Passionate about digital innovation and modern technologies. Key decision maker for customer-facing applications.",
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
                Notes = "Primary concern is security compliance and risk management. Must approve all security-related recommendations. Focus on zero-trust architecture.",
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
                Notes = "Responsible for operational efficiency and cost management. Interested in automation and process improvements. Budget approval authority.",
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
                Notes = "Technical implementation lead. Expert in .NET and cloud technologies. Concerned about development velocity and technical debt.",
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
                Notes = "Technical security expert. Responsible for security architecture decisions. Focus on DevSecOps integration and secure coding practices.",
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
                Notes = "Manages current on-premises infrastructure. Cautious about cloud migration. Needs convincing on reliability and performance benefits.",
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
                Notes = "Requirements gathering and documentation specialist. Bridge between business and technical teams. Focus on user experience and business value.",
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Thomas Chen",
                Role = "CFO",
                Department = "Finance",
                Email = "thomas.chen@company.com",
                InfluenceLevel = "High",
                InterestLevel = "Medium",
                Notes = "Final approval authority for major technology investments. Primarily concerned with cost-benefit analysis and financial risk management.",
                AssessmentId = assessments[0].Id
            },
            new Stakeholder
            {
                Name = "Amanda Rodriguez",
                Role = "Chief Data Officer",
                Department = "Data & Analytics",
                Email = "amanda.rodriguez@company.com",
                InfluenceLevel = "High",
                InterestLevel = "High",
                Notes = "Leading data modernization efforts. Strong advocate for cloud-native data platforms and AI/ML capabilities. Key stakeholder for analytics transformation.",
                AssessmentId = assessments[4].Id
            },
            new Stakeholder
            {
                Name = "Kevin Park",
                Role = "DevOps Manager",
                Department = "Development",
                Email = "kevin.park@company.com",
                InfluenceLevel = "Medium",
                InterestLevel = "High",
                Notes = "Responsible for CI/CD pipelines and deployment automation. Expert in containerization and orchestration. Focus on deployment reliability and efficiency.",
                AssessmentId = assessments[3].Id
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
                Description = "Deploy comprehensive zero trust architecture to enhance security posture across all applications and infrastructure components",
                Category = "Security",
                Priority = "Critical",
                Effort = "Large",
                EstimatedCost = 250000m,
                PotentialSavings = 500000m,
                TimeframeWeeks = 16,
                Implementation = "Phase 1: Identity and access management upgrade, Phase 2: Network segmentation, Phase 3: Device compliance and monitoring",
                Benefits = "Reduced security incidents by 70%, improved compliance posture, enhanced threat detection and response capabilities",
                Risks = "Initial complexity in implementation, potential user experience impacts during transition, requires significant training",
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