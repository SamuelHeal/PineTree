'use client';

import React from 'react';
import { strategyTemplates, StrategyTemplate } from '@/utils/strategy/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: StrategyTemplate) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function TemplateSelector({
  onSelectTemplate,
  onClose,
  isOpen,
}: TemplateSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Choose a Template</h2>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            {strategyTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
              >
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
