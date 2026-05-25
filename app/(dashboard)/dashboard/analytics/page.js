'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Car, Calendar,
  BarChart3, Download, ChevronLeft, ChevronRight, Users
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'
import { cn } from '@/lib/utils'

const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const ANNUAL_DATA = MONTHS_SHORT.map((month, i) => ({
  month,
  monthFull: MONTHS_FULL[i],
  revenue: [28000, 32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 62000, 68000, 72000][i],
  expenses: [12000, 14000, 15000, 13000, 16000, 18000, 17000, 19000, 21000, 22000, 24000, 25000][i],
  profit: [16000, 18000, 23000, 22000, 26000, 30000, 28000, 33000, 37000, 40000, 44000, 47000][i],
  bookings: [8, 10, 12, 11, 14, 16, 15, 18, 20, 22, 24, 26][i],
}))

const TOP_CARS = [
  { name: 'Toyota Fortuner 2023', plate: 'ABC 1234', revenue: 105000, bookings: 30, utilization: 85 },
  { name: 'Ford Ranger 2023', plate: 'DEF 9012', revenue: 88000, bookings: 22, utilization: 70 },
  { name: 'Honda Civic 2022', plate: 'XYZ 5678', revenue: 67500, bookings: 27, utilization: 75 },
  { name: 'Mitsubishi Xpander', plate: 'MNO 1234', revenue: 72200, bookings: 19, utilization: 65 },
  { name: 'Toyota Innova 2022', plate: 'STU 9012', revenue: 58400, bookings: 17, utilization: 55 },
  { name: 'Toyota HiAce 2022', plate: 'GHI 3456', revenue: 49500, bookings: 11, utilization: 42 },
  { name: 'Hyundai Tucson 2023', plate: 'JKL 7890', revenue: 43000, bookings: 15, utilization: 50 },
  { name: 'Suzuki Jimny 2023', plate: 'PQR 5678', revenue: 36500, bookings: 14, utilization: 38 },
]

const EXPENSE_BREAKDOWN = [
  { name: 'Car Wash', value: 8400, color: '#06B6D4' },
  { name: 'Fuel', value: 28000, color: '#F59E0B' },
  { name: 'Insurance', value: 36000, color: '#8B5CF6' },
  { name: 'Maintenance & Repair', value: 40000, color: '#3B82F6' },
  { name: 'Driver Salary', value: 75000, color: '#64748B' },
  { name: 'Advertising', value: 12000, color: '#EC4899' },
  { name: 'Office Supplies', value: 9600, color: '#10B981' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs mb-0.5" style={{ color: entry.color }}>
          {entry.name}: {['bookings'].includes(entry.name) ? entry.value : `₱${entry.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

function AnnualSummary() {
  const totalRevenue = ANNUAL_DATA.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = ANNUAL_DATA.reduce((s, d) => s + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalBookings = ANNUAL_DATA.reduce((s, d) => s + d.bookings, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)
  const totalExpenseAmt = EXPENSE_BREAKDOWN.reduce((s, e) => s + e.value, 0)

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: `₱${(totalRevenue / 1000).toFixed(0)}K`, sub: 'Annual 2025', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Total Expenses', value: `₱${(totalExpenses / 1000).toFixed(0)}K`, sub: 'Annual 2025', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { title: 'Net Profit', value: `₱${(totalProfit / 1000).toFixed(0)}K`, sub: `${profitMargin}% margin`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { title: 'Total Bookings', value: totalBookings, sub: 'across all vehicles', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={cn('p-5 rounded-2xl border', card.bg)}>
            <p className="text-xs text-slate-400 mb-1">{card.title}</p>
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
          <h3 className="text-sm font-semibold text-white mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={EXPENSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0} dataKey="value">
                {EXPENSE_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₱${v.toLocaleString()}`, '']} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {EXPENSE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-white">₱{item.value.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">{((item.value / totalExpenseAmt) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-white/8 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Total</span>
              <span className="text-xs font-bold text-rose-400">₱{totalExpenseAmt.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Profit Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 p-6 rounded-2xl border border-white/8 bg-slate-900/60">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Profit Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANNUAL_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
              <defs>
                {[{ id: 'revenue', color: '#3B82F6' }, { id: 'profit', color: '#10B981' }, { id: 'expenses', color: '#F43F5E' }].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenue)" name="revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profit)" name="profit" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#expenses)" name="expenses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[{ color: 'bg-blue-500', label: 'Revenue' }, { color: 'bg-emerald-500', label: 'Profit' }, { color: 'bg-rose-500', label: 'Expenses' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detail by Month */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white">Detail by Month — 2025</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Month', 'Bookings', 'Revenue', 'Expenses', 'Profit', 'Margin'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ANNUAL_DATA.map((d, i) => {
                const margin = ((d.profit / d.revenue) * 100).toFixed(1)
                return (
                  <tr key={i} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-white">{d.monthFull}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{d.bookings}</td>
                    <td className="px-5 py-3 text-sm text-emerald-400 font-medium">₱{d.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-rose-400">₱{d.expenses.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-blue-400 font-semibold">₱{d.profit.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 max-w-[80px]">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${margin}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{margin}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t border-white/15 bg-slate-800/30">
                <td className="px-5 py-3 text-sm font-bold text-white">TOTAL</td>
                <td className="px-5 py-3 text-sm font-bold text-white">{totalBookings}</td>
                <td className="px-5 py-3 text-sm font-bold text-emerald-400">₱{totalRevenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-rose-400">₱{totalExpenses.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-blue-400">₱{totalProfit.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs font-bold text-slate-300">{profitMargin}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail by Car */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white">Detail by Vehicle — 2025</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Vehicle', 'Plate', 'Bookings', 'Revenue', 'Utilization'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TOP_CARS.map((car, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500">#{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-white">{car.name}</td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-400">{car.plate}</td>
                  <td className="px-5 py-3 text-sm text-slate-300">{car.bookings}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-emerald-400">₱{car.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 max-w-[80px]">
                        <div className="h-1.5 rounded-full" style={{ width: `${car.utilization}%`, background: `linear-gradient(90deg, #3B82F6, #8B5CF6)` }} />
                      </div>
                      <span className="text-xs text-slate-400">{car.utilization}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

function MonthlySummary() {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(4) // May = 4

  const dailyData = makeDailyData(selectedYear, selectedMonth)
  const totalRevenue = dailyData.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = dailyData.reduce((s, d) => s + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalBookings = dailyData.reduce((s, d) => s + d.bookings, 0)

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1) }
    else setSelectedMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1) }
    else setSelectedMonth(m => m + 1)
  }

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-base font-bold text-white min-w-[160px] text-center">{MONTHS_FULL[selectedMonth]} {selectedYear}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        <div />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Monthly Revenue', value: `₱${(totalRevenue / 1000).toFixed(1)}K`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Monthly Expenses', value: `₱${(totalExpenses / 1000).toFixed(1)}K`, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { title: 'Net Profit', value: `₱${(totalProfit / 1000).toFixed(1)}K`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { title: 'Total Bookings', value: totalBookings, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map((card, i) => (
          <div key={i} className={cn('p-5 rounded-2xl border', card.bg)}>
            <p className="text-xs text-slate-400 mb-1">{card.title}</p>
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Booking Trend */}
      <div className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
        <h3 className="text-sm font-semibold text-white mb-4">Daily Revenue & Bookings — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="dailyRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dailyProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#dailyRev)" name="revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={1.5} fill="url(#dailyProfit)" name="profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Bookings Bar */}
      <div className="p-6 rounded-2xl border border-white/8 bg-slate-900/60">
        <h3 className="text-sm font-semibold text-white mb-4">Daily Booking Volume</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={dailyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
            <Bar dataKey="bookings" radius={[3, 3, 0, 0]} name="Bookings">
              {dailyData.map((_, i) => <Cell key={i} fill={`rgba(139,92,246,${0.4 + (i / dailyData.length) * 0.5})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail by Day */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white">Detail by Day — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
              <tr className="border-b border-white/5">
                {['Day', 'Day of Week', 'Bookings', 'Revenue', 'Expenses', 'Profit'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dailyData.map((d, i) => {
                const date = new Date(selectedYear, selectedMonth, d.day)
                const dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
                const isWeekend = [0, 6].includes(date.getDay())
                return (
                  <tr key={i} className={cn('hover:bg-white/3 transition-colors', isWeekend && 'bg-slate-800/20')}>
                    <td className="px-5 py-2.5 text-sm font-medium text-white">{d.day}</td>
                    <td className="px-5 py-2.5 text-sm text-slate-400">{dow}</td>
                    <td className="px-5 py-2.5 text-sm text-slate-300">{d.bookings}</td>
                    <td className="px-5 py-2.5 text-sm text-emerald-400">₱{d.revenue.toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-rose-400">₱{d.expenses.toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-blue-400 font-semibold">₱{d.profit.toLocaleString()}</td>
                  </tr>
                )
              })}
              <tr className="border-t border-white/15 bg-slate-800/30">
                <td className="px-5 py-3 text-sm font-bold text-white" colSpan={2}>TOTAL</td>
                <td className="px-5 py-3 text-sm font-bold text-white">{totalBookings}</td>
                <td className="px-5 py-3 text-sm font-bold text-emerald-400">₱{totalRevenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-rose-400">₱{totalExpenses.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-blue-400">₱{totalProfit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail by Car (monthly) */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white">Detail by Vehicle — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Vehicle', 'Plate', 'Bookings', 'Revenue', 'Utilization'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TOP_CARS.map((car, i) => {
                // Use deterministic values derived from car index to avoid Math.random() re-render flicker
                const factor = 0.8 + (i % 5) * 0.08
                const monthRevenue = Math.round(car.revenue / 12 * factor)
                const monthBookings = Math.max(1, Math.round(car.bookings / 12 * factor))
                const util = Math.min(100, Math.round(car.utilization * factor))
                return (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-white">{car.name}</td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-400">{car.plate}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{monthBookings}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-emerald-400">₱{monthRevenue.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 max-w-[80px]">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{util}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function makeDailyData(year, month) {
  const days = new Date(year, month + 1, 0).getDate()
  const seed = year * 100 + month
  const rng = (() => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff } })()
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1
    const isWeekend = [0, 6].includes(new Date(year, month, d).getDay())
    const base = isWeekend ? 3200 : 1800
    const rev = Math.round(base + rng() * 2000)
    const exp = Math.round(rev * 0.35 + rng() * 500)
    const bk = Math.max(1, Math.floor(rng() * (isWeekend ? 4 : 2) + 1))
    return { day: d, revenue: rev, expenses: exp, profit: rev - exp, bookings: bk }
  })
}

export default function AnalyticsPage() {
  const [tab, setTab] = useState('annual')

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Financial performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-xl p-1">
            {[{ key: 'annual', label: 'Annual Summary' }, { key: 'monthly', label: 'Monthly Summary' }].map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={cn('px-4 py-2 rounded-lg text-xs font-medium transition-all', tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white')}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {tab === 'annual' ? <AnnualSummary /> : <MonthlySummary />}
    </div>
  )
}
