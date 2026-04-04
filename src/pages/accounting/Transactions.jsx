import { useState, useEffect } from 'react'
import { accountingApi } from '../../api/accountingApi'
import { pdfApi, downloadPdf } from '../../api/pdfApi'

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                    <p className="text-gray-500 text-sm mt-1">{transactions.length} transactions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportPdf}
                        disabled={pdfLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {pdfLoading ? 'Generating...' : 'Export PDF'}
                    </button>
                    <button
                        onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                        + Add Transaction
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                    <p className="text-sm text-green-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                    <p className="text-sm text-red-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700">${totalExpense.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                    <p className="text-sm text-blue-600">Net</p>
                    <p className={`text-2xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                        ${(totalIncome - totalExpense).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Reference</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Type</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-8 text-gray-400">No transactions found</td></tr>
                        ) : transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-gray-500 text-xs">{t.reference}</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{t.category}</td>
                                <td className={`px-6 py-3 font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                </td>
                                <td className="px-6 py-3 text-gray-500">{t.payment_method.replace('_', ' ')}</td>
                                <td className="px-6 py-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button onClick={() => openEdit(t)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Transaction' : 'Add New Transaction'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input type="text" required value={form.category}
                                        onChange={e => setForm({...form, category: e.target.value})}
                                        placeholder="e.g. Sales, Rent, Salary"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input type="number" required min="0" step="0.01" value={form.amount}
                                        onChange={e => setForm({...form, amount: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" required value={form.date}
                                        onChange={e => setForm({...form, date: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="card">Card</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows="2" value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update Transaction' : 'Add Transaction'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}