import { cn } from '@/lib/utils'

export default function Skeleton({ className = '', lines = 1, height = 'h-4' }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('shimmer rounded-lg bg-slate-800', height)}
          style={{ width: lines > 1 ? `${100 - i * 15}%` : '100%' }}
        />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4 py-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="shimmer h-4 rounded bg-slate-800" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/8 bg-slate-900/60 p-6 animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-9 w-9 bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  )
}
