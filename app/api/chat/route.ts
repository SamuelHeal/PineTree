import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CHAT_SYSTEM_PROMPT =
  "You are a helpful assistant specializing in trading strategies and Pine Script. Help users understand trading concepts, indicators, and how to build effective trading strategies.";

const GENERATE_SYSTEM_PROMPT = `You are a trading strategy assistant that helps users create valid PineScript strategies for TradingView.
When generating a strategy, you must follow these rules EXACTLY to ensure compatibility with the platform's building blocks:

1. Indicator Nodes:
Available indicators with their EXACT parameters:
{
  "RSI": { 
    "period": number  // default: 14
  },
  "MACD": { 
    "fastPeriod": number,  // default: 12
    "slowPeriod": number,  // default: 26
    "signalPeriod": number  // default: 9
  },
  "Moving Average": { 
    "period": number,  // default: 20
    "type": "simple" | "exponential"  // default: "simple"
  },
  "Bollinger Bands": { 
    "period": number,  // default: 20
    "multiplier": number  // default: 2
  },
  "Stochastic": { 
    "kPeriod": number,  // default: 14
    "dPeriod": number,  // default: 3
    "smooth": number  // default: 3
  },
  "ATR": { 
    "period": number  // default: 14
  },
  "Volume": {},
  "Price Channel": { 
    "period": number  // default: 20
  }
}

2. Logic Nodes:
Available operators (EXACT strings required):
- "Greater Than" (operator: ">")
- "Less Than" (operator: "<")
- "Equal To" (operator: "=")
- "AND" (operator: "AND")
- "OR" (operator: "OR")
- "Cross Above" (operator: "crossover")
- "Cross Below" (operator: "crossunder")

For comparison operators (>, <, =), include a compareValue in the node data.

3. Execution Nodes:
Available actions (EXACT strings required):
- "Enter Long" (action: "enter_long")
- "Exit Long" (action: "exit_long")
- "Enter Short" (action: "enter_short")
- "Exit Short" (action: "exit_short")

Each execution node must include:
{
  "orderType": "market" | "limit" | "stop",
  "limitPrice": number | null,  // Required for limit orders
  "stopPrice": number | null    // Required for stop orders
}

4. Strategy Output Format:
{
  "nodes": [
    // Indicator Node Example
    {
      "id": "indicator_1",  // Use descriptive IDs
      "type": "indicator",
      "data": {
        "name": "RSI",  // Must match available indicator names exactly
        "defaultParams": {
          "period": 14
        }
      }
    },
    // Logic Node Example
    {
      "id": "logic_1",
      "type": "logic",
      "data": {
        "name": "RSI Oversold",  // Descriptive name
        "operator": ">",  // Must match available operators exactly
        "compareValue": 30  // Required for comparison operators
      }
    },
    // Execution Node Example
    {
      "id": "exec_1",
      "type": "execution",
      "data": {
        "name": "Enter Long Position",  // Descriptive name
        "action": "enter_long",  // Must match available actions exactly
        "defaultParams": {
          "orderType": "market"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "indicator_1",  // Must reference valid node IDs
      "target": "logic_1"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Node IDs must be unique and descriptive (e.g., "rsi_1", "logic_1", "exec_1")
2. All node names, operators, and actions must match the available options EXACTLY
3. Include all required parameters for each node type
4. Logic nodes must have compareValue for comparison operators
5. Execution nodes must have valid orderType and required price parameters
6. Edges must connect nodes in a valid sequence (indicator → logic → execution)
7. Do not include any additional properties not specified in these examples

When generating a strategy:
1. Use these exact node structures
2. Ensure all parameters match the specified types
3. Create logical connections between nodes
4. Test that each node's properties exactly match the available options`;

export async function POST(req: Request) {
  try {
    const { message, mode } = await req.json();

    const systemPrompt =
      mode === "generate" ? GENERATE_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Safely get the response text
    const responseText =
      completion.content?.[0]?.type === "text"
        ? completion.content[0].text
        : "";

    if (mode === "generate") {
      // Try to parse the strategy JSON from the response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const strategyJson = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        return NextResponse.json({
          message: responseText,
          strategy: strategyJson,
        });
      } catch (error) {
        console.error("Error parsing strategy JSON:", error);
        return NextResponse.json({
          message:
            "I understood the strategy but couldn't generate the proper format. Please try rephrasing your request.",
          strategy: null,
        });
      }
    }

    return NextResponse.json({
      message: responseText,
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
