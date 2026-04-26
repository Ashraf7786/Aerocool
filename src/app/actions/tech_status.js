'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function updateTechStatus(bookingId, status) {
  try {
    const updates = { tech_status: status };
    
    // If completed, update main booking status too
    if (status === 'completed') {
      updates.status = 'Completed';
    }

    const { error } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Status Update Error:', error);
    return { success: false, error: error.message };
  }
}
