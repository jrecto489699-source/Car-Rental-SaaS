'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, Calendar, Users, Receipt,
  BarChart3, Settings, Zap, ChevronLeft, ChevronRight,
  LogOut, HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
  { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const bottomItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '#', icon: HelpCircle },
]

function NavItem({ item, collapsed, pathname }) {
  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
          : 'text-slate-400 hover:text-white hover:bg-white/6',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon
        size={18}
        className={cn('shrink-0 transition-colors', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white')}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
          {item.label}
        </div>
      )}
    </Link>
  )
}

export default function Sidebar({ onSignOut }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative hidden lg:flex flex-col h-full bg-slate-950 border-r border-white/8 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 p-4 border-b border-white/8 h-16', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
          <Zap size={16} className="text-white" fill="currentColor" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base text-white tracking-tight">
            Drive<span className="text-blue-400">Flow</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom items */}
      <div className="p-3 border-t border-white/8 space-y-1">
        {bottomItems.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        ))}

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className={cn(
            'w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-200',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} className="shrink-0 transition-colors" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  )
}
