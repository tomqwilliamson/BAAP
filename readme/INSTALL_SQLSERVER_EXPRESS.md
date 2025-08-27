# SQL Server Express Installation Guide for BAAP

This guide will help you install and configure SQL Server Express for BAAP development.

## Quick Installation

### Step 1: Download SQL Server Express
1. Go to: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Click **Download now** under "Express"
3. Run the downloaded installer

### Step 2: Installation Options
Choose **Basic** installation for the simplest setup:
- This installs SQL Server Express with default settings
- Instance name will be `SQLEXPRESS`
- Uses Windows Authentication
- Installs to default location

### Step 3: Verify Installation
After installation, run the connection test:
```powershell
.\test-sqlserver-connection.ps1
```

## Manual Configuration (If Needed)

### If you chose Custom installation:
1. **Instance Configuration**:
   - Instance Name: `SQLEXPRESS`
   - Instance root directory: Use default

2. **Database Engine Configuration**:
   - Authentication Mode: **Windows Authentication Mode** (recommended)
   - Or **Mixed Mode** if you need SQL Server authentication

3. **Service Configuration**:
   - Service Account: Use default (NT Service accounts)
   - Start Type: **Automatic** (recommended)

## Verification Steps

### 1. Check Windows Services
```powershell
Get-Service -Name "MSSQL$SQLEXPRESS"
```
Should show status as "Running"

### 2. Test Connection
```powershell
sqlcmd -S "localhost\SQLEXPRESS" -Q "SELECT @@VERSION"
```

### 3. Run BAAP Connection Test
```powershell
.\test-sqlserver-connection.ps1
```

## Troubleshooting

### Service Won't Start
```powershell
# Start service manually
Start-Service -Name "MSSQL$SQLEXPRESS"

# Check service status
Get-Service -Name "MSSQL$SQLEXPRESS"
```

### Can't Connect
1. **Check Windows Firewall**: SQL Server Express should be allowed
2. **Verify Instance Name**: Must be exactly `SQLEXPRESS`
3. **Check User Permissions**: Your Windows user needs access

### Alternative: SQL Server Management Studio
Install SSMS to manage your databases visually:
1. Download from: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
2. Connect to: `localhost\SQLEXPRESS`
3. Use Windows Authentication

## What the BAAP Application Needs

The BAAP application is configured to use:
- **Server**: `localhost\SQLEXPRESS`
- **Database**: `BAAP_Dev` (created automatically)
- **Authentication**: Windows Authentication (Trusted Connection)
- **Connection String**: `Server=localhost\SQLEXPRESS;Database=BAAP_Dev;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true`

## After Installation

Once SQL Server Express is installed and running:

1. **Test the connection**:
   ```powershell
   .\test-sqlserver-connection.ps1
   ```

2. **Run the BAAP setup**:
   ```powershell
   .\setup-dev-environment.ps1
   ```

3. **Start development**:
   ```bash
   cd BAAP.API
   dotnet run
   ```

The setup script will:
- Create the `BAAP_Dev` database
- Run Entity Framework migrations
- Seed the database with sample data
- Verify everything is working

## System Requirements

- Windows 10/11 or Windows Server
- .NET Framework 4.6.2 or later (usually already installed)
- At least 1GB free disk space
- Sufficient memory (2GB+ recommended)

## Next Steps

After successful installation, return to the main setup guide:
- Run `.\setup-dev-environment.ps1`
- Follow the instructions in `DATA_SETUP_GUIDE.md`