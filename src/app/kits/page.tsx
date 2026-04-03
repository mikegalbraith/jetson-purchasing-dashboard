'use client'

import { useState, useMemo } from 'react'
import kitsData from '@/data/kits.json'

type KitRow = {
  'Internal ID': number
  Name: string
  'Kit Name': string
  'Kit Member Item': string
  'Item Name': string
  'Kit Quantity': number
  'BOM Quantity': number
  'Kit name & quantity': string
  'Job Specific': string
}

const kits = kitsData as KitRow[]

const kitNames = [...new Set(kits.map((k) => k['Kit Name']))].sort()

// Group by kit product (Name field)
type KitProduct = {
  name: string
  kitName: string
  jobSpecific: string
  members: KitRow[]
}

function buildKitProducts(data: KitRow[]): KitProduct[] {
  const map = new Map<string, KitProduct>()
  data.forEach((row) => {
    const existing = map.get(row.Name)
    if (existing) {
      existing.members.push(row)
    } else {
      map.set(row.Name, {
        name: row.Name,
        kitName: row['Kit Name'],
        jobSpecific: row['Job Specific'],
        members: [row],
      })
    }
  })
  return Array.from(map.values())
}

export default function KitsPage() {
  const [search, setSearch] = useState('')
  const [kitType, setKitType] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const allProducts = useMemo(() => buildKitProducts(kits), [])

  const filtered = useMemo(() => {
    return allProducts.filter((product) => {
      const matchSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.kitName.toLowerCase().includes(search.toLowerCase()) ||
        product.members.some(
          (m) =>
            m['Kit Member Item']?.toLowerCase().includes(search.toLowerCase()) ||
            m['Item Name']?.toLowerCase().includes(search.toLowerCase())
        )
      const matchKit = !kitType || product.kitName === kitType
      return matchSearch && matchKit
    })
  }, [search, kitType, allProducts])

  const kitTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach((p) => {
      counts[p.kitName] = (counts[p.kitName] || 0) + 1
    })
    return counts
  }, [allProducts])

  // Extract region from name (e.g., "BC-Asset-Jetson Air 1.5T" -> "BC")
  function getRegion(name: string): string {
    const prefix = name.split('-')[0]
    if (['BC', 'CO', 'MA', 'NY'].includes(prefix)) return prefix
    return ''
  }

  function getRegionColor(region: string): string {
    switch (region) {
      case 'BC': return 'bg-blue-100 text-blue-700'
      case 'CO': return 'bg-amber-100 text-amber-700'
      case 'MA': return 'bg-purple-100 text-purple-700'
      case 'NY': return 'bg-rose-100 text-rose-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Kits</h2>
        <p className="text-sm text-gray-500 mt-1">
          {allProducts.length} kit configurations with {kits.length.toLocaleString()} total component entries
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Kit Configurations</p>
          <p className="text-2xl font-bold mt-1">{allProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Kit Types</p>
          <p className="text-2xl font-bold mt-1">{kitNames.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Total Components</p>
          <p className="text-2xl font-bold mt-1">{kits.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Filtered</p>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search kits, items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50 focus:border-jetson-green"
          />
          <select
            value={kitType}
            onChange={(e) => setKitType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50"
          >
            <option value="">All Kit Types</option>
            {kitNames.map((k) => (
              <option key={k} value={k}>
                {k} ({kitTypeCounts[k] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kit list */}
      <div className="space-y-2">
        {filtered.slice(0, 50).map((product) => {
          const isExpanded = expanded === product.name
          const region = getRegion(product.name)
          return (
            <div
              key={product.name}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : product.name)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.members.length} components
                      {product.jobSpecific ? ` \u00B7 ${product.jobSpecific}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {region && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRegionColor(region)}`}>
                      {region}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-jetson-green/10 text-jetson-green-dark">
                    {product.kitName}
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="text-left px-5 py-2 font-medium text-gray-500 text-xs">Item SKU</th>
                        <th className="text-left px-5 py-2 font-medium text-gray-500 text-xs">Item Name</th>
                        <th className="text-right px-5 py-2 font-medium text-gray-500 text-xs">Kit Qty</th>
                        <th className="text-right px-5 py-2 font-medium text-gray-500 text-xs">BOM Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.members.map((member, idx) => (
                        <tr key={idx} className="border-t border-gray-50">
                          <td className="px-5 py-2 font-mono text-xs text-gray-600">
                            {member['Kit Member Item']}
                          </td>
                          <td className="px-5 py-2 text-gray-800">{member['Item Name']}</td>
                          <td className="px-5 py-2 text-right text-gray-600">{member['Kit Quantity']}</td>
                          <td className="px-5 py-2 text-right text-gray-600">{member['BOM Quantity']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length > 50 && (
        <p className="text-sm text-gray-500 text-center">
          Showing 50 of {filtered.length} kits. Use filters to narrow results.
        </p>
      )}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No kits match your filters.</p>
      )}
    </div>
  )
}
