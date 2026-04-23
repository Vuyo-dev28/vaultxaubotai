'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type BotConfig = {
  is_running?: boolean
}

export default function BotControl({ initialConfig }: { initialConfig: BotConfig | null }) {
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(initialConfig?.is_running || false)
  const supabase = createClient()
  const router = useRouter()

  const toggleBot = async () => {
    setLoading(true)
    const nextState = !running
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('bot_config')
      .upsert({ 
        user_id: user?.id,
        is_running: nextState,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setRunning(nextState)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
      <div className={`w-full sm:w-auto px-5 py-3 md:px-6 md:py-4 rounded-2xl font-black text-center tracking-tighter text-base md:text-lg ${running ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
        {running ? '● LIVE' : '○ OFFLINE'}
      </div>
      <button
        onClick={toggleBot}
        disabled={loading}
        className={`w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-lg md:text-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl ${
          running 
            ? 'bg-[#f04f5e] hover:bg-[#ff5f6e] text-white shadow-red-500/20' 
            : 'bg-[#f5c842] hover:bg-[#ffd55a] text-[#070b14] shadow-yellow-500/20'
        } disabled:opacity-50`}
      >
        {loading ? '...' : running ? 'STOP BOT' : 'START BOT'}
      </button>
    </div>
  )
}
