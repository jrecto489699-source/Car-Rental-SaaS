'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Calendar, Clock, DollarSign,
  Edit2, Trash2, Eye, Car, User, Filter, X
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import BookingForm from '@/components/dashboard/BookingForm'
import { formatCurrency, formatDate, calcRentalDays, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEMO_BOOKINGS = [
  { id: 'BK-001', customer: 'Juan dela Cruz', customer_phone: '09171234567', vehicle: 'Toyota Fortuner 2023', plate: 'ABC 1234', start_date: '2025-05-23', end_date: '2025-05-26', price_per_day: 3500, payment_status: 'paid', status: 'active', notes: '' },
  { id: 'BK-002', customer: 'Maria Santos', customer_phone: '09182345678', vehicle: 'Honda Civic 2022', plate: 'XYZ 5678', start_date: '2025-05-22', end_date: '2025-05-25', price_per_day: 2500, payment_status: 'partial', status: 'active', notes: '' },
  { id: 'BK-003', customer: 'Pedro Reyes', customer_phone: '09193456789', vehicle: 'Ford Ranger 2023', plate: 'DEF 9012', start_date: '2025-05-20', end_date: '2025-05-22', price_per_day: 4000, payment_status: 'paid', status: 'completed', notes: '' },
  { id: 'BK-004', customer: 'Ana Garcia', customer_phone: '09204567890', vehicle: 'Mitsubishi Montero', plate: 'GHI 3456', start_date: '2025-05-25', end_date: '2025-05-28', price_per_day: 3800, payment_status: 'unpaid', status: 'confirmed', notes: '' },
  { id: 'BK-005', customer: 'Carlo Lim', customer_phone: '09215678901', vehicle: 'Toyota Vios 2023', plate: 'MNO 1234', start_date: '2025-05-24', end_date: '2025-05-27', price_per_day: 2000, payment_status: 'unpaid', status: 'pending', notes: '' },
  { id: 'BK-006', customer: 'Lisa Tan', customer_phone: '09226789012', vehicle: 'Toyota Fortuner 2023', plate: 'ABC 1234', start_date: '2025-05-18', end_date: '2025-05-21', price_per_day: 3500, payment_status: 'paid', status: 'completed', notes: '' },
  { id: 'BK-007', customer: 'Ryan Cruz', customer_phone: '09237890123', vehicle: 'Ford Ranger 2023', plate: 'DEF 9012', start_date: '2025-05-28', end_date: '2025-06-01', price_per_day: 4000, payment_status: 'unpaid', status: 'confirmed', notes: '' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(DEMO_BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [viewBooking, setViewBooking] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      `${b.customer} ${b.vehicle} ${b.id}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  const handleSave = (data) => {
    if (editingBooking) {
      setBookings(prev => prev.map(b => b.id === editingBooking.id ? { ...b, ...data } : b))
      toast.success('Booking updated!')
    } else {
      const id = `BK-${String(bookings.length + 1).padStart(3, '0')}`
      setBookings(prev => [...prev, { ...data, id, status: 'pending' }])
      toast.success('Booking created!')
    }
    setShowModal(false)
    setEditingBooking(null)
  }

  const handleDelete = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
    setDeleteConfirm(null)
    toast.success('Booking deleted')
  }

  const getTotalAmount = (b) => calcRentalDays(b.start_date, b.end_date) * b.price_per_day

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-slate-400 mt-1">{bookings.length} total · {counts.active} active</p>
        </div>
        <Button onClick={() => { setEditingBooking(null); setShowModal(true) }} icon={<Plus size={16} />}>
          New Booking
        </Button>
      </motion.div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize',
              statusFilter === key
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5'
            )}
          >
            {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full', statusFilter === key ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customer, vehicle, ID..."
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500/40 transition-all"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar size={28} />}
          title="No bookings found"
          description="Create your first booking to get started."
          action={() => setShowModal(true)}
          actionLabel="New Booking"
        />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Booking', 'Customer', 'Vehicle', 'Duration', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((booking, i) => {
                  const days = calcRentalDays(booking.start_date, booking.end_date)
                  const total = getTotalAmount(booking)
                  return (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-blue-400 font-semibold">{booking.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {booking.customer[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{booking.customer}</p>
                            <p className="text-xs text-slate-500">{booking.customer_phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-white">{booking.vehicle}</p>
                          <p className="text-xs font-mono text-slate-500">{booking.plate}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-xs text-slate-300">{formatDate(booking.start_date)} →</p>
                          <p className="text-xs text-slate-300">{formatDate(booking.end_date)}</p>
                          <p className="text-xs text-slate-500">{days} day{days !== 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">₱{total.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">₱{booking.price_per_day?.toLocaleString()}/day</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={booking.payment_status} />
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={booking.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewBooking(booking)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => { setEditingBooking(booking); setShowModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(booking.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingBooking(null) }}
        title={editingBooking ? 'Edit Booking' : 'New Booking'}
        size="lg"
      >
        <BookingForm
          booking={editingBooking}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingBooking(null) }}
        />
      </Modal>

      {/* View Modal */}
      {viewBooking && (
        <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} title="Booking Details" size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Booking ID', value: viewBooking.id },
                { label: 'Status', value: <Badge status={viewBooking.status} /> },
                { label: 'Customer', value: viewBooking.customer },
                { label: 'Phone', value: viewBooking.customer_phone },
                { label: 'Vehicle', value: viewBooking.vehicle },
                { label: 'Plate', value: viewBooking.plate },
                { label: 'Start Date', value: formatDate(viewBooking.start_date) },
                { label: 'End Date', value: formatDate(viewBooking.end_date) },
                { label: 'Duration', value: `${calcRentalDays(viewBooking.start_date, viewBooking.end_date)} days` },
                { label: 'Rate', value: `₱${viewBooking.price_per_day?.toLocaleString()}/day` },
                { label: 'Total Amount', value: <span className="text-white font-bold">₱{(calcRentalDays(viewBooking.start_date, viewBooking.end_date) * viewBooking.price_per_day).toLocaleString()}</span> },
                { label: 'Payment', value: <Badge status={viewBooking.payment_status} /> },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <div className="text-sm font-medium text-slate-200">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Cancel Booking"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Keep Booking</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Cancel Booking</Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">Are you sure you want to cancel this booking? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
