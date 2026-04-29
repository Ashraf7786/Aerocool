const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://byqqoaxttadwgnlutsck.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cXFvYXh0dGFkd2dubHV0c2NrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA5ODEyNiwiZXhwIjoyMDkyNjc0MTI2fQ.6dseJZIc5UrddGdZ6Cjr_xRQqLTSwifqkfQ3YKkZixM"
);

async function setupAdmin() {
  const email = 'aero.cool.jaipur2023@gmail.com';
  const newPassword = 'Aerocool@2026';
  
  console.log(`Setting up admin for ${email}...`);

  // 1. Find the user ID
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  let user = users.find(u => u.email === email);
  if (!user) {
    console.log(`User ${email} not found in Auth. Creating...`);
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true
    });
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    user = data.user;
    console.log('User created successfully.');
  } else {
    // 2. Reset password
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    if (updateError) {
      console.error('Error updating password:', updateError);
    } else {
      console.log('Password reset successfully.');
    }
  }

  // 3. Update profile to admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id,
      email,
      role: 'admin',
      status: 'approved'
    }, { onConflict: 'id' });

  if (profileError) {
    console.error('Error updating profile:', profileError);
  } else {
    console.log('Profile updated to ADMIN role.');
  }
}

setupAdmin();
