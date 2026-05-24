'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_STATUSES } from '@/lib/constants'

export default function VehicleForm({ vehicle, onSave, onCancel }) {
  const [form, setForm] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    plate: vehicle?.plate || '',
    type: vehicle?.type || 'SUV',
    color: vehicle?.color || '',
    fuel: vehicle?.fuel || 'Gasoline',
    transmission: vehicle?.transmission || 'Automatic',
    price_per_day: vehicle?.price_per_day || '',
    mileage: vehicle?.mileage || 0,
    status: vehicle?.status || 'available',
    notes: vehicle?.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.make.trim()) errs.make = 'Required'
    if (!form.model.trim()) errs.model = 'Required'
    if (!form.plate.trim()) errs.plate = 'Required'
    if (!form.price_per_day) errs.price_per_day = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onSave(form)
    setLoading(false)
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Make / Brand"
          value={form.make}
          onChange={update('make')}
          placeholder="e.g. Toyota"
          error={errors.make}
          required
        />
        <Input
          label="Model"
          value={form.model}
          onChange={update('model')}
          placeholder="e.g. Fortuner"
          error={errors.model}
          required
        />
        <Input
          label="Year"
          type="number"
          value={form.year}
          onChange={update('year')}
          placeholder="2023"
          min={1990}
          max={new Date().getFullYear() + 1}
        />
        <Input
          label="Plate Number"
          value={form.plate}
          onChange={update('plate')}
          placeholder="e.g. ABC 1234"
          error={errors.plate}
          required
        />
        <Select
          label="Vehicle Type"
          value={form.type}
          onChange={update('type')}
          options={VEHICLE_TYPES}
        />
        <Input
          label="Color"
          value={form.color}
          onChange={update('color')}
          placeholder="e.g. Pearl White"
        />
        <Select
          label="Fuel Type"
          value={form.fuel}
          onChange={update('fuel')}
          options={FUEL_TYPES}
        />
        <Select
          label="Transmission"
          value={form.transmission}
          onChange={update('transmission')}
          options={TRANSMISSION_TYPES}
        />
        <Input
          label="Price Per Day (₱)"
          type="number"
          value={form.price_per_day}
          onChange={update('price_per_day')}
          placeholder="3500"
          error={errors.price_per_day}
          required
        />
        <Input
          label="Current Mileage (km)"
          type="number"
          value={form.mileage}
          onChange={update('mileage')}
          placeholder="0"
        />
        <Select
          label="Status"
          value={form.status}
          onChange={update('status')}
          options={VEHICLE_STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          placeholder={null}
        />
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-white/8">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </div>
    </form>
  )
}
