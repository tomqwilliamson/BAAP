# CI/CD Setup Guide for BAAP

This guide walks you through setting up Continuous Integration and Continuous Deployment (CI/CD) for the BAAP platform using GitHub Actions and Azure Static Web Apps.

## 🏗️ Architecture Overview

```
GitHub Repository
├── main branch → Production Environment
├── develop branch → Development Environment
└── feature/* branches → Preview Environments (PR builds)

Azure Infrastructure
├── Static Web App (Frontend) → GitHub Actions deployment
├── App Service (API) → GitHub Actions deployment
├── App Configuration → Dynamic configuration
└── Key Vault → Secure secrets
```

## 📋 Prerequisites

Before setting up CI/CD, ensure you have:

1. **Azure Subscription** with appropriate permissions
2. **GitHub Repository** with admin access
3. **Azure CLI** installed and logged in
4. **Static Web Apps deployed** via Bicep template

## 🚀 Initial Setup

### Step 1: Deploy Azure Infrastructure

First, deploy your Azure resources using the Bicep template:

```powershell
# Deploy to development environment
cd azure-templates
.\deploy.ps1 -Environment dev -SubscriptionId "your-subscription-id"

# Deploy to production environment
.\deploy.ps1 -Environment prod -SubscriptionId "your-subscription-id"
```

This will create all Azure resources and output the deployment tokens you'll need.

### Step 2: Collect Required Information

After deployment, collect these values from the Azure portal or deployment outputs:

#### Static Web App Information
```bash
# Get Static Web App deployment tokens
az staticwebapp secrets list --name "baap-dev-web-xxxxxx" --query "properties.apiKey" -o tsv
az staticwebapp secrets list --name "baap-prod-web-xxxxxx" --query "properties.apiKey" -o tsv
```

#### App Service Information
```bash
# Get App Service publish profiles
az webapp deployment list-publishing-profiles --name "baap-dev-api-xxxxxx" --resource-group "rg-baap-dev" --xml
az webapp deployment list-publishing-profiles --name "baap-prod-api-xxxxxx" --resource-group "rg-baap-prod" --xml
```

### Step 3: Configure GitHub Repository Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

Add the following **Repository Secrets**:

#### Static Web App Secrets
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` - Development Static Web App deployment token
- `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` - Production Static Web App deployment token

#### API Deployment Secrets
- `AZURE_WEBAPP_NAME_DEV` - Development App Service name (e.g., `baap-dev-api-xxxxxx`)
- `AZURE_WEBAPP_NAME_PROD` - Production App Service name (e.g., `baap-prod-api-xxxxxx`)
- `AZURE_WEBAPP_PUBLISH_PROFILE_DEV` - Development App Service publish profile (XML content)
- `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` - Production App Service publish profile (XML content)

#### Application Configuration Secrets
- `REACT_APP_API_BASE_URL_DEV` - Development API URL (e.g., `https://baap-dev-api-xxxxxx.azurewebsites.net/api`)
- `REACT_APP_API_BASE_URL_PROD` - Production API URL (e.g., `https://baap-prod-api-xxxxxx.azurewebsites.net/api`)

### Step 4: Configure Branch Protection (Optional but Recommended)

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Include administrators

## 🔄 Workflow Configuration

### Frontend Workflow (.github/workflows/azure-static-web-apps-ci-cd.yml)

**Triggers:**
- Push to `main` → Deploy to Production
- Push to `develop` → Deploy to Development  
- Pull Request → Create Preview Environment

**Steps:**
1. **Checkout** code from repository
2. **Setup Node.js** environment
3. **Install dependencies** via npm ci
4. **Run tests** with coverage
5. **Build application** with environment-specific variables
6. **Deploy** to appropriate Static Web App environment

### API Workflow (.github/workflows/azure-api-ci-cd.yml)

**Triggers:**
- Push to `main` or `develop` (API changes only)
- Pull Request (API changes only)

**Steps:**
1. **Checkout** code from repository
2. **Setup .NET** environment
3. **Restore dependencies** 
4. **Build application** in Release mode
5. **Run tests** 
6. **Publish application**
7. **Deploy** to appropriate App Service environment

## 🌍 Environment Configuration

### Development Environment
- **Branch:** `develop`
- **Static Web App:** `baap-dev-web-xxxxxx`
- **App Service:** `baap-dev-api-xxxxxx`
- **Database:** Development Azure SQL Database
- **Features:** Debug mode enabled, all features available

### Production Environment  
- **Branch:** `main`
- **Static Web App:** `baap-prod-web-xxxxxx`
- **App Service:** `baap-prod-api-xxxxxx`
- **Database:** Production Azure SQL Database
- **Features:** Optimized builds, production-only features enabled

### Preview Environments
- **Trigger:** Pull Requests to `main` or `develop`
- **Environment:** Temporary Static Web App staging environment
- **Lifecycle:** Automatically created and destroyed with PR

## 📝 Deployment Process

### For Feature Development

1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and commit
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** to `develop`
   - GitHub Actions will automatically create a preview environment
   - Review the preview and run tests

4. **Merge to develop** 
   - Automatically deploys to development environment
   - Test your changes in the dev environment

5. **Merge to main** (when ready for production)
   - Create PR from `develop` to `main`
   - Automatically deploys to production environment

### For Hotfixes

1. **Create hotfix branch** from `main`
   ```bash
   git checkout main
   git pull origin main  
   git checkout -b hotfix/critical-fix
   ```

2. **Make fix and test**
3. **Create PR directly to main**
4. **After merge, also merge back to develop**

## 🔍 Monitoring Deployments

### GitHub Actions Status
- View workflow runs in the **Actions** tab
- Monitor build logs and deployment status
- Check for any failed deployments

### Azure Static Web Apps
```bash
# Check deployment status
az staticwebapp show --name "baap-dev-web-xxxxxx" --query "properties.repositoryUrl,properties.branch"

# View deployment history
az staticwebapp environment list --name "baap-dev-web-xxxxxx"
```

### App Service Deployments
```bash
# Check deployment status  
az webapp deployment list --name "baap-dev-api-xxxxxx" --resource-group "rg-baap-dev"

# View application logs
az webapp log tail --name "baap-dev-api-xxxxxx" --resource-group "rg-baap-dev"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Static Web App Deployment Fails
```yaml
# Check your secrets are correctly set
- AZURE_STATIC_WEB_APPS_API_TOKEN_DEV
- AZURE_STATIC_WEB_APPS_API_TOKEN_PROD
```

#### 2. API Deployment Fails  
```yaml
# Verify publish profile format
- AZURE_WEBAPP_PUBLISH_PROFILE_DEV (must be complete XML)
- AZURE_WEBAPP_PUBLISH_PROFILE_PROD (must be complete XML)
```

#### 3. Build Failures
```bash
# Check Node.js version compatibility
# Ensure all dependencies are in package.json
# Verify environment variables are set correctly
```

#### 4. Test Failures
```bash
# Run tests locally first
npm test

# Check test coverage requirements
npm test -- --coverage
```

### Debug Steps

1. **Check GitHub Actions logs** for detailed error messages
2. **Verify Azure resource names** match your secrets
3. **Test deployments locally** using Azure CLI
4. **Check Azure portal** for resource health and logs

## 🔐 Security Best Practices

### Secrets Management
- ✅ Store all sensitive values in GitHub Secrets
- ✅ Use separate secrets for dev/prod environments  
- ✅ Regularly rotate deployment tokens and publish profiles
- ✅ Review secret access logs periodically

### Branch Protection
- ✅ Require PR reviews for main branch
- ✅ Require status checks to pass
- ✅ Restrict force pushes to main branch
- ✅ Require signed commits (optional)

### Environment Isolation
- ✅ Use separate Azure resource groups for environments
- ✅ Different databases for dev/prod
- ✅ Environment-specific configuration in App Configuration
- ✅ Network isolation in production (optional)

## 📈 Optimization Tips

### Performance
- **Enable caching** in Static Web App configuration
- **Use CDN** for production environments  
- **Optimize bundle size** with code splitting
- **Enable compression** in App Service

### Cost Management
- **Use Free tier** for development Static Web Apps
- **Scale down** development App Services during off-hours
- **Set up budget alerts** in Azure
- **Monitor resource usage** regularly

## 🔄 Maintenance

### Regular Tasks
- **Update dependencies** monthly
- **Review and rotate secrets** quarterly  
- **Monitor deployment metrics** weekly
- **Test disaster recovery** procedures quarterly

### Updating Workflows
- **Test changes** in a feature branch first
- **Use semantic versioning** for action versions
- **Document any workflow changes** in commit messages
- **Review workflow permissions** regularly

---

## 📞 Support

If you encounter issues with the CI/CD setup:

1. **Check the GitHub Actions logs** for detailed error messages
2. **Review this documentation** for configuration steps
3. **Test components individually** to isolate issues
4. **Check Azure service health** status page

## 🎯 Next Steps

After successful CI/CD setup:

1. **Configure monitoring alerts** in Azure Application Insights
2. **Set up automated testing** for critical user journeys  
3. **Implement feature flags** for gradual rollouts
4. **Plan disaster recovery** procedures
5. **Document runbook procedures** for operations team