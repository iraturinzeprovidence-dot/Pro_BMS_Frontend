import { useState, useEffect } from 'react'
import { accountingApi } from '../../api/accountingApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  X,
  Calendar,
  CreditCard,
  Tag,
  FileSignature,
  AlertCircle
} from 'lucide-react'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch]             = useState('')
    const [typeFilter, setTypeFilter]     = useState('')
    const [loading, setLoading]           = useState(true)
    const [showModal, setShowModal]       = useState(false)
    const [editing, setEditing]           = useState(null)
    const [error, setError]               = useState('')
    const [pdfLoading, setPdfLoading]     = useState(false)
    const [form, setForm]                 = useState({
        type: 'income', category: '', amount: '',
        description: '', date: '', payment_method: 'cash',
    })

    const fetchTransactions = async () => {
        setLoading(true)
        const r = await accountingApi.getTransactions({ search, type: typeFilter })
        setTransactions(r.data)
        setLoading(false)
    }

    useEffect(() => { fetchTransactions() }, [search, typeFilter])

    const openCreate = () => {
        setEditing(null)
        setForm({
            type: 'income', category: '', amount: '',
            description: '', date: new Date().toISOString().split('T')[0], payment_method: 'cash',
        })
        setError('')
        setShowModal(true)
    }

    const openEdit = (t) => {
        setEditing(t)
        setForm({
            type: t.type, category: t.category, amount: t.amount,
            description: t.description ?? '', date: t.date, payment_method: t.payment_method,
        })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await accountingApi.updateTransaction(editing.id, form)
            } else {
                await accountingApi.createTransaction(form)
            }
            setShowModal(false)
            fetchTransactions()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return
        await accountingApi.deleteTransaction(id)
        fetchTransactions()
    }

    const handleExportPdf = async () => {
        setPdfLoading(true)
        try {
            const r = await pdfApi.exportTransactions({})
            downloadPdf(r.data, 'transactions-report.pdf')
        } catch (err) {
            alert('Failed to export PDF. Please try again.')
        } finally {
            setPdfLoading(false)
        }
    }

    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t)  => s + Number(t.amount), 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

    return (
        <div 
            className="relative min-h-screen w-full"
            style={{
                backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Transactions</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {transactions.length} transactions recorded
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportPdf}
                            disabled={pdfLoading}
                            className="bg-purple-700 hover:bg-purple-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            {pdfLoading ? 'Generating...' : 'Export PDF'}
                        </button>
                        <button
                            onClick={openCreate}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-700" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700 mb-0.5">
                            ${totalIncome.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mb-0.5">
                            ${totalExpense.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net</span>
                            </div>
                        </div>
                        <p className={`text-2xl font-bold mb-0.5 ${(totalIncome - totalExpense) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            ${(totalIncome - totalExpense).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1 md:flex-initial md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Reference</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Type</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Category</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Payment</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">Loading transactions...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No transactions found</p>
                                            <p className="text-gray-400 text-xs mt-1">Click "Add Transaction" to get started</p>
                                        </td>
                                    </tr>
                                ) : transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/40 transition-colors">
                                        <td className="px-5 py-3 text-gray-500 text-xs font-mono">{t.reference}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                t.type === 'income' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{t.category}</td>
                                        <td className={`px-5 py-3 font-semibold ${
                                            t.type === 'income' ? 'text-emerald-700' : 'text-red-600'
                                        }`}>
                                            {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 capitalize">{t.payment_method.replace('_', ' ')}</td>
                                        <td className="px-5 py-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-5 py-3 flex gap-2">
                                            <button 
                                                onClick={() => openEdit(t)} 
                                                className="p-1 text-emerald-600 hover:text-emerald-700 transition rounded"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(t.id)} 
                                                className="p-1 text-red-500 hover:text-red-600 transition rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal - Increased internal spacing from borders */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-2xl mx-auto">
                            <div className="flex justify-between items-center px-10 py-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">
                                    {editing ? 'Edit Transaction' : 'Add New Transaction'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-10 mt-6 bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <select 
                                            value={form.type} 
                                            onChange={e => setForm({...form, type: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Tag className="w-3.5 h-3.5 inline mr-1" />
                                            Category
                                        </label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={form.category}
                                            onChange={e => setForm({...form, category: e.target.value})}
                                            placeholder="e.g. Sales, Rent, Salary"
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="0" 
                                            step="0.01" 
                                            value={form.amount}
                                            onChange={e => setForm({...form, amount: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                            Date
                                        </label>
                                        <input 
                                            type="date" 
                                            required 
                                            value={form.date}
                                            onChange={e => setForm({...form, date: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                                            Payment Method
                                        </label>
                                        <select 
                                            value={form.payment_method} 
                                            onChange={e => setForm({...form, payment_method: e.target.value})}
                                            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="card">Card</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileSignature className="w-3.5 h-3.5 inline mr-1" />
                                        Description
                                    </label>
                                    <textarea 
                                        rows="3" 
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                        placeholder="Optional description..."
                                    />
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-md text-sm transition"
                                    >
                                        {editing ? 'Update Transaction' : 'Add Transaction'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-md text-sm hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}