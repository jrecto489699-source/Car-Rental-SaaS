'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, TrendingUp } from 'lucide-react'

const metrics = [
  { value: '500+', label: 'Rental Businesses', icon: <Globe size={20} className="text-blue-400" /> },
  { value: '₱2.8B+', label: 'Revenue Managed', icon: <TrendingUp size={20} className="text-emerald-400" /> },
  { value: '50K+', label: 'Bookings Processed', icon: <Zap size={20} className="text-amber-400" /> },
  { value: '99.9%', label: 'Uptime SLA', icon: <Shield size={20} className="text-purple-400" /> },
]

const brands = [
  'Santos Car Rental',
  'PremiumDrive MNL',
  'QuickRide PH',
  'MegaFleet Corp',
  'SpeedRent Cebu',
  'AutoHub Davao',
]

export default function TrustSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-white/8 bg-slate-900/40 backdrop-blur-sm hover:border-white/15 transition-colors"
            >
              <div className="flex justify-center mb-3">{metric.icon}</div>
              <p className="text-3xl font-black text-white mb-1">{metric.value}</p>
              <p className="text-sm text-slate-400">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand logos (text-based) */}
        <div className="text-center">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-8">
            Trusted by leading rental businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-slate-600 font-semibold text-sm hover:text-slate-400 transition-colors cursor-default"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
