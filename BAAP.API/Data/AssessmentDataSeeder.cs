using BAAP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BAAP.API.Data;

public static class AssessmentDataSeeder
{
    public static async Task SeedDetailedAssessmentDataAsync(BaapDbContext context)
    {
        // Check if we already have seeded data
        if (await context.InfrastructureServers.AnyAsync() || 
            await context.DatabaseInstances.AnyAsync() || 
            await context.SecurityVulnerabilities.AnyAsync() ||
            await context.ComplianceFrameworks.AnyAsync())
        {
            return; // Data already seeded
        }

        var assessments = await context.Assessments.ToListAsync();
        
        foreach (var assessment in assessments)
        {
            await SeedAssessmentSpecificData(context, assessment);
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedAssessmentSpecificData(BaapDbContext context, Assessment assessment)
    {
        // Infrastructure Servers
        var infrastructureServers = GenerateInfrastructureServers(assessment.Id);
        context.InfrastructureServers.AddRange(infrastructureServers);

        // Database Instances  
        var databaseInstances = GenerateDatabaseInstances(assessment.Id);
        context.DatabaseInstances.AddRange(databaseInstances);

        // Security Vulnerabilities
        var securityVulnerabilities = GenerateSecurityVulnerabilities(assessment.Id);
        context.SecurityVulnerabilities.AddRange(securityVulnerabilities);

        // Compliance Frameworks
        var complianceFrameworks = GenerateComplianceFrameworks(assessment.Id);
        context.ComplianceFrameworks.AddRange(complianceFrameworks);
    }

    private static List<InfrastructureServer> GenerateInfrastructureServers(int assessmentId)
    {
        return new List<InfrastructureServer>
        {
            new InfrastructureServer 
            { 
                AssessmentId = assessmentId, 
                Name = "Web Server Cluster", 
                Type = "IIS", 
                ServerCount = 4, 
                UtilizationPercent = 78, 
                CloudReadiness = "High",
                CurrentHosting = "On-Premises",
                RecommendedAzureTarget = "Azure App Service",
                MigrationEffort = "Medium",
                EstimatedMonthlyCost = "$2,500"
            },
            new InfrastructureServer 
            { 
                AssessmentId = assessmentId, 
                Name = "Database Servers", 
                Type = "SQL Server", 
                ServerCount = 2, 
                UtilizationPercent = 65, 
                CloudReadiness = "Medium",
                CurrentHosting = "VMware vSphere",
                RecommendedAzureTarget = "Azure SQL Database",
                MigrationEffort = "Low",
                EstimatedMonthlyCost = "$1,800"
            },
            new InfrastructureServer 
            { 
                AssessmentId = assessmentId, 
                Name = "Load Balancers", 
                Type = "F5", 
                ServerCount = 2, 
                UtilizationPercent = 45, 
                CloudReadiness = "High",
                CurrentHosting = "Physical Hardware",
                RecommendedAzureTarget = "Azure Load Balancer",
                MigrationEffort = "Low",
                EstimatedMonthlyCost = "$400"
            }
        };
    }

    private static List<DatabaseInstance> GenerateDatabaseInstances(int assessmentId)
    {
        return new List<DatabaseInstance>
        {
            new DatabaseInstance
            {
                AssessmentId = assessmentId,
                Name = "CustomerDB-Prod",
                Type = "SQL Server",
                Version = "2019",
                Size = "485 GB",
                ReadinessPercent = 94,
                IssueCount = 2,
                AzureTargetService = "Azure SQL Database",
                SchemaCount = 4,
                TableCount = 247,
                Details = "Primary OLTP database with customer data, order management, and inventory tracking",
                CompatibilityStatus = "Ready"
            },
            new DatabaseInstance
            {
                AssessmentId = assessmentId,
                Name = "DataWarehouse-Main",
                Type = "SQL Server",
                Version = "2017",
                Size = "2.8 TB",
                ReadinessPercent = 78,
                IssueCount = 12,
                AzureTargetService = "Azure Synapse Analytics",
                SchemaCount = 6,
                TableCount = 156,
                Details = "Enterprise data warehouse with historical data, complex ETL processes",
                CompatibilityStatus = "Warning"
            },
            new DatabaseInstance
            {
                AssessmentId = assessmentId,
                Name = "LegacyFinance-DB",
                Type = "SQL Server",
                Version = "2012",
                Size = "920 GB",
                ReadinessPercent = 58,
                IssueCount = 24,
                AzureTargetService = "Azure SQL Managed Instance",
                SchemaCount = 8,
                TableCount = 89,
                Details = "Legacy financial system with custom stored procedures and CLR assemblies",
                CompatibilityStatus = "Needs Work"
            }
        };
    }

    private static List<SecurityVulnerability> GenerateSecurityVulnerabilities(int assessmentId)
    {
        return new List<SecurityVulnerability>
        {
            new SecurityVulnerability
            {
                AssessmentId = assessmentId,
                Title = "Unencrypted network traffic",
                Description = "Network communications between servers are not encrypted",
                Severity = "High",
                Category = "Infrastructure",
                Source = "Azure Migrate Assessment",
                InstanceCount = 3,
                Status = "Open",
                Scanner = "Azure Security Center"
            },
            new SecurityVulnerability
            {
                AssessmentId = assessmentId,
                Title = "SQL injection vulnerabilities",
                Description = "Multiple SQL injection points detected in database queries",
                Severity = "Critical",
                Category = "Database",
                Source = "Database Security Scan",
                InstanceCount = 2,
                Status = "Open",
                CweId = "CWE-89",
                Scanner = "Database Assessment Tool"
            },
            new SecurityVulnerability
            {
                AssessmentId = assessmentId,
                Title = "Secrets in source code",
                Description = "Hard-coded credentials found in application code",
                Severity = "Critical",
                Category = "DevOps",
                Source = "DevOps Assessment",
                InstanceCount = 1,
                Status = "In Progress",
                Scanner = "Static Code Analysis"
            },
            new SecurityVulnerability
            {
                AssessmentId = assessmentId,
                Title = "Unpatched vulnerabilities",
                Description = "Multiple servers have missing security patches",
                Severity = "Critical",
                Category = "Infrastructure",
                Source = "Server Analysis",
                InstanceCount = 5,
                Status = "Open",
                Scanner = "Vulnerability Scanner"
            }
        };
    }

    private static List<ComplianceFramework> GenerateComplianceFrameworks(int assessmentId)
    {
        return new List<ComplianceFramework>
        {
            new ComplianceFramework
            {
                AssessmentId = assessmentId,
                Name = "GDPR",
                Status = "Compliant",
                CoveragePercent = 92,
                AssessmentType = "Data",
                Notes = "Strong data protection measures in place",
                LastAssessedDate = DateTime.UtcNow.AddDays(-30)
            },
            new ComplianceFramework
            {
                AssessmentId = assessmentId,
                Name = "HIPAA",
                Status = "Partial",
                CoveragePercent = 78,
                AssessmentType = "Security",
                Notes = "Healthcare data protection needs improvement",
                LastAssessedDate = DateTime.UtcNow.AddDays(-45)
            },
            new ComplianceFramework
            {
                AssessmentId = assessmentId,
                Name = "SOX",
                Status = "Compliant",
                CoveragePercent = 95,
                AssessmentType = "Data",
                Notes = "Financial reporting controls are adequate",
                LastAssessedDate = DateTime.UtcNow.AddDays(-15)
            },
            new ComplianceFramework
            {
                AssessmentId = assessmentId,
                Name = "PCI DSS",
                Status = "In Progress",
                CoveragePercent = 67,
                AssessmentType = "Security",
                Notes = "Payment card data protection being implemented",
                LastAssessedDate = DateTime.UtcNow.AddDays(-10)
            }
        };
    }
}