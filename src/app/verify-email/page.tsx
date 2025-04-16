'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setMessage("There was a problem verifying your email. Please try again.");
        return;
      }

      setMessage("Email verified! Redirecting...");
      setTimeout(() => router.replace('/home'), 2000);
    };

    verify();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-2xl font-bold mb-2">Email Verification</h1>
      <p>{message}</p>
    </main>
  );
}
