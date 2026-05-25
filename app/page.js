'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowRight, Car, Fuel, Settings2,
  Phone, MapPin, Menu, X, ChevronDown, CheckCircle,
  Shield, Clock, Star, Headphones, Zap, Users, ChevronRight,
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

const DEMO_CARS = [
  { id: 'demo-1', make: 'Toyota', model: 'Fortuner', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 3500, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
  { id: 'demo-2', make: 'Honda', model: 'Civic', year: 2022, type: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2200, image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' },
  { id: 'demo-3', make: 'Ford', model: 'Ranger', year: 2023, type: 'Pickup Truck', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 4000, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: 'demo-4', make: 'Toyota', model: 'HiAce', year: 2022, type: 'Van', transmission: 'Manual', fuel: 'Diesel', price_per_day: 4500, image_url: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=800&q=80' },
  { id: 'demo-5', make: 'Hyundai', model: 'Tucson', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 3000, image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80' },
  { id: 'demo-6', make: 'Mitsubishi', model: 'Xpander', year: 2022, type: 'Minivan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2800, image_url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
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
        className={`rm-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="rm-nav-inner">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <BrandLogo size={50} dark={!scrolled} />
          </Link>

          <div className="rm-nav-links">
            {navLinks.map(item => (
              <a key={item.href} href={item.href} className="rm-nav-link">
                {item.label}
              </a>
            ))}
          </div>

          <div className="rm-nav-cta">
            <Link href="/account" className="rm-btn-ghost">Sign Up</Link>
            <Link href="/cars" className="rm-btn-orange">
              Reserve a Car <ArrowRight size={15} />
            </Link>
          </div>

          <button className="rm-hamburger" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rm-mobile-menu">
            {navLinks.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rm-mobile-link">
                {item.label}
              </Link>
            ))}
            <div className="rm-mobile-cta">
              <Link href="/account" onClick={() => setOpen(false)} className="rm-mobile-btn-ghost">Sign Up</Link>
              <Link href="/cars" onClick={() => setOpen(false)} className="rm-mobile-btn-orange">Reserve a Car</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SearchBar() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [type, setType] = useState('All')

  const go = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    if (type !== 'All') p.set('type', type)
    router.push(`/cars?${p}`)
  }

  return (
    <motion.form onSubmit={go} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      className="rm-search-form">
      <div className="rm-search-grid">
        {[
          { label: 'Pickup Date', inputType: 'date', value: from, min: today, onChange: e => { setFrom(e.target.value); if (to && to <= e.target.value) setTo('') } },
          { label: 'Return Date', inputType: 'date', value: to, min: from || today, onChange: e => setTo(e.target.value) },
        ].map((f, i) => (
          <div key={i} className="rm-search-field">
            <div className="rm-search-label">{f.label}</div>
            <input type={f.inputType} value={f.value} min={f.min} onChange={f.onChange} className="rm-search-input" />
          </div>
        ))}
        <div className="rm-search-field">
          <div className="rm-search-label">Vehicle Type</div>
          <select value={type} onChange={e => setType(e.target.value)} className="rm-search-input">
            {['All', 'Sedan', 'SUV', 'Van', 'Pickup Truck', 'Minivan', 'Hatchback'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button type="submit" className="rm-search-btn">
          <Search size={17} /> Search Cars
        </button>
      </div>
    </motion.form>
  )
}

function CarCard({ car, isDemo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      onClick={() => !isDemo && (window.location.href = `/cars/${car.id}`)}
      className={`rm-car-card ${isDemo ? '' : 'rm-car-card-clickable'}`}>
      <div className="rm-car-image">
        {car.image_url
          ? <img src={car.image_url} alt={`${car.make} ${car.model}`} className="rm-car-img" />
          : <div className="rm-car-img-placeholder"><Car size={40} color="#ccc" /></div>
        }
        <div className="rm-car-overlay" />
        <span className="rm-car-type-badge">{car.type}</span>
        {!isDemo && <span className="rm-car-available-badge">● Available</span>}
      </div>
      <div className="rm-car-info">
        <h3 className="rm-car-name">{car.year} {car.make} {car.model}</h3>
        <div className="rm-car-specs">
          <span className="rm-car-spec"><Settings2 size={12} /> {car.transmission}</span>
          <span className="rm-car-spec"><Fuel size={12} /> {car.fuel}</span>
        </div>
        <div className="rm-car-footer">
          <div>
            <span className="rm-car-price">₱{Number(car.price_per_day).toLocaleString()}</span>
            <span className="rm-car-per-day">/day</span>
          </div>
          <div className={`rm-car-book-btn ${isDemo ? 'rm-car-book-btn-demo' : ''}`}>
            {isDemo ? 'Sample' : <>Book Now <ArrowRight size={13} /></>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Fleet() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

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
    <div className="rm-fleet-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rm-car-skeleton">
          <div className="rm-skeleton-img rm-pulse" />
          <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="rm-skeleton-line rm-pulse" style={{ width: '65%' }} />
            <div className="rm-skeleton-line rm-pulse" style={{ width: '45%', height: 12 }} />
            <div className="rm-skeleton-btn rm-pulse" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {isDemo && (
        <div className="rm-demo-notice">
          <Zap size={14} style={{ flexShrink: 0 }} />
          <span><strong>Sample vehicles shown.</strong> Connect Supabase to display your real fleet.</span>
        </div>
      )}
      <div className="rm-fleet-grid">
        {cars.map((car, i) => <CarCard key={car.id} car={car} isDemo={isDemo} index={i} />)}
      </div>
    </>
  )
}

function FaqList() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Do I need a credit card to book?', a: 'No credit card needed. We only collect payment in cash, GCash, or bank transfer at the time of vehicle pickup. Your booking is free to reserve online.' },
    { q: 'What documents do I need to bring?', a: "Bring a valid government-issued ID (Driver's License, Passport, or National ID) and your booking reference number. A driver's license is required for self-drive rentals." },
    { q: 'Can I cancel or reschedule my booking?', a: 'Yes — cancellations and rescheduling are free. Just call us with your booking reference at least 24 hours before your pickup time and we\'ll sort it out.' },
    { q: 'What is included in the rental rate?', a: 'The daily rate covers the vehicle only. For self-drive rentals, fuel is not included. If you choose our rent-with-driver option, fuel, toll fees, and parking are all included.' },
    { q: 'Are the vehicles insured?', a: 'Every vehicle in our fleet is fully insured. You are covered from the moment you pick up the car to the moment you return the keys.' },
    { q: 'What happens if the car breaks down?', a: 'In the unlikely event of a breakdown, call us immediately. We provide 24/7 roadside assistance and will either repair the vehicle or arrange a replacement at no extra cost to you.' },
    { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–3 days in advance for regular vehicles. For peak season (holidays, long weekends) we suggest 1–2 weeks ahead. Bookings within 24 hours are subject to availability — call us directly.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {faqs.map((faq, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className={`rm-faq-item ${open === i ? 'rm-faq-open' : ''}`}>
          <button onClick={() => setOpen(open === i ? null : i)} className="rm-faq-btn">
            <span className="rm-faq-q">{faq.q}</span>
            <span className={`rm-faq-icon ${open === i ? 'rm-faq-icon-open' : ''}`}>
              <ChevronDown size={16} />
            </span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}>
                <p className="rm-faq-a">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="rm-main">
      <Navbar />

      {/* ── HERO ── */}
      <section className="rm-hero">
        <div className="rm-hero-bg" />
        <div className="rm-hero-overlay" />
        <div className="rm-hero-grain" />

        <div className="rm-hero-content">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rm-hero-badge">
            <span className="rm-hero-badge-dot" />
            RM Car Rental Services — Philippines
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="rm-hero-title">
            Your next trip<br />
            <span className="rm-hero-title-accent">starts right here.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rm-hero-sub">
            Clean cars, honest prices, and a team that actually picks up the phone.
            We've been putting people on the road since 2022.
          </motion.p>

          <SearchBar />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="rm-hero-trust">
            {['No credit card required', 'Free cancellation', 'Pay on pickup'].map(t => (
              <div key={t} className="rm-hero-trust-item">
                <CheckCircle size={14} color="#34d399" /> {t}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="rm-scroll-hint">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown size={22} color="rgba(255,255,255,0.3)" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="rm-stats-section">
        <div className="rm-container">
          <div className="rm-stats-grid">
            {[
              { number: '500+', label: 'Happy customers', icon: Users },
              { number: '20+', label: 'Cars in fleet', icon: Car },
              { number: '100%', label: 'Insured vehicles', icon: Shield },
              { number: '24/7', label: 'Support available', icon: Headphones },
            ].map(({ number, label, icon: Icon }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rm-stat-card">
                <div className="rm-stat-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="rm-stat-number">{number}</div>
                <div className="rm-stat-label">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section className="rm-section rm-section-light">
        <div className="rm-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rm-section-header">
            <div>
              <div className="rm-section-eyebrow">Our Fleet</div>
              <h2 className="rm-section-title">Pick your ride.</h2>
            </div>
            <Link href="/cars" className="rm-link-arrow">
              View all cars <ArrowRight size={15} />
            </Link>
          </motion.div>
          <Fleet />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="rm-section rm-section-white">
        <div className="rm-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ marginBottom: 64 }}>
            <div className="rm-section-eyebrow">Simple process</div>
            <h2 className="rm-section-title">From browsing to driving<br />in minutes.</h2>
          </motion.div>

          <div className="rm-steps-grid">
            {[
              { n: '01', color: '#fff4ed', accent: '#f97316', title: 'Find the right car', body: 'Browse our fleet by date and vehicle type. Every listing shows real photos, honest specs, and the exact daily rate — no surprise fees.' },
              { n: '02', color: '#f0fdf4', accent: '#22c55e', title: 'Reserve in minutes', body: "Fill in your details and lock in your booking. No credit card, no deposit — just your name and preferred dates. We'll confirm you by phone." },
              { n: '03', color: '#eff6ff', accent: '#3b82f6', title: 'Show up and drive', body: "Come in with your valid ID and booking reference. Pay on pickup, grab the keys, and you're on your way. It really is that simple." },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="rm-step-card" style={{ background: step.color }}>
                <div className="rm-step-num" style={{ color: step.accent }}>{step.n}</div>
                <h3 className="rm-step-title">{step.title}</h3>
                <p className="rm-step-body">{step.body}</p>
                <div className="rm-step-dot" style={{ background: step.accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DRIVER BANNER ── */}
      <section className="rm-section rm-section-light" style={{ paddingTop: 0 }}>
        <div className="rm-container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rm-driver-banner">
            <div className="rm-driver-bg" />
            <div className="rm-driver-overlay" />
            <div className="rm-driver-content">
              <div className="rm-section-eyebrow rm-eyebrow-light">Premium Service</div>
              <h2 className="rm-driver-title">Don't feel like driving?<br />We've got that covered.</h2>
              <p className="rm-driver-sub">
                Our professional drivers know every route. Sit back, relax, and let us handle the road.
                Perfect for airport pickups, city tours, and business trips.
              </p>
              <Link href="/rent-with-driver" className="rm-btn-white">
                Book with a driver <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="rm-section rm-section-white">
        <div className="rm-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <div className="rm-section-eyebrow">Why choose us</div>
            <h2 className="rm-section-title">We do things differently.</h2>
          </motion.div>

          <div className="rm-why-grid">
            {[
              { icon: Car, color: '#fff4ed', iconColor: '#f97316', title: "Our cars won't let you down", body: "Every vehicle is regularly maintained and inspected before each rental. If something isn't right, we fix it before you ever see it." },
              { icon: Zap, color: '#f0fdf4', iconColor: '#22c55e', title: 'What you see is what you pay', body: 'The price on the listing is the price you pay at pickup. No fuel surcharges, no surprise cleaning fees, no fine print.' },
              { icon: Phone, color: '#eff6ff', iconColor: '#3b82f6', title: 'We actually answer the phone', body: "Got a question? Call us. Need to change your booking? Call us. We're real people — not hiding behind a chatbot." },
              { icon: Shield, color: '#fdf4ff', iconColor: '#a855f7', title: 'Your safety is non-negotiable', body: "Every car in our fleet is fully insured. You're covered from the moment you leave to the moment you return the keys." },
            ].map(({ icon: Icon, color, iconColor, title, body }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                className="rm-why-card">
                <div className="rm-why-icon" style={{ background: color }}>
                  <Icon size={20} style={{ color: iconColor }} />
                </div>
                <h3 className="rm-why-title">{title}</h3>
                <p className="rm-why-body">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="rm-section rm-section-dark">
        <div className="rm-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <div className="rm-section-eyebrow rm-eyebrow-light">Customer stories</div>
            <h2 className="rm-section-title rm-title-light">Hear it from our customers.</h2>
          </motion.div>

          <div className="rm-testimonials-grid">
            {[
              { name: 'Juan dela Cruz', location: 'Makati City', stars: 5, text: 'Rented a Fortuner for our Batangas trip. Car was spotless, price was exactly what was listed. Will definitely book again for our next road trip.' },
              { name: 'Maria Santos', location: 'Quezon City', stars: 5, text: "I was skeptical at first booking online, but the process was seamless. Got a confirmation call within the hour. Exactly what a rental should be." },
              { name: 'Pedro Reyes', location: 'Cebu City', stars: 5, text: 'Hired a driver for our family reunion in Tagaytay. The driver was professional, knew the roads perfectly, and the van was comfortable for all 10 of us.' },
              { name: 'Ana Garcia', location: 'Davao City', stars: 5, text: "No hidden charges, no surprise fees when I returned the car. Everything was exactly as advertised. This is how car rental should work." },
              { name: 'Carlo Lim', location: 'Pasig City', stars: 5, text: "Called at 9pm to ask about availability and they actually picked up. Had my booking confirmed 10 minutes later. Fantastic service!" },
              { name: 'Lisa Tan', location: 'Taguig City', stars: 5, text: "Used them for airport pickup with driver service. Driver was on time, helped with luggage, and the car was air-conditioned and comfortable." },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rm-review-card">
                <div className="rm-review-quote">&ldquo;</div>
                <div className="rm-review-stars">
                  {[...Array(review.stars)].map((_, s) => <Star key={s} size={13} fill="#f97316" color="#f97316" />)}
                </div>
                <p className="rm-review-text">{review.text}</p>
                <div className="rm-review-author">
                  <div className="rm-review-avatar">{review.name[0]}</div>
                  <div>
                    <div className="rm-review-name">{review.name}</div>
                    <div className="rm-review-location">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rm-section rm-section-white">
        <div className="rm-container" style={{ maxWidth: 860 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ marginBottom: 64, textAlign: 'center' }}>
            <div className="rm-section-eyebrow" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="rm-section-title" style={{ textAlign: 'center' }}>Common questions.</h2>
          </motion.div>
          <FaqList />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="rm-cta-section">
        <div className="rm-cta-glow rm-cta-glow-1" />
        <div className="rm-cta-glow rm-cta-glow-2" />
        <div className="rm-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="rm-section-eyebrow" style={{ justifyContent: 'center' }}>Ready?</div>
            <h2 className="rm-cta-title">The road isn't going<br />to drive itself.</h2>
            <p className="rm-cta-sub">
              Browse our available cars and make your reservation today.
              Takes less than 5 minutes — and you won't need a credit card.
            </p>
            <div className="rm-cta-btns">
              <Link href="/cars" className="rm-cta-btn-primary">
                Browse cars <ArrowRight size={17} />
              </Link>
              <Link href="/rent-with-driver" className="rm-cta-btn-secondary">
                Rent with driver
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="rm-footer">
        <div className="rm-container">
          <div className="rm-footer-grid">
            <div>
              <BrandLogo size={56} dark />
              <p className="rm-footer-about">
                RM Car Rental Services has been helping people get around since 2022.
                We&apos;re a local business that takes pride in every single rental.
              </p>
            </div>
            <div>
              <p className="rm-footer-col-title">Services</p>
              <div className="rm-footer-links">
                {[{ label: 'Self Drive Rental', href: '/cars' }, { label: 'Rent with Driver', href: '/rent-with-driver' }, { label: 'Browse Fleet', href: '/cars' }].map(l => (
                  <Link key={l.href + l.label} href={l.href} className="rm-footer-link">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="rm-footer-col-title">Account</p>
              <div className="rm-footer-links">
                {[{ label: 'Sign Up', href: '/account' }, { label: 'Log In', href: '/account?tab=login' }, { label: 'My Bookings', href: '/account' }].map(l => (
                  <Link key={l.label} href={l.href} className="rm-footer-link">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="rm-footer-col-title">Contact</p>
              <div className="rm-footer-links">
                <a href="tel:+630000000000" className="rm-footer-link rm-footer-contact">
                  <Phone size={13} /> +63 XXX XXX XXXX
                </a>
                <p className="rm-footer-link rm-footer-contact" style={{ cursor: 'default' }}>
                  <MapPin size={13} /> Philippines
                </p>
                <p className="rm-footer-link rm-footer-contact" style={{ cursor: 'default' }}>
                  <Clock size={13} /> Open 7 days a week
                </p>
              </div>
            </div>
          </div>
          <div className="rm-footer-bottom">
            <p className="rm-footer-copy">© {new Date().getFullYear()} RM Car Rental Services. All rights reserved.</p>
            <Link href="/login" className="rm-footer-admin">Admin Dashboard →</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rm-main { min-height: 100vh; background: #f8f7f4; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        /* NAV */
        .rm-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          transition: all 0.3s ease;
        }
        .rm-nav.scrolled {
          background: rgba(255,255,255,0.97); backdrop-filter: blur(20px);
          border-bottom: 1px solid #e8e8e8; box-shadow: 0 2px 24px rgba(0,0,0,0.07);
        }
        .rm-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between; height: 72px;
        }
        .rm-nav-links { display: flex; align-items: center; gap: 2px; }
        .rm-nav-link {
          padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.85); text-decoration: none; transition: all 0.2s;
        }
        .rm-nav.scrolled .rm-nav-link { color: #374151; }
        .rm-nav-link:hover { background: rgba(255,255,255,0.1); color: white; }
        .rm-nav.scrolled .rm-nav-link:hover { background: #f5f5f5; color: #111; }
        .rm-nav-cta { display: flex; align-items: center; gap: 10px; }
        .rm-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 20px; border-radius: 50px;
          background: rgba(255,255,255,0.1); color: white;
          font-size: 14px; font-weight: 600; text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.25); transition: all 0.2s;
        }
        .rm-nav.scrolled .rm-btn-ghost { background: white; color: #374151; border-color: #e5e7eb; }
        .rm-btn-ghost:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
        .rm-nav.scrolled .rm-btn-ghost:hover { background: #f3f4f6; }
        .rm-btn-orange {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 22px; border-radius: 50px;
          background: #f97316; color: white;
          font-size: 14px; font-weight: 700; text-decoration: none;
          box-shadow: 0 4px 16px rgba(249,115,22,0.4); transition: all 0.2s;
        }
        .rm-btn-orange:hover { background: #ea580c; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(249,115,22,0.5); }
        .rm-hamburger { display: none; padding: 8px; background: transparent; border: none; cursor: pointer; color: white; }
        .rm-nav.scrolled .rm-hamburger { color: #374151; }
        .rm-mobile-menu {
          position: fixed; top: 72px; left: 0; right: 0; z-index: 49;
          background: white; border-bottom: 1px solid #eee;
          padding: 12px 16px 20px; box-shadow: 0 16px 48px rgba(0,0,0,0.12);
        }
        .rm-mobile-link {
          display: block; padding: 13px 16px; border-radius: 10px;
          font-size: 15px; font-weight: 500; color: #333; text-decoration: none; transition: background 0.15s;
        }
        .rm-mobile-link:hover { background: #f8f8f8; }
        .rm-mobile-cta { display: flex; gap: 8px; margin-top: 10px; }
        .rm-mobile-btn-ghost {
          flex: 1; display: block; padding: 14px; border-radius: 50px;
          background: white; color: #374151; text-align: center;
          font-size: 15px; font-weight: 600; text-decoration: none; border: 1.5px solid #e5e7eb;
        }
        .rm-mobile-btn-orange {
          flex: 1; display: block; padding: 14px; border-radius: 50px;
          background: #f97316; color: white; text-align: center;
          font-size: 15px; font-weight: 700; text-decoration: none;
        }

        /* HERO */
        .rm-hero {
          position: relative; min-height: 100vh; display: flex; align-items: center;
          overflow: hidden; padding-top: 72px;
        }
        .rm-hero-bg {
          position: absolute; inset: 0;
          background-image: url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=80);
          background-size: cover; background-position: center;
        }
        .rm-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(155deg, rgba(5,5,10,0.82) 0%, rgba(5,5,10,0.55) 55%, rgba(5,5,10,0.78) 100%);
        }
        .rm-hero-grain {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .rm-hero-content {
          position: relative; z-index: 10; max-width: 1200px;
          margin: 0 auto; padding: 80px 24px; width: 100%;
        }
        .rm-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7);
          letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 28px;
          padding: 8px 16px; border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
        }
        .rm-hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #f97316;
          box-shadow: 0 0 8px rgba(249,115,22,0.8); animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .rm-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(46px, 7.5vw, 94px); font-weight: 800;
          color: white; line-height: 1.07; letter-spacing: -0.025em; margin-bottom: 24px;
        }
        .rm-hero-title-accent { color: #f97316; font-style: italic; }
        .rm-hero-sub {
          font-size: 18px; color: rgba(255,255,255,0.62);
          max-width: 500px; line-height: 1.78; margin-bottom: 52px;
        }
        .rm-hero-trust { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 24px; }
        .rm-hero-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(255,255,255,0.5);
        }
        .rm-scroll-hint {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
        }

        /* SEARCH BAR */
        .rm-search-form {
          background: white; border-radius: 20px; padding: 8px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.28); max-width: 900px; width: 100%;
        }
        .rm-search-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 6px; }
        .rm-search-field {
          padding: 12px 18px; border-radius: 14px; background: #f8f8f8;
          transition: background 0.2s;
        }
        .rm-search-field:focus-within { background: #fff3e8; }
        .rm-search-label {
          font-size: 9px; font-weight: 800; color: #bbb;
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 5px;
        }
        .rm-search-input {
          background: transparent; border: none; outline: none;
          font-size: 14px; font-weight: 600; color: #111; width: 100%; cursor: pointer;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .rm-search-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 28px; border-radius: 14px; background: #f97316; color: white;
          border: none; cursor: pointer; font-weight: 700; font-size: 15px;
          box-shadow: 0 4px 20px rgba(249,115,22,0.45); transition: all 0.2s;
          min-height: 56px; white-space: nowrap; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .rm-search-btn:hover { background: #ea580c; transform: translateY(-1px); }

        /* STATS */
        .rm-stats-section { background: #111; }
        .rm-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: #1e1e1e; }
        .rm-stat-card {
          padding: 40px 32px; background: #111; display: flex; flex-direction: column; gap: 10px;
          transition: background 0.2s;
        }
        .rm-stat-card:hover { background: #161616; }
        .rm-stat-icon-wrap {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(249,115,22,0.12); color: #f97316; margin-bottom: 4px;
        }
        .rm-stat-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 40px; font-weight: 800; color: #f97316; line-height: 1;
        }
        .rm-stat-label { font-size: 13px; color: #555; font-weight: 500; }

        /* SECTIONS */
        .rm-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .rm-section { padding: 100px 0; }
        .rm-section-white { background: white; }
        .rm-section-light { background: #f8f7f4; }
        .rm-section-dark { background: #0d0d0d; }
        .rm-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px; flex-wrap: wrap; gap: 16px;
        }
        .rm-section-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; font-weight: 800; color: #f97316;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;
        }
        .rm-section-eyebrow::before {
          content: ''; display: block; width: 24px; height: 2px; background: #f97316; border-radius: 2px;
        }
        .rm-eyebrow-light { color: rgba(249,115,22,0.8); }
        .rm-eyebrow-light::before { background: rgba(249,115,22,0.6); }
        .rm-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(30px, 4vw, 54px); font-weight: 800; color: #0a0a0a;
          line-height: 1.12; letter-spacing: -0.02em;
        }
        .rm-title-light { color: white; }
        .rm-link-arrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 700; color: #111; text-decoration: none;
          padding-bottom: 3px; border-bottom: 2px solid #f97316; transition: color 0.2s;
        }
        .rm-link-arrow:hover { color: #f97316; }

        /* FLEET CARDS */
        .rm-fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .rm-car-card {
          background: white; border-radius: 22px; overflow: hidden;
          border: 1px solid #ebebeb; transition: all 0.3s ease;
        }
        .rm-car-card-clickable { cursor: pointer; }
        .rm-car-card-clickable:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,0.13); border-color: transparent; }
        .rm-car-image { position: relative; height: 220px; overflow: hidden; background: #f4f4f4; }
        .rm-car-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .rm-car-card-clickable:hover .rm-car-img { transform: scale(1.05); }
        .rm-car-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .rm-car-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s;
        }
        .rm-car-card-clickable:hover .rm-car-overlay { opacity: 1; }
        .rm-car-type-badge {
          position: absolute; top: 14px; left: 14px;
          padding: 5px 12px; border-radius: 50px;
          background: rgba(0,0,0,0.72); color: white;
          font-size: 11px; font-weight: 700; backdrop-filter: blur(8px);
        }
        .rm-car-available-badge {
          position: absolute; top: 14px; right: 14px;
          padding: 5px 12px; border-radius: 50px;
          background: rgba(16,185,129,0.15); color: #10b981;
          font-size: 11px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3);
          backdrop-filter: blur(8px);
        }
        .rm-car-info { padding: 20px 22px 22px; }
        .rm-car-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px; font-weight: 700; color: #111; margin-bottom: 8px; line-height: 1.3;
        }
        .rm-car-card-clickable:hover .rm-car-name { color: #f97316; }
        .rm-car-specs { display: flex; gap: 18px; margin-bottom: 18px; }
        .rm-car-spec { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #999; }
        .rm-car-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid #f3f4f6; }
        .rm-car-price { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 800; color: #111; }
        .rm-car-per-day { font-size: 12px; color: #bbb; margin-left: 4px; }
        .rm-car-book-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 50px;
          background: #f97316; color: white; font-size: 13px; font-weight: 700;
          transition: all 0.2s;
        }
        .rm-car-book-btn-demo { background: #f3f4f6; color: #aaa; }
        .rm-car-card-clickable:hover .rm-car-book-btn:not(.rm-car-book-btn-demo) { background: #ea580c; transform: scale(1.04); }
        .rm-car-skeleton { background: white; border-radius: 22px; overflow: hidden; border: 1px solid #ebebeb; }
        .rm-skeleton-img { height: 220px; background: #f0f0f0; }
        .rm-skeleton-line { height: 16px; border-radius: 6px; background: #f0f0f0; }
        .rm-skeleton-btn { height: 40px; border-radius: 50px; background: #f0f0f0; margin-top: 4px; }
        .rm-demo-notice {
          display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
          padding: 14px 20px; border-radius: 14px;
          background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; font-size: 13px;
        }

        /* HOW IT WORKS */
        .rm-steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .rm-step-card {
          position: relative; padding: 48px 40px 52px; border-radius: 24px; overflow: hidden;
        }
        .rm-step-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 80px; font-weight: 800; line-height: 1; margin-bottom: 24px;
          opacity: 0.18; letter-spacing: -0.04em;
        }
        .rm-step-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px; font-weight: 700; color: #111; margin-bottom: 14px; line-height: 1.3;
        }
        .rm-step-body { font-size: 15px; color: #666; line-height: 1.8; }
        .rm-step-dot {
          position: absolute; bottom: 28px; right: 32px;
          width: 10px; height: 10px; border-radius: 50%; opacity: 0.6;
        }

        /* DRIVER BANNER */
        .rm-driver-banner {
          position: relative; border-radius: 28px; overflow: hidden;
          min-height: 420px; display: flex; align-items: center;
        }
        .rm-driver-bg {
          position: absolute; inset: 0;
          background-image: url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80);
          background-size: cover; background-position: center 40%;
        }
        .rm-driver-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(5,5,10,0.94) 45%, rgba(5,5,10,0.2) 100%);
        }
        .rm-driver-content { position: relative; z-index: 1; padding: clamp(40px, 5vw, 72px); }
        .rm-driver-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 52px); font-weight: 800; color: white;
          line-height: 1.2; margin-bottom: 18px; letter-spacing: -0.02em; max-width: 500px;
        }
        .rm-driver-sub { font-size: 16px; color: rgba(255,255,255,0.58); line-height: 1.78; margin-bottom: 36px; max-width: 460px; }
        .rm-btn-white {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 30px; border-radius: 50px;
          background: white; color: #111;
          font-size: 15px; font-weight: 700; text-decoration: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3); transition: all 0.2s;
        }
        .rm-btn-white:hover { background: #f97316; color: white; transform: translateY(-2px); }

        /* WHY US */
        .rm-why-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
        .rm-why-card {
          padding: 36px; border-radius: 20px; border: 1px solid #f0f0f0;
          transition: all 0.3s; background: white;
        }
        .rm-why-card:hover { border-color: transparent; box-shadow: 0 16px 48px rgba(0,0,0,0.09); transform: translateY(-3px); }
        .rm-why-icon {
          width: 52px; height: 52px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
        }
        .rm-why-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px; font-weight: 700; color: #111; margin-bottom: 10px; line-height: 1.35;
        }
        .rm-why-body { font-size: 15px; color: #777; line-height: 1.78; }

        /* TESTIMONIALS */
        .rm-testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .rm-review-card {
          background: #161616; border-radius: 20px; padding: 32px 28px;
          display: flex; flex-direction: column; gap: 14px;
          border: 1px solid #1e1e1e; transition: border-color 0.2s;
        }
        .rm-review-card:hover { border-color: rgba(249,115,22,0.3); }
        .rm-review-quote {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 48px; color: rgba(249,115,22,0.25); line-height: 1; margin-bottom: -8px;
        }
        .rm-review-stars { display: flex; gap: 3px; }
        .rm-review-text { font-size: 14px; color: #888; line-height: 1.8; flex: 1; }
        .rm-review-author { display: flex; align-items: center; gap: 12px; padding-top: 4px; border-top: 1px solid #222; }
        .rm-review-avatar {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #f97316, #ea580c);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 800; color: white;
        }
        .rm-review-name { font-size: 14px; font-weight: 700; color: white; }
        .rm-review-location { font-size: 12px; color: #444; margin-top: 1px; }

        /* FAQ */
        .rm-faq-item {
          border-radius: 16px; overflow: hidden;
          border: 1.5px solid #ececec; transition: border-color 0.2s;
        }
        .rm-faq-open { border-color: #f97316; }
        .rm-faq-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 22px 28px; background: white; border: none; cursor: pointer;
          text-align: left; gap: 16px; transition: background 0.2s;
        }
        .rm-faq-open .rm-faq-btn { background: #fff7ed; }
        .rm-faq-q {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 16px; font-weight: 700; color: #111; line-height: 1.4;
        }
        .rm-faq-icon {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #f3f3f3; color: #888; transition: all 0.25s;
        }
        .rm-faq-open .rm-faq-icon { background: #f97316; color: white; transform: rotate(180deg); }
        .rm-faq-a {
          padding: 0 28px 24px; background: #fff7ed;
          font-size: 15px; color: #555; line-height: 1.78;
          border-top: 1px solid #fed7aa;
        }

        /* CTA */
        .rm-cta-section {
          position: relative; padding: 120px 24px;
          background: #0a0a0a; overflow: hidden;
        }
        .rm-cta-glow {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .rm-cta-glow-1 { width: 400px; height: 400px; background: rgba(249,115,22,0.12); top: -100px; left: -100px; }
        .rm-cta-glow-2 { width: 300px; height: 300px; background: rgba(249,115,22,0.08); bottom: -80px; right: 10%; }
        .rm-cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5.5vw, 72px); font-weight: 800; color: white;
          line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px;
        }
        .rm-cta-sub { font-size: 17px; color: #555; line-height: 1.75; margin-bottom: 48px; max-width: 560px; margin-left: auto; margin-right: auto; }
        .rm-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .rm-cta-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 50px;
          background: #f97316; color: white;
          font-size: 16px; font-weight: 700; text-decoration: none;
          box-shadow: 0 8px 32px rgba(249,115,22,0.45); transition: all 0.22s;
        }
        .rm-cta-btn-primary:hover { background: #ea580c; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(249,115,22,0.55); }
        .rm-cta-btn-secondary {
          display: inline-flex; align-items: center;
          padding: 16px 36px; border-radius: 50px;
          background: transparent; color: #555;
          font-size: 16px; font-weight: 700; text-decoration: none;
          border: 2px solid #2a2a2a; transition: all 0.22s;
        }
        .rm-cta-btn-secondary:hover { border-color: #555; color: white; transform: translateY(-2px); }

        /* FOOTER */
        .rm-footer { background: #080808; padding: 80px 24px 40px; }
        .rm-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 64px; }
        .rm-footer-about { font-size: 13px; color: #444; line-height: 1.85; margin-top: 20px; max-width: 280px; }
        .rm-footer-col-title {
          font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.7);
          margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.14em;
        }
        .rm-footer-links { display: flex; flex-direction: column; gap: 12px; }
        .rm-footer-link { font-size: 13px; color: #3a3a3a; text-decoration: none; transition: color 0.2s; }
        .rm-footer-link:hover { color: white; }
        .rm-footer-contact { display: flex; align-items: center; gap: 8px; }
        .rm-footer-bottom { border-top: 1px solid #161616; padding-top: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .rm-footer-copy { font-size: 12px; color: #333; }
        .rm-footer-admin { font-size: 12px; color: #2a2a2a; text-decoration: none; transition: color 0.2s; }
        .rm-footer-admin:hover { color: #555; }

        /* UTILS */
        @keyframes rm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .rm-pulse { animation: rm-pulse 1.6s ease-in-out infinite; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .rm-footer-grid { grid-template-columns: 1fr 1fr; }
          .rm-why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .rm-nav-links, .rm-nav-cta { display: none !important; }
          .rm-hamburger { display: flex !important; }
          .rm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rm-steps-grid { grid-template-columns: 1fr !important; }
          .rm-testimonials-grid { grid-template-columns: 1fr !important; }
          .rm-footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .rm-search-grid { grid-template-columns: 1fr 1fr !important; }
          .rm-fleet-grid { grid-template-columns: 1fr !important; }
          .rm-cta-title { font-size: 36px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .rm-testimonials-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rm-steps-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .rm-search-grid { grid-template-columns: 1fr !important; }
          .rm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  )
}
