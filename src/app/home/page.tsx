"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FaPaintBrush, FaChalkboardTeacher, FaMoneyBillWave, FaShoppingCart, FaSpa, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const categories = [
    { name: "Design", icon: <FaPaintBrush /> },
    { name: "Tutoring", icon: <FaChalkboardTeacher /> },
    { name: "Finance", icon: <FaMoneyBillWave /> },
    { name: "E-commerce", icon: <FaShoppingCart /> },
    { name: "Wellness", icon: <FaSpa /> },
    { name: "Events", icon: <FaCalendarAlt />, href: "/events" },
  ];

  return (
    <main className="min-h-screen bg-[#f9fafb] text-gray-800 p-6">
      {/* Top Nav */}
      <nav className="flex justify-between items-center py-4 mb-8">
  <Link href="/" className="text-2xl font-bold text-green-900">
    CriolloList
  </Link>
  
  <ul className="flex gap-6 text-sm font-medium">
    <li>
      <Link href="/">Home</Link>
    </li>
    <li>
      <Link href="/categories">Categories</Link>
    </li>
    <li>
      <Link href="/coming-soon">Resources</Link>
    </li>
    <li>
      <Link href="/profile">My Profile</Link>
    </li>
    <li>
      <Link href="/messages">Messages</Link>
    </li>
    <li>
      <Link href="/events">Events</Link>
    </li>
  </ul>

  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Settings</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem asChild>
      <Link href="/profile">Profile Settings</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/change-password">Change Password</Link>
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
      }}
    >
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

</nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-4">Discover Student Services, Made for You</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input placeholder="Search" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">All Categories</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Design</DropdownMenuItem>
                <DropdownMenuItem>Tutoring</DropdownMenuItem>
                <DropdownMenuItem>Finance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>Search</Button>
          </div>
        </div>
        <div className="hidden md:block">
          {/* Placeholder for Illustration */}
          <div className="relative w-full h-124 bg-green-100 rounded-xl flex items-center justify-center">
          <Image
            src="/campus-illustration.png"
            alt="Campus Illustration"
            fill
            className="rounded-xl"
          />
 
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card key={cat.name}className="rounded-xl shadow-sm transition-colors duration-200 hover:bg-green-100 hover:text-green-800">
              <CardContent className="p-6 text-center font-medium">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl">{cat.icon}</div>
                  <span>{cat.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Boost Your Business */}
      <section className="mt-16">
        <h3 className="text-xl font-semibold mb-4">Boost Your Business</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Starting a Business", "Marketing Tips", "Free Certifications"].map((resource) => (
            <Card key={resource}className="rounded-xl shadow-sm transition-colors duration-200 hover:bg-green-100 hover:text-green-800">
              <CardContent className="p-6 text-center font-medium">{resource}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
