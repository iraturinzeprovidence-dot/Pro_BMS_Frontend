import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hrApi } from '../../api/hrApi'
import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  UserPlus,
  TrendingUp,
  Building2,
  UserCog,
  LayoutDashboard
} from 'lucide-react'

export default function HRDashboard() {
    const navigate                              = useNavigate()
    const [stats, setStats]                     = useState(null)
    const [jobStats, setJobStats]               = useState(null)
    const [candidateStats, setCandidateStats]   = useState(null)

    useEffect(() => {
        hrApi.getStats().then(r => setStats(r.data))
        hrApi.getJobStats().then(r => setJobStats(r.data))
        hrApi.getCandidateStats().then(r => setCandidateStats(r.data))
    }, [])

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
                        <h2 className="text-2xl font-bold text-black drop-shadow-lg">HR Dashboard</h2>
                    </div>
                    <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                        Manage employees, jobs and candidates
                    </p>
                </div>

                {/* Welcome Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-md p-5 border border-gray-200 shadow-lg mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Users className="w-8 h-8 text-emerald-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">HR Management</h3>
                            <p className="text-gray-600 text-sm mt-1">Monitor and manage your workforce</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Grouped Summary Forms on Top */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-700" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Employees</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.total_employees ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Employees</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {stats?.active_employees ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Open Positions</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {jobStats?.open_jobs ?? 0}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-purple-600" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">New Applicants</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-black mb-0.5">
                            {candidateStats?.applied_candidates ?? 0}
                        </p>
                    </div>
                </div>

                {/* HR Overview Section - Moved here, above Quick Links */}
                <div className="mb-10">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-black drop-shadow-md">HR Overview</h3>
                        <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
                            Key metrics at a glance
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hiring Rate</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                {stats?.total_employees && jobStats?.open_jobs 
                                    ? Math.round((stats.active_employees / (stats.active_employees + jobStats.open_jobs)) * 100) 
                                    : 0}%
                            </p>
                            <p className="text-xs text-gray-500">Fill rate</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Departments</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                {stats?.total_departments ?? 0}
                            </p>
                            <p className="text-xs text-gray-500">Active departments</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <UserCog className="w-5 h-5 text-purple-600" />
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Turnover</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-black mb-0.5">
                                {stats?.total_employees && stats?.inactive_employees
                                    ? Math.round((stats.inactive_employees / stats.total_employees) * 100)
                                    : 0}%
                            </p>
                            <p className="text-xs text-gray-500">Employee turnover rate</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-black drop-shadow-md">Quick Links</h3>
                    <p className="text-gray-700 mt-0.5 drop-shadow-sm font-medium text-sm">
                        Access and manage HR modules
                    </p>
                </div>

                {/* Quick Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div
                        onClick={() => navigate('/hr/employees')}
                        className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                    >
                        <div className="flex flex-col items-center text-center flex-1">
                            <Users className="w-6 h-6 text-emerald-800 mb-2" />
                            <h3 className="font-semibold text-black text-base mb-1">
                                Employees
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                View and manage all employees
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                            <span>Access Module</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/hr/jobs')}
                        className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                    >
                        <div className="flex flex-col items-center text-center flex-1">
                            <Briefcase className="w-6 h-6 text-emerald-800 mb-2" />
                            <h3 className="font-semibold text-black text-base mb-1">
                                Job Positions
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                Post and manage job openings
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                            <span>Access Module</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/hr/candidates')}
                        className="bg-white/80 backdrop-blur-md rounded-md p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-white/90 hover:border-emerald-400 hover:shadow-xl group flex flex-col h-[140px]"
                    >
                        <div className="flex flex-col items-center text-center flex-1">
                            <FileText className="w-6 h-6 text-emerald-800 mb-2" />
                            <h3 className="font-semibold text-black text-base mb-1">
                                Candidates
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                Review and hire job applicants
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors mt-2 pt-2 border-t border-gray-200">
                            <span>Access Module</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}