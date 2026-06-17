import { useEffect, useState } from 'react'
import { getAnalytics } from '../api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#adc6ff', '#ffb4ab', '#2fd9f4', '#ddb7ff']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAnalytics()
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const pieData = stats ? [
    { name: 'Not Cancelled', value: stats.not_cancelled_count },
    { name: 'Cancelled', value: stats.cancelled_count },
  ] : []

  const riskData = stats?.risk_breakdown ? Object.entries(stats.risk_breakdown).map(([k, v]) => ({ name: k, count: v })) : []

  const cards = stats ? [
    { icon: 'analytics', label: 'Total Predictions', value: stats.total_predictions, color: 'primary' },
    { icon: 'cancel', label: 'Cancelled', value: stats.cancelled_count, color: 'error' },
    { icon: 'check_circle', label: 'Completed', value: stats.not_cancelled_count, color: 'tertiary' },
    { icon: 'percent', label: 'Avg Probability', value: `${((stats.avg_cancellation_probability || 0) * 100).toFixed(1)}%`, color: 'secondary' },
  ] : []

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-20 max-w-[1440px] mx-auto">
      <div className="absolute -top-32 -right-20 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4 border border-tertiary/20">
          <span className="pulse-dot w-2 h-2 rounded-full bg-tertiary inline-block" />
          <span className="text-xs font-semibold text-tertiary tracking-widest uppercase">Command Center</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text-hero">Dashboard</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
        </div>
      )}

      {error && (
        <div className="glass-card border border-error/40 rounded-3xl p-8 text-center">
          <span className="material-symbols-outlined text-error text-4xl block mb-3">error</span>
          <p className="text-error font-semibold">Could not load analytics: {error}</p>
          <p className="text-on-surface-variant text-sm mt-2">Make sure the Flask API is running.</p>
        </div>
      )}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map(({ icon, label, value, color }) => (
              <div key={label} className="glass-card tilt-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 blur-[40px] group-hover:bg-${color}/10 transition-colors`} />
                <span className={`material-symbols-outlined text-${color} text-2xl block mb-3`}>{icon}</span>
                <p className={`font-display text-3xl font-bold text-${color} mb-1`}>{value}</p>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Pie chart */}
            <div className="md:col-span-5 glass-card rounded-3xl p-8 border border-white/10">
              <h3 className="font-display text-lg font-bold text-on-surface mb-6">Cancellation Split</h3>
              {pieData[0]?.value || pieData[1]?.value ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#191f31', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#dce1fb' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[220px] text-on-surface-variant/40 text-sm">No data yet</div>
              )}
              <div className="flex gap-6 mt-4 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-on-surface-variant">{d.name}: <strong className="text-on-surface">{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk breakdown bar */}
            <div className="md:col-span-7 glass-card rounded-3xl p-8 border border-white/10">
              <h3 className="font-display text-lg font-bold text-on-surface mb-6">Risk Level Breakdown</h3>
              {riskData.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={riskData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#c2c6d6', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#c2c6d6', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#191f31', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#dce1fb' }} />
                    <Bar dataKey="count" fill="#adc6ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[220px] text-on-surface-variant/40 text-sm">No data yet</div>
              )}
            </div>

            {/* Most risky weather */}
            {stats.most_risky_weather && (
              <div className="md:col-span-12 glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-6">
                <div className="bg-secondary/20 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-2xl">cloudy_snowing</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Highest Risk Weather</p>
                  <p className="font-display text-2xl font-bold text-secondary">{stats.most_risky_weather}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-on-surface-variant">This weather type correlates with the highest average cancellation probability across all recorded predictions.</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
