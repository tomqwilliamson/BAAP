# PowerShell script to manually deploy React app to Azure Static Web App
param(
    [string]$StaticWebAppName = "baap-dev-web-wsnmnw",
    [string]$ResourceGroup = "rg-baap-dev",
    [string]$ApiBaseUrl = "https://baap-dev-api-wsnmnw.azurewebsites.net/api"
)

Write-Host "🚀 Building and deploying BAAP React App..." -ForegroundColor Yellow
Write-Host "📍 Static Web App: $StaticWebAppName" -ForegroundColor Cyan
Write-Host "📍 API Base URL: $ApiBaseUrl" -ForegroundColor Cyan

try {
    # Set environment variable for production API
    $env:REACT_APP_API_BASE_URL = $ApiBaseUrl
    Write-Host "✅ Set REACT_APP_API_BASE_URL=$ApiBaseUrl" -ForegroundColor Green

    # Clean previous builds
    Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Cyan
    if (Test-Path "build") {
        Remove-Item "build" -Recurse -Force
        Write-Host "   Removed existing build folder" -ForegroundColor Gray
    }

    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
    }

    # Build the React app for production
    Write-Host "🏗️ Building React application..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed"
    }

    # Verify build folder exists
    if (-not (Test-Path "build")) {
        throw "Build folder was not created"
    }

    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📁 Build folder size: $((Get-ChildItem -Path "build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB) MB" -ForegroundColor White

    # Deploy to Azure Static Web App
    Write-Host "🚀 Deploying to Azure Static Web App..." -ForegroundColor Cyan
    
    # Get deployment token
    $deploymentToken = az staticwebapp secrets list --resource-group $ResourceGroup --name $StaticWebAppName --query "properties.apiKey" --output tsv
    
    if ([string]::IsNullOrEmpty($deploymentToken)) {
        throw "Failed to get deployment token from Azure"
    }

    Write-Host "🔑 Retrieved deployment token" -ForegroundColor Gray
    
    # Deploy using SWA CLI (if available) or fallback to ZIP upload
    if (Get-Command "swa" -ErrorAction SilentlyContinue) {
        Write-Host "📤 Deploying with SWA CLI..." -ForegroundColor Cyan
        swa deploy --app-location "." --output-location "build" --deployment-token $deploymentToken
        
        if ($LASTEXITCODE -ne 0) {
            throw "SWA CLI deployment failed"
        }
    } else {
        Write-Host "⚠️ SWA CLI not found, using alternative deployment method..." -ForegroundColor Yellow
        
        # Create deployment package
        $zipPath = ".\build-deploy.zip"
        if (Test-Path $zipPath) {
            Remove-Item $zipPath -Force
        }
        
        Compress-Archive -Path ".\build\*" -DestinationPath $zipPath
        Write-Host "📦 Created deployment package: $zipPath" -ForegroundColor Gray
        
        Write-Host "📋 Manual deployment required:" -ForegroundColor Yellow
        Write-Host "1. Go to Azure Portal → Static Web Apps → $StaticWebAppName" -ForegroundColor White
        Write-Host "2. Go to 'Deployment' section" -ForegroundColor White
        Write-Host "3. Upload the ZIP file: $zipPath" -ForegroundColor White
        Write-Host "4. Wait for deployment to complete" -ForegroundColor White
        
        Write-Host ""
        Write-Host "🔧 Alternative: Use Azure CLI (experimental):" -ForegroundColor Yellow
        Write-Host "az rest --method PUT --url 'https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/$ResourceGroup/providers/Microsoft.Web/staticSites/$StaticWebAppName/zipDeploy' --body '@$zipPath'" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "✅ Deployment process completed!" -ForegroundColor Green
    Write-Host "🌐 Your app will be available at: https://jolly-ocean-089232b0f.1.azurestaticapps.net" -ForegroundColor Cyan
    Write-Host "📡 API Base URL configured: $ApiBaseUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 Next steps:" -ForegroundColor Yellow
    Write-Host "- Check deployment status in Azure Portal" -ForegroundColor White
    Write-Host "- Test the live application" -ForegroundColor White
    Write-Host "- Verify API connectivity" -ForegroundColor White

} catch {
    Write-Host "❌ Error during deployment: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "- Ensure you're logged into Azure CLI: az login" -ForegroundColor White
    Write-Host "- Check Node.js and npm are installed" -ForegroundColor White
    Write-Host "- Verify resource names are correct" -ForegroundColor White
    Write-Host "- Check Azure permissions for Static Web Apps" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎯 Deployment script completed!" -ForegroundColor Green