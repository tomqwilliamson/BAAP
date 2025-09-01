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

function MetricsOverview({ data, showAllAssessments = false }) {
  if (showAllAssessments) {
    // Show comprehensive metrics when viewing all assessments
    return (
      <div className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Applications"
            value={data?.totalApplications || 0}
            subtitle="Across all assessments"
            trend={12}
            icon={Code}
            color="blue"
          />
          <MetricCard
            title="Average Score"
            value={data?.averageScore || 0}
            subtitle="Portfolio-wide average"
            trend={8}
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Critical Issues"
            value={data?.criticalIssues || 0}
            subtitle="High-priority findings"
            trend={-15}
            icon={AlertTriangle}
            color="red"
          />
          <MetricCard
            title="Potential Savings"
            value={`$${(data?.potentialSavings || 0).toLocaleString()}`}
            subtitle="Total estimated savings"
            trend={22}
            icon={DollarSign}
            color="green"
          />
        </div>

        {/* Additional Assessment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Assessment Progress"
            value={`${data?.assessmentProgress || 0}%`}
            subtitle="Completed assessments"
            trend={5}
            icon={TrendingUp}
            color="blue"
          />
          <MetricCard
            title="Security Issues"
            value={data?.securityIssues || 0}
            subtitle="All security findings"
            trend={-8}
            icon={Shield}
            color="yellow"
          />
          <MetricCard
            title="Cloud Readiness"
            value={`${data?.cloudReadiness || 0}%`}
            subtitle="Average readiness score"
            trend={15}
            icon={Code}
            color="green"
          />
          <MetricCard
            title="Migration Cost"
            value={`$${((data?.totalMigrationCost || 0) / 1000).toFixed(0)}k`}
            subtitle="Estimated migration cost"
            trend={-12}
            icon={DollarSign}
            color="blue"
          />
        </div>
      </div>
    );
  }

  // Individual assessment view - show all metrics in two rows
  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Applications Assessed"
          value={data?.totalApplications || 0}
          subtitle="In this assessment"
          trend={12}
          icon={Code}
          color="blue"
        />
        <MetricCard
          title="Average Score"
          value={data?.averageScore || 0}
          subtitle="Overall assessment grade"
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
          subtitle="Assessment savings potential"
          trend={22}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Assessment Progress"
          value={`${data?.assessmentProgress || 0}%`}
          subtitle="Assessment completion"
          trend={5}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Security Issues"
          value={data?.securityIssues || 0}
          subtitle="Security findings"
          trend={-8}
          icon={Shield}
          color="yellow"
        />
        <MetricCard
          title="Cloud Readiness"
          value={`${data?.cloudReadiness || 0}%`}
          subtitle="Average readiness score"
          trend={15}
          icon={Code}
          color="green"
        />
        <MetricCard
          title="Migration Cost"
          value={`$${((data?.totalMigrationCost || 0) / 1000).toFixed(0)}k`}
          subtitle="Estimated migration cost"
          trend={-12}
          icon={DollarSign}
          color="blue"
        />
      </div>
    </div>
  );
}

export default MetricsOverview;