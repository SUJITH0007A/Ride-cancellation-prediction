import { useState } from 'react'

export default function AIWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="glass-panel rounded-2xl p-4 w-64 shadow-[0_0_40px_rgba(47,217,244,0.15)] border border-white/10">
          <p className="text-xs font-semibold text-tertiary uppercase tracking-widest mb-2">AI Assistant</p>
          <p className="text-sm text-on-surface-variant">How can I help optimize your fleet today?</p>
          <ul className="mt-3 space-y-1">
            {['Run a new prediction', 'View dashboard stats', 'Check live feed'].map(q => (
              <li key={q}>
                <button className="text-xs text-primary hover:text-tertiary transition-colors text-left w-full py-1 border-b border-white/5 last:border-0">
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="mesh-gradient h-16 w-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(47,217,244,0.3)] ai-glow-pulse hover:scale-110 transition-transform"
      >
        <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
      </button>
    </div>
  )
}
