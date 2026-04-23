import CredentialsForm from '@/components/CredentialsForm'
import DashboardShell from '@/components/DashboardShell'
import { getDashboardData } from '@/utils/dashboard-data'

export default async function SettingsPage() {
  const { botConfig } = await getDashboardData()

  return (
    <DashboardShell title="Settings" subtitle="Configure terminal and risk parameters" botConfig={botConfig}>
      <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-5 md:p-6 shadow-2xl max-w-3xl">
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
    </DashboardShell>
  )
}
