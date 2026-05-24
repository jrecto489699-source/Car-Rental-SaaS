'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PRICING_PLANS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const accentMap = {
  blue: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25',
    check: 'text-blue-400',
    glow: '',
  },
  purple: {
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/5',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    btn: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/25',
    check: 'text-purple-400',
    glow: 'shadow-2xl shadow-purple-500/20',
  },
  cyan: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/5',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/25',
    check: 'text-cyan-400',
    glow: '',
  },
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/6 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium mb-4"
          >
            <Sparkles size={12} />
            No monthly fees, ever
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white mb-4"
          >
            Simple, transparent
            <br />
            <span className="gradient-text">pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            Pay once. Use forever. Free updates included.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan, i) => {
            const styles = accentMap[plan.accent] || accentMap.blue

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'relative p-6 rounded-2xl border transition-all duration-300',
                  'bg-slate-900/60 backdrop-blur-sm hover:-translate-y-1',
                  styles.border,
                  styles.bg,
                  styles.glow,
                  plan.popular && 'scale-105 md:scale-[1.02]'
                )}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className={cn('absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium border', styles.badge)}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan name & price */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-sm text-slate-400 mb-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check size={16} className={cn('mt-0.5 shrink-0', styles.check)} />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={cn(
                    'flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white',
                    'transition-all duration-200 shadow-lg hover:-translate-y-px',
                    styles.btn
                  )}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Money back */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          30-day money-back guarantee · Secure payment via Stripe · Instant access
        </motion.p>
      </div>
    </section>
  )
}
