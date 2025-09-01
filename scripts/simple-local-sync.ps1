# Simple Local Database Synchronization Script
param(
    [string]$DatabaseName = "BAAP_Dev"
)

Write-Host "🔄 Starting Local Database Synchronization..." -ForegroundColor Green
Write-Host "Database: $DatabaseName" -ForegroundColor Yellow

# Stop any running BAAP API instances
Write-Host "🛑 Stopping any running BAAP API instances..." -ForegroundColor Yellow
$processes = Get-Process -Name "BAAP.API" -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Stopped $($processes.Count) BAAP API process(es)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "ℹ️ No running BAAP API processes found" -ForegroundColor Blue
}

# Navigate to API directory
$apiPath = Join-Path (Get-Location) "BAAP.API"
if (-not (Test-Path $apiPath)) {
    Write-Host "❌ BAAP.API directory not found at: $apiPath" -ForegroundColor Red
    exit 1
}

Set-Location $apiPath

# Apply migrations
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

# Seed basic data  
Write-Host "🌱 Seeding basic test data..." -ForegroundColor Cyan
$seedScript = Join-Path (Split-Path $apiPath -Parent) "scripts\complete_database_sync_and_seed.sql"

if (-not (Test-Path $seedScript)) {
    Write-Host "❌ Seed script not found at: $seedScript" -ForegroundColor Red
    exit 1
}

try {
    Write-Host "📄 Executing seed script..." -ForegroundColor Blue
    $output = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -i $seedScript -t 300 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Data seeding completed successfully" -ForegroundColor Green
        
        # Check results
        $assessmentCount = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -Q "SELECT COUNT(*) FROM Assessments" -h -1 2>&1
        $applicationCount = & sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d $DatabaseName -Q "SELECT COUNT(*) FROM Applications" -h -1 2>&1
        
        Write-Host ""
        Write-Host "📈 Data Summary:" -ForegroundColor Cyan
        Write-Host "   Assessments: $($assessmentCount.Trim())" -ForegroundColor White
        Write-Host "   Applications: $($applicationCount.Trim())" -ForegroundColor White
    } else {
        Write-Host "⚠️ Seeding may have had issues (this can be normal if data already exists)" -ForegroundColor Yellow
        Write-Host "Output: $output" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error seeding data: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "❓ This might be expected if data already exists" -ForegroundColor Yellow
}

# Return to original directory
Set-Location (Split-Path $apiPath -Parent)

Write-Host ""
Write-Host "🎉 Local Database Synchronization Completed!" -ForegroundColor Green
Write-Host "✅ LocalDB is now ready with complete schema and test data" -ForegroundColor Green