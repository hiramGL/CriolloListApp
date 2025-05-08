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

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]) // Categories fetched from the database
    const [loading, setLoading] = useState(false) // Loading state for form submission
    const [error, setError] = useState<string | null>(null) // Error state

    
    // Fetch categories from the Supabase database
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

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories()
    }, [])

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'category_id' ? parseInt(value) : value,
        }))
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        // user ID associated with the logged-in user
        const { data: { user}} = await supabase.auth.getUser()
        
        // serviceData, apart from having userID, will have the form data filled in by users
        const serviceData = {
            ...formData,
            user_id: user?.id || null, 
        }
        // debugging
        console.log('Service data:', serviceData)
        try {
            // insert serviceData as a new row in the services table
            const { data, error } = await supabase.from('services').insert([serviceData])
            // Error handling vvv 
            if (error) {
                console.error('Error creating service:', error)
                setError('Failed to create service. Please try again.')
                return
            }
            console.log('Service created successfully:', data)
            alert('Service created successfully!')
            setFormData({
                user_id: '',
                title: '',
                description: '',
                price: '',
                category_id: 0,
                contact_email: '',
                contact_phone: '',
                image_urls: '',
            }) // Reset the form
        } catch (err) {
            console.error('Unexpected error creating service:', err)
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        // Main container for the page 
        // Formatting form with css classes...
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create a Service</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block font-medium">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block font-medium">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="e.g. 25.00"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category_id" className="block font-medium">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
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
                    <label htmlFor="contact_email" className="block font-medium">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contact_phone" className="block font-medium">
                        Contact Phone
                    </label>
                    <input
                        type="text"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image_urls" className="block font-medium">
                        Image URLs
                    </label>
                    <input
                        type="text"
                        id="image_urls"
                        name="image_urls"
                        value={formData.image_urls}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
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
                        {/* Back to Home Button */}
                        <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/")}
            >
                Back to Home
            </Button>
        </div>
    )
}