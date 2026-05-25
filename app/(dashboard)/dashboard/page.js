'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Car, Calendar, Users, TrendingUp,
  AlertCircle, CheckCircle2, ArrowRight, ArrowUpRight, Zap, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DEMO_STATS, MONTHS } from '@/lib/constants'
import Link from 'next/link'

const revenueData = MONTHS.map((month, i) => ({
  month,
  revenue: [28000, 32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 62000, 68000, 72000][i],
  expenses: [12000, 14000, 15000, 13000, 16000, 18000, 17000, 19000, 21000, 22000, 24000, 25000][i],
  profit: [16000, 18000, 23000, 22000, 26000, 30000, 28000, 33000, 37000, 40000, 44000, 47000][i],
}))

const vehicleStatusData = [
  { name: 'Available',   value: 16, color: '#10B981' },
  { name: 'Rented',      value: 6,  color: '#F97316' },
  { name: 'Maintenance', value: 2,  color: '#F59E0B' },
]

const recentBookings = [
  { id: 'BK-001', customer: 'Juan dela Cruz',  vehicle: 'Toyota Fortuner 2023', start: '2025-05-23', end: '2025-05-26', amount: 10500, status: 'active' },
  { id: 'BK-002', customer: 'Maria Santos',    vehicle: 'Honda Civic 2022',     start: '2025-05-22', end: '2025-05-25', amount: 7500,  status: 'active' },
  { id: 'BK-003', customer: 'Pedro Reyes',     vehicle: 'Ford Ranger 2023',     start: '2025-05-20', end: '2025-05-22', amount: 8000,  status: 'completed' },
  { id: 'BK-004', customer: 'Ana Garcia',      vehicle: 'Mitsubishi Montero',   start: '2025-05-25', end: '2025-05-28', amount: 11400, status: 'confirmed' },
  { id: 'BK-005', customer: 'Carlo Lim',       vehicle: 'Toyota Vios 2023',     start: '2025-05-24', end: '2025-05-27', amount: 6000,  status: 'pending' },
]

const recentActivity = [
  { icon: <CheckCircle2 size={14} />, text: 'Booking BK-001 confirmed',            time: '2 min ago',   iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', dot: 'bg-emerald-500' },
  { icon: <Car size={14} />,          text: 'Honda Civic returned safely',          time: '20 min ago',  iconBg: 'bg-orange-100',  iconColor: 'text-orange-600',  dot: 'bg-orange-500' },
  { icon: <DollarSign size={14} />,   text: 'Payment ₱10,500 received',            time: '1 hour ago',  iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', dot: 'bg-emerald-500' },
  { icon: <AlertCircle size={14} />,  text: 'Maintenance scheduled: Toyota Vios', time: '2 hours ago', iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   dot: 'bg-amber-500' },
  { icon: <Users size={14} />,        text: 'New customer: Ana Garcia registered', time: '3 hours ago', iconBg: 'bg-purple-100',  iconColor: 'text-purple-600',  dot: 'bg-purple-500' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-bold text-gray-800 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs mb-1 font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value, 'PHP')}
        </p>
      ))}
    </div>
  )
}

const STAT_CARDS = (stats) => [
  {
    title: 'Total Revenue',
    value: formatCurrency(stats.totalRevenue, 'PHP'),
    change: '+24.5%',
    changeLabel: 'vs last month',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
    shadowColor: 'rgba(5,150,105,0.35)',
  },
  {
    title: 'Monthly Profit',
    value: formatCurrency(stats.monthlyProfit, 'PHP'),
    change: '+18.2%',
    changeLabel: 'vs last month',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    shadowColor: 'rgba(249,115,22,0.35)',
  },
  {
    title: 'Active Rentals',
    value: stats.activeRentals.toString(),
    changeLabel: `${stats.totalBookings} total bookings`,
    icon: Calendar,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    shadowColor: 'rgba(124,58,237,0.35)',
  },
  {
    title: 'Fleet Available',
    value: `${stats.availableVehicles}/${stats.totalVehicles}`,
    changeLabel: `${stats.totalVehicles - stats.availableVehicles} currently rented`,
    icon: Car,
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    shadowColor: 'rgba(37,99,235,0.35)',
  },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-800',
  'bg-purple-100 text-purple-800',
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-rose-100 text-rose-800',
]

function InitialsAvatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  )
}

export default function DashboardPage() {
  const [stats] = useState(DEMO_STATS)
  const cards = STAT_CARDS(stats)

  return (
    <div className="p-6 space-y-6">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs text-gray-500 mb-0.5 font-medium">{formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getGreeting()} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your fleet today.</p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all hover:-translate-y-px shadow-md shadow-orange-200 active:translate-y-0 shrink-0"
        >
          <Zap size={14} fill="currentColor" />
          New Booking
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-default"
              style={{
                background: card.gradient,
                boxShadow: `0 8px 24px ${card.shadowColor}`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

              <div className="flex items-start justify-between mb-4 relative">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Icon size={18} className="text-white" />
                </div>
                <ArrowUpRight size={14} className="text-white/50 group-hover:text-white transition-colors mt-1" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide mb-1 relative" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.title}</p>
              <p className="text-2xl font-bold text-white tracking-tight relative">{card.value}</p>

              <div className="flex items-center gap-1.5 mt-2.5 relative">
                {card.change && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: 'rgba(255,255,255,0.22)' }}>
                    {card.change}
                  </span>
                )}
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.changeLabel}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Revenue vs Expenses</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly comparison · 2025</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { color: 'bg-orange-500', label: 'Revenue' },
                { color: 'bg-rose-500',   label: 'Expenses' },
                { color: 'bg-emerald-500', label: 'Profit' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-xs text-gray-600 font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                {[
                  { id: 'grad-revenue',  color: '#F97316' },
                  { id: 'grad-expenses', color: '#F43F5E' },
                  { id: 'grad-profit',   color: '#10B981' },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"  stroke="#F97316" strokeWidth={2.5} fill="url(#grad-revenue)"  name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2.5} fill="url(#grad-expenses)" name="Expenses" />
              <Area type="monotone" dataKey="profit"   stroke="#10B981" strokeWidth={2.5} fill="url(#grad-profit)"   name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fleet status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Fleet Status</h3>
          <p className="text-xs text-gray-500 mb-4">24 vehicles total</p>

          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} strokeWidth={3} stroke="#fff" dataKey="value">
                {vehicleStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#111827', fontWeight: 700 }}
                itemStyle={{ color: '#374151', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2.5 mt-3">
            {vehicleStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-700 font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full bg-gray-100 w-16">
                    <div className="h-1.5 rounded-full" style={{ background: item.color, width: `${(item.value / 24) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-900 w-4 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Monthly Revenue</span>
              <span className="text-xs text-gray-900 font-bold">{formatCurrency(DEMO_STATS.monthlyRevenue, 'PHP')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Monthly Expenses</span>
              <span className="text-xs text-rose-600 font-bold">{formatCurrency(DEMO_STATS.monthlyExpenses, 'PHP')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-700 font-bold">Net Profit</span>
              <span className="text-xs text-emerald-700 font-bold">{formatCurrency(DEMO_STATS.monthlyProfit, 'PHP')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Bookings</h3>
              <p className="text-xs text-gray-500 mt-0.5">Latest rental activity</p>
            </div>
            <Link href="/dashboard/bookings" className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-700 font-bold transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentBookings.map((booking, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-orange-50/40 transition-colors">
                <InitialsAvatar name={booking.customer} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-orange-600 font-bold">{booking.id}</span>
                    <span className="text-sm font-bold text-gray-900 truncate">{booking.customer}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate">{booking.vehicle}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-gray-500 font-medium">{formatDate(booking.start)} → {formatDate(booking.end)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">₱{booking.amount.toLocaleString()}</p>
                </div>
                <Badge status={booking.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-orange-100">
              <Activity size={14} className="text-orange-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${activity.iconBg}`}>
                  <span className={activity.iconColor}>{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 font-semibold leading-relaxed">{activity.text}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{activity.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.dot}`} />
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <button className="w-full text-xs text-orange-600 hover:text-orange-700 font-bold transition-colors py-1 text-center">
              View all activity →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
