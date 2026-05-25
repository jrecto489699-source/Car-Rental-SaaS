import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request, { params }) {
  const supabase = createAdminClient()

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  }

  return NextResponse.json({ vehicle })
}
