"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/clients"

// Map category_id to background image
const categoryImageMap: Record<number, string> = {
  1: "/images/design-bg.png",
  2: "/images/education-bg.png",
  3: "/images/finance-bg.png",
  4: "/images/ecommerce-bg.png",
  5: "/images/wellness-bg.png",
  6: "/images/events-bg.png",
  7: "/images/healthfitness-bg.png",
  8: "/images/salesandfundraisers-bg.png",
}

export default function CategoriesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
    fetchServices(false)
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("name")
    if (error) {
      console.error("Error fetching categories:", error)
      return
    }
    setCategories(data.map((category) => category.name))
  }

  const fetchServices = async (applyFilters = true) => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching services:", error)
      return
    }

    const filtered = applyFilters
      ? data.filter(
          (service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? service.category_id === parseInt(selectedCategory) : true)
        )
      : data

    setServices(filtered.map((s) => ({ ...s, created_at: new Date(s.created_at) })))
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-white">Browse Services</h1>

      {/* Search Filters */}
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

      {/* Service Cards */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
           <div
           key={service.id}
           className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-cover bg-center"
           style={{
             backgroundImage: `url(${categoryImageMap[service.category_id] || "/images/default.jpg"})`,
           }}
         >
           <div className="p-5 bg-white/50 backdrop-blur-sm">
         
                <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                <p className="text-gray-700 mb-3 line-clamp-3">{service.description}</p>
                <div className="text-sm text-gray-600 mb-1">📧 {service.contact_email}</div>
                <div className="text-sm text-gray-600 mb-2">📱 {service.contact_phone}</div>
                <div className="text-xs text-violet-600 mb-3">
                  Created: {new Date(service.created_at).toLocaleDateString()}
                </div>
                <Button
  className="w-full"
  onClick={async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in to send a message");

    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .eq("participant_2", service.user_id)  // assuming seller is the service owner

    let conversationId = existing?.[0]?.id;
    if (!conversationId) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert([
          {
            participant_1: user.id,
            participant_2: service.user_id,
          }
        ])
        .select()
      conversationId = newConv?.[0]?.id;
    }

    router.push(`/messages?conversationId=${conversationId}`);
  }}
>
  💬 Message Seller
</Button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No services found. Try a different search.</p>
      )}

      <Button variant="outline" className="mt-6" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </main>
  )
}
