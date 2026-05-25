'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Users, Eye, Edit2, Trash2,
  DollarSign, Star, Car
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatDate, cn } from '@/lib/utils'
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
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
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

  const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'vip', label: 'VIP' },
    { key: 'blacklisted', label: 'Blacklisted' },
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Database</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{customers.length} registered · {vipCount} VIP</p>
        </div>
        <Button onClick={() => { setEditingCustomer(null); setShowModal(true) }} icon={<Plus size={16} />}>
          Add Customer
        </Button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, sub: `${vipCount} VIP`, icon: <Users size={16} />, iconBg: 'bg-blue-100', iconColor: 'text-blue-700', valueColor: 'text-gray-900', accentBar: 'bg-blue-500' },
          { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, sub: 'lifetime', icon: <DollarSign size={16} />, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', valueColor: 'text-emerald-700', accentBar: 'bg-emerald-500' },
          { label: 'Avg. Per Customer', value: `₱${Math.round(totalRevenue / customers.length).toLocaleString()}`, sub: 'lifetime spend', icon: <Star size={16} />, iconBg: 'bg-amber-100', iconColor: 'text-amber-700', valueColor: 'text-amber-700', accentBar: 'bg-amber-500' },
        ].map((s, i) => (
          <div key={i} className="relative p-4 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center gap-3">
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.accentBar}`} />
            <div className={`p-2.5 rounded-xl ${s.iconBg} ${s.iconColor} shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className={`text-lg font-bold ${s.valueColor}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
            className="w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 py-2.5 pl-10 pr-4 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {STATUS_TABS.map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                statusFilter === s.key ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No customers found" description="Add your first customer to get started." action={() => setShowModal(true)} actionLabel="Add Customer" />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Customer', 'Contact', 'ID', 'Total Bookings', 'Total Spent', 'Last Booking Date', 'Last Car Rented', 'Member Since', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((customer, i) => {
                  const stats = getCustomerStats(customer)
                  return (
                    <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.name} size="sm" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{customer.name}</p>
                            {customer.status === 'vip' && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">VIP</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-800 font-semibold">{customer.phone}</p>
                        {customer.email && <p className="text-xs text-gray-500 font-medium">{customer.email}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-600 font-semibold">{customer.id_type}</p>
                        <p className="text-xs font-mono text-gray-500">{customer.id_number}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-gray-900">{stats.total_bookings}</span>
                          <span className="text-xs text-gray-400 font-medium">bookings</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-emerald-700">₱{stats.total_spent.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 font-semibold">{stats.last_booking_date ? formatDate(stats.last_booking_date) : '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 font-medium whitespace-nowrap">{stats.last_car || '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-600 font-semibold">{formatDate(customer.joined)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge status={customer.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewCustomer(customer)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"><Eye size={14} /></button>
                          <button onClick={() => { setEditingCustomer(customer); setShowModal(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(customer.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={14} /></button>
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
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Avatar name={viewCustomer.name} size="xl" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{viewCustomer.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{viewCustomer.email}</p>
                  <p className="text-sm text-gray-500 font-medium">{viewCustomer.phone}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-500 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-emerald-700">₱{stats.total_spent.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 font-medium">{stats.total_bookings} bookings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Bookings', value: stats.total_bookings },
                  { label: 'Total Spent', value: `₱${stats.total_spent.toLocaleString()}` },
                  { label: 'Last Booking', value: stats.last_booking_date ? formatDate(stats.last_booking_date) : '—' },
                  { label: 'Last Car', value: stats.last_car || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Booking History</p>
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Vehicle</th>
                        <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {viewCustomer.bookings.map((b, i) => (
                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-gray-700 font-medium">{formatDate(b.date)}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-900 font-semibold">{b.car}</td>
                          <td className="px-4 py-2.5 text-sm text-emerald-700 text-right font-bold">₱{b.amount.toLocaleString()}</td>
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
        <p className="text-sm text-gray-600 font-medium">This will delete the customer profile. Booking history will be preserved.</p>
      </Modal>
    </div>
  )
}
