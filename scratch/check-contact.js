require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching contact_inquiries:', error);
  } else {
    console.log('Successfully connected to contact_inquiries. Count:', data.length);
  }
}

checkTable();
