"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/clients"

/*
This page dynamically fetches categories and services from the Supabase database
and allows users to search for services by category or keyword.
*/

export default function CategoriesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [categories, setCategories] = useState<string[]>([]) // Categories fetched from the database
    const [services, setServices] = useState<
        { id: string; user_id: string; title: string; description: string; category_id: number; contact_email: string; contact_phone: string; image_urls: string; created_at: Date }[]
    >([]) // Services fetched from the database

    // Fetch categories from the Supabase database
    const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select("name")
        if (error) {
            console.error("Error fetching categories:", error)
            return
        }
        setCategories(data.map((category) => category.name)) // Extract category names
    }

    // Fetch all services from the Supabase database
    const fetchServices = async (applyFilters = true) => {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false }) // Order by created_at in descending order

        if (error) {
            console.error("Error fetching services:", error)
            return
        }

        console.log("Fetched services:", data) // Log the fetched data

        // Apply filters if needed
        const filteredServices = applyFilters
            ? data
                  .filter(
                      (service) =>
                          service.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                          (selectedCategory ? service.category_id === parseInt(selectedCategory) : true)
                  )
                  .map((service) => ({
                      ...service,
                      created_at: new Date(service.created_at), // Convert created_at to a Date object
                  }))
            : data.map((service) => ({
                  ...service,
                  created_at: new Date(service.created_at), // Convert created_at to a Date object
              }))

        console.log("Filtered services:", filteredServices) // Log the filtered data
        setServices(filteredServices)
    }

    // Fetch categories and all services on component mount
    useEffect(() => {
        fetchCategories()
        fetchServices(false) // Fetch all services without filters by default
    }, [])

    return (
        <main className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Search for Services</h1>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Search for a service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2 text-green bg-gray-50"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-green bg-gray-50"
                >
                    <option 
                    value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option 
                        key={index} value={index + 1}>
                            {category}
                        </option>
                    ))}
                </select>
                <Button
                    variant="outline"
                    className="bg-green-500 text-white hover:bg-green-600" 
                onClick={() => fetchServices()}>Search</Button>
            </div>

            {/* Results Section */}
            <section>
                {services.length > 0 ? (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-green-100">
                                <th className="border border-gray-300 p-2">Title</th>
                                <th className="border border-gray-300 p-2">Description</th>
                                <th className="border border-gray-300 p-2">Email</th>
                                <th className="border border-gray-300 p-2">Phone</th>
                                <th className="border border-gray-300 p-2">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="bg-gray-50">
                                    <td className="border border-gray-300 p-2">{service.title}</td>
                                    <td className="border border-gray-300 p-2">{service.description}</td>
                                    <td className="border border-gray-300 p-2">{service.contact_email}</td>
                                    <td className="border border-gray-300 p-2">{service.contact_phone}</td>
                                    <td className="border border-gray-300 p-2">
                                        {new Date(service.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-white">No services found. Try a different search.</p>
                )}
            </section>

            {/* Back to Home Button */}
            <Button
                variant="outline"
                className="mt-4 bg-green-500 text-white hover:bg-green-600"
                onClick={() => router.push("/")}
            >
                Back to Home
            </Button>
        </main>
    )
}