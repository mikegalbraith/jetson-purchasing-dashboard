export interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  status: 'draft' | 'submitted' | 'approved' | 'received' | 'cancelled'
  items: number
  totalCAD: number
  totalUSD: number
  currency: 'CAD' | 'USD'
  createdAt: string
  expectedDelivery: string
}

export interface Supplier {
  id: string
  name: string
  category: string
  contactEmail: string
  leadTimeDays: number
  rating: number
  totalSpendCAD: number
  activePOs: number
  status: 'active' | 'inactive' | 'onboarding'
}

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  supplier: string
  quantityOnHand: number
  reorderPoint: number
  unitCostCAD: number
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-order'
}
