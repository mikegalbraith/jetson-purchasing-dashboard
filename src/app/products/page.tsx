'use client'

import { useState, useMemo } from 'react'
import assembliesData from '@/data/assemblies.json'

type Assembly = {
  'Internal ID': number
  Name: string
  'ASM Item': string
  Country: string
  'State/Province ': string
  City: string
  'ZIP Code': string
  'BOM #1': string
  'BOM #2': string
  'BOM #3': string
  'BOM #4': string
  'REV #1': string
  'REV #2': string
  'REV #3': string
}

const assemblies = assembliesData as Assembly[]

const asmItems = [...new Set(assemblies.map((a) => a['ASM Item']))].sort()
const countries = [...new Set(assemblies.map((a) => a.Country))].sort()

// Group assemblies by ASM Item for the product view
type ProductGroup = {
  asmItem: string
  label: string
  type: string
  variants: Assembly[]
}

function categorizeProduct(asm: string): { label: string; type: string } {
  if (asm.startsWith('CDHP-AIR1')) {
    const ton = asm.split('-').pop()
    return { label: `Jetson Air ${ton}`, type: 'Heat Pump' }
  }
  if (asm.startsWith('CDHP-HH1') || asm.startsWith('CDHP-HH2')) {
    const ton = asm.split('-').pop()
    const gen = asm.includes('HH1') ? 'Gen 1' : 'Gen 2'
    return { label: `Jetson Heat Hub ${ton} (${gen})`, type: 'Heat Pump' }
  }
  if (asm.startsWith('ESU')) {
    const detail = asm.includes('GRND') ? 'Ground' : 'Overhead'
    return { label: `Electrical Service Upgrade 200A - ${detail}`, type: 'Electrical' }
  }
  if (asm.startsWith('HS-')) {
    const parts = asm.split('-')
    const kw = parts[1]
    const brand = parts[2] === 'JA' ? 'Jetson Air' : 'Mr. Cool'
    return { label: `Heat Strip ${kw} (${brand})`, type: 'Heat Strip' }
  }
  if (asm.startsWith('RETROFIT')) {
    const region = asm.split('-')[1]
    return { label: `Retrofit Kit - ${region}`, type: 'Retrofit' }
  }
  return { label: asm, type: 'Other' }
}

function buildProducts(): ProductGroup[] {
  const map = new Map<string, ProductGroup>()
  assemblies.forEach((a) => {
    const existing = map.get(a['ASM Item'])
    if (existing) {
      existing.variants.push(a)
    } else {
      const { label, type } = categorizeProduct(a['ASM Item'])
      map.set(a['ASM Item'], {
        asmItem: a['ASM Item'],
        label,
        type,
        variants: [a],
      })
    }
  })
  return Array.from(map.values())
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Heat Pump': return 'bg-jetson-green/10 text-jetson-green-dark'
    case 'Electrical': return 'bg-amber-100 text-amber-700'
    case 'Heat Strip': return 'bg-orange-100 text-orange-700'
    case 'Retrofit': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function getRegionFlag(state: string): string {
  switch (state) {
    case 'BC': return '🇨🇦'
    case 'CO': case 'MA': case 'NY': return '🇺🇸'
    default: return ''
  }
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [region, setRegion] = useState<'' | 'BC' | 'CO' | 'MA' | 'NY'>('')

  const allProducts = useMemo(() => buildProducts(), [])
  const types = [...new Set(allProducts.map((p) => p.type))].sort()

  const filtered = useMemo(() => {
    return allProducts.filter((product) => {
      const matchSearch =
        !search ||
        product.label.toLowerCase().includes(search.toLowerCase()) ||
        product.asmItem.toLowerCase().includes(search.toLowerCase())
      const matchType = !typeFilter || product.type === typeFilter
      const matchRegion =
        !region ||
        product.variants.some((v) => v['State/Province '] === region)
      return matchSearch && matchType && matchRegion
    })
  }, [search, typeFilter, region, allProducts])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-sm text-gray-500 mt-1">
          {asmItems.length} products with {assemblies.length} regional BOM assemblies
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Products</p>
          <p className="text-2xl font-bold mt-1">{asmItems.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Heat Pumps</p>
          <p className="text-2xl font-bold mt-1 text-jetson-green">
            {allProducts.filter((p) => p.type === 'Heat Pump').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Regions</p>
          <p className="text-2xl font-bold mt-1">
            {[...new Set(assemblies.map((a) => a['State/Province ']))].filter(Boolean).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">BOM Assemblies</p>
          <p className="text-2xl font-bold mt-1">{assemblies.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50 focus:border-jetson-green"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setRegion('')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                region === ''
                  ? 'bg-jetson-green text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {(['BC', 'CO', 'MA', 'NY'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  region === r
                    ? 'bg-jetson-green text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((product) => (
          <div
            key={product.asmItem}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.label}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{product.asmItem}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
                  {product.type}
                </span>
              </div>

              <div className="space-y-2.5">
                {product.variants
                  .filter((v) => !region || v['State/Province '] === region)
                  .map((variant) => (
                  <div
                    key={variant['Internal ID']}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getRegionFlag(variant['State/Province '])}</span>
                        <span className="text-sm font-medium text-gray-800">
                          {variant['State/Province ']} — {variant.Country}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[variant['BOM #1'], variant['BOM #2'], variant['BOM #3'], variant['BOM #4']]
                        .filter(Boolean)
                        .map((bom, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-jetson-green shrink-0" />
                            <span className="text-xs text-gray-600 truncate">{bom}</span>
                          </div>
                        ))}
                    </div>
                    {(variant['REV #1'] || variant['REV #2']) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[variant['REV #1'], variant['REV #2'], variant['REV #3']]
                          .filter(Boolean)
                          .map((rev, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-white rounded text-[10px] font-mono text-gray-500 border border-gray-200"
                            >
                              {rev}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No products match your filters.</p>
      )}
    </div>
  )
}
