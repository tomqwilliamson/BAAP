# Azure Deployment Script for BAAP
# This script deploys the BAAP application infrastructure to Azure

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US 2",
    
    [Parameter(Mandatory=$false)]
    [switch]$WhatIf = $false
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 BAAP Azure Deployment Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
    
    # Check if Azure CLI is installed
    try {
        $azVersion = az version --output tsv 2>$null
        Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Azure CLI is not installed. Please install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    }
    
    # Check if logged in to Azure
    try {
        $account = az account show --output json 2>$null | ConvertFrom-Json
        Write-Host "✅ Logged in to Azure as: $($account.user.name)" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Not logged in to Azure. Initiating login..." -ForegroundColor Yellow
        az login
    }
    
    # Set subscription
    Write-Host "🔄 Setting subscription: $SubscriptionId" -ForegroundColor Gray
    az account set --subscription $SubscriptionId
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Failed to set subscription. Please check subscription ID."
        exit 1
    }
    
    Write-Host "✅ Prerequisites check completed" -ForegroundColor Green
}

# Function to get client IP address
function Get-ClientIpAddress {
    try {
        $ip = (Invoke-WebRequest -Uri "http://ipinfo.io/ip" -UseBasicParsing).Content.Trim()
        Write-Host "🌐 Detected client IP: $ip" -ForegroundColor Gray
        return $ip
    }
    catch {
        Write-Warning "⚠️  Could not detect client IP address. Using 0.0.0.0 (allows all)"
        return "0.0.0.0"
    }
}

# Function to create resource group
function New-ResourceGroup {
    param(
        [string]$Name,
        [string]$Location
    )
    
    Write-Host "📦 Creating resource group: $Name" -ForegroundColor Yellow
    
    $rgExists = az group exists --name $Name --output tsv
    
    if ($rgExists -eq "true") {
        Write-Host "✅ Resource group already exists" -ForegroundColor Green
    } else {
        az group create --name $Name --location $Location --tags Environment=$Environment Application=BAAP
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Resource group created successfully" -ForegroundColor Green
        } else {
            Write-Error "❌ Failed to create resource group"
            exit 1
        }
    }
}

# Function to deploy Bicep template
function Deploy-BicepTemplate {
    param(
        [string]$ResourceGroupName,
        [string]$TemplateFile,
        [string]$ParametersFile,
        [string]$ClientIp,
        [bool]$WhatIfMode
    )
    
    Write-Host "🏗️  Deploying Azure resources..." -ForegroundColor Yellow
    
    $deploymentName = "baap-deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    # Update parameters file with client IP
    $parametersContent = Get-Content $ParametersFile | ConvertFrom-Json
    $parametersContent.parameters.clientIpAddress.value = $ClientIp
    $parametersContent | ConvertTo-Json -Depth 10 | Set-Content $ParametersFile
    
    if ($WhatIfMode) {
        Write-Host "🔍 Running What-If analysis..." -ForegroundColor Cyan
        az deployment group what-if `
            --resource-group $ResourceGroupName `
            --template-file $TemplateFile `
            --parameters $ParametersFile `
            --name $deploymentName
    } else {
        Write-Host "🚀 Deploying resources..." -ForegroundColor Cyan
        az deployment group create `
            --resource-group $ResourceGroupName `
            --template-file $TemplateFile `
            --parameters $ParametersFile `
            --name $deploymentName
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment completed successfully" -ForegroundColor Green
        
        if (!$WhatIfMode) {
            # Get deployment outputs
            Write-Host "📄 Retrieving deployment outputs..." -ForegroundColor Gray
            $outputs = az deployment group show --resource-group $ResourceGroupName --name $deploymentName --query properties.outputs --output json | ConvertFrom-Json
            
            Write-Host ""
            Write-Host "🎯 Deployment Results:" -ForegroundColor Cyan
            Write-Host "API URL: $($outputs.apiUrl.value)" -ForegroundColor White
            Write-Host "Web App URL: $($outputs.webAppUrl.value)" -ForegroundColor White
            Write-Host "SQL Server: $($outputs.sqlServerFqdn.value)" -ForegroundColor White
            Write-Host "Key Vault: $($outputs.keyVaultName.value)" -ForegroundColor White
            Write-Host "Storage Account: $($outputs.storageAccountName.value)" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Error "❌ Deployment failed"
        exit 1
    }
}

# Function to configure post-deployment settings
function Set-PostDeploymentConfiguration {
    param(
        [string]$ResourceGroupName,
        [string]$Environment
    )
    
    Write-Host "⚙️  Configuring post-deployment settings..." -ForegroundColor Yellow
    
    # Enable diagnostic settings for App Service
    $appServiceName = az resource list --resource-group $ResourceGroupName --resource-type "Microsoft.Web/sites" --query "[0].name" --output tsv
    $workspaceName = az resource list --resource-group $ResourceGroupName --resource-type "Microsoft.OperationalInsights/workspaces" --query "[0].name" --output tsv
    
    if ($appServiceName -and $workspaceName) {
        Write-Host "📊 Enabling diagnostic settings for App Service..." -ForegroundColor Gray
        $workspaceId = az monitor log-analytics workspace show --resource-group $ResourceGroupName --workspace-name $workspaceName --query id --output tsv
        
        az monitor diagnostic-settings create `
            --resource "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Web/sites/$appServiceName" `
            --name "AppServiceDiagnostics" `
            --workspace $workspaceId `
            --logs '[{"category":"AppServiceHTTPLogs","enabled":true},{"category":"AppServiceConsoleLogs","enabled":true},{"category":"AppServiceAppLogs","enabled":true}]' `
            --metrics '[{"category":"AllMetrics","enabled":true}]' `
            2>$null
    }
    
    Write-Host "✅ Post-deployment configuration completed" -ForegroundColor Green
}

# Main execution
try {
    # Set default resource group name if not provided
    if (!$ResourceGroupName) {
        $ResourceGroupName = "rg-baap-$Environment"
    }
    
    Write-Host "Configuration:" -ForegroundColor White
    Write-Host "  Environment: $Environment" -ForegroundColor Gray
    Write-Host "  Subscription: $SubscriptionId" -ForegroundColor Gray
    Write-Host "  Resource Group: $ResourceGroupName" -ForegroundColor Gray
    Write-Host "  Location: $Location" -ForegroundColor Gray
    Write-Host "  What-If Mode: $WhatIf" -ForegroundColor Gray
    Write-Host ""
    
    # Check prerequisites
    Test-Prerequisites
    
    # Get client IP for SQL firewall
    $clientIp = Get-ClientIpAddress
    
    # Create resource group
    if (!$WhatIf) {
        New-ResourceGroup -Name $ResourceGroupName -Location $Location
    }
    
    # Set template and parameters files
    $templateFile = Join-Path $PSScriptRoot "main.bicep"
    $parametersFile = Join-Path $PSScriptRoot "parameters.$Environment.json"
    
    # Verify files exist
    if (!(Test-Path $templateFile)) {
        Write-Error "❌ Template file not found: $templateFile"
        exit 1
    }
    
    if (!(Test-Path $parametersFile)) {
        Write-Error "❌ Parameters file not found: $parametersFile"
        exit 1
    }
    
    # Deploy Bicep template
    Deploy-BicepTemplate -ResourceGroupName $ResourceGroupName -TemplateFile $templateFile -ParametersFile $parametersFile -ClientIp $clientIp -WhatIfMode $WhatIf
    
    # Post-deployment configuration
    if (!$WhatIf) {
        Set-PostDeploymentConfiguration -ResourceGroupName $ResourceGroupName -Environment $Environment
        
        Write-Host ""
        Write-Host "🎉 BAAP deployment completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Update your application configuration with the new Azure resources" -ForegroundColor White
        Write-Host "2. Deploy your application code to the App Service and Static Web App" -ForegroundColor White
        Write-Host "3. Run database migrations against the Azure SQL Database" -ForegroundColor White
        Write-Host "4. Configure custom domains and SSL certificates if needed" -ForegroundColor White
        Write-Host "5. Set up CI/CD pipelines for automated deployments" -ForegroundColor White
        Write-Host ""
        Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Gray
        Write-Host "Environment: $Environment" -ForegroundColor Gray
    }
    
} catch {
    Write-Error "❌ Deployment failed: $($_.Exception.Message)"
    exit 1
}

Write-Host "✨ Deployment script completed! ✨" -ForegroundColor Magenta