# PowerShell Script to Check Database Schema and Generate Fixed Seed Script
# This script connects to LocalDB, retrieves actual table schemas, 
# and compares them with the seed script to identify column mismatches

param(
    [string]$DatabaseName = "BAAP_Dev",
    [string]$ServerInstance = "(localdb)\MSSQLLocalDB",
    [string]$SeedScriptPath = "C:\Users\twilliamson\source\repos\BAAP\scripts\complete_database_sync_and_seed.sql"
)

Write-Host "=== BAAP Database Schema Validation and Seed Script Correction ===" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName" -ForegroundColor Yellow
Write-Host "Server: $ServerInstance" -ForegroundColor Yellow
Write-Host ""

# Define the tables we need to check based on the seed script
$tablesToCheck = @(
    'Assessments',
    'Applications', 
    'BusinessDrivers',
    'Stakeholders',
    'CodeMetrics',
    'SecurityFindings',
    'DatabaseInstances',
    'SecurityVulnerabilities',
    'ComplianceFrameworks',
    'BudgetAllocations',
    'ProjectTimelineItems',
    'BusinessContextRisks',
    'ArchitectureReviews',
    'Recommendations',
    'InfrastructureServers',
    'DashboardMetrics',
    'DevelopmentPractices'
)

# Function to get table schema from database
function Get-TableSchema {
    param([string]$TableName)
    
    $query = @"
SELECT 
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.IS_NULLABLE,
    c.COLUMN_DEFAULT,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.NUMERIC_PRECISION,
    c.NUMERIC_SCALE,
    CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END AS IS_PRIMARY_KEY
FROM INFORMATION_SCHEMA.COLUMNS c
LEFT JOIN (
    SELECT ku.COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
    INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS ku
        ON tc.CONSTRAINT_TYPE = 'PRIMARY KEY' 
        AND tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
        AND ku.TABLE_NAME = '$TableName'
) pk ON c.COLUMN_NAME = pk.COLUMN_NAME
WHERE c.TABLE_NAME = '$TableName'
ORDER BY c.ORDINAL_POSITION
"@
    
    try {
        $result = sqlcmd -S $ServerInstance -d $DatabaseName -Q $query -h-1 -s"|" -W
        if ($LASTEXITCODE -eq 0) {
            return $result | Where-Object { $_.Trim() -ne "" }
        } else {
            Write-Warning "Failed to query schema for table $TableName"
            return $null
        }
    } catch {
        Write-Error "Error querying table $TableName`: $($_.Exception.Message)"
        return $null
    }
}

# Function to check if table exists
function Test-TableExists {
    param([string]$TableName)
    
    $query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '$TableName'"
    try {
        $result = sqlcmd -S $ServerInstance -d $DatabaseName -Q $query -h-1 -W
        return [int]$result.Trim() -gt 0
    } catch {
        return $false
    }
}

# Function to extract INSERT statement columns from seed script
function Get-SeedScriptColumns {
    param([string]$TableName)
    
    if (Test-Path $SeedScriptPath) {
        $content = Get-Content $SeedScriptPath -Raw
        
        # Look for INSERT INTO statements for the specific table
        $pattern = "INSERT INTO $TableName\s*\(\s*([^)]+)\)\s*VALUES"
        $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        
        if ($matches.Count -gt 0) {
            $columnsText = $matches[0].Groups[1].Value
            # Clean up the column list - remove brackets, quotes, and split by comma
            $columns = $columnsText -split ',' | ForEach-Object { 
                $_.Trim() -replace '\[|\]|`|"', '' 
            }
            return $columns
        }
    }
    return $null
}

# Main execution
Write-Host "Connecting to database and retrieving schemas..." -ForegroundColor Green
Write-Host ""

$schemaResults = @{}
$mismatches = @()

foreach ($table in $tablesToCheck) {
    Write-Host "Checking table: $table" -ForegroundColor Yellow
    
    # Check if table exists
    if (-not (Test-TableExists $table)) {
        Write-Host "  ❌ Table $table does NOT exist in database" -ForegroundColor Red
        $mismatches += [PSCustomObject]@{
            Table = $table
            Issue = "Table does not exist"
            DatabaseColumns = "N/A"
            SeedColumns = "N/A"
        }
        continue
    }
    
    # Get actual database schema
    $dbSchema = Get-TableSchema $table
    if ($dbSchema) {
        $dbColumns = @()
        foreach ($row in $dbSchema) {
            if ($row -and $row.Contains("|")) {
                $parts = $row.Split("|")
                if ($parts.Length -gt 0) {
                    $dbColumns += $parts[0].Trim()
                }
            }
        }
        
        # Get seed script columns
        $seedColumns = Get-SeedScriptColumns $table
        
        Write-Host "  ✅ Table exists with $($dbColumns.Count) columns" -ForegroundColor Green
        Write-Host "  Database columns: $($dbColumns -join ', ')" -ForegroundColor White
        
        if ($seedColumns) {
            Write-Host "  Seed script columns: $($seedColumns -join ', ')" -ForegroundColor Gray
            
            # Compare columns
            $missingInDb = $seedColumns | Where-Object { $_ -notin $dbColumns }
            $extraInDb = $dbColumns | Where-Object { $_ -notin $seedColumns -and $_ -ne 'Id' }
            
            if ($missingInDb) {
                Write-Host "  ❌ Columns in seed but NOT in database: $($missingInDb -join ', ')" -ForegroundColor Red
            }
            if ($extraInDb) {
                Write-Host "  ⚠️  Columns in database but NOT in seed: $($extraInDb -join ', ')" -ForegroundColor Orange
            }
            if (-not $missingInDb -and -not $extraInDb) {
                Write-Host "  ✅ Column match successful!" -ForegroundColor Green
            }
            
            # Store results for summary
            if ($missingInDb -or $extraInDb) {
                $mismatches += [PSCustomObject]@{
                    Table = $table
                    Issue = if ($missingInDb) { "Missing in DB: $($missingInDb -join ', ')" } else { "Extra in DB: $($extraInDb -join ', ')" }
                    DatabaseColumns = $dbColumns -join ', '
                    SeedColumns = $seedColumns -join ', '
                }
            }
        } else {
            Write-Host "  ⚠️  No INSERT statement found in seed script for this table" -ForegroundColor Orange
        }
        
        # Store schema for later use
        $schemaResults[$table] = @{
            DatabaseColumns = $dbColumns
            SeedColumns = $seedColumns
            Schema = $dbSchema
        }
    } else {
        Write-Host "  ❌ Failed to retrieve schema" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Generate summary report
Write-Host "=== SUMMARY REPORT ===" -ForegroundColor Cyan
Write-Host ""

if ($mismatches.Count -eq 0) {
    Write-Host "🎉 All table schemas match perfectly with the seed script!" -ForegroundColor Green
} else {
    Write-Host "Found $($mismatches.Count) schema mismatches:" -ForegroundColor Red
    Write-Host ""
    
    foreach ($mismatch in $mismatches) {
        Write-Host "Table: $($mismatch.Table)" -ForegroundColor Yellow
        Write-Host "Issue: $($mismatch.Issue)" -ForegroundColor Red
        Write-Host "DB Columns: $($mismatch.DatabaseColumns)" -ForegroundColor White
        Write-Host "Seed Columns: $($mismatch.SeedColumns)" -ForegroundColor Gray
        Write-Host "---"
    }
}

# Generate detailed schema output for problematic tables
Write-Host ""
Write-Host "=== DETAILED SCHEMA FOR PROBLEMATIC TABLES ===" -ForegroundColor Cyan

$problematicTables = @('CodeMetrics', 'DatabaseInstances', 'SecurityVulnerabilities', 'ComplianceFrameworks')

foreach ($table in $problematicTables) {
    if ($schemaResults[$table]) {
        Write-Host ""
        Write-Host "TABLE: $table" -ForegroundColor Yellow
        Write-Host "Actual Database Schema:" -ForegroundColor Green
        
        $schema = $schemaResults[$table].Schema
        foreach ($row in $schema) {
            if ($row -and $row.Contains("|")) {
                $parts = $row.Split("|")
                $columnName = $parts[0].Trim()
                $dataType = if($parts.Length -gt 1) { $parts[1].Trim() } else { "unknown" }
                $nullable = if($parts.Length -gt 2) { $parts[2].Trim() } else { "unknown" }
                $isPK = if($parts.Length -gt 7) { $parts[7].Trim() } else { "NO" }
                
                $pkIndicator = if ($isPK -eq "YES") { " (PK)" } else { "" }
                Write-Host "  - $columnName [$dataType] $(if($nullable -eq 'YES') {'NULL'} else {'NOT NULL'})$pkIndicator" -ForegroundColor White
            }
        }
        
        if ($schemaResults[$table].SeedColumns) {
            Write-Host "Seed Script Columns:" -ForegroundColor Red
            foreach ($col in $schemaResults[$table].SeedColumns) {
                Write-Host "  - $col" -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
Write-Host "=== CORRECTED INSERT STATEMENTS ===" -ForegroundColor Cyan
Write-Host "Based on actual database schema, here are the corrected INSERT statements:" -ForegroundColor Yellow
Write-Host ""

# Generate corrected INSERT statements for problematic tables
foreach ($table in $problematicTables) {
    if ($schemaResults[$table] -and $schemaResults[$table].DatabaseColumns) {
        $cols = $schemaResults[$table].DatabaseColumns | Where-Object { $_ -ne 'Id' }  # Exclude identity column
        Write-Host "-- $table" -ForegroundColor Green
        Write-Host "INSERT INTO $table (" -NoNewline -ForegroundColor White
        Write-Host ($cols -join ', ') -NoNewline -ForegroundColor Gray
        Write-Host ") VALUES" -ForegroundColor White
        Write-Host "-- (Your data values here...)" -ForegroundColor DarkGray
        Write-Host ""
    }
}

Write-Host "Script completed. Review the output above to fix your seed script." -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update your seed script with the corrected column names shown above" -ForegroundColor White
Write-Host "2. Remove any columns that don't exist in the database schema" -ForegroundColor White  
Write-Host "3. Add any missing columns that exist in the database but not in your seed script" -ForegroundColor White
Write-Host "4. Re-run your seed script to test the fixes" -ForegroundColor White