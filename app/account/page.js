'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle, Zap, Car } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />}
        {children}
      </div>
      {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

function AccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/cars'
  const defaultTab = searchParams.get('tab') || 'login'

  const [tab, setTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [signupDone, setSignupDone] = useState(false)

  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const su = (k) => (e) => setSignupForm(f => ({ ...f, [k]: e.target.value }))
  const li = (k) => (e) => setLoginForm(f => ({ ...f, [k]: e.target.value }))

  // Check if already logged in
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.user_metadata?.role !== 'admin') {
        router.replace(redirectTo)
      }
    })
  }, [router, redirectTo])

  const handleSignup = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!signupForm.name.trim()) errs.name = 'Name is required'
    if (!signupForm.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Invalid email'
    if (!signupForm.phone.trim()) errs.phone = 'Phone is required'
    if (!signupForm.password) errs.password = 'Password is required'
    else if (signupForm.password.length < 6) errs.password = 'Min. 6 characters'
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
          toast.error('Email already registered. Please log in.')
          setTab('login')
          setLoginForm(f => ({ ...f, email: signupForm.email }))
          return
        }
        throw new Error(result.error || 'Signup failed')
      }

      // Now sign in immediately
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: signupForm.email,
        password: signupForm.password,
      })
      if (signInError) throw signInError

      setSignupDone(true)
      toast.success('Welcome to DriveFlow!')
      setTimeout(() => router.push(redirectTo), 1200)
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

      const role = data.user?.user_metadata?.role
      if (role === 'admin') {
        await supabase.auth.signOut()
        toast.error('Please use the admin login page.')
        return
      }

      toast.success('Welcome back!')
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      toast.error(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const inputBase = {
    width: '100%',
    fontSize: 14,
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 38,
    paddingRight: 16,
    borderRadius: 12,
    border: '1.5px solid #e5e7eb',
    color: '#111827',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  const inputProps = (field) => ({
    style: { ...inputBase, borderColor: errors[field] ? '#fca5a5' : '#e5e7eb', background: errors[field] ? '#fff5f5' : 'white' },
    onFocus: e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' },
    onBlur: e => { e.target.style.borderColor = errors[field] ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' },
  })

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-10 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(145deg, #111827 0%, #1f2937 40%, #111827 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 }} />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 20px rgba(249,115,22,0.4)' }}>
            <Zap size={18} className="text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-white">Drive<span style={{ color: '#f97316' }}>Flow</span></span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">
              Your next adventure<br />starts here.
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              Browse our fleet of premium vehicles and book in minutes. Simple, fast, reliable.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Car, title: 'Wide Selection', desc: 'Sedans, SUVs, vans & more' },
              { icon: CheckCircle, title: 'Instant Booking', desc: 'Confirmed in under 2 minutes' },
              { icon: Phone, title: '24/7 Support', desc: 'We\'re always here to help' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <Icon size={16} style={{ color: '#f97316' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin link */}
        <div className="relative z-10">
          <Link href="/login" className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: '#4b5563' }}
            onMouseEnter={e => e.target.style.color = '#9ca3af'}
            onMouseLeave={e => e.target.style.color = '#4b5563'}>
            Admin? Dashboard login →
          </Link>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <Zap size={16} className="text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold" style={{ color: '#111827' }}>Drive<span style={{ color: '#f97316' }}>Flow</span></span>
            </Link>
            <Link href="/login" className="text-xs font-medium" style={{ color: '#9ca3af' }}>Admin Login →</Link>
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black mb-1" style={{ color: '#111827' }}>
                {tab === 'signup' ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {tab === 'signup' ? 'Start booking vehicles today' : 'Sign in to your DriveFlow account'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: '#f3f4f6' }}>
              {[{ key: 'login', label: 'Log In' }, { key: 'signup', label: 'Sign Up' }].map(t => (
                <button key={t.key}
                  onClick={() => { setTab(t.key); setErrors({}) }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: tab === t.key ? 'white' : 'transparent',
                    color: tab === t.key ? '#111827' : '#6b7280',
                    boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'signup' ? (
                <motion.form key="signup"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }} onSubmit={handleSignup}
                  className="space-y-4">

                  {signupDone ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="py-10 text-center">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                        <CheckCircle size={32} style={{ color: '#22c55e' }} />
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#111827' }}>Account created!</h3>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Redirecting you now...</p>
                    </motion.div>
                  ) : (
                    <>
                      <Field label="Full Name" icon={User} error={errors.name}>
                        <input type="text" value={signupForm.name} onChange={su('name')} placeholder="Juan dela Cruz"
                          style={{ ...inputBase, paddingLeft: 38, borderColor: errors.name ? '#fca5a5' : '#e5e7eb', background: errors.name ? '#fff5f5' : 'white' }}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                          onBlur={e => { e.target.style.borderColor = errors.name ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                      </Field>

                      <Field label="Email Address" icon={Mail} error={errors.email}>
                        <input type="email" value={signupForm.email} onChange={su('email')} placeholder="juan@email.com"
                          style={{ ...inputBase, paddingLeft: 38, borderColor: errors.email ? '#fca5a5' : '#e5e7eb', background: errors.email ? '#fff5f5' : 'white' }}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                          onBlur={e => { e.target.style.borderColor = errors.email ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                      </Field>

                      <Field label="Phone Number" icon={Phone} error={errors.phone}>
                        <input type="tel" value={signupForm.phone} onChange={su('phone')} placeholder="09XXXXXXXXX"
                          style={{ ...inputBase, paddingLeft: 38, borderColor: errors.phone ? '#fca5a5' : '#e5e7eb', background: errors.phone ? '#fff5f5' : 'white' }}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                          onBlur={e => { e.target.style.borderColor = errors.phone ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                      </Field>

                      <Field label="Password" icon={Lock} error={errors.password}>
                        <input type={showPass ? 'text' : 'password'} value={signupForm.password} onChange={su('password')} placeholder="Min. 6 characters"
                          style={{ ...inputBase, paddingLeft: 38, paddingRight: 40, borderColor: errors.password ? '#fca5a5' : '#e5e7eb', background: errors.password ? '#fff5f5' : 'white' }}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                          onBlur={e => { e.target.style.borderColor = errors.password ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </Field>

                      <Field label="Confirm Password" icon={Lock} error={errors.confirm}>
                        <input type={showPass ? 'text' : 'password'} value={signupForm.confirm} onChange={su('confirm')} placeholder="Re-enter password"
                          style={{ ...inputBase, paddingLeft: 38, borderColor: errors.confirm ? '#fca5a5' : '#e5e7eb', background: errors.confirm ? '#fff5f5' : 'white' }}
                          onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                          onBlur={e => { e.target.style.borderColor = errors.confirm ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                      </Field>

                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                        style={{
                          background: loading ? '#fed7aa' : 'linear-gradient(135deg, #f97316, #ea580c)',
                          boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.4)',
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}>
                        {loading ? <Loader2 size={17} className="animate-spin" /> : <><User size={16} /> Create Account</>}
                      </button>
                    </>
                  )}
                </motion.form>
              ) : (
                <motion.form key="login"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }} onSubmit={handleLogin}
                  className="space-y-4">

                  <Field label="Email Address" icon={Mail} error={errors.lemail}>
                    <input type="email" value={loginForm.email} onChange={li('email')} placeholder="juan@email.com"
                      style={{ ...inputBase, paddingLeft: 38, borderColor: errors.lemail ? '#fca5a5' : '#e5e7eb', background: errors.lemail ? '#fff5f5' : 'white' }}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                      onBlur={e => { e.target.style.borderColor = errors.lemail ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                  </Field>

                  <Field label="Password" icon={Lock} error={errors.lpassword}>
                    <input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={li('password')} placeholder="Your password"
                      style={{ ...inputBase, paddingLeft: 38, paddingRight: 40, borderColor: errors.lpassword ? '#fca5a5' : '#e5e7eb', background: errors.lpassword ? '#fff5f5' : 'white' }}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                      onBlur={e => { e.target.style.borderColor = errors.lpassword ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </Field>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                    style={{
                      background: loading ? '#fed7aa' : 'linear-gradient(135deg, #f97316, #ea580c)',
                      boxShadow: loading ? 'none' : '0 4px 16px rgba(249,115,22,0.4)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}>
                    {loading ? <Loader2 size={17} className="animate-spin" /> : <><ArrowRight size={16} /> Sign In</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-xs" style={{ color: '#9ca3af' }}>
              By continuing, you agree to our{' '}
              <span className="font-medium" style={{ color: '#f97316' }}>Terms</span> and{' '}
              <span className="font-medium" style={{ color: '#f97316' }}>Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  )
}
