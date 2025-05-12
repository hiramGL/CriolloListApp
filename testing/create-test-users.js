const { createClient } = require('@supabase/supabase-js');

// ⛔ Replace with your real service role key (not anon key)
const SUPABASE_URL = 'https://lrfhobxxxhedkgmgpsmp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZmhvYnh4eGhlZGtnbWdwc21wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk5ODE0OCwiZXhwIjoyMDU5NTc0MTQ4fQ.8E_dwdAFVXIwzXyFYzK3_Gx6oBYixPuUCDy7_rDpKWA';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createUser(index) {
  const email = `testuser${index}@test.com`;
  const password = 'Password123!';
  const start = Date.now();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  const duration = Date.now() - start;
  if (error) {
    console.error(`❌ Error creating user ${index} (${email}): ${error.message}`);
  } else {
    console.log(`✅ User ${index} created in ${duration}ms`);
  }

  return duration;
}

(async () => {
  console.log('🚀 Starting user creation test...\n');
  const times = [];

  for (let i = 1; i <= 100; i++) {
    const t = await createUser(i);
    times.push(t);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`\n📊 Average user creation time: ${avg.toFixed(2)}ms`);
})();
