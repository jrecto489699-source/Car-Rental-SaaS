'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Fuel, Settings2, Search, X, Zap, ArrowRight, SlidersHorizontal, MapPin, Users, ChevronDown, Truck, Bus, CarFront } from 'lucide-react'
import RMLogo from '@/components/RMLogo'
import CustomerAuthModal from '@/components/CustomerAuthModal'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const DEMO_CARS = [
  { id: 'demo-1', make: 'Toyota', model: 'Fortuner', year: 2023, plate: 'ABC 1234', type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 3500, color: 'Pearl White', mileage: 12000, notes: '4x4, leather seats, sunroof, 7-seater', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
  { id: 'demo-2', make: 'Honda', model: 'Civic', year: 2022, plate: 'XYZ 5678', type: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2200, color: 'Phantom Black', mileage: 28000, notes: 'Fuel efficient, Apple CarPlay, dash cam', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80' },
  { id: 'demo-3', make: 'Ford', model: 'Ranger', year: 2023, plate: 'DEF 9012', type: 'Pickup Truck', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 4000, color: 'Silver', mileage: 8000, notes: '4x4, cargo bed liner', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { id: 'demo-4', make: 'Toyota', model: 'HiAce', year: 2022, plate: 'GHI 3456', type: 'Van', transmission: 'Manual', fuel: 'Diesel', price_per_day: 4500, color: 'White', mileage: 35000, notes: '15-seater, great for groups', image_url: 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=800&q=80' },
  { id: 'demo-5', make: 'Hyundai', model: 'Tucson', year: 2023, plate: 'JKL 7890', type: 'SUV', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 3000, color: 'Deep Blue', mileage: 15000, notes: 'Smart cruise control, panoramic roof', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80' },
  { id: 'demo-6', make: 'Mitsubishi', model: 'Xpander', year: 2022, plate: 'MNO 1234', type: 'Minivan', transmission: 'Automatic', fuel: 'Gasoline', price_per_day: 2800, color: 'Graphite', mileage: 22000, notes: '7-seater, foldable rear seats', image_url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80' },
  { id: 'demo-7', make: 'Suzuki', model: 'Jimny', year: 2023, plate: 'PQR 5678', type: 'SUV', transmission: 'Manual', fuel: 'Gasoline', price_per_day: 2500, color: 'Kinetic Yellow', mileage: 5000, notes: 'Compact 4x4, adventure trips', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80' },
  { id: 'demo-8', make: 'Toyota', model: 'Innova', year: 2022, plate: 'STU 9012', type: 'Minivan', transmission: 'Automatic', fuel: 'Diesel', price_per_day: 3200, color: 'Bronze Mica', mileage: 40000, notes: '8-seater MPV, spacious', image_url: 'https://images.unsplash.com/photo-1544636331-e5c2e6574b13?w=800&q=80' },
]

const TYPES = ['All Types', 'Sedan', 'SUV', 'Hatchback', 'Van', 'Pickup Truck', 'Minivan']
const TRANSMISSIONS = ['Any', 'Automatic', 'Manual']
const FUELS = ['Any', 'Gasoline', 'Diesel', 'Electric', 'Hybrid']
const PRICE_RANGES = [
  { label: 'Any price', max: '' },
  { label: 'Under ₱2,000', max: '2000' },
  { label: 'Under ₱3,000', max: '3000' },
  { label: 'Under ₱5,000', max: '5000' },
  { label: 'Under ₱8,000', max: '8000' },
]

const TYPE_ICONS = {
  SUV: CarFront, Sedan: Car, Van: Bus, 'Pickup Truck': Truck, Minivan: Bus, Hatchback: Car, MPV: Users, default: Car
}

function TypeIcon({ type, size = 14 }) {
  const Icon = TYPE_ICONS[type] || TYPE_ICONS.default
  return <Icon size={size} />
}

function CarCard({ car, index, onBook }) {
  const isDemo = car.id.startsWith('demo-')

  const handleClick = () => {
    if (isDemo) {
      toast('These are sample vehicles. Add real cars in your admin dashboard.')
      return
    }
    onBook(car.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }} onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-white"
      style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.14)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}>

      {/* Image */}
      <div className="relative h-52 overflow-hidden" style={{ background: '#f9fafb' }}>
        {car.image_url
          ? <img src={car.image_url} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">{TYPE_ICONS[car.type] || TYPE_ICONS.default}</div>
        }
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(17,24,39,0.82)', color: 'white', backdropFilter: 'blur(8px)' }}>{car.type}</span>
        </div>
        <div className="absolute top-3 right-3">
          {isDemo
            ? <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(249,115,22,0.15)', color: '#ea580c', border: '1px solid rgba(249,115,22,0.3)' }}>Sample</span>
            : <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} /> Available
            </span>
          }
        </div>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 60%)' }} />
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-bold transition-colors group-hover:text-orange-500" style={{ color: '#111827' }}>
            {car.year} {car.make} {car.model}
          </h3>
          {car.color && <span className="text-xs mt-0.5 shrink-0 ml-2" style={{ color: '#9ca3af' }}>{car.color}</span>}
        </div>

        {!isDemo && <p className="text-xs font-mono mb-3" style={{ color: '#d1d5db' }}>Plate: {car.plate}</p>}

        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#6b7280' }}><Settings2 size={12} />{car.transmission}</span>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#6b7280' }}><Fuel size={12} />{car.fuel}</span>
          {car.mileage > 0 && <span className="text-xs font-medium" style={{ color: '#6b7280' }}>⊙ {car.mileage.toLocaleString()} km</span>}
        </div>

        {car.notes && <p className="text-xs mb-4 line-clamp-1" style={{ color: '#9ca3af' }}>{car.notes}</p>}

        <div className="pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          <div className="mb-3">
            <span className="text-xl font-black" style={{ color: '#111827' }}>₱{Number(car.price_per_day).toLocaleString()}</span>
            <span className="text-xs ml-1" style={{ color: '#9ca3af' }}>/day</span>
          </div>
          <div className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all group-hover:-translate-y-px"
            style={{ background: isDemo ? '#f3f4f6' : 'linear-gradient(135deg, #f97316, #ea580c)', color: isDemo ? '#9ca3af' : 'white', boxShadow: isDemo ? 'none' : '0 4px 14px rgba(249,115,22,0.35)' }}>
            {isDemo ? 'Sample' : 'Book Now'} {!isDemo && <ArrowRight size={14} />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CarsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [pendingCarId, setPendingCarId] = useState(null)

  const handleBook = async (carId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push(`/cars/${carId}`)
    } else {
      setPendingCarId(carId)
      setAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    if (pendingCarId) router.push(`/cars/${pendingCarId}`)
  }

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'All Types',
    transmission: 'Any',
    fuel: 'Any',
    max_price: '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    search: '',
  })

  const hasFilters = filters.type !== 'All Types' || filters.transmission !== 'Any' || filters.fuel !== 'Any' || filters.max_price !== '' || filters.from !== '' || filters.to !== ''

  const fetchCars = useCallback(async () => {
    setLoading(true)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)
    try {
      const params = new URLSearchParams()
      if (filters.type && filters.type !== 'All Types') params.set('type', filters.type)
      if (filters.transmission && filters.transmission !== 'Any') params.set('transmission', filters.transmission)
      if (filters.fuel && filters.fuel !== 'Any') params.set('fuel', filters.fuel)
      if (filters.max_price) params.set('max_price', filters.max_price)
      if (filters.from) params.set('from', filters.from)
      if (filters.to) params.set('to', filters.to)

      const res = await fetch(`/api/cars?${params}`, { signal: controller.signal })
      clearTimeout(timeout)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const real = data.vehicles || []
      if (real.length === 0) { setCars(DEMO_CARS); setIsDemo(true) }
      else { setCars(real); setIsDemo(false) }
    } catch {
      clearTimeout(timeout)
      setCars(DEMO_CARS); setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [filters.type, filters.transmission, filters.fuel, filters.max_price, filters.from, filters.to])

  useEffect(() => { fetchCars() }, [fetchCars])

  const displayed = filters.search
    ? cars.filter(c => `${c.make} ${c.model} ${c.year} ${c.type}`.toLowerCase().includes(filters.search.toLowerCase()))
    : cars

  const clearFilters = () => setFilters({ type: 'All Types', transmission: 'Any', fuel: 'Any', max_price: '', from: '', to: '', search: '' })
  const set = (k) => (v) => setFilters(f => ({ ...f, [k]: v }))

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px' }}>
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <RMLogo size={48} />
            </Link>

            {/* Breadcrumb */}
            <span style={{ color: '#d1d5db' }}>/</span>
            <span className="text-sm font-semibold" style={{ color: '#374151' }}>Browse Cars</span>

            {/* Search */}
            <div className="relative flex-1 max-w-md ml-2">
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input type="text" placeholder="Search make, model, type..." value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl focus:outline-none transition-all"
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827' }}
                onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                onBlur={e => { e.target.style.background = '#f3f4f6'; e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
            </div>

            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: filtersOpen || hasFilters ? 'rgba(249,115,22,0.1)' : '#f3f4f6',
                border: filtersOpen || hasFilters ? '1px solid rgba(249,115,22,0.3)' : '1px solid #e5e7eb',
                color: filtersOpen || hasFilters ? '#ea580c' : '#374151',
              }}>
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: '#f97316' }}>!</span>}
            </button>

          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="pt-4 pb-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Pickup Date', type: 'date', value: filters.from, min: today, onChange: v => setFilters(f => ({ ...f, from: v })) },
                    { label: 'Return Date', type: 'date', value: filters.to, min: filters.from || today, onChange: v => setFilters(f => ({ ...f, to: v })) },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b7280' }}>{f.label}</label>
                      <input type={f.type} value={f.value} min={f.min} onChange={e => f.onChange(e.target.value)}
                        className="w-full text-sm py-2 px-3 rounded-xl focus:outline-none"
                        style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827' }} />
                    </div>
                  ))}
                  {[
                    { label: 'Vehicle Type', value: filters.type, opts: TYPES, onChange: e => set('type')(e.target.value) },
                    { label: 'Transmission', value: filters.transmission, opts: TRANSMISSIONS, onChange: e => set('transmission')(e.target.value) },
                    { label: 'Fuel', value: filters.fuel, opts: FUELS, onChange: e => set('fuel')(e.target.value) },
                    { label: 'Max Price', value: filters.max_price, opts: null, onChange: null },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b7280' }}>{f.label}</label>
                      {f.label === 'Max Price' ? (
                        <select value={filters.max_price} onChange={e => set('max_price')(e.target.value)} className="w-full text-sm py-2 px-3 rounded-xl focus:outline-none" style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827' }}>
                          {PRICE_RANGES.map(p => <option key={p.label} value={p.max}>{p.label}</option>)}
                        </select>
                      ) : (
                        <select value={f.value} onChange={f.onChange} className="w-full text-sm py-2 px-3 rounded-xl focus:outline-none" style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827' }}>
                          {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors" style={{ color: '#ef4444' }}>
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#111827' }}>
              {loading ? 'Finding available cars...' : `${displayed.length} car${displayed.length !== 1 ? 's' : ''} available`}
            </h1>
            {filters.from && filters.to && (
              <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                {new Date(filters.from).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} — {new Date(filters.to).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: '#9ca3af' }}
              onMouseEnter={e => e.target.style.color = '#111827'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {isDemo && !loading && (
          <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm" style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412' }}>
            <SlidersHorizontal size={14} style={{ flexShrink: 0 }} /> <strong>Sample vehicles shown.</strong> Connect Supabase and add real vehicles in your admin dashboard.
          </div>
        )}

        {/* Type quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {TYPES.map(t => (
            <button key={t} onClick={() => set('type')(t)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: filters.type === t ? '#f97316' : 'white',
                color: filters.type === t ? 'white' : '#374151',
                border: filters.type === t ? '1px solid #f97316' : '1px solid #e5e7eb',
                boxShadow: filters.type === t ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
              }}>
              <TypeIcon type={t} size={13} /> {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ border: '1px solid #e5e7eb' }}>
                <div className="h-48" style={{ background: '#f3f4f6' }} />
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded w-3/4" style={{ background: '#e5e7eb' }} />
                  <div className="h-3 rounded w-1/2" style={{ background: '#e5e7eb' }} />
                  <div className="h-9 rounded-xl" style={{ background: '#e5e7eb' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>No cars match your search</h3>
            <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Try adjusting your filters or dates</p>
            <button onClick={clearFilters} className="px-6 py-3 rounded-xl text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map((car, i) => <CarCard key={car.id} car={car} index={i} onBook={handleBook} />)}
          </div>
        )}
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

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <CarsContent />
    </Suspense>
  )
}
