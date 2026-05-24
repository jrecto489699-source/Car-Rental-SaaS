'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-cyan-600/10 backdrop-blur-sm overflow-hidden text-center"
        >
          {/* Background glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-24 bg-purple-600/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
              <Zap size={12} fill="currentColor" />
              Start in under 5 minutes
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to transform
              <br />
              your rental business?
            </h2>

            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join 500+ rental businesses already using DriveFlow to manage their fleet, bookings, and revenue.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-px"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 hover:border-white/25 text-white font-medium text-base transition-all duration-200 hover:bg-white/5"
              >
                View Live Demo
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              No credit card required · Free forever plan available · Setup in 5 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
