import { useState } from 'react'
import { predict } from '../api'

const weatherOptions = ['Clear', 'Cloudy', 'Rain', 'Fog', 'Snow', 'Storm']
const vehicleOptions = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Bike', 'Auto']

const defaultForm = {
  booking_hour: 12,
  driver_rating: 4.5,
  surge_multiplier: 1.0,
  distance: 10,
  weather: 'Clear',
  vehicle_type: 'Sedan',
}

export default function Predict() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: isNaN(value) || name === 'weather' || name === 'vehicle_type' ? value : Number(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await predict(form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Prediction failed. Is the ML API running?')
    } finally {
      setLoading(false)
    }
  }

  const riskColor = result?.risk_level === 'HIGH' ? 'text-error' : result?.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-tertiary'
  const riskBorder = result?.risk_level === 'HIGH' ? 'border-error/40' : result?.risk_level === 'MEDIUM' ? 'border-yellow-400/40' : 'border-tertiary/40'

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-20 max-w-[1440px] mx-auto">
      <div className="absolute -top-32 left-1/4 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 border border-primary/20">
          <span className="pulse-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">AI Engine</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text-hero mb-4">Cancellation Predictor</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">Enter ride parameters and our AI model will instantly calculate cancellation risk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-white/10">
          <h2 className="font-display text-xl font-bold text-on-surface mb-6">Ride Parameters</h2>
          <div className="space-y-5">
            {[
              { name: 'booking_hour', label: 'Booking Hour', type: 'number', min: 0, max: 23, step: 1 },
              { name: 'driver_rating', label: 'Driver Rating (1–5)', type: 'number', min: 1, max: 5, step: 0.1 },
              { name: 'surge_multiplier', label: 'Surge Multiplier', type: 'number', min: 1, max: 5, step: 0.1 },
              { name: 'distance', label: 'Distance (km)', type: 'number', min: 0.1, max: 500, step: 0.1 },
            ].map(({ name, label, ...rest }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">{label}</label>
                <input
                  {...rest}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-white/10 focus:border-primary rounded-lg px-4 py-3 text-on-surface text-sm outline-none transition-colors duration-200 font-mono"
                />
              </div>
            ))}

            {[
              { name: 'weather', label: 'Weather', opts: weatherOptions },
              { name: 'vehicle_type', label: 'Vehicle Type', opts: vehicleOptions },
            ].map(({ name, label, opts }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">{label}</label>
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-white/10 focus:border-primary rounded-lg px-4 py-3 text-on-surface text-sm outline-none transition-colors duration-200"
                >
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-primary text-on-primary font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:shadow-[0_0_40px_rgba(173,198,255,0.5)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                Run Prediction
              </>
            )}
          </button>
        </form>

        {/* Result */}
        <div className="flex flex-col gap-6">
          {error && (
            <div className="glass-card border border-error/40 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-error">error</span>
                <h3 className="font-display text-lg font-bold text-error">Connection Error</h3>
              </div>
              <p className="text-sm text-on-surface-variant">{error}</p>
            </div>
          )}

          {result && (
            <div className={`glass-card border ${riskBorder} rounded-3xl p-8 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] ${result.risk_level === 'HIGH' ? 'bg-error/10' : result.risk_level === 'MEDIUM' ? 'bg-yellow-400/10' : 'bg-tertiary/10'}`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`material-symbols-outlined ${riskColor} text-3xl`}>
                    {result.risk_level === 'HIGH' ? 'warning' : result.risk_level === 'MEDIUM' ? 'info' : 'check_circle'}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Risk Assessment</p>
                    <h3 className={`font-display text-2xl font-bold ${riskColor}`}>{result.risk_level} RISK</h3>
                  </div>
                </div>

                {/* Probability meter */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Cancellation Probability</span>
                    <span className={`text-lg font-bold font-mono ${riskColor}`}>{(result.cancellation_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${result.risk_level === 'HIGH' ? 'bg-error' : result.risk_level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-tertiary'}`}
                      style={{ width: `${result.cancellation_probability * 100}%` }}
                    />
                  </div>
                </div>

                {/* Verdict */}
                <div className="bg-surface-container-low rounded-2xl p-5 border border-white/5">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">AI Verdict</p>
                  <p className="font-display text-xl font-bold text-on-surface">
                    {result.predicted_cancelled ? '🚫 Likely to Cancel' : '✅ Likely to Complete'}
                  </p>
                </div>

                {/* Input summary */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ['Hour', `${form.booking_hour}:00`],
                    ['Weather', form.weather],
                    ['Distance', `${form.distance} km`],
                    ['Surge', `${form.surge_multiplier}x`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-surface-container-low rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-on-surface-variant">{k}</p>
                      <p className="text-sm font-semibold font-mono text-on-surface">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center min-h-[300px] text-center">
              <span className="material-symbols-outlined text-primary/30 mb-4" style={{fontSize: 64}}>query_stats</span>
              <p className="font-display text-xl font-bold text-on-surface-variant/50">Awaiting prediction</p>
              <p className="text-sm text-on-surface-variant/30 mt-2">Fill in the form and click Run Prediction</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
