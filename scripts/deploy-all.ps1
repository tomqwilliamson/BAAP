# Complete deployment script for both API and React UI
# This script deploys both the BAAP API and React frontend to Azure

param(
    [string]$ApiAppName = "baap-dev-api-wsnmnw",
    [string]$ResourceGroup = "rg-baap-dev",
    [string]$StaticWebAppName = "baap-dev-web-wsnmnw"
)

Write-Host "🚀 Starting complete BAAP deployment (API + UI)..." -ForegroundColor Yellow
Write-Host ""

try {
    # Step 1: Build and Deploy API
    Write-Host "📦 STEP 1: Building and deploying API..." -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    # Clean and build API
    Write-Host "🧹 Cleaning and building API..." -ForegroundColor White
    dotnet clean BAAP.sln
    dotnet restore BAAP.sln
    dotnet build BAAP.sln --configuration Release
    
    # Run API tests
    Write-Host "🧪 Running API tests..." -ForegroundColor White
    dotnet test BAAP.sln --configuration Release --verbosity minimal
    
    # Publish API
    Write-Host "📋 Publishing API..." -ForegroundColor White
    $publishPath = ".\publish-api"
    if (Test-Path $publishPath) {
        Remove-Item $publishPath -Recurse -Force
    }
    
    dotnet publish BAAP.API/BAAP.API.csproj --configuration Release --output $publishPath
    
    # Create API ZIP file
    Write-Host "📦 Creating API deployment package..." -ForegroundColor White
    $apiZipPath = ".\BAAP-API-Deploy.zip"
    if (Test-Path $apiZipPath) {
        Remove-Item $apiZipPath -Force
    }
    
    Compress-Archive -Path "$publishPath\*" -DestinationPath $apiZipPath
    
    # Deploy API to Azure
    Write-Host "🌐 Deploying API to Azure App Service..." -ForegroundColor White
    az webapp deployment source config-zip --resource-group $ResourceGroup --name $ApiAppName --src $apiZipPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ API deployment completed successfully!" -ForegroundColor Green
    } else {
        throw "API deployment failed"
    }
    
    Write-Host ""
    
    # Step 2: Build and Deploy React UI
    Write-Host "🎨 STEP 2: Building and deploying React UI..." -ForegroundColor Cyan
    Write-Host "--------------------------------------------" -ForegroundColor Gray
    
    # Build React app
    Write-Host "⚛️  Building React application..." -ForegroundColor White
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "React build failed"
    }
    
    # Deploy to Static Web App
    Write-Host "🌐 Deploying React app to Azure Static Web App..." -ForegroundColor White
    npx swa deploy --resource-group $ResourceGroup --app-name $StaticWebAppName --app-location "./build" --no-use-keychain
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ React UI deployment completed successfully!" -ForegroundColor Green
    } else {
        throw "React UI deployment failed"
    }
    
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETE! 🎉" -ForegroundColor Green
    Write-Host "=========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Your deployed application:" -ForegroundColor Yellow
    Write-Host "   Frontend: https://jolly-ocean-089232b0f.1.azurestaticapps.net" -ForegroundColor White
    Write-Host "   API:      https://$ApiAppName.azurewebsites.net" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 What was deployed:" -ForegroundColor Yellow
    Write-Host "   ✅ New database models (Infrastructure, Database, Security, Compliance)" -ForegroundColor White
    Write-Host "   ✅ Database migration with 4 new tables" -ForegroundColor White
    Write-Host "   ✅ Data seeding for realistic sample data" -ForegroundColor White
    Write-Host "   ✅ Fixed UI components (Data Governance, Infrastructure, Security)" -ForegroundColor White
    Write-Host "   ✅ Enhanced recommendations with business case data" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 The application will automatically:" -ForegroundColor Yellow
    Write-Host "   • Apply database migrations on startup" -ForegroundColor White
    Write-Host "   • Seed detailed assessment data (in development)" -ForegroundColor White
    Write-Host "   • Display rich, persistent data in all components" -ForegroundColor White
    Write-Host ""
    
    # Cleanup
    Write-Host "🧹 Cleaning up deployment files..." -ForegroundColor White
    if (Test-Path $publishPath) {
        Remove-Item $publishPath -Recurse -Force
    }
    if (Test-Path $apiZipPath) {
        Remove-Item $apiZipPath -Force
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Ensure you're logged into Azure CLI: az login" -ForegroundColor White
    Write-Host "   2. Check your Azure resource names and permissions" -ForegroundColor White
    Write-Host "   3. Verify your React app builds locally: npm run build" -ForegroundColor White
    Write-Host "   4. Check API builds locally: dotnet build BAAP.sln" -ForegroundColor White
    exit 1
}

Write-Host "🚀 Deployment script completed successfully!" -ForegroundColor Green