'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search, ArrowRight, Car, Fuel, Settings2,
  Phone, MapPin, Menu, X, ChevronDown, CheckCircle
} from 'lucide-react'
import RMLogo from '@/components/RMLogo'

const DEMO_CARS = [
  { id: 'demo-1', make: 'Toyota', model: 'Fortuner', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 3500, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
  { id: 'demo-2', make: 'Honda', model: 'Civic', year: 2022, type: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2200, image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' },
  { id: 'demo-3', make: 'Ford', model: 'Ranger', year: 2023, type: 'Pickup Truck', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 4000, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: 'demo-4', make: 'Toyota', model: 'HiAce', year: 2022, type: 'Van', transmission: 'Manual', fuel: 'Diesel', price_per_day: 4500, image_url: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=800&q=80' },
  { id: 'demo-5', make: 'Hyundai', model: 'Tucson', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 3000, image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80' },
  { id: 'demo-6', make: 'Mitsubishi', model: 'Xpander', year: 2022, type: 'Minivan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2800, image_url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80' },
]

const serif = "'Georgia', 'Times New Roman', serif"
const sans  = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { label: 'Browse Cars', href: '/cars' },
    { label: 'Rent with Driver', href: '/rent-with-driver' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <>
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid #e8e8e8' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.07)' : 'none',
          transition: 'all 0.35s ease',
        }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <RMLogo size={54} />
          </Link>

          <div className="rm-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(item => (
              <a key={item.href} href={item.href} style={{
                padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none', transition: 'all 0.2s', fontFamily: sans,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = scrolled ? '#f5f5f5' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = scrolled ? '#111' : 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? '#374151' : 'rgba(255,255,255,0.85)' }}
              >{item.label}</a>
            ))}
          </div>

          <div className="rm-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/cars" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 50,
              background: '#f97316', color: 'white',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(249,115,22,0.38)',
              transition: 'all 0.2s', fontFamily: sans,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Reserve a Car
            </Link>
          </div>

          <button className="rm-hamburger" onClick={() => setOpen(!open)} style={{
            display: 'none', padding: 8, background: 'transparent', border: 'none',
            cursor: 'pointer', color: scrolled ? '#374151' : 'white',
          }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {open && (
        <div style={{
          position: 'fixed', top: 70, left: 0, right: 0, zIndex: 49,
          background: 'white', borderBottom: '1px solid #eee',
          padding: '12px 16px 20px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        }}>
          {navLinks.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '13px 16px', borderRadius: 10,
              fontSize: 15, fontWeight: 500, color: '#333', textDecoration: 'none',
              fontFamily: sans, transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{item.label}</Link>
          ))}
          <Link href="/cars" onClick={() => setOpen(false)} style={{
            display: 'block', margin: '8px 0 0', padding: '14px 16px',
            borderRadius: 50, background: '#f97316', color: 'white',
            textAlign: 'center', fontSize: 15, fontWeight: 700,
            textDecoration: 'none', fontFamily: sans,
          }}>Reserve a Car</Link>
        </div>
      )}
    </>
  )
}

function SearchBar() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [type, setType] = useState('All')

  const go = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to)   p.set('to', to)
    if (type !== 'All') p.set('type', type)
    router.push(`/cars?${p}`)
  }

  return (
    <motion.form onSubmit={go} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
      style={{
        background: 'white', borderRadius: 20, padding: 8,
        boxShadow: '0 24px 72px rgba(0,0,0,0.22)',
        maxWidth: 880, width: '100%', margin: '0 auto',
      }}>
      <div className="rm-search-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 6 }}>
        {[
          { label: 'Pickup Date', inputType: 'date', value: from, min: today, onChange: e => { setFrom(e.target.value); if (to && to <= e.target.value) setTo('') } },
          { label: 'Return Date', inputType: 'date', value: to,   min: from || today, onChange: e => setTo(e.target.value) },
        ].map((f, i) => (
          <div key={i} style={{ padding: '12px 18px', borderRadius: 14, background: '#f8f8f8' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5, fontFamily: sans }}>{f.label}</div>
            <input type={f.inputType} value={f.value} min={f.min} onChange={f.onChange}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#111', width: '100%', cursor: 'pointer', fontFamily: sans }} />
          </div>
        ))}
        <div style={{ padding: '12px 18px', borderRadius: 14, background: '#f8f8f8' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5, fontFamily: sans }}>Vehicle Type</div>
          <select value={type} onChange={e => setType(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#111', width: '100%', cursor: 'pointer', fontFamily: sans }}>
            {['All', 'Sedan', 'SUV', 'Van', 'Pickup Truck', 'Minivan', 'Hatchback'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button type="submit" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '0 28px', borderRadius: 14, background: '#f97316', color: 'white',
          border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15,
          boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
          transition: 'all 0.2s', minHeight: 54, fontFamily: sans, whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <Search size={16} /> Search
        </button>
      </div>
    </motion.form>
  )
}

function CarCard({ car, isDemo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.09 }}
      onClick={() => !isDemo && (window.location.href = `/cars/${car.id}`)}
      style={{
        background: 'white', borderRadius: 20, overflow: 'hidden',
        cursor: isDemo ? 'default' : 'pointer',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}
      whileHover={!isDemo ? { y: -6 } : {}}
      onMouseEnter={e => { if (!isDemo) e.currentTarget.style.boxShadow = '0 20px 52px rgba(0,0,0,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)' }}
    >
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#f4f4f4' }}>
        {car.image_url
          ? <img src={car.image_url} alt={`${car.make} ${car.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Car size={36} color="#ccc" /></div>
        }
        <span style={{
          position: 'absolute', top: 14, left: 14,
          padding: '5px 12px', borderRadius: 50,
          background: 'rgba(0,0,0,0.72)', color: 'white',
          fontSize: 11, fontWeight: 700, backdropFilter: 'blur(8px)', fontFamily: sans,
        }}>{car.type}</span>
      </div>
      <div style={{ padding: '20px 22px 24px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6, fontFamily: serif, lineHeight: 1.3 }}>
          {car.year} {car.make} {car.model}
        </h3>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#999', fontFamily: sans }}>
            <Settings2 size={12} /> {car.transmission}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#999', fontFamily: sans }}>
            <Fuel size={12} /> {car.fuel}
          </span>
        </div>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#111', fontFamily: serif }}>₱{Number(car.price_per_day).toLocaleString()}</span>
          <span style={{ fontSize: 12, color: '#bbb', marginLeft: 5, fontFamily: sans }}>/day</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '11px 0', borderRadius: 50, width: '100%',
          background: isDemo ? '#f0f0f0' : '#f97316',
          color: isDemo ? '#aaa' : 'white',
          fontSize: 14, fontWeight: 700, fontFamily: sans,
        }}>
          {isDemo ? 'Sample' : 'Book Now'} {!isDemo && <ArrowRight size={14} />}
        </div>
      </div>
    </motion.div>
  )
}

function FaqList() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Do I need a credit card to book?', a: "No credit card needed. We only collect payment in cash, GCash, or bank transfer at the time of vehicle pickup. Your booking is free to reserve online." },
    { q: 'What documents do I need to bring?', a: "Bring a valid government-issued ID (Driver's License, Passport, or National ID) and your booking reference number. A driver's license is required for self-drive rentals." },
    { q: 'Can I cancel or reschedule my booking?', a: "Yes — cancellations and rescheduling are free. Just call us with your booking reference at least 24 hours before your pickup time and we'll sort it out." },
    { q: 'What is included in the rental rate?', a: "The daily rate covers the vehicle only. For self-drive rentals, fuel is not included. If you choose our rent-with-driver option, fuel, toll fees, and parking are all included." },
    { q: 'Are the vehicles insured?', a: "Every vehicle in our fleet is fully insured. You are covered from the moment you pick up the car to the moment you return the keys." },
    { q: 'What happens if the car breaks down?', a: "In the unlikely event of a breakdown, call us immediately. We provide 24/7 roadside assistance and will either repair the vehicle or arrange a replacement at no extra cost to you." },
    { q: 'How far in advance should I book?', a: "We recommend booking at least 2–3 days in advance for regular vehicles. For peak season (holidays, long weekends) we suggest 1–2 weeks ahead. Bookings within 24 hours are subject to availability — call us directly." },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {faqs.map((faq, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
          style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid', borderColor: open === i ? '#f97316' : '#ececec', transition: 'border-color 0.2s' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', background: open === i ? '#fff7ed' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', gap: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111', lineHeight: 1.4, fontFamily: serif }}>{faq.q}</span>
            <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: open === i ? '#f97316' : '#f3f3f3', transition: 'all 0.2s' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d={open === i ? 'M2 6l3-3 3 3' : 'M2 4l3 3 3-3'} stroke={open === i ? 'white' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 28px 24px', background: '#fff7ed', borderTop: '1px solid #fed7aa' }}>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.78, fontFamily: sans, margin: 0, paddingTop: 16 }}>{faq.a}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function Fleet() {
  const [cars, setCars]       = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo]   = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)
    fetch('/api/cars', { signal: controller.signal })
      .then(r => { clearTimeout(timeout); if (!r.ok) throw new Error(); return r.json() })
      .then(d => {
        const real = (d.vehicles || []).slice(0, 6)
        real.length === 0 ? (setCars(DEMO_CARS), setIsDemo(true)) : (setCars(real), setIsDemo(false))
      })
      .catch(() => { clearTimeout(timeout); setCars(DEMO_CARS); setIsDemo(true) })
      .finally(() => setLoading(false))
    return () => { clearTimeout(timeout); controller.abort() }
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ height: 210, background: '#f0f0f0' }} className="rm-pulse" />
          <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ height: 18, borderRadius: 6, background: '#f0f0f0', width: '65%' }} className="rm-pulse" />
            <div style={{ height: 14, borderRadius: 6, background: '#f0f0f0' }} className="rm-pulse" />
            <div style={{ height: 44, borderRadius: 50, background: '#f0f0f0', marginTop: 4 }} className="rm-pulse" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {isDemo && (
        <div style={{ marginBottom: 28, padding: '14px 20px', borderRadius: 14, background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', fontSize: 13, fontFamily: sans }}>
          <strong>Sample vehicles shown.</strong> Connect your Supabase database to display your real fleet.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {cars.map((car, i) => <CarCard key={car.id} car={car} isDemo={isDemo} index={i} />)}
      </div>
    </>
  )
}

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f9f7f4', fontFamily: sans }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 70 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.55) 55%, rgba(8,8,8,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(8,8,8,0.5), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28, fontFamily: sans }}>
              RM Car Rental Services — Philippines
            </p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: serif, fontSize: 'clamp(44px, 7.5vw, 92px)', fontWeight: 700, color: 'white', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 12 }}>
            Your next trip
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }}
            style={{ fontFamily: serif, fontSize: 'clamp(44px, 7.5vw, 92px)', fontWeight: 700, color: '#f97316', lineHeight: 1.08, letterSpacing: '-0.025em', fontStyle: 'italic', marginBottom: 36 }}>
            starts right here.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.68)', maxWidth: 500, lineHeight: 1.75, marginBottom: 52, fontFamily: sans }}>
            We've been putting people on the road for years — clean cars, honest prices, and a team that actually picks up the phone.
          </motion.p>

          <SearchBar />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {['No credit card required', 'Free cancellation', 'Pay on pickup'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: sans }}>
                <CheckCircle size={14} color="#34d399" /> {t}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ChevronDown size={22} color="rgba(255,255,255,0.28)" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="rm-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { number: '500+', label: 'Happy customers' },
              { number: '20+',  label: 'Cars in our fleet' },
              { number: '100%', label: 'Insured vehicles' },
              { number: '24/7', label: 'Support available' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: '36px 28px', borderLeft: i > 0 ? '1px solid #1e1e1e' : 'none' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#f97316', fontFamily: serif, lineHeight: 1, marginBottom: 6 }}>{s.number}</div>
                <div style={{ fontSize: 13, color: '#555', fontWeight: 500, fontFamily: sans }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section style={{ padding: '100px 24px', background: '#f9f7f4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: sans }}>Our Fleet</p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: '#111', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
                Pick your ride.
              </h2>
            </div>
            <Link href="/cars" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, color: '#111', textDecoration: 'none',
              paddingBottom: 3, borderBottom: '2px solid #f97316', fontFamily: sans,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
              onMouseLeave={e => e.currentTarget.style.color = '#111'}
            >
              View all cars <ArrowRight size={15} />
            </Link>
          </motion.div>

          <Fleet />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: sans }}>Simple process</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: '#111', lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 480 }}>
              From browsing to driving in minutes.
            </h2>
          </motion.div>

          <div className="rm-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {[
              {
                n: '01', bg: '#fff8f2',
                title: 'Find the right car',
                body: 'Browse our fleet by date and vehicle type. Every listing shows real photos, honest specs, and the exact daily rate — no surprise fees.',
              },
              {
                n: '02', bg: '#f2fef7',
                title: 'Reserve in minutes',
                body: "Fill in your details and lock in your booking. No credit card, no deposit — just your name and preferred dates. We'll confirm you by phone.",
              },
              {
                n: '03', bg: '#f2f6ff',
                title: 'Show up and drive',
                body: "Come in with your valid ID and booking reference. Pay on pickup, grab the keys, and you're on your way. It really is that simple.",
              },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                style={{ padding: '48px 40px', background: step.bg, borderRadius: 4 }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: 'rgba(0,0,0,0.05)', fontFamily: serif, lineHeight: 1, marginBottom: 28, letterSpacing: '-0.04em' }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 16, fontFamily: serif, lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, color: '#666', lineHeight: 1.78, fontFamily: sans }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DRIVER BANNER ── */}
      <section style={{ padding: '0 24px 100px', background: '#f9f7f4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(6,6,6,0.92) 45%, rgba(6,6,6,0.25) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(40px, 5vw, 72px)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, fontFamily: sans }}>
                Premium Service
              </p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: 'white', lineHeight: 1.18, marginBottom: 20, letterSpacing: '-0.02em', maxWidth: 500 }}>
                Don't feel like driving? We've got that covered too.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.62)', lineHeight: 1.78, marginBottom: 36, maxWidth: 460, fontFamily: sans }}>
                Our professional drivers know every route. Sit back, relax, and let us handle the road. Perfect for airport pickups, city tours, and business trips.
              </p>
              <Link href="/rent-with-driver" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 30px', borderRadius: 50,
                background: '#f97316', color: 'white',
                fontSize: 15, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(249,115,22,0.42)',
                transition: 'all 0.2s', fontFamily: sans,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Book with a driver <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: sans }}>Why choose us</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: '#111', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
              We do things differently.
            </h2>
          </motion.div>

          <div className="rm-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 48px' }}>
            {[
              {
                title: "Our cars won't let you down",
                body: "Every vehicle is regularly maintained and inspected before each rental. If something isn't right, we fix it before you ever see it.",
              },
              {
                title: 'What you see is what you pay',
                body: "The price on the listing is the price you pay at pickup. No fuel surcharges, no surprise cleaning fees, no fine print.",
              },
              {
                title: 'We actually answer the phone',
                body: "Got a question? Call us. Need to change your booking? Call us. We're real people and we're here — not hiding behind a chatbot.",
              },
              {
                title: 'Your safety is non-negotiable',
                body: "Every car in our fleet is fully insured. You're covered from the moment you leave to the moment you return the keys.",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '36px 0', borderTop: '2px solid #111' }}>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 12, lineHeight: 1.35, fontFamily: serif }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 15, color: '#777', lineHeight: 1.78, fontFamily: sans }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 24px', background: '#f9f7f4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: sans }}>Customer stories</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: '#111', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
              Hear it from our customers.
            </h2>
          </motion.div>

          <div className="rm-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { name: 'Juan dela Cruz', location: 'Makati City', stars: 5, text: 'Rented a Fortuner for our Batangas trip. Car was spotless, price was exactly what was listed. Will definitely book again for our next road trip.' },
              { name: 'Maria Santos', location: 'Quezon City', stars: 5, text: "I was skeptical at first booking online, but the process was seamless. Got a confirmation call within the hour. Exactly what a rental should be — simple and honest." },
              { name: 'Pedro Reyes', location: 'Cebu City', stars: 5, text: 'Hired a driver for our family reunion in Tagaytay. The driver was professional, knew the roads perfectly, and the van was comfortable for all 10 of us.' },
              { name: 'Ana Garcia', location: 'Davao City', stars: 5, text: "No hidden charges, no surprise fees when I returned the car. Everything was exactly as advertised. This is how car rental should work." },
              { name: 'Carlo Lim', location: 'Pasig City', stars: 5, text: "Called at 9pm to ask about availability and they actually picked up. Had my booking confirmed 10 minutes later. Fantastic service, will recommend to everyone." },
              { name: 'Lisa Tan', location: 'Taguig City', stars: 5, text: "Used them for airport pickup with driver service. Driver was on time, helped with luggage, and the car was air-conditioned and comfortable. Perfect experience." },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: 'white', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[...Array(review.stars)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#444', lineHeight: 1.78, fontFamily: sans, fontStyle: 'italic', flex: 1 }}>"{review.text}"</p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111', fontFamily: serif }}>{review.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa', fontFamily: sans, marginTop: 2 }}>{review.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, fontFamily: sans }}>FAQ</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: '#111', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
              Common questions.
            </h2>
          </motion.div>

          <FaqList />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '100px 24px', background: '#f9f7f4', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700, color: '#111', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              The road isn't going to drive itself.
            </h2>
            <p style={{ fontSize: 17, color: '#888', lineHeight: 1.75, marginBottom: 48, fontFamily: sans }}>
              Browse our available cars and make your reservation today. Takes less than 5 minutes — and you won't need a credit card.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/cars" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 50,
                background: '#111', color: 'white',
                fontSize: 16, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                transition: 'all 0.22s', fontFamily: sans,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Browse cars <ArrowRight size={17} />
              </Link>
              <Link href="/rent-with-driver" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 50,
                background: 'transparent', color: '#111',
                fontSize: 16, fontWeight: 700, textDecoration: 'none',
                border: '2px solid #ddd', transition: 'all 0.22s', fontFamily: sans,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Rent with driver
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0c0c0c', padding: '72px 24px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="rm-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 56, marginBottom: 64 }}>
            <div>
              <RMLogo size={60} />
              <p style={{ fontSize: 14, color: '#4a4a4a', lineHeight: 1.8, marginTop: 20, maxWidth: 320, fontFamily: sans }}>
                RM Car Rental Services has been helping people get around since 2022. We're a local business that takes pride in every single rental.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 22, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: sans }}>Services</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ label: 'Self Drive Rental', href: '/cars' }, { label: 'Rent with Driver', href: '/rent-with-driver' }].map(l => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 14, color: '#4a4a4a', textDecoration: 'none', transition: 'color 0.2s', fontFamily: sans }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a4a4a'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 22, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: sans }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <a href="tel:+630000000000" style={{ fontSize: 14, color: '#4a4a4a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, transition: 'color 0.2s', fontFamily: sans }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4a4a4a'}
                ><Phone size={14} /> +63 XXX XXX XXXX</a>
                <p style={{ fontSize: 14, color: '#4a4a4a', display: 'flex', alignItems: 'center', gap: 9, margin: 0, fontFamily: sans }}>
                  <MapPin size={14} /> Philippines
                </p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 28 }}>
            <p style={{ fontSize: 13, color: '#333', margin: 0, fontFamily: sans }}>© {new Date().getFullYear()} RM Car Rental Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes rm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .rm-pulse { animation: rm-pulse 1.6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .rm-nav-links, .rm-nav-cta { display: none !important; }
          .rm-hamburger { display: flex !important; }
          .rm-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .rm-steps-grid { grid-template-columns: 1fr !important; }
          .rm-why-grid { grid-template-columns: 1fr !important; }
          .rm-testimonials-grid { grid-template-columns: 1fr !important; }
          .rm-footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .rm-search-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .rm-testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .rm-search-grid { grid-template-columns: 1fr !important; }
          .rm-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}
