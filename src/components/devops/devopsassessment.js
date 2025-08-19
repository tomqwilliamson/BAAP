// src/components/DevOps/DevOpsAssessment.js - DevOps practices assessment
import React, { useState, useEffect } from 'react';
import { GitBranch, Play, Zap, Monitor, TestTube, Package, Gauge, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function DevOpsAssessment() {
  const [devopsData, setDevopsData] = useState({
    maturity: [],
    cicd: {},
    automation: [],
    monitoring: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevOpsData();
  }, []);

  const loadDevOpsData = async () => {
    try {
      setLoading(true);
      const mockData = {
        maturity: [
          { category: 'Source Control', score: 95 },
          { category: 'CI/CD Pipeline', score: 78 },
          { category: 'Automated Testing', score: 65 },
          { category: 'Infrastructure as Code', score: 58 },
          { category: 'Monitoring & Alerting', score: 72 },
          { category: 'Security Integration', score: 55 }
        ],
        cicd: {
          pipelineCount: 23,
          successRate: 87,
          avgBuildTime: 8.5,
          deploymentFrequency: 'Daily',
          leadTime: '2.3 hours',
          mttr: '45 minutes'
        },
        automation: [
          { process: 'Build Process', automated: 90, manual: 10 },
          { process: 'Testing', automated: 65, manual: 35 },
          { process: 'Deployment', automated: 78, manual: 22 },
          { process: 'Infrastructure Provisioning', automated: 45, manual: 55 },
          { process: 'Monitoring Setup', automated: 60, manual: 40 }
        ],
        monitoring: {
          coverage: 82,
          alertsConfigured: 156,
          dashboards: 12,
          uptime: 99.2
        }
      };
      setDevopsData(mockData);
    } catch (error) {
      console.error('Error loading DevOps data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaturityColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DevOps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <GitBranch className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pipelines</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.pipelineCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.successRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Build Time</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.cicd.avgBuildTime}m</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Monitoring Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{devopsData.monitoring.coverage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maturity Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Maturity Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={devopsData.maturity}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={devopsData.automation} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="process" width={100} />
              <Tooltip />
              <Bar dataKey="automated" stackId="a" fill="#10B981" name="Automated" />
              <Bar dataKey="manual" stackId="a" fill="#EF4444" name="Manual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CI/CD Metrics */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">CI/CD Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Deployment Frequency</h4>
              <p className="text-2xl font-bold text-blue-600">{devopsData.cicd.deploymentFrequency}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Gauge className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Lead Time</h4>
              <p className="text-2xl font-bold text-green-600">{devopsData.cicd.leadTime}</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">MTTR</h4>
              <p className="text-2xl font-bold text-purple-600">{devopsData.cicd.mttr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Maturity Breakdown */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">DevOps Practices Assessment</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {devopsData.maturity.map((practice, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: getMaturityColor(practice.score) }}></div>
                  <h4 className="font-medium text-gray-900">{practice.category}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${practice.score}%`,
                        backgroundColor: getMaturityColor(practice.score)
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{practice.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Practices Recommendations */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recommended Improvements</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">High Priority</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <p className="text-sm font-medium text-red-800">Implement Infrastructure as Code</p>
                  <p className="text-xs text-red-600 mt-1">Current score: 58% - Automate infrastructure provisioning</p>
                </div>
                <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <p className="text-sm font-medium text-orange-800">Enhance Security Integration</p>
                  <p className="text-xs text-orange-600 mt-1">Current score: 55% - Integrate security scanning in pipeline</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Medium Priority</h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm font-medium text-yellow-800">Improve Test Automation</p>
                  <p className="text-xs text-yellow-600 mt-1">Current score: 65% - Increase test coverage and automation</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm font-medium text-blue-800">Enhance Monitoring & Alerting</p>
                  <p className="text-xs text-blue-600 mt-1">Current score: 72% - Add comprehensive application monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevOpsAssessment;