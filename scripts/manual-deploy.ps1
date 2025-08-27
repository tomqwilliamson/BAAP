# Manual deployment script for Azure App Service
# Run this script to build and create a ZIP file for manual upload

param(
    [string]$AppName = "",
    [string]$ResourceGroup = ""
)

Write-Host "🚀 Building BAAP API for manual deployment..." -ForegroundColor Yellow

try {
    # Clean and build
    Write-Host "📦 Building application..." -ForegroundColor Cyan
    dotnet clean BAAP.sln
    dotnet restore BAAP.sln
    dotnet build BAAP.sln --configuration Release
    
    # Run tests
    Write-Host "🧪 Running tests..." -ForegroundColor Cyan
    dotnet test BAAP.sln --configuration Release --verbosity minimal
    
    # Publish
    Write-Host "📋 Publishing application..." -ForegroundColor Cyan
    $publishPath = ".\publish"
    if (Test-Path $publishPath) {
        Remove-Item $publishPath -Recurse -Force
    }
    
    dotnet publish BAAP.API/BAAP.API.csproj --configuration Release --output $publishPath
    
    # Create ZIP file
    Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan
    $zipPath = ".\BAAP-API-Deploy.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path "$publishPath\*" -DestinationPath $zipPath
    
    Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
    Write-Host "📁 ZIP file location: $zipPath" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Azure Portal → Your App Service" -ForegroundColor White
    Write-Host "2. Navigate to Deployment Center → ZIP Deploy" -ForegroundColor White
    Write-Host "3. Upload the ZIP file: $zipPath" -ForegroundColor White
    Write-Host "4. Click Deploy and wait for completion" -ForegroundColor White
    Write-Host ""
    
    if ($AppName -and $ResourceGroup) {
        Write-Host "🔧 Alternative: Deploy via Azure CLI (if logged in):" -ForegroundColor Yellow
        Write-Host "az webapp deployment source config-zip --resource-group $ResourceGroup --name $AppName --src $zipPath" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error during build/deployment: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Build completed successfully!" -ForegroundColor Green