# DriveFlow — All-in-One Car Rental Management System

A production-ready, premium SaaS application for managing car rental businesses. Built with Next.js 14, Supabase, and modern UI/UX patterns.

## ✨ Features

- **Marketing Landing Page** — Hero, features, testimonials, pricing, FAQ
- **Authentication** — Register, Login, Forgot Password via Supabase Auth
- **Dashboard Overview** — Revenue charts, KPI cards, real-time stats
- **Vehicle Fleet Management** — CRUD with image upload, status tracking
- **Booking Management** — Create/edit bookings, timeline view, payment status
- **Customer Database** — Profiles, ID verification, booking history
- **Expense Tracking** — Categorized costs, charts, receipt management
- **Analytics & Reports** — Revenue trends, vehicle utilization, profit analysis
- **Settings** — Company profile, notifications, password change
- **Mobile Responsive** — Works on all devices

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, JavaScript |
| Styling | Tailwind CSS, Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

## 📁 Project Structure

```
driveflow/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── layout.js    # Dashboard shell (sidebar + topbar)
│   │   └── dashboard/
│   │       ├── page.js           # Overview
│   │       ├── vehicles/         # Fleet management
│   │       ├── bookings/         # Booking management
│   │       ├── customers/        # Customer database
│   │       ├── expenses/         # Expense tracking
│   │       ├── analytics/        # Reports & analytics
│   │       └── settings/         # Settings
│   ├── globals.css
│   ├── layout.js        # Root layout
│   └── page.js          # Landing page
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Select.js
│   │   ├── Modal.js
│   │   ├── Card.js
│   │   ├── Badge.js
│   │   ├── Skeleton.js
│   │   ├── EmptyState.js
│   │   ├── Avatar.js
│   │   └── Textarea.js
│   ├── landing/         # Landing page sections
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── TrustSection.js
│   │   ├── Features.js
│   │   ├── Testimonials.js
│   │   ├── Pricing.js
│   │   ├── FAQ.js
│   │   ├── CTABanner.js
│   │   └── Footer.js
│   └── dashboard/       # Dashboard-specific components
│       ├── Sidebar.js
│       ├── Topbar.js
│       ├── MobileSidebar.js
│       ├── VehicleForm.js
│       └── BookingForm.js
├── lib/
│   ├── supabase/
│   │   ├── client.js    # Browser client
│   │   ├── server.js    # Server client
│   │   └── middleware.js
│   ├── utils.js         # Helper functions
│   └── constants.js     # App constants & demo data
├── supabase/
│   └── schema.sql       # Complete PostgreSQL schema
├── middleware.js         # Route protection
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
# Navigate to project
cd "Car Rental"

# Install dependencies
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Authentication > Settings** and configure your site URL

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in your Supabase dashboard under **Settings > API**.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates:

- **profiles** — User profiles with company info
- **vehicles** — Fleet management with status, pricing, docs
- **customers** — Customer profiles with ID verification
- **bookings** — Rental bookings with payment tracking
- **expenses** — Operational cost tracking
- **payments** — Payment transaction records

All tables have:
- Row Level Security (RLS) — data isolated per user
- Timestamps (created_at, updated_at)
- Cascading deletes
- Optimized indexes
- Useful database views

## 🚀 Deploy to Vercel

### One-click deploy:

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy!

### Update Supabase Auth Settings:

In Supabase dashboard, go to **Authentication > URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

## 🔐 Authentication

- Email/password auth via Supabase
- Auto-profile creation on signup
- Protected dashboard routes via Next.js middleware
- Session persistence
- Password reset via email

## 📱 Demo

To test without Supabase setup, the app includes realistic demo data in `lib/constants.js` that populates all dashboard sections.

## 🎨 Design System

- **Theme**: Dark mode, minimalist luxury
- **Primary Colors**: Slate-950, Slate-900, Slate-800
- **Accents**: Blue-600, Purple-500, Cyan-500
- **Typography**: Inter (Google Fonts)
- **Components**: Glassmorphism, subtle borders, rounded-2xl
- **Animations**: Framer Motion (scroll reveal, hover states)

## 📄 License

MIT License — Commercial use allowed.

---

Built with ❤️ for rental business owners worldwide.
