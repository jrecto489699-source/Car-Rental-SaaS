'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Car, Calendar, Users, TrendingUp,
  TrendingDown, AlertCircle, CheckCircle2, Clock, ArrowRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { StatCard } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatDateRelative } from '@/lib/utils'
import { DEMO_STATS, MONTHS, CHART_COLORS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Demo chart data
const revenueData = MONTHS.map((month, i) => ({
  month,
  revenue: [28000, 32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 62000, 68000, 72000][i],
  expenses: [12000, 14000, 15000, 13000, 16000, 18000, 17000, 19000, 21000, 22000, 24000, 25000][i],
  profit: [16000, 18000, 23000, 22000, 26000, 30000, 28000, 33000, 37000, 40000, 44000, 47000][i],
}))

const vehicleStatusData = [
  { name: 'Available', value: 16, color: CHART_COLORS.emerald },
  { name: 'Rented', value: 6, color: CHART_COLORS.blue },
  { name: 'Maintenance', value: 2, color: CHART_COLORS.amber },
]

const recentBookings = [
  { id: 'BK-001', customer: 'Juan dela Cruz', vehicle: 'Toyota Fortuner 2023', start: '2025-05-23', end: '2025-05-26', amount: 10500, status: 'active' },
  { id: 'BK-002', customer: 'Maria Santos', vehicle: 'Honda Civic 2022', start: '2025-05-22', end: '2025-05-25', amount: 7500, status: 'active' },
  { id: 'BK-003', customer: 'Pedro Reyes', vehicle: 'Ford Ranger 2023', start: '2025-05-20', end: '2025-05-22', amount: 8000, status: 'completed' },
  { id: 'BK-004', customer: 'Ana Garcia', vehicle: 'Mitsubishi Montero', start: '2025-05-25', end: '2025-05-28', amount: 11400, status: 'confirmed' },
  { id: 'BK-005', customer: 'Carlo Lim', vehicle: 'Toyota Vios 2023', start: '2025-05-24', end: '2025-05-27', amount: 6000, status: 'pending' },
]

const recentActivity = [
  { icon: <CheckCircle2 size={14} />, text: 'Booking BK-001 confirmed', time: '2 min ago', color: 'text-emerald-400' },
  { icon: <Car size={14} />, text: 'Honda Civic returned safely', time: '20 min ago', color: 'text-blue-400' },
  { icon: <DollarSign size={14} />, text: 'Payment ₱10,500 received', time: '1 hour ago', color: 'text-emerald-400' },
  { icon: <AlertCircle size={14} />, text: 'Maintenance scheduled: Toyota Vios', time: '2 hours ago', color: 'text-amber-400' },
  { icon: <Users size={14} />, text: 'New customer: Ana Garcia registered', time: '3 hours ago', color: 'text-purple-400' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value, 'PHP')}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(DEMO_STATS)
  const [loading, setLoading] = useState(false)

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue, 'PHP'),
      change: 24.5,
      changeLabel: 'vs last month',
      icon: <DollarSign size={18} />,
      color: 'emerald',
    },
    {
      title: 'Monthly Profit',
      value: formatCurrency(stats.monthlyProfit, 'PHP'),
      change: 18.2,
      changeLabel: 'vs last month',
      icon: <TrendingUp size={18} />,
      color: 'blue',
    },
    {
      title: 'Active Rentals',
      value: stats.activeRentals.toString(),
      changeLabel: `${stats.totalBookings} total bookings`,
      icon: <Calendar size={18} />,
      color: 'purple',
    },
    {
      title: 'Fleet Available',
      value: `${stats.availableVehicles}/${stats.totalVehicles}`,
      changeLabel: `${stats.totalVehicles - stats.availableVehicles} currently rented`,
      icon: <Car size={18} />,
      color: 'cyan',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            {formatDate(new Date(), 'EEEE, MMMM dd, yyyy')} · Overview of your rental business
          </p>
        </div>
        <Link
          href="/dashboard/bookings/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all hover:-translate-y-px shadow-lg shadow-blue-500/25"
        >
          New Booking
          <ArrowRight size={14} />
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 p-6 rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly comparison for 2025</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-400">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-400">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Profit</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenue)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#expenses)" name="Expenses" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profit)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fleet status pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm"
        >
          <h3 className="text-base font-semibold text-white mb-1">Fleet Status</h3>
          <p className="text-xs text-slate-400 mb-4">24 vehicles total</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                strokeWidth={0}
                dataKey="value"
              >
                {vehicleStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#F8FAFC' }}
                itemStyle={{ color: '#94A3B8' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {vehicleStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-white">{item.value}</span>
              </div>
            ))}
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
          className="xl:col-span-2 rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/8">
            <h3 className="text-base font-semibold text-white">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentBookings.map((booking, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/3 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-blue-400">{booking.id}</span>
                    <span className="text-sm font-medium text-white truncate">{booking.customer}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{booking.vehicle}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-slate-400">{formatDate(booking.start)} → {formatDate(booking.end)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">₱{booking.amount.toLocaleString()}</p>
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
          className="p-6 rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm"
        >
          <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${activity.color}`}>{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-relaxed">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly summary */}
          <div className="mt-6 pt-4 border-t border-white/8 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Revenue</span>
              <span className="text-white font-medium">{formatCurrency(stats.monthlyRevenue, 'PHP')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Expenses</span>
              <span className="text-rose-400 font-medium">{formatCurrency(stats.monthlyExpenses, 'PHP')}</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-white/8">
              <span className="text-slate-300 font-medium">Net Profit</span>
              <span className="text-emerald-400 font-semibold">{formatCurrency(stats.monthlyProfit, 'PHP')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
