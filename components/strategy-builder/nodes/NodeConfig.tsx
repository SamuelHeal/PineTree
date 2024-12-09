'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface Parameter {
  name: string;
  value: string | number;
  type: 'number' | 'string' | 'select';
  options?: string[];
}

interface NodeConfigProps {
  parameters: Parameter[];
  onParameterChange: (name: string, value: string | number) => void;
}

export default function NodeConfig({ parameters, onParameterChange }: NodeConfigProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded absolute top-0 right-0"
      >
        <Settings className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-6 w-48 bg-white border rounded-md shadow-lg z-50 p-2">
          {parameters.map((param) => (
            <div key={param.name} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {param.name}
              </label>
              {param.type === 'select' ? (
                <select
                  value={param.value}
                  onChange={(e) => onParameterChange(param.name, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  {param.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={param.type === 'number' ? 'number' : 'text'}
                  value={param.value}
                  onChange={(e) => 
                    onParameterChange(
                      param.name,
                      param.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
