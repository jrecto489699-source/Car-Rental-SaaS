'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, TrendingUp, Car, Users, DollarSign, Star } from 'lucide-react'

const floatingCards = [
  {
    id: 1,
    title: 'Monthly Revenue',
    value: '₱485,000',
    change: '+24.5%',
    icon: <DollarSign size={16} className="text-emerald-400" />,
    color: 'emerald',
    position: 'top-8 -left-4 md:-left-12',
    delay: 0,
  },
  {
    id: 2,
    title: 'Active Rentals',
    value: '24',
    change: '8 returning today',
    icon: <Car size={16} className="text-blue-400" />,
    color: 'blue',
    position: 'top-32 -right-4 md:-right-12',
    delay: 0.2,
  },
  {
    id: 3,
    title: 'New Customers',
    value: '+18',
    change: 'This week',
    icon: <Users size={16} className="text-purple-400" />,
    color: 'purple',
    position: 'bottom-16 -left-4 md:-left-16',
    delay: 0.4,
  },
  {
    id: 4,
    title: 'Avg Rating',
    value: '4.9 / 5',
    change: '186 reviews',
    icon: <Star size={16} className="text-amber-400" fill="currentColor" />,
    color: 'amber',
    position: 'bottom-4 -right-2 md:-right-8',
    delay: 0.3,
  },
]

function FloatingCard({ card }) {
  const colorMap = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: card.delay + 0.8, duration: 0.4 }}
      className={`absolute ${card.position} z-10`}
      style={{ animation: `float ${5 + card.delay}s ease-in-out ${card.delay}s infinite` }}
    >
      <div className={`glass-card-strong px-3 py-2.5 border ${colorMap[card.color]} shadow-xl min-w-[140px]`}>
        <div className="flex items-center gap-2 mb-1">
          {card.icon}
          <span className="text-xs text-slate-400">{card.title}</span>
        </div>
        <p className="text-sm font-bold text-white">{card.value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{card.change}</p>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Now with AI-powered booking automation
            <ArrowRight size={14} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
          >
            All-in-One{' '}
            <span className="relative">
              <span className="gradient-text">Car Rental</span>
            </span>
            <br />
            Management System
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Manage bookings, fleet, customers, income, and expenses from one{' '}
            <span className="text-white font-medium">powerful cloud platform</span>.
            Built for modern rental businesses that want to grow.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-px"
            >
              Start Free Today
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 hover:border-white/25 text-white font-semibold text-base transition-all duration-200 hover:bg-white/5 hover:-translate-y-px"
            >
              <Play size={16} className="text-blue-400" fill="currentColor" />
              Live Demo
            </Link>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Floating cards */}
            {floatingCards.map((card) => (
              <FloatingCard key={card.id} card={card} />
            ))}

            {/* Dashboard mockup */}
            <div className="relative glass-card-strong border border-white/10 overflow-hidden shadow-2xl shadow-black/60">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-slate-800/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-900/60 rounded-lg px-3 py-1 text-xs text-slate-500 text-center max-w-64 mx-auto">
                    driveflow.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content preview */}
              <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950">
                {/* Top stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Revenue', value: '₱485K', color: 'blue' },
                    { label: 'Bookings', value: '342', color: 'purple' },
                    { label: 'Fleet', value: '24 units', color: 'cyan' },
                    { label: 'Profit', value: '₱50.3K', color: 'emerald' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="bg-slate-800/60 rounded-xl p-3 border border-white/8"
                    >
                      <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.value}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-slate-700/50">
                        <div className={`h-1 rounded-full bg-${stat.color}-500`} style={{ width: `${60 + i * 10}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="bg-slate-800/40 rounded-xl p-4 border border-white/8 mb-3">
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: `rgba(59, 130, 246, ${0.3 + (i / 11) * 0.5})`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                      <span key={m} className="text-xs text-slate-600">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 rounded-xl p-3 border border-white/8">
                    <p className="text-xs text-slate-400 mb-2">Recent Bookings</p>
                    {[
                      { car: 'Toyota Fortuner', status: 'active' },
                      { car: 'Honda Civic', status: 'confirmed' },
                      { car: 'Ford Ranger', status: 'pending' },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-1">
                        <span className="text-xs text-white">{b.car}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                          b.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3 border border-white/8">
                    <p className="text-xs text-slate-400 mb-2">Fleet Status</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Available</span>
                        <span className="text-emerald-400">16</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700">
                        <div className="h-1.5 w-2/3 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Rented</span>
                        <span className="text-blue-400">6</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700">
                        <div className="h-1.5 w-1/4 rounded-full bg-blue-500" />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Maintenance</span>
                        <span className="text-amber-400">2</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700">
                        <div className="h-1.5 w-[12%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect under dashboard */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-600/20 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
