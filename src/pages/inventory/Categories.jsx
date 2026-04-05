import { useState, useEffect } from 'react'
import { inventoryApi } from '../../api/inventoryApi'
import {
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  Package,
  X,
  AlertCircle,
  FolderTree
} from 'lucide-react'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [showModal, setShowModal]   = useState(false)
    const [editing, setEditing]       = useState(null)
    const [error, setError]           = useState('')
    const [form, setForm]             = useState({ name: '', description: '' })

    const fetchCategories = async () => {
        const r = await inventoryApi.getCategories()
        setCategories(r.data)
    }

    useEffect(() => { fetchCategories() }, [])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', description: '' })
        setError('')
        setShowModal(true)
    }

    const openEdit = (category) => {
        setEditing(category)
        setForm({ name: category.name, description: category.description ?? '' })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) {
                await inventoryApi.updateCategory(editing.id, form)
            } else {
                await inventoryApi.createCategory(form)
            }
            setShowModal(false)
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return
        await inventoryApi.deleteCategory(id)
        fetchCategories()
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
            {/* Dark green overlay */}
            <div className="absolute inset-0 bg-emerald-900/30"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FolderTree className="w-7 h-7 text-emerald-800" />
                            <h2 className="text-2xl font-bold text-black drop-shadow-lg">Categories</h2>
                        </div>
                        <p className="text-gray-700 ml-10 drop-shadow-md font-medium">
                            {categories.length} categories total
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium px-8 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((c) => (
                        <div key={c.id} className="bg-white/80 backdrop-blur-md rounded-md border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag className="w-5 h-5 text-emerald-700" />
                                        <h3 className="font-semibold text-black text-lg">{c.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {c.description ?? 'No description'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-3">
                                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-xs text-emerald-700 font-medium">
                                            {c.products_count} {c.products_count === 1 ? 'product' : 'products'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 ml-4">
                                    <button 
                                        onClick={() => openEdit(c)} 
                                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(c.id)} 
                                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {categories.length === 0 && (
                        <div className="col-span-3 text-center py-12">
                            <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No categories yet</p>
                            <p className="text-gray-400 text-xs mt-1">Click "Add Category" to get started</p>
                        </div>
                    )}
                </div>

                {/* Modal - Add/Edit Category */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                        <div className="bg-white/95 backdrop-blur-md rounded-md shadow-xl w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-black">
                                    {editing ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {error && (
                                <div className="mx-6 mt-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={form.name} 
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        placeholder="e.g. Electronics, Clothing, Books"
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea 
                                        rows="3" 
                                        value={form.description} 
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        placeholder="Optional description for this category..."
                                        className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50" 
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-md text-sm transition"
                                    >
                                        {editing ? 'Update Category' : 'Create Category'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md text-sm hover:bg-gray-50 transition"
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