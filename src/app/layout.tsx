import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Purchasing Dashboard — Jetson Home',
  description: 'Purchasing operations dashboard for Jetson Home Inc.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <SessionProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
