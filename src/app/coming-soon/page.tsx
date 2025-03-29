"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ComingSoon() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
      <p className="mb-6 text-center">We’re working hard on this page. Check back soon.</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </main>
  )
}
