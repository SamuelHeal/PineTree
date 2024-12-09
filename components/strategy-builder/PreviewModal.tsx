'use client';

import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pineScript: string;
  validationErrors: string[];
  onExport: () => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  pineScript,
  validationErrors,
  onExport,
}: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Strategy Preview</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {validationErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="text-red-700 font-semibold mb-2">Validation Errors:</h3>
              <ul className="list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {pineScript}
            </pre>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onExport}
            disabled={validationErrors.length > 0}
            className={`px-4 py-2 rounded text-white ${
              validationErrors.length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
