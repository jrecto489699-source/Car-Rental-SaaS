'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, redirectMessage }) {
  const [tab, setTab] = useState('signup') // 'signup' | 'login'
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const su = (k) => (e) => setSignupForm(f => ({ ...f, [k]: e.target.value }))
  const li = (k) => (e) => setLoginForm(f => ({ ...f, [k]: e.target.value }))

  const handleSignup = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!signupForm.name.trim()) errs.name = 'Name is required'
    if (!signupForm.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Invalid email'
    if (!signupForm.phone.trim()) errs.phone = 'Phone is required'
    if (!signupForm.password) errs.password = 'Password is required'
    else if (signupForm.password.length < 6) errs.password = 'Minimum 6 characters'
    if (signupForm.password !== signupForm.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      // Use server-side signup to auto-confirm email
      const res = await fetch('/api/auth/customer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupForm.email,
          password: signupForm.password,
          full_name: signupForm.name,
          phone: signupForm.phone,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        if (res.status === 409) {
          toast.error('Email already registered. Please log in instead.')
          setTab('login')
          setLoginForm(f => ({ ...f, email: signupForm.email }))
          return
        }
        throw new Error(result.error || 'Sign up failed')
      }

      // Sign in immediately after creation
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: signupForm.email,
        password: signupForm.password,
      })
      if (signInError) throw signInError

      toast.success('Account created! You can now book.')
      onSuccess({ name: signupForm.name, email: signupForm.email, phone: signupForm.phone })
      onClose()
    } catch (err) {
      toast.error(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!loginForm.email) errs.lemail = 'Email is required'
    if (!loginForm.password) errs.lpassword = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })
      if (error) throw error
      const meta = data.user?.user_metadata || {}
      toast.success('Welcome back!')
      onSuccess({
        name: meta.full_name || loginForm.email.split('@')[0],
        email: loginForm.email,
        phone: meta.phone || '',
      })
      onClose()
    } catch (err) {
      toast.error(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto" style={{ background: 'white', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.22)', overflow: 'hidden' }}>

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 text-center" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-xl transition-colors hover:bg-gray-100">
                  <X size={16} style={{ color: '#9ca3af' }} />
                </button>
                <div className="mx-auto mb-3 flex items-center justify-center">
                  <BrandLogo size={56} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#111827' }}>
                  {tab === 'signup' ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                  {redirectMessage || 'Sign up to book this vehicle'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex mx-6 mt-4 rounded-xl p-1 gap-1" style={{ background: '#f3f4f6' }}>
                {[{ key: 'signup', label: 'Sign Up' }, { key: 'login', label: 'Log In' }].map(t => (
                  <button key={t.key} onClick={() => { setTab(t.key); setErrors({}) }}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: tab === t.key ? 'white' : 'transparent',
                      color: tab === t.key ? '#111827' : '#6b7280',
                      boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Forms */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">
                  {tab === 'signup' ? (
                    <motion.form key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
                      onSubmit={handleSignup} className="space-y-3">

                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Full Name</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type="text" value={signupForm.name} onChange={su('name')} placeholder="Juan dela Cruz"
                            className="w-full text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.name ? '#fca5a5' : '#e5e7eb'}`, color: '#111827', background: errors.name ? '#fff5f5' : 'white' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.name ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        {errors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Email Address</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type="email" value={signupForm.email} onChange={su('email')} placeholder="juan@email.com"
                            className="w-full text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.email ? '#fca5a5' : '#e5e7eb'}`, color: '#111827', background: errors.email ? '#fff5f5' : 'white' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.email ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Phone Number</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type="tel" value={signupForm.phone} onChange={su('phone')} placeholder="09XXXXXXXXX"
                            className="w-full text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.phone ? '#fca5a5' : '#e5e7eb'}`, color: '#111827', background: errors.phone ? '#fff5f5' : 'white' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.phone ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        {errors.phone && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.phone}</p>}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Password</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type={showPass ? 'text' : 'password'} value={signupForm.password} onChange={su('password')} placeholder="Min. 6 characters"
                            className="w-full text-sm py-3 pl-10 pr-10 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.password ? '#fca5a5' : '#e5e7eb'}`, color: '#111827', background: errors.password ? '#fff5f5' : 'white' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.password ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password}</p>}
                      </div>

                      {/* Confirm */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Confirm Password</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type={showPass ? 'text' : 'password'} value={signupForm.confirm} onChange={su('confirm')} placeholder="Re-enter password"
                            className="w-full text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.confirm ? '#fca5a5' : '#e5e7eb'}`, color: '#111827', background: errors.confirm ? '#fff5f5' : 'white' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.confirm ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        {errors.confirm && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.confirm}</p>}
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all mt-1"
                        style={{ background: loading ? '#fdba74' : 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: loading ? 'none' : '0 4px 14px rgba(249,115,22,0.35)', marginTop: 8 }}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Create Account & Book</>}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form key="login" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
                      onSubmit={handleLogin} className="space-y-3">

                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Email Address</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type="email" value={loginForm.email} onChange={li('email')} placeholder="juan@email.com"
                            className="w-full text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.lemail ? '#fca5a5' : '#e5e7eb'}`, color: '#111827' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.lemail ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                        </div>
                        {errors.lemail && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.lemail}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Password</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                          <input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={li('password')} placeholder="Your password"
                            className="w-full text-sm py-3 pl-10 pr-10 rounded-xl outline-none transition-all"
                            style={{ border: `1.5px solid ${errors.lpassword ? '#fca5a5' : '#e5e7eb'}`, color: '#111827' }}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
                            onBlur={e => { e.target.style.borderColor = errors.lpassword ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {errors.lpassword && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.lpassword}</p>}
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                        style={{ background: loading ? '#fdba74' : 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: loading ? 'none' : '0 4px 14px rgba(249,115,22,0.35)', marginTop: 8 }}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Log In & Continue</>}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer note */}
              <div className="px-6 pb-5 text-center">
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  By continuing, you agree to our{' '}
                  <span className="font-medium" style={{ color: '#f97316' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span className="font-medium" style={{ color: '#f97316' }}>Privacy Policy</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
