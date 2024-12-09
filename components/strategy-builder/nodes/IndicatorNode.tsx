"use client";

import React, { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface IndicatorData {
  name: string;
  defaultParams?: Record<string, any>;
}

interface IndicatorNodeProps extends NodeProps {
  data: IndicatorData;
  onDataChange?: (data: Partial<IndicatorData>) => void;
}

function IndicatorNode({ data, id, onDataChange }: IndicatorNodeProps) {
  const onParameterChange = useCallback(
    (paramName: string, value: string | number) => {
      if (!onDataChange) return;
      const newParams = { ...data.defaultParams };
      newParams[paramName] = value;
      onDataChange({ defaultParams: newParams });
    },
    [data.defaultParams, onDataChange]
  );

  const renderInput = useCallback(
    ([key, value]: [string, any]) => (
      <div key={key} className="flex items-center gap-2">
        <label className="text-sm text-gray-600 flex-1">{key}:</label>
        {key === "type" ? (
          <select
            value={String(value)}
            onChange={(e) => onParameterChange(key, e.target.value)}
            className="border rounded px-2 py-1 text-sm w-24"
          >
            <option value="simple">Simple</option>
            <option value="exponential">Exponential</option>
          </select>
        ) : (
          <input
            type="number"
            value={value !== undefined && value !== null ? value : ""}
            onChange={(e) =>
              onParameterChange(
                key,
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="border rounded px-2 py-1 text-sm w-24"
          />
        )}
      </div>
    ),
    [onParameterChange]
  );

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 drag-handle cursor-grab min-w-[200px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500 !h-3 !w-3 !rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <div className="text-lg font-bold">{data.name}</div>
        </div>
        <div className="space-y-2">
          {Object.entries(data.defaultParams || {}).map(renderInput)}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500 !h-3 !w-3 !rounded-full"
      />
    </div>
  );
}

export default memo(IndicatorNode);
