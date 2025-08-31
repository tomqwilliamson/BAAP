using Microsoft.AspNetCore.Mvc;
using BAAP.API.Data;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigurationController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ConfigurationController> _logger;

    public ConfigurationController(IConfiguration configuration, ILogger<ConfigurationController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Get client-safe configuration values for the UI
    /// </summary>
    [HttpGet("client")]
    public IActionResult GetClientConfiguration()
    {
        try
        {
            var config = new
            {
                Environment = _configuration["Environment"] ?? "Development",
                ApiBaseUrl = _configuration["ApiBaseUrl"] ?? "",
                WebAppUrl = _configuration["WebAppUrl"] ?? "",
                ApplicationInsights = new
                {
                    InstrumentationKey = _configuration["ApplicationInsights:InstrumentationKey"] ?? ""
                },
                Features = new
                {
                    UseApi = _configuration["Features:UseApi"] ?? "true",
                    EnableAnalytics = _configuration["Features:EnableAnalytics"] ?? "true",
                    EnableChatAssistant = _configuration["Features:EnableChatAssistant"] ?? "false"
                },
                UI = new
                {
                    Theme = _configuration["UI:Theme"] ?? "light",
                    DefaultPageSize = int.Parse(_configuration["UI:DefaultPageSize"] ?? "25"),
                    EnableDebugMode = _configuration["UI:EnableDebugMode"] ?? "false"
                }
            };

            _logger.LogInformation("Client configuration requested for environment: {Environment}", config.Environment);
            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving client configuration");
            return Problem("Unable to retrieve configuration", statusCode: 500);
        }
    }

    /// <summary>
    /// Get feature flags for the application
    /// </summary>
    [HttpGet("features")]
    public IActionResult GetFeatureFlags()
    {
        try
        {
            var features = new
            {
                UseApi = bool.TryParse(_configuration["Features:UseApi"], out bool useApi) ? useApi : true,
                EnableAnalytics = bool.TryParse(_configuration["Features:EnableAnalytics"], out bool enableAnalytics) ? enableAnalytics : true,
                EnableChatAssistant = bool.TryParse(_configuration["Features:EnableChatAssistant"], out bool enableChatAssistant) ? enableChatAssistant : false,
                EnableAdvancedReporting = bool.TryParse(_configuration["Features:EnableAdvancedReporting"], out bool enableAdvancedReporting) ? enableAdvancedReporting : false,
                EnableCloudRecommendations = bool.TryParse(_configuration["Features:EnableCloudRecommendations"], out bool enableCloudRecommendations) ? enableCloudRecommendations : true,
                EnableSecurityScanning = bool.TryParse(_configuration["Features:EnableSecurityScanning"], out bool enableSecurityScanning) ? enableSecurityScanning : true
            };

            return Ok(features);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving feature flags");
            return Problem("Unable to retrieve feature flags", statusCode: 500);
        }
    }

    /// <summary>
    /// Get application health status and configuration info
    /// </summary>
    [HttpGet("health")]
    public IActionResult GetHealth()
    {
        try
        {
            var health = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = _configuration["Environment"] ?? "Development",
                Deployment = new
                {
                    Timestamp = _configuration["DEPLOYMENT_TIMESTAMP"] ?? "",
                    GitCommit = _configuration["GIT_COMMIT"] ?? "",
                    BuildNumber = _configuration["BUILD_NUMBER"] ?? "",
                    AspNetCoreEnvironment = _configuration["ASPNETCORE_ENVIRONMENT"] ?? ""
                },
                Database = new
                {
                    Connected = true, // You could add actual database connectivity check here
                    Name = _configuration["DatabaseName"] ?? ""
                },
                ExternalServices = new
                {
                    AppConfiguration = !string.IsNullOrEmpty(_configuration.GetConnectionString("AppConfig")),
                    KeyVault = !string.IsNullOrEmpty(_configuration["KeyVaultName"]),
                    ApplicationInsights = !string.IsNullOrEmpty(_configuration["ApplicationInsights:InstrumentationKey"])
                },
                Server = new
                {
                    MachineName = Environment.MachineName,
                    ProcessorCount = Environment.ProcessorCount,
                    WorkingSet = Environment.WorkingSet,
                    OSVersion = Environment.OSVersion.ToString()
                }
            };

            return Ok(health);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving health status");
            return Problem("Unable to retrieve health status", statusCode: 500);
        }
    }

    /// <summary>
    /// Get detailed application diagnostics (internal use)
    /// </summary>
    [HttpGet("diagnostics")]
    public IActionResult GetDiagnostics()
    {
        try
        {
            var diagnostics = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Runtime = new
                {
                    Version = Environment.Version.ToString(),
                    Framework = System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription,
                    OSDescription = System.Runtime.InteropServices.RuntimeInformation.OSDescription,
                    ProcessArchitecture = System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture.ToString()
                },
                Memory = new
                {
                    WorkingSet = Environment.WorkingSet,
                    GCTotalMemory = GC.GetTotalMemory(false)
                },
                Configuration = new
                {
                    HasAppConfig = !string.IsNullOrEmpty(_configuration.GetConnectionString("AppConfig")),
                    HasKeyVault = !string.IsNullOrEmpty(_configuration["KeyVaultName"]),
                    HasApplicationInsights = !string.IsNullOrEmpty(_configuration["ApplicationInsights:InstrumentationKey"]),
                    HasDatabase = !string.IsNullOrEmpty(_configuration.GetConnectionString("DefaultConnection"))
                }
            };

            return Ok(diagnostics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving diagnostics");
            return Problem("Unable to retrieve diagnostics", statusCode: 500);
        }
    }

    /// <summary>
    /// Update sample data for testing dashboard (development only)
    /// </summary>
    [HttpPost("update-sample-data")]
    public async Task<IActionResult> UpdateSampleData([FromServices] BaapDbContext context)
    {
        try
        {
            // Update category scores for assessments
            var assessment1 = await context.Assessments.FindAsync(1);
            if (assessment1 != null)
            {
                assessment1.CodeQualityScore = 85;
                assessment1.InfrastructureScore = 92;
                assessment1.DevOpsMaturityScore = 74;
                assessment1.DatabaseOptimizationScore = 81;
                assessment1.DocumentationScore = 69;
                assessment1.ApplicationCount = 6;
            }

            var assessment2 = await context.Assessments.FindAsync(2);
            if (assessment2 != null)
            {
                assessment2.CodeQualityScore = 62;
                assessment2.InfrastructureScore = 58;
                assessment2.DevOpsMaturityScore = 45;
                assessment2.DatabaseOptimizationScore = 72;
                assessment2.DocumentationScore = 55;
                assessment2.ApplicationCount = 4;
            }

            var assessment3 = await context.Assessments.FindAsync(3);
            if (assessment3 != null)
            {
                assessment3.CodeQualityScore = 88;
                assessment3.InfrastructureScore = 94;
                assessment3.DevOpsMaturityScore = 91;
                assessment3.DatabaseOptimizationScore = 89;
                assessment3.DocumentationScore = 82;
                assessment3.ApplicationCount = 2;
            }

            // Update some application metrics
            var app1 = await context.Applications.FindAsync(1);
            if (app1 != null)
            {
                app1.CriticalIssues = 2;
                app1.SecurityIssues = 3;
                app1.CriticalFindings = 2;
                app1.HighFindings = 1;
            }

            var app2 = await context.Applications.FindAsync(2);
            if (app2 != null)
            {
                app2.CriticalIssues = 1;
                app2.SecurityIssues = 2;
                app2.CriticalFindings = 1;
                app2.HighFindings = 1;
            }

            await context.SaveChangesAsync();

            _logger.LogInformation("Sample data updated successfully");
            return Ok(new { message = "Sample data updated successfully", timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating sample data");
            return Problem("Unable to update sample data", statusCode: 500);
        }
    }
}