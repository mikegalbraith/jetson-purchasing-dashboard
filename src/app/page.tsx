import StatCard from '@/components/StatCard'
import SpendChart from '@/components/SpendChart'
import StatusBadge from '@/components/StatusBadge'
import { prisma } from '@/lib/prisma'
import { dbToUi } from '@/lib/status'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const [allPOs, inventory, monthlySpend] = await Promise.all([
    prisma.purchaseOrder.findMany({
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.inventoryItem.findMany({
      include: { supplier: true },
    }),
    prisma.monthlySpend.findMany({
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    }),
  ])

  const openPOs = allPOs.filter((po) => po.status !== 'received' && po.status !== 'cancelled')
  const totalOpenUSD = openPOs.reduce((sum, po) => sum + po.totalUSD, 0)
  const totalOpenCAD = openPOs.reduce((sum, po) => sum + po.totalCAD, 0)
  const lowStock = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock')

  const spendData = monthlySpend.map(({ id, year, ...s }) => s)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Purchasing Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time snapshot of purchasing operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open POs" value={String(openPOs.length)} subtext={`${allPOs.length} total`} />
        <StatCard label="Open Value (USD)" value={`$${totalOpenUSD.toLocaleString()}`} trend="up" subtext="+12% vs last month" />
        <StatCard label="Open Value (CAD)" value={`$${totalOpenCAD.toLocaleString()}`} trend="neutral" subtext="Flat vs last month" />
        <StatCard label="Low/OOS Items" value={String(lowStock.length)} trend="down" subtext={`of ${inventory.length} SKUs`} />
      </div>

      <SpendChart data={spendData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Purchase Orders</h3>
          <div className="space-y-3">
            {allPOs.slice(0, 4).map((po) => (
              <div key={po.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium">{po.poNumber}</p>
                  <p className="text-xs text-gray-500">{po.supplier.name}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-medium">
                    ${(po.totalCAD || po.totalUSD).toLocaleString()} {po.currency}
                  </span>
                  <StatusBadge status={dbToUi(po.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Inventory Alerts</h3>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-400">All items in stock</p>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku} — {item.supplier.name}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm">{item.quantityOnHand} / {item.reorderPoint}</span>
                    <StatusBadge status={dbToUi(item.status)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
