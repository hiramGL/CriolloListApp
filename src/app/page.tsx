'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check session when page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/home'); // User is logged in → send to app home
      } else {
        router.replace('/login');    // Not logged in → send to login
      }
    });
  }, []);

  return <p className="text-center p-10">Redirecting...</p>; // Optional loading text
}
