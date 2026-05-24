'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select option...',
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
        <select
          ref={ref}
          className={cn(
            'w-full bg-slate-900/60 border rounded-xl text-sm text-white appearance-none',
            'transition-all duration-200 focus:outline-none py-2.5 pl-4 pr-10',
            'cursor-pointer',
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-slate-900">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
              className="bg-slate-900"
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

export default Select
