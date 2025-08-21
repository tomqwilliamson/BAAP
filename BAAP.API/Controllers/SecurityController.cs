using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SecurityController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<SecurityController> _logger;

    public SecurityController(BaapDbContext context, ILogger<SecurityController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/security/assessment/{assessmentId}/overview
    [HttpGet("assessment/{assessmentId}/overview")]
    public async Task<ActionResult> GetSecurityOverview(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            var allFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).ToList();

            var overview = new
            {
                summary = new
                {
                    totalFindings = allFindings.Count,
                    critical = allFindings.Count(f => f.Severity == "Critical"),
                    high = allFindings.Count(f => f.Severity == "High"),
                    medium = allFindings.Count(f => f.Severity == "Medium"),
                    low = allFindings.Count(f => f.Severity == "Low"),
                    resolved = allFindings.Count(f => f.IsResolved),
                    overallScore = assessment.SecurityScore
                },
                byCategory = allFindings
                    .GroupBy(f => f.Category)
                    .Select(g => new
                    {
                        category = g.Key,
                        count = g.Count(),
                        critical = g.Count(f => f.Severity == "Critical"),
                        high = g.Count(f => f.Severity == "High"),
                        resolved = g.Count(f => f.IsResolved)
                    })
                    .OrderByDescending(x => x.count),
                byApplication = assessment.Applications.Select(app => new
                {
                    applicationId = app.Id,
                    applicationName = app.Name,
                    securityRating = app.SecurityRating,
                    findings = new
                    {
                        total = app.SecurityFindings.Count,
                        critical = app.SecurityFindings.Count(f => f.Severity == "Critical"),
                        high = app.SecurityFindings.Count(f => f.Severity == "High"),
                        medium = app.SecurityFindings.Count(f => f.Severity == "Medium"),
                        low = app.SecurityFindings.Count(f => f.Severity == "Low")
                    }
                }).OrderByDescending(x => x.findings.critical),
                recentFindings = allFindings
                    .OrderByDescending(f => f.CreatedDate)
                    .Take(10)
                    .Select(f => new
                    {
                        id = f.Id,
                        title = f.Title,
                        severity = f.Severity,
                        category = f.Category,
                        applicationName = assessment.Applications.First(a => a.Id == f.ApplicationId).Name,
                        createdDate = f.CreatedDate,
                        isResolved = f.IsResolved
                    })
            };

            return Ok(overview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving security overview for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while retrieving security overview");
        }
    }

    // GET: api/security/findings/{findingId}
    [HttpGet("findings/{findingId}")]
    public async Task<ActionResult> GetSecurityFinding(int findingId)
    {
        try
        {
            var finding = await _context.SecurityFindings
                .Include(f => f.Application)
                .FirstOrDefaultAsync(f => f.Id == findingId);

            if (finding == null)
            {
                return NotFound($"Security finding with ID {findingId} not found");
            }

            var result = new
            {
                id = finding.Id,
                title = finding.Title,
                description = finding.Description,
                severity = finding.Severity,
                category = finding.Category,
                fileName = finding.FileName,
                lineNumber = finding.LineNumber,
                source = finding.Source,
                isResolved = finding.IsResolved,
                createdDate = finding.CreatedDate,
                resolvedDate = finding.ResolvedDate,
                application = new
                {
                    id = finding.Application.Id,
                    name = finding.Application.Name,
                    type = finding.Application.Type
                },
                remediation = GenerateRemediationAdvice(finding)
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving security finding with ID {FindingId}", findingId);
            return StatusCode(500, "An error occurred while retrieving security finding");
        }
    }

    // POST: api/security/findings/{findingId}/resolve
    [HttpPost("findings/{findingId}/resolve")]
    public async Task<ActionResult> ResolveSecurityFinding(int findingId, [FromBody] ResolveSecurityFindingRequest request)
    {
        try
        {
            var finding = await _context.SecurityFindings.FindAsync(findingId);
            
            if (finding == null)
            {
                return NotFound($"Security finding with ID {findingId} not found");
            }

            finding.IsResolved = true;
            finding.ResolvedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = finding.Id,
                title = finding.Title,
                isResolved = finding.IsResolved,
                resolvedDate = finding.ResolvedDate,
                message = "Security finding marked as resolved"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resolving security finding with ID {FindingId}", findingId);
            return StatusCode(500, "An error occurred while resolving security finding");
        }
    }

    // GET: api/security/assessment/{assessmentId}/cross-assessment
    [HttpGet("assessment/{assessmentId}/cross-assessment")]
    public async Task<ActionResult> GetCrossAssessmentAnalysis(int assessmentId)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Generate cross-assessment analysis (simulating integration with external tools)
            var analysis = new
            {
                infrastructureRisks = GenerateInfrastructureRisks(),
                networkAssessment = GenerateNetworkAssessment(),
                complianceStatus = GenerateComplianceStatus(),
                crossAppVulnerabilities = GenerateCrossAppVulnerabilities(assessment),
                securityRecommendations = GenerateSecurityRecommendations(assessment)
            };

            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating cross-assessment analysis for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while generating cross-assessment analysis");
        }
    }

    // POST: api/security/assessment/{assessmentId}/scan
    [HttpPost("assessment/{assessmentId}/scan")]
    public async Task<ActionResult> InitiateSecurityScan(int assessmentId, [FromBody] SecurityScanRequest request)
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                .FirstOrDefaultAsync(a => a.Id == assessmentId);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {assessmentId} not found");
            }

            // Simulate security scan initiation
            var scanResult = await SimulateSecurityScan(assessment, request.ScanTypes);

            return Ok(new
            {
                scanId = Guid.NewGuid().ToString(),
                status = "initiated",
                message = "Security scan started successfully",
                estimatedDuration = "15-30 minutes",
                scanTypes = request.ScanTypes,
                applicationsScanned = assessment.Applications.Count,
                scanResult
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initiating security scan for assessment ID {AssessmentId}", assessmentId);
            return StatusCode(500, "An error occurred while initiating security scan");
        }
    }

    private object GenerateRemediationAdvice(SecurityFinding finding)
    {
        return finding.Category.ToLower() switch
        {
            "injection" => new
            {
                priority = "Critical",
                steps = new[]
                {
                    "Implement parameterized queries or prepared statements",
                    "Validate and sanitize all user inputs",
                    "Use stored procedures where appropriate",
                    "Implement least privilege database access"
                },
                resources = new[]
                {
                    "OWASP SQL Injection Prevention Cheat Sheet",
                    "Microsoft SQL Security Best Practices"
                }
            },
            "xss" => new
            {
                priority = "High",
                steps = new[]
                {
                    "Encode all user-controlled data in HTML output",
                    "Implement Content Security Policy (CSP)",
                    "Validate input on server-side",
                    "Use framework-provided XSS protection"
                },
                resources = new[]
                {
                    "OWASP XSS Prevention Cheat Sheet",
                    "MDN Content Security Policy Documentation"
                }
            },
            _ => new
            {
                priority = "Medium",
                steps = new[]
                {
                    "Review security finding details",
                    "Consult security documentation",
                    "Implement appropriate controls",
                    "Verify fix with security testing"
                },
                resources = new[]
                {
                    "OWASP Top 10 Guidelines",
                    "Security vendor documentation"
                }
            }
        };
    }

    private object[] GenerateInfrastructureRisks()
    {
        return new[]
        {
            new { source = "Azure Migrate", risk = "Unencrypted data migration", severity = "High", count = 3 },
            new { source = "Network Assessment", risk = "Open firewall ports", severity = "Critical", count = 2 },
            new { source = "Server Analysis", risk = "Unpatched vulnerabilities", severity = "High", count = 8 }
        };
    }

    private object[] GenerateNetworkAssessment()
    {
        return new[]
        {
            new { check = "Firewall Configuration", status = "Pass", details = "Properly configured firewall rules" },
            new { check = "Network Segmentation", status = "Warning", details = "Some segments lack proper isolation" },
            new { check = "VPN Security", status = "Fail", details = "Weak encryption protocols detected" }
        };
    }

    private object GenerateComplianceStatus()
    {
        return new
        {
            frameworks = new[]
            {
                new { name = "SOC 2", status = "Compliant", score = 92 },
                new { name = "ISO 27001", status = "Partial", score = 78 },
                new { name = "GDPR", status = "Compliant", score = 95 }
            },
            overallScore = 88
        };
    }

    private object[] GenerateCrossAppVulnerabilities(Assessment assessment)
    {
        return new[]
        {
            new { pattern = "Shared Authentication Weakness", affectedApps = 2, severity = "High" },
            new { pattern = "Common Library Vulnerabilities", affectedApps = 3, severity = "Medium" },
            new { pattern = "Configuration Drift", affectedApps = 1, severity = "Low" }
        };
    }

    private object[] GenerateSecurityRecommendations(Assessment assessment)
    {
        return new[]
        {
            new { title = "Implement Zero Trust Architecture", priority = "Critical", effort = "Large" },
            new { title = "Enhance Security Monitoring", priority = "High", effort = "Medium" },
            new { title = "Update Security Training", priority = "Medium", effort = "Small" }
        };
    }

    private async Task<object> SimulateSecurityScan(Assessment assessment, string[] scanTypes)
    {
        // Simulate scan processing time
        await Task.Delay(2000);

        var random = new Random();
        return new
        {
            newFindings = random.Next(5, 15),
            resolvedFindings = random.Next(2, 8),
            scanTypes = scanTypes,
            summary = new
            {
                critical = random.Next(0, 3),
                high = random.Next(2, 8),
                medium = random.Next(5, 12),
                low = random.Next(8, 20)
            }
        };
    }
}

public class ResolveSecurityFindingRequest
{
    public string? Resolution { get; set; }
    public string? Notes { get; set; }
}

public class SecurityScanRequest
{
    public string[] ScanTypes { get; set; } = Array.Empty<string>();
}