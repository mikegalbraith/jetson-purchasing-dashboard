'use client'

import { useState, useMemo } from 'react'
import itemsData from '@/data/items.json'

type Item = {
  'Internal ID': number
  Name: string
  'Display Name': string
  'Item Category': string
  'BOM Territory': string
  'Common / Job specific': string
  Consumable: string
  'Kit name & quantity': string
  'Avg Parts Per Job': number
  'Purchase Lead Time': string | number
  'Reorder Point': number
  'Reorder Multiple': string | number
  'Part Number - BC': string
  'Supplier Description - BC': string
  'Manufacturer - BC': string
  'Unit Price - BC (CAD)': number
  'Part Number - CO': string
  'Supplier Description - CO': string
  'Unit Price - CO (USD)': number
  'Part Number - MA': string
  'Supplier Description - MA': string
  'Unit Price - MA (USD)': number
  'Part Number - NY': string
  'Supplier Description - NY': string
  'Unit Price - NY (USD)': number
}

const items = itemsData as Item[]

const categories = [...new Set(items.map((i) => i['Item Category']))].sort()
const territories = [...new Set(items.map((i) => i['BOM Territory']).filter(Boolean))].sort()

function formatCurrency(val: number | undefined, currency: string) {
  if (val === undefined || val === null || isNaN(val)) return '—'
  return `${currency}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function ItemsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [territory, setTerritory] = useState('')
  const [region, setRegion] = useState<'BC' | 'CO' | 'MA' | 'NY'>('BC')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.Name?.toLowerCase().includes(search.toLowerCase()) ||
        item['Display Name']?.toLowerCase().includes(search.toLowerCase()) ||
        item[`Part Number - ${region}`]?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !category || item['Item Category'] === category
      const matchTerritory = !territory || item['BOM Territory'] === territory
      return matchSearch && matchCategory && matchTerritory
    })
  }, [search, category, territory, region])

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((i) => {
      counts[i['Item Category']] = (counts[i['Item Category']] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Items Catalog</h2>
        <p className="text-sm text-gray-500 mt-1">
          {items.length.toLocaleString()} inventory items across {categories.length} categories
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Total Items</p>
          <p className="text-2xl font-bold mt-1">{items.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Categories</p>
          <p className="text-2xl font-bold mt-1">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">HVAC Parts</p>
          <p className="text-2xl font-bold mt-1">
            {items.filter((i) => i['Item Category']?.startsWith('HVAC')).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Filtered</p>
          <p className="text-2xl font-bold mt-1">{filtered.length.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search items, part numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50 focus:border-jetson-green"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({catCounts[c]})
              </option>
            ))}
          </select>
          <select
            value={territory}
            onChange={(e) => setTerritory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jetson-green/50"
          >
            <option value="">All Territories</option>
            {territories.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Item Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Part # ({region})</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Price ({region === 'BC' ? 'CAD' : 'USD'})
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Reorder Pt</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Consumable</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((item) => {
                const priceKey =
                  region === 'BC'
                    ? 'Unit Price - BC (CAD)'
                    : region === 'CO'
                    ? 'Unit Price - CO (USD)'
                    : region === 'MA'
                    ? 'Unit Price - MA (USD)'
                    : 'Unit Price - NY (USD)'
                const partKey = `Part Number - ${region}` as keyof Item
                const currency = region === 'BC' ? '$' : '$'
                const currLabel = region === 'BC' ? 'CAD' : 'USD'
                return (
                  <tr
                    key={item['Internal ID']}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{item.Name}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-gray-900 truncate max-w-[300px]">
                        {item['Display Name']}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item['Item Category']}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-600">
                      {(item[partKey] as string) || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium">
                      {formatCurrency(item[priceKey as keyof Item] as number, currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {item['Reorder Point'] || '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.Consumable === 'Auto-Consumption'
                            ? 'bg-green-100 text-green-700'
                            : item.Consumable === 'Manual Consumption'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.Consumable || '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing 100 of {filtered.length.toLocaleString()} items. Use filters to narrow results.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No items match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
