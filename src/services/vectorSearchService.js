// Vector Search Service - Phase 3 Advanced Document Analysis
import { API_BASE_URL } from './api';

class VectorSearchService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/vectorsearch`;
  }

  /**
   * Upload a document for semantic search processing
   */
  async uploadDocument(assessmentId, moduleType, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/documents/${assessmentId}/${moduleType}`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  /**
   * Perform semantic search across documents
   */
  async searchDocuments(query, options = {}) {
    const searchRequest = {
      query,
      assessmentId: options.assessmentId || null,
      moduleTypes: options.moduleTypes || null,
      topK: options.topK || 5,
      similarityThreshold: options.similarityThreshold || 0.7
    };

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error('Document search failed:', error);
      throw error;
    }
  }

  /**
   * Get cross-assessment insights for a specific module
   */
  async getCrossAssessmentInsights(assessmentId, moduleType, maxInsights = 3) {
    try {
      const response = await fetch(`${this.baseUrl}/insights/${assessmentId}/${moduleType}?maxInsights=${maxInsights}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.insights || [];
    } catch (error) {
      console.error('Cross-assessment insights failed:', error);
      throw error;
    }
  }

  /**
   * Find similar documents to a given document
   */
  async findSimilarDocuments(documentId, options = {}) {
    const queryParams = new URLSearchParams({
      topK: options.topK || 5,
      similarityThreshold: options.similarityThreshold || 0.7
    });

    try {
      const response = await fetch(`${this.baseUrl}/similar/${documentId}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error('Similar documents search failed:', error);
      throw error;
    }
  }

  /**
   * Get enhanced AI analysis with semantic search context
   */
  async getEnhancedAnalysis(originalRequest, moduleType, assessmentId, relevantDocuments = null) {
    const request = {
      originalRequest,
      moduleType,
      assessmentId,
      relevantDocuments
    };

    try {
      const response = await fetch(`${this.baseUrl}/enhanced-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get vector search statistics
   */
  async getSearchStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search stats failed:', error);
      throw error;
    }
  }

  /**
   * Test embedding generation for debugging
   */
  async testEmbedding(text) {
    try {
      const response = await fetch(`${this.baseUrl}/test-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Embedding test failed:', error);
      throw error;
    }
  }

  /**
   * Utility function to determine the best documents for a search query
   */
  async findRelevantDocuments(query, assessmentId, moduleType, limit = 3) {
    try {
      const searchResults = await this.searchDocuments(query, {
        assessmentId,
        moduleTypes: [moduleType],
        topK: limit,
        similarityThreshold: 0.6 // Slightly lower threshold for more context
      });

      return searchResults;
    } catch (error) {
      console.error('Relevant documents search failed:', error);
      return [];
    }
  }

  /**
   * Format search results for display
   */
  formatSearchResults(results) {
    return results.map(result => ({
      ...result,
      formattedSimilarity: `${(result.similarityScore * 100).toFixed(1)}%`,
      preview: this.truncateText(result.relevantText, 150),
      moduleDisplayName: this.formatModuleName(result.moduleType),
      createdAtFormatted: new Date(result.createdAt).toLocaleDateString()
    }));
  }

  /**
   * Format insights for display
   */
  formatInsights(insights) {
    return insights.map(insight => ({
      ...insight,
      formattedConfidence: `${(insight.confidenceScore * 100).toFixed(1)}%`,
      assessmentSummary: `${insight.relatedDocuments.length} documents across ${insight.assessmentIds.length} assessments`,
      topDocument: insight.relatedDocuments.length > 0 ? insight.relatedDocuments[0] : null
    }));
  }

  // Helper functions
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  formatModuleName(moduleType) {
    const moduleNames = {
      business: 'Business Context',
      architecture: 'Architecture Review',
      infrastructure: 'Infrastructure',
      data: 'Data Architecture',
      devops: 'DevOps',
      security: 'Security',
      cloud: 'Cloud Readiness',
      recommendations: 'Recommendations'
    };
    return moduleNames[moduleType.toLowerCase()] || moduleType;
  }

  /**
   * Validate file before upload
   */
  validateFile(file, maxSizeMB = 10) {
    const errors = [];

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use PDF, Word, Excel, PowerPoint, or text files.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get upload progress callback for UI
   */
  createProgressCallback(setProgress) {
    return (percent) => {
      if (setProgress) {
        setProgress(percent);
      }
    };
  }
}

// Export singleton instance
export const vectorSearchService = new VectorSearchService();
export default vectorSearchService;