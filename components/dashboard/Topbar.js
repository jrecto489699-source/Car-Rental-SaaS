'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, Menu, Settings, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'

const notifications = [
  { id: 1, title: 'Booking #BK-001 confirmed',        time: '2 min ago',   read: false, type: 'booking' },
  { id: 2, title: 'Vehicle Toyota Fortuner returned', time: '15 min ago',  read: false, type: 'return' },
  { id: 3, title: 'Payment received ₱3,500',          time: '1 hour ago',  read: true,  type: 'payment' },
  { id: 4, title: 'Maintenance due: Honda Civic',     time: '2 hours ago', read: true,  type: 'alert' },
]

export default function Topbar({ user, onSignOut, onMobileMenuToggle }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const [search,    setSearch]    = useState('')
  const unreadCount = notifications.filter(n => !n.read).length

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const companyName = user?.user_metadata?.company_name || 'RM Car Rental'

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 gap-4 shrink-0 sticky top-0 z-30 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="hidden sm:flex flex-1 max-w-sm relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vehicles, bookings, customers..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 py-2.5 pl-10 pr-4 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notif) => (
                      <div key={notif.id}
                        className={cn('px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer', !notif.read && 'bg-orange-50/50')}>
                        <div className="flex items-start gap-3">
                          {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />}
                          <div className={notif.read ? 'pl-4' : ''}>
                            <p className="text-xs font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <Avatar name={displayName} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400 leading-tight">{companyName}</p>
            </div>
            <ChevronDown size={14} className={cn('text-gray-400 transition-transform hidden md:block', userOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {userOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    {[
                      { icon: User,     label: 'Profile',  href: '/dashboard/settings' },
                      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
                    ].map((item) => (
                      <a key={item.label} href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <item.icon size={15} className="text-gray-400" />
                        {item.label}
                      </a>
                    ))}
                    <button
                      onClick={() => { setUserOpen(false); onSignOut() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
