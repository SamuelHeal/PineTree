"use client";

import React, { memo } from "react";
import { Handle, Position } from "reactflow";

interface ExecutionNodeData {
  name: string;
  action?: "enter_long" | "exit_long" | "enter_short" | "exit_short";
}

function ExecutionNode({ data }: { data: ExecutionNodeData }) {
  const getStyles = () => {
    if (!data.action) {
      return {
        bg: "bg-gray-100",
        border: "border-gray-500",
        text: "text-gray-700",
      };
    }

    switch (data.action) {
      case "enter_long":
      case "enter_short":
        return {
          bg: "bg-green-100",
          border: "border-green-500",
          text: "text-green-700",
        };
      case "exit_long":
      case "exit_short":
        return {
          bg: "bg-red-100",
          border: "border-red-500",
          text: "text-red-700",
        };
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-500",
          text: "text-gray-700",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md ${styles.bg} border-2 ${styles.border} drag-handle cursor-grab`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-16 !${styles.border.replace(
          "border",
          "bg"
        )} !h-3 !w-3 !rounded-full`}
      />
      <div className="flex items-center">
        <div className="ml-2">
          <div className={`text-lg font-bold ${styles.text}`}>{data.name}</div>
          <div className="text-gray-500">
            {data.action
              ? data.action
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : "Select Action"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ExecutionNode);
