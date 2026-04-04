import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { accountingApi } from '../../api/accountingApi'

export default function AccountingDashboard() {
    const navigate        = useNavigate()
    const [stats, setStats]   = useState(null)
    const [monthly, setMonthly] = useState([])

    useEffect(() => {
        accountingApi.getStats().then(r => setStats(r.data))
        accountingApi.getMonthlyReport().then(r => setMonthly(r.data))
    }, [])

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Accounting</h2>
                    <p className="text-gray-500 text-sm mt-1">Track income, expenses and financial reports</p>
                </div>
                <button
                    onClick={() => navigate('/accounting/transactions')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    + Add Transaction
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Income',       value: '$' + Number(stats?.total_income  ?? 0).toFixed(2), color: 'green' },
                    { label: 'Total Expenses',     value: '$' + Number(stats?.total_expense ?? 0).toFixed(2), color: 'red'   },
                    { label: 'Net Profit',         value: '$' + Number(stats?.net_profit    ?? 0).toFixed(2), color: 'blue'  },
                    { label: 'Total Transactions', value: stats?.total_transactions ?? 0,                     color: 'gray'  },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${
                            card.color === 'green' ? 'text-green-600' :
                            card.color === 'red'   ? 'text-red-600'   :
                            card.color === 'blue'  ? 'text-blue-600'  :
                            'text-gray-800'
                        }`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Report Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Monthly Report</h3>
                    <button
                        onClick={() => navigate('/accounting/transactions')}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        View All Transactions
                    </button>
                </div>
                {monthly.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-400 text-sm">No transactions yet</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Month</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Income</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Expenses</th>
                                <th className="text-left px-6 py-3 text-gray-500 font-medium">Net</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {monthly.map((m, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-800">{monthNames[m.month]} {m.year}</td>
                                    <td className="px-6 py-3 text-green-600">${Number(m.income).toFixed(2)}</td>
                                    <td className="px-6 py-3 text-red-600">${Number(m.expense).toFixed(2)}</td>
                                    <td className={`px-6 py-3 font-medium ${(m.income - m.expense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${(Number(m.income) - Number(m.expense)).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}