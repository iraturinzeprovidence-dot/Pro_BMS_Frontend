import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  Send,
  ArrowLeft
} from 'lucide-react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default function JobApplication() {
    const [jobs, setJobs]           = useState([])
    const [selected, setSelected]   = useState(null)
    const [success, setSuccess]     = useState('')
    const [error, setError]         = useState('')
    const [loading, setLoading]     = useState(false)
    const [form, setForm]           = useState({
        first_name: '', last_name: '', email: '',
        phone: '', cover_letter: '',
    })

    useEffect(() => {
        api.get('/public/jobs').then(r => setJobs(r.data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const r = await api.post('/public/apply', {
                ...form,
                job_position_id: selected.id,
            })
            setSuccess(r.data.message)
            setForm({ first_name: '', last_name: '', email: '', phone: '', cover_letter: '' })
            setSelected(null)
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div 
                className="relative min-h-screen w-full flex items-center justify-center"
                style={{
                    backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-emerald-900/30"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-4">
                    <div className="p-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-black text-center mb-2">Application Submitted!</h2>
                        <p className="text-gray-600 text-center mb-2">{success}</p>
                        <p className="text-gray-500 text-center text-sm mb-6">We will review your application and contact you soon.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-2.5 rounded-md transition w-auto min-w-[160px]"
                            >
                                Browse More Jobs
                            </button>
                        </div>
                        <div className="text-center pt-6 mt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Want to post a job?{' '}
                                <a href="/login" className="text-emerald-700 hover:text-emerald-800 font-medium transition">
                                    Login as Admin
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div 
            className="relative min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: `url('/src/assets/istockphoto-1477198926-612x612.jpg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl">
                    <div className="p-8">
                        {/* Icon on top center - only icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-8 h-8 text-emerald-700" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-black mb-1">Open Positions</h2>
                            <p className="text-gray-600 text-sm">Find your next opportunity and apply today</p>
                        </div>

                        {/* Login/Register Links */}
                        <div className="flex justify-center gap-4 mb-6">
                            <a href="/login" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition">
                                Customer Login
                            </a>
                            <span className="text-gray-300">|</span>
                            <a href="/register" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition">
                                Customer Register
                            </a>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-md flex items-center gap-2 mb-6">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {!selected ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {jobs.length === 0 ? (
                                    <div className="col-span-2 text-center py-12">
                                        <p className="text-gray-500">No open positions at the moment</p>
                                        <p className="text-gray-400 text-sm mt-1">Please check back later</p>
                                    </div>
                                ) : jobs.map(job => (
                                    <div key={job.id} className="bg-white/80 backdrop-blur-sm rounded-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-emerald-300">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-black text-lg mb-1">{job.title}</h3>
                                                <p className="text-sm text-gray-600">{job.department}</p>
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                                Open
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md">
                                                {job.type.replace('_', ' ')}
                                            </span>
                                            {job.salary_min && (
                                                <span className="bg-gray-100 px-2 py-1 rounded-md">
                                                    ${Number(job.salary_min).toLocaleString()} — ${Number(job.salary_max).toLocaleString()}
                                                </span>
                                            )}
                                            {job.deadline && (
                                                <span className="bg-gray-100 px-2 py-1 rounded-md">
                                                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {job.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                                        )}

                                        <button
                                            onClick={() => setSelected(job)}
                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-md text-sm transition"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-emerald-700 text-sm hover:text-emerald-800 mb-6 flex items-center gap-1 transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Jobs
                                </button>

                                <div className="bg-emerald-50 rounded-md p-4 mb-6 border border-emerald-200">
                                    <h3 className="font-bold text-emerald-800 text-lg mb-1">{selected.title}</h3>
                                    <p className="text-emerald-700 text-sm">
                                        {selected.department} • {selected.type.replace('_', ' ')}
                                    </p>
                                </div>

                                <h3 className="font-bold text-black text-lg mb-5">Your Application</h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                            <input
                                                type="text" required value={form.first_name}
                                                onChange={e => setForm({...form, first_name: e.target.value})}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                            <input
                                                type="text" required value={form.last_name}
                                                onChange={e => setForm({...form, last_name: e.target.value})}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                            <input
                                                type="email" required value={form.email}
                                                onChange={e => setForm({...form, email: e.target.value})}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                            <input
                                                type="text" value={form.phone}
                                                onChange={e => setForm({...form, phone: e.target.value})}
                                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter</label>
                                        <textarea
                                            rows="5" value={form.cover_letter}
                                            onChange={e => setForm({...form, cover_letter: e.target.value})}
                                            placeholder="Tell us why you are the right candidate for this position..."
                                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
                                        />
                                    </div>
                                    <div className="flex justify-center pt-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-8 py-2.5 rounded-md text-sm transition disabled:opacity-50 w-auto min-w-[200px]"
                                        >
                                            {loading ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}