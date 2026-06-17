import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-12 px-5 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30 animate-pulse-glow" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] animate-float" style={{animationDelay: '3s'}} />

      <div className="glass-panel rounded-3xl p-10 w-full max-w-md relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold text-primary">PredictiveRide</span>
          <p className="text-on-surface-variant text-sm mt-2">Sign in to your command center</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({...p, email: e.target.value}))}
                className="w-full bg-surface-container border border-white/10 focus:border-primary rounded-lg pl-12 pr-4 py-3 text-on-surface text-sm outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({...p, password: e.target.value}))}
                className="w-full bg-surface-container border border-white/10 focus:border-primary rounded-lg pl-12 pr-4 py-3 text-on-surface text-sm outline-none transition-colors" />
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/reset-password" className="text-xs text-primary hover:text-tertiary transition-colors">Forgot password?</Link>
          </div>

          <button className="w-full bg-primary text-on-primary font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_40px_rgba(173,198,255,0.5)] transition-all duration-300 mt-2">
            Sign In
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="bg-surface-container-low px-4 text-xs text-on-surface-variant">or</span></div>
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          No account? <Link to="/signup" className="text-primary hover:text-tertiary transition-colors font-semibold">Create one free</Link>
        </p>
      </div>
    </main>
  )
}
