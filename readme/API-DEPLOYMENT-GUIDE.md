# API Deployment Guide for BAAP

This guide covers the deployment of the BAAP .NET 8 API to Azure App Service using GitHub Actions CI/CD.

## 🏗️ Architecture Overview

```
GitHub Repository
├── BAAP.API/ → .NET 8 Web API
├── GitHub Actions Workflows
│   ├── Build & Test Pipeline
│   ├── Development Deployment
│   └── Production Deployment (Blue-Green)
└── Azure App Service
    ├── Production Slot
    ├── Staging Slot (prod only)
    └── Configuration from App Configuration
```

## 📋 Prerequisites

### Azure Resources
- **App Service Plan** (B1 for dev, S1+ for prod)
- **App Service** with staging slot (production)
- **Azure App Configuration** for centralized config
- **Azure Key Vault** for secrets
- **Azure SQL Database** for data persistence
- **Application Insights** for monitoring

### Development Tools
- **.NET 8 SDK**
- **Azure CLI**
- **Visual Studio** or **VS Code**
- **Git** with GitHub access

## 🚀 GitHub Actions Workflow Features

### **Enhanced Build Pipeline**
```yaml
# Key features of the build job:
- .NET package caching for faster builds
- Full solution build (BAAP.sln)
- Unit tests with coverage reporting
- Security scanning (SARIF)
- Linux-optimized publish
- Build artifact with deployment info
```

### **Development Deployment**
- **Trigger**: Push to `develop` branch
- **Target**: Development App Service
- **Features**:
  - Direct deployment to main slot
  - App Service configuration update
  - Health check verification
  - Swagger endpoint testing

### **Production Deployment (Blue-Green)**
- **Trigger**: Push to `main` branch
- **Target**: Production App Service with staging slot
- **Process**:
  1. Deploy to **staging slot**
  2. Configure staging environment
  3. Run smoke tests on staging
  4. **Swap slots** (zero-downtime deployment)
  5. Verify production deployment
  6. **Auto-rollback** on failure

### **Manual Deployment**
- **Trigger**: GitHub Actions `workflow_dispatch`
- **Options**: Choose development or production
- **Use Case**: Hotfixes, ad-hoc deployments

## ⚙️ Configuration Setup

### GitHub Secrets Required

#### **Azure Credentials**
```bash
# Service Principal for Azure CLI authentication
AZURE_CREDENTIALS_DEV    # Development environment credentials
AZURE_CREDENTIALS_PROD   # Production environment credentials
```

#### **App Service Information**
```bash
# Development Environment
AZURE_WEBAPP_NAME_DEV              # e.g., baap-dev-api-abc123
AZURE_WEBAPP_PUBLISH_PROFILE_DEV   # Development publish profile (XML)
AZURE_WEBAPP_URL_DEV               # e.g., https://baap-dev-api-abc123.azurewebsites.net
AZURE_RESOURCE_GROUP_DEV           # e.g., rg-baap-dev

# Production Environment
AZURE_WEBAPP_NAME_PROD             # e.g., baap-prod-api-def456
AZURE_WEBAPP_PUBLISH_PROFILE_PROD_STAGING  # Staging slot publish profile (XML)
AZURE_WEBAPP_URL_PROD              # e.g., https://baap-prod-api-def456.azurewebsites.net
AZURE_WEBAPP_URL_PROD_STAGING      # e.g., https://baap-prod-api-def456-staging.azurewebsites.net
AZURE_RESOURCE_GROUP_PROD          # e.g., rg-baap-prod
```

### Azure Service Principal Setup

Create service principals for GitHub Actions:

```bash
# Development Service Principal
az ad sp create-for-rbac \
  --name "github-actions-baap-dev" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-baap-dev \
  --sdk-auth

# Production Service Principal  
az ad sp create-for-rbac \
  --name "github-actions-baap-prod" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-baap-prod \
  --sdk-auth
```

Store the JSON output as `AZURE_CREDENTIALS_DEV` and `AZURE_CREDENTIALS_PROD` secrets.

### App Service Publish Profiles

Get publish profiles for GitHub Actions deployment:

```bash
# Development publish profile
az webapp deployment list-publishing-profiles \
  --name baap-dev-api-abc123 \
  --resource-group rg-baap-dev \
  --xml

# Production staging slot publish profile
az webapp deployment list-publishing-profiles \
  --name baap-prod-api-def456 \
  --resource-group rg-baap-prod \
  --slot staging \
  --xml
```

## 🔧 Local Development Setup

### 1. Clone and Setup
```bash
git clone <repository-url>
cd BAAP
cd BAAP.API
```

### 2. Configure Local Settings
Create `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BaapDb;Trusted_Connection=true;",
    "AppConfig": ""
  },
  "JwtSettings": {
    "SecretKey": "your-256-bit-secret-key-here-must-be-at-least-32-characters-long",
    "Issuer": "BAAP-API",
    "Audience": "BAAP-Client"
  }
}
```

### 3. Database Setup
```bash
# Install EF tools (if not already installed)
dotnet tool install --global dotnet-ef

# Update database
dotnet ef database update

# Run the application
dotnet run
```

## 🚦 Deployment Process

### Development Deployment
1. **Create feature branch** from `develop`
2. **Make changes** to API code
3. **Test locally** with database
4. **Push to GitHub** - triggers build pipeline
5. **Create PR** to `develop`
6. **Merge PR** - automatically deploys to dev environment

### Production Deployment
1. **Merge develop to main** when ready for production
2. **GitHub Actions triggers**:
   - Build and test pipeline
   - Deploy to staging slot
   - Run smoke tests
   - Swap to production slot
   - Verify deployment

### Monitoring Deployments

#### Health Check Endpoints
```bash
# Basic health check
GET /api/configuration/health
{
  "status": "Healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "Production",
  "deployment": {
    "timestamp": "2024-01-15T10:15:00Z",
    "gitCommit": "abc123def456",
    "buildNumber": "42"
  }
}

# Detailed diagnostics
GET /api/configuration/diagnostics
{
  "status": "Healthy",
  "runtime": {
    "version": "8.0.0",
    "framework": ".NET 8.0.0"
  },
  "memory": {
    "workingSet": 123456789
  }
}
```

#### Azure Portal Monitoring
- **App Service Logs**: Monitor deployment progress
- **Application Insights**: Performance and error monitoring
- **Kudu Console**: Access to deployment files and logs

## 🛠️ Troubleshooting

### Common Issues

#### 1. Deployment Failures
```bash
# Check deployment logs in Kudu
https://{app-name}.scm.azurewebsites.net/api/deployments

# Check application logs
az webapp log tail --name {app-name} --resource-group {resource-group}
```

#### 2. Configuration Issues
```bash
# Verify App Configuration connection
az appconfig show --name {app-config-name}

# Check Key Vault access
az keyvault secret list --vault-name {key-vault-name}
```

#### 3. Database Connectivity
```bash
# Test SQL connection from App Service
az webapp ssh --name {app-name} --resource-group {resource-group}

# Check connection strings
az webapp config connection-string list --name {app-name} --resource-group {resource-group}
```

#### 4. GitHub Actions Failures
- **Check secrets**: Verify all required secrets are set
- **Review logs**: Examine GitHub Actions workflow logs
- **Validate credentials**: Ensure service principals have correct permissions

### Debug Commands

#### Local Testing
```bash
# Test specific configuration
dotnet run --environment Staging

# Run with specific connection string
dotnet run --ConnectionStrings:DefaultConnection="..."

# Test publish locally
dotnet publish -c Release -o ./publish --runtime linux-x64
```

#### Azure Diagnostics
```bash
# App Service status
az webapp show --name {app-name} --resource-group {resource-group}

# Recent deployments
az webapp deployment list --name {app-name} --resource-group {resource-group}

# Configuration settings
az webapp config appsettings list --name {app-name} --resource-group {resource-group}

# Restart application
az webapp restart --name {app-name} --resource-group {resource-group}
```

## 📈 Performance Optimization

### Build Performance
- **NuGet package caching** - Reduces build time by ~30%
- **Incremental builds** - Only rebuild changed projects
- **Parallel test execution** - Faster test runs

### Deployment Performance
- **Linux hosting** - Better performance and cost
- **Staging slot warm-up** - Reduces swap time
- **Health check verification** - Ensures successful deployment

### Runtime Performance
- **App Configuration caching** - Reduces config lookup overhead
- **Application Insights** - Monitor performance metrics
- **Connection pooling** - Optimized database connections

## 🔐 Security Best Practices

### Secrets Management
- ✅ **No secrets in code** - All sensitive data in Key Vault
- ✅ **Managed Identity** - Service-to-service authentication
- ✅ **Least privilege** - Service principals with minimal permissions
- ✅ **Secret rotation** - Regular rotation of keys and passwords

### Deployment Security
- ✅ **Secure deployment slots** - Staging slot with production-like security
- ✅ **HTTPS only** - All endpoints require HTTPS
- ✅ **Security headers** - Configured via web.config or middleware
- ✅ **Access restrictions** - IP allowlisting for sensitive endpoints

### Code Security
- ✅ **Security scanning** - Automated SARIF reporting
- ✅ **Dependency scanning** - NuGet package vulnerability checks
- ✅ **Authentication** - JWT + Azure B2C integration
- ✅ **Authorization** - Role-based access control

## 📊 Monitoring & Observability

### Application Insights
```csharp
// Custom telemetry in your API
_telemetryClient.TrackEvent("UserAction", new Dictionary<string, string>
{
    ["UserId"] = userId,
    ["Action"] = "AssessmentCreated"
});

// Performance tracking
using (_telemetryClient.StartOperation<DependencyTelemetry>("DatabaseQuery"))
{
    // Your database operation
}
```

### Health Checks
The API includes comprehensive health checks:
- **Basic health** - Application status and environment info
- **Detailed diagnostics** - Runtime, memory, and configuration status
- **External dependencies** - Database, App Config, Key Vault connectivity

### Alerts and Notifications
Consider setting up:
- **Deployment failure alerts** - GitHub Actions notifications
- **Health check monitoring** - Azure Monitor alerts
- **Performance degradation** - Application Insights alerts
- **Error rate thresholds** - Automatic notifications

## 📋 Maintenance Tasks

### Regular Tasks
- **Update dependencies** - Monthly NuGet package updates
- **Review security** - Quarterly security assessment
- **Performance review** - Monthly performance analysis
- **Cost optimization** - Quarterly cost review

### Emergency Procedures

#### Rollback Production
```bash
# Manual rollback via slot swap
az webapp deployment slot swap \
  --name {app-name} \
  --resource-group {resource-group} \
  --slot production \
  --target-slot staging
```

#### Emergency Deployment
Use the manual workflow dispatch feature in GitHub Actions to deploy hotfixes directly to production when needed.

---

## 📞 Support

### Resources
- **Azure App Service Documentation**: [docs.microsoft.com/azure/app-service](https://docs.microsoft.com/azure/app-service)
- **GitHub Actions Documentation**: [docs.github.com/actions](https://docs.github.com/actions)
- **.NET Deployment Guide**: [docs.microsoft.com/dotnet/azure](https://docs.microsoft.com/dotnet/azure)

### Troubleshooting Checklist
1. ✅ Verify all GitHub secrets are configured
2. ✅ Check Azure service principal permissions
3. ✅ Validate App Service configuration
4. ✅ Test health check endpoints
5. ✅ Review Application Insights logs
6. ✅ Check Azure SQL connectivity
7. ✅ Verify App Configuration access

This deployment setup provides enterprise-grade CI/CD with zero-downtime deployments, comprehensive monitoring, and automatic rollback capabilities! 🚀