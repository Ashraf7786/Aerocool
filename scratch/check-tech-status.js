const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://byqqoaxttadwgnlutsck.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cXFvYXh0dGFkd2dubHV0c2NrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA5ODEyNiwiZXhwIjoyMDkyNjc0MTI2fQ.6dseJZIc5UrddGdZ6Cjr_xRQqLTSwifqkfQ3YKkZixM"
);

async function checkTechStatus() {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.table(profiles.map(p => ({ email: p.email, role: p.role, status: p.status })));
}

checkTechStatus();
