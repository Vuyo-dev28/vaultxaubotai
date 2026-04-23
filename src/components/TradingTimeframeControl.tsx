'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const timeframes = [
  { value: '1m', label: '1-Minute', desc: 'Sniper precision' },
  { value: '5m', label: '5-Minute', desc: 'Sweet spot' },
  { value: '15m', label: '15-Minute', desc: 'Institutional trend' },
]

export default function TradingTimeframeControl({
  initialTimeframe = '5m',
}: {
  initialTimeframe?: string
}) {
  const [selected, setSelected] = useState(initialTimeframe)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const setTimeframe = async (nextValue: string) => {
    if (nextValue === selected || loading) {
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('bot_config').upsert({
      user_id: user?.id,
      trading_timeframe: nextValue,
      updated_at: new Date().toISOString(),
    })

    if (!error) {
      setSelected(nextValue)
      router.refresh()
    } else {
      alert(`Error saving timeframe: ${error.message}`)
    }

    setLoading(false)
  }

  return (
    <section className="bg-[#0d1425] border border-[#1e2d47] rounded-2xl p-4 md:p-6 shadow-2xl">
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">
        <span className="w-2 h-2 bg-[#f5c842] rounded-full" />
        Trading Timeframe
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            type="button"
            onClick={() => setTimeframe(tf.value)}
            disabled={loading}
            className={`p-3 rounded-xl transition-all border-2 text-center disabled:opacity-60 ${
              selected === tf.value
                ? 'border-[#f5c842] bg-[#f5c842]/10 shadow-lg shadow-yellow-500/20'
                : 'border-[#1e2d47] bg-[#16213e] hover:border-[#7a91b5]'
            }`}
          >
            <div className="text-xs font-black text-white">{tf.label}</div>
            <div className="text-[9px] text-[#7a91b5] mt-0.5">{tf.desc}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
