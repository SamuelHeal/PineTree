"use client";

import React, { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface LogicData {
  name: string;
  operator: string;
  compareValue?: number | null;
}

interface LogicNodeProps extends NodeProps {
  data: LogicData;
  onDataChange?: (data: Partial<LogicData>) => void;
}

function LogicNode({ data, onDataChange }: LogicNodeProps) {
  const onValueChange = useCallback(
    (value: string) => {
      if (!onDataChange) return;
      onDataChange({ compareValue: value === "" ? null : Number(value) });
    },
    [onDataChange]
  );

  const renderInput = useCallback(() => {
    if (["AND", "OR"].includes(data.operator)) {
      return null;
    }

    return (
      <input
        type="number"
        value={
          data.compareValue !== undefined && data.compareValue !== null
            ? data.compareValue
            : ""
        }
        onChange={(e) => onValueChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-24"
        placeholder="Compare value"
      />
    );
  }, [data.operator, data.compareValue, onValueChange]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 drag-handle cursor-grab min-w-[200px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-blue-500 !h-3 !w-3 !rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <div className="text-lg font-bold">{data.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Operator: {data.operator}</div>
          {renderInput()}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-blue-500 !h-3 !w-3 !rounded-full"
      />
    </div>
  );
}

export default memo(LogicNode);
