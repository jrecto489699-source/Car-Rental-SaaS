import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'BK-'
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length))
  return ref
}

// GET — check availability for a vehicle + date range
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const vehicleId = searchParams.get('vehicle_id')
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')

  if (!vehicleId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('vehicle_id', vehicleId)
    .not('status', 'in', '("cancelled","completed")')
    .lte('start_date', endDate)
    .gte('end_date', startDate)

  return NextResponse.json({ available: !conflicts || conflicts.length === 0 })
}

// POST — create a customer booking (no auth required)
export async function POST(request) {
  const body = await request.json()
  const {
    vehicle_id, start_date, end_date,
    customer_name, customer_email, customer_phone, customer_address,
    id_type, id_number, pickup_location, dropoff_location, notes,
  } = body

  if (!vehicle_id || !start_date || !end_date || !customer_name || !customer_phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Get vehicle
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles').select('*').eq('id', vehicle_id).single()

  if (vehicleError || !vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  }

  if (vehicle.status !== 'available') {
    return NextResponse.json({ error: 'Vehicle is not available' }, { status: 400 })
  }

  // Double-check availability
  const { data: conflicts } = await supabase
    .from('bookings').select('id').eq('vehicle_id', vehicle_id)
    .not('status', 'in', '("cancelled","completed")')
    .lte('start_date', end_date).gte('end_date', start_date)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: 'Vehicle is not available for the selected dates' }, { status: 409 })
  }

  // Calculate totals
  const totalDays = Math.max(1, Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)))
  const totalAmount = totalDays * Number(vehicle.price_per_day)

  // Find or create customer record
  let customerId
  const { data: found } = await supabase
    .from('customers').select('id').eq('owner_id', vehicle.owner_id)
    .eq('phone', customer_phone).maybeSingle()

  if (found) {
    customerId = found.id
    await supabase.from('customers').update({
      full_name: customer_name,
      email: customer_email || null,
      address: customer_address || null,
      id_type: id_type || null,
      id_number: id_number || null,
      updated_at: new Date().toISOString(),
    }).eq('id', customerId)
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers').insert({
        owner_id: vehicle.owner_id,
        full_name: customer_name,
        email: customer_email || null,
        phone: customer_phone,
        address: customer_address || null,
        id_type: id_type || null,
        id_number: id_number || null,
        status: 'active',
      }).select('id').single()

    if (customerError) {
      return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 })
    }
    customerId = newCustomer.id
  }

  // Generate unique booking ref
  let bookingRef
  for (let i = 0; i < 5; i++) {
    const candidate = generateBookingRef()
    const { data: existing } = await supabase.from('bookings').select('id').eq('booking_ref', candidate).maybeSingle()
    if (!existing) { bookingRef = candidate; break }
  }

  // Create booking with all fields
  const { data: booking, error: bookingError } = await supabase
    .from('bookings').insert({
      booking_ref: bookingRef,
      owner_id: vehicle.owner_id,
      vehicle_id: vehicle.id,
      customer_id: customerId,
      vehicle_name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle_plate: vehicle.plate,
      customer_name,
      customer_phone,
      customer_email: customer_email || null,
      customer_address: customer_address || null,
      driver_name: customer_name,
      driver_license: id_number || null,
      id_type: id_type || null,
      id_number: id_number || null,
      start_date,
      end_date,
      price_per_day: vehicle.price_per_day,
      total_days: totalDays,
      total_amount: totalAmount,
      other_fees: 0,
      amount_paid: 0,
      deposit_amount: 0,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: 'Cash',
      pickup_location: pickup_location || null,
      dropoff_location: dropoff_location || null,
      notes: notes || null,
    }).select('*').single()

  if (bookingError) {
    return NextResponse.json({ error: 'Failed to create booking: ' + bookingError.message }, { status: 500 })
  }

  // Update vehicle status to 'rented' if booking starts today
  const today = new Date().toISOString().split('T')[0]
  if (start_date <= today) {
    await supabase.from('vehicles').update({ status: 'rented' }).eq('id', vehicle_id)
  }

  return NextResponse.json({ booking, success: true }, { status: 201 })
}
