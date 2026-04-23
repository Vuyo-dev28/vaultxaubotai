'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TotalNetProfitCard({ initialTotal }: { initialTotal: number }) {
  const [totalPnL, setTotalPnL] = useState(initialTotal)
  const supabase = createClient()

  const refreshTotal = useCallback(async () => {
    const { data } = await supabase.from('analysis_results').select('pnl')
    const nextTotal = (data || []).reduce((acc, row) => acc + Number(row.pnl || 0), 0)
    setTotalPnL(nextTotal)
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel('analysis-results-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'analysis_results' },
        () => {
          void refreshTotal()
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refreshTotal, supabase])

  return (
    <div className="bg-[#0d1425] border border-[#1e2d47] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
      <p className="text-[9px] md:text-xs font-bold text-[#7a91b5] uppercase tracking-wider mb-1 md:mb-2">Total Net Profit</p>
      <h3 className={`text-xl md:text-3xl font-black ${totalPnL >= 0 ? 'text-[#22d47a]' : 'text-[#f04f5e]'}`}>
        {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
      </h3>
    </div>
  )
}
