import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'DriveFlow — All-in-One Car Rental Management System',
    template: '%s | DriveFlow',
  },
  description: 'Manage bookings, fleet, customers, income, and expenses from one powerful cloud platform. The most advanced car rental management system for modern businesses.',
  keywords: ['car rental', 'fleet management', 'booking system', 'vehicle management', 'rental software'],
  authors: [{ name: 'DriveFlow' }],
  creator: 'DriveFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://driveflow.app',
    siteName: 'DriveFlow',
    title: 'DriveFlow — All-in-One Car Rental Management System',
    description: 'Manage bookings, fleet, customers, income, and expenses from one powerful cloud platform.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DriveFlow Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveFlow — All-in-One Car Rental Management System',
    description: 'Manage bookings, fleet, customers, income, and expenses from one powerful cloud platform.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jakarta.variable} font-sans bg-background text-white antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--font-inter)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#ECFDF5',
              },
            },
            error: {
              iconTheme: {
                primary: '#F43F5E',
                secondary: '#FFF1F2',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
