'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Please confirm your email by clicking the link in your inbox.");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the '#'
    const hasAccessToken = hash.includes("access_token");
  
    const processSession = async () => {
      setMessage("Verifying email...");
  
      const { error } = await supabase.auth.exchangeCodeForSession(hash); // ✅ FIXED HERE
  
      if (error) {
        setMessage("There was a problem confirming your email. Please try again.");
        return;
      }
  
      setMessage("Email confirmed! Redirecting to your account...");
      setTimeout(() => {
        router.replace('/app/home');
      }, 2000);
    };
  
    if (hasAccessToken) {
      processSession();
    } else {
      setLoading(false); // Only show message, no redirect
    }
  }, [router]);
  

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
      <p className="text-gray-700 max-w-md">
        {message}
      </p>
      {!loading && (
        <p className="mt-4 text-sm text-gray-500">
          Didn't get the email? Check your spam folder or try resending it.
        </p>
      )}
    </main>
  );
}
