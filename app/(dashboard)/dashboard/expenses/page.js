'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Search, Receipt, Fuel, Wrench, Shield,
  Trash2, Edit2, TrendingDown
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { formatDate, cn } from '@/lib/utils'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import toast from 'react-hot-toast'

const DEMO_EXPENSES = [
  { id: 1, category: 'Fuel', description: 'Fuel refill - Toyota Fortuner', amount: 3200, date: '2025-05-22', vehicle: 'Toyota Fortuner', receipt_no: 'OR-001' },
  { id: 2, category: 'Maintenance', description: 'Oil change - Honda Civic', amount: 1800, date: '2025-05-20', vehicle: 'Honda Civic', receipt_no: 'OR-002' },
  { id: 3, category: 'Insurance', description: 'Annual insurance renewal - Ford Ranger', amount: 18000, date: '2025-05-15', vehicle: 'Ford Ranger', receipt_no: 'OR-003' },
  { id: 4, category: 'Repair', description: 'Brake pad replacement - Mitsubishi Montero', amount: 4500, date: '2025-05-14', vehicle: 'Mitsubishi Montero', receipt_no: 'OR-004' },
  { id: 5, category: 'Fuel', description: 'Fuel refill - Ford Ranger', amount: 2800, date: '2025-05-12', vehicle: 'Ford Ranger', receipt_no: 'OR-005' },
  { id: 6, category: 'Cleaning', description: 'Detailing service - 3 vehicles', amount: 2400, date: '2025-05-10', vehicle: 'Multiple', receipt_no: 'OR-006' },
  { id: 7, category: 'Registration', description: 'LTO registration renewal', amount: 6500, date: '2025-05-08', vehicle: 'Toyota Vios', receipt_no: 'OR-007' },
  { id: 8, category: 'Salary', description: 'Staff salary - May 2025', amount: 25000, date: '2025-05-31', vehicle: 'N/A', receipt_no: 'OR-008' },
]

const categoryIcons = {
  Fuel: <Fuel size={16} />,
  Maintenance: <Wrench size={16} />,
  Insurance: <Shield size={16} />,
  Repair: <Wrench size={16} />,
  default: <Receipt size={16} />,
}

const categoryColors = {
  Fuel:         'text-amber-700 bg-amber-50 border-amber-200',
  Maintenance:  'text-blue-700 bg-blue-50 border-blue-200',
  Insurance:    'text-purple-700 bg-purple-50 border-purple-200',
  Repair:       'text-rose-700 bg-rose-50 border-rose-200',
  Cleaning:     'text-cyan-700 bg-cyan-50 border-cyan-200',
  Registration: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Salary:       'text-gray-700 bg-gray-100 border-gray-200',
  default:      'text-gray-700 bg-gray-100 border-gray-200',
}

function ExpenseForm({ expense, onSave, onCancel }) {
  const [form, setForm] = useState({
    category: expense?.category || 'Fuel',
    description: expense?.description || '',
    amount: expense?.amount || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
    vehicle: expense?.vehicle || '',
    receipt_no: expense?.receipt_no || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    onSave(form)
    setLoading(false)
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Category" value={form.category} onChange={update('category')} options={EXPENSE_CATEGORIES} placeholder={null} />
        <Input label="Amount (₱)" type="number" value={form.amount} onChange={update('amount')} placeholder="0" required />
        <Input label="Description" value={form.description} onChange={update('description')} placeholder="Brief description" required className="sm:col-span-2" />
        <Input label="Date" type="date" value={form.date} onChange={update('date')} required />
        <Input label="Vehicle (optional)" value={form.vehicle} onChange={update('vehicle')} placeholder="Toyota Fortuner" />
        <Input label="Receipt / OR Number" value={form.receipt_no} onChange={update('receipt_no')} placeholder="OR-001" />
      </div>
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{expense ? 'Update' : 'Add Expense'}</Button>
      </div>
    </form>
  )
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(DEMO_EXPENSES)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = expenses.filter(e => {
    const matchSearch = !search || `${e.description} ${e.category} ${e.vehicle}`.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || e.category === categoryFilter
    return matchSearch && matchCategory
  })

  const totalExpenses = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

  const categoryTotals = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    const total = expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0)
    if (total > 0) acc.push({ name: cat, total })
    return acc
  }, []).sort((a, b) => b.total - a.total).slice(0, 6)

  const handleSave = (data) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...data } : e))
      toast.success('Expense updated!')
    } else {
      setExpenses(prev => [...prev, { ...data, id: Date.now() }])
      toast.success('Expense recorded!')
    }
    setShowModal(false)
    setEditingExpense(null)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track all operational costs</p>
        </div>
        <Button onClick={() => { setEditingExpense(null); setShowModal(true) }} icon={<Plus size={16} />}>
          Add Expense
        </Button>
      </motion.div>

      {/* Summary + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <TrendingDown size={18} className="text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₱{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {categoryTotals.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-semibold">{cat.name}</span>
                <span className="text-xs font-bold text-gray-900">₱{cat.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={categoryTotals} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {categoryTotals.map((entry, i) => (
                  <Cell key={i} fill={['#F59E0B', '#3B82F6', '#8B5CF6', '#F43F5E', '#06B6D4', '#10B981'][i % 6]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..."
            className="w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 py-2.5 pl-10 pr-4 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm font-medium"
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-semibold py-2.5 px-3 focus:outline-none focus:border-orange-400 appearance-none shadow-sm">
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Receipt size={28} />} title="No expenses found" description="Start tracking your operational costs." action={() => setShowModal(true)} actionLabel="Add Expense" />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Category', 'Description', 'Vehicle', 'Amount', 'Date', 'Receipt', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((expense, i) => {
                const catStyle = categoryColors[expense.category] || categoryColors.default
                return (
                  <motion.tr key={expense.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold', catStyle)}>
                        {categoryIcons[expense.category] || categoryIcons.default}
                        {expense.category}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900 font-semibold">{expense.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-600 font-medium">{expense.vehicle}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-rose-600">-₱{Number(expense.amount).toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-700 font-semibold">{formatDate(expense.date)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono text-gray-500 font-semibold">{expense.receipt_no}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditingExpense(expense); setShowModal(true) }} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(expense.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingExpense(null) }} title={editingExpense ? 'Edit Expense' : 'Add Expense'} size="md">
        <ExpenseForm expense={editingExpense} onSave={handleSave} onCancel={() => { setShowModal(false); setEditingExpense(null) }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Expense" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { setExpenses(prev => prev.filter(e => e.id !== deleteConfirm)); setDeleteConfirm(null); toast.success('Expense deleted') }}>Delete</Button>
        </>}>
        <p className="text-sm text-gray-600 font-medium">Are you sure you want to delete this expense record?</p>
      </Modal>
    </div>
  )
}
