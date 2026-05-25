'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Car, Calendar, Users, Receipt,
  BarChart3, Settings, X, LogOut, CalendarDays
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Overview',     href: '/dashboard',          icon: LayoutDashboard },
      { label: 'Fleet',        href: '/dashboard/vehicles', icon: Car },
      { label: 'Booking Log',  href: '/dashboard/bookings', icon: Calendar },
      { label: 'Availability', href: '/dashboard/calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Expenses',  href: '/dashboard/expenses',  icon: Receipt },
      { label: 'Reports',   href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Settings',  href: '/dashboard/settings',  icon: Settings },
    ],
  },
]

export default function MobileSidebar({ isOpen, onClose, onSignOut }) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-gray-200 z-50 lg:hidden flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
              <BrandLogo size={42} />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-5 overflow-y-auto no-scrollbar">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                            isActive
                              ? 'bg-orange-50 text-orange-600 border border-orange-200'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full" />
                          )}
                          <Icon size={17} className={cn('shrink-0', isActive ? 'text-orange-500' : 'text-gray-400')} />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => { onClose(); onSignOut() }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={17} className="text-gray-400" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
