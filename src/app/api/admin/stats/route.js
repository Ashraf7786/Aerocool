import { NextResponse } from 'next/server';

export async function GET() {
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
