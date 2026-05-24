import { cn } from '@/lib/utils'

export default function Card({ children, className = '', hover = false, glow = false, gradient = false, padding = 'p-6' }) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/8 bg-slate-900/60',
      'backdrop-blur-sm transition-all duration-300',
      hover && 'hover:border-white/15 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-px cursor-pointer',
      glow && 'shadow-glow-blue',
      gradient && 'bg-gradient-to-br from-slate-800/80 to-slate-900/80',
      padding,
      className
    )}>
      {children}
    </div>
  )
}

export function StatCard({ title, value, change, changeLabel, icon, color = 'blue', loading = false }) {
  const colorMap = {
    blue: { icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20', change: 'text-emerald-400' },
    purple: { icon: 'text-purple-400 bg-purple-500/10 border-purple-500/20', change: 'text-emerald-400' },
    cyan: { icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', change: 'text-emerald-400' },
    emerald: { icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', change: 'text-emerald-400' },
    amber: { icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20', change: 'text-emerald-400' },
    rose: { icon: 'text-rose-400 bg-rose-500/10 border-rose-500/20', change: 'text-rose-400' },
  }

  const styles = colorMap[color] || colorMap.blue
  const isPositive = !change?.toString().startsWith('-')

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-9 w-9 bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-20 bg-slate-800 rounded" />
        </div>
      </Card>
    )
  }

  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {icon && (
          <div className={cn('p-2.5 rounded-xl border', styles.icon)}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      {(change !== undefined || changeLabel) && (
        <div className="mt-2 flex items-center gap-1.5">
          {change !== undefined && (
            <span className={cn(
              'text-xs font-medium',
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}>
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-slate-500">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  )
}
