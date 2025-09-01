# PowerShell script to apply Azure SQL seed data using REST API
param(
    [string]$SubscriptionId = (az account show --query id -o tsv),
    [string]$ResourceGroup = "rg-baap-dev",
    [string]$ServerName = "baap-dev-sql-wsnmnw",
    [string]$DatabaseName = "baap_dev"
)

Write-Host "🔄 Getting Azure access token..."
$tokenResult = az account get-access-token --resource https://management.azure.com/ | ConvertFrom-Json
$accessToken = $tokenResult.accessToken

if (-not $accessToken) {
    Write-Host "❌ Failed to get access token"
    exit 1
}

Write-Host "✅ Got access token"

# Test query first
$testQuery = "SELECT COUNT(*) as CurrentTimelineCount FROM ProjectTimelineItems"
$uri = "https://management.azure.com/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Sql/servers/$ServerName/databases/$DatabaseName/query?api-version=2020-11-01-preview"

$headers = @{
    'Authorization' = "Bearer $accessToken"
    'Content-Type' = 'application/json'
}

$body = @{
    query = $testQuery
} | ConvertTo-Json

Write-Host "🔄 Testing connection to Azure SQL Database..."

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    Write-Host "✅ Connected successfully. Current timeline items: $($response.results[0].CurrentTimelineCount)"
} catch {
    Write-Host "❌ Failed to connect: $($_.Exception.Message)"
    exit 1
}

# Now execute the seed data
Write-Host "🔄 Reading azure_supplement_seed_data.sql..."
$sqlContent = Get-Content -Path "azure_supplement_seed_data.sql" -Raw

# Split into statements (basic splitting)
$statements = $sqlContent -split ';' | Where-Object { $_.Trim() -and -not ($_.Trim() -match '^\s*PRINT') }

Write-Host "🔄 Executing $($statements.Count) SQL statements..."

$successCount = 0
for ($i = 0; $i -lt $statements.Count; $i++) {
    $statement = $statements[$i].Trim()
    if ($statement) {
        Write-Host "   Executing statement $($i+1)/$($statements.Count)..."
        
        $body = @{
            query = $statement
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
            $successCount++
            Write-Host "   ✅ Statement $($i+1) executed successfully"
        } catch {
            Write-Host "   ⚠️ Statement $($i+1) failed: $($_.Exception.Message)"
        }
        
        Start-Sleep -Milliseconds 100  # Small delay between requests
    }
}

Write-Host "✅ Completed: $successCount/$($statements.Count) statements executed successfully"

# Verify the data was inserted
Write-Host "🔄 Verifying data insertion..."
$verifyQueries = @(
    "SELECT COUNT(*) as TimelineCount FROM ProjectTimelineItems",
    "SELECT COUNT(*) as RiskCount FROM BusinessContextRisks", 
    "SELECT COUNT(*) as ArchitectureCount FROM ArchitectureReviews"
)

foreach ($query in $verifyQueries) {
    $body = @{ query = $query } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
        Write-Host "✅ $query : $($response.results[0].PSObject.Properties.Value)"
    } catch {
        Write-Host "⚠️ Verification query failed: $query"
    }
}

Write-Host "🎉 Azure database synchronization completed!"