import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-surface-container-lowest border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-5 md:px-20 max-w-[1440px] mx-auto">
        <div>
          <span className="font-display text-xl text-primary mb-4 block">PredictiveRide</span>
          <p className="text-sm text-on-surface-variant leading-relaxed">The definitive operating system for futuristic mobility intelligence.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Product</h4>
          <ul className="space-y-3">
            {['API Docs', 'Cloud Feed', 'Security'].map(l => (
              <li key={l}><a href="#" className="text-sm text-on-surface-variant hover:text-tertiary transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Legal</h4>
          <ul className="space-y-3">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <li key={l}><a href="#" className="text-sm text-on-surface-variant hover:text-tertiary transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Contact</h4>
          <ul className="space-y-3">
            {['Support', 'Partnerships', 'Media Kit'].map(l => (
              <li key={l}><a href="#" className="text-sm text-on-surface-variant hover:text-tertiary transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-white/5 px-5 md:px-20 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant">© 2026 PredictiveRide AI. All rights reserved.</p>
        <div className="flex gap-6">
          {['public', 'brand_awareness', 'hub'].map(icon => (
            <span key={icon} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">{icon}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
