using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace BAAP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public ActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            // In development, accept demo credentials
            // In production, this would integrate with Azure B2C
            if (ValidateCredentials(request.Email, request.Password))
            {
                var token = GenerateJwtToken(request.Email);
                var user = GetUserInfo(request.Email);

                return Ok(new
                {
                    token,
                    user,
                    expiresIn = _configuration.GetValue<int>("JwtSettings:ExpirationInHours") * 3600,
                    message = "Login successful"
                });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email {Email}", request.Email);
            return StatusCode(500, "An error occurred during login");
        }
    }

    // POST: api/auth/validate
    [HttpPost("validate")]
    [Authorize]
    public ActionResult ValidateToken()
    {
        try
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? 
                           User.FindFirst("email")?.Value ?? 
                           "demo@example.com";
            
            var user = GetUserInfo(userEmail);

            return Ok(new
            {
                valid = true,
                user,
                message = "Token is valid"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return StatusCode(500, "An error occurred while validating token");
        }
    }

    // GET: api/auth/user
    [HttpGet("user")]
    [Authorize]
    public ActionResult GetCurrentUser()
    {
        try
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? 
                           User.FindFirst("email")?.Value ?? 
                           "demo@example.com";
            
            var user = GetUserInfo(userEmail);

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user");
            return StatusCode(500, "An error occurred while retrieving user information");
        }
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    [Authorize]
    public ActionResult Logout()
    {
        // In a real implementation, you might want to blacklist the token
        // For now, we'll just return success as JWT tokens are stateless
        return Ok(new { message = "Logout successful" });
    }

    private bool ValidateCredentials(string email, string password)
    {
        // Development credentials - replace with real authentication in production
        var validCredentials = new Dictionary<string, string>
        {
            { "demo@example.com", "demo123" },
            { "admin@baap.com", "admin123" },
            { "user@company.com", "user123" },
            { "analyst@enterprise.com", "analyst123" }
        };

        return validCredentials.ContainsKey(email) && validCredentials[email] == password;
    }

    private string GenerateJwtToken(string email)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"] ?? "BAAP-API";
        var audience = jwtSettings["Audience"] ?? "BAAP-Client";
        var expirationHours = jwtSettings.GetValue<int>("ExpirationInHours");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Name, GetDisplayName(email)),
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new Claim("role", GetUserRole(email)),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private object GetUserInfo(string email)
    {
        return new
        {
            id = Guid.NewGuid().ToString(),
            email,
            name = GetDisplayName(email),
            role = GetUserRole(email),
            permissions = GetUserPermissions(email),
            preferences = new
            {
                theme = "light",
                notifications = true,
                language = "en"
            }
        };
    }

    private string GetDisplayName(string email)
    {
        return email switch
        {
            "demo@example.com" => "Demo User",
            "admin@baap.com" => "Admin User",
            "user@company.com" => "Company User",
            "analyst@enterprise.com" => "Senior Analyst",
            _ => "Unknown User"
        };
    }

    private string GetUserRole(string email)
    {
        return email switch
        {
            "admin@baap.com" => "Administrator",
            "analyst@enterprise.com" => "Analyst",
            _ => "User"
        };
    }

    private string[] GetUserPermissions(string email)
    {
        return GetUserRole(email) switch
        {
            "Administrator" => new[]
            {
                "assessments:read", "assessments:write", "assessments:delete",
                "users:read", "users:write", "users:delete",
                "reports:read", "reports:write",
                "settings:read", "settings:write"
            },
            "Analyst" => new[]
            {
                "assessments:read", "assessments:write",
                "reports:read", "reports:write",
                "recommendations:read", "recommendations:write"
            },
            _ => new[]
            {
                "assessments:read",
                "reports:read"
            }
        };
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}