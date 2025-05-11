import { createClient } from '@supabase/supabase-js'

// ⚠️ This should come from a .env.test or .env.local.server only used for testing
const SUPABASE_URL = 'https://lrfhobxxxhedkgmgpsmp.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZmhvYnh4eGhlZGtnbWdwc21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTgxNDgsImV4cCI6MjA1OTU3NDE0OH0.Nc49jngc_vOGzKPHUo-U0_fmytw266ecnp_u75-gVG0' // NEVER expose client-side

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function createUser(i: number): Promise<number> {
  const start = Date.now()

  const { data, error } = await supabase.auth.admin.createUser({
    email: `testuser${i}@test.com`,
    password: 'Password123!',
    email_confirm: true,
  })

  const duration = Date.now() - start
  console.log(`User ${i}: ${error ? '❌ Error' : '✅ Created'} in ${duration}ms`)
  if (error) console.error(error.message)

  return duration
}

;(async () => {
  const times: number[] = []

  for (let i = 1; i <= 100; i++) {
    const t = await createUser(i)
    times.push(t)
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length
  console.log(`\n📊 Average user creation time: ${avg.toFixed(2)}ms`)
})()
