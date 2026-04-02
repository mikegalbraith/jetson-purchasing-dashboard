import { PurchaseOrder, Supplier, InventoryItem } from './types'

export const samplePOs: PurchaseOrder[] = [
  {
    id: '1', poNumber: 'PO-2026-0041', supplier: 'MrCool LLC',
    status: 'approved', items: 24, totalCAD: 0, totalUSD: 48600,
    currency: 'USD', createdAt: '2026-03-28', expectedDelivery: '2026-04-15',
  },
  {
    id: '2', poNumber: 'PO-2026-0040', supplier: 'Midea',
    status: 'submitted', items: 50, totalCAD: 0, totalUSD: 112500,
    currency: 'USD', createdAt: '2026-03-25', expectedDelivery: '2026-04-20',
  },
  {
    id: '3', poNumber: 'PO-2026-0039', supplier: 'Carrier Canada',
    status: 'received', items: 12, totalCAD: 31200, totalUSD: 0,
    currency: 'CAD', createdAt: '2026-03-18', expectedDelivery: '2026-03-30',
  },
  {
    id: '4', poNumber: 'PO-2026-0038', supplier: 'MrCool LLC',
    status: 'received', items: 36, totalCAD: 0, totalUSD: 72000,
    currency: 'USD', createdAt: '2026-03-10', expectedDelivery: '2026-03-25',
  },
  {
    id: '5', poNumber: 'PO-2026-0037', supplier: 'Fujitsu Canada',
    status: 'approved', items: 18, totalCAD: 54000, totalUSD: 0,
    currency: 'CAD', createdAt: '2026-03-05', expectedDelivery: '2026-04-10',
  },
  {
    id: '6', poNumber: 'PO-2026-0036', supplier: 'Midea',
    status: 'draft', items: 30, totalCAD: 0, totalUSD: 67500,
    currency: 'USD', createdAt: '2026-04-01', expectedDelivery: '2026-04-25',
  },
]

export const sampleSuppliers: Supplier[] = [
  {
    id: '1', name: 'MrCool LLC', category: 'Heat Pumps',
    contactEmail: 'orders@mrcool.com', leadTimeDays: 14,
    rating: 4.2, totalSpendCAD: 892000, activePOs: 2, status: 'active',
  },
  {
    id: '2', name: 'Midea', category: 'Heat Pumps',
    contactEmail: 'supply@midea.com', leadTimeDays: 21,
    rating: 4.0, totalSpendCAD: 645000, activePOs: 1, status: 'active',
  },
  {
    id: '3', name: 'Carrier Canada', category: 'HVAC Equipment',
    contactEmail: 'b2b@carrier.ca', leadTimeDays: 10,
    rating: 4.5, totalSpendCAD: 312000, activePOs: 0, status: 'active',
  },
  {
    id: '4', name: 'Fujitsu Canada', category: 'Mini-Splits',
    contactEmail: 'commercial@fujitsu.ca', leadTimeDays: 12,
    rating: 4.3, totalSpendCAD: 278000, activePOs: 1, status: 'active',
  },
  {
    id: '5', name: 'Snap Supply Co', category: 'Installation Parts',
    contactEmail: 'orders@snapsupply.ca', leadTimeDays: 5,
    rating: 3.8, totalSpendCAD: 95000, activePOs: 0, status: 'active',
  },
]

export const sampleInventory: InventoryItem[] = [
  {
    id: '1', sku: 'HP-MC-36K', name: 'MrCool 36K BTU Heat Pump',
    category: 'Heat Pumps', supplier: 'MrCool LLC',
    quantityOnHand: 18, reorderPoint: 10, unitCostCAD: 2025,
    location: 'Belway Warehouse', status: 'in-stock',
  },
  {
    id: '2', sku: 'HP-MD-24K', name: 'Midea 24K BTU Mini-Split',
    category: 'Mini-Splits', supplier: 'Midea',
    quantityOnHand: 4, reorderPoint: 8, unitCostCAD: 1650,
    location: 'Belway Warehouse', status: 'low-stock',
  },
  {
    id: '3', sku: 'HP-FJ-18K', name: 'Fujitsu 18K BTU Wall Unit',
    category: 'Mini-Splits', supplier: 'Fujitsu Canada',
    quantityOnHand: 22, reorderPoint: 10, unitCostCAD: 1800,
    location: 'Belway Warehouse', status: 'in-stock',
  },
  {
    id: '4', sku: 'PT-CU-38', name: 'Copper Line Set 3/8"',
    category: 'Installation Parts', supplier: 'Snap Supply Co',
    quantityOnHand: 0, reorderPoint: 20, unitCostCAD: 85,
    location: 'Belway Warehouse', status: 'out-of-stock',
  },
  {
    id: '5', sku: 'HP-CR-48K', name: 'Carrier 48K BTU Ducted HP',
    category: 'Heat Pumps', supplier: 'Carrier Canada',
    quantityOnHand: 6, reorderPoint: 5, unitCostCAD: 4200,
    location: 'Belway Warehouse', status: 'in-stock',
  },
  {
    id: '6', sku: 'PT-PAD-24', name: 'Equipment Pad 24x24',
    category: 'Installation Parts', supplier: 'Snap Supply Co',
    quantityOnHand: 3, reorderPoint: 10, unitCostCAD: 45,
    location: 'Belway Warehouse', status: 'low-stock',
  },
]

export const monthlySpend = [
  { month: 'Oct', CAD: 82000, USD: 95000 },
  { month: 'Nov', CAD: 71000, USD: 88000 },
  { month: 'Dec', CAD: 45000, USD: 62000 },
  { month: 'Jan', CAD: 93000, USD: 110000 },
  { month: 'Feb', CAD: 88000, USD: 105000 },
  { month: 'Mar', CAD: 85200, USD: 120600 },
]
