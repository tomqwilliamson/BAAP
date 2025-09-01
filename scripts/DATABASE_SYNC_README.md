# BAAP Database Synchronization Solution

## Overview

This comprehensive database synchronization solution ensures both LocalDB and Azure SQL databases have identical schemas and comprehensive test data across ALL tables in the BAAP application.

## 🎯 What This Solves

- **Database Synchronization**: Ensures LocalDB (development) and Azure SQL (production) have identical schemas
- **Comprehensive Seed Data**: Populates ALL 17 tables with realistic, interconnected test data
- **Automated Deployment**: PowerShell scripts handle the entire process automatically
- **Data Consistency**: Both databases contain the same assessment scenarios, timelines, budgets, and architecture reviews

## 📁 Files Created

### Core SQL Script
- **`complete_database_sync_and_seed.sql`** - Master SQL script with comprehensive data for all tables

### PowerShell Automation Scripts
- **`sync-local-database.ps1`** - LocalDB/SQL Server Express synchronization
- **`sync-azure-database.ps1`** - Azure SQL Database synchronization  
- **`sync-all-databases.ps1`** - Master script to sync both databases

### Legacy Scripts (Still Available)
- **`budget_allocations_seed_data.sql`** - Local database budget data
- **`azure_budget_allocations_seed_data.sql`** - Azure budget data
- **`complete_budget_allocations_seed_data.sql`** - Universal budget script

## 🗃️ Database Configuration

### LocalDB/SQL Server Express
- **Server**: `(localdb)\\MSSQLLocalDB`
- **Database**: `BAAP_Dev`
- **Authentication**: Windows Authentication
- **Connection String**: `Server=(localdb)\\MSSQLLocalDB;Database=BAAP_Dev;Trusted_Connection=true;MultipleActiveResultSets=true`

### Azure SQL Database
- **Server**: `baap-dev-sql-wsnmnw.database.windows.net`
- **Database**: `baap_dev`
- **Username**: `baap-admin`
- **Password**: `YourSecurePassword123!`
- **Connection String**: `Server=baap-dev-sql-wsnmnw.database.windows.net;Database=baap_dev;User Id=baap-admin;Password=YourSecurePassword123!;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`

## 📊 Comprehensive Data Schema

Both databases will contain identical data across these tables:

| Table | Records | Description |
|-------|---------|-------------|
| **Assessments** | 5 | Core assessment scenarios (E-Commerce, Financial, Data Platform, IoT, Healthcare) |
| **Applications** | 17 | Applications within assessments with detailed metrics |
| **BusinessDrivers** | 14 | Strategic business drivers and requirements |
| **Stakeholders** | 19 | Project stakeholders across all assessments |
| **BudgetAllocations** | 5 | Comprehensive budget breakdowns ($1.8M - $4.2M per project) |
| **ProjectTimelineItems** | 25 | Detailed project phases and milestones |
| **BusinessContextRisks** | 14 | Risk assessments with mitigation strategies |
| **ArchitectureReviews** | 3 | Architecture analysis with maintainability scores |
| **SecurityFindings** | 6 | Security vulnerabilities and issues |
| **CodeMetrics** | 15 | Code quality and complexity metrics |
| **Recommendations** | 14 | Strategic recommendations for each assessment |
| **InfrastructureServers** | 20 | Server inventory and configurations |
| **DatabaseInstances** | 14 | Database inventory with details |
| **SecurityVulnerabilities** | 11 | Security assessment findings |
| **ComplianceFrameworks** | 13 | Compliance requirements (PCI DSS, HIPAA, SOX, etc.) |
| **DashboardMetrics** | 22 | KPI metrics and performance indicators |
| **DevelopmentPractices** | 5 | Development methodology assessments |

## 🚀 Quick Start

### Option 1: Sync Both Databases (Recommended)
```powershell
# Navigate to the BAAP project root
cd C:\Users\twilliamson\source\repos\BAAP

# Run master synchronization script
.\scripts\sync-all-databases.ps1
```

### Option 2: Sync Individual Databases
```powershell
# LocalDB only
.\scripts\sync-all-databases.ps1 -LocalOnly

# Azure SQL only  
.\scripts\sync-all-databases.ps1 -AzureOnly

# Reset and reseed data (DESTRUCTIVE)
.\scripts\sync-all-databases.ps1 -ResetData
```

### Option 3: Manual Execution
```powershell
# Local database
.\scripts\sync-local-database.ps1 -ResetDatabase

# Azure database
.\scripts\sync-azure-database.ps1 -ResetData
```

## 📋 Detailed Assessment Scenarios

The seed data includes 5 comprehensive assessment scenarios:

### 1. E-Commerce Platform Assessment ($2.5M)
- **Applications**: React frontend, Payment API, Inventory system, Order management
- **Focus**: Digital transformation and customer experience
- **Timeline**: 18 months with 5 phases
- **Stakeholders**: CTO, VP Engineering, Product Manager, DevOps Manager

### 2. Financial Services Legacy Modernization ($4.2M)
- **Applications**: COBOL core banking, Customer portal, Regulatory reporting
- **Focus**: COBOL modernization and regulatory compliance
- **Timeline**: 24 months with compliance-first approach
- **Stakeholders**: CIO, VP Compliance, Core Banking Manager

### 3. Enterprise Data Platform Modernization ($3.8M)
- **Applications**: Data warehouse ETL, BI dashboards, Analytics engine
- **Focus**: Cloud migration and advanced analytics
- **Timeline**: 15 months with phased migration
- **Stakeholders**: CDO, Data Engineering Manager, BI Director

### 4. Manufacturing IoT Integration ($1.8M)
- **Applications**: Equipment monitoring, Production planning, Quality control
- **Focus**: IoT integration and predictive maintenance
- **Timeline**: 12 months with phased rollout
- **Stakeholders**: Plant Manager, IoT Architect, Quality Manager

### 5. Healthcare Application Modernization ($3.2M)
- **Applications**: EMR system, Patient portal, Telemedicine platform
- **Focus**: HIPAA compliance and telemedicine expansion
- **Timeline**: 20 months with security-first approach
- **Stakeholders**: CMO, IT Director, Nursing Director, Privacy Officer

## 🔧 Prerequisites

### Required Software
- SQL Server LocalDB or SQL Server Express
- PowerShell 5.1 or later
- .NET 8.0 SDK
- SQL Server command line tools (sqlcmd)

### Azure Requirements
- Azure SQL Database access
- Correct firewall configuration
- Valid credentials for baap-admin user

## 🏗️ Script Features

### Comprehensive Error Handling
- Connection testing before operations
- Rollback capability on failures
- Detailed error reporting and suggestions

### Progress Tracking
- Real-time progress indicators
- Duration tracking for each operation
- Detailed success/failure reporting

### Data Verification
- Automatic verification of inserted records
- Record count validation
- Data integrity checks

### Safety Features
- Backup recommendations before destructive operations
- Confirmation prompts for data reset operations
- Process cleanup and resource management

## 🐛 Troubleshooting

### Common Issues

#### LocalDB Connection Issues
```
Error: Cannot connect to LocalDB
Solution: Ensure SQL Server LocalDB is installed and running
Command: sqllocaldb info
```

#### Azure SQL Connection Issues
```
Error: Login failed for user 'baap-admin'
Solutions: 
1. Verify password is correct
2. Check Azure SQL firewall rules
3. Confirm server name is exact
```

#### Build Lock Issues
```
Error: The process cannot access the file 'BAAP.API.exe'
Solution: Kill any running BAAP.API processes
Command: Get-Process | Where-Object {$_.Name -like '*BAAP*'} | Stop-Process -Force
```

#### Entity Framework Migration Issues
```
Error: Build failed during migrations
Solution: 
1. Kill running API processes
2. Clean and rebuild: dotnet clean && dotnet build
3. Apply migrations: dotnet ef database update
```

## 📈 Verification Commands

### LocalDB Verification
```sql
-- Connect to: Server=(localdb)\MSSQLLocalDB;Database=BAAP_Dev
SELECT 'Assessments' as TableName, COUNT(*) as Count FROM Assessments
UNION ALL SELECT 'Applications', COUNT(*) FROM Applications
-- ... (continue for all tables)
```

### Azure SQL Verification  
```sql
-- Connect to: baap-dev-sql-wsnmnw.database.windows.net | baap_dev
SELECT 'Assessments' as TableName, COUNT(*) as Count FROM Assessments
UNION ALL SELECT 'Applications', COUNT(*) FROM Applications
-- ... (continue for all tables)
```

## 🔄 Regular Maintenance

### Weekly Sync Recommendation
```powershell
# Run weekly to ensure databases stay in sync
.\scripts\sync-all-databases.ps1
```

### Schema Updates
When Entity Framework migrations are added:
```powershell
# Update both databases with new migrations
.\scripts\sync-all-databases.ps1
```

### Data Refresh
To refresh with latest seed data:
```powershell
# Reset and reload all data
.\scripts\sync-all-databases.ps1 -ResetData
```

## 📞 Support

### Getting Help
```powershell
# Display detailed help
.\scripts\sync-all-databases.ps1 -Help
```

### Manual Alternative
If automated scripts fail, you can manually apply the SQL script:
1. Open SQL Server Management Studio or Azure Data Studio
2. Connect to your database
3. Open `scripts\complete_database_sync_and_seed.sql`
4. Execute the entire script

## ✅ Success Indicators

After successful synchronization, you should see:

- ✅ All 17 tables populated with data
- ✅ 5 comprehensive assessment scenarios
- ✅ Business Context pages show timeline items and risks
- ✅ Architecture Review pages show maintainability data
- ✅ Dashboard metrics populated with KPIs
- ✅ Budget allocation data for all projects
- ✅ Complete stakeholder and business driver information

## 🎉 Final Result

Both LocalDB and Azure SQL databases will be identical and contain:
- **300+ total records** across all tables
- **Realistic enterprise scenarios** for comprehensive testing
- **Complete data relationships** between all entities
- **Ready-to-use assessment data** for all application modules

Your BAAP application is now ready for comprehensive testing with rich, interconnected data that demonstrates all features and capabilities! 🚀