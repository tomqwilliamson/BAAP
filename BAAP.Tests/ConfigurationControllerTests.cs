using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using BAAP.API.Controllers;

namespace BAAP.Tests;

public class ConfigurationControllerTests
{
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<ILogger<ConfigurationController>> _mockLogger;
    private readonly ConfigurationController _controller;

    public ConfigurationControllerTests()
    {
        _mockConfiguration = new Mock<IConfiguration>();
        _mockLogger = new Mock<ILogger<ConfigurationController>>();
        _controller = new ConfigurationController(_mockConfiguration.Object, _mockLogger.Object);
    }

    [Fact]
    public void GetHealth_ReturnsOkResult()
    {
        // Arrange
        _mockConfiguration.Setup(x => x["Environment"]).Returns("Test");
        _mockConfiguration.Setup(x => x["DatabaseName"]).Returns("TestDB");
        _mockConfiguration.Setup(x => x.GetConnectionString("AppConfig")).Returns("test-connection");

        // Act
        var result = _controller.GetHealth();

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void GetClientConfiguration_ReturnsOkResult()
    {
        // Arrange
        _mockConfiguration.Setup(x => x["Environment"]).Returns("Test");
        _mockConfiguration.Setup(x => x["ApiBaseUrl"]).Returns("https://test-api.com");
        _mockConfiguration.Setup(x => x["Features:UseApi"]).Returns("true");

        // Act
        var result = _controller.GetClientConfiguration();

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void GetFeatureFlags_ReturnsOkResult()
    {
        // Arrange
        _mockConfiguration.Setup(x => x["Features:UseApi"]).Returns("true");
        _mockConfiguration.Setup(x => x["Features:EnableAnalytics"]).Returns("true");
        _mockConfiguration.Setup(x => x["Features:EnableChatAssistant"]).Returns("false");

        // Act
        var result = _controller.GetFeatureFlags();

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void GetDiagnostics_ReturnsOkResult()
    {
        // Arrange
        _mockConfiguration.Setup(x => x.GetConnectionString("AppConfig")).Returns("test-connection");
        _mockConfiguration.Setup(x => x["KeyVaultName"]).Returns("test-vault");

        // Act
        var result = _controller.GetDiagnostics();

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }
}