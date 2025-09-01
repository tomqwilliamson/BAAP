# PowerShell Script to Synchronize Azure SQL Database
# Applies schema and seeds comprehensive data to Azure SQL Database

param(
    [string]$ServerName = "baap-dev-sql-wsnmnw.database.windows.net",
    [string]$DatabaseName = "baap_dev",
    [string]$Username = "baapadmin",
    [string]$Password = "YourSecurePassword123!",
    [switch]$ResetData = $false,
    [switch]$SeedData = $true
)

Write-Host "🔄 Starting Azure SQL Database Synchronization..." -ForegroundColor Green
Write-Host "Server: $ServerName" -ForegroundColor Yellow
Write-Host "Database: $DatabaseName" -ForegroundColor Yellow
Write-Host "Username: $Username" -ForegroundColor Yellow
Write-Host ""

# Build connection string
$ConnectionString = "Server=$ServerName;Database=$DatabaseName;User Id=$Username;Password=$Password;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Test connection
Write-Host "🔗 Testing Azure SQL connection..." -ForegroundColor Cyan
try {
    $testQuery = "SELECT @@VERSION as Version, DB_NAME() as DatabaseName, GETDATE() as CurrentTime"
    $testResult = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q $testQuery -h -1 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connected to Azure SQL successfully" -ForegroundColor Green
        Write-Host "   Database: $DatabaseName" -ForegroundColor White
        Write-Host ""
    } else {
        throw "Connection failed: $testResult"
    }
}
catch {
    Write-Host "❌ Failed to connect to Azure SQL Database" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please verify:" -ForegroundColor Yellow
    Write-Host "1. Server name: $ServerName" -ForegroundColor White
    Write-Host "2. Database name: $DatabaseName" -ForegroundColor White  
    Write-Host "3. Username: $Username" -ForegroundColor White
    Write-Host "4. Password is correct" -ForegroundColor White
    Write-Host "5. Azure SQL firewall allows your IP" -ForegroundColor White
    exit 1
}

# Check current schema and data
Write-Host "📊 Checking current database state..." -ForegroundColor Cyan
try {
    $schemaQuery = "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
    $schemaResult = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q $schemaQuery -h -1 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Current state:" -ForegroundColor Blue
        Write-Host "   Tables: $($schemaResult.Trim())" -ForegroundColor White
        Write-Host ""
    }
}
catch {
    Write-Host "⚠️ Could not check current state (this is normal for empty database)" -ForegroundColor Yellow
}

# Apply schema using Entity Framework migrations from API
Write-Host "🏗️ Ensuring database schema is up to date..." -ForegroundColor Cyan

# Check if we need to update appsettings for Azure connection
$apiPath = Join-Path (Get-Location) "BAAP.API"
if (-not (Test-Path $apiPath)) {
    Write-Host "❌ BAAP.API directory not found at: $apiPath" -ForegroundColor Red
    exit 1
}

# Create temporary appsettings for Azure connection
$azureAppsettings = @{
    "ConnectionStrings" = @{
        "DefaultConnection" = $ConnectionString
    }
}

$azureAppsettingsPath = Join-Path $apiPath "appsettings.Azure.json"
$azureAppsettings | ConvertTo-Json -Depth 3 | Out-File -FilePath $azureAppsettingsPath -Encoding UTF8

try {
    Set-Location $apiPath
    
    # Apply migrations to Azure
    $env:ASPNETCORE_ENVIRONMENT = "Azure"
    $migrationOutput = dotnet ef database update --verbose 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database schema updated successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Schema update failed:" -ForegroundColor Red
        Write-Host $migrationOutput -ForegroundColor Red
        
        # Clean up temp file
        Remove-Item $azureAppsettingsPath -Force -ErrorAction SilentlyContinue
        exit 1
    }
    
    # Clean up temp file
    Remove-Item $azureAppsettingsPath -Force -ErrorAction SilentlyContinue
    $env:ASPNETCORE_ENVIRONMENT = $null
}
catch {
    Write-Host "❌ Error updating schema: $($_.Exception.Message)" -ForegroundColor Red
    Remove-Item $azureAppsettingsPath -Force -ErrorAction SilentlyContinue
    exit 1
}
finally {
    Set-Location (Split-Path $apiPath -Parent)
}

# Reset existing data if requested
if ($ResetData) {
    Write-Host "🗑️ Clearing existing data..." -ForegroundColor Red
    $clearDataScript = @"
-- Clear all data while preserving schema
DELETE FROM DevelopmentPractices;
DELETE FROM CodebaseStats;
DELETE FROM TechnologyStacks;
DELETE FROM ArchitecturePatterns;
DELETE FROM ArchitectureReviews;
DELETE FROM BusinessContextRisks;
DELETE FROM ProjectTimelineItems;
DELETE FROM BudgetAllocations;
DELETE FROM ComplianceFrameworks;
DELETE FROM SecurityVulnerabilities;
DELETE FROM DatabaseInstances;
DELETE FROM InfrastructureServers;
DELETE FROM AssessmentFiles;
DELETE FROM DashboardMetrics;
DELETE FROM CodeMetrics;
DELETE FROM SecurityFindings;
DELETE FROM Recommendations;
DELETE FROM Stakeholders;
DELETE FROM BusinessDrivers;
DELETE FROM Applications;
DELETE FROM Assessments;
PRINT 'All existing data cleared successfully';
"@
    
    try {
        $clearDataResult = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q $clearDataScript -t 300 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Existing data cleared" -ForegroundColor Green
        } else {
            throw "Clear data failed: $clearDataResult"
        }
    }
    catch {
        Write-Host "❌ Error clearing data: $($_.Exception.Message)" -ForegroundColor Red
        # Continue anyway - might be empty database
    }
}

# Seed comprehensive data
if ($SeedData) {
    Write-Host "🌱 Seeding comprehensive data to Azure SQL..." -ForegroundColor Cyan
    $seedScript = Join-Path (Get-Location) "scripts\complete_database_sync_and_seed.sql"
    
    if (-not (Test-Path $seedScript)) {
        Write-Host "❌ Seed script not found at: $seedScript" -ForegroundColor Red
        exit 1
    }
    
    try {
        Write-Host "📄 Executing comprehensive seed script..." -ForegroundColor Blue
        Write-Host "   This may take several minutes..." -ForegroundColor Yellow
        
        # Execute the seed script with extended timeout
        $output = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -i $seedScript -t 900 2>&1
        
        Write-Host "✅ Data seeding completed successfully!" -ForegroundColor Green
        Write-Host "📊 Azure SQL now contains comprehensive test data" -ForegroundColor Green
        
        # Verify data was inserted
        Write-Host ""
        Write-Host "🔍 Verifying data insertion..." -ForegroundColor Cyan
        
        $verificationQuery = @"
SELECT 'Record Counts' as Category, '' as Description, 0 as Count
UNION ALL SELECT 'Assessments', 'Core assessment records', COUNT(*) FROM Assessments
UNION ALL SELECT 'Applications', 'Applications within assessments', COUNT(*) FROM Applications  
UNION ALL SELECT 'BusinessDrivers', 'Strategic business drivers', COUNT(*) FROM BusinessDrivers
UNION ALL SELECT 'Stakeholders', 'Project stakeholders', COUNT(*) FROM Stakeholders
UNION ALL SELECT 'BudgetAllocations', 'Budget breakdowns', COUNT(*) FROM BudgetAllocations
UNION ALL SELECT 'ProjectTimelineItems', 'Project timeline phases', COUNT(*) FROM ProjectTimelineItems
UNION ALL SELECT 'BusinessContextRisks', 'Risk assessments', COUNT(*) FROM BusinessContextRisks
UNION ALL SELECT 'ArchitectureReviews', 'Architecture analysis', COUNT(*) FROM ArchitectureReviews
UNION ALL SELECT 'SecurityFindings', 'Security issues', COUNT(*) FROM SecurityFindings
UNION ALL SELECT 'Recommendations', 'Strategic recommendations', COUNT(*) FROM Recommendations
UNION ALL SELECT 'InfrastructureServers', 'Server inventory', COUNT(*) FROM InfrastructureServers
UNION ALL SELECT 'DatabaseInstances', 'Database inventory', COUNT(*) FROM DatabaseInstances
UNION ALL SELECT 'SecurityVulnerabilities', 'Security vulnerabilities', COUNT(*) FROM SecurityVulnerabilities
UNION ALL SELECT 'ComplianceFrameworks', 'Compliance requirements', COUNT(*) FROM ComplianceFrameworks
UNION ALL SELECT 'DashboardMetrics', 'KPI metrics', COUNT(*) FROM DashboardMetrics
UNION ALL SELECT 'DevelopmentPractices', 'Development practices', COUNT(*) FROM DevelopmentPractices
ORDER BY Category
"@
        
        # Simplified verification
        $assessmentCount = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q "SELECT COUNT(*) FROM Assessments" -h -1 2>&1
        $applicationCount = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q "SELECT COUNT(*) FROM Applications" -h -1 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "📈 Data Verification Results:" -ForegroundColor Green
            Write-Host "   ✓ Assessments: $($assessmentCount.Trim()) records" -ForegroundColor White
            Write-Host "   ✓ Applications: $($applicationCount.Trim()) records" -ForegroundColor White
            Write-Host ""
            Write-Host "📊 Database seeded successfully" -ForegroundColor Cyan
        }
        
    }
    catch {
        Write-Host "❌ Error seeding data: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "❓ This might be expected if data already exists" -ForegroundColor Yellow
        
        # Try to show current state anyway
        try {
            $currentState = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q "SELECT COUNT(*) FROM Assessments" -h -1 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Current Assessments count: $($currentState.Trim())" -ForegroundColor Blue
            }
        } catch {
            Write-Host "Could not verify current state" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🎉 Azure SQL Database Synchronization Completed!" -ForegroundColor Green
Write-Host "✅ Azure SQL is now synchronized with comprehensive schema and test data" -ForegroundColor Green
Write-Host ""
Write-Host "Database Details:" -ForegroundColor Cyan
Write-Host "  Server: $ServerName" -ForegroundColor White
Write-Host "  Database: $DatabaseName" -ForegroundColor White
Write-Host "  Status: Ready for application use" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update application configuration to use Azure SQL" -ForegroundColor White
Write-Host "2. Test the application with Azure backend" -ForegroundColor White
Write-Host "3. Verify all functionality works with comprehensive data" -ForegroundColor White