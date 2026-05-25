'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle, Car, Calendar, Phone, MapPin, Copy,
  ArrowRight, Clock, CreditCard, Home, ChevronRight
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-start gap-4 py-3 last:pb-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
      <span className="text-sm shrink-0" style={{ color: '#6b7280' }}>{label}</span>
      <span className="text-sm font-semibold text-right" style={{ color: '#111827' }}>{value}</span>
    </div>
  )
}

export default function ConfirmationPage() {
  const { ref } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${ref}`)
        if (!res.ok) { setNotFound(true); return }
        const data = await res.json()
        setBooking(data.booking)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [ref])

  const copyRef = () => {
    navigator.clipboard.writeText(ref)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" style={{ background: '#f8fafc' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: '#f3f4f6' }}><Car size={32} style={{ color: '#9ca3af' }} /></div>
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Booking not found</h1>
        <p style={{ color: '#6b7280' }}>We couldn't find this reservation.</p>
        <Link href="/cars" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#f97316' }}>
          Browse available cars <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={48} />
          </Link>
          <ChevronRight size={14} style={{ color: '#d1d5db' }} />
          <span className="text-sm font-medium" style={{ color: '#6b7280' }}>Booking Confirmation</span>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 64px' }}>
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-10"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '3px solid #86efac', boxShadow: '0 8px 32px rgba(16,185,129,0.2)' }}>
            <CheckCircle size={44} style={{ color: '#16a34a' }} />
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ color: '#111827' }}>You're All Set!</h1>
          <p className="text-base" style={{ color: '#6b7280', maxWidth: 380, margin: '0 auto' }}>
            Your reservation has been received. We'll contact you shortly to confirm the details.
          </p>
        </motion.div>

        {/* Booking reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6 text-center mb-5"
          style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '2px solid #fed7aa', boxShadow: '0 4px 20px rgba(249,115,22,0.12)' }}
        >
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#c2410c' }}>Booking Reference</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl font-black tracking-wider" style={{ color: '#111827', fontFamily: 'monospace' }}>{ref}</span>
            <button
              onClick={copyRef}
              className="p-2 rounded-xl transition-all hover:scale-105"
              style={{ background: copied ? '#dcfce7' : 'rgba(249,115,22,0.15)', border: `1px solid ${copied ? '#86efac' : 'rgba(249,115,22,0.3)'}`, color: copied ? '#16a34a' : '#ea580c' }}
            >
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs" style={{ color: '#9a3412' }}>
            {copied ? '✓ Copied to clipboard!' : 'Save this reference number for your records'}
          </p>
        </motion.div>

        {/* Vehicle details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="rounded-2xl p-6 mb-4"
          style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fff7ed' }}>
              <Car size={14} style={{ color: '#f97316' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Vehicle & Rental Details</h2>
          </div>
          <InfoRow label="Vehicle" value={booking.vehicle_name} />
          <InfoRow label="Plate Number" value={booking.vehicle_plate} />
          <InfoRow label="Pickup Date" value={formatDate(booking.start_date)} />
          <InfoRow label="Return Date" value={formatDate(booking.end_date)} />
          <InfoRow label="Duration" value={`${booking.total_days} day${booking.total_days > 1 ? 's' : ''}`} />
          {booking.pickup_location && <InfoRow label="Pickup Location" value={booking.pickup_location} />}
          {booking.dropoff_location && <InfoRow label="Drop-off Location" value={booking.dropoff_location} />}
        </motion.div>

        {/* Renter info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="rounded-2xl p-6 mb-4"
          style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fff7ed' }}>
              <Phone size={14} style={{ color: '#f97316' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Renter Information</h2>
          </div>
          <InfoRow label="Name" value={booking.customer_name} />
          <InfoRow label="Phone" value={booking.customer_phone} />
          {booking.customer_email && <InfoRow label="Email" value={booking.customer_email} />}
        </motion.div>

        {/* Payment summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
          className="rounded-2xl p-6 mb-4"
          style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fff7ed' }}>
              <CreditCard size={14} style={{ color: '#f97316' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Payment Summary</h2>
          </div>
          <InfoRow label="Rate" value={`₱${Number(booking.price_per_day).toLocaleString()}/day`} />
          <InfoRow label="Duration" value={`${booking.total_days} day${booking.total_days > 1 ? 's' : ''}`} />
          <div className="flex justify-between items-center pt-4 mt-1">
            <span className="text-sm font-bold" style={{ color: '#111827' }}>Total Amount Due</span>
            <span className="text-2xl font-black" style={{ color: '#f97316' }}>₱{Number(booking.total_amount).toLocaleString()}</span>
          </div>
          <p className="text-xs mt-3 p-3 rounded-xl" style={{ color: '#6b7280', background: '#f8fafc', border: '1px solid #e5e7eb' }}>
            Payment is collected upon vehicle pickup. We accept Cash, GCash, and bank transfer.
          </p>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fff7ed' }}>
              <Clock size={14} style={{ color: '#f97316' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: '#111827' }}>What Happens Next</h2>
          </div>
          <div className="space-y-3">
            {[
              'Our team will review your booking and contact you within 1–2 hours to confirm.',
              'Bring a valid government ID and your booking reference on pickup day.',
              'Payment is collected at the time of vehicle pickup.',
              'If you need to cancel or reschedule, call us with your booking reference.',
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
                  <span className="text-xs font-black text-white">{i + 1}</span>
                </div>
                <p className="text-sm" style={{ color: '#4b5563' }}>{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.43 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/cars"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
            style={{ background: 'white', border: '2px solid #e5e7eb', color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Car size={16} /> Browse More Cars
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}
          >
            <Home size={16} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
