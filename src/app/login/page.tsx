"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
/* 
This page is for the simple login process for a user, 
with the additional prompt to sign up if the user does not have an account
and to go back to the home page if the user does not want to login.


*/
export default function LoginPage() {
  const router = useRouter()

  return (
    //header tag for entire page, tailwind css for styling.
    <main className="min-h-screen flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold mb-6">Login</h1>
      
      <form className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input id="email" type="email" placeholder="Enter your email" required />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input id="password" type="password" placeholder="Enter your password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Button variant="link" onClick={() => router.push("/sign-up")}>
          Sign Up
        </Button>
      </p>
      <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </main>
  )
}