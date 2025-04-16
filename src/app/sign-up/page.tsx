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
  const [academicYear, setAcademicYear] = useState('');
  const [major, setMajor] = useState('');

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Create account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      console.log('authData:', authData);

      return;
    }

    if (!authData.session) {
      // No active session means email confirmation is required
      router.replace('/verify-email');
      return;
    }
    
    // 3. Redirect to app home
    router.replace('/home');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {step === 1 && (
        <form className="w-full max-w-sm space-y-4" onSubmit={() => setStep(2)}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input id="name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full">Next</Button>
        </form>
      )}

      {step === 2 && (
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignUp}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium mb-1">
                Academic Year
              </label>
              <Input
                id="academicYear"
                type="text"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                placeholder="e.g., 1st, 2nd, etc."
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
                value={major}
                onChange={e => setMajor(e.target.value)}
                placeholder="e.g., Computer Science"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" className="w-1/2 bg-gray-200 hover:bg-gray-300" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" className="w-1/2" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
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
      
    </main>
  );
}
