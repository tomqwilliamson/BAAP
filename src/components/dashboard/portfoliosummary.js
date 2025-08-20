// src/components/Dashboard/PortfolioSummary.js - Portfolio overview table
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, ExternalLink } from 'lucide-react';
// import { assessmentService } from '../../services/assessmentservice'; // Using mock data for now

function PortfolioSummary() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      // For now, use mock data since the API endpoint may not be implemented
      // In production, uncomment the line below:
      // const data = await assessmentService.getPortfolioSummary();
      
      const mockData = [
        {
          id: 1,
          name: 'Customer Portal Web App',
          type: 'React SPA',
          category: 'Customer-Facing',
          score: 85,
          grade: 'B+',
          riskLevel: 'Low'
        },
        {
          id: 2,
          name: 'Internal ERP System',
          type: '.NET Core API',
          category: 'Business Critical',
          score: 72,
          grade: 'C+',
          riskLevel: 'Medium'
        },
        {
          id: 3,
          name: 'Mobile Banking App',
          type: 'React Native',
          category: 'Customer-Facing',
          score: 91,
          grade: 'A-',
          riskLevel: 'Low'
        },
        {
          id: 4,
          name: 'Legacy Payment Gateway',
          type: 'Java Spring',
          category: 'Business Critical',
          score: 58,
          grade: 'D+',
          riskLevel: 'High'
        },
        {
          id: 5,
          name: 'Analytics Dashboard',
          type: 'Angular',
          category: 'Internal Tools',
          score: 79,
          grade: 'C+',
          riskLevel: 'Medium'
        },
        {
          id: 6,
          name: 'Document Management System',
          type: 'SharePoint',
          category: 'Internal Tools',
          score: 45,
          grade: 'F',
          riskLevel: 'Critical'
        },
        {
          id: 7,
          name: 'API Gateway Service',
          type: 'Node.js Express',
          category: 'Infrastructure',
          score: 88,
          grade: 'B+',
          riskLevel: 'Low'
        },
        {
          id: 8,
          name: 'HR Management Portal',
          type: 'PHP Laravel',
          category: 'Internal Tools',
          score: 66,
          grade: 'D+',
          riskLevel: 'Medium'
        }
      ];
      
      setApplications(mockData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Fallback to mock data even if there's an error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Application Portfolio</h3>
        <p className="text-sm text-gray-500 mt-1">
          Overview of assessed applications and their current status
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(app.score)}`}>
                    {app.score}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {app.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(app.riskLevel)}`}>
                    {app.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <Link 
                    to={`/app/applications/${app.id}`}
                    className="hover:text-blue-900 flex items-center"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PortfolioSummary;