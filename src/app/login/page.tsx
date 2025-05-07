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
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/campus-area.jpg')",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-3xl font-extrabold mb-8 text-white">Welcome to CriolloList!</h1>
      <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>

      {error && <p className="text-red-600 mb-4 bg-white p-2 rounded shadow">{error}</p>}

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-gray-300">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="text-green-400 hover:underline"
          onClick={() => router.push("/sign-up")}
        >
          Sign Up
        </Button>
      </p>
    </main>
  );
}
