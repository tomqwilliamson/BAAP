// Enhanced Document Upload Component - Phase 3 Vector Search
import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle, Loader, Brain, Zap } from 'lucide-react';
import { vectorSearchService } from '../../services/vectorSearchService';
import { useAssessment } from '../../contexts/assessmentcontext';
import toast from 'react-hot-toast';

function DocumentUpload({ moduleType, onUploadComplete, allowMultiple = true }) {
  const { currentAssessment } = useAssessment();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    if (!allowMultiple && newFiles.length > 1) {
      toast.error('Please select only one file');
      return;
    }

    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      const validation = vectorSearchService.validateFile(file);
      if (validation.isValid) {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending' // pending, uploading, processing, completed, error
        });
      } else {
        errors.push(...validation.errors.map(error => `${file.name}: ${error}`));
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setFiles(prev => allowMultiple ? [...prev, ...validFiles] : validFiles);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const uploadFile = async (fileItem) => {
    if (!currentAssessment?.id || !moduleType) {
      toast.error('Assessment and module type are required');
      return null;
    }

    try {
      // Update file status
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ));

      const progressCallback = (percent) => {
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: percent }));
      };

      const result = await vectorSearchService.uploadDocument(
        currentAssessment.id,
        moduleType,
        fileItem.file,
        progressCallback
      );

      // Update file status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'processing' } : f
      ));

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update file status to completed
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'completed', result } : f
      ));

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'error', error: error.message } : f
      ));
      toast.error(`Failed to upload ${fileItem.name}: ${error.message}`);
      return null;
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast.info('No files to upload');
      return;
    }

    setIsProcessing(true);
    const results = [];

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const fileItem of pendingFiles) {
        const result = await uploadFile(fileItem);
        if (result) {
          results.push(result);
        }
      }

      const successful = results.length;
      const total = pendingFiles.length;

      if (successful === total) {
        toast.success(`Successfully processed ${successful} document${successful > 1 ? 's' : ''} for semantic search`);
      } else if (successful > 0) {
        toast.warning(`Processed ${successful} of ${total} documents successfully`);
      } else {
        toast.error('Failed to process any documents');
      }

      if (onUploadComplete && results.length > 0) {
        onUploadComplete(results);
      }

      setUploadedDocuments(prev => [...prev, ...results]);
    } catch (error) {
      console.error('Upload process error:', error);
      toast.error('Upload process failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setUploadProgress({});
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Brain className="h-4 w-4 animate-pulse text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing for search...';
      case 'completed':
        return 'Ready for search';
      case 'error':
        return 'Upload failed';
      default:
        return 'Ready to upload';
    }
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const completedCount = files.filter(f => f.status === 'completed').length;
  const processingCount = files.filter(f => ['uploading', 'processing'].includes(f.status)).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Enhanced Document Upload
            </h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              Phase 3: AI-Powered
            </span>
          </div>
          {files.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {completedCount}/{files.length} processed
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-red-600"
                disabled={processingCount > 0}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Upload documents to enable advanced semantic search and cross-assessment insights
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            multiple={allowMultiple}
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Word, Excel, PowerPoint, Text files (max 10MB each)
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Brain className="h-3 w-3" />
                  <span>AI Processing</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Semantic Search</span>
                </span>
              </div>
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Files ({files.length})</h4>
              {pendingCount > 0 && (
                <button
                  onClick={uploadAllFiles}
                  disabled={isProcessing}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center space-x-1">
                      <Loader className="h-3 w-3 animate-spin" />
                      <span>Processing...</span>
                    </span>
                  ) : (
                    `Process ${pendingCount} File${pendingCount > 1 ? 's' : ''}`
                  )}
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded border">
                  <div className="flex-shrink-0">
                    {getStatusIcon(fileItem.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(fileItem.size)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-600">
                        {getStatusText(fileItem.status)}
                        {fileItem.error && `: ${fileItem.error}`}
                      </p>
                      {fileItem.status === 'completed' && fileItem.result && (
                        <span className="text-xs text-green-600">
                          {fileItem.result.documentEmbeddings?.length || 0} chunks processed
                        </span>
                      )}
                    </div>
                    {/* Progress Bar */}
                    {fileItem.status === 'uploading' && uploadProgress[fileItem.id] && (
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all"
                          style={{ width: `${uploadProgress[fileItem.id]}%` }}
                        />
                      </div>
                    )}
                    {fileItem.status === 'processing' && (
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div className="bg-purple-600 h-1 rounded-full animate-pulse w-full" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    disabled={['uploading', 'processing'].includes(fileItem.status)}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Summary */}
        {completedCount > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                <span className="font-medium">{completedCount} document{completedCount > 1 ? 's' : ''}</span> processed 
                and ready for semantic search
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Documents have been analyzed, chunked, and indexed for intelligent search and cross-assessment insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentUpload;