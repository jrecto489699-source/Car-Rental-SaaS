import { cn, getInitials } from '@/lib/utils'

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const colorMap = [
  'from-blue-600 to-blue-400',
  'from-purple-600 to-purple-400',
  'from-cyan-600 to-cyan-400',
  'from-emerald-600 to-emerald-400',
  'from-amber-600 to-amber-400',
  'from-rose-600 to-rose-400',
]

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const initials = getInitials(name)
  const colorIndex = name ? name.charCodeAt(0) % colorMap.length : 0
  const gradient = colorMap[colorIndex]

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold text-white shrink-0',
      `bg-gradient-to-br ${gradient}`,
      sizeMap[size],
      className
    )}>
      {initials}
    </div>
  )
}
