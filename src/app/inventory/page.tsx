import StatusBadge from '@/components/StatusBadge'
import { sampleInventory } from '@/lib/sample-data'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory</h2>
        <p className="text-sm text-gray-500 mt-1">Current stock levels at Belway Warehouse</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500">SKU</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Product</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Supplier</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">On Hand</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Reorder Pt</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Unit Cost</th>
            </tr>
          </thead>
          <tbody>
            {sampleInventory.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs">{item.sku}</td>
                <td className="px-5 py-3 font-medium">{item.name}</td>
                <td className="px-5 py-3 text-gray-600">{item.supplier}</td>
                <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                <td className={`px-5 py-3 text-right font-medium ${item.quantityOnHand <= item.reorderPoint ? 'text-red-600' : ''}`}>
                  {item.quantityOnHand}
                </td>
                <td className="px-5 py-3 text-right text-gray-500">{item.reorderPoint}</td>
                <td className="px-5 py-3 text-right">${item.unitCostCAD.toLocaleString()} CAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
