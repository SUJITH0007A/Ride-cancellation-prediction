import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/predict', label: 'Predict' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/feed', label: 'Live Feed' },
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${scrolled ? 'bg-background/90 backdrop-blur-xl py-2' : 'bg-surface/60 backdrop-blur-xl py-0'}`}>
      <nav className="flex justify-between items-center h-20 px-5 md:px-20 max-w-[1440px] mx-auto">
        <Link to="/" className="font-display text-xl text-primary font-bold tracking-tight">
          PredictiveRide
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-semibold transition-all duration-300 ${location.pathname === to ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/signin" className="hidden md:block text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="bg-primary text-on-primary text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] transition-all duration-300 active:scale-95">
            Get Started
          </Link>
          <button className="md:hidden text-on-surface" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold ${location.pathname === to ? 'text-primary' : 'text-on-surface-variant'}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
