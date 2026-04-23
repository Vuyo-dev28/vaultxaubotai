import DashboardShell from '@/components/DashboardShell'
import TotalNetProfitCard from '@/components/TotalNetProfitCard'
import TradingTimeframeControl from '@/components/TradingTimeframeControl'
import { getDashboardData } from '@/utils/dashboard-data'

export default async function Page() {
  const { botConfig, trades, totalPnL, analysis } = await getDashboardData()
  const activeTrades = trades.filter((trade) => trade.status === 'OPEN').length

  return (
    <DashboardShell title="Home" subtitle="Institutional Scalper Engine" botConfig={botConfig}>
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <TotalNetProfitCard initialTotal={totalPnL} />
          <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
            <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Active Trades</p>
            <h3 className="text-xl md:text-3xl font-black text-white">{activeTrades}</h3>
          </div>
          <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl col-span-2">
            <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Current Connection</p>
            <p className="text-xs md:text-lg font-bold text-[#e8eef8] truncate">
              {botConfig?.mt5_server || 'OFFLINE'} <span className="hidden md:inline text-[#7a91b5] font-normal opacity-50">#{botConfig?.mt5_account}</span>
            </p>
          </div>
        </div>

        <TradingTimeframeControl initialTimeframe={botConfig?.trading_timeframe || '5m'} />

        <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-4 md:p-6 shadow-2xl">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-[#22d47a] rounded-full" />
            Performance Snapshot
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {analysis.map((item) => (
              <div
                key={item.symbol}
                className="bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 md:p-4 flex justify-between items-center group hover:border-[#f5c842] transition-all"
              >
                <div>
                  <p className="font-bold text-white text-sm md:text-base">{item.symbol}</p>
                  <p className="text-[9px] md:text-[10px] text-[#7a91b5] uppercase tracking-wide">
                    {item.trades} trades | {item.win_rate}% WR
                  </p>
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
    </DashboardShell>
  )
}
