import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hrApi } from '../../api/hrApi'

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">HR</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage employees, jobs and candidates</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Employees',  value: stats?.total_employees      ?? 0 },
                    { label: 'Active Employees', value: stats?.active_employees     ?? 0 },
                    { label: 'Open Positions',   value: jobStats?.open_jobs         ?? 0 },
                    { label: 'New Applicants',   value: candidateStats?.applied_candidates ?? 0 },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Employees',     desc: 'View and manage all employees',     icon: '👥', path: '/hr/employees'   },
                    { name: 'Job Positions', desc: 'Post and manage job openings',       icon: '💼', path: '/hr/jobs'        },
                    { name: 'Candidates',    desc: 'Review and hire job applicants',     icon: '📝', path: '/hr/candidates'  },
                ].map((item) => (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-300 cursor-pointer transition"
                    >
                        <div className="text-3xl mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}