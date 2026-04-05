import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hrApi } from '../../api/hrApi'
import {
    Users, Briefcase, FileText, UserCheck,
    UserPlus, TrendingUp, Building2, UserCog,
    LayoutDashboard, CheckCircle, XCircle, Clock,
    ArrowRight, PieChart, Filter, RefreshCw,
    Award, Calendar, Mail, Phone, MapPin, DollarSign
} from 'lucide-react'

export default function HRDashboard() {
    const navigate = useNavigate()
    
    // State Management
    const [stats, setStats] = useState(null)
    const [jobStats, setJobStats] = useState(null)
    const [candidateStats, setCandidateStats] = useState(null)
    const [departments, setDepartments] = useState([])
    const [employees, setEmployees] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [timeRange, setTimeRange] = useState('month')

    // Data Fetching Pattern
    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [s, j, c, d, e, jp] = await Promise.all([
                hrApi.getStats(),
                hrApi.getJobStats(),
                hrApi.getCandidateStats(),
                hrApi.getDepartments(),
                hrApi.getEmployees({}),
                hrApi.getJobPositions({}),
            ])
            setStats(s.data)
            setJobStats(j.data)
            setCandidateStats(c.data)
            setDepartments(d.data)
            setEmployees(e.data)
            setJobs(jp.data)
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshData = async () => {
        setRefreshing(true)
        await fetchDashboardData()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    // Helper Functions
    const hiringRate = () => {
        const active = stats?.active_employees ?? 0
        const open = jobStats?.open_jobs ?? 0
        const total = active + open
        return total > 0 ? Math.round((active / total) * 100) : 0
    }

    const turnoverRate = () => {
        const total = stats?.total_employees ?? 0
        const terminated = stats?.terminated_employees ?? 0
        return total > 0 ? Math.round((terminated / total) * 100) : 0
    }

    const retentionRate = () => 100 - turnoverRate()

    // Department Distribution
    const byDepartment = employees.reduce((acc, e) => {
        if (!acc[e.department]) acc[e.department] = { total: 0, active: 0, inactive: 0 }
        acc[e.department].total++
        if (e.status === 'active') acc[e.department].active++
        else acc[e.department].inactive++
        return acc
    }, {})

    // Filtered Jobs based on department
    const filteredJobs = selectedDepartment === 'all' 
        ? jobs 
        : jobs.filter(j => j.department === selectedDepartment)

    const openJobs = filteredJobs.filter(j => j.status === 'open')
    const closedJobs = filteredJobs.filter(j => j.status === 'closed')

    // Status Config Pattern (like Purchase Orders)
    const statusConfig = (status) => ({
        active: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Active' },
        inactive: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Inactive' },
        terminated: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Terminated' },
        on_leave: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'On Leave' },
    }[status] ?? { color: 'bg-gray-100 text-gray-600', icon: Clock, label: status })

    const jobStatusConfig = (status) => ({
        open: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        closed: { color: 'bg-gray-100 text-gray-600', icon: XCircle },
        on_hold: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    }[status] ?? { color: 'bg-gray-100 text-gray-600', icon: Clock })

    const candidateStageConfig = (stage) => ({
        applied: { color: 'bg-blue-100 text-blue-700', icon: FileText },
        reviewing: { color: 'bg-yellow-100 text-yellow-700', icon: UserCheck },
        interviewed: { color: 'bg-purple-100 text-purple-700', icon: Users },
        hired: { color: 'bg-green-100 text-green-700', icon: Award },
        rejected: { color: 'bg-red-100 text-red-700', icon: XCircle },
    }[stage] ?? { color: 'bg-gray-100 text-gray-600', icon: FileText })

    // Stat Cards Configuration
    const statCards = [
        { 
            icon: <Users className="w-5 h-5" />, 
            iconBg: 'bg-emerald-100', 
            iconColor: 'text-emerald-700',
            label: 'Total Employees', 
            value: stats?.total_employees ?? 0,
            trend: '+12%',
            trendUp: true
        },
        { 
            icon: <UserCheck className="w-5 h-5" />, 
            iconBg: 'bg-green-100', 
            iconColor: 'text-green-600',
            label: 'Active Employees', 
            value: stats?.active_employees ?? 0,
            trend: '+5%',
            trendUp: true
        },
        { 
            icon: <Briefcase className="w-5 h-5" />, 
            iconBg: 'bg-blue-100', 
            iconColor: 'text-blue-600',
            label: 'Open Positions', 
            value: jobStats?.open_jobs ?? 0,
            trend: '-2%',
            trendUp: false
        },
        { 
            icon: <UserPlus className="w-5 h-5" />, 
            iconBg: 'bg-purple-100', 
            iconColor: 'text-purple-600',
            label: 'New Applicants', 
            value: candidateStats?.applied_candidates ?? 0,
            trend: '+28%',
            trendUp: true
        },
    ]

    if (loading) {
        return (
            <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading HR Dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

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
            {/* Overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">HR Dashboard</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            Complete workforce analytics and management
                        </p>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={refreshing}
                        className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 text-base font-medium px-5 py-2.5 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md border border-gray-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Welcome Section */}
                <div className="bg-white/80 backdrop-blur-md rounded-md p-6 border border-gray-200 shadow-lg mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black">HR Management System</h3>
                                <p className="text-gray-600 text-sm mt-1">Monitor and manage your workforce efficiently</p>
                            </div>
                            
                        </div>
                        <div className="flex gap-3">
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Last Updated</p>
                                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
.
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`${card.iconBg} p-2 rounded-lg`}>
                                    <div className={card.iconColor}>{card.icon}</div>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{card.trend}</span>
                                    <span>{card.trendUp ? '↑' : '↓'}</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black">{card.value.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Key Metrics Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-black drop-shadow-md">Key Performance Indicators</h3>
                            <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">Essential HR metrics at a glance</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-3 py-1 text-xs rounded-md transition ${timeRange === 'week' ? 'bg-emerald-600 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/70'}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-3 py-1 text-xs rounded-md transition ${timeRange === 'month' ? 'bg-emerald-600 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/70'}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setTimeRange('year')}
                                className={`px-3 py-1 text-xs rounded-md transition ${timeRange === 'year' ? 'bg-emerald-600 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/70'}`}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                        {/* Hiring Rate Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                                    <span className="text-sm font-semibold text-gray-700">Hiring Rate</span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-700">{hiringRate()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${hiringRate()}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Active: {stats?.active_employees ?? 0}</span>
                                <span>Open: {jobStats?.open_jobs ?? 0}</span>
                            </div>
                        </div>

                        {/* Retention Rate Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">Retention Rate</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">{retentionRate()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${retentionRate()}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Target: 85%</span>
                                <span>{retentionRate() >= 85 ? '✓ On Track' : '⚠ Needs Improvement'}</span>
                            </div>
                        </div>

                        {/* Turnover Rate Card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <UserCog className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-semibold text-gray-700">Turnover Rate</span>
                                </div>
                                <span className="text-2xl font-bold text-purple-600">{turnoverRate()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${turnoverRate()}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Terminated: {stats?.terminated_employees ?? 0}</span>
                                <span>Total: {stats?.total_employees ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown Section */}
                                                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    Detailed Breakdown
                                </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                        {/* Employee Status Breakdown */}
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <PieChart className="w-4 h-4 text-emerald-700" />
                                    Employee Status Distribution
                                </h4>
                                <span className="text-xs text-gray-400">Total: {stats?.total_employees ?? 0}</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { status: 'active', value: stats?.active_employees ?? 0 },
                                    { status: 'inactive', value: stats?.inactive_employees ?? 0 },
                                    { status: 'terminated', value: stats?.terminated_employees ?? 0 },
                                ].map(item => {
                                    const config = statusConfig(item.status)
                                    const StatusIcon = config.icon
                                    const total = stats?.total_employees ?? 1
                                    const percent = Math.round((item.value / total) * 100)
                                    return (
                                        <div key={item.status}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span className="text-sm text-gray-700 capitalize">{config.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                                                    <span className="text-xs text-gray-400">({percent}%)</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${config.color.split(' ')[0]} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Department Breakdown */}
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                    Department Distribution
                                </h4>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            {Object.keys(byDepartment).length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">No department data available</p>
                            ) : (
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {Object.entries(byDepartment)
                                        .sort((a, b) => b[1].total - a[1].total)
                                        .map(([dept, data]) => {
                                            const percent = Math.round((data.total / (stats?.total_employees ?? 1)) * 100)
                                            return (
                                                <div key={dept}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium text-gray-700">{dept}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-green-600">{data.active} active</span>
                                                            <span className="text-xs font-semibold text-gray-700">{data.total}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recruitment Pipeline */}
                                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-purple-600" />
                            Recruitment Pipeline
                        </h4>
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg mb-6">

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { stage: 'applied', label: 'Applied', value: candidateStats?.applied_candidates ?? 0 },
                                { stage: 'reviewing', label: 'Reviewing', value: candidateStats?.reviewing_candidates ?? 0 },
                                { stage: 'interviewed', label: 'Interviewed', value: candidateStats?.interviewed_candidates ?? 0 },
                                { stage: 'hired', label: 'Hired', value: candidateStats?.hired_candidates ?? 0 },
                                { stage: 'rejected', label: 'Rejected', value: candidateStats?.rejected_candidates ?? 0 },
                            ].map(item => {
                                const config = candidateStageConfig(item.stage)
                                return (
                                    <div key={item.stage} className={`${config.color} rounded-lg p-3 text-center transition-transform hover:scale-105 cursor-pointer`}>
                                        <p className="text-xl font-bold">{item.value}</p>
                                        <p className="text-xs font-medium mt-0.5">{item.label}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Conversion Rate: {Math.round(((candidateStats?.hired_candidates ?? 0) / (candidateStats?.applied_candidates ?? 1)) * 100)}%</span>
                                <span>Time to Hire: ~{Math.floor(Math.random() * 15) + 10} days</span>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Section with Tabs */}
                    <h3 className="text-lg font-semibold text-black drop-shadow-md">Positions</h3>
                    <div className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                <button className="px-6 py-3 text-sm font-medium text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50">
                                    Open Positions ({openJobs.length})
                                </button>
                                <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition">
                                    Closed Positions ({closedJobs.length})
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            {openJobs.length === 0 ? (
                                <div className="text-center py-8">
                                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">No open positions</p>
                                    <button className="mt-3 text-emerald-600 text-sm hover:underline">Create New Position →</button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {openJobs.slice(0, 5).map(job => {
                                        const status = jobStatusConfig(job.status)
                                        const StatusIcon = status.icon
                                        return (
                                            <div key={job.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-100 hover:border-emerald-200 transition-all">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-semibold text-gray-800">{job.title}</h5>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="w-3 h-3" />
                                                            {job.department}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            {job.type?.replace('_', ' ')}
                                                        </span>
                                                        {job.deadline && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                Due {new Date(job.deadline).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-emerald-600">{job.candidates_count ?? 0}</p>
                                                        <p className="text-xs text-gray-400">applicants</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate(`/hr/jobs/${job.id}`)}
                                                        className="p-2 hover:bg-emerald-50 rounded-md transition"
                                                    >
                                                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {openJobs.length > 5 && (
                                        <button 
                                            onClick={() => navigate('/hr/jobs')}
                                            className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 mt-2"
                                        >
                                            View all {openJobs.length} open positions →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-black drop-shadow-md">Quick Actions</h3>
                    <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">Access and manage HR modules</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { 
                            icon: <Users className="w-6 h-6" />, 
                            label: 'Employees', 
                            desc: 'View and manage all employees',  
                            path: '/hr/employees',
                            color: 'emerald',
                            count: stats?.total_employees ?? 0
                        },
                        { 
                            icon: <Briefcase className="w-6 h-6" />, 
                            label: 'Job Positions', 
                            desc: 'Post and manage job openings',    
                            path: '/hr/jobs',
                            color: 'blue',
                            count: jobStats?.open_jobs ?? 0
                        },
                        { 
                            icon: <FileText className="w-6 h-6" />, 
                            label: 'Candidates',    
                            desc: 'Review and hire job applicants',
                            path: '/hr/candidates',
                            color: 'purple',
                            count: candidateStats?.applied_candidates ?? 0
                        },
                    ].map(item => (
                        <div
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg bg-${item.color}-100 group-hover:scale-110 transition-transform`}>
                                    <div className={`text-${item.color}-700`}>{item.icon}</div>
                                </div>
                                {item.count > 0 && (
                                    <span className={`text-xs font-bold bg-${item.color}-100 text-${item.color}-700 px-2 py-1 rounded-full`}>
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{item.label}</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">{item.desc}</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                                <span>Access Module</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            Recent Activity
                        </h4>
                <div className="mt-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg">

                        <div className="space-y-3">
                            {[
                                { action: 'New employee joined', department: 'Engineering', time: '2 hours ago', icon: UserPlus },
                                { action: 'Job position posted', department: 'Marketing', time: '5 hours ago', icon: Briefcase },
                                { action: 'Candidate hired', department: 'Sales', time: '1 day ago', icon: Award },
                                { action: 'Department restructured', department: 'Operations', time: '2 days ago', icon: Building2 },
                            ].map((activity, idx) => {
                                const Icon = activity.icon
                                return (
                                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/30 rounded-lg transition">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.department} • {activity.time}</p>
                                        </div>
                                        <button className="text-xs text-emerald-600 hover:underline">View</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}