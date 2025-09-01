import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
    FileText, 
    TrendingUp, 
    Network, 
    Brain,
    Upload,
    Trash2,
    Download,
    Filter,
    BarChart3,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

const DocumentInsights = () => {
    const [documents, setDocuments] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [selectedTab, setSelectedTab] = useState('documents');
    
    // Form states
    const [dragOver, setDragOver] = useState(false);

    const documentTypes = [
        'Business Requirements',
        'Technical Architecture', 
        'Infrastructure Documentation',
        'Security Documentation',
        'Data Architecture',
        'DevOps Documentation',
        'Project Management',
        'Compliance & Governance'
    ];

    useEffect(() => {
        loadDocuments();
        loadInsights();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Files/assessment/general?category=General`);
            
            if (!response.ok) {
                setDocuments([]);
                return;
            }
            
            const data = await response.json();
            
            // Extract files array from the API response structure { summary, files }
            const filesArray = data.files || [];
            
            // Map the files to the expected document format
            const documents = filesArray.map(file => ({
                id: file.id,
                name: file.originalFileName,
                fileName: file.originalFileName,
                documentType: file.documentType || 'General Documentation',
                category: file.category || 'general',
                size: file.fileSize,
                sizeBytes: file.fileSize,
                uploadedDate: file.uploadedDate,
                uploadedAt: file.uploadedDate,
                uploadedBy: file.uploadedBy || 'System',
                description: file.description,
                summary: file.description || 'General document',
                contentType: file.contentType,
                chunks: file.chunks || [],
                keyFindings: file.keyFindings || []
            }));
            
            setDocuments(documents);
        } catch (error) {
            console.error('Error loading documents:', error);
            setDocuments([]);
        }
    };

    const loadInsights = async () => {
        try {
            const assessmentId = 1; // Default assessment ID for DocumentInsights
            const response = await fetch(`${API_BASE_URL}/Intelligence/recommendations/${assessmentId}`);
            
            if (!response.ok) {
                console.warn('Intelligence recommendations not available, using mock insights');
                setInsights([
                    {
                        id: 1,
                        title: "General Assessment Guidance",
                        category: "General",
                        analysisCategory: "General",
                        documentType: "General Documentation",
                        content: "Review uploaded documents for comprehensive assessment insights and recommendations.",
                        confidence: 75,
                        createdAt: new Date().toISOString()
                    }
                ]);
                return;
            }

            const data = await response.json();
            
            // Handle the new RecommendationResult structure
            if (!data || typeof data !== 'object') {
                console.warn('Invalid Intelligence API response structure');
                setInsights([]);
                return;
            }

            // Combine all recommendation arrays from the RecommendationResult
            const allRecommendations = [
                ...(data.strategicRecommendations || []),
                ...(data.tacticalRecommendations || []),
                ...(data.personalizedRecommendations || [])
            ];
            
            // Transform recommendations to insights format (no filtering for general insights)
            const transformedInsights = allRecommendations.map((recommendation, index) => ({
                id: recommendation.id || `general_${index + 1}`,
                title: recommendation.title || recommendation.recommendation || recommendation.name || 'General Recommendation',
                category: recommendation.category || "General",
                analysisCategory: recommendation.category || "General",
                documentType: "General Documentation",
                content: recommendation.description || recommendation.details || recommendation.content || recommendation.recommendation || 'No description available',
                confidence: recommendation.priority === 'High' ? 90 : recommendation.priority === 'Medium' ? 75 : recommendation.priority === 'Low' ? 60 : 75,
                createdAt: new Date().toISOString()
            }));
            
            setInsights(transformedInsights);
        } catch (error) {
            console.error('Error loading insights:', error);
            // Fallback to mock data on error
            setInsights([
                {
                    id: 1,
                    title: "General Assessment Guidance",
                    category: "General",
                    analysisCategory: "General",
                    documentType: "General Documentation",
                    content: "Review uploaded documents for comprehensive assessment insights and recommendations.",
                    confidence: 75,
                    createdAt: new Date().toISOString()
                }
            ]);
        }
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress({ fileName: file.name, progress: 0 });
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', 'General');
                
                const response = await fetch(`${API_BASE_URL}/Files/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    setUploadProgress({ fileName: file.name, progress: 100, status: 'completed' });
                    await loadDocuments();
                    await loadInsights();
                } else {
                    setUploadProgress({ fileName: file.name, progress: 0, status: 'error' });
                }
            } catch (error) {
                console.error('Upload error:', error);
                setUploadProgress({ fileName: file.name, progress: 0, status: 'error' });
            }
        }
        
        setTimeout(() => setUploadProgress(null), 3000);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };



    const handleDeleteDocument = async (documentId) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        
        try {
            await fetch(`${API_BASE_URL}/Files/${documentId}`, { method: 'DELETE' });
            await loadDocuments();
            await loadInsights();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const formatFileSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getDocumentTypeColor = (type) => {
        const colors = {
            'Business Requirements': 'bg-blue-100 text-blue-800',
            'Technical Architecture': 'bg-green-100 text-green-800',
            'Infrastructure Documentation': 'bg-purple-100 text-purple-800',
            'Security Documentation': 'bg-red-100 text-red-800',
            'Data Architecture': 'bg-yellow-100 text-yellow-800',
            'DevOps Documentation': 'bg-indigo-100 text-indigo-800',
            'Project Management': 'bg-pink-100 text-pink-800',
            'Compliance & Governance': 'bg-gray-100 text-gray-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ARIA-AI Assessment Assistant</h1>
                    <p className="text-gray-600">Intelligent assistant for assessment guidance and insights</p>
                </div>
                <div className="flex space-x-2">
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.csv"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Documents
                        </Button>
                    </label>
                </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            {uploadProgress.status === 'completed' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : uploadProgress.status === 'error' ? (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                                <Clock className="h-5 w-5 text-blue-500" />
                            )}
                            <span className="text-sm">
                                {uploadProgress.status === 'completed' ? 'Uploaded: ' : 
                                 uploadProgress.status === 'error' ? 'Failed: ' : 'Uploading: '}
                                {uploadProgress.fileName}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Drag and Drop Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Drag and drop documents here</p>
                <p className="text-sm text-gray-500">
                    Supports PDF, Word, Excel, PowerPoint, and text files
                </p>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="documents" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Documents
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center">
                        <Network className="h-4 w-4 mr-2" />
                        Insights
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4">
                    <div className="grid gap-4">
                        {documents.map((doc) => (
                            <Card key={doc.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-semibold">{doc.fileName}</h3>
                                                <Badge className={getDocumentTypeColor(doc.documentType)}>
                                                    {doc.documentType}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{doc.summary}</p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>{formatFileSize(doc.sizeBytes)}</span>
                                                <span>{doc.chunks?.length || 0} chunks</span>
                                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                            {doc.keyFindings && doc.keyFindings.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-gray-700 mb-1">Key Findings:</p>
                                                    <ul className="text-xs text-gray-600 space-y-1">
                                                        {doc.keyFindings.slice(0, 3).map((finding, idx) => (
                                                            <li key={idx}>• {finding}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleDeleteDocument(doc.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {documents.length === 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-gray-500">
                                        No documents uploaded yet. Upload some documents to get started!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>



                <TabsContent value="insights" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    Document Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(
                                        documents.reduce((acc, doc) => {
                                            acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
                                            return acc;
                                        }, {})
                                    ).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <Badge className={getDocumentTypeColor(type)}>{type}</Badge>
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2" />
                                    Processing Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Documents:</span>
                                        <span className="font-medium">{documents.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Chunks:</span>
                                        <span className="font-medium">
                                            {documents.reduce((sum, doc) => sum + (doc.chunks?.length || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Size:</span>
                                        <span className="font-medium">
                                            {formatFileSize(documents.reduce((sum, doc) => sum + doc.sizeBytes, 0))}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Network className="h-5 w-5 mr-2" />
                                Document Relationships
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {insights.map((insight) => (
                                    <div key={insight.documentId} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">{insight.fileName}</h4>
                                            <Badge variant="outline">{insight.analysisCategory}</Badge>
                                        </div>
                                        
                                        {insight.keyThemes.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs font-medium text-gray-700 mb-1">Key Themes:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {insight.keyThemes.map((theme, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {theme}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {insight.relatedDocuments.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-700 mb-1">Related Documents:</p>
                                                <div className="space-y-1">
                                                    {insight.relatedDocuments.map((related, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-xs">
                                                            <span>{related.fileName}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {related.relationshipType}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default DocumentInsights;