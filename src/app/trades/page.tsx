import DashboardShell from '@/components/DashboardShell'
import { getDashboardData } from '@/utils/dashboard-data'

export default async function TradesPage() {
  const { botConfig, trades } = await getDashboardData()

  return (
    <DashboardShell title="Trades" subtitle="Recent Activity Feed" botConfig={botConfig}>
      <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 md:p-6 border-b border-[#1e2d47] flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-[#f5c842] rounded-full" />
            Live Activity
          </h3>
          <span className="text-[10px] text-[#7a91b5] bg-[#16213e] px-2 py-1 rounded">Last 10 Actions</span>
        </div>

        <div className="overflow-x-auto hidden md:block">
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
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#16213e] transition-colors group">
                  <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-mono text-[#7a91b5]">
                    {new Date(trade.trade_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-white tracking-tight text-sm md:text-base">{trade.symbol}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span
                      className={`text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded ${
                        trade.type === 'BUY' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
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

        <div className="md:hidden divide-y divide-[#1e2d47]">
          {trades.map((trade) => (
            <div key={trade.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">{trade.symbol}</p>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    trade.type === 'BUY' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {trade.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7a91b5] font-mono">
                  {new Date(trade.trade_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-mono text-[#e8eef8]">{Number(trade.price).toFixed(2)}</span>
              </div>
              <div className={`text-right font-bold ${trade.profit >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
                {trade.profit !== 0 ? (trade.profit > 0 ? '+$' : '-$') + Math.abs(trade.profit).toFixed(2) : '--'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}
