export const APP_NAME = 'DriveFlow'
export const APP_DESCRIPTION = 'All-in-One Car Rental Management System'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://driveflow.app'

export const VEHICLE_TYPES = [
  'Sedan', 'SUV', 'Hatchback', 'Van', 'Pickup Truck',
  'Sports Car', 'Luxury', 'Electric', 'Minivan', 'Convertible'
]

export const VEHICLE_STATUSES = ['available', 'rented', 'maintenance', 'inactive']

export const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG']

export const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic']

export const BOOKING_STATUSES = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'overdue']

export const PAYMENT_STATUSES = ['unpaid', 'partial', 'paid', 'refunded']

export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'GCash', 'Maya']

export const EXPENSE_CATEGORIES = [
  'Fuel', 'Maintenance', 'Repair', 'Insurance', 'Registration',
  'Cleaning', 'Parking', 'Toll', 'Salary', 'Office', 'Marketing', 'Other'
]

export const CUSTOMER_ID_TYPES = [
  "Driver's License", 'Passport', 'National ID', 'SSS ID', 'PhilHealth ID',
  "Voter's ID", 'PRC ID', 'Senior Citizen ID', 'TIN ID'
]

export const TRANSMISSION_OPTIONS = ['Automatic', 'Manual']

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export const DASHBOARD_NAV = [
  { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Vehicles', href: '/dashboard/vehicles', icon: 'Car' },
  { label: 'Bookings', href: '/dashboard/bookings', icon: 'Calendar' },
  { label: 'Customers', href: '/dashboard/customers', icon: 'Users' },
  { label: 'Expenses', href: '/dashboard/expenses', icon: 'Receipt' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
]

export const DEMO_VEHICLES = [
  { id: 1, make: 'Toyota', model: 'Fortuner', year: 2023, plate: 'ABC 1234', type: 'SUV', status: 'available', price_per_day: 3500, fuel: 'Diesel', transmission: 'Automatic', color: 'White', mileage: 15000 },
  { id: 2, make: 'Honda', model: 'Civic', year: 2022, plate: 'XYZ 5678', type: 'Sedan', status: 'rented', price_per_day: 2500, fuel: 'Gasoline', transmission: 'Automatic', color: 'Black', mileage: 28000 },
  { id: 3, make: 'Ford', model: 'Ranger', year: 2023, plate: 'DEF 9012', type: 'Pickup Truck', status: 'available', price_per_day: 4000, fuel: 'Diesel', transmission: 'Automatic', color: 'Silver', mileage: 8000 },
  { id: 4, make: 'Hyundai', model: 'Tucson', year: 2022, plate: 'GHI 3456', type: 'SUV', status: 'maintenance', price_per_day: 3000, fuel: 'Gasoline', transmission: 'Automatic', color: 'Blue', mileage: 42000 },
  { id: 5, make: 'Mitsubishi', model: 'Montero', year: 2021, plate: 'JKL 7890', type: 'SUV', status: 'available', price_per_day: 3800, fuel: 'Diesel', transmission: 'Automatic', color: 'Gray', mileage: 55000 },
  { id: 6, make: 'Toyota', model: 'Vios', year: 2023, plate: 'MNO 1234', type: 'Sedan', status: 'rented', price_per_day: 2000, fuel: 'Gasoline', transmission: 'Manual', color: 'Red', mileage: 12000 },
]

export const DEMO_STATS = {
  totalRevenue: 485000,
  monthlyRevenue: 68500,
  activeRentals: 12,
  totalVehicles: 24,
  availableVehicles: 16,
  totalCustomers: 186,
  totalBookings: 342,
  monthlyExpenses: 18200,
  monthlyProfit: 50300,
}

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for small rental businesses just getting started',
    features: [
      'Up to 5 vehicles',
      'Up to 50 bookings/month',
      'Basic analytics',
      'Customer management',
      'Email support',
    ],
    cta: 'Get Started Free',
    popular: false,
    accent: 'blue',
  },
  {
    name: 'Professional',
    price: '$997',
    period: 'one-time',
    description: 'Everything you need to run a professional rental business',
    features: [
      'Unlimited vehicles',
      'Unlimited bookings',
      'Advanced analytics & reports',
      'Expense tracking',
      'Invoice generation',
      'Priority support',
      'Free lifetime updates',
      'Custom company branding',
      'Multi-staff access',
    ],
    cta: 'Get Lifetime Access',
    popular: true,
    accent: 'purple',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per agreement',
    description: 'For large fleets and enterprise rental operations',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'White-label options',
      'On-premise deployment',
      'SLA guarantee',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    popular: false,
    accent: 'cyan',
  },
]

export const FAQS = [
  {
    question: 'Is there a monthly subscription fee?',
    answer: 'No! DriveFlow offers a one-time lifetime payment option. Pay once, use forever with free updates included.',
  },
  {
    question: 'How many vehicles can I manage?',
    answer: 'The Professional plan supports unlimited vehicles. The Starter plan supports up to 5 vehicles for free.',
  },
  {
    question: 'Can I import my existing data?',
    answer: 'Yes, DriveFlow supports CSV/Excel import for vehicles, customers, and booking history.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use Supabase with PostgreSQL, Row Level Security (RLS), and enterprise-grade encryption to protect your data.',
  },
  {
    question: 'Can multiple staff members use the system?',
    answer: 'Yes, the Professional plan includes multi-staff access with role-based permissions (Admin and Staff roles).',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes, we offer email support for all plans and priority support for Professional and Enterprise customers.',
  },
  {
    question: 'Can I access it from mobile?',
    answer: 'DriveFlow is fully responsive and works perfectly on mobile browsers. A dedicated mobile app is on our roadmap.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply sign up for free, add your fleet, and you\'re ready to start managing bookings. No credit card required for the free plan.',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Marco Santos',
    role: 'Owner, Santos Car Rental',
    company: 'Santos Car Rental',
    avatar: 'MS',
    rating: 5,
    text: 'DriveFlow completely transformed how I manage my 20-vehicle fleet. The booking system alone saved me 3 hours a day. Worth every peso!',
    location: 'Cebu, Philippines',
  },
  {
    name: 'Sarah Chen',
    role: 'Operations Manager',
    company: 'PremiumDrive Manila',
    avatar: 'SC',
    rating: 5,
    text: 'The analytics dashboard gives us insights we never had before. We increased our monthly profit by 35% after identifying our most profitable vehicles.',
    location: 'Manila, Philippines',
  },
  {
    name: 'Rodriguez Miguel',
    role: 'Fleet Manager',
    company: 'MegaDrive Rentals',
    avatar: 'RM',
    rating: 5,
    text: 'Switching from spreadsheets to DriveFlow was the best decision we made. The expense tracking feature alone is worth the price.',
    location: 'Davao, Philippines',
  },
  {
    name: 'Lisa Park',
    role: 'CEO',
    company: 'QuickRide Services',
    avatar: 'LP',
    rating: 5,
    text: 'Clean, fast, and incredibly intuitive. My staff picked it up in an hour. The customer management and invoice generation are exactly what we needed.',
    location: 'Quezon City, Philippines',
  },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const CHART_COLORS = {
  blue: '#3B82F6',
  cyan: '#06B6D4',
  purple: '#8B5CF6',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
}
