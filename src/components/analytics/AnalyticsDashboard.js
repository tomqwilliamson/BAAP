import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    Target,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Users,
    Server,
    Shield,
    Brain,
    Download,
    Filter,
    RefreshCw,
    Calendar,
    Eye,
    Settings,
    ChevronUp,
    ChevronDown,
    Minus
} from 'lucide-react';

const AnalyticsDashboard = () => {
    const [selectedDashboard, setSelectedDashboard] = useState('executive');
    const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
    const [alerts, setAlerts] = useState([]);
    const [kpis, setKpis] = useState([]);

    const timeRanges = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' }
    ];

    const dashboardTypes = [
        { id: 'executive', name: 'Executive', icon: Target },
        { id: 'operations', name: 'Operations', icon: Server },
        { id: 'technical', name: 'Technical', icon: Settings },
        { id: 'financial', name: 'Financial', icon: DollarSign },
        { id: 'risk', name: 'Risk', icon: Shield }
    ];

    useEffect(() => {
        loadDashboardData();
        
        if (autoRefresh) {
            const interval = setInterval(() => {
                loadDashboardData();
            }, refreshInterval);
            
            return () => clearInterval(interval);
        }
    }, [selectedDashboard, selectedTimeRange, autoRefresh, refreshInterval]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/intelligence/dashboard/${selectedDashboard}?timeRange=${selectedTimeRange}`);
            const data = await response.json();
            setDashboardData(data);
            setLastUpdated(new Date());

            // Load alerts
            const alertsResponse = await fetch('/api/intelligence/alerts/active');
            const alertsData = await alertsResponse.json();
            setAlerts(alertsData);

            // Load KPIs
            const kpiResponse = await fetch(`/api/intelligence/kpis?period=${selectedTimeRange}`);
            const kpiData = await kpiResponse.json();
            setKpis(kpiData);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadDashboardData();
    };

    const handleExport = async (format) => {
        try {
            const response = await fetch(`/api/reports/export?dashboard=${selectedDashboard}&format=${format}&timeRange=${selectedTimeRange}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-dashboard-${selectedDashboard}-${new Date().toISOString().split('T')[0]}.${format}`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting dashboard:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'critical': return 'text-red-600 bg-red-100';
            case 'info': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <ChevronUp className="h-4 w-4 text-green-500" />;
            case 'down': return <ChevronDown className="h-4 w-4 text-red-500" />;
            case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
            default: return <Minus className="h-4 w-4 text-gray-500" />;
        }
    };

    const renderExecutiveDashboard = () => (
        <div className="space-y-6">
            {/* Executive Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Executive Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">24</div>
                            <div className="text-sm text-gray-600">Active Assessments</div>
                            <div className="flex items-center justify-center mt-1">
                                {getTrendIcon('up')}
                                <span className="text-xs text-green-600 ml-1">+12%</span>
                            </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">$2.4M</div>
                            <div className="text-sm text-gray-600">Projected Savings</div>
                            <div className="flex items-center justify-center mt-1">
                                {getTrendIcon('up')}
                                <span className="text-xs text-green-600 ml-1">+8%</span>
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">185%</div>
                            <div className="text-sm text-gray-600">Average ROI</div>
                            <div className="flex items-center justify-center mt-1">
                                {getTrendIcon('stable')}
                                <span className="text-xs text-gray-600 ml-1">0%</span>
                            </div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">7.2</div>
                            <div className="text-sm text-gray-600">Risk Score</div>
                            <div className="flex items-center justify-center mt-1">
                                {getTrendIcon('down')}
                                <span className="text-xs text-green-600 ml-1">-5%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ROI and Cost Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            ROI Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Interactive ROI trend chart would render here</p>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">3-Year ROI</span>
                                        <span className="font-semibold text-green-600">185%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">5-Year ROI</span>
                                        <span className="font-semibold text-green-600">245%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Payback Period</span>
                                        <span className="font-semibold">18 months</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Cost Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-green-800">Infrastructure Savings</div>
                                    <div className="text-sm text-green-600">35% reduction potential</div>
                                </div>
                                <div className="text-2xl font-bold text-green-600">$850K</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-blue-800">License Optimization</div>
                                    <div className="text-sm text-blue-600">20% reduction potential</div>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">$320K</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-purple-800">Operational Efficiency</div>
                                    <div className="text-sm text-purple-600">45% improvement</div>
                                </div>
                                <div className="text-2xl font-bold text-purple-600">$1.2M</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Strategic Initiatives */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Strategic Initiatives
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Cloud Migration</h4>
                                <Badge className="bg-green-100 text-green-800">On Track</Badge>
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">78%</div>
                            <div className="text-sm text-gray-600">Completion</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Modernization</h4>
                                <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                            </div>
                            <div className="text-2xl font-bold text-purple-600 mb-1">45%</div>
                            <div className="text-sm text-gray-600">Completion</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Security Enhancement</h4>
                                <Badge className="bg-blue-100 text-blue-800">Planned</Badge>
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">12%</div>
                            <div className="text-sm text-gray-600">Completion</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderOperationsDashboard = () => (
        <div className="space-y-6">
            {/* System Health */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Server className="h-5 w-5 mr-2" />
                        System Health Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="text-sm font-medium">API Services</div>
                            <div className="text-xs text-green-600">Healthy</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="text-sm font-medium">Database</div>
                            <div className="text-xs text-green-600">Healthy</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="text-sm font-medium">AI Services</div>
                            <div className="text-xs text-yellow-600">Degraded</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="text-sm font-medium">Storage</div>
                            <div className="text-xs text-green-600">Healthy</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Active Assessments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Active Assessments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <div className="font-medium">Enterprise Migration Project</div>
                                <div className="text-sm text-gray-600">120 applications • 15 days remaining</div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-green-100 text-green-800">85% Complete</Badge>
                                <div className="text-xs text-gray-500 mt-1">High Priority</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <div className="font-medium">Legacy System Assessment</div>
                                <div className="text-sm text-gray-600">45 applications • 8 days remaining</div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-yellow-100 text-yellow-800">62% Complete</Badge>
                                <div className="text-xs text-gray-500 mt-1">Medium Priority</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <div className="font-medium">Security Compliance Review</div>
                                <div className="text-sm text-gray-600">78 applications • 22 days remaining</div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-blue-100 text-blue-800">34% Complete</Badge>
                                <div className="text-xs text-gray-500 mt-1">Low Priority</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderKPIPanel = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Key Performance Indicators
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { name: 'Assessment Progress', value: '78.5%', target: '80%', trend: 'up', status: 'on-track' },
                        { name: 'Cost Accuracy', value: '85.5%', target: '90%', trend: 'up', status: 'needs-attention' },
                        { name: 'Risk Coverage', value: '92%', target: '95%', trend: 'stable', status: 'on-track' },
                        { name: 'User Engagement', value: '73%', target: '80%', trend: 'down', status: 'at-risk' }
                    ].map((kpi, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                {getTrendIcon(kpi.trend)}
                            </div>
                            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                            <div className="text-xs text-gray-600">Target: {kpi.target}</div>
                            <Badge className={`mt-2 ${
                                kpi.status === 'on-track' ? 'bg-green-100 text-green-800' :
                                kpi.status === 'needs-attention' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {kpi.status.replace('-', ' ')}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const renderAlertsPanel = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Active Alerts ({alerts.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[
                        { 
                            id: 1, 
                            title: 'High Timeline Risk Detected', 
                            severity: 'critical', 
                            time: '5 minutes ago',
                            description: 'Migration timeline confidence dropped to 65%'
                        },
                        { 
                            id: 2, 
                            title: 'Cost Projection Updated', 
                            severity: 'warning', 
                            time: '2 hours ago',
                            description: 'ROI payback period extended to 22 months'
                        },
                        { 
                            id: 3, 
                            title: 'Security Assessment Required', 
                            severity: 'info', 
                            time: '1 day ago',
                            description: '12 applications need security review'
                        }
                    ].map((alert) => (
                        <div key={alert.id} className={`p-3 border-l-4 rounded-lg ${
                            alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                            alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                        }`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{alert.title}</span>
                                <Badge className={getStatusColor(alert.severity)}>
                                    {alert.severity}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{alert.description}</p>
                            <div className="text-xs text-gray-500">{alert.time}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-600">
                        Real-time insights and performance metrics
                        <span className="ml-2 text-xs">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                    >
                        {timeRanges.map(range => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('pdf')}
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Dashboard Type Selector */}
            <div className="flex space-x-2 overflow-x-auto">
                {dashboardTypes.map((dashboard) => {
                    const Icon = dashboard.icon;
                    return (
                        <Button
                            key={dashboard.id}
                            variant={selectedDashboard === dashboard.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedDashboard(dashboard.id)}
                            className="flex-shrink-0"
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {dashboard.name}
                        </Button>
                    );
                })}
            </div>

            {/* Dashboard Content */}
            <Tabs value={selectedDashboard} onValueChange={setSelectedDashboard}>
                <TabsContent value="executive">
                    {renderExecutiveDashboard()}
                </TabsContent>
                
                <TabsContent value="operations">
                    {renderOperationsDashboard()}
                </TabsContent>
                
                <TabsContent value="technical">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>CPU Usage</span>
                                        <span className="font-mono">65.2%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65.2%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Memory Usage</span>
                                        <span className="font-mono">78.5%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '78.5%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Disk Usage</span>
                                        <span className="font-mono">42.1%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '42.1%' }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>API Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Average Response Time</span>
                                        <span className="font-mono">245ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Requests per Second</span>
                                        <span className="font-mono">1,247</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Error Rate</span>
                                        <span className="font-mono text-green-600">0.02%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Cache Hit Rate</span>
                                        <span className="font-mono text-green-600">94.2%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="financial">
                    <div className="text-center p-8 text-gray-500">
                        Financial dashboard content would be rendered here
                    </div>
                </TabsContent>
                
                <TabsContent value="risk">
                    <div className="text-center p-8 text-gray-500">
                        Risk dashboard content would be rendered here
                    </div>
                </TabsContent>
            </Tabs>

            {/* Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderKPIPanel()}
                {renderAlertsPanel()}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;