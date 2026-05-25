-- ============================================================
-- DriveFlow — Sample Vehicles Seed
-- Run this AFTER schema.sql and AFTER registering your admin account
-- Go to: https://supabase.com/dashboard/project/qbtnsrvyboihrxhiaati/sql/new
-- ============================================================

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get the first registered admin account
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No admin account found. Please register at /register first, then run this seed.';
  END IF;

  -- Insert sample vehicles (only if none exist yet)
  IF NOT EXISTS (SELECT 1 FROM public.vehicles WHERE owner_id = admin_id) THEN

    INSERT INTO public.vehicles
      (owner_id, make, model, year, plate, type, color, fuel, transmission, price_per_day, mileage, status, notes, image_url)
    VALUES
      (
        admin_id, 'Toyota', 'Fortuner', 2023, 'ABC 1234', 'SUV',
        'Pearl White', 'Diesel', 'Automatic', 3500, 12000, 'available',
        '4x4, leather seats, sunroof, 7-seater',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
      ),
      (
        admin_id, 'Honda', 'Civic', 2022, 'XYZ 5678', 'Sedan',
        'Phantom Black', 'Gasoline', 'Automatic', 2200, 28000, 'available',
        'Fuel efficient, Apple CarPlay, dash cam included',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
      ),
      (
        admin_id, 'Ford', 'Ranger', 2023, 'DEF 9012', 'Pickup Truck',
        'Silver', 'Diesel', 'Automatic', 4000, 8000, 'available',
        '4x4, cargo bed liner, perfect for off-road trips',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
      ),
      (
        admin_id, 'Toyota', 'HiAce', 2022, 'GHI 3456', 'Van',
        'White', 'Diesel', 'Manual', 4500, 35000, 'available',
        '15-seater, great for groups and tours',
        'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800&q=80'
      ),
      (
        admin_id, 'Hyundai', 'Tucson', 2023, 'JKL 7890', 'SUV',
        'Deep Blue', 'Gasoline', 'Automatic', 3000, 15000, 'available',
        'Smart cruise control, blind spot monitor, panoramic roof',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80'
      ),
      (
        admin_id, 'Mitsubishi', 'Xpander', 2022, 'MNO 1234', 'Minivan',
        'Graphite Gray', 'Gasoline', 'Automatic', 2800, 22000, 'available',
        '7-seater, foldable rear seats, perfect for families',
        'https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=800&q=80'
      ),
      (
        admin_id, 'Suzuki', 'Jimny', 2023, 'PQR 5678', 'SUV',
        'Kinetic Yellow', 'Gasoline', 'Manual', 2500, 5000, 'available',
        'Compact 4x4, great for mountain and adventure trips',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'
      ),
      (
        admin_id, 'Toyota', 'Innova', 2022, 'STU 9012', 'Minivan',
        'Bronze Mica', 'Diesel', 'Automatic', 3200, 40000, 'available',
        '8-seater MPV, spacious and comfortable for long drives',
        'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80'
      );

    RAISE NOTICE 'SUCCESS: 8 sample vehicles have been added to your fleet!';
  ELSE
    RAISE NOTICE 'Vehicles already exist for this admin. Skipping seed.';
  END IF;
END $$;
