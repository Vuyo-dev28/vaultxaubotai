import { createClient } from '@/utils/supabase/server'
import BotControl from '@/components/BotControl'
import CredentialsForm from '@/components/CredentialsForm'
import LiveLogs from '@/components/LiveLogs'

export default async function Page() {
  const supabase = await createClient()

  // Fetch user for the log component
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch bot config
  const { data: botConfig } = await supabase
    .from('bot_config')
    .select('*')
    .single()

  // Fetch performance analysis
  const { data: analysis } = await supabase
    .from('analysis_results')
    .select('*')
    .order('pnl', { ascending: false })

  // Fetch recent trades
  const { data: trades } = await supabase
    .from('trades_log')
    .select('*')
    .order('trade_time', { ascending: false })
    .limit(10)

  const totalPnL = analysis?.reduce((acc, curr) => acc + Number(curr.pnl), 0) || 0

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eef8] p-3 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-[#0d1425] p-6 md:p-8 rounded-[2rem] border border-[#1e2d47] shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5c842]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto text-center md:text-left relative z-10">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white flex items-center justify-center md:justify-start gap-4">
                <span className="text-[#f5c842] drop-shadow-[0_0_15px_rgba(245,200,66,0.3)]">⚡</span> XauBot <span className="text-[#7a91b5] font-light tracking-normal text-2xl md:text-3xl">PRO</span>
              </h1>
              <p className="text-[#7a91b5] text-xs md:text-sm uppercase tracking-[0.3em] font-black opacity-80">Institutional Scalper Engine</p>
            </div>
            
            <div className="h-px w-12 bg-[#1e2d47] hidden md:block"></div>
            
            <form action="/auth/signout" method="post" className="w-full md:w-auto">
              <button className="group relative px-6 py-2 rounded-full overflow-hidden transition-all active:scale-95">
                <div className="absolute inset-0 bg-[#16213e] group-hover:bg-[#1e2d47] border border-[#1e2d47] rounded-full transition-colors"></div>
                <span className="relative text-[10px] md:text-xs font-black text-[#7a91b5] group-hover:text-white uppercase tracking-widest flex items-center gap-2">
                  🔒 Secure Sign Out
                </span>
              </button>
            </form>
          </div>

          <div className="w-full lg:w-auto relative z-10">
            <BotControl initialConfig={botConfig} />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
            <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Total Net Profit</p>
            <h3 className={`text-xl md:text-3xl font-black ${totalPnL >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </h3>
          </div>
          <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
            <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Active Trades</p>
            <h3 className="text-xl md:text-3xl font-black text-white">
              {trades?.filter(t => t.status === 'OPEN').length || 0}
            </h3>
          </div>
          <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl col-span-2">
            <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Current Connection</p>
            <p className="text-xs md:text-lg font-bold text-[#e8eef8] truncate">
              {botConfig?.mt5_server || 'OFFLINE'} <span className="hidden md:inline text-[#7a91b5] font-normal opacity-50">#{botConfig?.mt5_account}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main View: Trades */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1">
            <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 md:p-6 border-b border-[#1e2d47] flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
                  <span className="w-2 h-2 bg-[#f5c842] rounded-full"></span>
                  Live Activity
                </h2>
                <span className="text-[10px] text-[#7a91b5] bg-[#16213e] px-2 py-1 rounded">Last 10 Actions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-[#7a91b5] text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-[#111a31]">
                      <th className="px-4 md:px-6 py-3 md:py-4">Time</th>
                      <th className="px-4 md:px-6 py-3 md:py-4">Symbol</th>
                      <th className="px-4 md:px-6 py-3 md:py-4">Type</th>
                      <th className="px-4 md:px-6 py-3 md:py-4">Price</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2d47]">
                    {trades?.map((trade) => (
                      <tr key={trade.id} className="hover:bg-[#16213e] transition-colors group">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-mono text-[#7a91b5]">
                          {new Date(trade.trade_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-white tracking-tight text-sm md:text-base">{trade.symbol}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded ${trade.type === 'BUY' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-mono">{Number(trade.price).toFixed(2)}</td>
                        <td className={`px-4 md:px-6 py-3 md:py-4 text-right font-bold text-sm md:text-base ${trade.profit >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
                          {trade.profit !== 0 ? (trade.profit > 0 ? '+$' : '-$') + Math.abs(trade.profit).toFixed(2) : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Performance Analysis */}
            <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-4 md:p-6 shadow-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">
                <span className="w-2 h-2 bg-[#22d47a] rounded-full"></span>
                Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {analysis?.map((item) => (
                  <div key={item.symbol} className="bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 md:p-4 flex justify-between items-center group hover:border-[#f5c842] transition-all">
                    <div>
                      <p className="font-bold text-white text-sm md:text-base">{item.symbol}</p>
                      <p className="text-[9px] md:text-[10px] text-[#7a91b5] uppercase tracking-wide">{item.trades} trades | {item.win_rate}% WR</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-sm md:text-lg ${item.pnl >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
                        ${item.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Configuration */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            {/* Realtime Logs */}
            <LiveLogs userId={user?.id || ''} />

            <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-5 md:p-6 shadow-2xl lg:sticky lg:top-10">
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-white">Bot Settings</h2>
                <p className="text-[10px] md:text-xs text-[#7a91b5] mt-1">Configure your terminal and risk parameters</p>
              </div>
              <CredentialsForm initialConfig={botConfig} />
              
              <div className="mt-6 md:mt-8 pt-6 border-t border-[#1e2d47]">
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-[#7a91b5] bg-[#16213e] p-4 rounded-xl">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#f5c842]/10 rounded-lg flex items-center justify-center text-[#f5c842] text-base md:text-xl">
                    🛡️
                  </div>
                  <div>
                    <p className="font-bold text-[#e8eef8]">Cloud Secured</p>
                    <p className="leading-tight">Data isolated per user ID via RLS policies.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
