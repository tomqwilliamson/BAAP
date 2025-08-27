# PowerShell script to reset the database and trigger reseeding
# Run this script to clear existing data and get fresh seed data

param(
    [string]$ConnectionString = "Server=(localdb)\mssqllocaldb;Database=BaapDb;Trusted_Connection=true;"
)

Write-Host "🔄 Resetting BAAP Database..." -ForegroundColor Yellow

try {
    # Run the SQL script to clear data
    $sqlScript = Join-Path $PSScriptRoot "reset-and-seed-database.sql"
    
    if (Test-Path $sqlScript) {
        Write-Host "📂 Executing database reset script..." -ForegroundColor Cyan
        sqlcmd -S "(localdb)\mssqllocaldb" -d "BaapDb" -i $sqlScript -E
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database reset completed successfully!" -ForegroundColor Green
            Write-Host "💡 Next steps:" -ForegroundColor Yellow
            Write-Host "   1. Start the BAAP API application" -ForegroundColor White
            Write-Host "   2. The DataSeederService will automatically populate fresh data" -ForegroundColor White
            Write-Host "   3. Access Swagger UI at https://localhost:7001/swagger" -ForegroundColor White
        } else {
            throw "SQL script execution failed with exit code $LASTEXITCODE"
        }
    } else {
        throw "SQL script not found at: $sqlScript"
    }
} catch {
    Write-Host "❌ Error resetting database: $_" -ForegroundColor Red
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   - Ensure LocalDB is running: sqllocaldb start mssqllocaldb" -ForegroundColor White
    Write-Host "   - Ensure database exists: dotnet ef database update" -ForegroundColor White
    Write-Host "   - Check connection string is correct" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎯 Database is ready for fresh seed data!" -ForegroundColor Green