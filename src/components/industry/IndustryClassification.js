import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../contexts/assessmentcontext';
import industryClassificationService from '../../services/industryClassificationService';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

const IndustryClassification = () => {
  const { selectedAssessment } = useAssessment();
  const [industryClassification, setIndustryClassification] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [complianceRequirements, setComplianceRequirements] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (selectedAssessment?.id) {
      loadIndustryData();
    }
  }, [selectedAssessment]);

  const loadIndustryData = async () => {
    try {
      setLoading(true);
      
      // Load all industries
      const industriesData = await industryClassificationService.getIndustries();
      setIndustries(industriesData);

      // Try to classify the assessment if not already classified
      try {
        const classificationData = await industryClassificationService.classifyAssessment(selectedAssessment.id);
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
        industryClassificationService.getIndustryAnalysis(selectedAssessment.id),
        industryClassificationService.getIndustryRecommendations(selectedAssessment.id),
        industryClassificationService.getIndustryBenchmarks(classification.industryClassificationId),
        industryClassificationService.getComplianceRequirements(classification.industryClassificationId),
        industryClassificationService.getIndustryIntelligence(selectedAssessment.id),
        industryClassificationService.getCrossAssessmentPatterns(selectedAssessment.id)
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
        selectedAssessment.id,
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

  if (!selectedAssessment) {
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Industry Classification</h1>
        <Button 
          onClick={loadIndustryData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? '🔄' : '🔄'} Refresh Analysis
        </Button>
      </div>

      {/* Classification Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Classification</h2>
        {industryClassification ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                {getIndustryName(industryClassification.industryClassificationId)}
              </h3>
              <Badge 
                className={`text-white ${getConfidenceColor(industryClassification.classificationConfidence)}`}
              >
                {Math.round(industryClassification.classificationConfidence * 100)}% Confidence
              </Badge>
              {industryClassification.isVerified && (
                <Badge className="bg-blue-500 text-white">✓ Verified</Badge>
              )}
            </div>
            <p className="text-gray-600">
              <strong>Classification Method:</strong> {industryClassification.classificationMethod}
            </p>
            {industryClassification.classificationReason && (
              <p className="text-gray-600">
                <strong>Reason:</strong> {industryClassification.classificationReason}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">This assessment has not been classified yet.</p>
            <div className="space-y-2">
              <p className="font-medium">Select Industry:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {industries.map(industry => (
                  <Button
                    key={industry.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleManualClassification(industry.id)}
                    disabled={loading}
                  >
                    {industry.industryName}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {industryClassification && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
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

          <TabsContent value="benchmarks" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Industry Benchmarks</h3>
              {benchmarks && benchmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {benchmarks.map((benchmark, index) => (
                    <div key={index} className="border rounded-lg p-4">
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
              ) : (
                <p className="text-gray-600">Industry benchmarks are loading...</p>
              )}
            </Card>
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
  );
};

export default IndustryClassification;