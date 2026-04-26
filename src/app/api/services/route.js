import { NextResponse } from 'next/server';

const services = [
  { id: 1, title: 'Deep Cleaning', description: 'Complete chemical wash and jet pump cleaning.', icon: 'wind' },
  { id: 2, title: 'Installation', description: 'Professional setup for Split & Window units.', icon: 'zap' },
  { id: 3, title: 'Gas Filling', description: 'High-quality refrigerant top-up & leak fix.', icon: 'settings' },
  { id: 4, title: 'PCB Repair', description: 'Expert electronic circuit repair & replacement.', icon: 'cpu' },
  { id: 5, title: 'AMC Plan', description: 'Annual maintenance for peace of mind.', icon: 'shield' },
  { id: 6, title: 'Emergency', description: 'Quick 2-hour visit for critical failures.', icon: 'alert-circle' },
];


export async function GET() {
  return NextResponse.json({ data: services });
}
