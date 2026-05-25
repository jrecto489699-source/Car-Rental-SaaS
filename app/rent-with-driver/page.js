'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Car, User, Phone, Mail, MapPin, Calendar, FileText,
  Globe, ChevronRight, ArrowRight, CheckCircle, Shield,
  Fuel, Users, AlertCircle, Loader2, Info, Clock, Banknote, BadgeCheck
} from 'lucide-react'
import RMLogo from '@/components/RMLogo'
import toast from 'react-hot-toast'

const COUNTRIES = [
  'Philippines', 'United States', 'United Kingdom', 'Australia', 'Canada',
  'Japan', 'South Korea', 'China', 'Singapore', 'Hong Kong', 'Taiwan',
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland',
  'UAE', 'Saudi Arabia', 'India', 'Malaysia', 'Indonesia', 'Thailand',
  'Vietnam', 'New Zealand', 'Brazil', 'Mexico', 'Argentina',
  'Russia', 'Turkey', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Belgium', 'Austria', 'Portugal', 'Greece', 'Poland', 'Czech Republic',
  'Other',
].sort((a, b) => a === 'Philippines' ? -1 : b === 'Philippines' ? 1 : a.localeCompare(b))

const DEMO_VEHICLES = [
  { id: 'demo-1', make: 'Toyota', model: 'Fortuner', year: 2024, type: 'SUV', passengers: 6, price_per_day: 3500, fuel: 'Diesel', transmission: 'Automatic', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', notes: '4x4, leather seats, perfect for groups and tours' },
  { id: 'demo-2', make: 'Toyota', model: 'Camry', year: 2023, type: 'Sedan', passengers: 3, price_per_day: 4000, fuel: 'Hybrid', transmission: 'Automatic', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', notes: 'Executive sedan, fuel-efficient, great for business trips' },
  { id: 'demo-3', make: 'Toyota', model: 'HiAce', year: 2024, type: 'Van', passengers: 12, price_per_day: 4500, fuel: 'Diesel', transmission: 'Manual', image_url: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=800&q=80', notes: 'Luxury van, perfect for large groups and airport transfers' },
  { id: 'demo-4', make: 'Toyota', model: 'Alphard', year: 2023, type: 'Luxury MPV', passengers: 6, price_per_day: 7500, fuel: 'Hybrid', transmission: 'Automatic', image_url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80', notes: 'Premium VIP MPV, executive reclining captain seats' },
]

const INCLUSIONS = [
  { icon: User, text: 'Professional driver', color: '#f97316' },
  { icon: Fuel, text: 'Fuel included', color: '#10b981' },
  { icon: MapPin, text: 'Toll fees covered', color: '#f59e0b' },
  { icon: Car, text: 'Parking fees included', color: '#8b5cf6' },
  { icon: Shield, text: 'Comprehensive insurance', color: '#3b82f6' },
  { icon: CheckCircle, text: 'Government taxes', color: '#ec4899' },
]

const inputStyle = (hasError) => ({
  width: '100%',
  background: 'white',
  border: `2px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
  borderRadius: 12,
  color: '#111827',
  padding: '10px 14px',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
})

function VehicleCard({ vehicle, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect(vehicle)}
      className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: selected ? '2px solid #f97316' : '2px solid #e5e7eb',
        background: selected ? '#fff7ed' : 'white',
        boxShadow: selected ? '0 8px 32px rgba(249,115,22,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div className="relative h-44 overflow-hidden" style={{ background: '#f3f4f6' }}>
        {vehicle.image_url
          ? <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Car size={40} style={{ color: '#d1d5db' }} /></div>
        }
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.12)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>
              <CheckCircle size={20} className="text-white" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(17,24,39,0.8)', color: 'white' }}>{vehicle.type}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.92)', color: '#374151' }}>
            <Users size={11} /> {vehicle.passengers || 4} pax
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold mb-1 transition-colors" style={{ color: selected ? '#ea580c' : '#111827' }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.notes && (
          <p className="text-xs mb-3 leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>{vehicle.notes}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black" style={{ color: '#111827' }}>₱{Number(vehicle.price_per_day).toLocaleString()}</span>
            <span className="text-xs ml-1" style={{ color: '#9ca3af' }}>/day</span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Driver included</span>
        </div>
      </div>
    </motion.div>
  )
}

function SectionCard({ step, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
          {step}
        </div>
        <h2 className="text-lg font-bold" style={{ color: '#111827' }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

function Field({ label, icon: Icon, required, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7280' }}>
        <Icon size={12} style={{ color: '#f97316' }} />
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

function BookingFormContent() {
  const router = useRouter()

  const [vehicles, setVehicles] = useState([])
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

  const [form, setForm] = useState({
    pickup_location: '', dropoff_location: '',
    start_date: '', start_time: '08:00',
    end_date: '', end_time: '18:00',
    itinerary: '', customer_name: '',
    customer_email: '', customer_phone: '',
    country: 'Philippines', security_answer: '',
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(d => { const real = d.vehicles || []; setVehicles(real.length > 0 ? real : DEMO_VEHICLES) })
      .catch(() => setVehicles(DEMO_VEHICLES))
      .finally(() => setVehiclesLoading(false))
  }, [])

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(e2 => ({ ...e2, [key]: '' }))
  }

  const focusStyle = (field) => focusedField === field ? { borderColor: '#f97316', boxShadow: '0 0 0 3px rgba(249,115,22,0.1)' } : {}

  const totalDays = form.start_date && form.end_date && form.end_date >= form.start_date
    ? Math.max(1, Math.ceil((new Date(form.end_date) - new Date(form.start_date)) / (1000 * 60 * 60 * 24)) + 1) : 0
  const totalAmount = totalDays * (selectedVehicle ? Number(selectedVehicle.price_per_day) : 0)

  const validate = () => {
    const errs = {}
    if (!selectedVehicle) errs.vehicle = 'Please select a vehicle'
    if (!form.pickup_location.trim()) errs.pickup_location = 'Pick-up location is required'
    if (!form.dropoff_location.trim()) errs.dropoff_location = 'Drop-off destination is required'
    if (!form.start_date) errs.start_date = 'Required'
    if (!form.end_date) errs.end_date = 'Required'
    if (form.end_date && form.start_date && form.end_date < form.start_date) errs.end_date = 'End date must be on or after start date'
    if (!form.customer_name.trim()) errs.customer_name = 'Full name is required'
    if (!form.customer_phone.trim()) errs.customer_phone = 'Phone number is required'
    if (form.customer_email && !/\S+@\S+\.\S+/.test(form.customer_email)) errs.customer_email = 'Invalid email'
    if (!form.country) errs.country = 'Country is required'
    if (form.security_answer.trim() !== '6') errs.security_answer = 'Incorrect answer. Hint: 5 + 1 = ?'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) { toast.error('Please fill in all required fields'); return }
    if (selectedVehicle.id.startsWith('demo-')) {
      toast.error('This is a sample vehicle. Add real vehicles in your admin dashboard.')
      return
    }
    setSubmitting(true)
    try {
      const driverNotes = [
        '[WITH DRIVER BOOKING]',
        `Start Time: ${form.start_time}`, `End Time: ${form.end_time}`,
        `Itinerary: ${form.itinerary || 'Not specified'}`,
        `Country of Origin: ${form.country}`,
        `Driver overnight allowance: ₱1,500/night if applicable`,
      ].join('\n')

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: selectedVehicle.id,
          start_date: form.start_date, end_date: form.end_date,
          customer_name: form.customer_name, customer_email: form.customer_email,
          customer_phone: form.customer_phone, customer_address: form.country,
          pickup_location: form.pickup_location, dropoff_location: form.dropoff_location,
          notes: driverNotes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking')
      toast.success('Booking submitted!')
      router.push(`/booking/confirmation/${data.booking.booking_ref}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <RMLogo size={48} />
            </Link>
            <ChevronRight size={14} style={{ color: '#d1d5db' }} />
            <span className="text-sm font-semibold" style={{ color: '#374151' }}>Rent with Driver</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cars" className="text-sm font-medium transition-colors hover:text-orange-500" style={{ color: '#6b7280' }}>Self Drive</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 24px 48px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80) center/cover no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(15,23,42,0.78),rgba(30,27,75,0.68))' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 100%,rgba(249,115,22,0.22),transparent)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'rgba(249,115,22,0.18)', border: '1px solid rgba(249,115,22,0.4)', color: '#fb923c' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f97316' }} />
            Professional driver included in all packages
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: 'white' }}>
            Rent a Car{' '}
            <span style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              with Driver
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Sit back and relax while our professional driver takes you anywhere.
            Airport transfers, city tours, provincial trips — all covered.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-flex flex-wrap justify-center gap-2">
            {INCLUSIONS.map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }}>
                <Icon size={13} style={{ color }} />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — steps */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Vehicle */}
            <SectionCard step="1" title="Choose Your Vehicle">
              {errors.vehicle && (
                <div className="flex items-center gap-2 text-xs mb-4 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  <AlertCircle size={14} /> {errors.vehicle}
                </div>
              )}
              {vehiclesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ border: '2px solid #f3f4f6' }}>
                      <div className="h-44" style={{ background: '#f3f4f6' }} />
                      <div className="p-4 space-y-2">
                        <div className="h-4 rounded-lg w-3/4" style={{ background: '#f3f4f6' }} />
                        <div className="h-3 rounded-lg" style={{ background: '#f3f4f6' }} />
                        <div className="h-5 rounded-lg w-1/2" style={{ background: '#f3f4f6' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map(v => (
                    <VehicleCard key={v.id} vehicle={v} selected={selectedVehicle?.id === v.id} onSelect={setSelectedVehicle} />
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Step 2: Travel details */}
            <SectionCard step="2" title="Travel Details">
              <div className="space-y-4">
                <Field label="Pick-Up Location" icon={MapPin} required error={errors.pickup_location}>
                  <input type="text" value={form.pickup_location} onChange={set('pickup_location')}
                    placeholder="e.g. NAIA Terminal 3, Pasay City"
                    onFocus={() => setFocusedField('pickup_location')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.pickup_location), ...focusStyle('pickup_location') }} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date" icon={Calendar} required error={errors.start_date}>
                    <input type="date" value={form.start_date} min={today}
                      onChange={e => { set('start_date')(e); if (form.end_date && form.end_date < e.target.value) setForm(f => ({ ...f, end_date: '' })) }}
                      onFocus={() => setFocusedField('start_date')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(errors.start_date), ...focusStyle('start_date') }} />
                  </Field>
                  <Field label="Start Time" icon={Clock}>
                    <input type="time" value={form.start_time} onChange={set('start_time')}
                      onFocus={() => setFocusedField('start_time')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(false), ...focusStyle('start_time') }} />
                  </Field>
                </div>

                <Field label="Drop-off / Farthest Destination" icon={MapPin} required error={errors.dropoff_location}>
                  <input type="text" value={form.dropoff_location} onChange={set('dropoff_location')}
                    placeholder="e.g. Tagaytay City, Cavite or Makati CBD"
                    onFocus={() => setFocusedField('dropoff_location')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.dropoff_location), ...focusStyle('dropoff_location') }} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="End Date" icon={Calendar} required error={errors.end_date}>
                    <input type="date" value={form.end_date} min={form.start_date || today} onChange={set('end_date')}
                      onFocus={() => setFocusedField('end_date')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(errors.end_date), ...focusStyle('end_date') }} />
                  </Field>
                  <Field label="End Time" icon={Clock}>
                    <input type="time" value={form.end_time} onChange={set('end_time')}
                      onFocus={() => setFocusedField('end_time')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(false), ...focusStyle('end_time') }} />
                  </Field>
                </div>

                <Field label="Itinerary / Trip Details" icon={FileText}>
                  <textarea value={form.itinerary} onChange={set('itinerary')} rows={4}
                    placeholder="Describe your trip plan, stops, or special requirements&#10;e.g. Day 1: Arrive NAIA → Hotel Makati. Day 2: City tour → Mall of Asia."
                    onFocus={() => setFocusedField('itinerary')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(false), ...focusStyle('itinerary'), resize: 'none' }} />
                </Field>

                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <Info size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs" style={{ color: '#92400e' }}>
                    <span className="font-semibold" style={{ color: '#78350f' }}>Driver overnight allowance:</span> ₱1,500 per night will be added for trips requiring the driver to stay overnight.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Step 3: Client information */}
            <SectionCard step="3" title="Client Information">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" icon={User} required error={errors.customer_name}>
                    <input type="text" value={form.customer_name} onChange={set('customer_name')} placeholder="Juan dela Cruz"
                      onFocus={() => setFocusedField('customer_name')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(errors.customer_name), ...focusStyle('customer_name') }} />
                  </Field>
                  <Field label="Phone Number" icon={Phone} required error={errors.customer_phone}>
                    <input type="tel" value={form.customer_phone} onChange={set('customer_phone')} placeholder="09XX XXX XXXX"
                      onFocus={() => setFocusedField('customer_phone')} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle(errors.customer_phone), ...focusStyle('customer_phone') }} />
                  </Field>
                </div>

                <Field label="Email Address" icon={Mail} error={errors.customer_email}>
                  <input type="email" value={form.customer_email} onChange={set('customer_email')} placeholder="juan@email.com"
                    onFocus={() => setFocusedField('customer_email')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.customer_email), ...focusStyle('customer_email') }} />
                </Field>

                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#f8fafc', border: '2px dashed #e5e7eb' }}>
                  <BadgeCheck size={20} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#374151' }}>Accepted IDs: Driver's License, Passport, National ID, Voter's ID</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Please bring your valid government-issued ID on the day of rental.</p>
                  </div>
                </div>

                <Field label="Country" icon={Globe} required error={errors.country}>
                  <select value={form.country} onChange={set('country')}
                    onFocus={() => setFocusedField('country')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.country), ...focusStyle('country') }}>
                    <option value="">Select your country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Security Question: What is 5 + 1?" icon={CheckCircle} required error={errors.security_answer}>
                  <input type="text" value={form.security_answer} onChange={set('security_answer')} placeholder="Type your answer" maxLength={2}
                    onFocus={() => setFocusedField('security_answer')} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.security_answer), ...focusStyle('security_answer') }} />
                </Field>
              </div>
            </SectionCard>
          </div>

          {/* Right — summary */}
          <div className="lg:col-span-1">
            <div style={{ position: 'sticky', top: 80 }} className="space-y-4">

              {/* Booking summary */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>

                {/* Header */}
                <div className="p-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Booking Summary</h2>
                </div>

                <div className="p-5 space-y-4">
                  {/* Selected vehicle */}
                  {selectedVehicle ? (
                    <div className="flex gap-3 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: '#f3f4f6' }}>
                        {selectedVehicle.image_url
                          ? <img src={selectedVehicle.image_url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Car size={20} style={{ color: '#d1d5db' }} /></div>
                        }
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#111827' }}>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{selectedVehicle.type} · With Driver</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#f97316' }}>₱{Number(selectedVehicle.price_per_day).toLocaleString()}/day</p>
                      </div>
                    </div>
                  ) : (
                    <div className="pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: '#f8fafc', color: '#9ca3af' }}>
                        <Car size={14} /> No vehicle selected yet
                      </div>
                    </div>
                  )}

                  {/* Trip details */}
                  {form.pickup_location && (
                    <div className="text-xs space-y-2 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <div className="flex gap-2">
                        <MapPin size={12} style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }} />
                        <div><p style={{ color: '#9ca3af' }}>From</p><p className="font-medium" style={{ color: '#111827' }}>{form.pickup_location}</p></div>
                      </div>
                      {form.dropoff_location && (
                        <div className="flex gap-2">
                          <MapPin size={12} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                          <div><p style={{ color: '#9ca3af' }}>To</p><p className="font-medium" style={{ color: '#111827' }}>{form.dropoff_location}</p></div>
                        </div>
                      )}
                      {form.start_date && (
                        <div className="flex gap-2">
                          <Calendar size={12} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                          <div><p style={{ color: '#9ca3af' }}>Dates</p>
                            <p className="font-medium" style={{ color: '#111827' }}>
                              {new Date(form.start_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                              {form.end_date && form.end_date !== form.start_date && <> — {new Date(form.end_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</>}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  {selectedVehicle && totalDays > 0 && (
                    <div className="space-y-2 text-sm pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <div className="flex justify-between">
                        <span style={{ color: '#6b7280' }}>₱{Number(selectedVehicle.price_per_day).toLocaleString()} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                        <span style={{ color: '#111827', fontWeight: 600 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#6b7280' }}>Fuel & toll</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Included</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#111827' }}>Estimated Total</span>
                        <span style={{ color: '#f97316', fontSize: 18, fontWeight: 900 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Inclusions */}
                  <div className="space-y-2 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {INCLUSIONS.map(({ icon: Icon, text, color }) => (
                      <div key={text} className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                        <Icon size={13} style={{ color, flexShrink: 0 }} /> {text}
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}>
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Submit Booking Request <ArrowRight size={16} /></>}
                  </button>

                  <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
                    We'll contact you within 1–2 hours to confirm availability.
                  </p>
                </div>
              </motion.div>

              {/* Cancellation policy */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-5"
                style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: '#111827' }}>
                  <Shield size={13} style={{ color: '#f97316' }} /> Cancellation Policy
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: '7+ days before', value: 'Full refund', color: '#16a34a', bg: '#f0fdf4' },
                    { label: '3–6 days before', value: '50% refund', color: '#d97706', bg: '#fffbeb' },
                    { label: 'Less than 3 days', value: 'No refund', color: '#dc2626', bg: '#fef2f2' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center p-2 rounded-lg" style={{ background: r.bg }}>
                      <span style={{ color: '#6b7280' }}>{r.label}</span>
                      <span className="font-semibold" style={{ color: r.color }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RentWithDriverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <BookingFormContent />
    </Suspense>
  )
}
