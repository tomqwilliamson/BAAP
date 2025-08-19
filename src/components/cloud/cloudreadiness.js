import React, { useEffect, useState } from 'react';
import { useAssessment } from '../../contexts/assessmentcontext';
import { assessmentService } from '../../services/assessmentservice';

const CloudReadiness = () => {
  const { currentAssessment } = useAssessment();
  const [cloudAssessment, setCloudAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, applications, migration-paths, cost-analysis

  useEffect(() => {
    loadCloudReadinessData();
  }, [currentAssessment]);

  const loadCloudReadinessData = async () => {
    if (!currentAssessment?.id) return;
    
    try {
      setLoading(true);
      const data = await assessmentService.getCloudReadiness(currentAssessment.id);
      setCloudAssessment(data);
    } catch (error) {
      console.error('Failed to load cloud readiness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getReadinessLabel = (score) => {
    if (score >= 80) return 'Cloud Ready';
    if (score >= 60) return 'Mostly Ready';
    if (score >= 40) return 'Needs Work';
    return 'Not Ready';
  };

  const getMigrationComplexity = (complexity) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[complexity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Overall Readiness Score */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Overall Cloud Readiness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {cloudAssessment?.overallScore || 0}%
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(cloudAssessment?.overallScore || 0)}`}>
              {getReadinessLabel(cloudAssessment?.overallScore || 0)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Applications Assessed</span>
              <span className="font-semibold">{cloudAssessment?.totalApplications || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cloud Ready</span>
              <span className="font-semibold text-green-600">{cloudAssessment?.readyApplications || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Need Assessment</span>
              <span className="font-semibold text-orange-600">{cloudAssessment?.needsWorkApplications || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Not Ready</span>
              <span className="font-semibold text-red-600">{cloudAssessment?.notReadyApplications || 0}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Migration Cost</span>
              <span className="font-semibold">{cloudAssessment?.estimatedMigrationCost || '$0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Timeline</span>
              <span className="font-semibold">{cloudAssessment?.estimatedTimeline || '0 months'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Savings</span>
              <span className="font-semibold text-green-600">{cloudAssessment?.projectedSavings || '$0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI Timeline</span>
              <span className="font-semibold">{cloudAssessment?.roiTimeline || '0 months'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness by Category */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Readiness by Category</h3>
        <div className="space-y-4">
          {(cloudAssessment?.categories || []).map(category => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.score >= 70 ? 'bg-green-500' : category.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-600">
                {category.blockers || 0} blockers
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Strategies */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recommended Migration Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(cloudAssessment?.migrationStrategies || []).map(strategy => (
            <div key={strategy.name} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applications:</span>
                  <span className="font-medium">{strategy.applicationCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Effort:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getMigrationComplexity(strategy.effort)}`}>
                    {strategy.effort}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timeline:</span>
                  <span className="font-medium">{strategy.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ApplicationsSection = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Application Cloud Readiness</h3>
        <p className="text-gray-600 mt-1">Individual assessment of each application's migration readiness</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Environment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Readiness Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Migration Strategy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complexity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Blockers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(cloudAssessment?.applications || []).map(app => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{app.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.currentEnvironment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{app.readinessScore}%</div>
                    <div className={`ml-2 px-2 py-1 rounded-full text-xs ${getReadinessColor(app.readinessScore)}`}>
                      {getReadinessLabel(app.readinessScore)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.migrationStrategy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getMigrationComplexity(app.migrationComplexity)}`}>
                    {app.migrationComplexity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div className="truncate" title={app.keyBlockers?.join(', ')}>
                    {app.keyBlockers?.slice(0, 2).join(', ')}
                    {app.keyBlockers?.length > 2 && '...'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const MigrationPathsSection = () => (
    <div className="space-y-6">
      {/* Migration Wave Planning */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Migration Wave Planning</h3>
        <div className="space-y-6">
          {(cloudAssessment?.migrationWaves || []).map((wave, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Wave {index + 1}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{wave.duration}</span>
                  <span>{wave.applications?.length || 0} applications</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{wave.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Strategy Focus</div>
                  <div className="text-sm text-gray-600">{wave.strategyFocus}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Risk Level</div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getMigrationComplexity(wave.riskLevel)}`}>
                    {wave.riskLevel}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Dependencies</div>
                  <div className="text-sm text-gray-600">{wave.dependencies || 'None'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(wave.applications || []).map(app => (
                  <div key={app.id} className="bg-gray-50 p-3 rounded border">
                    <div className="font-medium text-sm">{app.name}</div>
                    <div className="text-xs text-gray-500">{app.migrationStrategy}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites and Dependencies */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Prerequisites and Dependencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Infrastructure Prerequisites</h4>
            <ul className="space-y-2">
              {(cloudAssessment?.infrastructurePrerequisites || []).map((prereq, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm text-gray-600">{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Application Dependencies</h4>
            <ul className="space-y-2">
              {(cloudAssessment?.applicationDependencies || []).map((dep, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm text-gray-600">{dep}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const CostAnalysisSection = () => (
    <div className="space-y-6">
      {/* Cost Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Migration Cost Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {cloudAssessment?.costAnalysis?.totalMigrationCost || '$0'}
            </div>
            <div className="text-sm text-blue-700">Total Migration Cost</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {cloudAssessment?.costAnalysis?.annualSavings || '$0'}
            </div>
            <div className="text-sm text-green-700">Annual Savings</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {cloudAssessment?.costAnalysis?.roiMonths || '0'}
            </div>
            <div className="text-sm text-purple-700">ROI (Months)</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {cloudAssessment?.costAnalysis?.fiveYearTco || '$0'}
            </div>
            <div className="text-sm text-yellow-700">5-Year TCO</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Migration Costs Breakdown</h4>
            <div className="space-y-3">
              {(cloudAssessment?.costAnalysis?.migrationBreakdown || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className="font-medium">{item.cost}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Ongoing Cost Comparison</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Current Annual Cost</span>
                <span className="font-bold text-red-600">
                  {cloudAssessment?.costAnalysis?.currentAnnualCost || '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium">Projected Cloud Cost</span>
                <span className="font-bold text-green-600">
                  {cloudAssessment?.costAnalysis?.projectedCloudCost || '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-sm font-medium">Annual Savings</span>
                <span className="font-bold text-blue-600">
                  {cloudAssessment?.costAnalysis?.annualSavings || '$0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost by Application */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Cost Analysis by Application</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Migration Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Annual Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projected Annual Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI (Months)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(cloudAssessment?.costAnalysis?.applicationCosts || []).map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.migrationCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.currentAnnualCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.projectedAnnualCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={app.annualSavings > 0 ? 'text-green-600' : 'text-red-600'}>
                      {app.annualSavings > 0 ? '+' : ''}{app.annualSavingsFormatted}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.roiMonths}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ApplicationDetailModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{application.name} - Cloud Readiness Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Assessment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{application.readinessScore}%</div>
                <div className="text-sm text-gray-600">Readiness Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold">{application.migrationStrategy}</div>
                <div className="text-sm text-gray-600">Recommended Strategy</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className={`px-2 py-1 rounded-full text-sm border ${getMigrationComplexity(application.migrationComplexity)}`}>
                  {application.migrationComplexity}
                </span>
                <div className="text-sm text-gray-600 mt-1">Migration Complexity</div>
              </div>
            </div>

            {/* Detailed Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Architecture Assessment</h4>
                <div className="space-y-2">
                  {(application.architectureAssessment || []).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className={`text-sm ${item.score >= 70 ? 'text-green-600' : item.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
                <div className="space-y-2">
                  {(application.technologyStack || []).map((tech, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{tech.component}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${tech.cloudReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tech.cloudReady ? 'Compatible' : 'Needs Update'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockers and Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Blockers</h4>
                <ul className="space-y-2">
                  {(application.keyBlockers || []).map((blocker, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{blocker}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Migration Requirements</h4>
                <ul className="space-y-2">
                  {(application.migrationRequirements || []).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-3">
                {(application.recommendations || []).map((rec, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium text-blue-900">{rec.title}</div>
                    <div className="text-sm text-blue-700 mt-1">{rec.description}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                      <span>Priority: {rec.priority}</span>
                      <span>Effort: {rec.effort}</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cloud Migration Readiness</h2>
            <p className="text-gray-600 mt-1">
              Comprehensive assessment of application portfolio readiness for cloud migration
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('applications')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'applications' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setViewMode('migration-paths')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'migration-paths' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Migration Paths
            </button>
            <button
              onClick={() => setViewMode('cost-analysis')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'cost-analysis' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Cost Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'overview' && <OverviewSection />}
      {viewMode === 'applications' && <ApplicationsSection />}
      {viewMode === 'migration-paths' && <MigrationPathsSection />}
      {viewMode === 'cost-analysis' && <CostAnalysisSection />}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default CloudReadiness;