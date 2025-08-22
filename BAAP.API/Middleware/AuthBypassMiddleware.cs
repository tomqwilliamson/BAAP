using System.Security.Claims;

namespace BAAP.API.Middleware;

public class AuthBypassMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuthBypassMiddleware> _logger;
    private readonly bool _isDevelopment;

    public AuthBypassMiddleware(RequestDelegate next, ILogger<AuthBypassMiddleware> logger, IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _isDevelopment = environment.IsDevelopment();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (_isDevelopment && context.Request.Headers.ContainsKey("X-Auth-Bypass"))
        {
            var bypassValue = context.Request.Headers["X-Auth-Bypass"].ToString();
            
            if (bypassValue == "development")
            {
                _logger.LogInformation("Authentication bypassed in development mode");
                
                // Create a fake user identity for testing
                var claims = new[]
                {
                    new Claim(ClaimTypes.Email, "dev@localhost.com"),
                    new Claim(ClaimTypes.Name, "Development User"),
                    new Claim(ClaimTypes.NameIdentifier, "dev-user-id"),
                    new Claim("role", "Administrator")
                };

                var identity = new ClaimsIdentity(claims, "Development");
                var principal = new ClaimsPrincipal(identity);
                
                context.User = principal;
            }
        }

        await _next(context);
    }
}