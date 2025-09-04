// src/components/ui/ActionPanel.js - Reusable action panel component
import React from 'react';
import { Save, Download, Upload, Clock, Database } from 'lucide-react';

const ActionPanel = ({
  onSave,
  onExport,
  onImport,
  isDirty = false,
  dataSaved = false,
  lastSaveTime = null,
  lastAiAnalysisTime = null,
  isDatabaseMode = true,
  loading = false,
  saveButtonText = 'Save Data'
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onSave}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDirty 
                  ? 'bg-orange-600 hover:bg-orange-700 animate-pulse text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isDirty ? `${saveButtonText} (Required)` : saveButtonText}
            </button>
            
            <button
              onClick={onExport}
              disabled={loading}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <label className={`flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
          
          {/* Status Information */}
          <div className="flex items-center space-x-4 text-sm">
            {/* Save Status */}
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {dataSaved && lastSaveTime 
                    ? `Last saved: ${lastSaveTime?.toLocaleString ? lastSaveTime.toLocaleString() : 'Unknown time'}`
                    : 'Not saved yet'
                  }
                </span>
              </div>
              
              {/* Data Mode Badge */}
              <div className="flex items-center space-x-2 mt-1">
                <Database className="h-4 w-4 text-gray-400" />
                {isDatabaseMode ? (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded border">
                    Database Mode
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded border">
                    Local Storage
                  </span>
                )}
              </div>
            </div>
            
            {/* AI Analysis Status */}
            {lastAiAnalysisTime && (
              <div className="flex flex-col items-end border-l border-gray-200 pl-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-purple-600 font-medium">AI Analysis</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {lastAiAnalysisTime?.toLocaleString ? lastAiAnalysisTime.toLocaleString() : 'Unknown time'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;