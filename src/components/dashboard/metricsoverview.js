// src/components/Dashboard/MetricsOverview.js - Key metrics cards
import React from 'react';
import { TrendingUp, TrendingDown, Code, Shield, AlertTriangle, DollarSign } from 'lucide-react';

function MetricCard({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Icon className={`h-8 w-8 text-${color}-600 mr-3`} />
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricsOverview({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Applications Assessed"
        value={data?.totalApplications || 0}
        subtitle="Total portfolio coverage"
        trend={12}
        icon={Code}
        color="blue"
      />
      <MetricCard
        title="Average Score"
        value={data?.averageScore || 0}
        subtitle="Overall portfolio grade"
        trend={8}
        icon={TrendingUp}
        color="green"
      />
      <MetricCard
        title="Critical Issues"
        value={data?.criticalIssues || 0}
        subtitle="Require immediate attention"
        trend={-15}
        icon={AlertTriangle}
        color="red"
      />
      <MetricCard
        title="Potential Savings"
        value={`$${(data?.potentialSavings || 0).toLocaleString()}`}
        subtitle="Annual cost optimization"
        trend={22}
        icon={DollarSign}
        color="green"
      />
    </div>
  );
}

export default MetricsOverview;