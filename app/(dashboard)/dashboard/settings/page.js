'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, User, Bell, Lock, Save, Upload,
  Eye, EyeOff, Zap, Globe, Phone, Mail, MapPin
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'company',       label: 'Company Profile', icon: Building2 },
  { id: 'account',       label: 'Account',          icon: User },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'security',      label: 'Security',         icon: Lock },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const [saving, setSaving] = useState(false)

  const [company, setCompany] = useState({
    name: 'My Car Rental Co.',
    email: 'info@mycarrental.com',
    phone: '+63 917 123 4567',
    address: 'Makati City, Metro Manila, Philippines',
    website: 'www.mycarrental.com',
    description: 'Premium car rental services in Metro Manila and nearby provinces.',
  })

  const [notifs, setNotifs] = useState({
    new_booking: true,
    booking_confirmed: true,
    booking_cancelled: false,
    payment_received: true,
    low_availability: true,
    maintenance_due: false,
    email_digest: false,
  })

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  const handleSaveCompany = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Company profile updated!')
    setSaving(false)
  }

  const handleSaveNotifs = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    toast.success('Notification preferences saved!')
    setSaving(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.new.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: passwords.new })
      if (error) throw error
      toast.success('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn('relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none', checked ? 'bg-orange-500' : 'bg-gray-200')}>
      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-1')} />
    </button>
  )

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Manage your account and business preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left',
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}>
                  <Icon size={16} className={activeTab === tab.id ? 'text-white' : 'text-gray-400'} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1">
          {activeTab === 'company' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-6">Company Profile</h2>

              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-200">
                  <Zap size={28} className="text-white" fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Company Logo</p>
                  <p className="text-xs text-gray-500 mb-2">PNG, JPG up to 2MB</p>
                  <button className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                    <Upload size={12} />
                    Upload new logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Company Name" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} icon={<Building2 size={15} />} className="sm:col-span-2" />
                <Input label="Business Email" type="email" value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} icon={<Mail size={15} />} />
                <Input label="Phone Number" value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} icon={<Phone size={15} />} />
                <Input label="Website" value={company.website} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} icon={<Globe size={15} />} />
                <Input label="Address" value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} icon={<MapPin size={15} />} />
                <Textarea label="Business Description" value={company.description} onChange={e => setCompany(c => ({ ...c, description: e.target.value }))} rows={3} className="sm:col-span-2" />
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveCompany} loading={saving} icon={<Save size={14} />}>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Your full name" defaultValue="Admin User" icon={<User size={15} />} className="sm:col-span-2" />
                <Input label="Email Address" type="email" placeholder="you@example.com" defaultValue="admin@driveflow.app" icon={<Mail size={15} />} />
                <Input label="Phone" placeholder="09XXXXXXXXX" icon={<Phone size={15} />} />
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => { setSaving(true); setTimeout(() => { toast.success('Account updated!'); setSaving(false) }, 800) }} loading={saving} icon={<Save size={14} />}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: 'new_booking',       label: 'New Booking',          desc: 'When a new booking is created' },
                  { key: 'booking_confirmed', label: 'Booking Confirmed',    desc: 'When a booking is confirmed' },
                  { key: 'booking_cancelled', label: 'Booking Cancelled',    desc: 'When a booking is cancelled' },
                  { key: 'payment_received',  label: 'Payment Received',     desc: 'When a payment is recorded' },
                  { key: 'low_availability',  label: 'Low Availability Alert', desc: 'When fewer than 3 vehicles are available' },
                  { key: 'maintenance_due',   label: 'Maintenance Due',      desc: 'Upcoming vehicle maintenance reminders' },
                  { key: 'email_digest',      label: 'Weekly Email Digest',  desc: 'Weekly summary of business performance' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
                    </div>
                    <ToggleSwitch checked={notifs[key]} onChange={(val) => setNotifs(n => ({ ...n, [key]: val }))} />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveNotifs} loading={saving} icon={<Save size={14} />}>Save Preferences</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="max-w-sm space-y-4">
                {[
                  { key: 'current', label: 'Current Password' },
                  { key: 'new',     label: 'New Password' },
                  { key: 'confirm', label: 'Confirm New Password' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={passwords[key]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-900 py-3 pl-10 pr-11 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm font-medium"
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <Button type="submit" loading={saving} icon={<Lock size={14} />}>Update Password</Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Danger Zone</h3>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
                  <p className="text-sm font-bold text-gray-900 mb-1">Delete Account</p>
                  <p className="text-xs text-gray-600 font-medium mb-3">Permanently delete your account and all associated data.</p>
                  <button className="text-xs text-rose-600 hover:text-rose-700 font-bold border border-rose-300 hover:border-rose-400 px-3 py-1.5 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
