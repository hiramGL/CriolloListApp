'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2
  const [academicYear, setAcademicYear] = useState<string>('');
  const [major, setMajor] = useState('');

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Create account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          username,
          major,
          academic_year: academicYear,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Redirect after signup
    if (!authData.session) {
      router.replace('/verify-email');
    } else {
      router.replace('/home');
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center"
      // style={{
      //   backgroundImage: "url('/campus-area.jpg')",
      //   backgroundColor: "rgba(0, 0, 0, 0.5)",
      //   backgroundBlendMode: "overlay",
      // }}
    >
      <h1 className="text-3xl font-extrabold mb-8 text-white">Welcome to CriolloList!</h1>
      <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>

      {error && <p className="text-red-600 mb-4 bg-white p-2 rounded shadow">{error}</p>}

      {step === 1 && (
        <form className="w-full max-w-sm space-y-4 bg-white p-6 rounded-lg shadow-lg" onSubmit={() => setStep(2)}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Next
          </Button>
        </form>
      )}

      {step === 2 && (
        <form className="w-full max-w-sm space-y-4 bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium mb-1 text-gray-700">
              Academic Year
            </label>
            <Input
              id="academicYear"
              type="number"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g., 1, 2, 3, etc."
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="major" className="block text-sm font-medium mb-1 text-gray-700">
              Major
            </label>
            <Input
              id="major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g., Computer Science"
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-1/2 bg-gray-200 hover:bg-gray-300"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button type="submit" className="w-1/2 bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-4 text-sm text-gray-300">
        Already have an account?{" "}
        <Button
          variant="link"
          className="text-green-400 hover:underline"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </p>
    </main>
  );
}
