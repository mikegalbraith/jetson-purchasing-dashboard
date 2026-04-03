'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import JetsonLogo from './JetsonLogo'

const nav = [
  { label: 'Overview', href: '/', icon: 'chart' },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: 'orders' },
  { label: 'Suppliers', href: '/suppliers', icon: 'suppliers' },
  { label: 'Inventory', href: '/inventory', icon: 'inventory' },
  { label: 'Items', href: '/items', icon: 'items' },
  { label: 'Kits', href: '/kits', icon: 'kits' },
  { label: 'Products', href: '/products', icon: 'products' },
]

function NavIcon({ type, className }: { type: string; className?: string }) {
  const cls = className || 'w-4 h-4'
  switch (type) {
    case 'chart':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    case 'orders':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    case 'suppliers':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m4.5-18v18M12 3v18m4.5-18v18m4.5-18v18M6 6.75h.008v.008H6V6.75zm0 3h.008v.008H6V9.75zm0 3h.008v.008H6v-.008zm4.5-6h.008v.008H10.5V6.75zm0 3h.008v.008H10.5V9.75zm0 3h.008v.008H10.5v-.008zm4.5-6h.008v.008H15V6.75zm0 3h.008v.008H15V9.75zm0 3h.008v.008H15v-.008z" />
        </svg>
      )
    case 'inventory':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    case 'items':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      )
    case 'kits':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    case 'products':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/login') return null

  return (
    <aside className="w-64 bg-jetson-dark text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <JetsonLogo className="w-9 h-9" />
          <div>
            <h1 className="text-base font-bold tracking-tight">Jetson Home</h1>
            <p className="text-[11px] text-gray-400">Purchasing Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Purchasing</p>
        {nav.slice(0, 4).map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-jetson-green text-white font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </Link>
          )
        })}
        <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Catalog</p>
        {nav.slice(4).map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-jetson-green text-white font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
        <p className="text-[10px] text-gray-500 mt-3">Jetson Home Inc.</p>
      </div>
    </aside>
  )
}
