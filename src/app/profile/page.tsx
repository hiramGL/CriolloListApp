"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("Loading...")
  const [services, setServices] = useState<any[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [major, setMajor] = useState("")
  const [profilePicture, setProfilePicture] = useState("/avatars/avatar1.png")
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("Auth error:", authError)
        setUserName("User")
        setLoadingServices(false)
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from("users")
        .select("full_name, major, profile_image")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching user data:", error)
        setUserName("User")
      } else {
        setUserName(data.full_name)
        setMajor(data.major)
        setProfilePicture(data.profile_image || "/avatars/avatar1.png")
      }

      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("id, title, price, description")
        .eq("user_id", user.id)

      if (serviceError) {
        console.error("Error fetching services:", serviceError)
        setServices([])
      } else {
        setServices(serviceData || [])
      }

      setLoadingServices(false)
    }

    fetchUserData()
  }, [])

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
      return
    }
    setServices(services.filter((service) => service.id !== id))
  }

  const handleAvatarChange = async (src: string) => {
    if (!userId) return
    const { error } = await supabase
      .from("users")
      .update({ profile_image: src })
      .eq("id", userId)
    if (error) {
      console.error("Failed to update avatar:", error)
    } else {
      setProfilePicture(src)
      setShowAvatarPicker(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-gray-900">
      {/* Add a container with a semi-transparent background */}
      <div className="bg-gray-100 bg-opacity-50 rounded-xl p-6 shadow-lg">
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
          <div
            className="w-24 h-24 rounded-full bg-green-100 overflow-hidden cursor-pointer"
            onClick={() => setShowAvatarPicker(true)}
          >
            <Image
              src={profilePicture}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{userName}</h1>
            <p className="text-violet-600">Major: {major}</p>
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
            <Button
              className="rounded-xl px-3 py-1 text-sm"
              variant="outline"
              onClick={() => router.push("/create_service")}
            >
              + Add Service
            </Button>
          </div>

          {loadingServices ? (
            <p className="text-sm text-gray-500 italic">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No services created yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="shadow-sm rounded-xl relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{service.title}</p>
                      <span className="text-sm font-semibold">${service.price}</span>
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
          )}
        </section>

        {/* Portfolio */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-square bg-green-100 rounded-xl flex items-center justify-center"
              />
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

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl grid grid-cols-3 gap-4 max-w-md">
              {[...Array(10)].map((_, i) => {
                const src = `/avatars/avatar${i + 1}.png`
                return (
                  <Image
                    key={i}
                    src={src}
                    alt={`Avatar ${i + 1}`}
                    width={64}
                    height={64}
                    className="cursor-pointer rounded-full hover:scale-110 transition"
                    onClick={() => handleAvatarChange(src)}
                  />
                )
              })}
              <Button className="col-span-3 mt-2" onClick={() => setShowAvatarPicker(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
