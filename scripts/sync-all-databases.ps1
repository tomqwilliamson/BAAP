# Master Database Synchronization Script
# Synchronizes both LocalDB and Azure SQL with comprehensive schema and seed data

param(
    [switch]$LocalOnly = $false,
    [switch]$AzureOnly = $false,
    [switch]$ResetData = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "🔧 BAAP Database Synchronization Tool" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "This script synchronizes both LocalDB and Azure SQL databases with:"
    Write-Host "• Latest Entity Framework migrations"
    Write-Host "• Comprehensive seed data for ALL tables" 
    Write-Host "• Identical schemas and data across environments"
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Cyan
    Write-Host "  -LocalOnly    Sync only LocalDB/Express database"
    Write-Host "  -AzureOnly    Sync only Azure SQL database" 
    Write-Host "  -ResetData    Clear existing data before seeding (DESTRUCTIVE)"
    Write-Host "  -Help         Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\sync-all-databases.ps1                    # Sync both databases"
    Write-Host "  .\sync-all-databases.ps1 -LocalOnly         # Local database only"
    Write-Host "  .\sync-all-databases.ps1 -AzureOnly         # Azure database only"
    Write-Host "  .\sync-all-databases.ps1 -ResetData         # Reset and reseed all data"
    Write-Host ""
    Write-Host "Database Configuration:" -ForegroundColor Cyan
    Write-Host "  LocalDB: (localdb)\MSSQLLocalDB | Database: BAAP_Dev | Auth: Windows"
    Write-Host "  Azure: baap-dev-sql-wsnmnw.database.windows.net | Database: baap_dev | Auth: SQL"
    Write-Host ""
    return
}

$ErrorActionPreference = "Stop"
$startTime = Get-Date

Write-Host "🚀 BAAP Database Synchronization Started" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Start Time: $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Yellow
Write-Host ""

# Verify script location and required files
$scriptsPath = Split-Path $MyInvocation.MyCommand.Path -Parent
$rootPath = Split-Path $scriptsPath -Parent

Write-Host "📁 Verifying script environment..." -ForegroundColor Cyan
Write-Host "   Scripts Path: $scriptsPath" -ForegroundColor White
Write-Host "   Root Path: $rootPath" -ForegroundColor White

# Check required files exist
$requiredFiles = @(
    "scripts\complete_database_sync_and_seed.sql",
    "scripts\sync-local-database.ps1", 
    "scripts\sync-azure-database.ps1",
    "BAAP.API\BAAP.API.csproj"
)

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $rootPath $file
    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ Required file not found: $file" -ForegroundColor Red
        Write-Host "   Expected at: $fullPath" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ All required files found" -ForegroundColor Green
Write-Host ""

# Change to root directory
Set-Location $rootPath

# Track success/failure
$results = @{
    LocalDB = @{ Success = $false; Error = $null; Duration = $null }
    Azure = @{ Success = $false; Error = $null; Duration = $null }
}

# Sync LocalDB unless AzureOnly specified
if (-not $AzureOnly) {
    Write-Host "🏠 SYNCHRONIZING LOCAL DATABASE" -ForegroundColor Magenta
    Write-Host "================================" -ForegroundColor Magenta
    
    $localStart = Get-Date
    try {
        $localParams = @()
        if ($ResetData) { $localParams += "-ResetDatabase" }
        
        $localScriptPath = Join-Path $scriptsPath "sync-local-database.ps1"
        & $localScriptPath @localParams
        
        if ($LASTEXITCODE -eq 0) {
            $results.LocalDB.Success = $true
            $results.LocalDB.Duration = (Get-Date) - $localStart
            Write-Host "✅ LocalDB synchronization completed successfully" -ForegroundColor Green
        } else {
            throw "Local database sync script returned error code: $LASTEXITCODE"
        }
    }
    catch {
        $results.LocalDB.Error = $_.Exception.Message
        Write-Host "❌ LocalDB synchronization failed: $($_.Exception.Message)" -ForegroundColor Red
        
        if (-not $LocalOnly) {
            Write-Host "⚠️ Continuing with Azure sync despite local failure..." -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# Sync Azure SQL unless LocalOnly specified  
if (-not $LocalOnly) {
    Write-Host "☁️ SYNCHRONIZING AZURE SQL DATABASE" -ForegroundColor Blue
    Write-Host "====================================" -ForegroundColor Blue
    
    $azureStart = Get-Date
    try {
        $azureParams = @()
        if ($ResetData) { $azureParams += "-ResetData" }
        
        $azureScriptPath = Join-Path $scriptsPath "sync-azure-database.ps1"
        & $azureScriptPath @azureParams
        
        if ($LASTEXITCODE -eq 0) {
            $results.Azure.Success = $true  
            $results.Azure.Duration = (Get-Date) - $azureStart
            Write-Host "✅ Azure SQL synchronization completed successfully" -ForegroundColor Green
        } else {
            throw "Azure database sync script returned error code: $LASTEXITCODE"
        }
    }
    catch {
        $results.Azure.Error = $_.Exception.Message
        Write-Host "❌ Azure SQL synchronization failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Final summary
$endTime = Get-Date
$totalDuration = $endTime - $startTime

Write-Host "📋 SYNCHRONIZATION SUMMARY" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host "End Time: $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Yellow
Write-Host "Total Duration: $($totalDuration.ToString('mm\:ss'))" -ForegroundColor Yellow
Write-Host ""

$allSuccess = $true

if (-not $AzureOnly) {
    if ($results.LocalDB.Success) {
        Write-Host "✅ LocalDB: SUCCESS ($($results.LocalDB.Duration.ToString('mm\:ss')))" -ForegroundColor Green
    } else {
        Write-Host "❌ LocalDB: FAILED" -ForegroundColor Red
        if ($results.LocalDB.Error) {
            Write-Host "   Error: $($results.LocalDB.Error)" -ForegroundColor Red
        }
        $allSuccess = $false
    }
}

if (-not $LocalOnly) {
    if ($results.Azure.Success) {
        Write-Host "✅ Azure SQL: SUCCESS ($($results.Azure.Duration.ToString('mm\:ss')))" -ForegroundColor Green
    } else {
        Write-Host "❌ Azure SQL: FAILED" -ForegroundColor Red
        if ($results.Azure.Error) {
            Write-Host "   Error: $($results.Azure.Error)" -ForegroundColor Red
        }
        $allSuccess = $false
    }
}

Write-Host ""

if ($allSuccess) {
    Write-Host "🎉 ALL DATABASES SYNCHRONIZED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Both databases now contain:" -ForegroundColor Cyan
    Write-Host "• 5 comprehensive assessment scenarios" -ForegroundColor White
    Write-Host "• 17 applications with detailed metrics" -ForegroundColor White
    Write-Host "• 14 business drivers and strategic requirements" -ForegroundColor White
    Write-Host "• 19 stakeholders across all projects" -ForegroundColor White
    Write-Host "• 25 detailed project timeline items" -ForegroundColor White
    Write-Host "• 14 comprehensive risk assessments" -ForegroundColor White
    Write-Host "• Complete budget allocations ($1.8M - $4.2M per project)" -ForegroundColor White
    Write-Host "• Architecture reviews with maintainability scores" -ForegroundColor White
    Write-Host "• Security findings and compliance frameworks" -ForegroundColor White
    Write-Host "• Infrastructure and database inventories" -ForegroundColor White
    Write-Host "• Development practices assessments" -ForegroundColor White
    Write-Host ""
    Write-Host "Ready for comprehensive testing! 🚀" -ForegroundColor Green
} else {
    Write-Host "⚠️ SYNCHRONIZATION COMPLETED WITH ERRORS" -ForegroundColor Yellow
    Write-Host "Please review the error messages above and retry failed operations." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start the API: cd BAAP.API && dotnet run" -ForegroundColor White
Write-Host "2. Build and deploy frontend with updated data" -ForegroundColor White  
Write-Host "3. Test all assessment modules with comprehensive data" -ForegroundColor White
Write-Host "4. Verify Business Context, Architecture Review, and other pages" -ForegroundColor White