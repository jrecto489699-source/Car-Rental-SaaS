'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { calcRentalDays } from '@/lib/utils'
import { BOOKING_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS, DEMO_VEHICLES } from '@/lib/constants'

export default function BookingForm({ booking, onSave, onCancel }) {
  const [form, setForm] = useState({
    customer: booking?.customer || '',
    customer_phone: booking?.customer_phone || '',
    vehicle: booking?.vehicle || '',
    plate: booking?.plate || '',
    start_date: booking?.start_date || '',
    end_date: booking?.end_date || '',
    price_per_day: booking?.price_per_day || '',
    payment_status: booking?.payment_status || 'unpaid',
    payment_method: booking?.payment_method || 'Cash',
    status: booking?.status || 'pending',
    notes: booking?.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const days = form.start_date && form.end_date ? calcRentalDays(form.start_date, form.end_date) : 0
  const total = days * (Number(form.price_per_day) || 0)

  const handleVehicleSelect = (e) => {
    const vehicle = DEMO_VEHICLES.find(v => v.plate === e.target.value)
    if (vehicle) {
      setForm(f => ({
        ...f,
        vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        plate: vehicle.plate,
        price_per_day: vehicle.price_per_day,
      }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.customer.trim()) errs.customer = 'Required'
    if (!form.vehicle.trim()) errs.vehicle = 'Required'
    if (!form.start_date) errs.start_date = 'Required'
    if (!form.end_date) errs.end_date = 'Required'
    if (!form.price_per_day) errs.price_per_day = 'Required'
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
      <div className="space-y-4">
        {/* Customer info */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Customer</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer Name"
              value={form.customer}
              onChange={update('customer')}
              placeholder="Full name"
              error={errors.customer}
              required
            />
            <Input
              label="Phone Number"
              value={form.customer_phone}
              onChange={update('customer_phone')}
              placeholder="09XXXXXXXXX"
            />
          </div>
        </div>

        {/* Vehicle */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Vehicle</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Vehicle</label>
              <select
                onChange={handleVehicleSelect}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white py-2.5 px-4 focus:outline-none focus:border-blue-500/40 appearance-none"
              >
                <option value="">Choose a vehicle...</option>
                {DEMO_VEHICLES.filter(v => v.status === 'available').map(v => (
                  <option key={v.id} value={v.plate} className="bg-slate-900">
                    {v.make} {v.model} {v.year} — {v.plate}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Daily Rate (₱)"
              type="number"
              value={form.price_per_day}
              onChange={update('price_per_day')}
              placeholder="3500"
              error={errors.price_per_day}
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Rental Period</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <Input
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={update('start_date')}
              error={errors.start_date}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={form.end_date}
              onChange={update('end_date')}
              error={errors.end_date}
              required
            />
          </div>
          {days > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/8 border border-blue-500/20">
              <span className="text-sm text-slate-300">{days} day{days !== 1 ? 's' : ''} rental</span>
              <span className="text-sm font-bold text-white">Total: ₱{total.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Payment Status"
              value={form.payment_status}
              onChange={update('payment_status')}
              options={PAYMENT_STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              placeholder={null}
            />
            <Select
              label="Payment Method"
              value={form.payment_method}
              onChange={update('payment_method')}
              options={PAYMENT_METHODS}
              placeholder={null}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-white/8">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">
          {booking ? 'Update Booking' : 'Create Booking'}
        </Button>
      </div>
    </form>
  )
}
