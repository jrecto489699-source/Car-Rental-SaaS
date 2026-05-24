'use client'

import { motion } from 'framer-motion'
import {
  Car, Calendar, Receipt, BarChart3, Clock, Users,
  FileText, PieChart, Cloud, Smartphone, Shield, Zap,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: <Car size={24} />,
    title: 'Fleet Management',
    description: 'Track all your vehicles in one place. Add photos, documents, maintenance records, and real-time availability status.',
    color: 'blue',
    size: 'large',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Booking Automation',
    description: 'Create, manage, and track bookings with automated duration calculations and calendar views.',
    color: 'purple',
    size: 'medium',
  },
  {
    icon: <Receipt size={24} />,
    title: 'Expense Tracking',
    description: 'Categorize fuel, maintenance, insurance and all operational costs.',
    color: 'amber',
    size: 'medium',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Profit Analytics',
    description: 'Real-time revenue vs expense tracking with visual charts and monthly/yearly breakdowns.',
    color: 'emerald',
    size: 'large',
  },
  {
    icon: <Clock size={24} />,
    title: 'Vehicle Availability',
    description: 'See which cars are available, rented, or in maintenance at a glance.',
    color: 'cyan',
    size: 'small',
  },
  {
    icon: <Users size={24} />,
    title: 'Customer Database',
    description: 'Store customer profiles, ID uploads, contact info, and complete booking history.',
    color: 'purple',
    size: 'small',
  },
  {
    icon: <FileText size={24} />,
    title: 'Invoice Generation',
    description: 'Generate professional rental invoices and receipts in one click.',
    color: 'blue',
    size: 'small',
  },
  {
    icon: <PieChart size={24} />,
    title: 'Reports Dashboard',
    description: 'Monthly and yearly reports with downloadable summaries.',
    color: 'rose',
    size: 'small',
  },
  {
    icon: <Cloud size={24} />,
    title: 'Secure Cloud Storage',
    description: 'All data backed up securely with Supabase PostgreSQL.',
    color: 'cyan',
    size: 'small',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile Responsive',
    description: 'Manage your rental business from any device, anywhere.',
    color: 'emerald',
    size: 'small',
  },
]

const colorMap = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
}

const glowMap = {
  blue: 'hover:shadow-blue-500/10',
  purple: 'hover:shadow-purple-500/10',
  cyan: 'hover:shadow-cyan-500/10',
  emerald: 'hover:shadow-emerald-500/10',
  amber: 'hover:shadow-amber-500/10',
  rose: 'hover:shadow-rose-500/10',
}

function FeatureCard({ feature, index }) {
  const iconStyle = colorMap[feature.color] || colorMap.blue
  const glowStyle = glowMap[feature.color] || glowMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`group relative p-6 rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm
        hover:border-white/15 hover:shadow-xl hover:-translate-y-px transition-all duration-300 ${glowStyle}
        ${feature.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${iconStyle} transition-transform group-hover:scale-110 duration-300`}>
        {feature.icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-slate-500" />
      </div>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-4"
          >
            <Zap size={12} />
            Packed with power
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4"
          >
            Everything you need to
            <br />
            <span className="gradient-text">run your fleet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto"
          >
            From first booking to final invoice — DriveFlow handles every part of your rental operation.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
          {features.slice(0, 2).map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
          {features.slice(2, 10).map((feature, i) => (
            <FeatureCard key={i + 2} feature={{ ...feature, size: 'medium' }} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  )
}
