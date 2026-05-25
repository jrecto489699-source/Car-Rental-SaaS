'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Calendar, Edit2, Trash2, Eye,
  Car, User, CreditCard, ChevronDown, Download
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { formatDate, calcRentalDays, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEMO_BOOKINGS = [
  { id: 'BK-001', customer_name: 'Juan dela Cruz', customer_phone: '09171234567', driver_name: 'Juan dela Cruz', driver_license: 'A01-23-456789', vehicle: 'Toyota Fortuner 2023', plate: 'ABC 1234', start_date: '2025-05-23', end_date: '2025-05-26', price_per_day: 3500, other_fees: 500, amount_paid: 11000, payment_method: 'Cash', status: 'active', notes: '' },
  { id: 'BK-002', customer_name: 'Maria Santos', customer_phone: '09182345678', driver_name: 'Maria Santos', driver_license: 'P1234567A', vehicle: 'Honda Civic 2022', plate: 'XYZ 5678', start_date: '2025-05-22', end_date: '2025-05-25', price_per_day: 2500, other_fees: 0, amount_paid: 4000, payment_method: 'GCash', status: 'active', notes: '' },
  { id: 'BK-003', customer_name: 'Pedro Reyes', customer_phone: '09193456789', driver_name: 'Pedro Reyes', driver_license: '1234-5678-9012', vehicle: 'Ford Ranger 2023', plate: 'DEF 9012', start_date: '2025-05-20', end_date: '2025-05-22', price_per_day: 4000, other_fees: 1000, amount_paid: 9000, payment_method: 'Bank Transfer', status: 'completed', notes: '' },
  { id: 'BK-004', customer_name: 'Ana Garcia', customer_phone: '09204567890', driver_name: 'Ana Garcia', driver_license: 'A02-45-678901', vehicle: 'Mitsubishi Xpander', plate: 'GHI 3456', start_date: '2025-05-25', end_date: '2025-05-28', price_per_day: 2800, other_fees: 0, amount_paid: 0, payment_method: 'Cash', status: 'confirmed', notes: '' },
  { id: 'BK-005', customer_name: 'Carlo Lim', customer_phone: '09215678901', driver_name: 'Carlo Lim', driver_license: '03-1234567-8', vehicle: 'Toyota Innova 2022', plate: 'MNO 1234', start_date: '2025-05-24', end_date: '2025-05-27', price_per_day: 3200, other_fees: 500, amount_paid: 0, payment_method: 'Cash', status: 'pending', notes: '' },
  { id: 'BK-006', customer_name: 'Lisa Tan', customer_phone: '09226789012', driver_name: 'Lisa Tan', driver_license: 'P7654321B', vehicle: 'Toyota Fortuner 2023', plate: 'ABC 1234', start_date: '2025-05-18', end_date: '2025-05-21', price_per_day: 3500, other_fees: 0, amount_paid: 10500, payment_method: 'GCash', status: 'completed', notes: '' },
  { id: 'BK-007', customer_name: 'Ryan Cruz', customer_phone: '09237890123', driver_name: 'Ryan Cruz', driver_license: 'N01-23-567890', vehicle: 'Ford Ranger 2023', plate: 'DEF 9012', start_date: '2025-05-28', end_date: '2025-06-01', price_per_day: 4000, other_fees: 2000, amount_paid: 8000, payment_method: 'Bank Transfer', status: 'confirmed', notes: '' },
]

const PAYMENT_METHODS = ['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Credit Card', 'Debit Card']
const BOOKING_STATUSES = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'overdue']

function getPaymentStatus(totalAmount, amountPaid) {
  if (amountPaid <= 0) return { label: 'Unpaid', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' }
  if (amountPaid >= totalAmount) return { label: 'Fully Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  return { label: 'Partially Paid', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
}

function BookingForm({ booking, onSave, onCancel }) {
  const calcTotal = (b) => {
    const days = calcRentalDays(b.start_date, b.end_date)
    return (days * Number(b.price_per_day || 0)) + Number(b.other_fees || 0)
  }

  const [form, setForm] = useState({
    customer_name: booking?.customer_name || '',
    customer_phone: booking?.customer_phone || '',
    driver_name: booking?.driver_name || '',
    driver_license: booking?.driver_license || '',
    vehicle: booking?.vehicle || '',
    plate: booking?.plate || '',
    start_date: booking?.start_date || '',
    end_date: booking?.end_date || '',
    price_per_day: booking?.price_per_day || '',
    other_fees: booking?.other_fees || 0,
    amount_paid: booking?.amount_paid || 0,
    payment_method: booking?.payment_method || 'Cash',
    status: booking?.status || 'pending',
    notes: booking?.notes || '',
  })
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const totalAmount = calcTotal(form)
  const days = calcRentalDays(form.start_date, form.end_date)
  const payStatus = getPaymentStatus(totalAmount, Number(form.amount_paid))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name || !form.vehicle || !form.start_date || !form.end_date) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    onSave({ ...form, total_amount: totalAmount })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer Info */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Customer Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Customer Name *" value={form.customer_name} onChange={update('customer_name')} placeholder="Full name" required />
          <Input label="Phone Number *" value={form.customer_phone} onChange={update('customer_phone')} placeholder="09XXXXXXXXX" required />
        </div>
      </div>

      {/* Driver Info */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Driver Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Driver Name" value={form.driver_name} onChange={update('driver_name')} placeholder="Driver's full name" />
          <Input label="Driver's License #" value={form.driver_license} onChange={update('driver_license')} placeholder="License number" />
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Vehicle & Schedule</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Vehicle *" value={form.vehicle} onChange={update('vehicle')} placeholder="Toyota Fortuner 2023" required className="sm:col-span-2" />
          <Input label="Plate Number" value={form.plate} onChange={update('plate')} placeholder="ABC 1234" />
          <Select label="Booking Status" value={form.status} onChange={update('status')} options={BOOKING_STATUSES} placeholder={null} />
          <Input label="Start Date *" type="date" value={form.start_date} onChange={update('start_date')} required />
          <Input label="End Date *" type="date" value={form.end_date} onChange={update('end_date')} required />
        </div>
      </div>

      {/* Payment */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Price Per Day (₱) *" type="number" value={form.price_per_day} onChange={update('price_per_day')} placeholder="3500" required />
          <Input label="Other Fees (₱)" type="number" value={form.other_fees} onChange={update('other_fees')} placeholder="0" />
          <Input label="Amount Paid (₱)" type="number" value={form.amount_paid} onChange={update('amount_paid')} placeholder="0" />
          <Select label="Payment Method" value={form.payment_method} onChange={update('payment_method')} options={PAYMENT_METHODS} placeholder={null} />
        </div>

        {/* Auto-calculated summary */}
        {form.start_date && form.end_date && form.price_per_day && (
          <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-white/8 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Rental ({days} day{days !== 1 ? 's' : ''} × ₱{Number(form.price_per_day).toLocaleString()})</span>
              <span>₱{(days * Number(form.price_per_day)).toLocaleString()}</span>
            </div>
            {Number(form.other_fees) > 0 && (
              <div className="flex justify-between text-xs text-slate-400">
                <span>Other Fees</span>
                <span>₱{Number(form.other_fees).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-white border-t border-white/8 pt-2">
              <span>Total Amount</span>
              <span>₱{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Payment Status</span>
              <span className={cn('px-2 py-0.5 rounded-md border text-xs font-medium', payStatus.bg, payStatus.color)}>
                {payStatus.label}
              </span>
            </div>
            {Number(form.amount_paid) > 0 && Number(form.amount_paid) < totalAmount && (
              <div className="flex justify-between text-xs text-amber-400">
                <span>Balance Due</span>
                <span>₱{(totalAmount - Number(form.amount_paid)).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Textarea label="Notes" value={form.notes} onChange={update('notes')} placeholder="Additional notes..." rows={2} />

      <div className="flex gap-3 pt-2 border-t border-white/8">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{booking ? 'Update Booking' : 'Create Booking'}</Button>
      </div>
    </form>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(DEMO_BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [viewBooking, setViewBooking] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getTotal = (b) => (calcRentalDays(b.start_date, b.end_date) * Number(b.price_per_day)) + Number(b.other_fees || 0)

  const getPayStatus = (b) => {
    const total = getTotal(b)
    const paid = Number(b.amount_paid || 0)
    if (paid <= 0) return 'unpaid'
    if (paid >= total) return 'paid'
    return 'partial'
  }

  const filtered = bookings.filter(b => {
    const matchSearch = !search || `${b.customer_name} ${b.vehicle} ${b.id} ${b.driver_name}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const matchPayment = paymentFilter === 'all' || getPayStatus(b) === paymentFilter
    return matchSearch && matchStatus && matchPayment
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
      setBookings(prev => [...prev, { ...data, id }])
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

  // Summary stats
  const totalRevenue = bookings.reduce((s, b) => s + getTotal(b), 0)
  const totalCollected = bookings.reduce((s, b) => s + Number(b.amount_paid || 0), 0)
  const totalBalance = totalRevenue - totalCollected

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking Log</h1>
          <p className="text-sm text-slate-400 mt-1">{bookings.length} total · {counts.active} active</p>
        </div>
        <Button onClick={() => { setEditingBooking(null); setShowModal(true) }} icon={<Plus size={16} />}>
          New Booking
        </Button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, color: 'text-white', sub: 'from all bookings' },
          { label: 'Collected', value: `₱${totalCollected.toLocaleString()}`, color: 'text-emerald-400', sub: 'amount paid' },
          { label: 'Balance Due', value: `₱${totalBalance.toLocaleString()}`, color: 'text-amber-400', sub: 'outstanding' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-white/8">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize',
              statusFilter === key ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25' : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5'
            )}>
            {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full', statusFilter === key ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500')}>{count}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white py-2 px-3 focus:outline-none appearance-none"
          >
            <option value="all" className="bg-slate-900">All Payments</option>
            <option value="paid" className="bg-slate-900">Fully Paid</option>
            <option value="partial" className="bg-slate-900">Partially Paid</option>
            <option value="unpaid" className="bg-slate-900">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer, vehicle, driver, ID..."
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500/40 transition-all"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Calendar size={28} />} title="No bookings found" description="Create your first booking to get started." action={() => setShowModal(true)} actionLabel="New Booking" />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Booking #', 'Customer', 'Driver Name', 'License #', 'Vehicle', 'Duration', 'Rental', 'Other Fees', 'Total', 'Paid', 'Balance', 'Pay Status', 'Method', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-3 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((booking, i) => {
                  const days = calcRentalDays(booking.start_date, booking.end_date)
                  const rental = days * Number(booking.price_per_day)
                  const total = rental + Number(booking.other_fees || 0)
                  const paid = Number(booking.amount_paid || 0)
                  const balance = total - paid
                  const payStatus = getPaymentStatus(total, paid)
                  return (
                    <motion.tr key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/3 transition-colors">
                      <td className="px-3 py-3.5">
                        <span className="text-sm font-mono text-blue-400 font-semibold">{booking.id}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-white whitespace-nowrap">{booking.customer_name}</p>
                          <p className="text-xs text-slate-500">{booking.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm text-slate-300 whitespace-nowrap">{booking.driver_name || '—'}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs font-mono text-slate-400">{booking.driver_license || '—'}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="text-sm text-white whitespace-nowrap">{booking.vehicle}</p>
                          <p className="text-xs font-mono text-slate-500">{booking.plate}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="text-xs text-slate-300 whitespace-nowrap">{formatDate(booking.start_date)}</p>
                          <p className="text-xs text-slate-300">{formatDate(booking.end_date)}</p>
                          <p className="text-xs text-slate-500">{days}d</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm text-white">₱{rental.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">₱{Number(booking.price_per_day).toLocaleString()}/d</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm text-slate-300">{Number(booking.other_fees) > 0 ? `₱${Number(booking.other_fees).toLocaleString()}` : '—'}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm font-bold text-white">₱{total.toLocaleString()}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm text-emerald-400">₱{paid.toLocaleString()}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className={cn('text-sm font-medium', balance > 0 ? 'text-amber-400' : 'text-slate-500')}>
                          {balance > 0 ? `₱${balance.toLocaleString()}` : '—'}
                        </p>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={cn('px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap', payStatus.bg, payStatus.color)}>
                          {payStatus.label}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs text-slate-400">{booking.payment_method}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge status={booking.status} />
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewBooking(booking)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"><Eye size={14} /></button>
                          <button onClick={() => { setEditingBooking(booking); setShowModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(booking.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"><Trash2 size={14} /></button>
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
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingBooking(null) }} title={editingBooking ? 'Edit Booking' : 'New Booking'} size="xl">
        <BookingForm booking={editingBooking} onSave={handleSave} onCancel={() => { setShowModal(false); setEditingBooking(null) }} />
      </Modal>

      {/* View Modal */}
      {viewBooking && (() => {
        const days = calcRentalDays(viewBooking.start_date, viewBooking.end_date)
        const rental = days * Number(viewBooking.price_per_day)
        const total = rental + Number(viewBooking.other_fees || 0)
        const paid = Number(viewBooking.amount_paid || 0)
        const balance = total - paid
        const payStatus = getPaymentStatus(total, paid)
        return (
          <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} title="Booking Details" size="md">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Booking ID', value: <span className="font-mono text-blue-400">{viewBooking.id}</span> },
                  { label: 'Status', value: <Badge status={viewBooking.status} /> },
                  { label: 'Customer', value: viewBooking.customer_name },
                  { label: 'Phone', value: viewBooking.customer_phone },
                  { label: 'Driver Name', value: viewBooking.driver_name || '—' },
                  { label: "Driver's License", value: viewBooking.driver_license || '—' },
                  { label: 'Vehicle', value: viewBooking.vehicle },
                  { label: 'Plate', value: viewBooking.plate },
                  { label: 'Start Date', value: formatDate(viewBooking.start_date) },
                  { label: 'End Date', value: formatDate(viewBooking.end_date) },
                  { label: 'Duration', value: `${days} day${days !== 1 ? 's' : ''}` },
                  { label: 'Rate', value: `₱${Number(viewBooking.price_per_day).toLocaleString()}/day` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <div className="text-sm font-medium text-slate-200">{value}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Summary</p>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Rental ({days}d × ₱{Number(viewBooking.price_per_day).toLocaleString()})</span>
                  <span>₱{rental.toLocaleString()}</span>
                </div>
                {Number(viewBooking.other_fees) > 0 && (
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Other Fees</span>
                    <span>₱{Number(viewBooking.other_fees).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white border-t border-white/8 pt-2">
                  <span>Total Amount</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Amount Paid</span>
                  <span>₱{paid.toLocaleString()}</span>
                </div>
                {balance > 0 && (
                  <div className="flex justify-between text-sm text-amber-400">
                    <span>Balance Due</span>
                    <span>₱{balance.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-slate-400">Payment Status</span>
                  <span className={cn('px-2 py-0.5 rounded-md border text-xs font-medium', payStatus.bg, payStatus.color)}>{payStatus.label}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Payment Method</span>
                  <span>{viewBooking.payment_method}</span>
                </div>
              </div>

              {viewBooking.notes && (
                <div className="bg-slate-800/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-300">{viewBooking.notes}</p>
                </div>
              )}
            </div>
          </Modal>
        )
      })()}

      {/* Delete confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Booking" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Keep Booking</Button><Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Button></>}>
        <p className="text-sm text-slate-400">Are you sure you want to delete this booking?</p>
      </Modal>
    </div>
  )
}
