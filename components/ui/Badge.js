import { cn, getStatusColor, capitalizeFirst } from '@/lib/utils'

export default function Badge({ status, label, variant, size = 'sm', dot = true, className = '' }) {
  const colors = variant ? null : getStatusColor(status)
  const displayLabel = label || capitalizeFirst(status)

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }

  if (variant === 'blue') {
    return (
      <span className={cn('inline-flex items-center rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20', sizeClasses[size], className)}>
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
        {displayLabel}
      </span>
    )
  }

  if (variant === 'purple') {
    return (
      <span className={cn('inline-flex items-center rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20', sizeClasses[size], className)}>
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />}
        {displayLabel}
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium border',
      colors?.bg, colors?.text, colors?.border,
      sizeClasses[size],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors?.dot)} />}
      {displayLabel}
    </span>
  )
}
