'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/backend/lib/auth-check';

export async function assignTechnician(bookingId, technicianId, requestId) {
  const { error: authError } = await verifyAdmin();
  if (authError) return { success: false, error: 'Unauthorized: Admins only' };

  try {
    // 1. Update Booking
    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .update({ 
        assigned_technician_id: technicianId,
        tech_status: 'accepted',
        status: 'Confirmed' // Also move main status to confirmed if it wasn't
      })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    // 2. Approve chosen request
    const { error: approveError } = await supabaseAdmin
      .from('work_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (approveError) throw approveError;

    // 3. Reject other requests for this booking
    const { error: rejectError } = await supabaseAdmin
      .from('work_requests')
      .update({ status: 'rejected' })
      .eq('booking_id', bookingId)
      .neq('id', requestId);

    if (rejectError) throw rejectError;

    return { success: true };
  } catch (error) {
    console.error('Dispatch Error:', error);
    return { success: false, error: error.message };
  }
}
