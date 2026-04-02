import StatusBadge from '@/components/StatusBadge'
import { prisma } from '@/lib/prisma'
import { dbToUi } from '@/lib/status'

export const dynamic = 'force-dynamic'

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      _count: {
        select: {
          purchaseOrders: {
            where: { status: { notIn: ['received', 'cancelled'] } },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suppliers</h2>
          <p className="text-sm text-gray-500 mt-1">Supplier directory and performance</p>
        </div>
        <button className="bg-jetson-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jetson-blue transition-colors">
          + Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.category}</p>
              </div>
              <StatusBadge status={dbToUi(s.status)} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Total Spend</p>
                <p className="font-medium">${s.totalSpendCAD.toLocaleString()} CAD</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Lead Time</p>
                <p className="font-medium">{s.leadTimeDays} days</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Active POs</p>
                <p className="font-medium">{s._count.purchaseOrders}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Rating</p>
                <p className="font-medium">{'★'.repeat(Math.round(s.rating))}{'☆'.repeat(5 - Math.round(s.rating))} {s.rating}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{s.contactEmail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
