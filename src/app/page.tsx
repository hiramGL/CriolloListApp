'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();
  
//LANDING PAGE WHEN USER IS NOT LOGGED IN OR NOT AUTHENTICATED
// Redirect to login or home based on session status && EMAIL VERIFICATION
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
