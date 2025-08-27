# SQL Server Express Connection Test Script
# Run this script to verify SQL Server Express is properly configured

Write-Host "🔍 SQL Server Express Connection Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Test 1: Check if SQL Server Express service exists
Write-Host "1. Checking SQL Server Express service..." -ForegroundColor Yellow
$service = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue

if (!$service) {
    Write-Host "❌ SQL Server Express service not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install SQL Server Express:" -ForegroundColor White
    Write-Host "1. Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads" -ForegroundColor Cyan
    Write-Host "2. Select 'Express' edition" -ForegroundColor Gray
    Write-Host "3. Choose 'Basic' installation" -ForegroundColor Gray
    Write-Host "4. After installation, restart this script" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ SQL Server Express service found: $($service.Status)" -ForegroundColor Green

# Test 2: Start service if not running
if ($service.Status -ne "Running") {
    Write-Host "2. Starting SQL Server Express service..." -ForegroundColor Yellow
    try {
        Start-Service -Name "MSSQL`$SQLEXPRESS"
        Start-Sleep -Seconds 5
        Write-Host "✅ SQL Server Express service started" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to start SQL Server Express: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please start the service manually or restart your computer" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ SQL Server Express service is already running" -ForegroundColor Green
}

# Test 3: Test connection using .NET SqlConnection
Write-Host "3. Testing database connection..." -ForegroundColor Yellow
$connectionString = "Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=true;TrustServerCertificate=true"

try {
    Add-Type -AssemblyName System.Data
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT @@VERSION"
    $version = $command.ExecuteScalar()
    
    $connection.Close()
    
    Write-Host "✅ Database connection successful" -ForegroundColor Green
    Write-Host "SQL Server Version: $($version.Split("`n")[0])" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor White
    Write-Host "1. Verify SQL Server Express is installed with instance name 'SQLEXPRESS'" -ForegroundColor Gray
    Write-Host "2. Check Windows Firewall settings" -ForegroundColor Gray
    Write-Host "3. Ensure your user account has access to SQL Server" -ForegroundColor Gray
    Write-Host "4. Try connecting with SQL Server Management Studio first" -ForegroundColor Gray
    exit 1
}

# Test 4: Check if database exists and test EF Core tools
Write-Host "4. Checking Entity Framework Core tools..." -ForegroundColor Yellow
Set-Location "BAAP.API" -ErrorAction SilentlyContinue

if (!(Test-Path "BAAP.API.csproj")) {
    Write-Host "⚠️  Not in BAAP.API directory, skipping EF Core test" -ForegroundColor Yellow
} else {
    try {
        $efTest = dotnet ef --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Entity Framework Core tools available" -ForegroundColor Green
            Write-Host "EF Version: $($efTest)" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  Entity Framework Core tools not found" -ForegroundColor Yellow
            Write-Host "Installing EF Core tools..." -ForegroundColor Gray
            dotnet tool install --global dotnet-ef
        }
    }
    catch {
        Write-Host "⚠️  Could not verify Entity Framework Core tools" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 SQL Server Express is ready for BAAP development!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Run: .\setup-dev-environment.ps1" -ForegroundColor Cyan
Write-Host "2. This will create the BAAP_Dev database and seed it with data" -ForegroundColor Gray
Write-Host "3. Start the application: cd BAAP.API && dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "Connection String: Server=localhost\SQLEXPRESS;Database=BAAP_Dev;Trusted_Connection=true" -ForegroundColor Gray