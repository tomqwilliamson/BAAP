import React, { useEffect, useState } from 'react';
import { useAssessment } from '../../contexts/assessmentcontext';
import { assessmentService } from '../../services/assessmentservice';

const Recommendations = () => {
  const { currentAssessment } = useAssessment();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [viewMode, setViewMode] = useState('matrix'); // matrix, list, roadmap

  useEffect(() => {
    loadRecommendations();
  }, [currentAssessment]);

  const loadRecommendations = async () => {
    if (!currentAssessment?.id) return;
    
    try {
      setLoading(true);
      const data = await assessmentService.getRecommendations(currentAssessment.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all', 'code-quality', 'security', 'infrastructure', 
    'devops', 'data', 'architecture', 'performance'
  ];

  const priorities = ['all', 'critical', 'high', 'medium', 'low'];

  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || rec.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEffortColor = (effort) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };
    return colors[effort] || 'bg-gray-500';
  };

  const getImpactColor = (impact) => {
    const colors = {
      low: 'bg-gray-400',
      medium: 'bg-blue-400',
      high: 'bg-purple-500'
    };
    return colors[impact] || 'bg-gray-400';
  };

  const MatrixView = () => {
    const matrixData = filteredRecommendations.reduce((acc, rec) => {
      const key = `${rec.impact}-${rec.effort}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    }, {});

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Impact vs Effort Matrix</h3>
        <div className="grid grid-cols-4 gap-4 h-96">
          {/* High Impact, Low Effort - Quick Wins */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-800 mb-2">Quick Wins</h4>
            <p className="text-xs text-green-600 mb-3">High Impact, Low Effort</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(matrixData['high-low'] || []).map(rec => (
                <div key={rec.id} className="bg-white p-2 rounded border text-xs">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-gray-500">{rec.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* High Impact, Medium Effort */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Major Projects</h4>
            <p className="text-xs text-yellow-600 mb-3">High Impact, Medium Effort</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(matrixData['high-medium'] || []).map(rec => (
                <div key={rec.id} className="bg-white p-2 rounded border text-xs">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-gray-500">{rec.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* High Impact, High Effort */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <h4 className="font-medium text-purple-800 mb-2">Strategic</h4>
            <p className="text-xs text-purple-600 mb-3">High Impact, High Effort</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(matrixData['high-high'] || []).map(rec => (
                <div key={rec.id} className="bg-white p-2 rounded border text-xs">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-gray-500">{rec.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medium/Low Impact combinations */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
            <h4 className="font-medium text-gray-800 mb-2">Fill-ins</h4>
            <p className="text-xs text-gray-600 mb-3">Lower Priority</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                ...(matrixData['medium-low'] || []),
                ...(matrixData['medium-medium'] || []),
                ...(matrixData['medium-high'] || []),
                ...(matrixData['low-low'] || []),
                ...(matrixData['low-medium'] || []),
                ...(matrixData['low-high'] || [])
              ].map(rec => (
                <div key={rec.id} className="bg-white p-2 rounded border text-xs">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-gray-500">{rec.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ListView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">All Recommendations</h3>
      </div>
      <div className="divide-y">
        {filteredRecommendations.map(rec => (
          <div key={rec.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {rec.category.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{rec.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Impact</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getImpactColor(rec.impact)}`}></div>
                      <span className="text-sm capitalize">{rec.impact}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Effort</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getEffortColor(rec.effort)}`}></div>
                      <span className="text-sm capitalize">{rec.effort}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Timeline</div>
                    <div className="text-sm text-gray-600">{rec.estimatedDuration}</div>
                  </div>
                </div>

                {rec.benefits && rec.benefits.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Expected Benefits</div>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {rec.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.implementationSteps && rec.implementationSteps.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Implementation Steps</div>
                    <ol className="text-sm text-gray-600 list-decimal list-inside">
                      {rec.implementationSteps.map((step, idx) => (
                        <li key={idx} className="mb-1">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {rec.resources && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Required Resources</div>
                    <div className="text-sm text-gray-600">{rec.resources}</div>
                  </div>
                )}

                {rec.risks && rec.risks.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Risks & Considerations</div>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {rec.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="ml-6 flex-shrink-0">
                {rec.estimatedROI && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rec.estimatedROI}</div>
                    <div className="text-xs text-gray-500">Est. ROI</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RoadmapView = () => {
    const phases = {
      'Phase 1 (0-3 months)': filteredRecommendations.filter(r => r.phase === 1),
      'Phase 2 (3-6 months)': filteredRecommendations.filter(r => r.phase === 2),
      'Phase 3 (6-12 months)': filteredRecommendations.filter(r => r.phase === 3),
      'Phase 4 (12+ months)': filteredRecommendations.filter(r => r.phase === 4)
    };

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Implementation Roadmap</h3>
          <p className="text-gray-600 mt-1">Phased approach for implementing recommendations</p>
        </div>
        <div className="p-6">
          {Object.entries(phases).map(([phase, recs]) => (
            <div key={phase} className="mb-8 last:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <h4 className="text-lg font-semibold text-gray-900">{phase}</h4>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {recs.length} items
                </span>
              </div>
              <div className="ml-7 space-y-3">
                {recs.map(rec => (
                  <div key={rec.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{rec.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <div className="text-sm text-gray-500">{rec.estimatedDuration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
            <p className="text-gray-600 mt-1">
              Prioritized improvement suggestions based on comprehensive assessment analysis
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'matrix' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Matrix View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'roadmap' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Roadmap
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.impact === 'high' && r.effort === 'low').length}
            </div>
            <div className="text-sm text-green-700">Quick Wins</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {recommendations.filter(r => r.priority === 'critical').length}
            </div>
            <div className="text-sm text-red-700">Critical Issues</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {recommendations.filter(r => r.priority === 'high').length}
            </div>
            <div className="text-sm text-yellow-700">High Priority</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {recommendations.length}
            </div>
            <div className="text-sm text-blue-700">Total Items</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority.replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'matrix' && <MatrixView />}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'roadmap' && <RoadmapView />}
    </div>
  );
};

export default Recommendations;