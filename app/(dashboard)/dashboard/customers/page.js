'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Users, Phone, Mail, MapPin,
  Edit2, Trash2, Eye, Car, Calendar, DollarSign, Star
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'
import { CUSTOMER_ID_TYPES } from '@/lib/constants'
import toast from 'react-hot-toast'

const DEMO_CUSTOMERS = [
  {
    id: 1, name: 'Juan dela Cruz', email: 'juan@email.com', phone: '09171234567',
    address: 'Makati City, Metro Manila', id_type: "Driver's License", id_number: 'A01-23-456789',
    status: 'active', joined: '2024-01-15',
    bookings: [
      { date: '2025-05-23', car: 'Toyota Fortuner 2023', amount: 11000 },
      { date: '2025-04-10', car: 'Honda Civic 2022', amount: 7500 },
      { date: '2025-03-05', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2025-01-20', car: 'Ford Ranger 2023', amount: 12000 },
      { date: '2024-12-01', car: 'Toyota Fortuner 2023', amount: 10500 },
    ]
  },
  {
    id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '09182345678',
    address: 'Quezon City, Metro Manila', id_type: 'Passport', id_number: 'P1234567A',
    status: 'active', joined: '2024-03-20',
    bookings: [
      { date: '2025-05-22', car: 'Honda Civic 2022', amount: 7500 },
      { date: '2025-03-12', car: 'Hyundai Tucson 2023', amount: 9000 },
      { date: '2025-01-08', car: 'Honda Civic 2022', amount: 7500 },
    ]
  },
  {
    id: 3, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09193456789',
    address: 'Cebu City, Cebu', id_type: 'National ID', id_number: '1234-5678-9012',
    status: 'active', joined: '2023-11-10',
    bookings: [
      { date: '2025-05-20', car: 'Ford Ranger 2023', amount: 9000 },
      { date: '2025-04-05', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2025-02-18', car: 'Ford Ranger 2023', amount: 8000 },
      { date: '2024-12-20', car: 'Toyota HiAce 2022', amount: 13500 },
      { date: '2024-11-05', car: 'Ford Ranger 2023', amount: 8000 },
      { date: '2024-09-15', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2024-07-22', car: 'Ford Ranger 2023', amount: 8000 },
      { date: '2024-05-10', car: 'Toyota Fortuner 2023', amount: 10500 },
    ]
  },
  {
    id: 4, name: 'Ana Garcia', email: 'ana@email.com', phone: '09204567890',
    address: 'Davao City, Davao del Sur', id_type: "Driver's License", id_number: 'A02-45-678901',
    status: 'active', joined: '2025-01-05',
    bookings: [
      { date: '2025-05-25', car: 'Mitsubishi Xpander 2022', amount: 8400 },
      { date: '2025-03-01', car: 'Honda Civic 2022', amount: 7500 },
    ]
  },
  {
    id: 5, name: 'Carlo Lim', email: 'carlo@email.com', phone: '09215678901',
    address: 'Pasig City, Metro Manila', id_type: 'SSS ID', id_number: '03-1234567-8',
    status: 'active', joined: '2025-04-12',
    bookings: [
      { date: '2025-05-24', car: 'Toyota Innova 2022', amount: 10100 },
    ]
  },
  {
    id: 6, name: 'Lisa Tan', email: 'lisa@email.com', phone: '09226789012',
    address: 'Taguig City, Metro Manila', id_type: 'Passport', id_number: 'P7654321B',
    status: 'vip', joined: '2023-06-01',
    bookings: [
      { date: '2025-05-18', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2025-04-22', car: 'Ford Ranger 2023', amount: 9000 },
      { date: '2025-03-14', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2025-02-05', car: 'Hyundai Tucson 2023', amount: 9000 },
      { date: '2025-01-10', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2024-11-20', car: 'Ford Ranger 2023', amount: 8000 },
      { date: '2024-10-08', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2024-08-15', car: 'Toyota HiAce 2022', amount: 13500 },
      { date: '2024-06-28', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2024-04-12', car: 'Ford Ranger 2023', amount: 8000 },
      { date: '2024-02-20', car: 'Toyota Fortuner 2023', amount: 10500 },
      { date: '2023-12-10', car: 'Hyundai Tucson 2023', amount: 9000 },
    ]
  },
]

function getCustomerStats(customer) {
  const total = customer.bookings.reduce((s, b) => s + b.amount, 0)
  const last = customer.bookings[0] || null
  return {
    total_bookings: customer.bookings.length,
    total_spent: total,
    last_booking_date: last?.date || null,
    last_car: last?.car || null,
  }
}

function CustomerForm({ customer, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    id_type: customer?.id_type || "Driver's License",
    id_number: customer?.id_number || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    onSave(form)
    setLoading(false)
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={update('name')} placeholder="Juan dela Cruz" error={errors.name} required className="sm:col-span-2" />
        <Input label="Email" type="email" value={form.email} onChange={update('email')} placeholder="juan@email.com" />
        <Input label="Phone Number" value={form.phone} onChange={update('phone')} placeholder="09XXXXXXXXX" error={errors.phone} required />
        <Input label="Address" value={form.address} onChange={update('address')} placeholder="City, Province" className="sm:col-span-2" />
        <Select label="ID Type" value={form.id_type} onChange={update('id_type')} options={CUSTOMER_ID_TYPES} placeholder={null} />
        <Input label="ID Number" value={form.id_number} onChange={update('id_number')} placeholder="ID number" />
      </div>
      <div className="flex gap-3 mt-6 pt-4 border-t border-white/8">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{customer ? 'Update Customer' : 'Add Customer'}</Button>
      </div>
    </form>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [viewCustomer, setViewCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = customers.filter(c => {
    const matchSearch = !search || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleSave = (data) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...data } : c))
      toast.success('Customer updated!')
    } else {
      setCustomers(prev => [...prev, { ...data, id: Date.now(), bookings: [], status: 'active', joined: new Date().toISOString().split('T')[0] }])
      toast.success('Customer added!')
    }
    setShowModal(false)
    setEditingCustomer(null)
  }

  const totalRevenue = customers.reduce((s, c) => s + getCustomerStats(c).total_spent, 0)
  const vipCount = customers.filter(c => c.status === 'vip').length

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Database</h1>
          <p className="text-sm text-slate-400 mt-1">{customers.length} registered · {vipCount} VIP</p>
        </div>
        <Button onClick={() => { setEditingCustomer(null); setShowModal(true) }} icon={<Plus size={16} />}>
          Add Customer
        </Button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, sub: `${vipCount} VIP`, icon: <Users size={16} />, color: 'text-blue-400' },
          { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, sub: 'lifetime', icon: <DollarSign size={16} />, color: 'text-emerald-400' },
          { label: 'Avg. Per Customer', value: `₱${Math.round(totalRevenue / customers.length).toLocaleString()}`, sub: 'lifetime spend', icon: <Star size={16} />, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-white/8 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-slate-800 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500/40"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-xl p-1">
          {['all', 'active', 'vip', 'blacklisted'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {s === 'all' ? 'All' : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No customers found" description="Add your first customer to get started." action={() => setShowModal(true)} actionLabel="Add Customer" />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Customer', 'Contact', 'ID', 'Total Bookings', 'Total Spent', 'Last Booking Date', 'Last Car Rented', 'Member Since', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((customer, i) => {
                  const stats = getCustomerStats(customer)
                  return (
                    <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-white whitespace-nowrap">{customer.name}</p>
                            {customer.status === 'vip' && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">VIP</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-300">{customer.phone}</p>
                        {customer.email && <p className="text-xs text-slate-500">{customer.email}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-slate-400">{customer.id_type}</p>
                        <p className="text-xs font-mono text-slate-500">{customer.id_number}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{stats.total_bookings}</span>
                          <span className="text-xs text-slate-500">bookings</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-emerald-400">₱{stats.total_spent.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-300">{stats.last_booking_date ? formatDate(stats.last_booking_date) : '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-300 whitespace-nowrap">{stats.last_car || '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-slate-400">{formatDate(customer.joined)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge status={customer.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewCustomer(customer)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"><Eye size={14} /></button>
                          <button onClick={() => { setEditingCustomer(customer); setShowModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(customer.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"><Trash2 size={14} /></button>
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCustomer(null) }} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} size="md">
        <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={() => { setShowModal(false); setEditingCustomer(null) }} />
      </Modal>

      {viewCustomer && (() => {
        const stats = getCustomerStats(viewCustomer)
        return (
          <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer History" size="lg">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40">
                <Avatar name={viewCustomer.name} size="xl" />
                <div>
                  <h3 className="text-lg font-bold text-white">{viewCustomer.name}</h3>
                  <p className="text-sm text-slate-400">{viewCustomer.email}</p>
                  <p className="text-sm text-slate-400">{viewCustomer.phone}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="text-2xl font-bold text-emerald-400">₱{stats.total_spent.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{stats.total_bookings} bookings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Bookings', value: stats.total_bookings },
                  { label: 'Total Spent', value: `₱${stats.total_spent.toLocaleString()}` },
                  { label: 'Last Booking', value: stats.last_booking_date ? formatDate(stats.last_booking_date) : '—' },
                  { label: 'Last Car', value: stats.last_car || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Booking History</p>
                <div className="rounded-xl border border-white/8 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400">Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400">Vehicle</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {viewCustomer.bookings.map((b, i) => (
                        <tr key={i} className="hover:bg-white/3 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-slate-300">{formatDate(b.date)}</td>
                          <td className="px-4 py-2.5 text-sm text-white">{b.car}</td>
                          <td className="px-4 py-2.5 text-sm text-emerald-400 text-right font-medium">₱{b.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>
        )
      })()}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Customer" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button><Button variant="danger" onClick={() => { setCustomers(prev => prev.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null); toast.success('Customer deleted') }}>Delete</Button></>}>
        <p className="text-sm text-slate-400">This will delete the customer profile. Booking history will be preserved.</p>
      </Modal>
    </div>
  )
}
