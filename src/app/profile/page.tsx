"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter()
  const[userName, setUserName] = useState("Loading...")

  // Temporary mock state for services
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Logo Design",
      price: "$50",
      description: "Simple and effective logos tailored to your brand.",
    },
    {
      id: 2,
      title: "Social Media Graphics",
      price: "Negotiable",
      description: "Custom graphics to enhance your online presence.",
    },
  ])

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("Auth error:", authError)
        setUserName("User")
        return
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching full_name:", error)
        setUserName("User")
      } else {
        setUserName(data.full_name)
      }
    }
    console.log(userName)
    fetchUserName()
  }, [])
  

  // Add new service
  const handleAddService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      price: "$0",
      description: "Description of the new service.",
    }
    setServices([...services, newService])
  }

  // Delete service by ID
  const handleDeleteService = (id: number) => {
    setServices(services.filter(service => service.id !== id))
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-gray-900">
      {/* Header */}
      <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            className="rounded-xl px-4 py-2 text-sm"
            onClick={() => router.push("/")}
          >
            Home
          </Button>
        </div>
      <section className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        
        <div className="w-24 h-24 rounded-full bg-green-100 overflow-hidden">
          <Image
            src="/profile_pic.png"
            alt="Profile"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{userName}</h1>
          <p className="text-green-700">Graphic Designer</p>
          <p className="text-sm text-green-600 mt-1">● Available online</p>
        </div>
      </section>

      {/* About Me */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">About Me</h2>
        <p className="text-sm text-gray-700">
          I'm a student with a passion for creating clean, impactful design solutions.
          Let me help bring your ideas to life!
        </p>
      </section>

      {/* Services Offered */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Services Offered</h2>
          <div className="flex gap-2">
            <Button
              className="rounded-xl px-3 py-1 text-sm"
              variant="outline"
              onClick={() => router.push("/create_service")}
            >
              + Add Service
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(service => (
            <Card key={service.id} className="shadow-sm rounded-xl relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">{service.title}</p>
                  <span className="text-sm font-semibold">{service.price}</span>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 absolute top-2 right-2 text-xs"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="aspect-square bg-green-100 rounded-xl flex items-center justify-center"
            >
              <Image src="/placeholder-image.png" alt="Portfolio item" width={80} height={80} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Testimonials</h2>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-green-800 font-bold">★★★★★</p>
            <p className="text-sm text-gray-800 font-medium">Michael S., Business Administration</p>
            <p className="text-sm text-gray-600 mt-1">
              Jessica did an amazing job on our logo. Highly recommend her services!
            </p>
          </CardContent>
        </Card>
        <div className="mt-4">
          <Button className="rounded-xl px-4 py-2 text-sm">Leave a Review</Button>
        </div>
      </section>
    </main>
  )
}
