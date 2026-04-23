'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type BotConfig = {
  mt5_account?: string
  mt5_server?: string
  mt5_path?: string
  max_positions?: number
  risk_percent?: number
}

export default function CredentialsForm({
  initialConfig,
}: {
  initialConfig: BotConfig | null
}) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    account: initialConfig?.mt5_account || '',
    password: '',
    server: initialConfig?.mt5_server || '',
    path: initialConfig?.mt5_path || '',
    max_positions: initialConfig?.max_positions ?? 5,
    risk_percent: initialConfig?.risk_percent ?? 1.0,
  })

  const supabase = createClient()
  const router = useRouter()

  const handleNumber = (value: string, fallback: number) => {
    return value === '' ? fallback : Number(value)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload: {
      user_id: string | undefined
      mt5_account: string
      mt5_server: string
      mt5_path: string
      max_positions: number
      risk_percent: number
      updated_at: string
      mt5_password?: string
    } = {
      user_id: user?.id,
      mt5_account: form.account,
      mt5_server: form.server,
      mt5_path: form.path,
      max_positions: Number(form.max_positions),
      risk_percent: Number(form.risk_percent),
      updated_at: new Date().toISOString(),
    }

    if (form.password) {
      payload.mt5_password = form.password
    }

    const { error } = await supabase.from('bot_config').upsert(payload)

    if (!error) {
      alert('Settings updated successfully!')
      router.refresh()
    } else {
      alert('Error saving: ' + error.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="space-y-4">

        {/* Account + Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-[#7a91b5] uppercase tracking-widest mb-1.5 ml-1">
              Account ID
            </label>
            <input
              type="text"
              value={form.account}
              onChange={(e) =>
                setForm({ ...form, account: e.target.value })
              }
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 text-white outline-none focus:border-[#f5c842] transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#7a91b5] uppercase tracking-widest mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 text-white outline-none focus:border-[#f5c842] transition-all text-sm font-mono"
            />
          </div>
        </div>

        {/* Server */}
        <div>
          <label className="block text-[10px] font-black text-[#7a91b5] uppercase tracking-widest mb-1.5 ml-1">
            Broker Server
          </label>
          <input
            type="text"
            value={form.server}
            onChange={(e) =>
              setForm({ ...form, server: e.target.value })
            }
            className="w-full bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 text-white outline-none focus:border-[#f5c842] transition-all text-sm"
          />
        </div>

        <div className="h-px bg-[#1e2d47] my-4"></div>

        {/* Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-[10px] font-black text-[#f5c842] uppercase tracking-widest mb-1.5 ml-1">
              Max Positions
            </label>
            <input
              type="number"
              value={form.max_positions}
              onChange={(e) =>
                setForm({
                  ...form,
                  max_positions: handleNumber(e.target.value, 5),
                })
              }
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 text-white outline-none focus:border-[#f5c842] transition-all text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#f5c842] uppercase tracking-widest mb-1.5 ml-1">
              Risk % Per Trade
            </label>
            <input
              type="number"
              step="0.1"
              value={form.risk_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  risk_percent: handleNumber(e.target.value, 1.0),
                })
              }
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-xl p-3 text-white outline-none focus:border-[#f5c842] transition-all text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#f5c842] hover:bg-[#ffd55a] text-[#070b14] font-black rounded-xl transition-all transform active:scale-95 shadow-lg shadow-yellow-500/10 uppercase tracking-widest text-xs"
      >
        {loading ? 'SYNCING...' : 'SAVE CONFIGURATION'}
      </button>
    </form>
  )
}