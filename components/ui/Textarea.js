'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}, ref) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full bg-slate-900/60 border rounded-xl text-sm text-white placeholder:text-slate-500',
          'transition-all duration-200 focus:outline-none py-2.5 px-4 resize-none',
          error
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

export default Textarea
