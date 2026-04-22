'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        // If email confirmation is disabled, we get a session immediately
        router.push('/')
      } else {
        alert('Institutional account created! Please check your email to verify.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0d1425] border border-[#1e2d47] rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2">
            <span className="text-[#f5c842]">⚡</span> XauBot <span className="text-[#7a91b5] font-light">PRO</span>
          </h1>
          <p className="text-[#7a91b5] mt-2 text-sm uppercase tracking-widest font-bold">
            {isSignUp ? 'Create your institutional account' : 'Sign in to your dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#7a91b5] uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="trader@xaubot.pro"
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-2xl p-4 text-white outline-none focus:border-[#f5c842] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#7a91b5] uppercase tracking-widest ml-1">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full bg-[#16213e] border border-[#1e2d47] rounded-2xl p-4 text-white outline-none focus:border-[#f5c842] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#f5c842] hover:bg-[#e5b832] text-[#070b14] font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#7a91b5] hover:text-[#f5c842] transition-colors font-bold uppercase tracking-widest"
          >
            {isSignUp ? 'Already have an account? Log In' : 'New trader? Create an account'}
          </button>
        </div>
      </div>
    </div>
  )
}
