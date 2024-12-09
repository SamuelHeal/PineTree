'use client';

import React, { useState } from 'react';
import { Copy, Check, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose
} from "@/components/ui/dialog";

interface PineScriptPreviewProps {
  pineScript: string;
  validationErrors: string[];
}

export default function PineScriptPreview({ pineScript, validationErrors }: PineScriptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pineScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Pine Script Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Expand preview"
            >
              <Maximize2 className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        {validationErrors.length > 0 && (
          <div className="mb-2">
            <h4 className="text-red-500 font-medium mb-1">Validation Errors:</h4>
            <ul className="list-disc list-inside text-sm text-red-500">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto h-[calc(100%-4rem)] font-mono whitespace-pre-wrap">
          {pineScript || 'No Pine Script generated yet'}
        </pre>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Pine Script Preview</DialogTitle>
              <DialogClose className="p-2 hover:bg-gray-100 rounded-md transition-colors" />
            </div>
          </DialogHeader>
          {validationErrors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-red-500 font-medium mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside text-sm text-red-500">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <pre className="bg-gray-50 p-6 rounded-lg text-sm h-full overflow-auto font-mono whitespace-pre-wrap">
              {pineScript || 'No Pine Script generated yet'}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
