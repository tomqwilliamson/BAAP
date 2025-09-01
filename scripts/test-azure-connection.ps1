# Test Azure SQL Connection
param(
    [string]$ServerName = "baap-dev-sql-wsnmnw.database.windows.net",
    [string]$DatabaseName = "baap_dev", 
    [string]$Username = "baapadmin",
    [string]$Password = "YourSecurePassword123!"
)

Write-Host "Testing Azure SQL connection..." -ForegroundColor Cyan
Write-Host "Server: $ServerName" -ForegroundColor Yellow
Write-Host "Database: $DatabaseName" -ForegroundColor Yellow
Write-Host "Username: $Username" -ForegroundColor Yellow

try {
    $result = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q "SELECT DB_NAME() as CurrentDB" -h -1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
        Write-Host "Connected to database: $($result.Trim())" -ForegroundColor White
        
        # Test table count
        $tableCount = & sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'" -h -1
        Write-Host "Tables in database: $($tableCount.Trim())" -ForegroundColor White
    } else {
        Write-Host "❌ Connection failed" -ForegroundColor Red
        Write-Host "Output: $result" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Connection error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Server name and database name are correct" -ForegroundColor White
    Write-Host "2. Username and password are correct" -ForegroundColor White
    Write-Host "3. Your IP is whitelisted in Azure SQL firewall" -ForegroundColor White
    Write-Host "4. The database exists and is accessible" -ForegroundColor White
}