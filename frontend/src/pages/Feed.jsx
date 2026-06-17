import { useEffect, useState } from 'react'
import { getPredictions } from '../api'

function RiskBadge({ level }) {
  const map = { HIGH: 'text-error bg-error/10 border-error/30', MEDIUM: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', LOW: 'text-tertiary bg-tertiary/10 border-tertiary/30' }
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${map[level] || map.LOW}`}>{level}</span>
}

export default function Feed() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    getPredictions()
      .then(r => setPredictions(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-20 max-w-[1440px] mx-auto">
      <div className="absolute -top-32 left-0 w-[30%] h-[40%] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4 border border-tertiary/20">
            <span className="pulse-dot w-2 h-2 rounded-full bg-tertiary inline-block" />
            <span className="text-xs font-semibold text-tertiary tracking-widest uppercase">Live Feed</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text-hero">Prediction History</h1>
        </div>
        <button onClick={load} className="flex items-center gap-2 glass-card border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold text-on-surface hover:border-primary/40 transition-all">
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
        </div>
      )}

      {error && (
        <div className="glass-card border border-error/40 rounded-3xl p-8 text-center">
          <span className="material-symbols-outlined text-error text-4xl block mb-3">error</span>
          <p className="text-error">{error}</p>
        </div>
      )}

      {!loading && !error && predictions.length === 0 && (
        <div className="glass-card rounded-3xl p-16 text-center border border-white/10">
          <span className="material-symbols-outlined text-primary/30 block mb-4" style={{fontSize: 64}}>history</span>
          <p className="font-display text-xl text-on-surface-variant/50">No predictions yet</p>
          <p className="text-sm text-on-surface-variant/30 mt-2">Run a prediction to see it here</p>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-white/5 bg-surface-container">
            {['Time', 'Weather', 'Vehicle', 'Distance', 'Rating', 'Probability', 'Risk'].map(h => (
              <span key={h} className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {/* Rows */}
          <div className="divide-y divide-white/5 prediction-stream max-h-[600px] overflow-y-auto">
            {predictions.map(p => (
              <div key={p.prediction_id} className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center">
                <span className="text-xs font-mono text-on-surface-variant">{new Date(p.prediction_date).toLocaleTimeString()}</span>
                <span className="text-sm text-on-surface">{p.weather}</span>
                <span className="text-sm text-on-surface">{p.vehicle_type}</span>
                <span className="text-sm font-mono text-on-surface">{p.distance} km</span>
                <span className="text-sm font-mono text-primary">{p.driver_rating}</span>
                <span className={`text-sm font-bold font-mono ${p.risk_level === 'HIGH' ? 'text-error' : p.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-tertiary'}`}>
                  {(p.cancellation_probability * 100).toFixed(1)}%
                </span>
                <RiskBadge level={p.risk_level} />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
