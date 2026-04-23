import DashboardShell from '@/components/DashboardShell'
import LiveLogs from '@/components/LiveLogs'
import { getDashboardData } from '@/utils/dashboard-data'

export default async function LogsPage() {
  const { botConfig, user } = await getDashboardData()

  return (
    <DashboardShell title="Live Logs" subtitle="Realtime engine output and diagnostics" botConfig={botConfig}>
      <LiveLogs userId={user?.id || ''} />
    </DashboardShell>
  )
}
