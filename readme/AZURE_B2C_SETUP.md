# Azure B2C Authentication Setup Guide

## Overview
This application now includes Azure Active Directory B2C (Azure AD B2C) authentication integration, providing enterprise-grade security for your Application Assessment Platform.

## Features Implemented
- **Landing Page**: Modern, sales-focused landing page with company information
- **Azure B2C Integration**: Secure authentication using Microsoft's identity platform
- **Protected Routes**: Dashboard and assessment tools require authentication
- **User Profile**: Display authenticated user information in the header
- **Sign Out Functionality**: Clean logout flow returning to landing page

## Azure B2C Configuration Required

### 1. Create Azure B2C Tenant
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Azure AD B2C tenant
3. Note your tenant name (e.g., `yourtenant`)

### 2. Register Application
1. In your B2C tenant, go to "App registrations"
2. Click "New registration"
3. Configure:
   - **Name**: BAAP Business Application Assessment Platform
   - **Supported account types**: Accounts in any identity provider or organizational directory
   - **Redirect URI**: `http://localhost:3000` (for development)
   - **Platform**: Single-page application (SPA)

### 3. Configure User Flow
1. Go to "User flows" in your B2C tenant
2. Create a new "Sign up and sign in" user flow
3. Name it `B2C_1_signupsignin` (or update the authority URL accordingly)
4. Configure identity providers (Local accounts, Social accounts, etc.)
5. Configure user attributes and application claims

### 4. Application Configuration
Copy the `.env.example` file to `.env` and update with your values:

```env
# Azure B2C Configuration
REACT_APP_AZURE_CLIENT_ID=your-client-id-from-app-registration
REACT_APP_AZURE_AUTHORITY=https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_signupsignin
REACT_APP_AZURE_KNOWN_AUTHORITY=yourtenant.b2clogin.com
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# API Configuration
REACT_APP_API_BASE_URL=https://localhost:7001/api
```

### 5. Update Production Settings
For production deployment:
1. Add production redirect URIs to your B2C app registration
2. Update environment variables with production values
3. Ensure HTTPS is used for all redirect URIs

## Application Structure

### New Components
- `src/components/landing/LandingPage.js` - Marketing/sales landing page
- `src/components/auth/LoginPage.js` - Authentication page
- `src/components/auth/SignInButton.js` - Reusable sign-in component
- `src/components/auth/SignOutButton.js` - Sign-out functionality
- `src/components/auth/ProtectedRoute.js` - Route protection wrapper
- `src/authConfig.js` - MSAL configuration

### Updated Components
- `src/app.js` - Added MSAL provider and routing
- `src/components/layout/header.js` - Added user profile and sign-out
- `src/components/layout/sidebar.js` - Updated routes for `/app/*` prefix
- `src/components/layout/layout.js` - Now nested under protected routes

### Route Structure
- `/` - Landing page (public)
- `/login` - Login page (public) 
- `/app/*` - Protected application routes requiring authentication
  - `/app/dashboard` - Main dashboard
  - `/app/assessments/*` - Assessment tools
  - All other existing routes prefixed with `/app`

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure B2C settings
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Test Authentication**
   - Visit `http://localhost:3000` for the landing page
   - Click "Sign In" to test Azure B2C authentication
   - After authentication, you'll be redirected to `/app/dashboard`

## Security Features

### Authentication Flow
1. User visits landing page (public)
2. Clicks sign in → redirected to Azure B2C
3. After successful authentication → redirected to protected app
4. Access token stored securely in session storage
5. Protected routes automatically check authentication status

### Session Management
- Tokens stored in browser session storage (cleared on browser close)
- Automatic token refresh handled by MSAL
- Sign out clears all session data

### Route Protection
- All `/app/*` routes require authentication
- Unauthenticated users redirected to login page
- Return URL preserved for seamless experience after login

## Customization

### Branding
- Update `src/components/landing/LandingPage.js` for company-specific content
- Modify colors and styling in Tailwind classes
- Replace logo files in `public/` directory

### User Experience
- Customize login page in `src/components/auth/LoginPage.js`
- Modify user profile display in header component
- Add additional user claims from B2C token

### Security Settings
- Update scopes in `src/authConfig.js` as needed
- Configure additional B2C policies for password reset, profile edit
- Add API permissions if integrating with backend services

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure redirect URIs are properly configured in Azure B2C
   - Check that authority URL matches your B2C tenant

2. **Authentication Loops**
   - Verify client ID and tenant configuration
   - Check browser developer tools for detailed error messages

3. **Token Issues**
   - Clear browser storage and try again
   - Verify user flow configuration in Azure B2C

4. **Routing Problems**
   - Ensure all internal links use `/app/*` prefix for protected routes
   - Check that ProtectedRoute component is properly wrapping routes

### Debug Mode
Enable MSAL debugging by setting log level in `authConfig.js`:
```javascript
system: {
  loggerOptions: {
    loggerCallback: (level, message, containsPii) => {
      console.log(message);
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Verbose
  }
}
```

## Next Steps

1. **API Integration**: Update backend API to validate B2C tokens
2. **Role-Based Access**: Implement role-based permissions using B2C claims
3. **Advanced Features**: Add profile editing, password reset flows
4. **Monitoring**: Set up application insights for authentication metrics

## Support

For Azure B2C specific issues, consult:
- [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)
- [MSAL.js Documentation](https://docs.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications)

For application-specific issues, check the browser developer console for detailed error messages.