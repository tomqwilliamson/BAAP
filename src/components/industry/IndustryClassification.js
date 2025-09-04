import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../contexts/assessmentcontext';
import industryClassificationService from '../../services/industryClassificationService';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  Building2, Target, TrendingUp, Shield, AlertTriangle, 
  CheckCircle, BarChart3, PieChart, Award, Lightbulb,
  FileText, Users, Settings, RefreshCw, Download,
  Search, Filter, Star, Clock, DollarSign
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Chart color palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const IndustryClassification = () => {
  const { currentAssessment } = useAssessment();
  const [industryClassification, setIndustryClassification] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [complianceRequirements, setComplianceRequirements] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    if (currentAssessment?.id) {
      loadIndustryData();
    }
  }, [currentAssessment]);

  const loadIndustryData = async () => {
    try {
      setLoading(true);
      
      // Load all industries
      const industriesData = await industryClassificationService.getIndustries();
      setIndustries(industriesData);

      // Try to classify the assessment if not already classified
      try {
        const classificationData = await industryClassificationService.classifyAssessment(currentAssessment.id);
        setIndustryClassification(classificationData);
        
        // Load industry-specific data
        await loadIndustrySpecificData(classificationData);
      } catch (error) {
        console.log('Assessment not yet classified or no classification data');
      }

    } catch (error) {
      console.error('Error loading industry data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIndustrySpecificData = async (classification) => {
    if (!classification || !classification.industryClassificationId) return;

    try {
      const [
        analysisData,
        recommendationsData,
        benchmarksData,
        complianceData,
        intelligenceData,
        patternsData
      ] = await Promise.allSettled([
        industryClassificationService.getIndustryAnalysis(currentAssessment.id),
        industryClassificationService.getIndustryRecommendations(currentAssessment.id),
        industryClassificationService.getIndustryBenchmarks(classification.industryClassificationId),
        industryClassificationService.getComplianceRequirements(currentAssessment.id),
        industryClassificationService.getIndustryIntelligence(currentAssessment.id),
        industryClassificationService.getCrossAssessmentPatterns(currentAssessment.id)
      ]);

      if (analysisData.status === 'fulfilled') setAnalysis(analysisData.value);
      if (recommendationsData.status === 'fulfilled') setRecommendations(recommendationsData.value);
      if (benchmarksData.status === 'fulfilled') setBenchmarks(benchmarksData.value);
      if (complianceData.status === 'fulfilled') setComplianceRequirements(complianceData.value);
      if (intelligenceData.status === 'fulfilled') setIntelligence(intelligenceData.value);
      if (patternsData.status === 'fulfilled') setPatterns(patternsData.value);

    } catch (error) {
      console.error('Error loading industry-specific data:', error);
    }
  };

  const handleManualClassification = async (industryId) => {
    try {
      setLoading(true);
      const classification = await industryClassificationService.updateIndustryClassification(
        currentAssessment.id,
        industryId,
        1.0,
        'Manually classified by user'
      );
      setIndustryClassification(classification);
      await loadIndustrySpecificData(classification);
    } catch (error) {
      console.error('Error updating industry classification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIndustryName = (industryId) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.industryName : 'Unknown Industry';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!currentAssessment) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Industry Classification</h2>
          <p className="text-gray-600">Please select an assessment to view industry classification.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-6 space-y-6">
        {/* Enhanced Header - Match Recommendations styling */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Industry Classification</h1>
              <p className="text-blue-100 mt-1">
                AI-powered industry analysis and benchmarking for {currentAssessment?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={loadIndustryData} 
              disabled={loading}
              className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-white border"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Classification Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Current Classification</h2>
            </div>
            {industryClassification ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {getIndustryName(industryClassification.industryClassificationId)}
                        </h3>
                        <p className="text-sm text-gray-600">Primary Industry Classification</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`text-white text-lg px-3 py-1 ${getConfidenceColor(industryClassification.classificationConfidence)}`}
                      >
                        {Math.round(industryClassification.classificationConfidence * 100)}%
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Confidence</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Classification Method</p>
                      <p className="text-sm text-green-700">{industryClassification.classificationMethod}</p>
                    </div>
                  </div>
                  {industryClassification.isVerified && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">Verification Status</p>
                        <p className="text-sm text-blue-700">Expert Verified</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {industryClassification.classificationReason && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Classification Reasoning</p>
                        <p className="text-sm text-yellow-800 mt-1">{industryClassification.classificationReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Industry Classification Needed</h3>
                  <p className="text-gray-600 mb-6">This assessment hasn't been classified yet. Select the most appropriate industry below.</p>
                </div>
                <div className="space-y-3">
                  <p className="font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Select Industry:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {industries.map(industry => (
                      <Button
                        key={industry.id}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleManualClassification(industry.id)}
                        disabled={loading}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        {industry.industryName}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Statistics Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold">Quick Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Industries</span>
                <Badge variant="outline">{industries.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Benchmarks Available</span>
                <Badge variant="outline">{benchmarks.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recommendations</span>
                <Badge variant="outline">{recommendations.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Items</span>
                <Badge variant="outline">{complianceRequirements.length}</Badge>
              </div>
            </div>
          </Card>
          
          {industryClassification && (
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold">Analysis Status</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Classification Complete</span>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Benchmarks Loaded</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-purple-600 mr-2" />
                  <span>Compliance Analyzed</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {industryClassification && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Benchmarks</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Patterns</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Industry-Specific Analysis</h3>
              {analysis ? (
                <div className="prose max-w-none">
                  {analysis.analysisContent && (
                    <div dangerouslySetInnerHTML={{ __html: analysis.analysisContent }} />
                  )}
                  {analysis.keyFindings && (
                    <div>
                      <h4 className="font-semibold mt-4">Key Findings:</h4>
                      <ul className="list-disc pl-5">
                        {analysis.keyFindings.map((finding, index) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Industry analysis is being generated...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Industry Recommendations</h3>
              {recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <p className="text-gray-600">{rec.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={`${rec.priority === 'High' ? 'bg-red-500' : rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                          {rec.priority} Priority
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Industry recommendations are being generated...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Performance Benchmarks</h3>
                </div>
                {benchmarks && benchmarks.length > 0 ? (
                  <div className="space-y-4">
                    {benchmarks.slice(0, 4).map((benchmark, index) => (
                      <div key={index} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{benchmark.metricName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{benchmark.metricCategory}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              {benchmark.benchmarkValue} {benchmark.unit}
                            </p>
                            <p className="text-xs text-gray-500">
                              Sample: {benchmark.sampleSize}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Industry benchmarks are loading...</p>
                  </div>
                )}
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold">Benchmark Distribution</h3>
                </div>
                {benchmarks && benchmarks.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <RechartsPieChart>
                        <Pie
                          data={benchmarks.slice(0, 6).map((benchmark, index) => ({
                            name: benchmark.metricName.length > 15 
                              ? benchmark.metricName.substring(0, 15) + '...' 
                              : benchmark.metricName,
                            fullName: benchmark.metricName,
                            value: parseFloat(benchmark.benchmarkValue) || (index + 1) * 10,
                            unit: benchmark.unit || '',
                            category: benchmark.metricCategory || 'General',
                            fill: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, value, unit}) => `${value}${unit ? ` ${unit}` : ''}`}
                          labelLine={false}
                        >
                          {benchmarks.slice(0, 6).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value}${props.payload.unit ? ` ${props.payload.unit}` : ''}`,
                            props.payload.fullName
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    
                    {/* Custom Legend */}
                    <div className="grid grid-cols-1 gap-2">
                      {benchmarks.slice(0, 6).map((benchmark, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div 
                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                            style={{backgroundColor: COLORS[index % COLORS.length]}}
                          ></div>
                          <span className="text-gray-700 truncate" title={benchmark.metricName}>
                            {benchmark.metricName}: <span className="font-medium">
                              {parseFloat(benchmark.benchmarkValue) || (index + 1) * 10}{benchmark.unit ? ` ${benchmark.unit}` : ''}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No benchmark data available</p>
                      <p className="text-sm text-gray-500 mt-2">Benchmarks will appear here once industry classification is complete</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            {benchmarks && benchmarks.length > 4 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Benchmarks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {benchmarks.slice(4).map((benchmark, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold">{benchmark.metricName}</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {benchmark.benchmarkValue} {benchmark.unit}
                      </p>
                      <p className="text-sm text-gray-600">{benchmark.metricCategory}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Sample Size: {benchmark.sampleSize} | Source: {benchmark.dataSource}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Requirements</h3>
              {complianceRequirements && complianceRequirements.length > 0 ? (
                <div className="space-y-4">
                  {complianceRequirements.map((req, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{req.framework}</h4>
                        <Badge className={`${req.criticality === 'Critical' ? 'bg-red-500' : req.criticality === 'High' ? 'bg-orange-500' : 'bg-blue-500'} text-white`}>
                          {req.criticality}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-2">{req.description}</p>
                      {req.requirements && (
                        <ul className="list-disc pl-5 mt-2">
                          {req.requirements.map((requirement, reqIndex) => (
                            <li key={reqIndex} className="text-sm">{requirement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Compliance requirements are loading...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cross-Assessment Patterns</h3>
              {patterns && patterns.length > 0 ? (
                <div className="space-y-4">
                  {patterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{pattern.patternType}</h4>
                      <p className="text-gray-600">{pattern.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          Confidence: {Math.round(pattern.confidence * 100)}%
                        </Badge>
                        <Badge variant="outline">
                          Similar Assessments: {pattern.assessmentCount}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Cross-assessment patterns are being analyzed...</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      )}
      </div>
    </div>
  );
};

export default IndustryClassification;