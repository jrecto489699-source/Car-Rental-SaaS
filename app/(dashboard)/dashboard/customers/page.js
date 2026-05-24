'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Users, Phone, Mail, MapPin,
  Edit2, Trash2, Eye, Calendar, Car
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatDate, formatDateRelative } from '@/lib/utils'
import { CUSTOMER_ID_TYPES } from '@/lib/constants'
import toast from 'react-hot-toast'

const DEMO_CUSTOMERS = [
  { id: 1, name: 'Juan dela Cruz', email: 'juan@email.com', phone: '09171234567', address: 'Makati City, Metro Manila', id_type: "Driver's License", id_number: 'A01-23-456789', total_bookings: 5, last_booking: '2025-05-23', status: 'active', joined: '2024-01-15' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '09182345678', address: 'Quezon City, Metro Manila', id_type: 'Passport', id_number: 'P1234567A', total_bookings: 3, last_booking: '2025-05-22', status: 'active', joined: '2024-03-20' },
  { id: 3, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09193456789', address: 'Cebu City, Cebu', id_type: 'National ID', id_number: '1234-5678-9012', total_bookings: 8, last_booking: '2025-05-20', status: 'active', joined: '2023-11-10' },
  { id: 4, name: 'Ana Garcia', email: 'ana@email.com', phone: '09204567890', address: 'Davao City, Davao del Sur', id_type: "Driver's License", id_number: 'A02-45-678901', total_bookings: 2, last_booking: '2025-05-19', status: 'active', joined: '2025-01-05' },
  { id: 5, name: 'Carlo Lim', email: 'carlo@email.com', phone: '09215678901', address: 'Pasig City, Metro Manila', id_type: 'SSS ID', id_number: '03-1234567-8', total_bookings: 1, last_booking: '2025-05-15', status: 'active', joined: '2025-04-12' },
  { id: 6, name: 'Lisa Tan', email: 'lisa@email.com', phone: '09226789012', address: 'Taguig City, Metro Manila', id_type: 'Passport', id_number: 'P7654321B', total_bookings: 12, last_booking: '2025-05-18', status: 'vip', joined: '2023-06-01' },
]

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
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [viewCustomer, setViewCustomer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = customers.filter(c =>
    !search || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...data } : c))
      toast.success('Customer updated!')
    } else {
      setCustomers(prev => [...prev, { ...data, id: Date.now(), total_bookings: 0, status: 'active', joined: new Date().toISOString().split('T')[0] }])
      toast.success('Customer added!')
    }
    setShowModal(false)
    setEditingCustomer(null)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-slate-400 mt-1">{customers.length} registered customers</p>
        </div>
        <Button onClick={() => { setEditingCustomer(null); setShowModal(true) }} icon={<Plus size={16} />}>
          Add Customer
        </Button>
      </motion.div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500/40"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No customers found" description="Add your first customer to get started." action={() => setShowModal(true)} actionLabel="Add Customer" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group p-5 rounded-2xl border border-white/8 bg-slate-900/60 hover:border-white/15 transition-all duration-300 hover:-translate-y-px"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={customer.name} size="md" />
                  <div>
                    <p className="font-semibold text-white text-sm">{customer.name}</p>
                    {customer.status === 'vip' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">VIP</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setViewCustomer(customer)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => { setEditingCustomer(customer); setShowModal(true) }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirm(customer.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone size={12} className="shrink-0" />
                  {customer.phone}
                </div>
                {customer.address && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Car size={12} />
                  <span>{customer.total_bookings} bookings</span>
                </div>
                <div className="text-xs text-slate-500">
                  Since {formatDate(customer.joined, 'MMM yyyy')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCustomer(null) }} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} size="md">
        <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={() => { setShowModal(false); setEditingCustomer(null) }} />
      </Modal>

      {viewCustomer && (
        <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details" size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40">
              <Avatar name={viewCustomer.name} size="xl" />
              <div>
                <h3 className="text-lg font-bold text-white">{viewCustomer.name}</h3>
                <p className="text-sm text-slate-400">{viewCustomer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Phone', value: viewCustomer.phone },
                { label: 'Address', value: viewCustomer.address },
                { label: 'ID Type', value: viewCustomer.id_type },
                { label: 'ID Number', value: viewCustomer.id_number },
                { label: 'Total Bookings', value: viewCustomer.total_bookings },
                { label: 'Last Booking', value: formatDate(viewCustomer.last_booking) },
                { label: 'Member Since', value: formatDate(viewCustomer.joined, 'MMMM dd, yyyy') },
                { label: 'Status', value: <Badge status={viewCustomer.status} label={viewCustomer.status === 'vip' ? 'VIP' : 'Active'} /> },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <div className="text-sm text-slate-200">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Customer" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { setCustomers(prev => prev.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null); toast.success('Customer deleted') }}>Delete</Button>
        </>}>
        <p className="text-sm text-slate-400">This will delete the customer profile. Booking history will be preserved.</p>
      </Modal>
    </div>
  )
}
