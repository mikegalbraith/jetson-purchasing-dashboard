import StatusBadge from '@/components/StatusBadge'
import { prisma } from '@/lib/prisma'
import { dbToUi } from '@/lib/status'

export const dynamic = 'force-dynamic'

export default async function PurchaseOrdersPage() {
  const pos = await prisma.purchaseOrder.findMany({
    include: { supplier: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Purchase Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage all purchase orders</p>
        </div>
        <button className="bg-jetson-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jetson-blue transition-colors">
          + New PO
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500">PO Number</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Supplier</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Items</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Total</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Expected</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po) => (
              <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium">{po.poNumber}</td>
                <td className="px-5 py-3 text-gray-600">{po.supplier.name}</td>
                <td className="px-5 py-3"><StatusBadge status={dbToUi(po.status)} /></td>
                <td className="px-5 py-3 text-right">{po.items}</td>
                <td className="px-5 py-3 text-right font-medium">
                  ${(po.totalCAD || po.totalUSD).toLocaleString()} {po.currency}
                </td>
                <td className="px-5 py-3 text-gray-600">{po.expectedDelivery.toISOString().split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
