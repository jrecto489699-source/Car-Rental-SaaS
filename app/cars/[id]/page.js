'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Car, Fuel, Settings2, Calendar, ArrowLeft, ArrowRight, CheckCircle, Zap, Shield, Clock, ChevronRight, AlertCircle, MapPin, Palette, Gauge, BadgeCheck, Phone, Star } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import CustomerAuthModal from '@/components/CustomerAuthModal'
import { createClient } from '@/lib/supabase/client'

function SpecBox({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
      <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
        <Icon size={14} />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color: '#111827' }}>{value || '—'}</span>
    </div>
  )
}

export default function CarDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [availability, setAvailability] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then(r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then(d => d && setCar(d.vehicle))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!startDate || !endDate || !id || endDate <= startDate) { setAvailability(null); return }
    const timer = setTimeout(async () => {
      setCheckingAvailability(true)
      try {
        const res = await fetch(`/api/bookings?vehicle_id=${id}&start_date=${startDate}&end_date=${endDate}`)
        const data = await res.json()
        setAvailability(data.available)
      } catch { setAvailability(null) }
      finally { setCheckingAvailability(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [startDate, endDate, id])

  const totalDays = startDate && endDate && endDate > startDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0
  const totalAmount = totalDays * (car ? Number(car.price_per_day) : 0)

  const handleBook = async () => {
    if (!startDate || !endDate) return
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push(`/book/${id}?from=${startDate}&to=${endDate}`)
        return
      }
    } catch {}
    setAuthModal(true)
  }

  const handleAuthSuccess = () => {
    router.push(`/book/${id}?from=${startDate}&to=${endDate}`)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
      <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )

  if (notFound || !car) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" style={{ background: '#f8fafc' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: '#f3f4f6' }}><Car size={32} style={{ color: '#9ca3af' }} /></div>
      <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Car not found</h1>
      <p style={{ color: '#6b7280' }}>This vehicle may no longer be available.</p>
      <Link href="/cars" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#f97316' }}>
        <ArrowLeft size={16} /> Back to all cars
      </Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={48} />
          </Link>
          <ChevronRight size={14} style={{ color: '#d1d5db' }} />
          <Link href="/cars" className="text-sm font-medium transition-colors hover:text-orange-500" style={{ color: '#6b7280' }}>Browse Cars</Link>
          <ChevronRight size={14} style={{ color: '#d1d5db' }} />
          <span className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{car.year} {car.make} {car.model}</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:text-orange-500" style={{ color: '#6b7280' }}>
          <ArrowLeft size={16} /> Back to all cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — car info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative h-72 sm:h-96 rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              {car.image_url
                ? <img src={car.image_url} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center gap-4"><Car size={48} style={{ color: '#d1d5db' }} /></div>
              }
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(17,24,39,0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>{car.type}</span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#059669', backdropFilter: 'blur(8px)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} /> Available
              </div>
            </motion.div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-black mb-2" style={{ color: '#111827' }}>
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium" style={{ color: '#6b7280' }}>Plate: <span style={{ color: '#111827', fontFamily: 'monospace', fontWeight: 700 }}>{car.plate}</span></span>
                {car.color && <span className="text-sm" style={{ color: '#6b7280' }}>Color: <span style={{ color: '#111827', fontWeight: 600 }}>{car.color}</span></span>}
              </div>
            </div>

            {/* Specs */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#9ca3af' }}>Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <SpecBox icon={Settings2} label="Transmission" value={car.transmission} />
                <SpecBox icon={Fuel} label="Fuel Type" value={car.fuel} />
                <SpecBox icon={Car} label="Vehicle Type" value={car.type} />
                <SpecBox icon={Palette} label="Color" value={car.color} />
                <SpecBox icon={Calendar} label="Year" value={car.year} />
                {car.mileage > 0 && <SpecBox icon={Gauge} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />}
              </div>
            </div>

            {/* Notes */}
            {car.notes && (
              <div className="p-5 rounded-2xl" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: '#9a3412' }}><Star size={13} /> Vehicle Highlights</h3>
                <p className="text-sm" style={{ color: '#7c2d12' }}>{car.notes}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: 'Fully Insured', color: '#eff6ff', border: '#bfdbfe', iconColor: '#3b82f6' },
                { icon: Clock, label: '24/7 Support', color: '#f0fdf4', border: '#bbf7d0', iconColor: '#16a34a' },
                { icon: BadgeCheck, label: 'Verified Vehicle', color: '#fdf4ff', border: '#e9d5ff', iconColor: '#9333ea' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                  style={{ background: item.color, border: `1px solid ${item.border}` }}>
                  <item.icon size={20} style={{ color: item.iconColor }} />
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — booking panel */}
          <div className="lg:col-span-2">
            <div style={{ position: 'sticky', top: 80 }}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'white' }}>

                {/* Price header */}
                <div className="p-6 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black" style={{ color: '#111827' }}>₱{Number(car.price_per_day).toLocaleString()}</span>
                    <span className="text-base font-medium" style={{ color: '#9ca3af' }}>/day</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Pay on pickup · Free cancellation</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Date selection */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
                    <div className="grid grid-cols-2">
                      <div className="p-4" style={{ borderRight: '1px solid #e5e7eb' }}>
                        <label className="block text-xs font-black uppercase tracking-wide mb-1.5" style={{ color: '#9ca3af' }}>Pickup</label>
                        <input type="date" value={startDate} min={today}
                          onChange={e => { setStartDate(e.target.value); if (endDate && endDate <= e.target.value) setEndDate('') }}
                          className="w-full text-sm font-semibold bg-transparent focus:outline-none" style={{ color: '#111827' }} />
                      </div>
                      <div className="p-4">
                        <label className="block text-xs font-black uppercase tracking-wide mb-1.5" style={{ color: '#9ca3af' }}>Return</label>
                        <input type="date" value={endDate} min={startDate || today}
                          onChange={e => setEndDate(e.target.value)}
                          className="w-full text-sm font-semibold bg-transparent focus:outline-none" style={{ color: '#111827' }} />
                      </div>
                    </div>
                  </div>

                  {/* Availability status */}
                  {checkingAvailability && (
                    <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                      <div className="w-3 h-3 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                      Checking availability...
                    </div>
                  )}
                  {!checkingAvailability && availability === true && (
                    <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}>
                      <CheckCircle size={14} /> Great news — available for your selected dates!
                    </div>
                  )}
                  {!checkingAvailability && availability === false && (
                    <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                      <AlertCircle size={14} /> Not available for these dates. Please try different dates.
                    </div>
                  )}

                  {/* Price summary */}
                  {totalDays > 0 && (
                    <div className="p-4 rounded-xl space-y-2" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                      <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
                        <span>₱{Number(car.price_per_day).toLocaleString()} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                        <span style={{ color: '#111827', fontWeight: 600 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#111827' }}>Total</span>
                        <span style={{ color: '#f97316', fontSize: 18 }}>₱{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Book button */}
                  <button onClick={handleBook}
                    disabled={!startDate || !endDate || availability === false || checkingAvailability}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-base transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 32px rgba(249,115,22,0.4)' }}>
                    {!startDate || !endDate ? 'Select Dates to Book' : 'Reserve This Car'} <ArrowRight size={16} />
                  </button>

                  {/* Reassurance */}
                  <div className="space-y-2 pt-2">
                    {['No charge now — pay on pickup', 'Free cancellation anytime', 'Instant booking confirmation'].map(t => (
                      <div key={t} className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                        <CheckCircle size={12} style={{ color: '#10b981', flexShrink: 0 }} /> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Need help */}
              <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
                <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Prefer to book by phone?</p>
                <a href="tel:+630000000000" className="flex items-center justify-center gap-1.5 text-sm font-bold transition-colors hover:text-orange-500" style={{ color: '#111827' }}><Phone size={14} /> Call Us to Reserve</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerAuthModal
        isOpen={authModal}
        onClose={() => setAuthModal(false)}
        onSuccess={handleAuthSuccess}
        redirectMessage="Sign up or log in to book this vehicle"
      />
    </div>
  )
}
