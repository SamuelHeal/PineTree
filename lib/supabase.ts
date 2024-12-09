import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  risk_settings: {
    stopLossPercent: number;
    takeProfitPercent: number;
    riskPerTradePercent: number;
    maxPositionPercent: number;
    atrPeriod: number;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
  pine_script: string;
}
