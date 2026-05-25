-- ============================================================
-- DriveFlow — Schema Update
-- Run this in Supabase SQL Editor to add missing columns
-- Go to: https://supabase.com/dashboard/project/qbtnsrvyboihrxhiaati/sql/new
-- ============================================================

-- Add missing booking fields (driver info, fees, payment tracking)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_license TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS other_fees NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS id_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS id_number TEXT;

-- Ensure customers table has all needed fields
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent NUMERIC(10,2) DEFAULT 0;

-- Allow public (unauthenticated) booking creation via the service role API
-- (service role bypasses RLS so no policy change needed — this is already handled)

-- Add index for faster booking lookups by customer email
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_ref);

-- Allow customers to look up their own bookings by email + ref (no auth required)
-- This is done server-side via service role key — no RLS policy needed

SELECT 'Schema update complete!' AS status;
