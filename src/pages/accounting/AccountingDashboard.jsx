import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { accountingApi } from '../../api/accountingApi'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  PlusCircle,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function AccountingDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [monthly, setMonthly] = useState([])

    useEffect(() => {
        accountingApi.getStats().then(r => setStats(r.data))
        accountingApi.getMonthlyReport().then(r => setMonthly(r.data))
    }, [])

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
                            <Wallet className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Accounting</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">Track income, expenses and financial reports</p>
                    </div>
                    <button
                        onClick={() => navigate('/accounting/transactions')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Transaction
                    </button>
                </div>

                {/* Stats Cards - Changed to rounded-md */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-700" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            ${Number(stats?.total_income ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</span>
                            </div>
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            ${Number(stats?.total_expense ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net Profit</span>
                            </div>
                            {(stats?.net_profit ?? 0) >= 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600" />
                            )}
                        </div>
                        <p className={`text-2xl font-bold mb-0.5 ${(stats?.net_profit ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            ${Number(stats?.net_profit ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transactions</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.total_transactions ?? 0}
                        </p>
                    </div>
                </div>
.
                {/* Monthly Report Table - Changed to rounded-md */}
                <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-black text-lg">Monthly Report</h3>
                        <button
                            onClick={() => navigate('/accounting/transactions')}
                            className="text-emerald-700 text-sm hover:text-emerald-800 transition-colors flex items-center gap-1 font-medium"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View All Transactions
                        </button>
                    </div>
                    {monthly.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <Wallet className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No transactions yet</p>
                            <p className="text-gray-400 text-xs mt-1">Click "Add Transaction" to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-emerald-50/50">
                                    <tr>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Month</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Income</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Expenses</th>
                                        <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {monthly.map((m, i) => {
                                        const net = Number(m.income) - Number(m.expense)
                                        return (
                                            <tr key={i} className="hover:bg-white/40 transition-colors">
                                                <td className="px-5 py-3 font-medium text-gray-800">
                                                    {monthNames[m.month]} {m.year}
                                                </td>
                                                <td className="px-5 py-3 text-emerald-700 font-medium">
                                                    ${Number(m.income).toFixed(2)}
                                                </td>
                                                <td className="px-5 py-3 text-red-600 font-medium">
                                                    ${Number(m.expense).toFixed(2)}
                                                </td>
                                                <td className={`px-5 py-3 font-semibold ${net >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                                    ${net.toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}