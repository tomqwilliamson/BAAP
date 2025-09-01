# PowerShell Script to Execute All Seed Data Scripts
# This script runs all individual table seed scripts in the correct order to maintain foreign key relationships

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "Local",
    [Parameter(Mandatory=$false)]
    [switch]$ClearExistingData = $false
)

# Configuration
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SeedsFolder = Join-Path $ScriptRoot "seeds"

# Database connection configurations
$LocalDB = @{
    ServerName = "(localdb)\MSSQLLocalDB"
    DatabaseName = "BAAP_Dev"
    UseWindowsAuth = $true
    ConnectionString = "Server=(localdb)\MSSQLLocalDB;Database=BAAP_Dev;Integrated Security=true;"
}

$AzureDB = @{
    ServerName = "baap-dev-sql-server.database.windows.net"
    DatabaseName = "baap_dev"
    Username = "baapadmin"
    Password = "YourSecurePassword123!"
    ConnectionString = "Server=baap-dev-sql-server.database.windows.net;Database=baap_dev;User ID=baapadmin;Password=YourSecurePassword123!;Encrypt=True;TrustServerCertificate=False;"
}

# Select configuration based on environment
$Config = if ($Environment -eq "Azure") { $AzureDB } else { $LocalDB }

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BAAP Database Seeding Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Database: $($Config.DatabaseName)" -ForegroundColor Yellow
Write-Host "Server: $($Config.ServerName)" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan

# Function to execute SQL script
function Execute-SqlScript {
    param(
        [string]$ScriptPath,
        [hashtable]$DatabaseConfig
    )
    
    $ScriptName = Split-Path -Leaf $ScriptPath
    Write-Host "Executing: $ScriptName" -ForegroundColor Green
    
    try {
        if ($DatabaseConfig.UseWindowsAuth) {
            $result = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -E -i $ScriptPath 2>&1
        } else {
            $result = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -U $DatabaseConfig.Username -P $DatabaseConfig.Password -i $ScriptPath 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ $ScriptName completed successfully" -ForegroundColor Green
            # Show count results if they exist
            $countLines = $result | Where-Object { $_ -match "Count\]" }
            foreach ($line in $countLines) {
                Write-Host "  $line" -ForegroundColor Gray
            }
        } else {
            Write-Host "✗ $ScriptName failed with exit code $LASTEXITCODE" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ Error executing $ScriptName : $_" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Function to test database connection
function Test-DatabaseConnection {
    param([hashtable]$DatabaseConfig)
    
    Write-Host "Testing database connection..." -ForegroundColor Yellow
    
    try {
        if ($DatabaseConfig.UseWindowsAuth) {
            $testResult = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -E -Q "SELECT 1 as Connected" -h -1 2>&1
        } else {
            $testResult = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -U $DatabaseConfig.Username -P $DatabaseConfig.Password -Q "SELECT 1 as Connected" -h -1 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database connection successful" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Database connection failed: $testResult" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ Database connection error: $_" -ForegroundColor Red
        return $false
    }
}

# Function to clear existing data (if requested)
function Clear-ExistingData {
    param([hashtable]$DatabaseConfig)
    
    Write-Host "Clearing existing data..." -ForegroundColor Yellow
    
    $clearScript = @"
-- Clear all tables in dependency order (child tables first)
DELETE FROM AssessmentFiles;
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
DELETE FROM DashboardMetrics;
DELETE FROM CodeMetrics;
DELETE FROM Recommendations;
DELETE FROM SecurityFindings;
DELETE FROM Stakeholders;
DELETE FROM BusinessDrivers;
DELETE FROM Applications;
DELETE FROM Assessments;

-- Reset identity seeds
DBCC CHECKIDENT ('Assessments', RESEED, 0);
DBCC CHECKIDENT ('Applications', RESEED, 0);
DBCC CHECKIDENT ('BusinessDrivers', RESEED, 0);
DBCC CHECKIDENT ('Stakeholders', RESEED, 0);
DBCC CHECKIDENT ('SecurityFindings', RESEED, 0);
DBCC CHECKIDENT ('Recommendations', RESEED, 0);
DBCC CHECKIDENT ('CodeMetrics', RESEED, 0);
DBCC CHECKIDENT ('DashboardMetrics', RESEED, 0);
DBCC CHECKIDENT ('InfrastructureServers', RESEED, 0);
DBCC CHECKIDENT ('DatabaseInstances', RESEED, 0);
DBCC CHECKIDENT ('SecurityVulnerabilities', RESEED, 0);
DBCC CHECKIDENT ('ComplianceFrameworks', RESEED, 0);
DBCC CHECKIDENT ('BudgetAllocations', RESEED, 0);
DBCC CHECKIDENT ('ProjectTimelineItems', RESEED, 0);
DBCC CHECKIDENT ('BusinessContextRisks', RESEED, 0);
DBCC CHECKIDENT ('ArchitectureReviews', RESEED, 0);
DBCC CHECKIDENT ('ArchitecturePatterns', RESEED, 0);
DBCC CHECKIDENT ('TechnologyStacks', RESEED, 0);
DBCC CHECKIDENT ('CodebaseStats', RESEED, 0);
DBCC CHECKIDENT ('DevelopmentPractices', RESEED, 0);
DBCC CHECKIDENT ('AssessmentFiles', RESEED, 0);

PRINT 'All existing data cleared successfully!';
"@
    
    $clearScriptPath = Join-Path $ScriptRoot "temp_clear_data.sql"
    $clearScript | Out-File -FilePath $clearScriptPath -Encoding UTF8
    
    try {
        if ($DatabaseConfig.UseWindowsAuth) {
            $result = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -E -i $clearScriptPath 2>&1
        } else {
            $result = & sqlcmd -S $DatabaseConfig.ServerName -d $DatabaseConfig.DatabaseName -U $DatabaseConfig.Username -P $DatabaseConfig.Password -i $clearScriptPath 2>&1
        }
        
        Remove-Item $clearScriptPath -Force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Existing data cleared successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Failed to clear existing data: $result" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ Error clearing existing data: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution logic
try {
    # Test database connection first
    if (-not (Test-DatabaseConnection -DatabaseConfig $Config)) {
        Write-Host "Cannot proceed without database connection. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Clear existing data if requested
    if ($ClearExistingData) {
        if (-not (Clear-ExistingData -DatabaseConfig $Config)) {
            Write-Host "Failed to clear existing data. Continuing with seeding..." -ForegroundColor Yellow
        }
    }
    
    # Define the execution order (respecting foreign key dependencies)
    $SeedScripts = @(
        "01_Assessments.sql",
        "02_Applications.sql",
        "03_BusinessDrivers.sql",
        "04_Stakeholders.sql",
        "05_SecurityFindings.sql",
        "06_Recommendations.sql",
        "07_CodeMetrics.sql",
        "08_DashboardMetrics.sql",
        "09_InfrastructureServers.sql",
        "10_DatabaseInstances.sql",
        "11_SecurityVulnerabilities.sql",
        "12_ComplianceFrameworks.sql",
        "13_BudgetAllocations.sql",
        "14_ProjectTimelineItems.sql",
        "15_BusinessContextRisks.sql",
        "16_ArchitectureReviews.sql",
        "17_ArchitecturePatterns.sql",
        "18_TechnologyStacks.sql",
        "19_CodebaseStats.sql",
        "20_DevelopmentPractices.sql",
        "21_AssessmentFiles.sql"
    )
    
    Write-Host "`nStarting seed data execution..." -ForegroundColor Yellow
    Write-Host "Total scripts to execute: $($SeedScripts.Count)" -ForegroundColor Gray
    
    $SuccessCount = 0
    $FailureCount = 0
    
    foreach ($Script in $SeedScripts) {
        $ScriptPath = Join-Path $SeedsFolder $Script
        
        if (Test-Path $ScriptPath) {
            if (Execute-SqlScript -ScriptPath $ScriptPath -DatabaseConfig $Config) {
                $SuccessCount++
            } else {
                $FailureCount++
                Write-Host "Script $Script failed. Continuing with remaining scripts..." -ForegroundColor Yellow
            }
        } else {
            Write-Host "✗ Script not found: $Script" -ForegroundColor Red
            $FailureCount++
        }
        
        # Small delay between scripts
        Start-Sleep -Milliseconds 500
    }
    
    # Final summary
    Write-Host "`n=====================================" -ForegroundColor Cyan
    Write-Host "SEEDING COMPLETED" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Successful: $SuccessCount" -ForegroundColor Green
    Write-Host "Failed: $FailureCount" -ForegroundColor $(if($FailureCount -gt 0){"Red"}else{"Green"})
    Write-Host "Total: $($SeedScripts.Count)" -ForegroundColor Gray
    
    if ($FailureCount -eq 0) {
        Write-Host "`n✓ All seed scripts executed successfully!" -ForegroundColor Green
        Write-Host "Database '$($Config.DatabaseName)' is now populated with comprehensive seed data for 3 assessments." -ForegroundColor Green
    } else {
        Write-Host "`n⚠ Some scripts failed. Please review the errors above." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "`n✗ Fatal error during seed execution: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")