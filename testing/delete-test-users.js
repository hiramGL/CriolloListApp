const { createClient } = require('@supabase/supabase-js');


const SUPABASE_URL = 'https://lrfhobxxxhedkgmgpsmp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZmhvYnh4eGhlZGtnbWdwc21wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk5ODE0OCwiZXhwIjoyMDU5NTc0MTQ4fQ.8E_dwdAFVXIwzXyFYzK3_Gx6oBYixPuUCDy7_rDpKWA';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function deleteTestUsers() {
  console.log("🧹 Starting cleanup of test users...");

  // Step 1: Get all users (this API only returns 1000 max at a time)
  const { data, error } = await supabase.auth.admin.listUsers();
  const users = data?.users || [];


  if (error) {
    console.error("❌ Failed to fetch users:", error.message);
    return;
  }

  // Step 2: Filter users by email pattern
  const testUsers = users.filter(user =>
    user.email && user.email.startsWith("testuser") && user.email.endsWith("@test.com")
  );

  if (testUsers.length === 0) {
    console.log("✅ No test users found to delete.");
    return;
  }

  // Step 3: Delete each test user
  for (const user of testUsers) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`❌ Failed to delete ${user.email}:`, deleteError.message);
    } else {
      console.log(`🗑️ Deleted ${user.email}`);
    }
  }

  console.log(`\n✅ Cleanup complete. ${testUsers.length} test users deleted.`);
}

deleteTestUsers();
