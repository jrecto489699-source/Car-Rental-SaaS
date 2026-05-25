'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, Calendar, Users, Receipt,
  BarChart3, Settings, Zap, ChevronLeft, ChevronRight,
  LogOut, CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Fleet', href: '/dashboard/vehicles', icon: Car },
      { label: 'Booking Log', href: '/dashboard/bookings', icon: Calendar },
      { label: 'Availability', href: '/dashboard/calendar', icon: CalendarDays },
    ]
  },
  {
    label: 'Management',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
      { label: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
    ]
  },
]

const bottomItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function NavItem({ item, collapsed, pathname }) {
  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]',
          collapsed && 'justify-center px-2.5'
        )}
      >
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full" />
        )}
        <Icon
          size={17}
          className={cn('shrink-0 transition-colors', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white')}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
      {/* Tooltip shown only when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50">
          {item.label}
        </span>
      )}
    </div>
  )
}

export default function Sidebar({ onSignOut }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 248 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative hidden lg:flex flex-col h-full bg-slate-950 border-r border-white/[0.07] shrink-0"
      style={{ overflow: collapsed ? 'visible' : 'hidden' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 border-b border-white/[0.07] h-16 shrink-0',
        collapsed ? 'justify-center px-2' : 'px-4'
      )}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Zap size={15} className="text-white" fill="currentColor" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-[15px] text-white tracking-tight overflow-hidden whitespace-nowrap"
            >
              Drive<span className="text-blue-400">Flow</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="p-3 border-t border-white/[0.07] space-y-0.5">
        {bottomItems.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        ))}
        <div className="relative group">
          <button
            onClick={onSignOut}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all duration-200',
              collapsed && 'justify-center px-2.5'
            )}
          >
            <LogOut size={17} className="shrink-0 transition-colors text-slate-600 group-hover:text-rose-400" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50">
              Sign Out
            </span>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-slate-800 border border-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110 shadow-lg z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
