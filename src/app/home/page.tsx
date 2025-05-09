"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FaPaintBrush, FaChalkboardTeacher, FaMoneyBillWave, FaShoppingCart, FaSpa, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { link } from "fs"
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const categories = [
    { name: "Design", icon: <FaPaintBrush />, href: "categories", backgroundImage: "/images/design-bg.png" },
    { name: "Tutoring", icon: <FaChalkboardTeacher />, href: "categories",backgroundImage: "/images/education-bg.png" },
    { name: "Finance", icon: <FaMoneyBillWave />, href: "categories",backgroundImage: "/images/finance-bg.png" },
    { name: "E-commerce", icon: <FaShoppingCart />, href: "categories",backgroundImage: "/images/ecommerce-bg.png" },
    { name: "Wellness", icon: <FaSpa />, href: "categories", backgroundImage: "/images/wellness-bg.png" },
    { name: "Events", icon: <FaCalendarAlt />, href: "/events", backgroundImage: "/images/events-bg.png" },
  ];

  return (
    <main
      className="min-h-screen text-gray-800 p-6">
      {/* Top Nav */}
      <nav className="flex justify-between items-center py-4 mb-8 text-gray-100">
        <Link href="/" className="text-2xl font-bold text-green-300 hover:text-green-400">
          CriolloList
        </Link>

        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link href="/" className="hover:text-green-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/categories" className="hover:text-green-300">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/coming-soon" className="hover:text-green-300">
              Resources
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-green-300">
              My Profile
            </Link>
          </li>
          <li>
            <Link href="/messages" className="hover:text-green-300">
              Messages
            </Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-green-300">
              Events
            </Link>
          </li>
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black border-gray-300 hover:border-green-300">
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="hover:text-green-300">
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/change-password" className="hover:text-green-300">
                Change Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="hover:text-red-400"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-green-300">Discover Student Services, Made for You</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              placeholder="Search"
              className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-600 focus:ring-green-300 focus:border-green-300"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-black border-gray-300 hover:border-green-300">
                  All Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-gray-100">
                <DropdownMenuItem className="hover:text-green-300">Design</DropdownMenuItem>
                <DropdownMenuItem className="hover:text-green-300">Tutoring</DropdownMenuItem>
                <DropdownMenuItem className="hover:text-green-300">Finance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Search</Button>
          </div>
        </div>

        {/* <div className="hidden md:block">
          Placeholder for Illustration
          <div className="relative w-full h-124 bg-green-100 rounded-xl flex items-center justify-center">
          {/* <Image
            src="/campus-illustration.png"
            alt="Campus Illustration"
            fill
            className="rounded-xl"
          /> */} 
 
          {/* </div>
        </div> */}

      </section>

      {/* Categories */}
      <section className="mt-16">
        <h3 className="text-xl font-semibold mb-4 text-green-300">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.name}
              className="rounded-xl shadow-sm transition-colors duration-200 bg-gray-800 text-gray-100 hover:bg-green-100 hover:text-green-800"
              style = {{ backgroundImage: `url(${cat.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} // Add this line
            >
              <CardContent className="p-6 text-center font-medium">
                <Link href={cat.href}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl">{cat.icon}</div>
                    <span>{cat.name}</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional/External Resources */}
      <section className="mt-16">
        <h3 className="text-xl font-semibold mb-4 text-green-300">Departamento de Actividades Sociales & Culturales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Available Campus Services", href: "https://www.uprm.edu/p/actividades-sociales/servicios" },
            { name: "Documents and Policies", href: "https://www.uprm.edu/p/actividades-sociales/reglamentos_y_documentos" },
            { name: "Reserve Space for Student Activities", href: "https://www.uprm.edu/p/actividades-sociales/actividades_estudiantiles_y_espacios" },
          ].map((resource) => (
            <Link key={resource.name} href={resource.href} passHref>
              <Card className="rounded-xl shadow-sm transition-colors duration-200 bg-gray-800 text-gray-100 hover:bg-green-100 hover:text-green-800 cursor-pointer">
                <CardContent className="p-6 text-center font-medium">{resource.name}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
