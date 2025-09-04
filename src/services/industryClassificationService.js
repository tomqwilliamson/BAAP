// Industry Classification Service - Phase 4
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests or development bypass
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers['X-Auth-Bypass'] = 'development';
  }
  return config;
});

const INDUSTRY_CLASSIFICATION_BASE = '/industry';

class IndustryClassificationService {
  // Get all industry classifications
  async getIndustries() {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/classifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }

  // Classify an assessment to determine its industry
  async classifyAssessment(assessmentId) {
    try {
      const response = await apiClient.post(`${INDUSTRY_CLASSIFICATION_BASE}/classify/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error classifying assessment:', error);
      throw error;
    }
  }

  // Get industry-specific analysis for an assessment
  async getIndustryAnalysis(assessmentId) {
    try {
      // Mock implementation - simulates future industry-specific analysis
      console.log(`🎭 Generating mock industry analysis for assessment ${assessmentId}`);
      
      const mockAnalysis = {
        analysisContent: `
          <div class="industry-analysis">
            <h3>Industry-Specific Analysis</h3>
            <p><strong>Industry Context:</strong> Based on the assessment data, this appears to be a Financial Services organization with specific regulatory requirements.</p>
            
            <h4>Key Industry Considerations:</h4>
            <ul>
              <li><strong>Regulatory Compliance:</strong> SOX, PCI-DSS, and GDPR compliance requirements identified</li>
              <li><strong>Security Standards:</strong> Enhanced security controls needed for financial data protection</li>
              <li><strong>Audit Requirements:</strong> Immutable audit trails and real-time monitoring recommended</li>
              <li><strong>Data Residency:</strong> Consider data location requirements for international operations</li>
            </ul>
            
            <h4>Industry-Specific Risks:</h4>
            <ul>
              <li>Regulatory changes and compliance penalties</li>
              <li>Financial fraud and cybersecurity threats</li>
              <li>Market volatility and operational risk</li>
              <li>Third-party vendor dependencies</li>
            </ul>
            
            <h4>Recommended Architecture Patterns:</h4>
            <ul>
              <li>Event Sourcing for transaction integrity</li>
              <li>Zero-Trust security architecture</li>
              <li>Real-time fraud detection systems</li>
              <li>Immutable audit logging</li>
            </ul>
          </div>
        `,
        keyFindings: [
          'High regulatory compliance requirements detected',
          'Enhanced security controls needed for financial data',
          'Real-time monitoring and audit trails are critical',
          'Consider implementing Zero-Trust architecture',
          'Event sourcing recommended for transaction integrity'
        ],
        industryScore: 85,
        complianceFrameworks: ['SOX', 'PCI-DSS', 'GDPR', 'Basel III'],
        recommendedPatterns: [
          'Event Sourcing',
          'Zero-Trust Architecture', 
          'Real-Time Processing',
          'Immutable Audit Trails'
        ]
      };
      
      return mockAnalysis;
    } catch (error) {
      console.error('Error fetching industry analysis:', error);
      throw error;
    }
  }

  // Get industry-specific recommendations
  async getIndustryRecommendations(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/recommendations/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry recommendations:', error);
      throw error;
    }
  }

  // Get industry benchmarks
  async getIndustryBenchmarks(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/benchmarks/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry benchmarks:', error);
      throw error;
    }
  }

  // Get compliance requirements for an assessment (not industry ID)
  async getComplianceRequirements(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/compliance/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance requirements:', error);
      throw error;
    }
  }

  // Get industry intelligence report
  async getIndustryIntelligence(assessmentId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/intelligence-report/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching industry intelligence:', error);
      throw error;
    }
  }

  // Get cross-assessment patterns for similar industries
  async getCrossAssessmentPatterns(assessmentId) {
    try {
      // Mock implementation - simulates cross-assessment pattern analysis
      console.log(`🎭 Generating mock cross-assessment patterns for assessment ${assessmentId}`);
      
      const mockPatterns = [
        {
          patternType: 'Common Architecture Pattern',
          description: 'Microservices architecture with API gateways is prevalent in 78% of similar financial services organizations',
          confidence: 0.89,
          assessmentCount: 12,
          details: {
            frequency: '78%',
            successRate: '92%',
            avgImplementationTime: '8-12 months',
            keyBenefits: ['Improved scalability', 'Better fault isolation', 'Independent deployments']
          }
        },
        {
          patternType: 'Security Implementation',
          description: 'Zero-Trust architecture with multi-factor authentication adopted by 85% of comparable organizations',
          confidence: 0.91,
          assessmentCount: 15,
          details: {
            frequency: '85%',
            successRate: '87%',
            avgImplementationTime: '6-9 months', 
            keyBenefits: ['Enhanced security posture', 'Regulatory compliance', 'Reduced breach risk']
          }
        },
        {
          patternType: 'Data Management Strategy',
          description: 'Event sourcing with immutable audit trails used by 65% of organizations in this sector',
          confidence: 0.76,
          assessmentCount: 9,
          details: {
            frequency: '65%',
            successRate: '83%',
            avgImplementationTime: '12-18 months',
            keyBenefits: ['Complete audit trail', 'Event replay capability', 'Temporal data queries']
          }
        },
        {
          patternType: 'Cloud Migration Approach',
          description: 'Hybrid cloud with private compute for sensitive workloads chosen by 72% of similar assessments',
          confidence: 0.84,
          assessmentCount: 11,
          details: {
            frequency: '72%',
            successRate: '89%',
            avgImplementationTime: '10-14 months',
            keyBenefits: ['Regulatory compliance', 'Data sovereignty', 'Cost optimization']
          }
        },
        {
          patternType: 'DevOps Maturity',
          description: 'CI/CD with automated compliance checks implemented by 68% of organizations in financial services',
          confidence: 0.79,
          assessmentCount: 13,
          details: {
            frequency: '68%',
            successRate: '91%',
            avgImplementationTime: '4-6 months',
            keyBenefits: ['Faster deployments', 'Reduced errors', 'Compliance automation']
          }
        }
      ];
      
      return mockPatterns;
    } catch (error) {
      console.error('Error fetching cross-assessment patterns:', error);
      throw error;
    }
  }

  // Update industry classification for an assessment
  async updateIndustryClassification(assessmentId, industryId, confidence = null, reason = '') {
    try {
      const response = await apiClient.put(`${INDUSTRY_CLASSIFICATION_BASE}/classify/${assessmentId}`, {
        industryClassificationId: industryId,
        isVerified: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating industry classification:', error);
      throw error;
    }
  }

  // Get industry-specific security recommendations
  async getSecurityRecommendations(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/security/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security recommendations:', error);
      throw error;
    }
  }

  // Get industry best practices
  async getBestPractices(industryId) {
    try {
      const response = await apiClient.get(`${INDUSTRY_CLASSIFICATION_BASE}/bestpractices/${industryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching best practices:', error);
      throw error;
    }
  }
}

export default new IndustryClassificationService();