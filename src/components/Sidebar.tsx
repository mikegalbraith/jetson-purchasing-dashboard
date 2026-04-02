'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { label: 'Overview', href: '/', icon: '📊' },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: '📋' },
  { label: 'Suppliers', href: '/suppliers', icon: '🏭' },
  { label: 'Inventory', href: '/inventory', icon: '📦' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-jetson-dark text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">Jetson Purchasing</h1>
        <p className="text-xs text-gray-400 mt-1">Operations Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-jetson-accent text-white font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-gray-500">
        Jetson Home Inc.
      </div>
    </aside>
  )
}
