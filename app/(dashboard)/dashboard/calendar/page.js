'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Car, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const VEHICLES = [
  { id: 1, name: 'Toyota Fortuner 2023', plate: 'ABC 1234', color: '#3B82F6' },
  { id: 2, name: 'Honda Civic 2022', plate: 'XYZ 5678', color: '#10B981' },
  { id: 3, name: 'Ford Ranger 2023', plate: 'DEF 9012', color: '#F59E0B' },
  { id: 4, name: 'Toyota HiAce 2022', plate: 'GHI 3456', color: '#8B5CF6' },
  { id: 5, name: 'Hyundai Tucson 2023', plate: 'JKL 7890', color: '#EC4899' },
  { id: 6, name: 'Mitsubishi Xpander 2022', plate: 'MNO 1234', color: '#06B6D4' },
  { id: 7, name: 'Suzuki Jimny 2023', plate: 'PQR 5678', color: '#F43F5E' },
  { id: 8, name: 'Toyota Innova 2022', plate: 'STU 9012', color: '#84CC16' },
]

// Bookings: { vehicleId, start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', customer, ref }
const BOOKINGS = [
  { vehicleId: 1, start: '2025-05-23', end: '2025-05-26', customer: 'Juan dela Cruz', ref: 'BK-001' },
  { vehicleId: 2, start: '2025-05-22', end: '2025-05-25', customer: 'Maria Santos', ref: 'BK-002' },
  { vehicleId: 3, start: '2025-05-20', end: '2025-05-22', customer: 'Pedro Reyes', ref: 'BK-003' },
  { vehicleId: 4, start: '2025-05-25', end: '2025-05-28', customer: 'Ana Garcia', ref: 'BK-004' },
  { vehicleId: 5, start: '2025-05-24', end: '2025-05-27', customer: 'Carlo Lim', ref: 'BK-005' },
  { vehicleId: 1, start: '2025-05-18', end: '2025-05-21', customer: 'Lisa Tan', ref: 'BK-006' },
  { vehicleId: 3, start: '2025-05-28', end: '2025-06-01', customer: 'Ryan Cruz', ref: 'BK-007' },
  { vehicleId: 6, start: '2025-05-05', end: '2025-05-08', customer: 'Rose Mendoza', ref: 'BK-008' },
  { vehicleId: 7, start: '2025-05-12', end: '2025-05-15', customer: 'Alex Torres', ref: 'BK-009' },
  { vehicleId: 8, start: '2025-05-08', end: '2025-05-11', customer: 'Jay Dela Rosa', ref: 'BK-010' },
  { vehicleId: 2, start: '2025-05-15', end: '2025-05-18', customer: 'Nina Cruz', ref: 'BK-011' },
  // Double booking example for demo
  { vehicleId: 1, start: '2025-05-24', end: '2025-05-25', customer: 'TEST Double', ref: 'BK-DBL' },
]

function dateToStr(d) {
  return d.toISOString().split('T')[0]
}

function isBooked(vehicleId, dateStr, bookings) {
  const matches = bookings.filter(b => b.vehicleId === vehicleId && dateStr >= b.start && dateStr <= b.end)
  if (matches.length > 1) return { type: 'double', bookings: matches }
  if (matches.length === 1) return { type: 'booked', bookings: matches }
  return { type: 'free' }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TODAY = new Date()

export default function CalendarPage() {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(4) // 0-indexed, 4 = May
  const [tooltip, setTooltip] = useState(null) // { vehicleId, day, x, y }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getBookingsForCell = (vehicleId, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return isBooked(vehicleId, dateStr, BOOKINGS)
  }

  // Stats for the current month
  const bookedDays = {}
  VEHICLES.forEach(v => {
    bookedDays[v.id] = days.filter(d => getBookingsForCell(v.id, d).type !== 'free').length
  })

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Availability Calendar</h1>
          <p className="text-sm text-slate-400 mt-1">Fleet occupancy view — color-coded per booking status</p>
        </div>
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-base font-bold text-white min-w-[140px] text-center">{MONTHS[month]} {year}</p>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        {[
          { color: 'bg-slate-800/80 border border-white/10', label: 'Available' },
          { color: 'bg-emerald-500/70', label: 'Booked' },
          { color: 'bg-rose-500/70', label: 'Double-Booked' },
          { color: 'bg-blue-500/20 border border-blue-500/40', label: 'Today' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('w-5 h-5 rounded', color)} />
            <span className="text-slate-400 text-xs">{label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Info size={12} />
          <span>Hover a cell to see booking details</span>
        </div>
      </div>

      {/* Calendar Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: `${160 + daysInMonth * 32}px` }}>
            <thead>
              <tr className="border-b border-white/8">
                <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[200px]">
                  Vehicle
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[60px] border-l border-white/5">
                  Booked Days
                </th>
                {days.map(d => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                  const isToday = dateStr === dateToStr(TODAY)
                  const dayOfWeek = new Date(year, month, d).getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                  return (
                    <th key={d} className={cn(
                      'py-3 text-center font-semibold tracking-wider',
                      isToday ? 'text-blue-400' : isWeekend ? 'text-slate-500' : 'text-slate-400'
                    )} style={{ width: 32, minWidth: 32 }}>
                      <div>{d}</div>
                      <div className="text-slate-600 font-normal text-[9px]">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeek]}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {VEHICLES.map((vehicle, vi) => (
                <tr key={vehicle.id} className="hover:bg-white/2 transition-colors">
                  <td className="sticky left-0 z-10 bg-slate-900 px-4 py-3 min-w-[200px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: vehicle.color }} />
                      <div>
                        <p className="font-medium text-white text-xs">{vehicle.name}</p>
                        <p className="text-slate-500 text-[10px] font-mono">{vehicle.plate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center border-l border-white/5">
                    <span className={cn(
                      'text-xs font-bold',
                      bookedDays[vehicle.id] === 0 ? 'text-slate-500' :
                        bookedDays[vehicle.id] >= daysInMonth * 0.7 ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {bookedDays[vehicle.id]}
                    </span>
                    <span className="text-slate-600 text-[9px] block">/{daysInMonth}</span>
                  </td>
                  {days.map(d => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                    const cell = getBookingsForCell(vehicle.id, d)
                    const isToday = dateStr === dateToStr(TODAY)
                    const dayOfWeek = new Date(year, month, d).getDay()
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                    return (
                      <td key={d} style={{ width: 32, minWidth: 32 }} className="px-0.5 py-1.5 text-center">
                        <div
                          className={cn(
                            'mx-auto rounded cursor-pointer transition-transform hover:scale-110',
                            'w-6 h-6',
                            cell.type === 'double' ? 'bg-rose-500/70 border border-rose-400/50' :
                              cell.type === 'booked' ? 'bg-emerald-500/70 border border-emerald-400/30' :
                                isToday ? 'bg-blue-500/20 border border-blue-500/40' :
                                  isWeekend ? 'bg-slate-800/50 border border-white/5' :
                                    'bg-slate-800/30 border border-white/5 hover:border-white/15'
                          )}
                          title={
                            cell.type !== 'free'
                              ? cell.bookings.map(b => `${b.ref}: ${b.customer}`).join(' | ')
                              : 'Available'
                          }
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Monthly Summary Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl border border-white/8 bg-slate-900/60">
        <h3 className="text-sm font-semibold text-white mb-4">{MONTHS[month]} {year} — Fleet Utilization Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {VEHICLES.map(v => {
            const util = Math.round((bookedDays[v.id] / daysInMonth) * 100)
            return (
              <div key={v.id} className="p-3 rounded-xl bg-slate-800/40 border border-white/5 text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ backgroundColor: v.color }} />
                <p className="text-xs text-white font-medium leading-tight mb-1">{v.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-xs font-mono text-slate-500">{v.plate}</p>
                <p className="text-lg font-bold text-white mt-2">{bookedDays[v.id]}</p>
                <p className="text-xs text-slate-500">days / {daysInMonth}</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${util}%`, backgroundColor: v.color, opacity: 0.8 }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{util}%</p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
