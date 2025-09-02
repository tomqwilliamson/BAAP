# BAAP Development Environment Setup Script
# This script sets up the development environment with database seeding

param(
    [switch]$ResetData = $false,
    [switch]$UseAzureSQL = $false,
    [string]$ConnectionString = ""
)

Write-Host "🚀 BAAP Development Environment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if running in correct directory
function Test-BaapDirectory {
    if (!(Test-Path "BAAP.sln")) {
        Write-Error "Please run this script from the BAAP root directory (where BAAP.sln is located)"
        exit 1
    }
}

# Function to test SQL Server Express connection
function Test-SqlServerExpress {
    Write-Host "Testing SQL Server Express connection..." -ForegroundColor Gray
    
    try {
        # Test if SQL Server Express is running
        $service = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
        if (!$service) {
            Write-Warning "SQL Server Express service not found. Please ensure SQL Server Express is installed."
            Write-Host "Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads" -ForegroundColor Cyan
            return
        }
        
        if ($service.Status -ne "Running") {
            Write-Host "Starting SQL Server Express service..." -ForegroundColor Yellow
            Start-Service -Name "MSSQL`$SQLEXPRESS"
            Start-Sleep -Seconds 5
        }
        
        # Test connection using sqlcmd if available
        $sqlcmdTest = sqlcmd -S "localhost\SQLEXPRESS" -Q "SELECT 1 AS Test" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ SQL Server Express connection successful" -ForegroundColor Green
        } else {
            Write-Warning "Could not connect to SQL Server Express. The database operations may fail."
            Write-Host "Please verify SQL Server Express is installed and running" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Warning "Could not verify SQL Server Express status: $($_.Exception.Message)"
    }
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    # Install .NET dependencies
    Write-Host "Installing .NET API dependencies..." -ForegroundColor Gray
    Set-Location "BAAP.API"
    dotnet restore
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to restore .NET dependencies"
        exit 1
    }
    Set-Location ".."
    
    # Install React dependencies
    Write-Host "Installing React frontend dependencies..." -ForegroundColor Gray
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install React dependencies"
            exit 1
        }
    }
    
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Function to setup database
function Setup-Database {
    param(
        [bool]$ResetData,
        [bool]$UseAzure,
        [string]$AzureConnectionString
    )
    
    Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
    
    Set-Location "BAAP.API"
    
    if ($UseAzure -and $AzureConnectionString) {
        Write-Host "Using Azure SQL Database..." -ForegroundColor Gray
        # Update appsettings.Development.json with Azure connection string
        $appSettings = Get-Content "appsettings.Development.json" | ConvertFrom-Json
        $appSettings.ConnectionStrings.DefaultConnection = $AzureConnectionString
        $appSettings | ConvertTo-Json -Depth 10 | Set-Content "appsettings.Development.json"
    } else {
        Write-Host "Using SQL Server Express (localhost\SQLEXPRESS) for development..." -ForegroundColor Gray
        Test-SqlServerExpress
    }
    
    if ($ResetData) {
        Write-Host "Resetting database..." -ForegroundColor Red
        if (Test-Path "baap.db") {
            Remove-Item "baap.db" -Force
        }
        Remove-Item -Path "Migrations" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Check if migrations exist
    if (!(Test-Path "Migrations")) {
        Write-Host "Creating initial migration..." -ForegroundColor Gray
        dotnet ef migrations add InitialCreate
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create migration"
            exit 1
        }
    }
    
    # Update database
    Write-Host "Updating database schema..." -ForegroundColor Gray
    dotnet ef database update
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to update database"
        exit 1
    }
    
    Set-Location ".."
    Write-Host "✅ Database setup completed" -ForegroundColor Green
}

# Function to seed data
function Seed-Data {
    Write-Host "🌱 Seeding database with mock data..." -ForegroundColor Yellow
    
    Set-Location "BAAP.API"
    
    # Build the project first
    Write-Host "Building API project..." -ForegroundColor Gray
    dotnet build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build API project"
        exit 1
    }
    
    # Run the application to trigger seeding (it will seed data automatically in development)
    Write-Host "Database will be seeded when you start the application in development mode" -ForegroundColor Gray
    
    Set-Location ".."
    Write-Host "✅ Data seeding configuration completed" -ForegroundColor Green
}

# Function to run SQL seeding script manually
function Run-SqlSeedingScript {
    Write-Host "📄 Running SQL seeding script..." -ForegroundColor Yellow
    
    $sqlScript = "BAAP.API/Migrations/20250825000001_SeedMockData.sql"
    if (Test-Path $sqlScript) {
        if ($UseAzureSQL -and $ConnectionString) {
            Write-Host "Running SQL script against Azure SQL..." -ForegroundColor Gray
            # Use sqlcmd for Azure SQL
            try {
                sqlcmd -S $($ConnectionString -split ';')[0].Split('=')[1] -d $($ConnectionString -split ';' | Where-Object { $_ -like "*Initial Catalog*" }).Split('=')[1] -i $sqlScript
                Write-Host "✅ SQL script executed successfully" -ForegroundColor Green
            } catch {
                Write-Warning "Could not run SQL script automatically. Please run it manually:"
                Write-Host $sqlScript -ForegroundColor Cyan
            }
        } else {
            Write-Host "For SQLite, data will be seeded through the application startup" -ForegroundColor Gray
        }
    } else {
        Write-Warning "SQL seeding script not found at $sqlScript"
    }
}

# Function to create development configuration
function Create-DevConfig {
    Write-Host "⚙️  Creating development configuration..." -ForegroundColor Yellow
    
    $envContent = @"
# BAAP Development Environment Variables
REACT_APP_USE_API=true
REACT_APP_API_BASE_URL=https://localhost:7001/api
REACT_APP_ENVIRONMENT=development

# Database Configuration
DATABASE_TYPE=sqlserver
DATABASE_SERVER=localhost\SQLEXPRESS
# For Azure SQL, uncomment and configure:
# DATABASE_TYPE=azuresql
# CONNECTION_STRING=your_azure_sql_connection_string

# Authentication Configuration
USE_AZURE_B2C=false
# For Azure B2C, uncomment and configure:
# USE_AZURE_B2C=true
# AZURE_AD_INSTANCE=https://your-tenant.b2clogin.com
# AZURE_AD_CLIENT_ID=your-client-id
# AZURE_AD_TENANT_ID=your-tenant-id
"@
    
    $envContent | Out-File -FilePath ".env.development" -Encoding UTF8
    
    # Update React package.json scripts if needed
    if (Test-Path "package.json") {
        Write-Host "Development environment file created: .env.development" -ForegroundColor Gray
    }
    
    Write-Host "✅ Development configuration created" -ForegroundColor Green
}

# Function to start development servers
function Start-DevServers {
    param([switch]$StartNow)
    
    if ($StartNow) {
        Write-Host "🚀 Starting development servers..." -ForegroundColor Yellow
        
        # Start API in background
        Write-Host "Starting .NET API (background)..." -ForegroundColor Gray
        Start-Process powershell -ArgumentList "-Command", "cd 'BAAP.API'; dotnet run" -WindowStyle Minimized
        
        Start-Sleep -Seconds 3
        
        # Start React frontend
        Write-Host "Starting React frontend..." -ForegroundColor Gray
        npm start
    } else {
        Write-Host "" -ForegroundColor White
        Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
        Write-Host "To start the development servers, run:" -ForegroundColor White
        Write-Host "  1. API Server:      cd BAAP.API && dotnet run" -ForegroundColor Gray
        Write-Host "  2. React Frontend:  npm start" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Or use: .\setup-dev-environment.ps1 -StartNow" -ForegroundColor Cyan
    }
}

# Main execution
try {
    Test-BaapDirectory
    
    Write-Host "Configuration:" -ForegroundColor White
    Write-Host "  Reset Data: $ResetData" -ForegroundColor Gray
    Write-Host "  Use Azure SQL: $UseAzureSQL" -ForegroundColor Gray
    if ($ConnectionString) {
        Write-Host "  Connection String: [PROVIDED]" -ForegroundColor Gray
    }
    Write-Host ""
    
    Install-Dependencies
    Setup-Database -ResetData $ResetData -UseAzure $UseAzureSQL -AzureConnectionString $ConnectionString
    
    if ($UseAzureSQL -and $ConnectionString) {
        Run-SqlSeedingScript
    } else {
        Seed-Data
    }
    
    Create-DevConfig
    
    Write-Host ""
    Write-Host "🎉 Development environment setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Mock data includes:" -ForegroundColor White
    Write-Host "  • 3 sample assessments" -ForegroundColor Gray
    Write-Host "  • 8 sample applications" -ForegroundColor Gray
    Write-Host "  • 10 security findings" -ForegroundColor Gray
    Write-Host "  • 6 business drivers" -ForegroundColor Gray
    Write-Host "  • 8 stakeholders" -ForegroundColor Gray
    Write-Host "  • 10 recommendations" -ForegroundColor Gray
    Write-Host ""
    
    Start-DevServers
    
} catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
}

Write-Host "✨ Setup completed successfully! Happy coding! ✨" -ForegroundColor Magenta