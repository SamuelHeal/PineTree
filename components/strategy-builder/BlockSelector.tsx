'use client';

import React from 'react';

interface BlockSelectorProps {
  onAddNode: (type: string, data: any) => void;
}

const indicators = [
  { 
    name: 'RSI', 
    type: 'indicator', 
    defaultParams: { 
      period: 14
    } 
  },
  { 
    name: 'MACD', 
    type: 'indicator', 
    defaultParams: { 
      fastPeriod: 12, 
      slowPeriod: 26, 
      signalPeriod: 9
    } 
  },
  { 
    name: 'Moving Average', 
    type: 'indicator', 
    defaultParams: { 
      period: 20, 
      type: 'simple'
    } 
  },
  { 
    name: 'Bollinger Bands', 
    type: 'indicator', 
    defaultParams: { 
      period: 20, 
      multiplier: 2
    } 
  },
  { 
    name: 'Stochastic', 
    type: 'indicator', 
    defaultParams: { 
      kPeriod: 14, 
      dPeriod: 3, 
      smooth: 3
    } 
  },
  { 
    name: 'ATR', 
    type: 'indicator', 
    defaultParams: { 
      period: 14
    } 
  },
  { 
    name: 'Volume', 
    type: 'indicator', 
    defaultParams: {} 
  },
  { 
    name: 'Price Channel', 
    type: 'indicator', 
    defaultParams: { 
      period: 20
    } 
  },
];

const logicOperators = [
  { name: 'Greater Than', type: 'logic', operator: '>' },
  { name: 'Less Than', type: 'logic', operator: '<' },
  { name: 'Equal To', type: 'logic', operator: '=' },
  { name: 'AND', type: 'logic', operator: 'AND' },
  { name: 'OR', type: 'logic', operator: 'OR' },
  { name: 'Cross Above', type: 'logic', operator: 'crossover' },
  { name: 'Cross Below', type: 'logic', operator: 'crossunder' },
];

const executionBlocks = [
  { 
    name: 'Enter Long', 
    type: 'execution', 
    action: 'enter_long',
    defaultParams: {
      orderType: 'market',
      limitPrice: 0,
      stopPrice: 0
    }
  },
  { 
    name: 'Exit Long', 
    type: 'execution', 
    action: 'exit_long',
    defaultParams: {
      orderType: 'market'
    }
  },
  { 
    name: 'Enter Short', 
    type: 'execution', 
    action: 'enter_short',
    defaultParams: {
      orderType: 'market'
    }
  },
  { 
    name: 'Exit Short', 
    type: 'execution', 
    action: 'exit_short',
    defaultParams: {
      orderType: 'market'
    }
  },
];

export default function BlockSelector({ onAddNode }: BlockSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Indicators</h3>
        <div className="space-y-2">
          {indicators.map((indicator) => (
            <button
              key={indicator.name}
              className="w-full px-4 py-2 text-sm bg-white rounded shadow hover:bg-gray-50"
              onClick={() => onAddNode(indicator.type, { ...indicator })}
            >
              {indicator.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Logic</h3>
        <div className="space-y-2">
          {logicOperators.map((operator) => (
            <button
              key={operator.name}
              className="w-full px-4 py-2 text-sm bg-white rounded shadow hover:bg-gray-50"
              onClick={() => onAddNode(operator.type, { ...operator })}
            >
              {operator.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Execution</h3>
        <div className="space-y-2">
          {executionBlocks.map((block) => (
            <button
              key={block.name}
              className="w-full px-4 py-2 text-sm bg-white rounded shadow hover:bg-gray-50"
              onClick={() => onAddNode(block.type, { ...block })}
            >
              {block.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
