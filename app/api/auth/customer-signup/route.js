import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { email, password, full_name, phone } = await request.json()

    if (!email || !password || !full_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Check if user already exists
    const { data: existing } = await admin.auth.admin.listUsers()
    const existingUser = existing?.users?.find(u => u.email === email)
    if (existingUser) {
      return Response.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Create user with auto email confirmation
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        phone: phone || '',
        role: 'customer',
      },
      email_confirm: true,
    })

    if (error) return Response.json({ error: error.message }, { status: 400 })

    return Response.json({ success: true, userId: data.user.id })
  } catch (err) {
    return Response.json({ error: err.message || 'Signup failed' }, { status: 500 })
  }
}
