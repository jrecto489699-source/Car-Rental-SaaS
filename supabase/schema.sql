-- ============================================================
-- DriveFlow - Complete PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  avatar_url TEXT,
  company_logo_url TEXT,
  notification_prefs JSONB DEFAULT '{
    "new_booking": true,
    "booking_confirmed": true,
    "payment_received": true,
    "low_availability": true
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VEHICLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Sedan',
  color TEXT,
  fuel TEXT DEFAULT 'Gasoline',
  transmission TEXT DEFAULT 'Automatic',
  price_per_day NUMERIC(10,2) NOT NULL,
  mileage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'inactive')),
  image_url TEXT,
  notes TEXT,
  insurance_expiry DATE,
  registration_expiry DATE,
  last_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, plate)
);

CREATE INDEX idx_vehicles_owner ON public.vehicles(owner_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  id_type TEXT,
  id_number TEXT,
  id_image_url TEXT,
  total_bookings INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'vip', 'blacklisted', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_owner ON public.customers(owner_id);
CREATE INDEX idx_customers_name ON public.customers(full_name);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  -- Denormalized fields for quick access
  vehicle_name TEXT,
  vehicle_plate TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  -- Dates & pricing
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_day NUMERIC(10,2) NOT NULL,
  total_days INTEGER NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'overdue')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  payment_method TEXT DEFAULT 'Cash',
  -- Optional
  pickup_location TEXT,
  dropoff_location TEXT,
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);

-- ============================================================
-- EXPENSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  receipt_no TEXT,
  receipt_image_url TEXT,
  vehicle_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_owner ON public.expenses(owner_id);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_date ON public.expenses(date);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'Cash',
  reference_no TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_owner ON public.payments(owner_id);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGN UP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only see and edit their own profile
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- VEHICLES: Users can only CRUD their own vehicles
CREATE POLICY "vehicles_all_own" ON public.vehicles FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- CUSTOMERS: Users can only CRUD their own customers
CREATE POLICY "customers_all_own" ON public.customers FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- BOOKINGS: Users can only CRUD their own bookings
CREATE POLICY "bookings_all_own" ON public.bookings FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- EXPENSES: Users can only CRUD their own expenses
CREATE POLICY "expenses_all_own" ON public.expenses FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- PAYMENTS: Users can only CRUD their own payments
CREATE POLICY "payments_all_own" ON public.payments FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Monthly revenue summary
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  owner_id,
  DATE_TRUNC('month', start_date) AS month,
  COUNT(*) AS booking_count,
  SUM(total_amount) AS total_revenue,
  SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) AS paid_revenue
FROM public.bookings
WHERE status NOT IN ('cancelled')
GROUP BY owner_id, DATE_TRUNC('month', start_date);

-- Fleet utilization
CREATE OR REPLACE VIEW fleet_utilization AS
SELECT
  v.id,
  v.owner_id,
  v.make || ' ' || v.model AS vehicle_name,
  v.plate,
  v.status,
  v.price_per_day,
  COUNT(b.id) AS total_bookings,
  COALESCE(SUM(b.total_amount), 0) AS total_revenue
FROM public.vehicles v
LEFT JOIN public.bookings b ON b.vehicle_id = v.id AND b.status NOT IN ('cancelled')
GROUP BY v.id, v.owner_id, v.make, v.model, v.plate, v.status, v.price_per_day;

-- ============================================================
-- SAMPLE SEED DATA (Optional - for testing)
-- ============================================================
-- Remove the /* and */ below to run seed data
/*
-- You would insert sample data here for testing
-- Make sure to replace 'YOUR_USER_ID' with an actual auth.users.id
*/

COMMENT ON TABLE public.vehicles IS 'Vehicle fleet management';
COMMENT ON TABLE public.customers IS 'Customer profiles and ID verification';
COMMENT ON TABLE public.bookings IS 'Rental booking records';
COMMENT ON TABLE public.expenses IS 'Operational expense tracking';
COMMENT ON TABLE public.payments IS 'Payment transaction records';
