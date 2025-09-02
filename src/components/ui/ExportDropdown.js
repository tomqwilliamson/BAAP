import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';

const ExportDropdown = ({ onExportPDF, onExportExcel, onExportJSON, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (exportFunction) => {
    exportFunction();
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {onExportPDF && (
              <button
                onClick={() => handleExport(onExportPDF)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Export as PDF
              </button>
            )}
            {onExportExcel && (
              <button
                onClick={() => handleExport(onExportExcel)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Export as Excel
              </button>
            )}
            {onExportJSON && (
              <button
                onClick={() => handleExport(onExportJSON)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Export as JSON
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;