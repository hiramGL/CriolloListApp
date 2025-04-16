'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // ✅ Login successful — redirect to /app/home
    router.replace('/home');
  }

  return (
    //header tag for entire page, tailwind css for styling.
    <main className="min-h-screen flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Button variant="link" onClick={() => router.push("/sign-up")}>
          Sign Up
        </Button>
      </p>
    </main>
  );
}
