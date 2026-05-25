import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request, { params }) {
  const supabase = createAdminClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_ref', params.ref)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json({ booking })
}
