using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BAAP.API.Data;
using BAAP.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<BaapDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"));
    }
    else
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
});

// Configure CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000", "https://localhost:3000")
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
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("ReactApp");

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data in development environment
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeederService>();
    await seeder.SeedDataAsync();
}

app.Run();
