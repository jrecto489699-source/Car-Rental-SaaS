'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Car, Calendar, User, Phone, Mail, MapPin, FileText, CreditCard, ArrowLeft, ArrowRight, CheckCircle, Zap as ZapIcon, ChevronRight, Loader2, AlertCircle, Banknote, Clock } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const ID_TYPES = ["Driver's License", 'Passport', 'National ID', 'SSS ID', 'PhilHealth ID', "Voter's ID", 'PRC ID', 'UMID']

function inputStyle(error) {
  return {
    width: '100%', background: 'white', border: `2px solid ${error ? '#fca5a5' : '#e5e7eb'}`,
    borderRadius: 12, fontSize: 14, color: '#111827', padding: '12px 16px',
    outline: 'none', transition: 'all 0.2s',
  }
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff7ed, #fed7aa)' }}>
          <span style={{ color: '#f97316' }}>{icon}</span>
        </div>
        <h2 className="text-sm font-bold" style={{ color: '#111827' }}>{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function BookingFormContent() {
  const { carId } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [carLoading, setCarLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    start_date: searchParams.get('from') || '',
    end_date: searchParams.get('to') || '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    id_type: "Driver's License",
    id_number: '',
    pickup_location: '',
    dropoff_location: '',
    notes: '',
  })

  useEffect(() => {
    fetch(`/api/cars/${carId}`)
      .then(r => { if (!r.ok) { router.push('/cars'); return null } return r.json() })
      .then(d => d && setCar(d.vehicle))
      .catch(() => router.push('/cars'))
      .finally(() => setCarLoading(false))
  }, [carId, router])

  // Pre-fill form from logged-in customer account
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const meta = user.user_metadata || {}
      setForm(f => ({
        ...f,
        customer_name: f.customer_name || meta.full_name || '',
        customer_email: f.customer_email || user.email || '',
        customer_phone: f.customer_phone || meta.phone || '',
      }))
    })
  }, [])

  const totalDays = form.start_date && form.end_date && form.end_date > form.start_date
    ? Math.ceil((new Date(form.end_date) - new Date(form.start_date)) / (1000 * 60 * 60 * 24)) : 0
  const totalAmount = totalDays * (car ? Number(car.price_per_day) : 0)

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(e2 => ({ ...e2, [k]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.start_date) errs.start_date = 'Required'
    if (!form.end_date) errs.end_date = 'Required'
    if (form.end_date && form.start_date && form.end_date <= form.start_date) errs.end_date = 'Return date must be after pickup'
    if (!form.customer_name.trim()) errs.customer_name = 'Full name is required'
    if (!form.customer_phone.trim()) errs.customer_phone = 'Phone number is required'
    if (form.customer_email && !/\S+@\S+\.\S+/.test(form.customer_email)) errs.customer_email = 'Invalid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) { toast.error('Please fill in all required fields'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id: carId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      toast.success('Booking confirmed! 🎉')
      router.push(`/booking/confirmation/${data.booking.booking_ref}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (carLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
      <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )
  if (!car) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={48} />
          </Link>
          <ChevronRight size={13} style={{ color: '#d1d5db' }} />
          <Link href="/cars" className="text-sm font-medium" style={{ color: '#9ca3af' }}>Cars</Link>
          <ChevronRight size={13} style={{ color: '#d1d5db' }} />
          <Link href={`/cars/${carId}`} className="text-sm font-medium truncate" style={{ color: '#9ca3af' }}>{car.make} {car.model}</Link>
          <ChevronRight size={13} style={{ color: '#d1d5db' }} />
          <span className="text-sm font-bold" style={{ color: '#f97316' }}>Reserve</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <Link href={`/cars/${carId}`} className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:text-orange-500" style={{ color: '#6b7280' }}>
          <ArrowLeft size={16} /> Back to car details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 space-y-5">
            <div className="mb-2">
              <h1 className="text-2xl font-black" style={{ color: '#111827' }}>Complete Your Reservation</h1>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Fill in your details to reserve this vehicle. No payment required now.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rental Dates */}
              <SectionCard title="Rental Dates & Locations" icon={<Calendar size={16} />}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>Pickup Date *</label>
                    <input type="date" value={form.start_date} min={today} onChange={set('start_date')}
                      style={inputStyle(errors.start_date)}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = errors.start_date ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                    {errors.start_date && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.start_date}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>Return Date *</label>
                    <input type="date" value={form.end_date} min={form.start_date || today} onChange={set('end_date')}
                      style={inputStyle(errors.end_date)}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = errors.end_date ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                    {errors.end_date && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.end_date}</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'pickup_location', label: 'Pickup Location', placeholder: 'e.g. NAIA Terminal 3, Manila' },
                    { key: 'dropoff_location', label: 'Drop-off Location', placeholder: 'Same as pickup or different location' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>{f.label}</label>
                      <input type="text" value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                        style={inputStyle(false)}
                        onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Personal Info */}
              <SectionCard title="Personal Information" icon={<User size={16} />}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>Full Name *</label>
                    <input type="text" value={form.customer_name} onChange={set('customer_name')} placeholder="Juan dela Cruz"
                      style={inputStyle(errors.customer_name)}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = errors.customer_name ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                    {errors.customer_name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.customer_name}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'customer_phone', label: 'Phone Number *', type: 'tel', placeholder: '09XX XXX XXXX', required: true },
                      { key: 'customer_email', label: 'Email Address', type: 'email', placeholder: 'juan@email.com', required: false },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                          style={inputStyle(errors[f.key])}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                          onBlur={e => { e.target.style.borderColor = errors[f.key] ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                        {errors[f.key] && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors[f.key]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>Home Address</label>
                    <input type="text" value={form.customer_address} onChange={set('customer_address')} placeholder="Street, City, Province"
                      style={inputStyle(false)}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                  </div>
                </div>
              </SectionCard>

              {/* ID Verification */}
              <SectionCard title="ID Verification" icon={<CreditCard size={16} />}>
                <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>Please bring your valid ID on pickup day. Providing it now speeds up the process.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>ID Type</label>
                    <select value={form.id_type} onChange={set('id_type')} style={{ ...inputStyle(false), appearance: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}>
                      {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>ID Number</label>
                    <input type="text" value={form.id_number} onChange={set('id_number')} placeholder="ID number"
                      style={inputStyle(false)}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                  </div>
                </div>
              </SectionCard>

              {/* Notes */}
              <SectionCard title="Special Requests" icon={<FileText size={16} />}>
                <textarea value={form.notes} onChange={set('notes')} placeholder="Any special requests, preferred pickup time, or additional notes for our team..." rows={3} resize="none"
                  style={{ ...inputStyle(false), resize: 'none' }}
                  onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
              </SectionCard>

              {/* Submit */}
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-base transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 32px rgba(249,115,22,0.4)' }}>
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <>Confirm Reservation <ArrowRight size={18} /></>}
              </button>
              <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
                By reserving, you agree to our rental terms. No payment is collected online — pay on pickup.
              </p>
            </form>
          </motion.div>

          {/* Summary sidebar */}
          <div className="lg:col-span-2">
            <div style={{ position: 'sticky', top: 80 }}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>

                <div className="p-5" style={{ borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
                  <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Booking Summary</h2>
                </div>

                {/* Car info */}
                <div className="p-5" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <div className="flex gap-4">
                    <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: '#f3f4f6' }}>
                      {car.image_url
                        ? <img src={car.image_url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Car size={24} style={{ color: '#d1d5db' }} /></div>
                      }
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: '#111827' }}>{car.year} {car.make} {car.model}</h3>
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{car.type} · {car.transmission}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: '#9ca3af' }}>Plate: {car.plate}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                {form.start_date && form.end_date && (
                  <div className="p-5 space-y-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {[
                      { label: 'Pickup', value: new Date(form.start_date).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
                      { label: 'Return', value: new Date(form.end_date).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>{label}</span>
                        <span className="font-semibold" style={{ color: '#111827' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="p-5 space-y-3" style={{ borderBottom: totalDays > 0 ? '1px solid #f3f4f6' : 'none' }}>
                  {totalDays > 0 ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>₱{Number(car.price_per_day).toLocaleString()} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                        <span style={{ color: '#111827', fontWeight: 600 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#111827' }}>Total</span>
                        <span style={{ color: '#f97316', fontSize: 20, fontWeight: 900 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Due upon vehicle pickup</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 py-2 text-xs" style={{ color: '#9ca3af' }}>
                      <AlertCircle size={14} /> Select dates above to see pricing
                    </div>
                  )}
                </div>

                {/* Trust */}
                <div className="p-5 space-y-2.5">
                  {[
                    { icon: CheckCircle, text: 'Free cancellation anytime', color: '#10b981' },
                    { icon: Banknote, text: 'Pay on pickup — no online payment', color: '#6b7280' },
                    { icon: ZapIcon, text: 'Instant booking confirmation', color: '#f97316' },
                    { icon: Clock, text: 'Our team contacts you within 1-2 hrs', color: '#6b7280' },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: '#6b7280' }}>
                      <Icon size={13} style={{ color, flexShrink: 0 }} /> {text}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
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
