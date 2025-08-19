// src/components/Infrastructure/InfrastructureAssessment.js - Infrastructure assessment
import React, { useState, useEffect } from 'react';
import { Cloud, Server, Database, Zap, Activity, HardDrive, Wifi, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function InfrastructureAssessment() {
  const [infraData, setInfraData] = useState({
    hosting: [],
    utilization: [],
    cloudReadiness: [],
    scalability: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfrastructureData();
  }, []);

  const loadInfrastructureData = async () => {
    try {
      setLoading(true);
      // Mock infrastructure data
      const mockData = {
        hosting: [
          { name: 'On-Premises', count: 12, percentage: 60 },
          { name: 'AWS', count: 5, percentage: 25 },
          { name: 'Azure', count: 2, percentage: 10 },
          { name: 'Hybrid', count: 1, percentage: 5 }
        ],
        utilization: [
          { name: 'CPU', current: 65, capacity: 100, status: 'Good' },
          { name: 'Memory', current: 78, capacity: 100, status: 'Warning' },
          { name: 'Storage', current: 45, capacity: 100, status: 'Good' },
          { name: 'Network', current: 32, capacity: 100, status: 'Good' }
        ],
        cloudReadiness: [
          { application: 'Customer Portal', readiness: 85, complexity: 'Low' },
          { application: 'ERP System', readiness: 60, complexity: 'Medium' },
          { application: 'Legacy Billing', readiness: 25, complexity: 'High' },
          { application: 'Mobile API', readiness: 90, complexity: 'Low' }
        ],
        scalability: {
          autoScaling: 30,
          loadBalancing: 45,
          containerization: 20,
          microservices: 15
        }
      };
      setInfraData(mockData);
    } catch (error) {
      console.error('Error loading infrastructure data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hostingColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  const getReadinessColor = (readiness) => {
    if (readiness >= 80) return 'bg-green-500';
    if (readiness >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUtilizationColor = (current) => {
    if (current >= 80) return 'bg-red-500';
    if (current >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
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
      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Servers</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Cloud className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Cloud Native</p>
              <p className="text-2xl font-bold text-gray-900">35%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Auto-Scaling</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hosting Environment Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosting Environment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={infraData.hosting}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {infraData.hosting.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={hostingColors[index % hostingColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            {infraData.utilization.map((resource, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{resource.name}</span>
                  <span>{resource.current}%</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getUtilizationColor(resource.current)}`}
                    style={{ width: `${resource.current}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Status: {resource.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Readiness Assessment */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cloud Readiness Assessment</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Readiness Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Migration Complexity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {infraData.cloudReadiness.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.application}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${getReadinessColor(app.readiness)}`}
                          style={{ width: `${app.readiness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{app.readiness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.complexity === 'Low' ? 'bg-green-100 text-green-800' :
                      app.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.complexity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.readiness >= 80 ? 'Lift and Shift' :
                     app.readiness >= 60 ? 'Refactor' : 'Rebuild'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scalability Features */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Scalability & Modernization Features</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Auto-Scaling</h4>
              <p className="text-2xl font-bold text-blue-600">{infraData.scalability.autoScaling}%</p>
              <p className="text-sm text-gray-500">of applications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Load Balancing</h4>
              <p className="text-2xl font-bold text-green-600">{infraData.scalability.loadBalancing}%</p>
              <p className="text-sm text-gray-500">coverage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <HardDrive className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Containerization</h4>
              <p className="text-2xl font-bold text-purple-600">{infraData.scalability.containerization}%</p>
              <p className="text-sm text-gray-500">adoption</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900">Microservices</h4>
              <p className="text-2xl font-bold text-orange-600">{infraData.scalability.microservices}%</p>
              <p className="text-sm text-gray-500">architecture</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfrastructureAssessment;