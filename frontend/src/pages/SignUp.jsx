import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const field = (name, type, placeholder, icon) => (
    <div>
      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">{icon}</span>
        <input type={type} placeholder={placeholder} value={form[name]}
          onChange={e => setForm(p => ({...p, [name]: e.target.value}))}
          className="w-full bg-surface-container border border-white/10 focus:border-primary rounded-lg pl-12 pr-4 py-3 text-on-surface text-sm outline-none transition-colors" />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-12 px-5 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] animate-float" />

      <div className="glass-panel rounded-3xl p-10 w-full max-w-md relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold text-primary">PredictiveRide</span>
          <p className="text-on-surface-variant text-sm mt-2">Create your free account</p>
        </div>

        <div className="space-y-4">
          {field('name', 'text', 'Your name', 'person')}
          {field('email', 'email', 'you@example.com', 'mail')}
          {field('password', 'password', '••••••••', 'lock')}

          <button className="w-full bg-primary text-on-primary font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_40px_rgba(173,198,255,0.5)] transition-all duration-300 mt-2">
            Create Account
          </button>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Already have an account? <Link to="/signin" className="text-primary hover:text-tertiary transition-colors font-semibold">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
