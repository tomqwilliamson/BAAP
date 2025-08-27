using Microsoft.AspNetCore.Mvc;

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
                UseApi = bool.Parse(_configuration["Features:UseApi"] ?? "true"),
                EnableAnalytics = bool.Parse(_configuration["Features:EnableAnalytics"] ?? "true"),
                EnableChatAssistant = bool.Parse(_configuration["Features:EnableChatAssistant"] ?? "false"),
                EnableAdvancedReporting = bool.Parse(_configuration["Features:EnableAdvancedReporting"] ?? "false"),
                EnableCloudRecommendations = bool.Parse(_configuration["Features:EnableCloudRecommendations"] ?? "true"),
                EnableSecurityScanning = bool.Parse(_configuration["Features:EnableSecurityScanning"] ?? "true")
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
}