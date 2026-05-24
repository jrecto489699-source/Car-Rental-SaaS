'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  icon,
  iconRight,
  className = '',
  containerClassName = '',
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
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-slate-900/60 border rounded-xl text-sm text-white placeholder:text-slate-500',
            'transition-all duration-200 focus:outline-none',
            'py-2.5',
            icon ? 'pl-10 pr-4' : 'px-4',
            iconRight ? 'pr-10' : '',
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
})

export default Input
