import { createClient } from '@/utils/supabase/server'

type Trade = {
  id: string
  trade_time: string
  symbol: string
  type: 'BUY' | 'SELL'
  price: number
  profit: number
  status?: string
}

type AnalysisItem = {
  symbol: string
  trades: number
  win_rate: number
  pnl: number
}

type BotConfig = {
  is_running?: boolean
  mt5_server?: string
  mt5_account?: string
  mt5_path?: string
  max_positions?: number
  risk_percent?: number
  trading_timeframe?: string
} | null

export async function getDashboardData() {
  const supabase = await createClient()

  const [{ data: authData }, { data: botConfig }, { data: analysis }, { data: trades }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('bot_config').select('*').single(),
    supabase.from('analysis_results').select('*').order('pnl', { ascending: false }),
    supabase.from('trades_log').select('*').order('trade_time', { ascending: false }).limit(10),
  ])

  const totalPnL = (analysis as AnalysisItem[] | null)?.reduce((acc, curr) => acc + Number(curr.pnl), 0) || 0

  return {
    user: authData.user,
    botConfig: botConfig as BotConfig,
    analysis: (analysis as AnalysisItem[] | null) || [],
    trades: (trades as Trade[] | null) || [],
    totalPnL,
  }
}
