import { Node, Edge } from 'reactflow';

interface StrategyNode extends Node {
  type: 'indicator' | 'logic' | 'execution';
  data: {
    name: string;
    defaultParams?: Record<string, any>;
    operator?: string;
    action?: 'enter_long' | 'exit_long' | 'enter_short' | 'exit_short';
    compareValue?: number;
  };
}

export interface RiskManagementSettings {
  stopLossPercent: number;
  takeProfitPercent: number;
  riskPerTradePercent: number;
  maxPositionPercent: number;
  atrPeriod: number;
}

export class PineScriptConverter {
  private nodes: StrategyNode[];
  private edges: Edge[];
  private variables: Map<string, string>;
  private variableCounter: Map<string, number>;
  private riskSettings: RiskManagementSettings;

  constructor(
    nodes: StrategyNode[], 
    edges: Edge[], 
    riskSettings: RiskManagementSettings = {
      stopLossPercent: 2,
      takeProfitPercent: 6,
      riskPerTradePercent: 2,
      maxPositionPercent: 10,
      atrPeriod: 14
    }
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.variables = new Map();
    this.variableCounter = new Map();
    this.riskSettings = riskSettings;
  }

  private getUniqueVariableName(baseName: string): string {
    const count = (this.variableCounter.get(baseName) || 0) + 1;
    this.variableCounter.set(baseName, count);
    return count === 1 ? baseName : `${baseName}_${count}`;
  }

  private getNodeById(id: string): StrategyNode | undefined {
    return this.nodes.find(node => node.id === id);
  }

  private getConnectedNodes(nodeId: string): Array<{ node: StrategyNode; id: string; varName: string | undefined }> {
    return this.edges
      .filter(edge => edge.target === nodeId)
      .map(edge => ({
        node: this.getNodeById(edge.source) as StrategyNode,
        id: edge.source,
        varName: this.variables.get(edge.source)
      }))
      .filter((item): item is { node: StrategyNode; id: string; varName: string | undefined } => 
        item.node !== undefined);
  }

  private generateIndicatorCode(node: StrategyNode): string {
    let code = '';
    const varName = this.getUniqueVariableName(node.data.name.toLowerCase().replace(/\s+/g, '_'));

    switch (node.data.name) {
      case 'RSI':
        const rsiPeriod = node.data.defaultParams?.period ?? 14;
        code = `${varName} = ta.rsi(close, ${rsiPeriod})`;
        break;
      case 'MACD':
        const fastPeriod = node.data.defaultParams?.fastPeriod ?? 12;
        const slowPeriod = node.data.defaultParams?.slowPeriod ?? 26;
        const signalPeriod = node.data.defaultParams?.signalPeriod ?? 9;
        code = `[${varName}, ${varName}_signal, ${varName}_hist] = ta.macd(close, ${fastPeriod}, ${slowPeriod}, ${signalPeriod})`;
        break;
      case 'Moving Average':
        const maPeriod = node.data.defaultParams?.period ?? 20;
        const maType = node.data.defaultParams?.type ?? 'simple';
        code = `${varName} = ta.${maType === 'simple' ? 'sma' : 'ema'}(close, ${maPeriod})`;
        break;
      case 'Bollinger Bands':
        const bbPeriod = node.data.defaultParams?.period ?? 20;
        const multiplier = node.data.defaultParams?.multiplier ?? 2;
        code = `[${varName}_middle, ${varName}_upper, ${varName}_lower] = ta.bb(close, ${bbPeriod}, ${multiplier})`;
        break;
      case 'Stochastic':
        const kPeriod = node.data.defaultParams?.kPeriod ?? 14;
        const dPeriod = node.data.defaultParams?.dPeriod ?? 3;
        const smooth = node.data.defaultParams?.smooth ?? 3;
        code = `${varName}_k = ta.sma(ta.stoch(close, high, low, ${kPeriod}), ${smooth})
${varName}_d = ta.sma(${varName}_k, ${dPeriod})`;
        break;
      case 'ATR':
        const atrPeriod = node.data.defaultParams?.period ?? 14;
        code = `${varName} = ta.atr(${atrPeriod})`;
        break;
      case 'Volume':
        // Don't create a variable for volume since it's built-in
        return ''; // No need to generate code for volume
      case 'Price Channel':
        const pcPeriod = node.data.defaultParams?.period ?? 20;
        code = `${varName}_high = ta.highest(high, ${pcPeriod})
${varName}_low = ta.lowest(low, ${pcPeriod})`;
        break;
      default:
        code = `// Unsupported indicator: ${node.data.name}`;
    }

    this.variables.set(node.id, varName);
    return code;
  }

  private generateLogicCode(node: StrategyNode): string {
    // For comparison operators (>, <, =), get the indicator they're connected to
    if (node.data.operator === '>' || node.data.operator === '<' || node.data.operator === '=') {
      const connectedNodes = this.getConnectedNodes(node.id);
      if (connectedNodes.length === 0) return '';

      const sourceNode = connectedNodes[0].node;
      const varName = connectedNodes[0].varName;
      
      const compareValue = node.data.compareValue ?? 0;
      
      switch (sourceNode.data.name) {
        case 'Volume':
          return `volume ${node.data.operator} ${compareValue}`;
        case 'RSI':
          if (!varName) return '';
          return `${varName} ${node.data.operator} ${compareValue}`;
        // Add other cases as needed
        default:
          if (!varName) return '';
          return `${varName} ${node.data.operator} ${compareValue}`;
      }
    }
    
    // For AND/OR operators, get the conditions from incoming edges
    if (node.data.operator === 'AND' || node.data.operator === 'OR') {
      const incomingEdges = this.edges.filter(edge => edge.target === node.id);
      if (incomingEdges.length === 0) return '';

      const conditions = incomingEdges.map(edge => {
        const sourceNode = this.getNodeById(edge.source);
        return sourceNode ? this.generateLogicCode(sourceNode) : '';
      });

      const operator = node.data.operator === 'AND' ? ' and ' : ' or ';
      return `(${conditions.filter(Boolean).join(operator)})`;
    }

    // Handle crossover/crossunder cases
    if (node.data.operator === 'crossover' || node.data.operator === 'crossunder') {
      const connectedNodes = this.getConnectedNodes(node.id);
      if (connectedNodes.length === 0) return '';

      const sourceNode = connectedNodes[0].node;
      const varName = connectedNodes[0].varName;
      
      if (!varName) return '';

      // Handle different indicator types for crossover/under
      switch (sourceNode.data.name) {
        case 'MACD':
          return node.data.operator === 'crossover'
            ? `ta.crossover(${varName}, ${varName}_signal)`
            : `ta.crossunder(${varName}, ${varName}_signal)`;
        case 'Moving Average':
          return node.data.operator === 'crossover'
            ? `ta.crossover(close, ${varName})`
            : `ta.crossunder(close, ${varName})`;
        case 'Stochastic':
          const compareValue = node.data.compareValue ?? (node.data.operator === 'crossover' ? 20 : 80);
          return node.data.operator === 'crossover'
            ? `(ta.crossover(${varName}_k, ${varName}_d) and ${varName}_k < ${compareValue})`
            : `(ta.crossunder(${varName}_k, ${varName}_d) and ${varName}_k > ${compareValue})`;
        default:
          // For other indicators, compare with the specified value
          const value = node.data.compareValue ?? 0;
          return node.data.operator === 'crossover'
            ? `ta.crossover(${varName}, ${value})`
            : `ta.crossunder(${varName}, ${value})`;
      }
    }

    // Handle other conditions
    const conditions = this.getConnectedNodes(node.id).map(({ node: sourceNode, varName }) => {
      if (!varName) return '';

      // Use the logic node's compare value and operator
      const compareValue = node.data.compareValue ?? 0;
      const operator = node.data.operator ?? '>';

      switch (sourceNode.data.name) {
        case 'MACD':
          if (operator === '>' || operator === '<') {
            return `${varName} ${operator} ${varName}_signal`;
          }
          return `${varName} ${operator} ${compareValue}`;
        case 'RSI':
          return `${varName} ${operator} ${compareValue}`;
        case 'Moving Average':
          return `close ${operator} ${varName}`;
        case 'Bollinger Bands':
          const band = sourceNode.data.defaultParams?.band ?? 'middle';
          return `close ${operator} ${varName}_${band}`;
        case 'Price Channel':
          if (operator === '>') {
            return `high ${operator} ${varName}_high`;
          } else if (operator === '<') {
            return `low ${operator} ${varName}_low`;
          }
          return `${varName} ${operator} ${compareValue}`;
        case 'Volume':
          return `volume ${operator} ${compareValue}`;
        case 'ATR':
          return `${varName} ${operator} ${compareValue}`;
        default:
          return `${varName} ${operator} ${compareValue}`;
      }
    });

    return conditions.filter(Boolean).join(' and ');
  }

  private generateExecutionCode(node: StrategyNode): string {
    const incomingEdges = this.edges.filter(edge => edge.target === node.id);
    if (incomingEdges.length < 1) return '// Invalid execution node: no condition';

    const condition = this.generateLogicCode(
      this.getNodeById(incomingEdges[0].source) as StrategyNode
    );

    const orderType = node.data.defaultParams?.orderType || 'market';
    const limitPrice = node.data.defaultParams?.limitPrice || 0;
    const stopPrice = node.data.defaultParams?.stopPrice || 0;

    // Calculate position size using current bar's ATR
    const positionSizeCode = `
    position_size := calc_position_size(atr)`;

    // Entry price will be different based on order type
    const entryPriceCode = orderType === 'market' ? 
        'close' : 
        orderType === 'limit' ? 
            limitPrice.toString() : 
            stopPrice.toString();

    const riskManagementCode = `
    if (strategy.position_size == 0)  // Only update stops on new positions
        stop_loss := calc_stop_loss(${entryPriceCode})
        take_profit := calc_take_profit(${entryPriceCode})`;

    switch (node.data.action) {
      case 'enter_long':
        return `if ${condition}
    ${positionSizeCode}
    ${riskManagementCode}
    if strategy.position_size == 0  // Prevent multiple entries
        if "${orderType}" == "market"
            strategy.entry("Long", strategy.long, qty=position_size)
        else if "${orderType}" == "limit"
            strategy.entry("Long", strategy.long, limit=${limitPrice}, qty=position_size)
        else if "${orderType}" == "stop"
            strategy.entry("Long", strategy.long, stop=${stopPrice}, qty=position_size)
        strategy.exit("Exit Long", "Long", stop=stop_loss, limit=take_profit)`;

      case 'exit_long':
        return `if ${condition}
    strategy.close("Long")`;

      case 'enter_short':
        return `if ${condition}
    ${positionSizeCode}
    ${riskManagementCode}
    if strategy.position_size == 0  // Prevent multiple entries
        if "${orderType}" == "market"
            strategy.entry("Short", strategy.short, qty=position_size)
        else if "${orderType}" == "limit"
            strategy.entry("Short", strategy.short, limit=${limitPrice}, qty=position_size)
        else if "${orderType}" == "stop"
            strategy.entry("Short", strategy.short, stop=${stopPrice}, qty=position_size)
        strategy.exit("Exit Short", "Short", stop=stop_loss, limit=take_profit)`;

      case 'exit_short':
        return `if ${condition}
    strategy.close("Short")`;

      default:
        return '// Invalid action';
    }
  }

  public convert(): string {
    const indicatorNodes = this.nodes.filter(node => node.type === 'indicator');
    const executionNodes = this.nodes.filter(node => node.type === 'execution');

    const header = `//@version=5
strategy("Custom Trading Strategy", overlay=true, initial_capital=100000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_type=strategy.commission.percent, commission_value=0.1)

// Risk Management Functions
calc_position_size(atr) =>
    risk_amount = strategy.equity * ${this.riskSettings.riskPerTradePercent / 100}  // ${this.riskSettings.riskPerTradePercent}% risk per trade
    pos_size = risk_amount / (atr * syminfo.pointvalue)
    math.min(pos_size, strategy.equity * ${this.riskSettings.maxPositionPercent / 100})  // Max ${this.riskSettings.maxPositionPercent}% of equity per trade

calc_stop_loss(entry_price) =>
    entry_price * (1 - ${this.riskSettings.stopLossPercent / 100})  // ${this.riskSettings.stopLossPercent}% stop loss

calc_take_profit(entry_price) =>
    entry_price * (1 + ${this.riskSettings.takeProfitPercent / 100})  // ${this.riskSettings.takeProfitPercent}% take profit

// Strategy Variables
var float position_size = 0.0
var float stop_loss = 0.0
var float take_profit = 0.0

// Calculate ATR for each bar
atr = ta.atr(${this.riskSettings.atrPeriod})

// Variables and Indicators
`;

    const indicators = indicatorNodes
      .map(node => this.generateIndicatorCode(node))
      .join('\n');

    const executions = executionNodes
      .map(node => this.generateExecutionCode(node))
      .join('\n\n');

    return `${header}${indicators}\n\n// Strategy Logic\n${executions}`;
  }

  public validate(): string[] {
    const errors: string[] = [];

    // Check for minimum required components
    if (this.nodes.length === 0) {
      errors.push('Strategy must contain at least one node');
    }

    if (!this.nodes.some(node => node.type === 'execution')) {
      errors.push('Strategy must have at least one execution node (Buy or Sell)');
    }

    // Check for disconnected nodes
    this.nodes.forEach(node => {
      const hasIncoming = this.edges.some(edge => edge.target === node.id);
      const hasOutgoing = this.edges.some(edge => edge.source === node.id);

      if (node.type !== 'indicator' && !hasIncoming) {
        errors.push(`${node.data.name} node is missing input connection`);
      }

      if (node.type !== 'execution' && !hasOutgoing) {
        errors.push(`${node.data.name} node is missing output connection`);
      }
    });

    // Check for cycles
    if (this.hasCycle()) {
      errors.push('Strategy contains circular dependencies');
    }

    // Check for invalid connections
    this.edges.forEach(edge => {
      const sourceNode = this.getNodeById(edge.source);
      const targetNode = this.getNodeById(edge.target);

      if (!sourceNode || !targetNode) {
        errors.push('Invalid connection: missing node');
        return;
      }

      if (sourceNode.type === 'execution') {
        errors.push('Execution nodes cannot have outgoing connections');
      }

      if (targetNode.type === 'indicator') {
        errors.push('Indicator nodes cannot have incoming connections');
      }
    });

    return errors;
  }

  private hasCycle(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const connectedNodes = this.getConnectedNodes(nodeId);
      for (const node of connectedNodes) {
        if (!visited.has(node.id)) {
          if (dfs(node.id)) return true;
        } else if (recursionStack.has(node.id)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }
}
