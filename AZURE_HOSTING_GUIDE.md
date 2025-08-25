# Azure Hosting Architecture Guide for BAAP

This guide provides comprehensive recommendations for hosting the BAAP (Business Application Assessment Platform) on Microsoft Azure.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │    │    .NET API      │    │   SQL Database  │
│  (Static Web)   │───▶│  (App Service)   │───▶│  (Azure SQL)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Azure CDN     │    │  Key Vault       │    │  Log Analytics  │
│  (Content Del.) │    │  (Secrets)       │    │  (Monitoring)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Recommended Azure Resources

### 1. Frontend Hosting - React SPA

#### **Option A: Azure Static Web Apps (Recommended)**
```yaml
Resource: Azure Static Web Apps
Tier: Standard
Features:
  - Built-in CI/CD from GitHub
  - Global CDN distribution
  - Custom domains with SSL
  - Authentication integration
  - API integration with Functions
  - Free SSL certificates
Cost: ~$9/month + bandwidth
```

#### **Option B: Azure App Service + Azure CDN**
```yaml
Resource: App Service (Linux)
Tier: Basic B1 or Standard S1
Features:
  - Custom domains
  - SSL certificates
  - Deployment slots
  - Auto-scaling capabilities
Cost: ~$13-55/month + CDN costs
```

### 2. Backend API - .NET Core

#### **Azure App Service (Recommended)**
```yaml
Resource: App Service (Windows/Linux)
Recommended Tiers:
  - Development: Basic B1 ($13/month)
  - Production: Standard S1 ($55/month)
  - Enterprise: Premium P1V3 ($146/month)

Features:
  - Auto-scaling (Standard+)
  - Deployment slots (Standard+)
  - Custom domains & SSL
  - Application Insights integration
  - Azure AD integration
  - Health checks and monitoring
```

#### **Container Alternative: Azure Container Apps**
```yaml
Resource: Azure Container Apps
Features:
  - Microservices architecture ready
  - Event-driven scaling
  - Built-in load balancing
  - HTTPS ingress
Cost: Pay-per-use (~$20-100/month depending on usage)
```

### 3. Database - Azure SQL

#### **Azure SQL Database (Recommended)**
```yaml
Service Tier Options:
  
Development/Testing:
  - Basic: 5 DTU, 2GB storage ($5/month)
  - Standard S0: 10 DTU, 250GB storage ($15/month)
  
Production:
  - Standard S2: 50 DTU, 250GB storage ($30/month)
  - Standard S4: 200 DTU, 250GB storage ($120/month)
  - General Purpose: 2 vCores, 32GB storage ($200/month)
  
Features:
  - Automatic backups (7-35 days retention)
  - Point-in-time restore
  - Built-in high availability
  - Advanced security features
  - Automatic tuning
```

#### **Azure SQL Managed Instance** (Enterprise scenarios)
```yaml
Use Case: Complex workloads, SQL Agent jobs, CLR
Cost: Starts at ~$600/month
Features:
  - Near 100% SQL Server compatibility
  - VNet integration
  - Advanced security
```

### 4. Authentication & Security

#### **Azure Active Directory B2C**
```yaml
Resource: Azure AD B2C
Cost: 
  - First 50,000 users/month: Free
  - Additional users: $0.00325 per user
Features:
  - Social login providers
  - Custom policies
  - Multi-factor authentication
  - Self-service password reset
```

#### **Azure Key Vault**
```yaml
Resource: Key Vault
Cost: ~$1-3/month + per-operation costs
Stores:
  - Database connection strings
  - API keys
  - JWT signing certificates
  - Third-party service credentials
```

### 5. Monitoring & Logging

#### **Application Insights**
```yaml
Resource: Application Insights
Cost: 
  - First 5GB/month: Free
  - Additional: $2.88/GB
Features:
  - Performance monitoring
  - Exception tracking
  - User analytics
  - Custom metrics
  - Alerts and notifications
```

#### **Log Analytics Workspace**
```yaml
Resource: Log Analytics
Cost: Pay-per-GB ingested
Features:
  - Centralized logging
  - Security monitoring
  - Performance analytics
  - Custom queries (KQL)
```

### 6. Content Delivery & Storage

#### **Azure CDN**
```yaml
Resource: Azure CDN (Microsoft/Verizon)
Cost: ~$0.081/GB + $0.0075 per 10,000 requests
Use Cases:
  - Static assets (CSS, JS, images)
  - API response caching
  - Global content distribution
```

#### **Azure Blob Storage**
```yaml
Resource: Storage Account (Hot tier)
Cost: ~$0.018/GB/month + transaction costs
Use Cases:
  - File uploads from assessments
  - Report generation and storage
  - Application logs and backups
```

## Deployment Architecture Recommendations

### Development Environment
```yaml
Resource Group: rg-baap-dev
Resources:
  - App Service: Basic B1 (API)
  - Static Web App: Free tier (Frontend)
  - SQL Database: Basic 5 DTU
  - Application Insights: Free tier
  - Storage Account: Standard LRS
Total Cost: ~$35/month
```

### Production Environment
```yaml
Resource Group: rg-baap-prod
Resources:
  - App Service: Standard S1 (API)
  - Static Web App: Standard tier (Frontend)
  - SQL Database: Standard S2 50 DTU
  - Application Insights: Pay-as-you-go
  - Key Vault: Standard
  - CDN: Microsoft Standard
  - Storage Account: Standard GRS
Total Cost: ~$200/month
```

### Enterprise Environment
```yaml
Resource Group: rg-baap-enterprise
Resources:
  - App Service: Premium P1V3 (API) + staging slot
  - Static Web App: Standard tier (Frontend)
  - SQL Database: General Purpose 4 vCores
  - Application Insights: Pay-as-you-go
  - Key Vault: Premium (HSM)
  - CDN: Verizon Premium
  - Azure AD B2C: Premium P1
  - Storage Account: Premium SSD
Total Cost: ~$800/month
```

## Security Configuration

### Network Security
```yaml
Frontend Security:
  - HTTPS only
  - Content Security Policy headers
  - CORS configuration
  - DDoS protection (via CDN)

API Security:
  - VNet integration (Premium tiers)
  - Private endpoints for database
  - IP restrictions
  - Azure AD authentication
  - Rate limiting

Database Security:
  - Firewall rules (Azure services only)
  - Transparent Data Encryption (TDE)
  - Always Encrypted for sensitive data
  - Vulnerability assessments
  - Audit logging
```

### Identity & Access Management
```yaml
Authentication Flow:
  1. React SPA authenticates with Azure AD B2C
  2. Receives JWT token
  3. API validates JWT with Azure AD
  4. API accesses database with managed identity

Service-to-Service:
  - Managed Identity for App Service to SQL
  - Key Vault references for connection strings
  - Service Principal for CI/CD deployments
```

## Deployment Strategy

### CI/CD Pipeline (Azure DevOps)
```yaml
Pipeline Stages:
  1. Build & Test
     - .NET API build and unit tests
     - React build and optimization
     - Security scanning (Snyk/SonarQube)
  
  2. Infrastructure as Code
     - ARM templates or Bicep
     - Resource deployment
     - Configuration updates
  
  3. Application Deployment
     - API deployment to App Service
     - React deployment to Static Web Apps
     - Database migration scripts
  
  4. Post-Deployment
     - Integration tests
     - Performance tests
     - Security validation
```

### Database Migration Strategy
```yaml
Migration Approach:
  1. Entity Framework Core migrations
  2. Blue-green deployment for zero downtime
  3. Backup before each deployment
  4. Rollback procedures

Scripts Location:
  - /BAAP.API/Migrations/
  - Data seeding through DataSeederService
  - Production data scripts separate
```

## Scaling Considerations

### Auto-Scaling Configuration
```yaml
App Service Auto-Scaling:
  Triggers:
    - CPU > 70% for 5 minutes: Scale out
    - CPU < 30% for 10 minutes: Scale in
    - Memory > 80%: Scale out
    - Queue length > 100: Scale out
  
  Limits:
    - Min instances: 2
    - Max instances: 10
    - Scale increment: 1 instance
```

### Database Scaling
```yaml
SQL Database Scaling:
  - DTU-based: Scale up/down based on performance
  - vCore-based: Scale compute and storage independently
  - Read replicas for read-heavy workloads
  - Elastic pools for multiple databases
```

## Disaster Recovery

### Backup Strategy
```yaml
Database Backups:
  - Automatic backups (7-35 days retention)
  - Long-term retention (weekly/monthly/yearly)
  - Cross-region backup replication

Application Backups:
  - Source code in Git repositories
  - Configuration in Key Vault
  - Application data in geo-redundant storage
```

### Business Continuity
```yaml
RTO/RPO Targets:
  - RTO (Recovery Time): < 4 hours
  - RPO (Recovery Point): < 15 minutes

Strategy:
  - Active-passive deployment across regions
  - Database failover groups
  - Traffic Manager for DNS failover
  - Automated failover procedures
```

## Cost Optimization

### Cost Management Tips
```yaml
Development:
  - Use B-series burstable VMs
  - Start/stop non-production resources
  - Use development/test pricing
  - Leverage free tiers where possible

Production:
  - Reserved instances for predictable workloads
  - Azure Hybrid Benefit for Windows licensing
  - Spot instances for batch processing
  - Regular cost reviews and optimizations
```

### Monitoring & Alerts
```yaml
Budget Alerts:
  - Monthly budget thresholds
  - Resource-specific budgets
  - Cost anomaly detection
  - Usage optimization recommendations

Performance Alerts:
  - API response time > 2 seconds
  - Database DTU > 80%
  - Application errors > 5%
  - Storage space > 80%
```

## Implementation Roadmap

### Phase 1: Basic Deployment (Week 1-2)
- [ ] Create Azure subscription and resource groups
- [ ] Deploy App Service for API
- [ ] Deploy Azure SQL Database
- [ ] Configure Static Web Apps for React frontend
- [ ] Set up Application Insights
- [ ] Configure Azure AD B2C

### Phase 2: Security & Monitoring (Week 3-4)
- [ ] Implement Key Vault for secrets
- [ ] Configure managed identity
- [ ] Set up Log Analytics
- [ ] Implement security headers and CORS
- [ ] Configure SSL certificates

### Phase 3: CI/CD & Automation (Week 5-6)
- [ ] Create Azure DevOps pipelines
- [ ] Implement Infrastructure as Code
- [ ] Set up automated testing
- [ ] Configure deployment slots
- [ ] Implement database migrations

### Phase 4: Optimization & Scaling (Week 7-8)
- [ ] Configure auto-scaling
- [ ] Implement CDN
- [ ] Set up monitoring dashboards
- [ ] Configure backup and disaster recovery
- [ ] Performance optimization

## Cost Estimates Summary

| Environment | Monthly Cost | Annual Cost | Key Features |
|-------------|-------------|-------------|--------------|
| Development | $35-50 | $420-600 | Basic tiers, minimal redundancy |
| Production | $200-300 | $2,400-3,600 | Standard tiers, backups, monitoring |
| Enterprise | $800-1,200 | $9,600-14,400 | Premium tiers, HA, advanced security |

*Costs are estimates and may vary based on usage patterns, data transfer, and specific configuration choices.*

## Next Steps

1. **Assessment**: Evaluate current requirements and choose appropriate tier
2. **Planning**: Create detailed deployment plan and timeline  
3. **Setup**: Create Azure subscription and initial resource groups
4. **Implementation**: Follow the phased deployment approach
5. **Testing**: Validate functionality and performance
6. **Go-Live**: Deploy to production with monitoring
7. **Optimization**: Continuous monitoring and cost optimization

This architecture provides a robust, scalable, and secure foundation for hosting the BAAP application on Azure while maintaining cost-effectiveness across different deployment scenarios.