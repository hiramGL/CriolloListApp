"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

/*
This page is for searching services by category, this will actively
use the databse to query all available services and filter them by the selected category.

The page will have standard categories to choose from, but the main goal is 
to solely use categories present in the database to show the variety of services available.
*/
export default function CategoriesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [services, setServices] = useState<{ id: number; name: string; category: string }[]>([]) // Placeholder for fetched services

    // Placeholder categories (replace with database data in the future)
    const categories = [
        "Design",
        "Tutoring",
        "Finance",
        "Engineering",
        "Health",
        "Technology",
    ]

    // Placeholder for fetching services (to be replaced with actual database logic)
    const fetchServices = async () => {
        // Simulate fetching data
        const mockServices = [
            { id: 1, name: "Logo Design", category: "Design" },
            { id: 2, name: "Math Tutoring", category: "Tutoring" },
            { id: 3, name: "Tax Consulting", category: "Finance" },
        ]
        const filteredServices = mockServices.filter(
            (service) =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedCategory ? service.category === selectedCategory : true)
        )
        setServices(filteredServices)
    }

    return (
        <main className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Search Services by Category</h1>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Search for a service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <Button onClick={fetchServices}>Search</Button>
            </div>

            {/* Results Section */}
            <section>
                {services.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <li
                                key={service.id}
                                className="p-4 border border-gray-300 rounded-md shadow-sm"
                            >
                                <h2 className="text-lg font-semibold">{service.name}</h2>
                                <p className="text-sm text-gray-600">{service.category}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No services found. Try a different search.</p>
                )}
            </section>
            <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/")}
            >
                Back to Home
            </Button>
        </main>
    )
}