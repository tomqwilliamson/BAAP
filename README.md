# Business Application Assessment Platform (BAAP)

> AI-Powered Enterprise Application Design Lab Software built with React and .NET 8

## 📋 Overview

BAAP is a comprehensive enterprise application assessment and modernization platform that helps organizations evaluate their application portfolios, identify cloud migration opportunities, and optimize their IT investments. The platform combines AI-driven analysis with expert assessment frameworks to deliver actionable insights and recommendations.

## 🏗️ Architecture

### **Frontend (React)**
- Modern React 18 application with responsive UI
- Azure App Configuration integration for dynamic configuration
- Feature flag support for controlled feature rollouts
- Comprehensive state management with React Context

### **Backend (.NET 8 API)**
- RESTful API with Entity Framework Core
- Azure App Configuration with Key Vault integration
- JWT authentication with Azure B2C support
- Comprehensive logging and monitoring

### **Cloud Infrastructure (Azure)**
- **Azure App Service** - API hosting
- **Azure Static Web Apps** - Frontend hosting
- **Azure SQL Database** - Data persistence
- **Azure App Configuration** - Centralized configuration management
- **Azure Key Vault** - Secure secret storage
- **Azure Application Insights** - Monitoring and analytics
- **Azure Storage Account** - File storage
- **Azure CDN** - Global content delivery (production)

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** with npm/yarn
- **.NET 8 SDK**
- **Azure CLI** (for deployment)
- **SQL Server** (for local development)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd BAAP
```

2. **Setup API**
```bash
cd BAAP.API
dotnet restore
dotnet ef database update
dotnet run
```

3. **Setup Frontend**
```bash
npm install
npm start
```

4. **Environment Configuration**

Create `.env` in the root:
```env
REACT_APP_USE_API=true
REACT_APP_API_BASE_URL=https://localhost:7001/api
```

Create `appsettings.Development.json` in BAAP.API:
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

## ⚙️ Azure App Configuration Integration

### **Centralized Configuration Management**

BAAP uses Azure App Configuration for dynamic, environment-specific configuration management:

#### **Configuration Structure**
```
BAAP:
├── Environment (dev/staging/prod)
├── ApiBaseUrl
├── WebAppUrl
├── DatabaseName
├── StorageAccountName
├── KeyVaultName
├── ApplicationInsights:InstrumentationKey
├── ConnectionStrings:DefaultConnection (→ Key Vault)
├── JwtSettings:
│   ├── SecretKey (→ Key Vault)
│   ├── Issuer
│   └── Audience
├── Features:
│   ├── UseApi
│   ├── EnableAnalytics
│   ├── EnableChatAssistant
│   ├── EnableAdvancedReporting
│   └── EnableSecurityScanning
└── UI:
    ├── Theme
    ├── DefaultPageSize
    └── EnableDebugMode
```

### **Key Vault Integration**
Sensitive values are securely stored in Azure Key Vault and referenced through App Configuration:
- SQL connection strings
- JWT signing keys
- Third-party API keys
- Certificates

### **Feature Flags**
Dynamic feature control without deployments:
```javascript
// React usage
const chatEnabled = useFeatureFlag('EnableChatAssistant');
const debugMode = useConfigValue('UI.EnableDebugMode');

// Conditional rendering
<FeatureFlag feature="EnableChatAssistant">
  <ChatComponent />
</FeatureFlag>
```

```csharp
// .NET usage
var useAnalytics = _configuration["Features:EnableAnalytics"];
var jwtSecret = _configuration["JwtSettings:SecretKey"]; // From Key Vault
```

### **Configuration API Endpoints**
- `GET /api/configuration/client` - Safe configuration for UI
- `GET /api/configuration/features` - Feature flags
- `GET /api/configuration/health` - Service health status

### **React Configuration Context**
```javascript
// Global configuration access
const { config, features, loading } = useConfiguration();

// Feature flag checking
const isEnabled = await apiService.isFeatureEnabled('EnableChatAssistant');

// Configuration values
const theme = await apiService.getConfiguration().then(c => c.UI.Theme);
```

## 📁 Project Structure

```
BAAP/
├── 📁 BAAP.API/                    # .NET 8 Web API
│   ├── Controllers/                # API controllers
│   ├── Data/                      # Entity Framework DbContext
│   ├── Models/                    # Data models
│   ├── Services/                  # Business logic services
│   ├── Middleware/                # Custom middleware
│   └── Program.cs                 # App configuration & DI
├── 📁 src/                        # React frontend
│   ├── components/               # React components
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── assessment/          # Assessment workflow
│   │   ├── security/            # Security analysis
│   │   ├── layout/              # Layout components
│   │   └── common/              # Shared components
│   ├── contexts/                # React contexts
│   │   ├── assessmentContext.js # Assessment state
│   │   └── configurationContext.js # Config management
│   ├── services/                # API service layer
│   │   ├── apiService.js        # Main API wrapper
│   │   ├── assessmentService.js # Assessment APIs
│   │   └── configurationService.js # Config APIs
│   └── utils/                   # Utility functions
├── 📁 azure-templates/            # Azure infrastructure
│   ├── main.bicep               # Main Bicep template
│   ├── parameters.dev.json      # Dev environment parameters
│   ├── parameters.prod.json     # Prod environment parameters
│   └── deploy.ps1               # Deployment script
└── 📁 scripts/                   # Database scripts
```

## 🎯 Key Features

### **Assessment Framework**
- **Business Context Analysis** - Stakeholder mapping, business drivers
- **Technical Assessment** - Architecture, infrastructure, security
- **Cloud Readiness Evaluation** - Migration readiness scoring
- **AI-Powered Recommendations** - Automated optimization suggestions

### **Dashboard & Analytics**
- Executive-level portfolio overview
- Real-time metrics and KPIs
- Interactive charts and visualizations
- Trend analysis and forecasting
- Customizable reporting

### **Security & Compliance**
- Comprehensive security scanning
- Vulnerability assessment
- Compliance gap analysis
- Risk scoring and prioritization

### **Modern Development Features**
- ✅ **Dynamic Configuration** - Azure App Configuration integration
- ✅ **Feature Flags** - Controlled feature rollouts
- ✅ **Secure Secret Management** - Azure Key Vault integration
- ✅ **Authentication** - JWT + Azure B2C support
- ✅ **Monitoring** - Application Insights integration
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **API Documentation** - Swagger/OpenAPI integration

## 🌐 Deployment

### **Azure Infrastructure Deployment**

1. **Login to Azure**
```powershell
az login
```

2. **Deploy Infrastructure**
```powershell
cd azure-templates
.\deploy.ps1 -Environment dev -SubscriptionId "your-subscription-id"
```

3. **Configure App Configuration**
```powershell
# The Bicep template automatically configures:
# - App Configuration store
# - Key Vault with secrets
# - Configuration key-value pairs
# - Feature flags
# - Service connections
```

### **Application Deployment**

**API Deployment:**
```bash
# Build and publish
dotnet publish BAAP.API -c Release -o ./publish

# Deploy to App Service (automated via GitHub Actions or manual)
az webapp deployment source config-zip --resource-group rg-baap-dev --name baap-dev-api --src ./publish.zip
```

**Frontend Deployment:**
```bash
# Build for production
npm run build

# Deploy to Static Web Apps (automated via GitHub Actions)
# Or manual deployment:
az staticwebapp environment set --name baap-dev-web --environment-name default --source ./build
```

### **Environment Configuration**

**Development:**
- Local SQL Server or Azure SQL Database
- Local debugging with Azure App Configuration (optional)
- Mock authentication for rapid development

**Staging:**
- Azure SQL Database
- Azure App Configuration with feature flags
- Azure B2C authentication
- Application Insights monitoring

**Production:**
- Azure SQL Database with read replicas
- Full Azure App Configuration with Key Vault
- Azure B2C with custom policies
- CDN for global performance
- Advanced monitoring and alerting

## 🔧 Configuration Management

### **Environment Variables**

**React (.env files):**
```env
# Development
REACT_APP_USE_API=true
REACT_APP_API_BASE_URL=http://localhost:5000/api

# Production (set via Azure Static Web Apps)
REACT_APP_USE_API=true
REACT_APP_API_BASE_URL=https://baap-prod-api.azurewebsites.net/api
```

**API (appsettings.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;",
    "AppConfig": "Endpoint=https://baap-config.azconfig.io;Id=...;Secret=..."
  },
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "your-tenant.onmicrosoft.com",
    "ClientId": "your-client-id"
  }
}
```

### **Feature Flag Management**

Control features dynamically without deployments:

```javascript
// Check feature availability
const chatEnabled = await apiService.isFeatureEnabled('EnableChatAssistant');
const analyticsEnabled = useFeatureFlag('EnableAnalytics');

// Environment-specific features
const advancedReporting = useFeatureFlag('EnableAdvancedReporting'); // false in dev, true in prod
const debugMode = useConfigValue('UI.EnableDebugMode'); // true in dev, false in prod
```

## 📊 Monitoring & Observability

### **Application Insights Integration**
- Real-time performance monitoring
- Custom telemetry and metrics
- Error tracking and debugging
- User behavior analytics

### **Health Checks**
```http
GET /api/configuration/health
{
  "Status": "Healthy",
  "Environment": "Production",
  "Database": { "Connected": true },
  "ExternalServices": {
    "AppConfiguration": true,
    "KeyVault": true,
    "ApplicationInsights": true
  }
}
```

### **Configuration Debug Mode**
In development, enable configuration debugging:
```javascript
// Shows configuration panel in bottom-right corner
<ConfigurationDebug />
```

## 🔐 Security

### **Authentication**
- JWT token-based authentication
- Azure B2C integration for enterprise SSO
- Development bypass middleware for rapid development

### **Authorization**
- Role-based access control
- API endpoint protection
- Feature flag-based permissions

### **Secret Management**
- All secrets stored in Azure Key Vault
- App Configuration references for secure access
- Managed Identity for service-to-service authentication

## 🚦 Testing

### **Frontend Testing**
```bash
npm test              # Run Jest tests
npm run test:coverage # Test coverage report
```

### **API Testing**
```bash
dotnet test                           # Run unit tests
dotnet test --collect:"XPlat Code Coverage" # Coverage report
```

### **Integration Testing**
```http
# Use BAAP.API.http file for manual API testing
GET https://localhost:7001/api/configuration/health
GET https://localhost:7001/api/assessments
```

## 📚 API Documentation

Interactive API documentation available at:
- **Development**: `https://localhost:7001/swagger`
- **Production**: `https://your-api-url/swagger`

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch from `main`
2. Develop with local testing
3. Update tests and documentation
4. Submit pull request
5. Deploy via Azure DevOps/GitHub Actions

### **Code Standards**
- **Frontend**: ESLint + Prettier configuration
- **Backend**: .NET coding standards with analyzers
- **Infrastructure**: Bicep best practices

## 📈 Performance

### **Optimization Features**
- **Frontend**: Code splitting, lazy loading, React.memo optimization
- **Backend**: Entity Framework query optimization, caching
- **Infrastructure**: CDN, App Service scaling, SQL read replicas

### **Monitoring**
- Application Insights for performance metrics
- Real User Monitoring (RUM)
- Synthetic monitoring for uptime

## 🎯 Enterprise Benefits

This platform demonstrates:
- **💰 Cost Optimization** - Identify savings opportunities across application portfolio
- **⚡ Modernization Roadmap** - Data-driven migration and upgrade planning
- **🔒 Risk Management** - Comprehensive security and compliance assessment
- **📊 Executive Reporting** - C-level dashboards with actionable insights
- **🚀 Cloud Strategy** - Azure-native architecture and best practices
- **⚙️ Operational Excellence** - Automated workflows and monitoring

Perfect for showcasing enterprise-scale application architecture, modern DevOps practices, and Azure cloud expertise! 🌟

---

## 📞 Support

For technical support or questions:
- Review the inline code documentation
- Check the `/api/configuration/health` endpoint for service status
- Enable debug mode for detailed configuration information
- Monitor Application Insights for performance and errors