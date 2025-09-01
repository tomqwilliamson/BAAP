# PowerShell script to apply supplemental seed data to Azure SQL Database
# Uses Azure Active Directory authentication

$ServerName = "baap-dev-sql-wsnmnw.database.windows.net"
$DatabaseName = "baap_dev"
$SqlFile = "azure_supplement_seed_data.sql"

Write-Host "Connecting to Azure SQL Database: $DatabaseName on $ServerName"
Write-Host "Applying supplemental seed data..."

try {
    # Use sqlcmd with Azure AD authentication
    $result = & sqlcmd -S $ServerName -d $DatabaseName -G -i $SqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully applied supplemental seed data to Azure database"
        Write-Host $result
    } else {
        Write-Host "❌ Failed to apply seed data. Exit code: $LASTEXITCODE"
        Write-Host $result
    }
} catch {
    Write-Host "❌ Error executing sqlcmd: $($_.Exception.Message)"
    Write-Host "Please ensure you're logged into Azure and have SQL database permissions"
}

Write-Host "Script completed."