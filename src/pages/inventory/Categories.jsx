import { useState, useEffect } from 'react'
import { inventoryApi } from '../../api/inventoryApi'

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                    <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    + Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{c.description ?? 'No description'}</p>
                                <p className="text-xs text-blue-600 mt-3 font-medium">{c.products_count} products</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-gray-400">No categories yet</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {editing ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                                    {editing ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm hover:bg-gray-50">
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