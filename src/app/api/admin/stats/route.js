import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-check';

export async function GET() {
  const { error: authError } = await verifyAdmin();
  if (authError) return authError;

  // Mock data for Admin dashboard stats
  const stats = {
    totalBookings: 154,
    pendingJobs: 12,
    completedJobs: 142,
    totalRevenue: '₹2,45,000',
    revenueGrowth: '+12.5%',
    bookingGrowth: '+8.2%'
  };
  return NextResponse.json(stats);
}
