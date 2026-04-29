const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://byqqoaxttadwgnlutsck.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cXFvYXh0dGFkd2dubHV0c2NrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA5ODEyNiwiZXhwIjoyMDkyNjc0MTI2fQ.6dseJZIc5UrddGdZ6Cjr_xRQqLTSwifqkfQ3YKkZixM"
);

async function listUsers() {
  const { data: users, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  console.log('Registered Users:');
  console.table(users.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })));
}

listUsers();
