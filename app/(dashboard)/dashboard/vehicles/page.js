'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Grid, List, Car, Edit2, Trash2,
  AlertTriangle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import VehicleForm from '@/components/dashboard/VehicleForm'
import { formatDate, cn } from '@/lib/utils'
import { DEMO_VEHICLES, VEHICLE_TYPES } from '@/lib/constants'
import toast from 'react-hot-toast'

const DEMO_FLEET = DEMO_VEHICLES.map((v, i) => ({
  ...v,
  registration_expiry: ['2025-08-15', '2025-12-01', '2025-06-30', '2026-01-20', '2025-07-10', '2025-11-05', '2026-03-22', '2025-09-14'][i] || null,
  insurance_expiry: ['2025-07-01', '2026-02-14', '2025-06-10', '2025-10-30', '2026-01-08', '2025-08-25', '2026-05-17', '2025-07-22'][i] || null,
  last_maintenance: ['2025-04-10', '2025-03-25', '2025-05-01', '2025-02-14', '2025-04-28', '2025-01-30', '2025-05-10', '2025-03-08'][i] || null,
}))

function deadlineStatus(dateStr) {
  if (!dateStr) return { label: 'N/A', color: 'text-gray-500', bg: 'bg-gray-100 border-gray-200', urgent: false }
  const date = new Date(dateStr)
  const today = new Date()
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: 'Expired', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', urgent: true }
  if (diffDays <= 30) return { label: `${diffDays}d left`, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', urgent: true }
  if (diffDays <= 90) return { label: `${diffDays}d left`, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', urgent: false }
  return { label: formatDate(dateStr), color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', urgent: false }
}

function DeadlineBadge({ dateStr, label }) {
  const status = deadlineStatus(dateStr)
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold', status.bg, status.color)}>
        {status.urgent && <AlertTriangle size={10} />}
        {dateStr ? status.label : 'N/A'}
      </span>
    </div>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(DEMO_FLEET)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = vehicles.filter(v => {
    const matchSearch = !search || `${v.make} ${v.model} ${v.plate}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    const matchType = typeFilter === 'all' || v.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const alertCount = vehicles.filter(v => {
    const reg = deadlineStatus(v.registration_expiry)
    const ins = deadlineStatus(v.insurance_expiry)
    return reg.urgent || ins.urgent
  }).length

  const handleSave = async (data) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v))
      toast.success('Vehicle updated!')
    } else {
      const newVehicle = { ...data, id: Date.now(), status: 'available' }
      setVehicles(prev => [...prev, newVehicle])
      toast.success('Vehicle added!')
    }
    setShowModal(false)
    setEditingVehicle(null)
  }

  const handleDelete = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
    setDeleteConfirm(null)
    toast.success('Vehicle deleted')
  }

  const openEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setShowModal(true)
  }

  const counts = {
    all: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    rented: vehicles.filter(v => v.status === 'rented').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {vehicles.length} vehicles total · {counts.available} available
            {alertCount > 0 && <span className="ml-2 text-amber-700 font-bold">· {alertCount} deadline alert{alertCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <Button onClick={() => { setEditingVehicle(null); setShowModal(true) }} icon={<Plus size={16} />}>
          Add Vehicle
        </Button>
      </motion.div>

      {/* Alert banner */}
      {alertCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-semibold">
            {alertCount} vehicle{alertCount > 1 ? 's have' : ' has'} expiring registration or insurance
            {' '}— please renew soon to avoid coverage gaps.
          </p>
        </motion.div>
      )}

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All' },
          { key: 'available', label: 'Available' },
          { key: 'rented', label: 'Rented' },
          { key: 'maintenance', label: 'Maintenance' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
              statusFilter === tab.key
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 hover:bg-gray-50'
            )}
          >
            {tab.label}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold', statusFilter === tab.key ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600')}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by make, model, or plate..."
            className="w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 py-2.5 pl-10 pr-4 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm font-medium"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-semibold py-2.5 px-3 focus:outline-none focus:border-orange-400 transition-all appearance-none shadow-sm"
        >
          <option value="all">All Types</option>
          {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 bg-white shadow-sm">
          <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:text-gray-700')}>
            <Grid size={16} />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:text-gray-700')}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><TableSkeleton rows={5} cols={8} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Car size={28} />} title="No vehicles found" description="Add your first vehicle to start managing your fleet." action={() => setShowModal(true)} actionLabel="Add Vehicle" />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} onEdit={() => openEdit(vehicle)} onDelete={() => setDeleteConfirm(vehicle.id)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Vehicle', 'Plate', 'Type', 'Price/Day', 'Mileage', 'Registration Expiry', 'Insurance Expiry', 'Last Maintenance', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((vehicle) => {
                  const regStatus = deadlineStatus(vehicle.registration_expiry)
                  const insStatus = deadlineStatus(vehicle.insurance_expiry)
                  return (
                    <tr key={vehicle.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <Car size={16} className="text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-gray-500 font-medium">{vehicle.year} · {vehicle.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-gray-700 font-semibold">{vehicle.plate}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700 font-medium">{vehicle.type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">₱{vehicle.price_per_day?.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 font-semibold">{vehicle.mileage?.toLocaleString()} km</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold', regStatus.bg, regStatus.color)}>
                          {regStatus.urgent && <AlertTriangle size={10} />}
                          {vehicle.registration_expiry ? regStatus.label : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold', insStatus.bg, insStatus.color)}>
                          {insStatus.urgent && <AlertTriangle size={10} />}
                          {vehicle.insurance_expiry ? insStatus.label : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 font-semibold">{vehicle.last_maintenance ? formatDate(vehicle.last_maintenance) : 'N/A'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Badge status={vehicle.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(vehicle)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(vehicle.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingVehicle(null) }} title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'} description={editingVehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'} size="lg">
        <VehicleForm vehicle={editingVehicle} onSave={handleSave} onCancel={() => { setShowModal(false); setEditingVehicle(null) }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Vehicle" description="This action cannot be undone." size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button><Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete Vehicle</Button></>}>
        <p className="text-sm text-gray-600 font-medium">All booking history associated with this vehicle will remain in the system.</p>
      </Modal>
    </div>
  )
}

function VehicleCard({ vehicle, index, onEdit, onDelete }) {
  const regStatus = deadlineStatus(vehicle.registration_expiry)
  const insStatus = deadlineStatus(vehicle.insurance_expiry)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="group p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-px"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Car size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</p>
            <p className="text-xs text-gray-500 font-medium">{vehicle.year} · {vehicle.type}</p>
          </div>
        </div>
        <Badge status={vehicle.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
          <p className="text-xs text-gray-500 font-medium mb-0.5">Plate</p>
          <p className="text-sm font-mono font-bold text-gray-900">{vehicle.plate}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
          <p className="text-xs text-gray-500 font-medium mb-0.5">Daily Rate</p>
          <p className="text-sm font-bold text-gray-900">₱{vehicle.price_per_day?.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <DeadlineBadge dateStr={vehicle.registration_expiry} label="Registration" />
        <DeadlineBadge dateStr={vehicle.insurance_expiry} label="Insurance" />
      </div>

      <div className="flex items-center justify-between mb-4 text-xs text-gray-500 font-medium">
        <span>Last Maint: {vehicle.last_maintenance ? formatDate(vehicle.last_maintenance) : 'N/A'}</span>
        <span>{vehicle.mileage?.toLocaleString()} km</span>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 font-semibold hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all">
          <Edit2 size={13} /> Edit
        </button>
        <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-200 text-xs text-rose-600 font-semibold hover:bg-rose-50 transition-all">
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </motion.div>
  )
}
