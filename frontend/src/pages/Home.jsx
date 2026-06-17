import { Link } from 'react-router-dom'

const features = [
  {
    icon: 'cloudy_snowing', color: 'primary', span: 'md:col-span-8',
    title: 'Weather-based Prediction',
    desc: 'Correlate atmospheric changes with historical drop-off patterns to adjust fleet readiness instantly.',
    extra: (
      <div className="mt-auto flex items-end gap-2 h-24 pt-4">
        {[60, 80, 40, 95, 70, 55, 85].map((h, i) => (
          <div key={i} className="bg-primary/40 w-full rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  },
  {
    icon: 'trending_up', color: 'tertiary', span: 'md:col-span-4',
    title: 'Surge Pricing Impact',
    desc: 'Visualize price elasticity and predict when users will likely opt for alternative transport.',
    extra: (
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">Sensitivity Index</span>
          <span className="text-xs font-semibold text-tertiary">High</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="w-[78%] h-full bg-tertiary rounded-full" />
        </div>
      </div>
    ),
  },
  {
    icon: 'psychology', color: 'secondary', span: 'md:col-span-12',
    title: 'Driver Behavior Analysis',
    desc: 'Analyze micro-patterns in driver acceptance rates to predict churn before it affects your network.',
    extra: (
      <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
        {[['Fatigue Index', 'Low Risk', 'secondary'], ['Reliability Score', '9.4/10', 'primary']].map(([label, val, col]) => (
          <div key={label} className="bg-surface-container-low p-4 rounded-2xl border border-white/5">
            <p className="text-xs font-semibold text-on-surface-variant mb-1">{label}</p>
            <p className={`text-xl font-bold text-${col}`}>{val}</p>
          </div>
        ))}
      </div>
    ),
    wide: true,
  },
]

const stats = [
  { icon: 'verified', value: '98%', label: 'Accuracy Rate', color: 'primary', anim: 'animate-bounce' },
  { icon: 'bolt', value: 'Real-time', label: 'Data Processing', color: 'tertiary', anim: 'animate-pulse' },
  { icon: 'insights', value: '12k+', label: 'Insights / min', color: 'secondary', anim: '' },
]

export default function Home() {
  return (
    <main className="relative pt-20">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 md:px-20 py-20">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 border border-primary/20">
            <span className="pulse-dot w-2 h-2 rounded-full bg-tertiary inline-block" />
            <span className="text-xs font-semibold text-tertiary tracking-widest uppercase">Live AI Engine Online</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text-hero">Predict the</span><br />
            <span className="gradient-text">Unpredictable.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
            Advanced AI analytics to foresee ride cancellations before they happen. Reduce losses, optimize fleet performance, and stay ahead.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/predict" className="w-full sm:w-auto bg-primary text-on-primary text-sm font-semibold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(173,198,255,0.3)] hover:shadow-[0_0_50px_rgba(173,198,255,0.5)] transition-all duration-300 hover:-translate-y-1">
              Predict Cancellation
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto glass-card border border-white/10 text-on-surface text-sm font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition-all duration-300">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Floating stats */}
        <div className="relative w-full max-w-5xl">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-surface-container-low flex items-center justify-center" style={{minHeight: 320}}>
            <div className="text-center opacity-30">
              <span className="material-symbols-outlined text-primary" style={{fontSize: 80}}>directions_car</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="relative z-10 flex flex-wrap justify-around py-40 gap-4">
            {stats.map(({ icon, value, label, color, anim }) => (
              <div key={label} className={`glass-card border border-white/10 p-5 rounded-2xl shadow-2xl ${anim}`} style={anim === 'animate-bounce' ? {animationDuration: '4s'} : {}}>
                <span className={`material-symbols-outlined text-${color} block mb-2`}>{icon}</span>
                <h3 className={`font-display text-2xl font-bold text-${color}`}>{value}</h3>
                <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-5 md:px-20 max-w-[1440px] mx-auto text-center border-t border-white/5">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-12">Trusted by Global Logistics Leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-70 transition-opacity duration-500">
          {['Uber', 'Lyft', 'Grab', 'Bolt', 'DiDi'].map(name => (
            <span key={name} className="font-display text-xl font-bold text-on-surface-variant">{name}</span>
          ))}
        </div>
      </section>

      {/* Features Bento */}
      <section className="py-32 px-5 md:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">Precision Intelligence</h2>
            <p className="text-base text-on-surface-variant">Our neural networks analyze 200+ variables in real-time to eliminate friction in your fleet operations.</p>
          </div>
          <Link to="/predict" className="text-sm font-semibold text-tertiary flex items-center gap-2 hover:gap-4 transition-all">
            Try the predictor <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {features.map(({ icon, color, span, title, desc, extra, wide }) => (
            <div key={title} className={`${span} glass-card rounded-3xl p-8 tilt-card relative overflow-hidden group`}>
              <div className={`bg-${color}/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                <span className={`material-symbols-outlined text-${color}`}>{icon}</span>
              </div>
              <div className={wide ? 'flex flex-col md:flex-row items-start md:items-center gap-8' : 'flex flex-col h-full'}>
                <div className={wide ? 'md:w-1/2' : ''}>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-3">{title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
                </div>
                <div className={wide ? 'md:w-1/2 w-full' : 'mt-auto'}>{extra}</div>
              </div>
              <div className={`absolute top-0 right-0 w-48 h-48 bg-${color}/5 blur-[80px] group-hover:bg-${color}/10 transition-colors`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-5 md:px-20 max-w-[1440px] mx-auto text-center">
        <div className="glass-card rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text-hero mb-6">Ready to eliminate uncertainty?</h2>
            <p className="text-base text-on-surface-variant mb-10 max-w-xl mx-auto">Start predicting ride cancellations in seconds with our live AI engine.</p>
            <Link to="/predict" className="bg-primary text-on-primary text-sm font-semibold px-10 py-4 rounded-full shadow-[0_0_30px_rgba(173,198,255,0.4)] hover:shadow-[0_0_60px_rgba(173,198,255,0.6)] transition-all duration-300 hover:-translate-y-1 inline-block">
              Start Predicting Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
