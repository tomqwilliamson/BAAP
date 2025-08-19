// src/components/Data/DataArchitecture.js - Data architecture assessment
import React, { useState, useEffect } from 'react';
import { Database, GitBranch, Shuffle, BarChart3, Clock, HardDrive, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

function DataArchitecture() {
  const [dataArchData, setDataArchData] = useState({
    databases: [],
    integration: [],
    dataFlow: [],
    quality: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataArchitectureData();
  }, []);

  const loadDataArchitectureData = async () => {
    try {
      setLoading(true);
      const mockData = {
        databases: [
          { type: 'SQL Server', count: 8, usage: 'OLTP', performance: 85 },
          { type: 'Oracle', count: 3, usage: 'Data Warehouse', performance: 78 },
          { type: 'PostgreSQL', count: 5, usage: 'Analytics', performance: 92 },
          { type: 'MongoDB', count: 4, usage: 'Document Store', performance: 88 },
          { type: 'Redis', count: 6, usage: 'Cache', performance: 95 }
        ],
        integration: [
          { pattern: 'REST APIs', count: 15, complexity: 'Low' },
          { pattern: 'Message Queues', count: 8, complexity: 'Medium' },
          { pattern: 'ETL Batch', count: 12, complexity: 'High' },
          { pattern: 'Real-time Streaming', count: 3, complexity: 'High' },
          { pattern: 'File Transfer', count: 6, complexity: 'Low' }
        ],
        dataFlow: [
          { month: 'Jan', volume: 2.4, latency: 120 },
          { month: 'Feb', volume: 2.8, latency: 115 },
          { month: 'Mar', volume: 3.2, latency: 110 },
          { month: 'Apr', volume: 3.6, latency: 105 },
          { month: 'May', volume: 4.1, latency: 100 },
          { month: 'Jun', volume: 4.5, latency: 95 }
        ],
        quality: {
          completeness: 85,
          accuracy: 78,
          consistency: 82,
          timeliness: 75,
          validity: 88
        }
      };
      setDataArchData(mockData);
    } catch (error) {
      console.error('Error loading data architecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dbColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'bg-green-500';
    if (performance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Databases</p>
              <p className="text-2xl font-bold text-gray-900">26</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <GitBranch className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Integration Points</p>
              <p className="text-2xl font-bold text-gray-900">44</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Data Volume (TB)</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Latency (ms)</p>
              <p className="text-2xl font-bold text-gray-900">95</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Technology Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataArchData.databases}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ type, count }) => `${type}: ${count}`}
              >
                {dataArchData.databases.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={dbColors[index % dbColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Flow Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Volume & Latency Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataArchData.dataFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="volume" fill="#3B82F6" name="Volume (TB)" />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#EF4444" name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Database Performance */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Database Performance Assessment</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Database Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Primary Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataArchData.databases.map((db, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {db.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {db.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {db.usage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${getPerformanceColor(db.performance)}`}
                          style={{ width: `${db.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{db.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {db.performance >= 90 ? 'Optimize' : 
                     db.performance >= 75 ? 'Monitor' : 'Upgrade Required'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Patterns */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Integration Patterns Analysis</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataArchData.integration.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{pattern.pattern}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(pattern.complexity)}`}>
                    {pattern.complexity}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{pattern.count}</div>
                <div className="text-sm text-gray-500">implementations</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Quality Metrics */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Quality Assessment</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {Object.entries(dataArchData.quality).map(([metric, score]) => (
              <div key={metric} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${score}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{score}%</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 capitalize">{metric}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataArchitecture;