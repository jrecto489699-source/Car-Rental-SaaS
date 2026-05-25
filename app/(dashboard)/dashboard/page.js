'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Car, Calendar, Users, TrendingUp,
  AlertCircle, CheckCircle2, Clock, ArrowRight, ArrowUpRight, Zap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DEMO_STATS, MONTHS, CHART_COLORS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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
  { icon: <CheckCircle2 size={14} />, text: 'Booking BK-001 confirmed', time: '2 min ago', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { icon: <Car size={14} />, text: 'Honda Civic returned safely', time: '20 min ago', color: 'text-blue-400', dot: 'bg-blue-400' },
  { icon: <DollarSign size={14} />, text: 'Payment ₱10,500 received', time: '1 hour ago', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { icon: <AlertCircle size={14} />, text: 'Maintenance scheduled: Toyota Vios', time: '2 hours ago', color: 'text-amber-400', dot: 'bg-amber-400' },
  { icon: <Users size={14} />, text: 'New customer: Ana Garcia registered', time: '3 hours ago', color: 'text-purple-400', dot: 'bg-purple-400' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs mb-0.5" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value, 'PHP')}
        </p>
      ))}
    </div>
  )
}

const statCards = (stats) => [
  {
    title: 'Total Revenue',
    value: formatCurrency(stats.totalRevenue, 'PHP'),
    change: '+24.5%',
    changeLabel: 'vs last month',
    icon: DollarSign,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    changeColor: 'text-emerald-400',
  },
  {
    title: 'Monthly Profit',
    value: formatCurrency(stats.monthlyProfit, 'PHP'),
    change: '+18.2%',
    changeLabel: 'vs last month',
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    changeColor: 'text-blue-400',
  },
  {
    title: 'Active Rentals',
    value: stats.activeRentals.toString(),
    changeLabel: `${stats.totalBookings} total bookings`,
    icon: Calendar,
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    changeColor: 'text-slate-400',
  },
  {
    title: 'Fleet Available',
    value: `${stats.availableVehicles}/${stats.totalVehicles}`,
    changeLabel: `${stats.totalVehicles - stats.availableVehicles} currently rented`,
    icon: Car,
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    changeColor: 'text-slate-400',
  },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [stats] = useState(DEMO_STATS)

  const cards = statCards(stats)

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-xs text-slate-500 mb-0.5">{formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
          <h1 className="text-2xl font-bold text-white">{getGreeting()} 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px shadow-lg shadow-blue-500/25 active:translate-y-0"
          >
            <Zap size={14} fill="currentColor" />
            New Booking
          </Link>
        </div>
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
              className={`relative p-5 rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
                <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
              <p className={`text-xs mt-1 ${card.changeColor}`}>
                {card.change && <span className="font-semibold">{card.change} </span>}
                <span className="text-slate-500">{card.changeLabel}</span>
              </p>
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
          className="xl:col-span-2 p-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly comparison · 2025</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {[
                { color: 'bg-blue-500', label: 'Revenue' },
                { color: 'bg-rose-500', label: 'Expenses' },
                { color: 'bg-emerald-500', label: 'Profit' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                {[
                  { id: 'grad-revenue', color: '#3B82F6' },
                  { id: 'grad-expenses', color: '#F43F5E' },
                  { id: 'grad-profit', color: '#10B981' },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#grad-revenue)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#grad-expenses)" name="Expenses" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#grad-profit)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fleet status pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold text-white mb-0.5">Fleet Status</h3>
          <p className="text-xs text-slate-500 mb-4">24 vehicles total</p>
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
                  <Cell key={i} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#F8FAFC' }}
                itemStyle={{ color: '#94A3B8' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {vehicleStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 rounded-full bg-slate-800 w-16">
                    <div className="h-1 rounded-full" style={{ background: item.color, width: `${(item.value / 24) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-white w-4 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick summary */}
          <div className="mt-5 pt-4 border-t border-white/[0.07] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Monthly Revenue</span>
              <span className="text-white font-medium">{formatCurrency(stats.monthlyRevenue, 'PHP')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Monthly Expenses</span>
              <span className="text-rose-400 font-medium">{formatCurrency(stats.monthlyExpenses, 'PHP')}</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-white/[0.07]">
              <span className="text-slate-300 font-medium">Net Profit</span>
              <span className="text-emerald-400 font-semibold">{formatCurrency(stats.monthlyProfit, 'PHP')}</span>
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
          className="xl:col-span-2 rounded-2xl border border-white/[0.07] bg-slate-900/70 backdrop-blur-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Bookings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest rental activity</p>
            </div>
            <Link href="/dashboard/bookings" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {recentBookings.map((booking, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-blue-400 font-semibold">{booking.id}</span>
                    <span className="text-sm font-medium text-white truncate">{booking.customer}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{booking.vehicle}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-slate-500">{formatDate(booking.start)} → {formatDate(booking.end)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">₱{booking.amount.toLocaleString()}</p>
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
          className="p-6 rounded-2xl border border-white/[0.07] bg-slate-900/70 backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className={`p-1.5 rounded-lg ${activity.color.replace('text-', 'bg-').replace('400', '500/15')}`}>
                    <span className={activity.color}>{activity.icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-relaxed">{activity.text}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
