'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/trades', label: 'Trades', icon: '📈' },
  { href: '/bot', label: 'Bot', icon: '⚡', center: true },
  { href: '/logs', label: 'Logs', icon: '🧾' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function MobileMenu() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(94%,460px)] md:hidden z-50">
      <div className="bg-white/95 border border-slate-200 rounded-[2rem] px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-5 items-end text-[10px] font-semibold">
          {items.map((item) => {
            const isActive = pathname === item.href

            if (item.center) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 -mt-5">
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg ${
                      isActive ? 'bg-[#0d213a] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? 'text-[#0d213a] font-bold' : 'text-slate-400'}>{item.label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 ${isActive ? 'text-[#0d213a]' : 'text-slate-400'}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
