using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BAAP.API.Data;
using BAAP.API.Services;
using BAAP.API.Middleware;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Configure Azure App Configuration
var connectionString = builder.Configuration.GetConnectionString("AppConfig");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString)
               .ConfigureKeyVault(kv =>
               {
                   // Use managed identity in production, default credential for development
                   kv.SetCredential(builder.Environment.IsDevelopment() 
                       ? new DefaultAzureCredential() 
                       : new ManagedIdentityCredential());
               })
               .Select("BAAP:*")
               .TrimKeyPrefix("BAAP:");
    });
    
    // Add App Configuration middleware for dynamic configuration refresh
    builder.Services.AddAzureAppConfiguration();
}

// Add services to the container.
builder.Services.AddDbContext<BaapDbContext>(options =>
{
    // Use SQL Server for both development and production
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// Configure CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:3000",
                    "https://localhost:3000",
                    "http://localhost:3001",
                    "https://localhost:3001",
                    "https://jolly-ocean-089232b0f.1.azurestaticapps.net"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

// Configure Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        var azureAdSettings = builder.Configuration.GetSection("AzureAd");
        
        // Check if Azure B2C is configured
        if (!string.IsNullOrEmpty(azureAdSettings["Instance"]))
        {
            // Azure B2C Configuration
            options.Authority = $"{azureAdSettings["Instance"]}/{azureAdSettings["Domain"]}/{azureAdSettings["SignUpSignInPolicyId"]}/v2.0/";
            options.Audience = azureAdSettings["ClientId"];
            options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        }
        else
        {
            // Development JWT Configuration (fallback)
            var secretKey = jwtSettings["SecretKey"] ?? "your-256-bit-secret-key-here-must-be-at-least-32-characters-long";
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"] ?? "BAAP-API",
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"] ?? "BAAP-Client",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        }
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAuthenticatedUser", policy =>
        policy.RequireAuthenticatedUser());
});

builder.Services.AddScoped<DataSeederService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BAAP API", Version = "v1" });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7273; // Default HTTPS port for development
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("ReactApp");

// Enable Azure App Configuration middleware for dynamic refresh (only if configured)
var appConfigConnectionString = app.Configuration.GetConnectionString("AppConfig");
if (!string.IsNullOrEmpty(appConfigConnectionString))
{
    app.UseAzureAppConfiguration();
}

// Add authentication bypass middleware for development
if (app.Environment.IsDevelopment())
{
    app.UseMiddleware<AuthBypassMiddleware>();
}

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply database migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BaapDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("✅ Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error applying database migrations: {ex.Message}");
        // Don't fail the app startup, just log the error
    }
}

// Seed data in development environment - DISABLED AFTER SEEDING
// if (app.Environment.IsDevelopment())
// {
//     using var scope = app.Services.CreateScope();
//     var seeder = scope.ServiceProvider.GetRequiredService<DataSeederService>();
//     await seeder.SeedDataAsync();
// }

app.Run();
