// Semantic Search Component - Phase 3 Advanced Document Analysis
import React, { useState, useEffect } from 'react';
import { Search, FileText, Brain, Zap, Filter, TrendingUp, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { vectorSearchService } from '../../services/vectorSearchService';
import { useAssessment } from '../../contexts/assessmentcontext';
import toast from 'react-hot-toast';

function SemanticSearch({ moduleType, onDocumentSelect, showInsights = true }) {
  const { currentAssessment } = useAssessment();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [crossAssessmentInsights, setCrossAssessmentInsights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    topK: 5,
    similarityThreshold: 0.7,
    includeAllAssessments: false,
    moduleTypes: moduleType ? [moduleType] : []
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // search, insights

  useEffect(() => {
    if (showInsights && currentAssessment?.id && moduleType) {
      loadCrossAssessmentInsights();
    }
  }, [currentAssessment?.id, moduleType, showInsights]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const options = {
        assessmentId: searchOptions.includeAllAssessments ? null : currentAssessment?.id,
        moduleTypes: searchOptions.moduleTypes.length > 0 ? searchOptions.moduleTypes : null,
        topK: searchOptions.topK,
        similarityThreshold: searchOptions.similarityThreshold
      };

      const results = await vectorSearchService.searchDocuments(query, options);
      const formattedResults = vectorSearchService.formatSearchResults(results);
      setSearchResults(formattedResults);

      if (results.length === 0) {
        toast.info('No matching documents found. Try adjusting your search query or similarity threshold.');
      } else {
        toast.success(`Found ${results.length} relevant document${results.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed: ' + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const loadCrossAssessmentInsights = async () => {
    if (!currentAssessment?.id || !moduleType) return;

    setIsLoadingInsights(true);
    try {
      const insights = await vectorSearchService.getCrossAssessmentInsights(
        currentAssessment.id, 
        moduleType, 
        3
      );
      const formattedInsights = vectorSearchService.formatInsights(insights);
      setCrossAssessmentInsights(formattedInsights);
    } catch (error) {
      console.error('Insights error:', error);
      // Don't show error toast for insights as it's not critical
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleDocumentClick = (document) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const moduleOptions = [
    { value: 'business', label: 'Business Context' },
    { value: 'architecture', label: 'Architecture Review' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'data', label: 'Data Architecture' },
    { value: 'devops', label: 'DevOps' },
    { value: 'security', label: 'Security' },
    { value: 'cloud', label: 'Cloud Readiness' },
    { value: 'recommendations', label: 'Recommendations' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Semantic Document Search
            </h3>
          </div>
          {showInsights && (
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  activeTab === 'search'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  activeTab === 'insights'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Insights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="p-4">
          {/* Search Input */}
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search across documents using natural language..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Search Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Results: {searchOptions.topK}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={searchOptions.topK}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, topK: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Similarity Threshold: {(searchOptions.similarityThreshold * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={searchOptions.similarityThreshold}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, similarityThreshold: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchOptions.includeAllAssessments}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, includeAllAssessments: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Search across all assessments</span>
                </label>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Modules:
                </label>
                <div className="flex flex-wrap gap-2">
                  {moduleOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchOptions.moduleTypes.includes(option.value)}
                        onChange={(e) => {
                          setSearchOptions(prev => ({
                            ...prev,
                            moduleTypes: e.target.checked
                              ? [...prev.moduleTypes, option.value]
                              : prev.moduleTypes.filter(m => m !== option.value)
                          }));
                        }}
                        className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-1 text-xs text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div
                key={`${result.documentId}-${index}`}
                onClick={() => handleDocumentClick(result)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-900">{result.fileName}</h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {result.moduleDisplayName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.preview}</p>
                    {result.keyFindings && result.keyFindings.length > 0 && (
                      <div className="mb-2">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Key Findings:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {result.keyFindings.slice(0, 2).map((finding, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Assessment: {result.assessmentName}</span>
                      <span>Created: {result.createdAtFormatted}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{result.formattedSimilarity}</div>
                      <div className="text-xs text-gray-500">similarity</div>
                    </div>
                    <Zap className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}

            {searchResults.length === 0 && query && !isSearching && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No documents found matching your search.</p>
                <p className="text-sm">Try different keywords or adjust the similarity threshold.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && showInsights && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Cross-Assessment Insights</h4>
              <p className="text-xs text-gray-500">Patterns and recommendations from similar assessments</p>
            </div>
            <button
              onClick={loadCrossAssessmentInsights}
              disabled={isLoadingInsights}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoadingInsights ? <Loader className="h-3 w-3 animate-spin" /> : 'Refresh'}
            </button>
          </div>

          <div className="space-y-4">
            {crossAssessmentInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h5 className="text-sm font-medium text-gray-900">{insight.pattern}</h5>
                  </div>
                  <span className="text-xs font-medium text-blue-600">{insight.formattedConfidence} confidence</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.recommendation}</p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{insight.assessmentSummary}</span>
                  {insight.topDocument && (
                    <span className="font-medium">Top match: {insight.topDocument.fileName}</span>
                  )}
                </div>
              </div>
            ))}

            {crossAssessmentInsights.length === 0 && !isLoadingInsights && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No cross-assessment insights found.</p>
                <p className="text-sm">Upload more documents or run more assessments to discover patterns.</p>
              </div>
            )}

            {isLoadingInsights && (
              <div className="text-center py-8">
                <Loader className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Analyzing cross-assessment patterns...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SemanticSearch;