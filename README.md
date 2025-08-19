# Application Assessment Platform

AI-Powered Enterprise Application Assessment Software built with React and .NET.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or create your project directory**
```bash
mkdir application-assessment-ui
cd application-assessment-ui
```

2. **Initialize and install dependencies**
```bash
npm init -y
npm install react@^18.2.0 react-dom@^18.2.0 react-scripts@5.0.1
npm install react-router-dom@^6.8.0 recharts@^2.5.0 lucide-react@^0.263.1
npm install axios@^1.3.4 tailwindcss@^3.2.7 autoprefixer@^10.4.14 postcss@^8.4.21
npm install @headlessui/react@^1.7.13 classnames@^2.3.2 date-fns@^2.29.3
npm install react-hot-toast@^2.4.0 @tailwindcss/forms@^0.5.3
```

3. **Copy all the provided files into their respective locations**

4. **Initialize Tailwind CSS**
```bash
npx tailwindcss init -p
```

5. **Start the development server**
```bash
npm start
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.js           # Main layout with routing
│   │   ├── Sidebar.js          # Left navigation menu
│   │   └── Header.js           # Top header
│   ├── Dashboard/
│   │   ├── Dashboard.js        # Main dashboard (startup page)
│   │   ├── MetricsOverview.js  # Key metrics cards
│   │   ├── PortfolioSummary.js # Portfolio table
│   │   ├── RecentActivity.js   # Activity timeline
│   │   └── TrendAnalysis.js    # Charts & trends
│   ├── Assessment/
│   │   ├── CreateAssessment.js # New assessment form
│   │   └── AssessmentDetail.js # Assessment details
│   ├── Security/
│   │   └── SecurityAssessment.js # Security analysis
│   └── [Other components as needed]
├── contexts/
│   └── AssessmentContext.js    # Global state management
├── services/
│   └── assessmentService.js    # API service layer
├── App.js                      # Main app component
├── App.css                     # Application styles
├── index.js                    # React entry point
└── index.css                   # Global styles + Tailwind
```

## 🎯 Key Features

### Dashboard (Startup Page)
- **Executive Overview**: Portfolio health at-a-glance
- **Metrics Cards**: Applications assessed, scores, critical issues, savings
- **Portfolio Table**: All applications with scores and risk levels
- **Recent Activity**: Timeline of assessment progress
- **Quick Actions**: Links to start new assessments

### Navigation Sections
- **Assessment Framework**: Business Context, Architecture Review
- **Technical Assessment**: Infrastructure, Data, DevOps, Security
- **Cloud & Modernization**: Cloud readiness analysis
- **Results & Insights**: AI-generated recommendations

### Professional Features
- ✅ **Executive-friendly dashboards** with clear ROI metrics
- ✅ **Interactive charts** and visualizations
- ✅ **Responsive design** for all devices
- ✅ **Modern UI/UX** with Tailwind CSS
- ✅ **State management** with React Context
- ✅ **API service layer** ready for backend integration

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### API Integration
The app is configured to connect to your .NET API at:
- Development: `http://localhost:7001/api`
- Production: Set `REACT_APP_API_BASE_URL` environment variable

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=https://localhost:7001/api
```

## 🎨 Customization

### Styling
- **Tailwind CSS** for utility-first styling
- **Custom components** in `src/index.css`
- **Color scheme** configurable in `tailwind.config.js`

### Adding New Sections
1. Create component in appropriate directory
2. Add route in `src/components/Layout/Layout.js`
3. Add navigation item in `src/components/Layout/Sidebar.js`

## 📊 Dashboard Features

The **Dashboard** (`/` and `/dashboard`) serves as the main startup page featuring:

- **Welcome Section**: Overview with active assessment count
- **Key Metrics**: 4 metric cards showing portfolio health
- **Portfolio Summary**: Table of all assessed applications
- **Recent Activity**: Timeline of assessment progress
- **Trend Analysis**: Charts showing score improvements over time
- **Quick Actions**: Direct links to key functionality

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Azure Static Web Apps
```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy ./build --app-name your-app-name
```

## 🤝 Integration with .NET API

This React app is designed to work with the .NET 8 API you created earlier. The `assessmentService.js` provides all the API calls needed to connect to your backend.

## 📈 Making You Look Good

This application demonstrates:
- **Enterprise-scale architecture**
- **AI-powered insights** 
- **Executive-level reporting**
- **Modern development practices**
- **Production-ready code quality**

Perfect for impressing stakeholders with a sophisticated, professional application assessment platform! 🎯