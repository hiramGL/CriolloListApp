'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/clients'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CreateServicePage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        description: '',
        price: '',
        category_id: 0,
        contact_email: '',
        contact_phone: '',
        image_urls: '',
    })

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [serviceCreated, setServiceCreated] = useState(false)
    const [createdServiceData, setCreatedServiceData] = useState<any>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase.from('categories').select('id, name')
                if (error) {
                    console.error('Error fetching categories:', error)
                    setError('Failed to fetch categories.')
                    return
                }
                setCategories(data || [])
            } catch (err) {
                console.error('Unexpected error fetching categories:', err)
                setError('An unexpected error occurred.')
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'category_id' ? parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()

        const serviceData = {
            ...formData,
            user_id: user?.id || null,
        }

        try {
            const { data, error } = await supabase.from('services').insert([serviceData]).select()

            if (error) {
                console.error('Error creating service:', error)
                setError('Failed to create service. Please try again.')
                return
            }

            setCreatedServiceData(data?.[0] || null)
            setServiceCreated(true)
            setFormData({
                user_id: '',
                title: '',
                description: '',
                price: '',
                category_id: 0,
                contact_email: '',
                contact_phone: '',
                image_urls: '',
            })
        } catch (err) {
            console.error('Unexpected error creating service:', err)
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-green-500">Create a Service</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {!serviceCreated && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block font-medium text-green-500">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            placeholder="e.g. Web Development Service"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium text-green-500">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            placeholder="e.g. I offer web development services..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block font-medium text-green-500">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            placeholder="e.g. 25.00"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block font-medium text-green-500">
                            Category
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            required
                        >
                            <option value={0}>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="contact_email" className="block font-medium text-green-500">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="contact_phone" className="block font-medium text-green-500">
                            Contact Phone
                        </label>
                        <input
                            type="text"
                            id="contact_phone"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image_urls" className="block font-medium text-green-500">
                            Website URLs
                        </label>
                        <input
                            type="text"
                            id="image_urls"
                            name="image_urls"
                            value={formData.image_urls}
                            onChange={handleChange}
                            className="w-full border rounded p-2 bg-gray-50"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Service'}
                    </button>
                </form>
            )}

            <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
                Back to Home
            </Button>

            {/* Success Confirmation Modal */}
            {serviceCreated && createdServiceData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn transition-opacity duration-300">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-[90%] text-center space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">🎉 Service Created Successfully!</h2>
                        <div className="text-left text-sm space-y-1">
                            <p><strong>Title:</strong> {createdServiceData.title}</p>
                            <p><strong>Category ID:</strong> {createdServiceData.category_id}</p>
                            <p><strong>Price:</strong> ${createdServiceData.price}</p>
                            <p><strong>Description:</strong> {createdServiceData.description}</p>
                        </div>
                        <Button onClick={() => router.push("/profile")}>Go to My Profile</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
