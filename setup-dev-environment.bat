@echo off
echo 🚀 BAAP Development Environment Setup
echo =====================================

:: Check if running in correct directory
if not exist "BAAP.sln" (
    echo Error: Please run this script from the BAAP root directory
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

:: Install .NET dependencies
echo Installing .NET API dependencies...
cd BAAP.API
dotnet restore
if %ERRORLEVEL% neq 0 (
    echo Failed to restore .NET dependencies
    pause
    exit /b 1
)
cd ..

:: Install React dependencies
echo Installing React frontend dependencies...
if exist "package.json" (
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Failed to install React dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies installed successfully

echo 🗄️ Setting up database...
cd BAAP.API

:: Create migration if it doesn't exist
if not exist "Migrations" (
    echo Creating initial migration...
    dotnet ef migrations add InitialCreate
    if %ERRORLEVEL% neq 0 (
        echo Failed to create migration
        pause
        exit /b 1
    )
)

:: Update database
echo Updating database schema...
dotnet ef database update
if %ERRORLEVEL% neq 0 (
    echo Failed to update database
    pause
    exit /b 1
)

:: Build the project
echo Building API project...
dotnet build
if %ERRORLEVEL% neq 0 (
    echo Failed to build API project
    pause
    exit /b 1
)

cd ..

echo ✅ Database setup completed

echo ⚙️ Creating development configuration...

:: Create development environment file
(
echo # BAAP Development Environment Variables
echo REACT_APP_USE_API=true
echo REACT_APP_API_BASE_URL=https://localhost:7001/api
echo REACT_APP_ENVIRONMENT=development
echo.
echo # Database Configuration
echo DATABASE_TYPE=sqlite
echo.
echo # Authentication Configuration
echo USE_AZURE_B2C=false
) > .env.development

echo ✅ Development configuration created

echo.
echo 🎉 Development environment setup completed!
echo.
echo Mock data includes:
echo   • 3 sample assessments
echo   • 8 sample applications  
echo   • 10 security findings
echo   • 6 business drivers
echo   • 8 stakeholders
echo   • 10 recommendations
echo.
echo 🎯 Next Steps:
echo To start the development servers:
echo   1. API Server:      cd BAAP.API ^&^& dotnet run
echo   2. React Frontend:  npm start
echo.
echo ✨ Setup completed successfully! Happy coding! ✨

pause