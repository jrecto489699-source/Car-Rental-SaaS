'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Car, Calendar,
  Users, BarChart3, Download, Filter
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'
import { StatCard } from '@/components/ui/Card'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { MONTHS, CHART_COLORS } from '@/lib/constants'
import toast from 'react-hot-toast'

const monthlyData = MONTHS.map((month, i) => ({
  month,
  revenue: [28000, 32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 62000, 68000, 72000][i],
  expenses: [12000, 14000, 15000, 13000, 16000, 18000, 17000, 19000, 21000, 22000, 24000, 25000][i],
  profit: [16000, 18000, 23000, 22000, 26000, 30000, 28000, 33000, 37000, 40000, 44000, 47000][i],
  bookings: [8, 10, 12, 11, 14, 16, 15, 18, 20, 22, 24, 26][i],
}))

const topVehicles = [
  { name: 'Toyota Fortuner', revenue: 105000, bookings: 30, utilization: 85 },
  { name: 'Ford Ranger', revenue: 88000, bookings: 22, utilization: 70 },
  { name: 'Honda Civic', revenue: 67500, bookings: 27, utilization: 75 },
  { name: 'Mitsubishi Montero', revenue: 72200, bookings: 19, utilization: 65 },
  { name: 'Toyota Vios', revenue: 46000, bookings: 23, utilization: 60 },
]

const expenseBreakdown = [
  { name: 'Fuel', value: 28000, color: CHART_COLORS.amber },
  { name: 'Maintenance', value: 22000, color: CHART_COLORS.blue },
  { name: 'Insurance', value: 36000, color: CHART_COLORS.purple },
  { name: 'Repair', value: 18000, color: CHART_COLORS.rose },
  { name: 'Salary', value: 75000, color: CHART_COLORS.slate },
  { name: 'Other', value: 12000, color: CHART_COLORS.cyan },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs mb-0.5" style={{ color: entry.color }}>
          {entry.name}: {entry.name === 'bookings' ? entry.value : `₱${entry.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('yearly')

  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = monthlyData.reduce((s, d) => s + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalBookings = monthlyData.reduce((s, d) => s + d.bookings, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Business performance overview</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-xl p-1">
            {['monthly', 'quarterly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  period === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button onClick={() => toast.success('Report downloaded!')} variant="outline" size="sm" icon={<Download size={14} />}>
            Export
          </Button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: `₱${(totalRevenue/1000).toFixed(0)}K`, change: 24.5, icon: <DollarSign size={18} />, color: 'emerald' },
          { title: 'Total Profit', value: `₱${(totalProfit/1000).toFixed(0)}K`, change: 18.2, icon: <TrendingUp size={18} />, color: 'blue' },
          { title: 'Total Bookings', value: totalBookings, change: 15.8, icon: <Calendar size={18} />, color: 'purple' },
          { title: 'Profit Margin', value: `${profitMargin}%`, change: 2.1, icon: <BarChart3 size={18} />, color: 'cyan' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...card} changeLabel="vs last year" />
          </motion.div>
        ))}
      </div>

      {/* Revenue & Profit Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Revenue & Profit Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">12-month performance overview</p>
          </div>
          <div className="flex gap-4 text-xs">
            {[
              { color: 'bg-blue-500', label: 'Revenue' },
              { color: 'bg-emerald-500', label: 'Profit' },
              { color: 'bg-rose-500', label: 'Expenses' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              {[
                { id: 'revenue', color: '#3B82F6' },
                { id: 'profit', color: '#10B981' },
                { id: 'expenses', color: '#F43F5E' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenue)" name="revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profit)" name="profit" />
            <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#expenses)" name="expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Vehicles */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
          <h3 className="text-base font-semibold text-white mb-4">Top Performing Vehicles</h3>
          <div className="space-y-4">
            {topVehicles.map((v, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-4">#{i + 1}</span>
                    <span className="text-sm font-medium text-white">{v.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">₱{v.revenue.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 ml-2">{v.bookings} trips</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${v.utilization}%`,
                      background: `linear-gradient(90deg, ${['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][i]}, ${['#60A5FA', '#A78BFA', '#67E8F9', '#34D399', '#FCD34D'][i]})`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{v.utilization}% utilization</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
          <h3 className="text-base font-semibold text-white mb-4">Expense Breakdown</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} strokeWidth={0} dataKey="value">
                  {expenseBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {expenseBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-white">₱{item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/8">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Total</span>
                  <span className="text-xs font-bold text-rose-400">₱{expenseBreakdown.reduce((s, e) => s + e.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly bookings bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
        <h3 className="text-base font-semibold text-white mb-4">Monthly Bookings Volume</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
            <Bar dataKey="bookings" radius={[4, 4, 0, 0]} name="Bookings">
              {monthlyData.map((_, i) => (
                <Cell key={i} fill={`rgba(59,130,246,${0.4 + (i / 11) * 0.5})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

function Button({ children, onClick, variant = 'primary', size = 'md', icon }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25',
    outline: 'border border-white/15 hover:border-white/25 text-slate-300 hover:text-white hover:bg-white/5',
  }
  const sizes = { sm: 'px-3 py-2 text-xs rounded-lg gap-1.5', md: 'px-4 py-2.5 text-sm rounded-xl gap-2' }
  return (
    <button onClick={onClick} className={`inline-flex items-center font-medium transition-all hover:-translate-y-px ${variants[variant]} ${sizes[size]}`}>
      {icon}
      {children}
    </button>
  )
}
