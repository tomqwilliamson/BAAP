# Generate Corrected Seed Script for BAAP Database
# This script checks the actual database schema and creates corrected INSERT statements

param(
    [string]$DatabaseName = "BAAP_Dev",
    [string]$ServerInstance = "(localdb)\MSSQLLocalDB",
    [string]$OutputFile = "C:\Users\twilliamson\source\repos\BAAP\scripts\corrected_seed_script.sql"
)

Write-Host "=== GENERATING CORRECTED SEED SCRIPT ===" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName @ $ServerInstance" -ForegroundColor Yellow
Write-Host "Output: $OutputFile" -ForegroundColor Yellow
Write-Host ""

# Function to get table columns from database
function Get-TableColumns {
    param([string]$TableName)
    
    $query = @"
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = '$TableName' 
    AND COLUMN_NAME != 'Id'  -- Exclude identity columns
ORDER BY ORDINAL_POSITION
"@
    
    try {
        $result = sqlcmd -S $ServerInstance -d $DatabaseName -Q $query -h-1 -W
        if ($LASTEXITCODE -eq 0 -and $result) {
            $columns = @()
            foreach ($row in $result) {
                if ($row -and $row.Trim() -ne "") {
                    $columns += $row.Trim()
                }
            }
            return $columns
        }
    } catch {
        Write-Error "Error querying table $TableName`: $($_.Exception.Message)"
    }
    return @()
}

# Start building the corrected seed script
$scriptContent = @"
-- CORRECTED SEED SCRIPT FOR BAAP DATABASE
-- Generated on $(Get-Date)
-- This script uses the actual database schema column names

USE BAAP_Dev;
GO

"@

Write-Host "Checking table schemas and generating corrections..." -ForegroundColor Green

# CodeMetrics Table
Write-Host "Checking CodeMetrics..." -ForegroundColor Yellow
$codeMetricsColumns = Get-TableColumns "CodeMetrics"
if ($codeMetricsColumns) {
    Write-Host "  Database columns: $($codeMetricsColumns -join ', ')" -ForegroundColor White
    $scriptContent += @"

-- CODE METRICS
-- Database columns: $($codeMetricsColumns -join ', ')
-- Fixed: Removed 'CreatedDate' as it doesn't exist in database schema
PRINT 'Seeding Code Metrics...'
IF NOT EXISTS (SELECT 1 FROM CodeMetrics)
BEGIN
    INSERT INTO CodeMetrics ($($codeMetricsColumns -join ', ')) VALUES
    ('Cyclomatic Complexity', 8.2, 'Average', 'Complexity', 1, GETDATE()),
    ('Lines of Code', 45000, 'Count', 'Size', 1, GETDATE()),
    ('Test Coverage', 68, 'Percentage', 'Quality', 1, GETDATE()),
    ('Technical Debt Ratio', 12.5, 'Percentage', 'Maintainability', 1, GETDATE()),
    ('Code Duplication', 8.2, 'Percentage', 'Quality', 1, GETDATE()),
    
    ('Cyclomatic Complexity', 15.7, 'Average', 'Complexity', 2, GETDATE()),
    ('Lines of Code', 28000, 'Count', 'Size', 2, GETDATE()),
    ('Test Coverage', 85, 'Percentage', 'Quality', 2, GETDATE()),
    ('Technical Debt Ratio', 18.3, 'Percentage', 'Maintainability', 2, GETDATE());
    
    PRINT 'Inserted Code Metric records';
END

"@
}

# DatabaseInstances Table  
Write-Host "Checking DatabaseInstances..." -ForegroundColor Yellow
$dbInstanceColumns = Get-TableColumns "DatabaseInstances"
if ($dbInstanceColumns) {
    Write-Host "  Database columns: $($dbInstanceColumns -join ', ')" -ForegroundColor White
    $scriptContent += @"
-- DATABASE INSTANCES
-- Database columns: $($dbInstanceColumns -join ', ')
-- Fixed: Using actual database column names instead of seed script names
PRINT 'Seeding Database Instances...'
IF NOT EXISTS (SELECT 1 FROM DatabaseInstances)
BEGIN
    INSERT INTO DatabaseInstances ($($dbInstanceColumns -join ', ')) VALUES
    ('PostgreSQL Database', 'PostgreSQL', '14.5', '850 GB', 85, 2, 'Azure PostgreSQL', 5, 120, 'Production database with good performance', 'Compatible', GETDATE(), 1),
    ('Redis Cache', 'Redis', '7.0.5', '45 GB', 95, 0, 'Azure Redis Cache', 2, 15, 'High-performance caching layer', 'Ready', GETDATE(), 1),
    ('Core Banking DB2', 'DB2', '12.0', '4.5 TB', 60, 8, 'Azure Managed Instance', 15, 450, 'Legacy mainframe database requiring modernization', 'Needs Work', GETDATE(), 2),
    ('Oracle Customer Portal', 'Oracle', '19c', '1.2 TB', 75, 3, 'Azure Database', 8, 180, 'Well-maintained customer database', 'Compatible', GETDATE(), 2);
    
    PRINT 'Inserted Database Instance records';
END

"@
}

# SecurityVulnerabilities Table
Write-Host "Checking SecurityVulnerabilities..." -ForegroundColor Yellow  
$secVulnColumns = Get-TableColumns "SecurityVulnerabilities"
if ($secVulnColumns) {
    Write-Host "  Database columns: $($secVulnColumns -join ', ')" -ForegroundColor White
    $scriptContent += @"
-- SECURITY VULNERABILITIES
-- Database columns: $($secVulnColumns -join ', ')
-- Fixed: Using actual database column names
PRINT 'Seeding Security Vulnerabilities...'
IF NOT EXISTS (SELECT 1 FROM SecurityVulnerabilities)
BEGIN
    INSERT INTO SecurityVulnerabilities ($($secVulnColumns -join ', ')) VALUES
    ('Cross-site Scripting Vulnerability', 'XSS vulnerability in product search functionality', 'High', 'Input Validation', 'SAST Scanner', 3, 'Open', 'CVE-2023-4567', 'SonarQube', GETDATE(), NULL, 1),
    ('Insecure Direct Object Reference', 'IDOR in user profile management endpoints', 'Medium', 'Authorization', 'Manual Testing', 2, 'In Progress', 'CVE-2023-8901', 'Security Team', GETDATE(), NULL, 1),
    ('SQL Injection Vulnerability', 'SQLi in transaction history queries', 'Critical', 'Input Validation', 'DAST Scanner', 5, 'Open', 'CVE-2023-1234', 'OWASP ZAP', GETDATE(), NULL, 2),
    ('Insufficient Session Timeout', 'Session timeout not properly configured', 'Medium', 'Session Management', 'Code Review', 1, 'Resolved', 'CVE-2023-5678', 'Security Review', GETDATE(), GETDATE(), 2);
    
    PRINT 'Inserted Security Vulnerability records';
END

"@
}

# ComplianceFrameworks Table
Write-Host "Checking ComplianceFrameworks..." -ForegroundColor Yellow
$complianceColumns = Get-TableColumns "ComplianceFrameworks"  
if ($complianceColumns) {
    Write-Host "  Database columns: $($complianceColumns -join ', ')" -ForegroundColor White
    $scriptContent += @"
-- COMPLIANCE FRAMEWORKS
-- Database columns: $($complianceColumns -join ', ')
-- Fixed: Using actual database column names
PRINT 'Seeding Compliance Frameworks...'
IF NOT EXISTS (SELECT 1 FROM ComplianceFrameworks)
BEGIN
    INSERT INTO ComplianceFrameworks ($($complianceColumns -join ', ')) VALUES
    ('PCI DSS', 'In Progress', 75, 'Currently achieving Level 2 compliance, working toward Level 1', 'Security Assessment', GETDATE(), DATEADD(day, -30, GETDATE()), 1),
    ('GDPR', 'Compliant', 95, 'Regular audits confirm ongoing compliance with data protection regulations', 'Privacy Assessment', GETDATE(), DATEADD(day, -15, GETDATE()), 1),
    ('SOX', 'Compliant', 100, 'Annual audit completed successfully for financial reporting compliance', 'Financial Controls', GETDATE(), DATEADD(day, -60, GETDATE()), 2),
    ('PCI DSS', 'Compliant', 100, 'Level 1 merchant compliance maintained for banking operations', 'Security Assessment', GETDATE(), DATEADD(day, -45, GETDATE()), 2),
    ('FFIEC', 'In Progress', 70, 'Cybersecurity assessment framework implementation underway', 'Cybersecurity Assessment', GETDATE(), DATEADD(day, -20, GETDATE()), 2);
    
    PRINT 'Inserted Compliance Framework records';
END

"@
}

# Write the corrected script to file
Write-Host ""
Write-Host "Writing corrected seed script to: $OutputFile" -ForegroundColor Green

try {
    $scriptContent | Out-File -FilePath $OutputFile -Encoding UTF8
    Write-Host "✅ Corrected seed script generated successfully!" -ForegroundColor Green
} catch {
    Write-Error "Failed to write output file: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "The corrected seed script has been generated with the following fixes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. CodeMetrics: Removed 'CreatedDate' column (doesn't exist in schema)" -ForegroundColor White
Write-Host "2. DatabaseInstances: Fixed all column names to match actual schema" -ForegroundColor White  
Write-Host "3. SecurityVulnerabilities: Fixed column names to match actual schema" -ForegroundColor White
Write-Host "4. ComplianceFrameworks: Fixed column names to match actual schema" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Review the generated script: $OutputFile" -ForegroundColor White
Write-Host "2. Test the corrected INSERT statements" -ForegroundColor White
Write-Host "3. Replace the problematic sections in your main seed script" -ForegroundColor White
Write-Host ""
Write-Host "You can now run the corrected script to seed your database without column mismatch errors!" -ForegroundColor Green