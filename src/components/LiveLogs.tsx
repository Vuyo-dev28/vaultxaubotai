'use client'

import { useEffect, useState, useRef } from 'react'

export default function LiveLogs({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<{ message: string; timestamp: string }[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const scrollRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const connectToLogs = () => {
      console.log('🔌 Attempting to connect to http://localhost:8888/logs')
      setStatus('connecting')

      try {
        const eventSource = new EventSource('http://localhost:8888/logs')
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          console.log('✅ EventSource opened - connection established')
          setStatus('connected')
        }

        eventSource.onmessage = (event) => {
          try {
            if (event.data.includes('keep-alive')) {
              console.log('💓 Keep-alive signal received')
              return
            }
            const log = JSON.parse(event.data)
            console.log('📩 Log received:', log.message)
            setLogs((prev) => [...prev.slice(-49), log])
          } catch (e) {
            console.error('❌ Failed to parse log:', e, 'Data:', event.data)
          }
        }

        eventSource.addEventListener('error', () => {
          const readyState = eventSource.readyState
          console.error('❌ EventSource error - readyState:', readyState)
          if (readyState === 2) {
            // CLOSED
            console.error('EventSource connection closed')
            setStatus('error')
            eventSource.close()
            setTimeout(connectToLogs, 3000)
          }
        })
      } catch (e) {
        console.error('❌ Failed to create EventSource:', e)
        setStatus('error')
        setTimeout(connectToLogs, 3000)
      }
    }

    connectToLogs()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="bg-[#0b1221] border border-[#1e2d47] rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-[#16213e] px-4 py-2 border-b border-[#1e2d47] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-bounce'}`}></div>
          <span className="text-[10px] font-black text-[#7a91b5] uppercase tracking-widest">
            {status === 'connected' ? 'Live Analysis Engine' : status === 'error' ? 'Connection Failed' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] text-[#3a4b6c] font-mono hidden md:inline">ID: {userId.slice(0, 8)}...</span>
          <button 
            onClick={() => setLogs([])}
            className="text-[10px] font-bold text-[#f5c842] hover:text-white transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-[#1e2d47] scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#3a4b6c] italic">
            Waiting for bot signals...
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex space-x-3 group animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-[#3a4b6c] shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
              <span className="text-[#f5c842] shrink-0">🤖</span>
              <span className="text-[#e2e8f0] break-all group-last:font-bold group-last:text-white">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
