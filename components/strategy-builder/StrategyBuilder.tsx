"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import IndicatorNode from "./nodes/IndicatorNode";
import LogicNode from "./nodes/LogicNode";
import ExecutionNode from "./nodes/ExecutionNode";
import BlockSelector from "./BlockSelector";
import TemplateSelector from "./TemplateSelector";
import PineScriptPreview from "./PineScriptPreview";
import ChatBot from "./ChatBot";
import SaveStrategyDialog from "./SaveStrategyDialog";
import LoadStrategyDialog from "./LoadStrategyDialog";
import {
  PineScriptConverter,
  RiskManagementSettings,
} from "@/utils/strategy/pinescript-converter";
import { Card, CardContent } from "@/components/ui/card";
import { Strategy } from "@/lib/supabase";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StrategyBuilder() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [pineScript, setPineScript] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [riskSettings, setRiskSettings] = useState<RiskManagementSettings>({
    stopLossPercent: 2,
    takeProfitPercent: 6,
    riskPerTradePercent: 2,
    maxPositionPercent: 10,
    atrPeriod: 14,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const addNode = useCallback((type: string, data: any) => {
    const position = { x: Math.random() * 500, y: Math.random() * 300 };
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data,
      dragHandle: ".drag-handle",
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const loadTemplate = useCallback((template: any) => {
    setNodes(template.nodes);
    setEdges(template.edges);
  }, []);

  const onNodesDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  }, []);

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      indicator: (props) => (
        <IndicatorNode
          {...props}
          onDataChange={(data) => onNodesDataChange(props.id, data)}
        />
      ),
      logic: (props) => (
        <LogicNode
          {...props}
          onDataChange={(data) => onNodesDataChange(props.id, data)}
        />
      ),
      execution: ExecutionNode,
    }),
    [onNodesDataChange]
  );

  const handleStrategyGenerated = useCallback((strategy: any) => {
    if (!strategy?.nodes || !strategy?.edges) return;

    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);

    // Add each node from the strategy
    const newNodes: Node[] = strategy.nodes
      .map((node: any, index: number) => {
        const position = {
          x: 250,
          y: index * 150, // Stack nodes vertically with spacing
        };

        if (node.type === "indicator") {
          return {
            id: node.id,
            type: node.type,
            position,
            data: {
              name: node.data.name,
              type: "indicator",
              defaultParams: node.data.defaultParams,
            },
            dragHandle: ".drag-handle",
          };
        }

        if (node.type === "logic") {
          return {
            id: node.id,
            type: node.type,
            position,
            data: {
              name: node.data.name,
              operator: node.data.operator,
              compareValue: node.data.compareValue,
            },
            dragHandle: ".drag-handle",
          };
        }

        if (node.type === "execution") {
          return {
            id: node.id,
            type: node.type,
            position,
            data: {
              name: node.data.name,
              action: node.data.action,
              defaultParams: node.data.defaultParams,
            },
            dragHandle: ".drag-handle",
          };
        }

        return null;
      })
      .filter(Boolean);

    // Add the edges exactly as they come from the strategy
    const newEdges: Edge[] = strategy.edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "default",
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const handleLoadStrategy = (strategy: Strategy) => {
    setNodes(strategy.nodes);
    setEdges(strategy.edges);
    setRiskSettings(strategy.risk_settings);
    setPineScript(strategy.pine_script);
  };

  const updatePineScript = useCallback(() => {
    try {
      const converter = new PineScriptConverter(
        nodes as any[],
        edges,
        riskSettings
      );
      const script = converter.convert();
      setPineScript(script);
      setValidationErrors([]);
    } catch (error) {
      setValidationErrors([
        error instanceof Error ? error.message : "Unknown error",
      ]);
    }
  }, [nodes, edges, riskSettings]);

  const updateRiskSettings = useCallback(
    (key: keyof RiskManagementSettings, value: number) => {
      setRiskSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleClearStrategy = () => {
    setNodes([]);
    setEdges([]);
    setPineScript("");
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    updatePineScript();
  }, [updatePineScript]);

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-background">
          <div className="p-4 border-b">
            <Button
              variant="link"
              className="gap-2 text-muted-foreground hover:text-foreground w-full"
              onClick={() => router.push("/dashboard")}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto p-4">
            <Card className="mb-4">
              <CardContent className="p-4 space-y-2">
                <button
                  onClick={() => setIsLoadDialogOpen(true)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                >
                  Load Strategy
                </button>
                <button
                  onClick={() => setIsTemplateOpen(true)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                >
                  Load Template
                </button>
                <button
                  onClick={() => setIsSaveDialogOpen(true)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                >
                  Save Strategy
                </button>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="p-4">
                <BlockSelector onAddNode={addNode} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Flow Editor */}
          <div className="flex-1 h-[calc(100%-16rem)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              {/* <MiniMap /> */}

              {/* Risk Management Overlay */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
                <div className="inline-flex items-center gap-3 p-3 rounded-lg border bg-background shadow-sm">
                  <h3 className="text-sm font-medium whitespace-nowrap">
                    Risk Settings
                  </h3>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="stopLoss" className="text-sm">
                        SL%:
                      </label>
                      <input
                        id="stopLoss"
                        type="number"
                        value={riskSettings.stopLossPercent}
                        onChange={(e) =>
                          updateRiskSettings(
                            "stopLossPercent",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-14 h-7 px-2 text-sm border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="takeProfit" className="text-sm">
                        TP%:
                      </label>
                      <input
                        id="takeProfit"
                        type="number"
                        value={riskSettings.takeProfitPercent}
                        onChange={(e) =>
                          updateRiskSettings(
                            "takeProfitPercent",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-14 h-7 px-2 text-sm border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="riskPerTrade" className="text-sm">
                        Risk%:
                      </label>
                      <input
                        id="riskPerTrade"
                        type="number"
                        value={riskSettings.riskPerTradePercent}
                        onChange={(e) =>
                          updateRiskSettings(
                            "riskPerTradePercent",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-14 h-7 px-2 text-sm border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="maxPosition" className="text-sm">
                        Max%:
                      </label>
                      <input
                        id="maxPosition"
                        type="number"
                        value={riskSettings.maxPositionPercent}
                        onChange={(e) =>
                          updateRiskSettings(
                            "maxPositionPercent",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-14 h-7 px-2 text-sm border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="atrPeriod" className="text-sm">
                        ATR:
                      </label>
                      <input
                        id="atrPeriod"
                        type="number"
                        value={riskSettings.atrPeriod}
                        onChange={(e) =>
                          updateRiskSettings(
                            "atrPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-14 h-7 px-2 text-sm border rounded"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="p-3 rounded-lg border bg-background shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Clear strategy"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </ReactFlow>
          </div>

          {/* PineScript Preview */}
          <div className="h-64 border-t bg-background p-4">
            <PineScriptPreview
              pineScript={pineScript}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        {/* Right Sidebar - Chat Panel */}
        <div
          className={`${
            isChatCollapsed ? "w-12" : "w-96"
          } border-l bg-background overflow-hidden flex flex-col transition-all duration-300`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            {!isChatCollapsed && (
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatCollapsed(!isChatCollapsed)}
              className="ml-auto"
            >
              {isChatCollapsed ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
          {!isChatCollapsed && (
            <div className="flex-1 overflow-hidden">
              <ChatBot onStrategyGenerated={handleStrategyGenerated} />
            </div>
          )}
        </div>
      </div>

      <LoadStrategyDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        onStrategyLoad={handleLoadStrategy}
      />

      <SaveStrategyDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        nodes={nodes}
        edges={edges}
        riskSettings={riskSettings}
        pineScript={pineScript}
      />

      <TemplateSelector
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        onSelectTemplate={loadTemplate}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Strategy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your strategy? This will remove all
              building blocks and connections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearStrategy}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear Strategy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
