import { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { analyticsApi } from '../../api/analyticsApi'
import {
    LayoutDashboard,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    UserCheck,
    Truck,
    BarChart3,
    PieChart,
    LineChart
} from 'lucide-react'

ChartJS.register(
    CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend
)

const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AnalyticsDashboard() {
    const [overview,      setOverview]      = useState(null)
    const [salesChart,    setSalesChart]    = useState([])
    const [expensesChart, setExpensesChart] = useState([])
    const [topProducts,   setTopProducts]   = useState([])
    const [topCustomers,  setTopCustomers]  = useState([])
    const [orderStatus,   setOrderStatus]   = useState([])
    const [inventoryChart, setInventoryChart] = useState([])

    useEffect(() => {
        analyticsApi.getOverview().then(r => setOverview(r.data))
        analyticsApi.getSalesChart().then(r => setSalesChart(r.data))
        analyticsApi.getExpensesChart().then(r => setExpensesChart(r.data))
        analyticsApi.getTopProducts().then(r => setTopProducts(r.data))
        analyticsApi.getTopCustomers().then(r => setTopCustomers(r.data))
        analyticsApi.getOrderStatus().then(r => setOrderStatus(r.data))
        analyticsApi.getInventoryChart().then(r => setInventoryChart(r.data))
    }, [])

    const salesData = {
        labels: salesChart.map(m => `${monthNames[m.month]} ${m.year}`),
        datasets: [{
            label: 'Revenue ($)',
            data: salesChart.map(m => Number(m.revenue).toFixed(2)),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 6,
        }]
    }

    const expensesData = {
        labels: expensesChart.map(m => `${monthNames[m.month]} ${m.year}`),
        datasets: [
            {
                label: 'Income ($)',
                data: expensesChart.map(m => Number(m.income).toFixed(2)),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Expenses ($)',
                data: expensesChart.map(m => Number(m.expense).toFixed(2)),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.1)',
                tension: 0.4,
                fill: true,
            },
        ]
    }

    const orderStatusData = {
        labels: orderStatus.map(s => s.status),
        datasets: [{
            data: orderStatus.map(s => s.count),
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'],
            borderWidth: 0,
        }]
    }

    const inventoryData = {
        labels: inventoryChart.map(c => c.name),
        datasets: [{
            label: 'Products',
            data: inventoryChart.map(c => c.products_count),
            backgroundColor: [
                '#10b981', '#3b82f6', '#f59e0b',
                '#8b5cf6', '#ec4899', '#14b8a6',
            ],
            borderRadius: 6,
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: '#e5e7eb' } } }
    }

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: { y: { beginAtZero: true, grid: { color: '#e5e7eb' } } }
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } },
    }

    const kpiCards = [
        { label: 'Total Revenue', value: '$' + Number(overview?.total_revenue ?? 0).toFixed(2), icon: DollarSign, color: 'text-emerald-600' },
        { label: 'Net Profit', value: '$' + Number(overview?.net_profit ?? 0).toFixed(2), icon: TrendingUp, color: 'text-green-600' },
        { label: 'Total Orders', value: overview?.total_orders ?? 0, icon: ShoppingCart, color: 'text-blue-600' },
        { label: 'Total Customers', value: overview?.total_customers ?? 0, icon: Users, color: 'text-purple-600' },
        { label: 'Total Products', value: overview?.total_products ?? 0, icon: Package, color: 'text-emerald-600' },
        { label: 'Low Stock', value: overview?.low_stock_products ?? 0, icon: AlertTriangle, color: 'text-red-600' },
        { label: 'Employees', value: overview?.active_employees ?? 0, icon: UserCheck, color: 'text-gray-600' },
        { label: 'Total Suppliers', value: overview?.total_suppliers ?? 0, icon: Truck, color: 'text-indigo-600' },
    ]

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
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="w-7 h-7 text-emerald-800" />
                        <h2 className="text-2xl font-bold text-black drop-shadow-lg">Analytics</h2>
                    </div>
                    <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                        Full business overview and KPIs
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
                    {kpiCards.map((card, idx) => {
                        const Icon = card.icon
                        return (
                            <div key={idx} className="bg-white/80 backdrop-blur-md rounded-md p-3 border border-gray-200 shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-500">{card.label}</span>
                                </div>
                                <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                            </div>
                        )
                    })}
                </div>
.
                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sales Revenue Chart */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Monthly Revenue</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {salesChart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <BarChart3 className="w-10 h-10 mb-2 text-gray-300" />
                                    No data yet
                                </div>
                            ) : (
                                <Bar data={salesData} options={chartOptions} />
                            )}
                        </div>
                    </div>

                    {/* Income vs Expenses Chart */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <LineChart className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Income vs Expenses</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {expensesChart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <LineChart className="w-10 h-10 mb-2 text-gray-300" />
                                    No data yet
                                </div>
                            ) : (
                                <Line data={expensesData} options={lineOptions} />
                            )}
                        </div>
                    </div>
                </div>
.
                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Order Status Doughnut */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChart className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Order Status</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {orderStatus.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <PieChart className="w-10 h-10 mb-2 text-gray-300" />
                                    No data yet
                                </div>
                            ) : (
                                <Doughnut data={orderStatusData} options={doughnutOptions} />
                            )}
                        </div>
                    </div>

                    {/* Inventory by Category */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Products by Category</h3>
                        </div>
                        <div style={{ height: '280px' }}>
                            {inventoryChart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <Package className="w-10 h-10 mb-2 text-gray-300" />
                                    No data yet
                                </div>
                            ) : (
                                <Bar data={inventoryData} options={chartOptions} />
                            )}
                        </div>
                    </div>
                </div>
.
                {/* Tables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                            <Package className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Top Selling Products</h3>
                        </div>
                        {topProducts.length === 0 ? (
                            <div className="px-5 py-8 text-center text-gray-500 text-sm">
                                <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                No data yet
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-emerald-50/50">
                                        <tr>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Product</th>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Sold</th>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {topProducts.map((p, i) => (
                                            <tr key={i} className="hover:bg-white/40 transition-colors">
                                                <td className="px-5 py-3 font-medium text-gray-800">{p.product_name}</td>
                                                <td className="px-5 py-3 text-gray-600">{p.total_sold}</td>
                                                <td className="px-5 py-3 text-emerald-700 font-medium">${Number(p.total_revenue).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                            <Users className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-semibold text-black">Top Customers</h3>
                        </div>
                        {topCustomers.length === 0 ? (
                            <div className="px-5 py-8 text-center text-gray-500 text-sm">
                                <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                No data yet
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-emerald-50/50">
                                        <tr>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Orders</th>
                                            <th className="text-left px-5 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wider">Total Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {topCustomers.map((c, i) => (
                                            <tr key={i} className="hover:bg-white/40 transition-colors">
                                                <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                                                <td className="px-5 py-3 text-gray-600">{c.total_orders}</td>
                                                <td className="px-5 py-3 text-blue-600 font-medium">${Number(c.total_spent).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}