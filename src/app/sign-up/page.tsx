"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // Track the current step

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

            {step === 1 && (
                <form className="w-full max-w-sm space-y-4">
                    {/* Step 1: Basic Information */}
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Full Name
                            </label>
                            <Input id="name" type="text" placeholder="Enter your full name" required />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                Username
                            </label>
                            <Input id="username" type="text" placeholder="Enter your username" required />
                        </div>
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
                    </div>
                    <Button
                        type="button"
                        className="w-full"
                        onClick={() => setStep(2)} // Move to Step 2
                    >
                        Next
                    </Button>
                </form>
            )}

            {step === 2 && (
                <form className="w-full max-w-sm space-y-4">
                    {/* Step 2: Additional Information */}
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label htmlFor="academicYear" className="block text-sm font-medium mb-1">
                                Academic Year
                            </label>
                            <Input
                                id="academicYear"
                                type="text"
                                placeholder="Enter your academic year (e.g., 1st, 2nd, etc.)"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="major" className="block text-sm font-medium mb-1">
                                Major
                            </label>
                            <Input
                                id="major"
                                type="text"
                                placeholder="Enter your major (e.g., Computer Science)"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/2 bg-gray-200 hover:bg-gray-300"
                            onClick={() => setStep(1)} // Go back to Step 1
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="w-1/2"
                            onClick={() => alert("Form submitted!")} // Replace with actual submission logic
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            )}

            <p className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Button variant="link" onClick={() => router.push("/login")}>
                    Login
                </Button>
            </p>
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