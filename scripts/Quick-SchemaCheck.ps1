# Quick Database Schema Check for BAAP
# Simple script to get column information for problematic tables

param(
    [string]$DatabaseName = "BAAP_Dev",
    [string]$ServerInstance = "(localdb)\MSSQLLocalDB"
)

Write-Host "=== QUICK SCHEMA CHECK FOR BAAP DATABASE ===" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName @ $ServerInstance" -ForegroundColor Yellow
Write-Host ""

# Problematic tables based on error messages
$problematicTables = @(
    'CodeMetrics',
    'DatabaseInstances', 
    'SecurityVulnerabilities',
    'ComplianceFrameworks'
)

foreach ($table in $problematicTables) {
    Write-Host "TABLE: $table" -ForegroundColor Green
    Write-Host "Columns in database:" -ForegroundColor Yellow
    
    $query = @"
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = '$table'
ORDER BY ORDINAL_POSITION
"@
    
    try {
        $result = sqlcmd -S $ServerInstance -d $DatabaseName -Q $query -h-1 -s"|" -W
        if ($LASTEXITCODE -eq 0 -and $result) {
            foreach ($row in $result) {
                if ($row -and $row.Trim() -ne "" -and $row.Contains("|")) {
                    $parts = $row.Split("|")
                    $columnName = $parts[0].Trim()
                    $dataType = $parts[1].Trim()
                    $nullable = $parts[2].Trim()
                    Write-Host "  $columnName [$dataType] $(if($nullable -eq 'YES') {'NULL'} else {'NOT NULL'})" -ForegroundColor White
                }
            }
        } else {
            Write-Host "  ❌ Table not found or query failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=== WHAT YOUR SEED SCRIPT IS TRYING TO USE ===" -ForegroundColor Cyan

Write-Host ""
Write-Host "CodeMetrics seed script columns:" -ForegroundColor Yellow
Write-Host "MetricName, [Value], Unit, Category, ApplicationId, MeasuredDate, CreatedDate" -ForegroundColor Gray
Write-Host "❌ Problem: Seed script uses 'CreatedDate' but database doesn't have it" -ForegroundColor Red

Write-Host ""
Write-Host "DatabaseInstances seed script columns:" -ForegroundColor Yellow  
Write-Host "DatabaseName, DatabaseType, [Version], ServerName, Environment, SizeGB, [Status], BackupFrequency, LastBackupDate, AssessmentId, CreatedDate" -ForegroundColor Gray
Write-Host "❌ Problems: Multiple column name mismatches" -ForegroundColor Red

Write-Host ""
Write-Host "SecurityVulnerabilities seed script columns:" -ForegroundColor Yellow
Write-Host "VulnerabilityName, [Description], Severity, CvssScore, [Status], RemediationPlan, DiscoveredDate, AssessmentId, CreatedDate" -ForegroundColor Gray
Write-Host "❌ Problems: Column name mismatches" -ForegroundColor Red

Write-Host ""
Write-Host "ComplianceFrameworks seed script columns:" -ForegroundColor Yellow
Write-Host "FrameworkName, [Description], RequiredByDate, ComplianceStatus, ResponsibleParty, Notes, AssessmentId, CreatedDate" -ForegroundColor Gray
Write-Host "❌ Problems: Column name mismatches" -ForegroundColor Red

Write-Host ""
Write-Host "Run this script to see the exact column differences and fix your seed script accordingly." -ForegroundColor Green