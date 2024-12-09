import { Node, Edge } from 'reactflow';

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

const createNodeId = (type: string, index: number) => `${type}-template-${index}`;

export const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'rsi-basic',
    name: 'Basic RSI Strategy',
    description: 'Enter long when RSI is oversold (< 30) and enter short when overbought (> 70)',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { name: 'RSI', defaultParams: { period: 14 } },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { name: 'Less Than', operator: '<', compareValue: 30 },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { name: 'Greater Than', operator: '>', compareValue: 70 },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
      {
        id: createNodeId('logic', 3),
        type: 'logic',
        position: { x: 500, y: 200 },
        data: { name: 'Greater Than', operator: '>', compareValue: 50 },
      },
      {
        id: createNodeId('execution', 3),
        type: 'execution',
        position: { x: 500, y: 300 },
        data: { name: 'Exit Long', action: 'exit_long' },
      },
      {
        id: createNodeId('logic', 4),
        type: 'logic',
        position: { x: 700, y: 200 },
        data: { name: 'Less Than', operator: '<', compareValue: 50 },
      },
      {
        id: createNodeId('execution', 4),
        type: 'execution',
        position: { x: 700, y: 300 },
        data: { name: 'Exit Short', action: 'exit_short' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
      {
        id: 'e1-6',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 3),
      },
      {
        id: 'e6-7',
        source: createNodeId('logic', 3),
        target: createNodeId('execution', 3),
      },
      {
        id: 'e1-8',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 4),
      },
      {
        id: 'e8-9',
        source: createNodeId('logic', 4),
        target: createNodeId('execution', 4),
      },
    ],
  },
  {
    id: 'ma-crossover',
    name: 'Moving Average Crossover',
    description: 'Enter long when fast MA crosses above slow MA, enter short when it crosses below',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { name: 'Moving Average', defaultParams: { period: 9, type: 'simple' } },
      },
      {
        id: createNodeId('indicator', 2),
        type: 'indicator',
        position: { x: 300, y: 100 },
        data: { name: 'Moving Average', defaultParams: { period: 21, type: 'simple' } },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
      {
        id: createNodeId('logic', 3),
        type: 'logic',
        position: { x: 500, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
        },
      },
      {
        id: createNodeId('execution', 3),
        type: 'execution',
        position: { x: 500, y: 300 },
        data: { name: 'Exit Long', action: 'exit_long' },
      },
      {
        id: createNodeId('logic', 4),
        type: 'logic',
        position: { x: 700, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
        },
      },
      {
        id: createNodeId('execution', 4),
        type: 'execution',
        position: { x: 700, y: 300 },
        data: { name: 'Exit Short', action: 'exit_short' },
      },
    ],
    edges: [
      // Enter Long logic
      {
        id: 'e1-3',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
        sourceHandle: 'fast',
      },
      {
        id: 'e2-3',
        source: createNodeId('indicator', 2),
        target: createNodeId('logic', 1),
        sourceHandle: 'slow',
      },
      {
        id: 'e3-4',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      // Enter Short logic
      {
        id: 'e1-5',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
        sourceHandle: 'fast',
      },
      {
        id: 'e2-5',
        source: createNodeId('indicator', 2),
        target: createNodeId('logic', 2),
        sourceHandle: 'slow',
      },
      {
        id: 'e5-6',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
      // Exit Long logic
      {
        id: 'e1-7',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 3),
        sourceHandle: 'fast',
      },
      {
        id: 'e2-7',
        source: createNodeId('indicator', 2),
        target: createNodeId('logic', 3),
        sourceHandle: 'slow',
      },
      {
        id: 'e7-8',
        source: createNodeId('logic', 3),
        target: createNodeId('execution', 3),
      },
      // Exit Short logic
      {
        id: 'e1-9',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 4),
        sourceHandle: 'fast',
      },
      {
        id: 'e2-9',
        source: createNodeId('indicator', 2),
        target: createNodeId('logic', 4),
        sourceHandle: 'slow',
      },
      {
        id: 'e9-10',
        source: createNodeId('logic', 4),
        target: createNodeId('execution', 4),
      },
    ],
  },
  {
    id: 'macd-strategy',
    name: 'MACD Strategy',
    description: 'Enter long when MACD crosses above signal line, enter short when it crosses below',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: {
          name: 'MACD',
          defaultParams: { 
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
          } 
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Exit Long', action: 'exit_long' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
    ],
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands Strategy',
    description: 'Enter long when price touches lower band, enter short when it touches upper band',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { 
          name: 'Bollinger Bands', 
          defaultParams: { 
            period: 20,
            multiplier: 2
          } 
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Less Than',
          operator: '<',
          compareValue: 0 // Lower Band
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Greater Than',
          operator: '>',
          compareValue: 0 // Upper Band
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
    ],
  },
  {
    id: 'stochastic-strategy',
    name: 'Stochastic Strategy',
    description: 'Enter long when Stochastic crosses above oversold level (20), enter short when crosses below overbought level (80)',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { 
          name: 'Stochastic', 
          defaultParams: { 
            kPeriod: 14,
            dPeriod: 3,
            smooth: 3
          } 
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
          compareValue: 20
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
          compareValue: 80
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
    ],
  },
  {
    id: 'atr-strategy',
    name: 'ATR Volatility Strategy',
    description: 'Enter positions when price moves more than 1 ATR from previous close',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { 
          name: 'ATR', 
          defaultParams: { 
            period: 14
          } 
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Greater Than',
          operator: '>',
          compareValue: 1 // 1 ATR
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Less Than',
          operator: '<',
          compareValue: -1 // -1 ATR
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
    ],
  },
  {
    id: 'volume-strategy',
    name: 'Volume Breakout Strategy',
    description: 'Enter positions when volume spikes above average',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { 
          name: 'Volume',
          defaultParams: {}
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Greater Than',
          operator: '>',
          compareValue: 200 // 200% of average volume
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
    ],
  },
  {
    id: 'price-channel-strategy',
    name: 'Price Channel Breakout Strategy',
    description: 'Enter long on upper channel breakout, enter short on lower channel breakdown',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { 
          name: 'Price Channel', 
          defaultParams: { 
            period: 20
          } 
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Greater Than',
          operator: '>',
          compareValue: 0 // Upper channel
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Less Than',
          operator: '<',
          compareValue: 0 // Lower channel
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
    ],
  },
  {
    id: 'macd-crossover',
    name: 'MACD Crossover Strategy',
    description: 'Enter long when MACD crosses above signal line, enter short when it crosses below',
    nodes: [
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: {
          name: 'MACD',
          defaultParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
        },
      },
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
        },
      },
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 100, y: 300 },
        data: { name: 'Enter Long', action: 'enter_long' },
      },
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
        },
      },
      {
        id: createNodeId('execution', 2),
        type: 'execution',
        position: { x: 300, y: 300 },
        data: { name: 'Enter Short', action: 'enter_short' },
      },
      {
        id: createNodeId('logic', 3),
        type: 'logic',
        position: { x: 500, y: 200 },
        data: { 
          name: 'Cross Below',
          operator: 'crossunder',
        },
      },
      {
        id: createNodeId('execution', 3),
        type: 'execution',
        position: { x: 500, y: 300 },
        data: { name: 'Exit Long', action: 'exit_long' },
      },
      {
        id: createNodeId('logic', 4),
        type: 'logic',
        position: { x: 700, y: 200 },
        data: { 
          name: 'Cross Above',
          operator: 'crossover',
        },
      },
      {
        id: createNodeId('execution', 4),
        type: 'execution',
        position: { x: 700, y: 300 },
        data: { name: 'Exit Short', action: 'exit_short' },
      },
    ],
    edges: [
      // Enter Long logic
      {
        id: 'e1-2',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      {
        id: 'e2-3',
        source: createNodeId('logic', 1),
        target: createNodeId('execution', 1),
      },
      // Enter Short logic
      {
        id: 'e1-4',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 2),
      },
      {
        id: 'e4-5',
        source: createNodeId('logic', 2),
        target: createNodeId('execution', 2),
      },
      // Exit Long logic
      {
        id: 'e1-6',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 3),
      },
      {
        id: 'e6-7',
        source: createNodeId('logic', 3),
        target: createNodeId('execution', 3),
      },
      // Exit Short logic
      {
        id: 'e1-8',
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 4),
      },
      {
        id: 'e8-9',
        source: createNodeId('logic', 4),
        target: createNodeId('execution', 4),
      },
    ],
  },
  {
    id: 'rsi-volume',
    name: 'RSI + Volume Strategy',
    description: 'Enter long when RSI is oversold (< 30) AND volume is above average (> 200)',
    nodes: [
      // RSI Indicator
      {
        id: createNodeId('indicator', 1),
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { name: 'RSI', defaultParams: { period: 14 } },
      },
      // RSI Logic
      {
        id: createNodeId('logic', 1),
        type: 'logic',
        position: { x: 100, y: 200 },
        data: { name: 'Less Than', operator: '<', compareValue: 30 },
      },
      // Volume Indicator
      {
        id: createNodeId('indicator', 2),
        type: 'indicator',
        position: { x: 300, y: 100 },
        data: { name: 'Volume' },
      },
      // Volume Logic
      {
        id: createNodeId('logic', 2),
        type: 'logic',
        position: { x: 300, y: 200 },
        data: { name: 'Greater Than', operator: '>', compareValue: 200 },
      },
      // AND Logic
      {
        id: createNodeId('logic', 3),
        type: 'logic',
        position: { x: 200, y: 300 },
        data: { name: 'AND', operator: 'AND' },
      },
      // Enter Long
      {
        id: createNodeId('execution', 1),
        type: 'execution',
        position: { x: 200, y: 400 },
        data: { 
          name: 'Enter Long',
          action: 'enter_long',
          defaultParams: {
            orderType: 'market',
            limitPrice: 0,
            stopPrice: 0
          }
        },
      },
    ],
    edges: [
      // Connect RSI to its Logic
      {
        id: `e1-2`,
        source: createNodeId('indicator', 1),
        target: createNodeId('logic', 1),
      },
      // Connect Volume to its Logic
      {
        id: `e3-4`,
        source: createNodeId('indicator', 2),
        target: createNodeId('logic', 2),
      },
      // Connect RSI Logic to AND
      {
        id: `e2-5`,
        source: createNodeId('logic', 1),
        target: createNodeId('logic', 3),
      },
      // Connect Volume Logic to AND
      {
        id: `e4-5`,
        source: createNodeId('logic', 2),
        target: createNodeId('logic', 3),
      },
      // Connect AND to Enter Long
      {
        id: `e5-6`,
        source: createNodeId('logic', 3),
        target: createNodeId('execution', 1),
      },
    ],
  },
];
