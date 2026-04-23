import BotControl from '@/components/BotControl'
import MobileMenu from '@/components/MobileMenu'

type BotConfig = {
  is_running?: boolean
}

export default function DashboardShell({
  title,
  subtitle,
  botConfig,
  showBotControl = true,
  children,
}: {
  title: string
  subtitle: string
  botConfig: BotConfig | null
  showBotControl?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-[#e8eef8] p-3 md:p-10 pb-28 md:pb-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8 bg-[#0d1425] p-4 md:p-8 rounded-[2rem] border border-[#1e2d47] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5c842]/5 rounded-full blur-[100px] -mr-32 -mt-32" />

          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto text-center md:text-left relative z-10">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white flex items-center justify-center md:justify-start gap-3 md:gap-4">
                <span className="text-[#f5c842] drop-shadow-[0_0_15px_rgba(245,200,66,0.3)]">⚡</span> XauBot{' '}
                <span className="text-[#7a91b5] font-light tracking-normal text-2xl md:text-3xl">PRO</span>
              </h1>
              <p className="text-[#7a91b5] text-[11px] md:text-sm uppercase tracking-[0.22em] md:tracking-[0.3em] font-black opacity-80">
                {subtitle}
              </p>
            </div>

            <div className="h-px w-12 bg-[#1e2d47] hidden md:block" />

            <form action="/auth/signout" method="post" className="w-full md:w-auto">
              <button className="group relative px-6 py-2 rounded-full overflow-hidden transition-all active:scale-95">
                <div className="absolute inset-0 bg-[#16213e] group-hover:bg-[#1e2d47] border border-[#1e2d47] rounded-full transition-colors" />
                <span className="relative text-[10px] md:text-xs font-black text-[#7a91b5] group-hover:text-white uppercase tracking-widest flex items-center gap-2">
                  🔒 Secure Sign Out
                </span>
              </button>
            </form>
          </div>

          {showBotControl ? (
            <div className="w-full lg:w-auto relative z-10">
              <BotControl initialConfig={botConfig} />
            </div>
          ) : null}
        </header>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {children}
        </section>
      </div>

      <MobileMenu />
    </div>
  )
}
