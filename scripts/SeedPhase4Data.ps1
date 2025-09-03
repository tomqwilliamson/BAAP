# PowerShell script to execute Phase 4 seeding via SQL commands
# This script will use sqlcmd to connect to Azure SQL Database and execute the seeding scripts

param(
    [string]$Server = "tcp:baap-dev-sql-wsnmnw.database.windows.net,1433",
    [string]$Database = "baap_dev",
    [string]$Username = "baapadmin",
    [string]$Password = "YourSecurePassword123!"
)

Write-Host "=== Phase 4 Industry Classification Data Seeding ===" -ForegroundColor Green
Write-Host "Target Server: $Server" -ForegroundColor Yellow
Write-Host "Target Database: $Database" -ForegroundColor Yellow
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green

# Change to the scripts/seeds directory
$seedsPath = Join-Path $PSScriptRoot "seeds"
if (-not (Test-Path $seedsPath)) {
    Write-Error "Seeds directory not found at $seedsPath"
    exit 1
}

Set-Location $seedsPath

# Check if seed files exist
$industryScript = "23_IndustryClassifications.sql"
$benchmarkScript = "24_IndustryBenchmarks.sql" 
$classificationScript = "25_AssessmentIndustryClassifications.sql"

Write-Host ""
Write-Host "Checking seed script files..." -ForegroundColor Cyan

foreach ($script in @($industryScript, $benchmarkScript, $classificationScript)) {
    if (Test-Path $script) {
        Write-Host "✓ Found: $script" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing: $script" -ForegroundColor Red
        exit 1
    }
}

# Function to execute SQL script with error handling
function Invoke-SqlScript {
    param(
        [string]$ScriptPath,
        [string]$Description
    )
    
    Write-Host ""
    Write-Host "Executing: $Description" -ForegroundColor Cyan
    Write-Host "Script: $ScriptPath" -ForegroundColor Gray
    
    try {
        $result = sqlcmd -S $Server -d $Database -U $Username -P $Password -i $ScriptPath -b
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Successfully executed: $Description" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to execute: $Description" -ForegroundColor Red
            Write-Host "Error output: $result" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ Exception executing: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Execute the seeding scripts in order
Write-Host ""
Write-Host "Starting Phase 4 seeding process..." -ForegroundColor Yellow

# Step 1: Industry Classifications
if (-not (Invoke-SqlScript $industryScript "Industry Classifications (8 industries)")) {
    Write-Host "Failed at Step 1. Aborting." -ForegroundColor Red
    exit 1
}

# Step 2: Industry Benchmarks
if (-not (Invoke-SqlScript $benchmarkScript "Industry Benchmarks (48 benchmarks across 8 industries)")) {
    Write-Host "Failed at Step 2. Aborting." -ForegroundColor Red
    exit 1
}

# Step 3: Assessment Classifications (optional - depends on existing assessments)
Write-Host ""
Write-Host "Step 3: Assessment Classifications (depends on existing assessment data)" -ForegroundColor Cyan
if (-not (Invoke-SqlScript $classificationScript "Sample Assessment Industry Classifications")) {
    Write-Host "Warning: Assessment classifications may have failed (this is expected if no assessments exist)" -ForegroundColor Yellow
}

# Verification - Check what was inserted
Write-Host ""
Write-Host "=== Verification ===" -ForegroundColor Green

$verificationQuery = @"
PRINT 'Phase 4 Seeding Verification Results:'
PRINT '======================================'
PRINT 'Industries: ' + CAST((SELECT COUNT(*) FROM IndustryClassifications) as varchar)
PRINT 'Benchmarks: ' + CAST((SELECT COUNT(*) FROM IndustryBenchmarks) as varchar)  
PRINT 'Assessment Classifications: ' + CAST((SELECT COUNT(*) FROM AssessmentIndustryClassifications) as varchar)
PRINT ''
PRINT 'Sample Industries:'
SELECT TOP 3 
    IndustryCode, 
    IndustryName, 
    TypicalComplexityScore,
    CloudAdoptionPattern
FROM IndustryClassifications 
ORDER BY Id
"@

# Create temporary verification script
$verificationScript = "temp_verification.sql"
$verificationQuery | Out-File -FilePath $verificationScript -Encoding UTF8

try {
    sqlcmd -S $Server -d $Database -U $Username -P $Password -i $verificationScript
    Remove-Item $verificationScript -Force
} catch {
    Write-Host "Verification query failed, but seeding may have succeeded" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Phase 4 Seeding Complete ===" -ForegroundColor Green
Write-Host "Completed at: $(Get-Date)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Refresh your BAAP application" -ForegroundColor White
Write-Host "2. Navigate to AI Intelligence → Industry Classification" -ForegroundColor White  
Write-Host "3. Select an assessment and test the industry classification feature" -ForegroundColor White
Write-Host "4. Verify that industry data appears in the dropdowns and analysis" -ForegroundColor White

Write-Host ""
Write-Host "Industry Classification Database Setup Complete! 🎉" -ForegroundColor Green