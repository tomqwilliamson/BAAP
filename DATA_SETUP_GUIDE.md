# BAAP Data Setup Guide

This guide explains how the BAAP (Business Application Assessment Platform) handles data flow between React components, API endpoints, and the database, including mock data setup and seeding.

## Overview

The BAAP system has been configured with comprehensive data seeding and flexible API/mock data switching to support both development and demonstration scenarios.

## Data Flow Architecture

```
React Components → apiService.js → assessmentService.js → .NET API Controllers → Entity Framework → Database
                      ↓
                 Mock Data (Fallback)
```

## Components Completed

✅ **Mock Data Extraction**: Extracted comprehensive mock data from React components into structured JSON files
✅ **Database Seeding**: Created robust seeding service with realistic data
✅ **Migration Scripts**: SQL scripts for Azure SQL population  
✅ **Development Setup**: Automated setup scripts for easy environment configuration
✅ **API Integration**: Seamless switching between API and mock data

## Files Created/Modified

### Mock Data Files
- `src/data/mockData.json` - Core application and assessment data
- `src/data/securityMockData.json` - Security assessment data
- `src/data/recommendationsMockData.json` - Recommendations and business case data

### Database & API
- `BAAP.API/Services/DataSeederService.cs` - Enhanced seeding service
- `BAAP.API/Migrations/20250825000001_SeedMockData.sql` - SQL seeding script
- `BAAP.API/Program.cs` - Already configured for auto-seeding in development

### Setup Scripts
- `setup-dev-environment.ps1` - PowerShell setup script
- `setup-dev-environment.bat` - Batch file for Windows users

### Services  
- `src/services/apiService.js` - Enhanced with better logging and fallback logic

## Data Seeding Details

### Seeded Data Includes:
- **3 Sample Assessments**:
  - Q4 2024 Portfolio Assessment (Completed)
  - Security Compliance Review (InProgress) 
  - Cloud Migration Readiness (Analyzing)

- **8 Sample Applications**:
  - Customer Portal Web App (React SPA)
  - Internal ERP System (.NET Core API)
  - Mobile Banking App (React Native)
  - Legacy Payment Gateway (Java Spring)
  - Employee Management System (ASP.NET MVC)
  - Data Analytics Platform (Python Django)
  - E-commerce API (Node.js API)
  - Document Management System (SharePoint)

- **10 Security Findings**: SQL injection, XSS, weak passwords, etc.
- **6 Business Drivers**: Digital transformation, cost optimization, etc.
- **8 Stakeholders**: CTO, CISO, developers, business analysts
- **10 Recommendations**: Zero trust security, containerization, cloud migration, etc.

## Environment Configuration

### Development Environment Variables
```bash
# Enable/disable API calls (fallback to mock data when disabled)
REACT_APP_USE_API=true
REACT_APP_API_BASE_URL=https://localhost:7001/api
REACT_APP_ENVIRONMENT=development
```

### Database Configuration
- **Development**: Uses SQLite by default (`baap.db`)
- **Production**: Configurable for Azure SQL Server
- **Data Seeding**: Automatic in development mode

## Quick Start

### Option 1: PowerShell (Recommended)
```powershell
# Basic setup
.\setup-dev-environment.ps1

# Reset data and start fresh
.\setup-dev-environment.ps1 -ResetData

# Use Azure SQL instead of SQLite
.\setup-dev-environment.ps1 -UseAzureSQL -ConnectionString "your-connection-string"
```

### Option 2: Batch File
```cmd
setup-dev-environment.bat
```

### Option 3: Manual Setup
```bash
# Install dependencies
cd BAAP.API && dotnet restore && cd ..
npm install

# Setup database
cd BAAP.API
dotnet ef migrations add InitialCreate  # If no migrations exist
dotnet ef database update
dotnet build
cd ..

# Start services
# Terminal 1: cd BAAP.API && dotnet run  
# Terminal 2: npm start
```

## API vs Mock Data Switching

The system automatically handles API/mock data switching:

### When API is Available:
```javascript
// apiService.js automatically uses real API
const data = await apiService.getDashboardOverview();
// Logs: "✅ Dashboard data loaded from API"
```

### When API is Unavailable:
```javascript
// apiService.js falls back to mock data
const data = await apiService.getDashboardOverview(); 
// Logs: "⚠️ API call failed, falling back to mock data"
```

### Force Mock Data Mode:
```javascript
// Set in environment variables
REACT_APP_USE_API=false
// Logs: "📄 Using mock dashboard data (API disabled)"
```

## Database Views Created

The seeding script creates helpful database views:

- `vw_DashboardMetrics` - Quick access to dashboard KPIs
- `vw_PortfolioSummary` - Application portfolio summary with security findings

## Verification Steps

### 1. Check Database Seeding
```sql
-- Verify data was seeded
SELECT COUNT(*) FROM Assessments;  -- Should return 3
SELECT COUNT(*) FROM Applications; -- Should return 8
SELECT COUNT(*) FROM SecurityFindings; -- Should return 10
```

### 2. Test API Endpoints
```bash
# Test dashboard endpoint
curl https://localhost:7001/api/dashboard/overview

# Test portfolio endpoint  
curl https://localhost:7001/api/dashboard/portfolio
```

### 3. Verify React Integration
- Check browser console for API/mock data logs
- Dashboard should show realistic metrics
- Applications should display with security findings
- Assessments should load with proper statuses

## Data Consistency

The mock data has been carefully crafted to maintain referential integrity:
- Applications are properly linked to assessments
- Security findings reference valid applications  
- Business drivers and stakeholders belong to valid assessments
- Recommendations are tied to appropriate assessments

## Production Considerations

### Azure SQL Setup
1. Update connection string in `appsettings.json`
2. Run migration: `dotnet ef database update --environment Production`
3. Optionally run SQL seeding script for demo data
4. Set `REACT_APP_USE_API=true` in production environment

### Security
- The seeding service only runs in Development environment
- Mock data contains no sensitive information
- API endpoints respect authentication/authorization when configured

## Troubleshooting

### Common Issues:

**Database Connection Issues:**
```bash
# Reset SQLite database
rm BAAP.API/baap.db
cd BAAP.API && dotnet ef database update
```

**API Not Starting:**
```bash
# Check for port conflicts
netstat -ano | findstr :7001
# Or change port in launchSettings.json
```

**Mock Data Not Loading:**
- Check `REACT_APP_USE_API` environment variable
- Verify mock JSON files exist in `src/data/`
- Check browser console for loading errors

**Migration Issues:**
```bash
# Remove and recreate migrations
cd BAAP.API
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Next Steps

With the data infrastructure now complete, the system supports:
- ✅ End-to-end data flow from UI to database
- ✅ Seamless development environment setup
- ✅ Realistic demo data for presentations
- ✅ Flexible deployment options (SQLite/Azure SQL)
- ✅ Graceful fallback to mock data when needed

The application is now ready for development, testing, and demonstration with a fully populated database and robust data handling layer.