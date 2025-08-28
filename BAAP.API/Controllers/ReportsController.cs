using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BAAP.API.Data;
using BAAP.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class ReportsController : ControllerBase
{
    private readonly BaapDbContext _context;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(BaapDbContext context, ILogger<ReportsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/reports/assessment/{id}
    [HttpGet("assessment/{id}")]
    public async Task<ActionResult> GetAssessmentReport(int id, [FromQuery] string format = "json")
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            var report = GenerateAssessmentReport(assessment);

            return format.ToLower() switch
            {
                "pdf" => GeneratePdfReport(report),
                "excel" => GenerateExcelReport(report),
                _ => Ok(report)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating assessment report for ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while generating the assessment report");
        }
    }

    // GET: api/reports/portfolio
    [HttpGet("portfolio")]
    public async Task<ActionResult> GetPortfolioReport([FromQuery] int? assessmentId = null, [FromQuery] string format = "json")
    {
        try
        {
            var query = _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.Recommendations)
                .AsQueryable();

            if (assessmentId.HasValue)
            {
                query = query.Where(a => a.Id == assessmentId.Value);
            }

            var assessments = await query.ToListAsync();

            if (!assessments.Any())
            {
                return NotFound("No assessments found for portfolio report");
            }

            var report = GeneratePortfolioReport(assessments);

            return format.ToLower() switch
            {
                "pdf" => GeneratePdfReport(report),
                "excel" => GenerateExcelReport(report),
                _ => Ok(report)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating portfolio report");
            return StatusCode(500, "An error occurred while generating the portfolio report");
        }
    }

    // POST: api/reports/custom
    [HttpPost("custom")]
    public async Task<ActionResult> GenerateCustomReport([FromBody] CustomReportRequest request)
    {
        try
        {
            var query = _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .AsQueryable();

            // Apply filters
            if (request.AssessmentIds?.Any() == true)
            {
                query = query.Where(a => request.AssessmentIds.Contains(a.Id));
            }

            if (request.DateFrom.HasValue)
            {
                query = query.Where(a => a.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                query = query.Where(a => a.CreatedDate <= request.DateTo.Value);
            }

            if (!string.IsNullOrEmpty(request.Status))
            {
                query = query.Where(a => a.Status == request.Status);
            }

            var assessments = await query.ToListAsync();

            if (!assessments.Any())
            {
                return NotFound("No assessments found matching the specified criteria");
            }

            var report = GenerateCustomReport(assessments, request);

            return request.Format?.ToLower() switch
            {
                "pdf" => GeneratePdfReport(report),
                "excel" => GenerateExcelReport(report),
                _ => Ok(report)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating custom report");
            return StatusCode(500, "An error occurred while generating the custom report");
        }
    }

    // GET: api/reports/templates
    [HttpGet("templates")]
    public ActionResult GetReportTemplates()
    {
        try
        {
            var templates = new[]
            {
                new
                {
                    id = "executive-summary",
                    name = "Executive Summary",
                    description = "High-level overview for executives",
                    sections = new[] { "overview", "key-metrics", "recommendations", "costs" }
                },
                new
                {
                    id = "technical-detailed",
                    name = "Technical Detailed Report",
                    description = "Comprehensive technical analysis",
                    sections = new[] { "applications", "security", "architecture", "code-quality", "recommendations" }
                },
                new
                {
                    id = "security-focused",
                    name = "Security Assessment",
                    description = "Security-focused analysis",
                    sections = new[] { "security-overview", "vulnerabilities", "compliance", "security-recommendations" }
                },
                new
                {
                    id = "migration-roadmap",
                    name = "Migration Roadmap",
                    description = "Cloud migration planning",
                    sections = new[] { "readiness-assessment", "migration-strategy", "timeline", "costs", "risks" }
                }
            };

            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving report templates");
            return StatusCode(500, "An error occurred while retrieving report templates");
        }
    }

    // GET: api/reports/assessment/{id}/export
    [HttpGet("assessment/{id}/export")]
    public async Task<ActionResult> ExportAssessmentReport(int id, [FromQuery] string format = "pdf", [FromQuery] string template = "executive-summary")
    {
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.Applications)
                    .ThenInclude(app => app.SecurityFindings)
                .Include(a => a.Applications)
                    .ThenInclude(app => app.CodeMetrics)
                .Include(a => a.Stakeholders)
                .Include(a => a.BusinessDrivers)
                .Include(a => a.Recommendations)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound($"Assessment with ID {id} not found");
            }

            var reportData = GenerateAssessmentReport(assessment);
            var templateData = ApplyReportTemplate(reportData, template);

            return format.ToLower() switch
            {
                "pdf" => GeneratePdfExport(templateData, $"Assessment-{assessment.Name}-{DateTime.Now:yyyyMMdd}"),
                "excel" => GenerateExcelExport(templateData, $"Assessment-{assessment.Name}-{DateTime.Now:yyyyMMdd}"),
                "word" => GenerateWordExport(templateData, $"Assessment-{assessment.Name}-{DateTime.Now:yyyyMMdd}"),
                _ => BadRequest("Unsupported export format. Use pdf, excel, or word.")
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting assessment report for ID {AssessmentId}", id);
            return StatusCode(500, "An error occurred while exporting the assessment report");
        }
    }

    private object GenerateAssessmentReport(Assessment assessment)
    {
        var totalApplications = assessment.Applications.Count;
        var analyzedApplications = assessment.Applications.Count(a => a.LastAnalyzedDate != null);
        var totalSecurityFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count();
        var criticalFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(sf => sf.Severity == "Critical");
        var highFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(sf => sf.Severity == "High");
        var totalRecommendations = assessment.Recommendations.Count;
        var acceptedRecommendations = assessment.Recommendations.Count(r => r.IsAccepted);

        return new
        {
            metadata = new
            {
                assessmentId = assessment.Id,
                assessmentName = assessment.Name,
                generatedDate = DateTime.UtcNow,
                status = assessment.Status,
                createdDate = assessment.CreatedDate,
                completedDate = assessment.CompletedDate
            },
            executiveSummary = new
            {
                overallScore = assessment.OverallScore,
                totalApplications,
                analyzedApplications,
                analysisProgress = totalApplications > 0 ? (analyzedApplications * 100) / totalApplications : 0,
                criticalSecurityIssues = criticalFindings,
                totalRecommendations,
                acceptedRecommendations,
                estimatedSavings = assessment.PotentialSavings
            },
            applications = assessment.Applications.Select(app => new
            {
                id = app.Id,
                name = app.Name,
                type = app.Type,
                technology = app.Technology,
                linesOfCode = app.LinesOfCode,
                complexityScore = app.ComplexityScore,
                securityRating = app.SecurityRating,
                cloudReadinessScore = app.CloudReadinessScore,
                estimatedMigrationCost = app.EstimatedMigrationCost,
                securityFindings = app.SecurityFindings.Count,
                criticalFindings = app.SecurityFindings.Count(sf => sf.Severity == "Critical"),
                lastAnalyzed = app.LastAnalyzedDate
            }),
            security = new
            {
                overview = new
                {
                    totalFindings = totalSecurityFindings,
                    critical = criticalFindings,
                    high = highFindings,
                    medium = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(sf => sf.Severity == "Medium"),
                    low = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(sf => sf.Severity == "Low")
                },
                findings = assessment.Applications
                    .SelectMany(a => a.SecurityFindings)
                    .OrderByDescending(sf => sf.Severity == "Critical" ? 4 : sf.Severity == "High" ? 3 : sf.Severity == "Medium" ? 2 : 1)
                    .Select(sf => new
                    {
                        title = sf.Title,
                        severity = sf.Severity,
                        category = sf.Category,
                        applicationName = assessment.Applications.First(a => a.Id == sf.ApplicationId).Name,
                        isResolved = sf.IsResolved
                    })
            },
            stakeholders = assessment.Stakeholders.Select(s => new
            {
                name = s.Name,
                role = s.Role,
                department = s.Department,
                influenceLevel = s.InfluenceLevel,
                interestLevel = s.InterestLevel
            }),
            businessDrivers = assessment.BusinessDrivers.Select(bd => new
            {
                name = bd.Name,
                priority = bd.Priority,
                impact = bd.Impact,
                urgency = bd.Urgency,
                businessValue = bd.BusinessValue,
                description = bd.Description
            }),
            recommendations = assessment.Recommendations
                .OrderByDescending(r => r.Priority == "Critical" ? 4 : r.Priority == "High" ? 3 : r.Priority == "Medium" ? 2 : 1)
                .Select(r => new
                {
                    title = r.Title,
                    category = r.Category,
                    priority = r.Priority,
                    effort = r.Effort,
                    estimatedCost = r.EstimatedCost,
                    potentialSavings = r.PotentialSavings,
                    timeframeWeeks = r.TimeframeWeeks,
                    isAccepted = r.IsAccepted,
                    description = r.Description
                })
        };
    }

    private object GeneratePortfolioReport(List<Assessment> assessments)
    {
        var totalApplications = assessments.SelectMany(a => a.Applications).Count();
        var totalFindings = assessments.SelectMany(a => a.Applications).SelectMany(app => app.SecurityFindings).Count();
        var totalRecommendations = assessments.SelectMany(a => a.Recommendations).Count();

        return new
        {
            metadata = new
            {
                generatedDate = DateTime.UtcNow,
                assessmentCount = assessments.Count,
                totalApplications,
                reportType = "Portfolio Overview"
            },
            summary = new
            {
                totalAssessments = assessments.Count,
                completedAssessments = assessments.Count(a => a.Status == "Completed"),
                inProgressAssessments = assessments.Count(a => a.Status == "In Progress"),
                totalApplications,
                averageOverallScore = assessments.Any() ? assessments.Average(a => a.OverallScore) : 0,
                totalSecurityFindings = totalFindings,
                totalRecommendations,
                estimatedTotalSavings = assessments.Sum(a => a.PotentialSavings ?? 0)
            },
            assessments = assessments.Select(assessment => new
            {
                id = assessment.Id,
                name = assessment.Name,
                status = assessment.Status,
                overallScore = assessment.OverallScore,
                createdDate = assessment.CreatedDate,
                completedDate = assessment.CompletedDate,
                applicationCount = assessment.Applications.Count,
                securityFindings = assessment.Applications.SelectMany(a => a.SecurityFindings).Count(),
                recommendations = assessment.Recommendations.Count,
                potentialSavings = assessment.PotentialSavings
            }),
            trends = new
            {
                scoresByMonth = GenerateScoreTrends(assessments),
                applicationsByType = assessments
                    .SelectMany(a => a.Applications)
                    .GroupBy(app => app.Type)
                    .ToDictionary(g => g.Key, g => g.Count()),
                securityByCategory = assessments
                    .SelectMany(a => a.Applications)
                    .SelectMany(app => app.SecurityFindings)
                    .GroupBy(sf => sf.Category)
                    .ToDictionary(g => g.Key, g => g.Count())
            }
        };
    }

    private object GenerateCustomReport(List<Assessment> assessments, CustomReportRequest request)
    {
        var baseReport = GeneratePortfolioReport(assessments);
        
        // Apply custom filters and sections based on request
        var customSections = new Dictionary<string, object>();

        if (request.IncludeSections?.Contains("executive-summary") == true)
        {
            customSections["executiveSummary"] = ((dynamic)baseReport).summary;
        }

        if (request.IncludeSections?.Contains("security") == true)
        {
            customSections["security"] = GenerateSecuritySection(assessments);
        }

        if (request.IncludeSections?.Contains("applications") == true)
        {
            customSections["applications"] = GenerateApplicationsSection(assessments);
        }

        return new
        {
            metadata = new
            {
                generatedDate = DateTime.UtcNow,
                reportType = "Custom Report",
                filters = request,
                assessmentCount = assessments.Count
            },
            sections = customSections
        };
    }

    private object GenerateSecuritySection(List<Assessment> assessments)
    {
        var allFindings = assessments.SelectMany(a => a.Applications).SelectMany(app => app.SecurityFindings).ToList();

        return new
        {
            overview = new
            {
                totalFindings = allFindings.Count,
                critical = allFindings.Count(f => f.Severity == "Critical"),
                high = allFindings.Count(f => f.Severity == "High"),
                medium = allFindings.Count(f => f.Severity == "Medium"),
                low = allFindings.Count(f => f.Severity == "Low"),
                resolved = allFindings.Count(f => f.IsResolved)
            },
            byCategory = allFindings.GroupBy(f => f.Category).ToDictionary(g => g.Key, g => g.Count()),
            topVulnerabilities = allFindings
                .GroupBy(f => f.Title)
                .OrderByDescending(g => g.Count())
                .Take(10)
                .Select(g => new { vulnerability = g.Key, count = g.Count() })
        };
    }

    private object GenerateApplicationsSection(List<Assessment> assessments)
    {
        var allApplications = assessments.SelectMany(a => a.Applications).ToList();

        return new
        {
            overview = new
            {
                total = allApplications.Count,
                byType = allApplications.GroupBy(app => app.Type).ToDictionary(g => g.Key, g => g.Count()),
                byTechnology = allApplications.GroupBy(app => app.Technology).ToDictionary(g => g.Key, g => g.Count()),
                averageComplexity = allApplications.Any() ? allApplications.Average(app => app.ComplexityScore) : 0,
                averageCloudReadiness = allApplications.Any() ? allApplications.Average(app => app.CloudReadinessScore) : 0
            },
            applications = allApplications.Select(app => new
            {
                name = app.Name,
                type = app.Type,
                technology = app.Technology,
                complexityScore = app.ComplexityScore,
                securityRating = app.SecurityRating,
                cloudReadinessScore = app.CloudReadinessScore,
                estimatedMigrationCost = app.EstimatedMigrationCost
            })
        };
    }

    private object[] GenerateScoreTrends(List<Assessment> assessments)
    {
        // Simulate trends - in a real app, this would use historical data
        var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" };
        var random = new Random();
        
        return months.Select(month => new
        {
            month,
            averageScore = random.Next(70, 95),
            assessmentCount = random.Next(1, 5)
        }).ToArray();
    }

    private object ApplyReportTemplate(object reportData, string template)
    {
        // Apply template-specific formatting
        return template.ToLower() switch
        {
            "executive-summary" => ExtractExecutiveSummary(reportData),
            "technical-detailed" => reportData, // Return full report
            "security-focused" => ExtractSecurityFocus(reportData),
            "migration-roadmap" => ExtractMigrationRoadmap(reportData),
            _ => reportData
        };
    }

    private object ExtractExecutiveSummary(object reportData)
    {
        // Extract only executive-level information
        dynamic data = reportData;
        return new
        {
            data.metadata,
            data.executiveSummary,
            topRecommendations = ((IEnumerable<dynamic>)data.recommendations).Take(5),
            keyMetrics = new
            {
                applications = ((IEnumerable<dynamic>)data.applications).Count(),
                criticalIssues = data.security.overview.critical,
                savings = data.executiveSummary.estimatedSavings
            }
        };
    }

    private object ExtractSecurityFocus(object reportData)
    {
        dynamic data = reportData;
        return new
        {
            data.metadata,
            data.security,
            securityRecommendations = ((IEnumerable<dynamic>)data.recommendations)
                .Where(r => r.category == "Security"),
            applications = ((IEnumerable<dynamic>)data.applications)
                .Select(app => new
                {
                    app.name,
                    app.securityRating,
                    app.securityFindings,
                    app.criticalFindings
                })
        };
    }

    private object ExtractMigrationRoadmap(object reportData)
    {
        dynamic data = reportData;
        return new
        {
            data.metadata,
            data.executiveSummary,
            migrationReadiness = ((IEnumerable<dynamic>)data.applications)
                .Select(app => new
                {
                    app.name,
                    app.cloudReadinessScore,
                    app.estimatedMigrationCost,
                    readinessLevel = app.cloudReadinessScore >= 80 ? "Ready" :
                                   app.cloudReadinessScore >= 60 ? "Moderate" : "Needs Work"
                }),
            migrationRecommendations = ((IEnumerable<dynamic>)data.recommendations)
                .Where(r => r.category == "Modernization" || r.category == "Migration")
        };
    }

    private ActionResult GeneratePdfReport(object reportData)
    {
        // Simulate PDF generation - in a real app, use a library like iText7 or DinkToPdf
        var jsonContent = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
        var pdfContent = $"PDF Report Generated at {DateTime.UtcNow}\n\n{jsonContent}";
        var bytes = System.Text.Encoding.UTF8.GetBytes(pdfContent);
        
        return File(bytes, "application/pdf", "assessment-report.pdf");
    }

    private ActionResult GenerateExcelReport(object reportData)
    {
        // Simulate Excel generation - in a real app, use EPPlus or ClosedXML
        var jsonContent = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
        var excelContent = $"Excel Report Generated at {DateTime.UtcNow}\n\n{jsonContent}";
        var bytes = System.Text.Encoding.UTF8.GetBytes(excelContent);
        
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "assessment-report.xlsx");
    }

    private ActionResult GeneratePdfExport(object reportData, string fileName)
    {
        var jsonContent = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes($"PDF Export: {fileName}\n\n{jsonContent}");
        return File(bytes, "application/pdf", $"{fileName}.pdf");
    }

    private ActionResult GenerateExcelExport(object reportData, string fileName)
    {
        var jsonContent = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes($"Excel Export: {fileName}\n\n{jsonContent}");
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{fileName}.xlsx");
    }

    private ActionResult GenerateWordExport(object reportData, string fileName)
    {
        var jsonContent = JsonSerializer.Serialize(reportData, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes($"Word Export: {fileName}\n\n{jsonContent}");
        return File(bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", $"{fileName}.docx");
    }
}

public class CustomReportRequest
{
    public List<int>? AssessmentIds { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string? Status { get; set; }
    public List<string>? IncludeSections { get; set; }
    public string? Format { get; set; } = "json"; // json, pdf, excel
}