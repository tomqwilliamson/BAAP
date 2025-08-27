# PowerShell script to test both API and Static Web App deployments
param(
    [string]$ApiUrl = "https://baap-dev-api-wsnmnw.azurewebsites.net",
    [string]$WebAppUrl = "https://jolly-ocean-089232b0f.1.azurestaticapps.net"
)

Write-Host "🧪 Testing BAAP Deployment..." -ForegroundColor Yellow
Write-Host "📍 API URL: $ApiUrl" -ForegroundColor Cyan
Write-Host "📍 Web App URL: $WebAppUrl" -ForegroundColor Cyan
Write-Host ""

$apiTests = @(
    @{ Name = "Health Check"; Endpoint = "/api/configuration/health" },
    @{ Name = "Client Configuration"; Endpoint = "/api/configuration/client" },
    @{ Name = "Feature Flags"; Endpoint = "/api/configuration/features" },
    @{ Name = "Diagnostics"; Endpoint = "/api/configuration/diagnostics" }
)

$passed = 0
$failed = 0

# Test API endpoints
Write-Host "🔍 Testing API Endpoints..." -ForegroundColor Green
foreach ($test in $apiTests) {
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl$($test.Endpoint)" -Method Get -TimeoutSec 30
        Write-Host "  ✅ $($test.Name): OK" -ForegroundColor Green
        $passed++
    }
    catch {
        Write-Host "  ❌ $($test.Name): Failed - $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""

# Test Static Web App
Write-Host "🌐 Testing Static Web App..." -ForegroundColor Green
try {
    $webResponse = Invoke-WebRequest -Uri $WebAppUrl -Method Get -TimeoutSec 30
    if ($webResponse.StatusCode -eq 200) {
        Write-Host "  ✅ Web App: Loaded successfully" -ForegroundColor Green
        $passed++
        
        # Check if the HTML contains React app indicators
        if ($webResponse.Content -match "Application Design Lab Software") {
            Write-Host "  ✅ React App: Title found in HTML" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "  ❌ React App: Title not found in HTML" -ForegroundColor Red
            $failed++
        }
        
        # Check for JavaScript bundle
        if ($webResponse.Content -match "static/js/main\..*\.js") {
            Write-Host "  ✅ JavaScript Bundle: Found" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "  ❌ JavaScript Bundle: Not found" -ForegroundColor Red
            $failed++
        }
    } else {
        Write-Host "  ❌ Web App: HTTP $($webResponse.StatusCode)" -ForegroundColor Red
        $failed++
    }
}
catch {
    Write-Host "  ❌ Web App: Failed - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "📊 Test Results:" -ForegroundColor Yellow
Write-Host "  ✅ Passed: $passed" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "🎉 All tests passed! Your BAAP application is fully deployed and working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
    Write-Host "   • Web App: $WebAppUrl" -ForegroundColor White
    Write-Host "   • API Health: $ApiUrl/api/configuration/health" -ForegroundColor White
    Write-Host "   • API Docs: $ApiUrl/swagger (if enabled)" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Ready for use!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Please check the issues above." -ForegroundColor Yellow
    exit 1
}