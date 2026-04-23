import BotControl from '@/components/BotControl'
import DashboardShell from '@/components/DashboardShell'
import TradingTimeframeControl from '@/components/TradingTimeframeControl'
import { getDashboardData } from '@/utils/dashboard-data'

export default async function BotPage() {
  const { botConfig, analysis, totalPnL } = await getDashboardData()

  return (
    <DashboardShell title="Bot Control" subtitle="Start, stop and monitor strategy health" botConfig={botConfig} showBotControl={false}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-5 md:p-6 shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-4">Runtime Control</h3>
          <BotControl initialConfig={botConfig} />
          <div className="mt-4">
            <TradingTimeframeControl initialTimeframe={botConfig?.trading_timeframe || '5m'} />
          </div>
          <div className="mt-6 pt-6 border-t border-[#1e2d47]">
            <p className="text-[#7a91b5] text-xs uppercase tracking-widest">Net PnL</p>
            <p className={`mt-1 text-2xl font-black ${totalPnL >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
          </div>
        </section>

        <section className="lg:col-span-2 bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-4 md:p-6 shadow-2xl">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-[#22d47a] rounded-full" />
            Symbol Performance
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
