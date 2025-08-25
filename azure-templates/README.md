# Azure Templates for BAAP Deployment

This directory contains Infrastructure as Code (IaC) templates and deployment scripts for hosting BAAP on Microsoft Azure.

## Files Overview

- `main.bicep` - Main Bicep template defining all Azure resources
- `parameters.dev.json` - Development environment parameters
- `parameters.prod.json` - Production environment parameters
- `deploy.ps1` - PowerShell deployment script
- `README.md` - This documentation file

## Prerequisites

### Required Tools
- **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **PowerShell 5.1+** or **PowerShell Core 7+**
- **Azure Subscription** with Contributor access

### Azure CLI Login
```bash
az login
az account list --output table
az account set --subscription "Your-Subscription-ID"
```

## Quick Deployment

### Development Environment
```powershell
# Navigate to templates directory
cd azure-templates

# Update parameters file with your values
# Edit parameters.dev.json:
# - Update sqlAdminPassword with a secure password
# - Update clientIpAddress with your IP address

# Deploy development environment
.\deploy.ps1 -Environment dev -SubscriptionId "cbdd0205-a985-4a0b-ad35-725446b33819"
```

### Production Environment
```powershell
# Update parameters file with your values
# Edit parameters.prod.json:
# - Update sqlAdminPassword with a secure password
# - Update clientIpAddress with your IP address

# Deploy production environment
.\deploy.ps1 -Environment prod -SubscriptionId "cbdd0205-a985-4a0b-ad35-725446b33819" -ResourceGroupName "rg-baap-production"
```

### What-If Deployment (Preview Changes)
```powershell
# Preview changes without deploying
.\deploy.ps1 -Environment dev -SubscriptionId "cbdd0205-a985-4a0b-ad35-725446b33819" -WhatIf
```

## Resource Configuration

### Environment-Specific Settings

| Resource | Development | Production |
|----------|-------------|------------|
| App Service | Basic B1 | Premium P1V3 |
| SQL Database | Basic 5 DTU | Standard S2 50 DTU |
| Static Web App | Free | Standard |
| Storage | LRS | GRS |
| CDN | None | Standard Microsoft |

### Deployed Resources

The template creates the following Azure resources:

#### Core Application Resources
- **App Service Plan** - Hosts the .NET API
- **App Service** - .NET 6.0 API application
- **Static Web App** - React frontend with CI/CD
- **SQL Server & Database** - Azure SQL Database
- **Storage Account** - File storage and backups

#### Security & Monitoring
- **Key Vault** - Secure storage for connection strings and secrets
- **Application Insights** - Application performance monitoring
- **Log Analytics Workspace** - Centralized logging

#### Content Delivery (Production Only)
- **CDN Profile & Endpoint** - Global content distribution

## Post-Deployment Configuration

After successful deployment, you'll need to:

### 1. Update Application Configuration

Update your local `appsettings.json` files:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:your-sql-server.database.windows.net,1433;..."
  },
  "ApplicationInsights": {
    "ConnectionString": "InstrumentationKey=your-key;..."
  }
}
```

### 2. Deploy Application Code

#### API Deployment
```bash
# Publish .NET API
cd BAAP.API
dotnet publish -c Release -o ./publish

# Deploy to Azure App Service (using Azure CLI)
az webapp deployment source config-zip \
  --resource-group rg-baap-dev \
  --name your-app-service-name \
  --src ./publish.zip
```

#### Frontend Deployment
The Static Web App will automatically deploy from your GitHub repository once configured.

### 3. Database Migration

```bash
# Run Entity Framework migrations against Azure SQL
cd BAAP.API
dotnet ef database update --connection "your-azure-sql-connection-string"
```

### 4. Configure Custom Domains (Optional)

```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name your-static-web-app \
  --hostname your-custom-domain.com
```

## Security Configuration

### Managed Identity
The App Service is configured with System-assigned Managed Identity and has access to:
- Key Vault secrets (read-only)
- Storage Account (read/write)

### Network Security
- HTTPS only for all web endpoints
- TLS 1.2 minimum for all services
- SQL Server firewall configured for Azure services
- Storage Account configured for HTTPS only

### Key Vault Integration
Connection strings and secrets are stored in Key Vault and referenced by the App Service.

## Monitoring & Logging

### Application Insights
- Automatic instrumentation for .NET API
- Custom telemetry and metrics
- Performance monitoring
- Exception tracking

### Log Analytics
- Centralized logging for all Azure resources
- Custom queries using KQL
- Integration with Azure Monitor alerts

## Cost Management

### Development Environment
- Estimated monthly cost: $35-50
- Uses basic tiers and minimal redundancy
- Suitable for development and testing

### Production Environment  
- Estimated monthly cost: $200-300
- Uses standard/premium tiers
- Includes high availability and monitoring

### Cost Optimization Tips
- Use Azure Reserved Instances for predictable workloads
- Enable auto-scaling to handle traffic efficiently
- Monitor usage with Azure Cost Management
- Consider Azure Hybrid Benefits for Windows licensing

## Troubleshooting

### Common Deployment Issues

#### Authentication Errors
```bash
# Re-authenticate with Azure
az logout
az login
az account set --subscription "your-subscription-id"
```

#### Resource Name Conflicts
The template uses unique suffixes, but if conflicts occur:
- Delete the conflicting resources
- Re-run the deployment
- Or modify the `appName` parameter

#### SQL Server Access Issues
- Verify your IP address in parameters file
- Check SQL Server firewall rules
- Ensure your Azure account has SQL permissions

#### Template Validation Errors
```bash
# Validate template before deployment
az deployment group validate \
  --resource-group rg-baap-dev \
  --template-file main.bicep \
  --parameters parameters.dev.json
```

### Deployment Logs
```bash
# View deployment history
az deployment group list --resource-group rg-baap-dev --output table

# Get deployment details
az deployment group show \
  --resource-group rg-baap-dev \
  --name your-deployment-name
```

## Cleanup

### Delete All Resources
```bash
# Delete entire resource group (WARNING: This deletes everything!)
az group delete --name rg-baap-dev --yes --no-wait
```

### Delete Individual Resources
```bash
# List all resources in the group
az resource list --resource-group rg-baap-dev --output table

# Delete specific resource
az resource delete \
  --resource-group rg-baap-dev \
  --name resource-name \
  --resource-type resource-type
```

## Support and Documentation

- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure SQL Database Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/database/)

## Contributing

When modifying the templates:

1. Test changes in development environment first
2. Use `--what-if` parameter to preview changes
3. Update parameter files for all environments
4. Document any new requirements or configuration steps
5. Test the complete deployment process

For questions or issues with the Azure deployment, please check the troubleshooting section above or consult the Azure documentation.