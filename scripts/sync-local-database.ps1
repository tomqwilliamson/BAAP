# PowerShell Script to Synchronize Local Database
# Applies migrations and seeds comprehensive data to LocalDB/Express

param(
    [string]$ConnectionString = "Server=(localdb)\MSSQLLocalDB;Database=BAAP_Dev;Trusted_Connection=true;MultipleActiveResultSets=true",
    [string]$DatabaseName = "BAAP_Dev",
    [switch]$ResetDatabase = $false,
    [switch]$ApplyMigrations = $true,
    [switch]$SeedData = $true
)

Write-Host "🔄 Starting Local Database Synchronization..." -ForegroundColor Green
Write-Host "Database: $DatabaseName" -ForegroundColor Yellow
Write-Host "Connection: $ConnectionString" -ForegroundColor Yellow
Write-Host ""

# Stop any running BAAP API instances to release database locks
Write-Host "🛑 Stopping any running BAAP API instances..." -ForegroundColor Yellow
$processes = Get-Process -Name "BAAP.API" -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Stopped $($processes.Count) BAAP API process(es)" -ForegroundColor Green
    Start-Sleep -Seconds 3
} else {
    Write-Host "ℹ️ No running BAAP API processes found" -ForegroundColor Blue
}

# Reset database if requested
if ($ResetDatabase) {
    Write-Host "🗑️ Resetting database..." -ForegroundColor Red
    try {
        # Drop and recreate database
        $dropDbScript = @"
IF EXISTS (SELECT * FROM sys.databases WHERE name = '$DatabaseName')
BEGIN
    ALTER DATABASE [$DatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [$DatabaseName];
END
CREATE DATABASE [$DatabaseName];
"@
        
        & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -Q $dropDbScript
        Write-Host "✅ Database reset successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to reset database: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Navigate to API directory
$apiPath = Join-Path (Get-Location) "BAAP.API"
if (-not (Test-Path $apiPath)) {
    Write-Host "❌ BAAP.API directory not found at: $apiPath" -ForegroundColor Red
    exit 1
}

Set-Location $apiPath

# Apply migrations
if ($ApplyMigrations) {
    Write-Host "📁 Applying Entity Framework migrations..." -ForegroundColor Cyan
    try {
        $output = dotnet ef database update --verbose 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migrations applied successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Migration failed:" -ForegroundColor Red
            Write-Host $output -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "❌ Error applying migrations: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Seed comprehensive data
if ($SeedData) {
    Write-Host "🌱 Seeding comprehensive data..." -ForegroundColor Cyan
    $seedScript = Join-Path (Split-Path $apiPath -Parent) "scripts\complete_database_sync_and_seed.sql"
    
    if (-not (Test-Path $seedScript)) {
        Write-Host "❌ Seed script not found at: $seedScript" -ForegroundColor Red
        exit 1
    }
    
    try {
        Write-Host "📄 Executing seed script..." -ForegroundColor Blue
        $output = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -i $seedScript -t 600
        
        Write-Host "✅ Data seeding completed successfully" -ForegroundColor Green
        Write-Host "📊 Database now contains comprehensive test data for all tables" -ForegroundColor Green
        
        # Display summary
        Write-Host ""
        Write-Host "📈 Data Summary:" -ForegroundColor Cyan
        
        try {
            $assessmentCount = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -Q "SELECT COUNT(*) FROM Assessments" -h -1 2>&1
            $applicationCount = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -Q "SELECT COUNT(*) FROM Applications" -h -1 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   Assessments: $($assessmentCount.Trim())" -ForegroundColor White
                Write-Host "   Applications: $($applicationCount.Trim())" -ForegroundColor White
            }
        }
        catch {
            Write-Host "   Could not retrieve record counts" -ForegroundColor Yellow
        }
        
    }
    catch {
        Write-Host "❌ Error seeding data: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "❓ This might be expected if data already exists" -ForegroundColor Yellow
    }
}

# Return to original directory
Set-Location (Split-Path $apiPath -Parent)

Write-Host ""
Write-Host "🎉 Local Database Synchronization Completed!" -ForegroundColor Green
Write-Host "✅ LocalDB is now ready with complete schema and comprehensive test data" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: cd BAAP.API && dotnet run" -ForegroundColor White
Write-Host "2. Test the application with comprehensive data" -ForegroundColor White
Write-Host "3. Run sync-azure-database.ps1 to sync Azure SQL" -ForegroundColor White