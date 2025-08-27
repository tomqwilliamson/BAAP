// BAAP Azure Infrastructure - Main Bicep Template
// This template deploys all necessary Azure resources for BAAP hosting

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Application name prefix')
param appName string = 'baap'

@description('Location for all resources')
param location string = resourceGroup().location

@description('SQL Database administrator login')
param sqlAdminLogin string

@description('SQL Database administrator password')
@secure()
param sqlAdminPassword string

@description('Your IP address for SQL firewall rule')
param clientIpAddress string = '99.16.148.9'

@description('GitHub repository URL for Static Web App')
param repositoryUrl string = ''

@description('GitHub personal access token for Static Web App')
@secure()
param githubToken string = ''

// Variables
var environmentConfig = {
  dev: {
    skuName: 'B1'
    skuTier: 'Basic'
    sqlSkuName: 'Basic'
    sqlSkuTier: 'Basic'
    sqlSkuCapacity: 5
  }
  staging: {
    skuName: 'S1'
    skuTier: 'Standard'
    sqlSkuName: 'S1'
    sqlSkuTier: 'Standard'
    sqlSkuCapacity: 20
  }
  prod: {
    skuName: 'P1V3'
    skuTier: 'PremiumV3'
    sqlSkuName: 'S2'
    sqlSkuTier: 'Standard'
    sqlSkuCapacity: 50
  }
}

var config = environmentConfig[environment]
var resourcePrefix = '${appName}-${environment}'
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${resourcePrefix}-asp-${uniqueSuffix}'
  location: location
  sku: {
    name: config.skuName
    tier: config.skuTier
  }
  properties: {
    reserved: false // Set to true for Linux
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
  }
}

// App Service for .NET API
resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: '${resourcePrefix}-api-${uniqueSuffix}'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      netFrameworkVersion: '6.0'
      defaultDocuments: []
      httpLoggingEnabled: true
      detailedErrorLoggingEnabled: true
      requestTracingEnabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: environment == 'prod' ? 'Production' : 'Development'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'ApplicationInsights:InstrumentationKey'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'ApplicationInsights:ConnectionString'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'ConnectionStrings:AppConfig'
          value: appConfiguration.listKeys().value[0].connectionString
        }
      ]
      connectionStrings: [
        {
          name: 'DefaultConnection'
          connectionString: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabase.name};Persist Security Info=False;User ID=${sqlAdminLogin};Password=${sqlAdminPassword};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
          type: 'SQLAzure'
        }
      ]
    }
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'API'
  }
}

// App Service Staging Slot for Production (blue-green deployment)
resource appServiceStagingSlot 'Microsoft.Web/sites/slots@2022-03-01' = if (environment == 'prod') {
  parent: appService
  name: 'staging'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      netFrameworkVersion: '6.0'
      defaultDocuments: []
      httpLoggingEnabled: true
      detailedErrorLoggingEnabled: true
      requestTracingEnabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Staging'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'ApplicationInsights:InstrumentationKey'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'ApplicationInsights:ConnectionString'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'ConnectionStrings:AppConfig'
          value: appConfiguration.listKeys().value[0].connectionString
        }
      ]
      connectionStrings: [
        {
          name: 'DefaultConnection'
          connectionString: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabase.name};Persist Security Info=False;User ID=${sqlAdminLogin};Password=${sqlAdminPassword};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
          type: 'SQLAzure'
        }
      ]
    }
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'API-Staging'
  }
}

// Static Web App for React frontend
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: '${resourcePrefix}-web-${uniqueSuffix}'
  location: location
  sku: {
    name: environment == 'dev' ? 'Free' : 'Standard'
    tier: environment == 'dev' ? 'Free' : 'Standard'
  }
  properties: {
    repositoryUrl: !empty(repositoryUrl) ? repositoryUrl : null
    branch: environment == 'prod' ? 'main' : 'develop'
    repositoryToken: !empty(githubToken) ? githubToken : null
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'build'
      appBuildCommand: 'npm run build'
      apiBuildCommand: ''
      skipGithubActionWorkflowGeneration: true // We'll use our own workflow
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: environment == 'prod' ? 'Enabled' : 'Disabled'
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Frontend'
  }
}

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: '${resourcePrefix}-sql-${uniqueSuffix}'
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Database'
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: '${appName}_${environment}'
  location: location
  sku: {
    name: config.sqlSkuName
    tier: config.sqlSkuTier
    capacity: config.sqlSkuCapacity
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: environment == 'dev' ? 2147483648 : 268435456000 // 2GB for dev, 250GB for staging/prod
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: environment == 'prod'
    readScale: environment == 'prod' ? 'Enabled' : 'Disabled'
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Database'
  }
}

// SQL Server Firewall Rules
resource sqlFirewallAzure 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource sqlFirewallClient 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = if (clientIpAddress != '0.0.0.0') {
  parent: sqlServer
  name: 'AllowClientIp'
  properties: {
    startIpAddress: clientIpAddress
    endIpAddress: clientIpAddress
  }
}

// App Configuration
resource appConfiguration 'Microsoft.AppConfiguration/configurationStores@2023-03-01' = {
  name: '${resourcePrefix}-config-${uniqueSuffix}'
  location: location
  sku: {
    name: environment == 'dev' ? 'free' : 'standard'
  }
  properties: {
    disableLocalAuth: false
    enablePurgeProtection: false
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Configuration'
  }
}

// App Configuration Key-Value pairs
resource appConfigApiUrl 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:ApiBaseUrl'
  properties: {
    value: 'https://${appService.properties.defaultHostName}'
    contentType: 'text/plain'
  }
}

resource appConfigWebUrl 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:WebAppUrl'
  properties: {
    value: 'https://${staticWebApp.properties.defaultHostname}'
    contentType: 'text/plain'
  }
}

resource appConfigEnvironment 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:Environment'
  properties: {
    value: environment
    contentType: 'text/plain'
  }
}

resource appConfigDatabaseName 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:DatabaseName'
  properties: {
    value: sqlDatabase.name
    contentType: 'text/plain'
  }
}

resource appConfigStorageAccount 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:StorageAccountName'
  properties: {
    value: storageAccount.name
    contentType: 'text/plain'
  }
}

resource appConfigKeyVaultName 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:KeyVaultName'
  properties: {
    value: keyVault.name
    contentType: 'text/plain'
  }
}

resource appConfigAppInsightsKey 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:ApplicationInsights:InstrumentationKey'
  properties: {
    value: applicationInsights.properties.InstrumentationKey
    contentType: 'text/plain'
  }
}

// Key Vault references in App Configuration for sensitive values
resource appConfigSqlConnectionRef 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:ConnectionStrings:DefaultConnection'
  properties: {
    value: '{"uri":"${kvSecretSqlConnection.properties.secretUri}"}'
    contentType: 'application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8'
  }
}

resource appConfigJwtSecretRef 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:JwtSettings:SecretKey'
  properties: {
    value: '{"uri":"${kvSecretJwtSecret.properties.secretUri}"}'
    contentType: 'application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8'
  }
}

// Additional configuration for JWT settings
resource appConfigJwtIssuer 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:JwtSettings:Issuer'
  properties: {
    value: 'BAAP-API'
    contentType: 'text/plain'
  }
}

resource appConfigJwtAudience 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:JwtSettings:Audience'
  properties: {
    value: 'BAAP-Client'
    contentType: 'text/plain'
  }
}

// UI-specific configuration
resource appConfigFeaturesUseApi 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:Features:UseApi'
  properties: {
    value: 'true'
    contentType: 'text/plain'
  }
}

resource appConfigFeaturesEnableAnalytics 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:Features:EnableAnalytics'
  properties: {
    value: 'true'
    contentType: 'text/plain'
  }
}

resource appConfigFeaturesEnableChatAssistant 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:Features:EnableChatAssistant'
  properties: {
    value: environment == 'prod' ? 'true' : 'false'
    contentType: 'text/plain'
  }
}

resource appConfigFeaturesAdvancedReporting 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:Features:EnableAdvancedReporting'
  properties: {
    value: environment == 'dev' ? 'false' : 'true'
    contentType: 'text/plain'
  }
}

resource appConfigUITheme 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:UI:Theme'
  properties: {
    value: 'light'
    contentType: 'text/plain'
  }
}

resource appConfigUIPageSize 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:UI:DefaultPageSize'
  properties: {
    value: '25'
    contentType: 'text/plain'
  }
}

resource appConfigUIDebugMode 'Microsoft.AppConfiguration/configurationStores/keyValues@2023-03-01' = {
  parent: appConfiguration
  name: 'BAAP:UI:EnableDebugMode'
  properties: {
    value: environment == 'dev' ? 'true' : 'false'
    contentType: 'text/plain'
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${resourcePrefix}-kv-${uniqueSuffix}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: appService.identity.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
          keys: [
            'get'
            'list'
          ]
          certificates: [
            'get'
            'list'
          ]
        }
      }
    ]
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Security'
  }
}

// Key Vault Secrets
resource kvSecretSqlConnection 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'SqlConnectionString'
  properties: {
    value: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabase.name};Persist Security Info=False;User ID=${sqlAdminLogin};Password=${sqlAdminPassword};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
  }
}

resource kvSecretJwtSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'JwtSecretKey'
  properties: {
    value: base64ToString(base64(string(guid('${resourcePrefix}-jwt-secret'))))
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${resourcePrefix}-ai-${uniqueSuffix}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Monitoring'
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${resourcePrefix}-law-${uniqueSuffix}'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: environment == 'dev' ? 30 : 90
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Monitoring'
  }
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${appName}${environment}st${uniqueSuffix}'
  location: location
  sku: {
    name: environment == 'dev' ? 'Standard_LRS' : 'Standard_GRS'
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: false
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'Storage'
  }
}

// CDN Profile (for production only)
resource cdnProfile 'Microsoft.Cdn/profiles@2022-11-01-preview' = if (environment == 'prod') {
  name: '${resourcePrefix}-cdn-${uniqueSuffix}'
  location: 'Global'
  sku: {
    name: 'Standard_Microsoft'
  }
  properties: {
    originResponseTimeoutSeconds: 240
  }
  tags: {
    Environment: environment
    Application: 'BAAP'
    Component: 'CDN'
  }
}

// CDN Endpoint
resource cdnEndpoint 'Microsoft.Cdn/profiles/endpoints@2022-11-01-preview' = if (environment == 'prod') {
  parent: cdnProfile
  name: '${resourcePrefix}-endpoint'
  location: 'Global'
  properties: {
    originHostHeader: staticWebApp.properties.defaultHostname
    isHttpAllowed: false
    isHttpsAllowed: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    origins: [
      {
        name: 'origin1'
        properties: {
          hostName: staticWebApp.properties.defaultHostname
          originHostHeader: staticWebApp.properties.defaultHostname
          priority: 1
          weight: 1000
          enabled: true
        }
      }
    ]
    deliveryPolicy: {
      rules: [
        {
          name: 'Global'
          order: 0
          conditions: []
          actions: [
            {
              name: 'CacheExpiration'
              parameters: {
                cacheBehavior: 'Override'
                cacheType: 'All'
                cacheDuration: '1.00:00:00'
                typeName: 'DeliveryRuleCacheExpirationActionParameters'
              }
            }
          ]
        }
      ]
    }
  }
}

// Outputs
output apiUrl string = 'https://${appService.properties.defaultHostName}'
output webAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output keyVaultName string = keyVault.name
output storageAccountName string = storageAccount.name
output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey
output appConfigurationEndpoint string = appConfiguration.properties.endpoint
output staticWebAppDeploymentToken string = staticWebApp.listSecrets().properties.apiKey
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceStagingUrl string = environment == 'prod' ? 'https://${appService.name}-staging.azurewebsites.net' : ''
output resourceGroupName string = resourceGroup().name
