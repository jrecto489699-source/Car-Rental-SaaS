import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const maxPrice = searchParams.get('max_price')
  const transmission = searchParams.get('transmission')
  const fuel = searchParams.get('fuel')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const supabase = createAdminClient()

  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'available')
    .order('price_per_day', { ascending: true })

  if (type && type !== 'All') query = query.eq('type', type)
  if (maxPrice) query = query.lte('price_per_day', Number(maxPrice))
  if (transmission && transmission !== 'All') query = query.eq('transmission', transmission)
  if (fuel && fuel !== 'All') query = query.eq('fuel', fuel)

  const { data: vehicles, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter out vehicles already booked for the given date range
  if (from && to && vehicles && vehicles.length > 0) {
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('vehicle_id')
      .not('status', 'in', '("cancelled","completed")')
      .lte('start_date', to)
      .gte('end_date', from)

    const bookedIds = new Set((conflicts || []).map((b) => b.vehicle_id))
    const available = vehicles.filter((v) => !bookedIds.has(v.id))
    return NextResponse.json({ vehicles: available })
  }

  return NextResponse.json({ vehicles: vehicles || [] })
}
