import { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { analyticsApi } from '../../api/analyticsApi'

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
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 6,
        }]
    }

    const expensesData = {
        labels: expensesChart.map(m => `${monthNames[m.month]} ${m.year}`),
        datasets: [
            {
                label: 'Income ($)',
                data: expensesChart.map(m => Number(m.income).toFixed(2)),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.1)',
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
            backgroundColor: ['#fbbf24', '#3b82f6', '#22c55e', '#ef4444'],
            borderWidth: 0,
        }]
    }

    const inventoryData = {
        labels: inventoryChart.map(c => c.name),
        datasets: [{
            label: 'Products',
            data: inventoryChart.map(c => c.products_count),
            backgroundColor: [
                '#3b82f6', '#22c55e', '#f59e0b',
                '#8b5cf6', '#ec4899', '#14b8a6',
            ],
            borderRadius: 6,
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
                <p className="text-gray-500 text-sm mt-1">Full business overview and KPIs</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Revenue',   value: '$' + Number(overview?.total_revenue    ?? 0).toFixed(2), color: 'text-blue-600'  },
                    { label: 'Net Profit',      value: '$' + Number(overview?.net_profit       ?? 0).toFixed(2), color: 'text-green-600' },
                    { label: 'Total Orders',    value: overview?.total_orders    ?? 0,                           color: 'text-gray-800'  },
                    { label: 'Total Customers', value: overview?.total_customers ?? 0,                           color: 'text-gray-800'  },
                    { label: 'Total Products',  value: overview?.total_products  ?? 0,                           color: 'text-gray-800'  },
                    { label: 'Low Stock',       value: overview?.low_stock_products ?? 0,                        color: 'text-red-600'   },
                    { label: 'Employees',       value: overview?.active_employees ?? 0,                          color: 'text-gray-800'  },
                    { label: 'Total Suppliers', value: overview?.total_suppliers  ?? 0,                          color: 'text-gray-800'  },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Sales Revenue Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                    <div style={{ height: '250px' }}>
                        {salesChart.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data yet</div>
                        ) : (
                            <Bar data={salesData} options={chartOptions} />
                        )}
                    </div>
                </div>

                {/* Income vs Expenses Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Income vs Expenses</h3>
                    <div style={{ height: '250px' }}>
                        {expensesChart.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data yet</div>
                        ) : (
                            <Line data={expensesData} options={lineOptions} />
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Order Status Doughnut */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>
                    <div style={{ height: '250px' }}>
                        {orderStatus.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data yet</div>
                        ) : (
                            <Doughnut data={orderStatusData} options={doughnutOptions} />
                        )}
                    </div>
                </div>

                {/* Inventory by Category */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Products by Category</h3>
                    <div style={{ height: '250px' }}>
                        {inventoryChart.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data yet</div>
                        ) : (
                            <Bar data={inventoryData} options={chartOptions} />
                        )}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Top Selling Products</h3>
                    </div>
                    {topProducts.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-400 text-sm">No data yet</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Sold</th>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topProducts.map((p, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-800">{p.product_name}</td>
                                        <td className="px-6 py-3 text-gray-500">{p.total_sold}</td>
                                        <td className="px-6 py-3 text-green-600">${Number(p.total_revenue).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Top Customers</h3>
                    </div>
                    {topCustomers.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-400 text-sm">No data yet</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Orders</th>
                                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topCustomers.map((c, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-800">{c.name}</td>
                                        <td className="px-6 py-3 text-gray-500">{c.total_orders}</td>
                                        <td className="px-6 py-3 text-blue-600">${Number(c.total_spent).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}