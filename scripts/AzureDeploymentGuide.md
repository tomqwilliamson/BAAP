# BAAP Azure Deployment Guide

This guide walks you through deploying the BAAP application to Azure.

## Prerequisites
- Azure CLI installed and logged in
- Azure subscription with required permissions
- SQL Database and App Service permissions

## Step 1: Create Resource Group
```bash
az group create --name baap-prod-rg --location eastus
```

## Step 2: Create Azure SQL Database
```bash
# Create SQL Server
az sql server create \
  --name baap-prod-sql-server \
  --resource-group baap-prod-rg \
  --location eastus \
  --admin-user baapadmin \
  --admin-password 'YourSecurePassword123!'

# Create SQL Database
az sql db create \
  --resource-group baap-prod-rg \
  --server baap-prod-sql-server \
  --name baap-prod-db \
  --service-objective S2

# Configure firewall to allow Azure services
az sql server firewall-rule create \
  --resource-group baap-prod-rg \
  --server baap-prod-sql-server \
  --name AllowAzureIps \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Step 3: Deploy Database Schema and Seed Data
1. Connect to your Azure SQL Database using SQL Server Management Studio or Azure Data Studio
2. Run the `Scripts/ApplyMigrations.sql` script to create the database schema
3. Run the `Scripts/AzureDeployment.sql` script to insert seed data

## Step 4: Create App Service Plan and Web App
```bash
# Create App Service Plan
az appservice plan create \
  --name baap-prod-plan \
  --resource-group baap-prod-rg \
  --location eastus \
  --sku B1

# Create Web App
az webapp create \
  --resource-group baap-prod-rg \
  --plan baap-prod-plan \
  --name baap-prod-api \
  --runtime "DOTNET|8.0"
```

## Step 5: Configure Application Settings
```bash
# Set connection string
az webapp config connection-string set \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:baap-prod-sql-server.database.windows.net,1433;Initial Catalog=baap-prod-db;Persist Security Info=False;User ID=baapadmin;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set application settings
az webapp config appsettings set \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    WEBSITE_RUN_FROM_PACKAGE=1 \
    AIAnalysis__EnableSimulationMode=false \
    JwtSettings__Issuer=BAAP-API-Production \
    JwtSettings__Audience=BAAP-Client-Production
```

## Step 6: Build and Deploy API
```bash
# Navigate to API directory
cd BAAP.API

# Build the application
dotnet build --configuration Release

# Publish the application
dotnet publish --configuration Release --output ./publish

# Create deployment package
cd publish
zip -r ../baap-api-deployment.zip .

# Deploy to Azure
az webapp deploy \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --src-path ../baap-api-deployment.zip \
  --type zip
```

## Step 7: Create Static Web App for Frontend
```bash
# Create Static Web App
az staticwebapp create \
  --name baap-prod-frontend \
  --resource-group baap-prod-rg \
  --location eastus \
  --source "https://github.com/your-username/baap-frontend" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

## Step 8: Configure Frontend Environment Variables
1. Navigate to your Static Web App in Azure Portal
2. Go to Configuration > Environment variables
3. Add the following:
   - `REACT_APP_API_BASE_URL`: `https://baap-prod-api.azurewebsites.net/api`
   - `REACT_APP_USE_API`: `true`

## Step 9: Update CORS Settings
```bash
# Update CORS to allow your frontend domain
az webapp cors add \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --allowed-origins "https://baap-prod-frontend.azurestaticapps.net"
```

## Step 10: Optional - Configure Custom Domain and SSL
```bash
# Add custom domain (replace with your domain)
az webapp config hostname add \
  --resource-group baap-prod-rg \
  --webapp-name baap-prod-api \
  --hostname api.yourdomain.com

# Configure SSL (Azure provides free SSL for azurewebsites.net domains)
az webapp config ssl bind \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --certificate-thumbprint [certificate-thumbprint] \
  --ssl-type SNI
```

## Step 11: Configure Monitoring (Optional)
```bash
# Create Application Insights
az extension add --name application-insights
az monitor app-insights component create \
  --app baap-prod-insights \
  --location eastus \
  --resource-group baap-prod-rg

# Link to App Service
az webapp config appsettings set \
  --resource-group baap-prod-rg \
  --name baap-prod-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="[instrumentation-key]"
```

## Security Considerations

### 1. Azure Key Vault (Recommended)
Store sensitive configuration in Azure Key Vault:
```bash
# Create Key Vault
az keyvault create \
  --name baap-prod-keyvault \
  --resource-group baap-prod-rg \
  --location eastus

# Store secrets
az keyvault secret set --vault-name baap-prod-keyvault --name JwtSecretKey --value "your-jwt-secret"
az keyvault secret set --vault-name baap-prod-keyvault --name AzureOpenAIApiKey --value "your-openai-key"

# Grant App Service access to Key Vault
az webapp identity assign --resource-group baap-prod-rg --name baap-prod-api
az keyvault set-policy \
  --name baap-prod-keyvault \
  --object-id [app-service-identity] \
  --secret-permissions get list
```

### 2. Network Security
- Configure Azure Firewall rules for database access
- Use Private Endpoints for database connections (premium tier)
- Enable Application Gateway with WAF for additional security

### 3. Backup and Disaster Recovery
```bash
# Configure database backup retention
az sql db update \
  --resource-group baap-prod-rg \
  --server baap-prod-sql-server \
  --name baap-prod-db \
  --backup-storage-redundancy Local

# Configure App Service backup
az webapp config backup update \
  --resource-group baap-prod-rg \
  --webapp-name baap-prod-api \
  --container-url "[storage-container-url]" \
  --frequency 1 \
  --retention 30
```

## Post-Deployment Verification

1. **API Health Check**: Visit `https://baap-prod-api.azurewebsites.net/swagger` to verify API is running
2. **Database Connection**: Check App Service logs for successful database connections
3. **Frontend**: Verify the frontend loads at your Static Web App URL
4. **Full Integration**: Test creating an assessment through the UI

## Troubleshooting

### Common Issues:
1. **Database Connection Failed**: Check connection string and firewall rules
2. **CORS Errors**: Verify CORS configuration includes your frontend domain
3. **Build Failures**: Check .NET version compatibility and missing dependencies
4. **API Not Loading**: Check App Service logs and application settings

### Useful Commands:
```bash
# View App Service logs
az webapp log tail --resource-group baap-prod-rg --name baap-prod-api

# Restart App Service
az webapp restart --resource-group baap-prod-rg --name baap-prod-api

# Check App Service health
az webapp show --resource-group baap-prod-rg --name baap-prod-api --query state
```

## Cost Optimization

- Use B1 App Service Plan for development/testing
- Consider S1+ for production workloads
- Monitor SQL Database DTU usage and scale appropriately
- Use Azure Cost Management to track expenses

---

## Next Steps After Deployment

1. Set up CI/CD pipelines with GitHub Actions or Azure DevOps
2. Configure monitoring and alerting
3. Implement automated testing in the deployment pipeline
4. Set up staging environment for testing changes
5. Configure Azure AD B2C for user authentication (if needed)

Your BAAP application should now be successfully deployed to Azure!