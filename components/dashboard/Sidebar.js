'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, Calendar, Users, Receipt,
  BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, CalendarDays
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Overview',     href: '/dashboard',           icon: LayoutDashboard },
      { label: 'Fleet',        href: '/dashboard/vehicles',  icon: Car },
      { label: 'Booking Log',  href: '/dashboard/bookings',  icon: Calendar },
      { label: 'Availability', href: '/dashboard/calendar',  icon: CalendarDays },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Expenses',  href: '/dashboard/expenses',  icon: Receipt },
      { label: 'Reports',   href: '/dashboard/analytics', icon: BarChart3 },
    ],
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
            ? 'bg-orange-50 text-orange-600 border border-orange-200'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
          collapsed && 'justify-center px-2.5'
        )}
      >
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full" />
        )}
        <Icon
          size={17}
          className={cn(
            'shrink-0 transition-colors',
            isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-700'
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>

      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50">
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
      className="relative hidden lg:flex flex-col h-full bg-white border-r border-gray-200 shrink-0"
      style={{ overflow: collapsed ? 'visible' : 'hidden' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-gray-100 h-16 shrink-0',
        collapsed ? 'justify-center px-2' : 'px-4'
      )}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200">
            <Car size={17} className="text-white" />
          </div>
        ) : (
          <BrandLogo size={44} />
        )}
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
                  className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400"
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

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        {bottomItems.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        ))}
        <div className="relative group">
          <button
            onClick={onSignOut}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200',
              collapsed && 'justify-center px-2.5'
            )}
          >
            <LogOut size={17} className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50">
              Sign Out
            </span>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-orange-300 transition-all hover:scale-110 shadow-sm z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
