'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
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
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
      <p className="text-xs font-bold text-gray-900 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs mb-0.5 font-semibold" style={{ color: entry.color }}>
          {entry.name}: {['bookings'].includes(entry.name) ? entry.value : `₱${entry.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

const KPI_CARD_STYLES = [
  { gradient: 'linear-gradient(135deg, #059669 0%, #065f46 100%)', shadow: 'rgba(5,150,105,0.3)' },
  { gradient: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)', shadow: 'rgba(225,29,72,0.3)' },
  { gradient: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)', shadow: 'rgba(37,99,235,0.3)' },
  { gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', shadow: 'rgba(124,58,237,0.3)' },
]

function AnnualSummary() {
  const totalRevenue = ANNUAL_DATA.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = ANNUAL_DATA.reduce((s, d) => s + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalBookings = ANNUAL_DATA.reduce((s, d) => s + d.bookings, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)
  const totalExpenseAmt = EXPENSE_BREAKDOWN.reduce((s, e) => s + e.value, 0)

  const kpiCards = [
    { title: 'Total Revenue', value: `₱${(totalRevenue / 1000).toFixed(0)}K`, sub: 'Annual 2025' },
    { title: 'Total Expenses', value: `₱${(totalExpenses / 1000).toFixed(0)}K`, sub: 'Annual 2025' },
    { title: 'Net Profit', value: `₱${(totalProfit / 1000).toFixed(0)}K`, sub: `${profitMargin}% margin` },
    { title: 'Total Bookings', value: totalBookings, sub: 'across all vehicles' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{ background: KPI_CARD_STYLES[i].gradient, boxShadow: `0 8px 20px ${KPI_CARD_STYLES[i].shadow}` }}>
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <p className="text-xs font-semibold mb-1 relative" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.title}</p>
            <p className="text-2xl font-bold text-white relative">{card.value}</p>
            <p className="text-xs mt-0.5 relative" style={{ color: 'rgba(255,255,255,0.6)' }}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={EXPENSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2} stroke="#fff" dataKey="value">
                {EXPENSE_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₱${v.toLocaleString()}`, '']} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {EXPENSE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">₱{item.value.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1">{((item.value / totalExpenseAmt) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-700 font-bold">Total</span>
              <span className="text-xs font-bold text-rose-600">₱{totalExpenseAmt.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Profit Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Monthly Profit Trend</h3>
          <div className="flex gap-4 mb-4">
            {[{ color: 'bg-orange-500', label: 'Revenue' }, { color: 'bg-emerald-500', label: 'Profit' }, { color: 'bg-rose-500', label: 'Expenses' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-xs text-gray-600 font-semibold">{label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANNUAL_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
              <defs>
                {[{ id: 'revenue', color: '#F97316' }, { id: 'profit', color: '#10B981' }, { id: 'expenses', color: '#F43F5E' }].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#revenue)" name="revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5} fill="url(#profit)" name="profit" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2.5} fill="url(#expenses)" name="expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detail by Month */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Detail by Month — 2025</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Month', 'Bookings', 'Revenue', 'Expenses', 'Profit', 'Margin'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ANNUAL_DATA.map((d, i) => {
                const margin = ((d.profit / d.revenue) * 100).toFixed(1)
                return (
                  <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{d.monthFull}</td>
                    <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{d.bookings}</td>
                    <td className="px-5 py-3 text-sm text-emerald-700 font-bold">₱{d.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-rose-600 font-semibold">₱{d.expenses.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-blue-700 font-bold">₱{d.profit.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 max-w-[80px]">
                          <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${margin}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">{margin}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-5 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                <td className="px-5 py-3 text-sm font-bold text-gray-900">{totalBookings}</td>
                <td className="px-5 py-3 text-sm font-bold text-emerald-700">₱{totalRevenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-rose-600">₱{totalExpenses.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-blue-700">₱{totalProfit.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs font-bold text-gray-700">{profitMargin}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail by Car */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Detail by Vehicle — 2025</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Vehicle', 'Plate', 'Bookings', 'Revenue', 'Utilization'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_CARS.map((car, i) => (
                <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400 font-bold">#{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{car.name}</td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-600 font-semibold">{car.plate}</td>
                  <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{car.bookings}</td>
                  <td className="px-5 py-3 text-sm font-bold text-emerald-700">₱{car.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 max-w-[80px]">
                        <div className="h-1.5 rounded-full" style={{ width: `${car.utilization}%`, background: 'linear-gradient(90deg, #f97316, #7c3aed)' }} />
                      </div>
                      <span className="text-xs text-gray-600 font-bold">{car.utilization}%</span>
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
  const [selectedMonth, setSelectedMonth] = useState(4)

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

  const kpiCards = [
    { title: 'Monthly Revenue', value: `₱${(totalRevenue / 1000).toFixed(1)}K`, style: KPI_CARD_STYLES[0] },
    { title: 'Monthly Expenses', value: `₱${(totalExpenses / 1000).toFixed(1)}K`, style: KPI_CARD_STYLES[1] },
    { title: 'Net Profit', value: `₱${(totalProfit / 1000).toFixed(1)}K`, style: KPI_CARD_STYLES[2] },
    { title: 'Total Bookings', value: totalBookings, style: KPI_CARD_STYLES[3] },
  ]

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={prevMonth} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={16} />
        </button>
        <span className="text-base font-bold text-gray-900 min-w-[160px] text-center">{MONTHS_FULL[selectedMonth]} {selectedYear}</span>
        <button onClick={nextMonth} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div key={i} className="relative rounded-2xl p-5 overflow-hidden"
            style={{ background: card.style.gradient, boxShadow: `0 8px 20px ${card.style.shadow}` }}>
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <p className="text-xs font-semibold mb-1 relative" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.title}</p>
            <p className="text-2xl font-bold text-white relative">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Revenue Chart */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Daily Revenue & Bookings — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="dailyRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dailyProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#dailyRev)" name="revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#dailyProfit)" name="profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Bookings Bar */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Daily Booking Volume</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={dailyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            <Bar dataKey="bookings" radius={[4, 4, 0, 0]} name="Bookings">
              {dailyData.map((_, i) => <Cell key={i} fill={`rgba(124,58,237,${0.4 + (i / dailyData.length) * 0.5})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail by Day */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Detail by Day — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="border-b border-gray-100">
                {['Day', 'Day of Week', 'Bookings', 'Revenue', 'Expenses', 'Profit'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dailyData.map((d, i) => {
                const date = new Date(selectedYear, selectedMonth, d.day)
                const dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
                const isWeekend = [0, 6].includes(date.getDay())
                return (
                  <tr key={i} className={cn('hover:bg-orange-50/30 transition-colors', isWeekend && 'bg-orange-50/10')}>
                    <td className="px-5 py-2.5 text-sm font-bold text-gray-900">{d.day}</td>
                    <td className="px-5 py-2.5 text-sm text-gray-600 font-medium">{dow}</td>
                    <td className="px-5 py-2.5 text-sm text-gray-700 font-semibold">{d.bookings}</td>
                    <td className="px-5 py-2.5 text-sm text-emerald-700 font-bold">₱{d.revenue.toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-rose-600 font-semibold">₱{d.expenses.toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-blue-700 font-bold">₱{d.profit.toLocaleString()}</td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-5 py-3 text-sm font-bold text-gray-900" colSpan={2}>TOTAL</td>
                <td className="px-5 py-3 text-sm font-bold text-gray-900">{totalBookings}</td>
                <td className="px-5 py-3 text-sm font-bold text-emerald-700">₱{totalRevenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-rose-600">₱{totalExpenses.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-blue-700">₱{totalProfit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail by Car (monthly) */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Detail by Vehicle — {MONTHS_FULL[selectedMonth]} {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Vehicle', 'Plate', 'Bookings', 'Revenue', 'Utilization'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_CARS.map((car, i) => {
                const factor = 0.8 + (i % 5) * 0.08
                const monthRevenue = Math.round(car.revenue / 12 * factor)
                const monthBookings = Math.max(1, Math.round(car.bookings / 12 * factor))
                const util = Math.min(100, Math.round(car.utilization * factor))
                return (
                  <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{car.name}</td>
                    <td className="px-5 py-3 text-xs font-mono text-gray-600 font-semibold">{car.plate}</td>
                    <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{monthBookings}</td>
                    <td className="px-5 py-3 text-sm font-bold text-emerald-700">₱{monthRevenue.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 max-w-[80px]">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 font-bold">{util}%</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Financial performance overview</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {[{ key: 'annual', label: 'Annual Summary' }, { key: 'monthly', label: 'Monthly Summary' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('px-4 py-2 rounded-lg text-xs font-bold transition-all', tab === key ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}>
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {tab === 'annual' ? <AnnualSummary /> : <MonthlySummary />}
    </div>
  )
}
