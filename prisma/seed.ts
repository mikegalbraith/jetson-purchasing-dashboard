import { PrismaClient, POStatus, SupplierStatus, InventoryStatus, Currency } from '@prisma/client'

const prisma = new PrismaClient()

const suppliers = [
  { name: 'MrCool LLC', category: 'Heat Pumps', contactEmail: 'orders@mrcool.com', leadTimeDays: 14, rating: 4.2, totalSpendCAD: 892000, status: SupplierStatus.active },
  { name: 'Midea', category: 'Heat Pumps', contactEmail: 'supply@midea.com', leadTimeDays: 21, rating: 4.0, totalSpendCAD: 645000, status: SupplierStatus.active },
  { name: 'Carrier Canada', category: 'HVAC Equipment', contactEmail: 'b2b@carrier.ca', leadTimeDays: 10, rating: 4.5, totalSpendCAD: 312000, status: SupplierStatus.active },
  { name: 'Fujitsu Canada', category: 'Mini-Splits', contactEmail: 'commercial@fujitsu.ca', leadTimeDays: 12, rating: 4.3, totalSpendCAD: 278000, status: SupplierStatus.active },
  { name: 'Snap Supply Co', category: 'Installation Parts', contactEmail: 'orders@snapsupply.ca', leadTimeDays: 5, rating: 3.8, totalSpendCAD: 95000, status: SupplierStatus.active },
]

const purchaseOrders = [
  { poNumber: 'PO-2026-0041', supplier: 'MrCool LLC', status: POStatus.approved, items: 24, totalCAD: 0, totalUSD: 48600, currency: Currency.USD, createdAt: '2026-03-28', expectedDelivery: '2026-04-15' },
  { poNumber: 'PO-2026-0040', supplier: 'Midea', status: POStatus.submitted, items: 50, totalCAD: 0, totalUSD: 112500, currency: Currency.USD, createdAt: '2026-03-25', expectedDelivery: '2026-04-20' },
  { poNumber: 'PO-2026-0039', supplier: 'Carrier Canada', status: POStatus.received, items: 12, totalCAD: 31200, totalUSD: 0, currency: Currency.CAD, createdAt: '2026-03-18', expectedDelivery: '2026-03-30' },
  { poNumber: 'PO-2026-0038', supplier: 'MrCool LLC', status: POStatus.received, items: 36, totalCAD: 0, totalUSD: 72000, currency: Currency.USD, createdAt: '2026-03-10', expectedDelivery: '2026-03-25' },
  { poNumber: 'PO-2026-0037', supplier: 'Fujitsu Canada', status: POStatus.approved, items: 18, totalCAD: 54000, totalUSD: 0, currency: Currency.CAD, createdAt: '2026-03-05', expectedDelivery: '2026-04-10' },
  { poNumber: 'PO-2026-0036', supplier: 'Midea', status: POStatus.draft, items: 30, totalCAD: 0, totalUSD: 67500, currency: Currency.USD, createdAt: '2026-04-01', expectedDelivery: '2026-04-25' },
]

const inventoryItems = [
  { sku: 'HP-MC-36K', name: 'MrCool 36K BTU Heat Pump', category: 'Heat Pumps', supplier: 'MrCool LLC', quantityOnHand: 18, reorderPoint: 10, unitCostCAD: 2025, location: 'Belway Warehouse', status: InventoryStatus.in_stock },
  { sku: 'HP-MD-24K', name: 'Midea 24K BTU Mini-Split', category: 'Mini-Splits', supplier: 'Midea', quantityOnHand: 4, reorderPoint: 8, unitCostCAD: 1650, location: 'Belway Warehouse', status: InventoryStatus.low_stock },
  { sku: 'HP-FJ-18K', name: 'Fujitsu 18K BTU Wall Unit', category: 'Mini-Splits', supplier: 'Fujitsu Canada', quantityOnHand: 22, reorderPoint: 10, unitCostCAD: 1800, location: 'Belway Warehouse', status: InventoryStatus.in_stock },
  { sku: 'PT-CU-38', name: 'Copper Line Set 3/8"', category: 'Installation Parts', supplier: 'Snap Supply Co', quantityOnHand: 0, reorderPoint: 20, unitCostCAD: 85, location: 'Belway Warehouse', status: InventoryStatus.out_of_stock },
  { sku: 'HP-CR-48K', name: 'Carrier 48K BTU Ducted HP', category: 'Heat Pumps', supplier: 'Carrier Canada', quantityOnHand: 6, reorderPoint: 5, unitCostCAD: 4200, location: 'Belway Warehouse', status: InventoryStatus.in_stock },
  { sku: 'PT-PAD-24', name: 'Equipment Pad 24x24', category: 'Installation Parts', supplier: 'Snap Supply Co', quantityOnHand: 3, reorderPoint: 10, unitCostCAD: 45, location: 'Belway Warehouse', status: InventoryStatus.low_stock },
]

const monthlySpend = [
  { month: 'Oct', year: 2025, CAD: 82000, USD: 95000 },
  { month: 'Nov', year: 2025, CAD: 71000, USD: 88000 },
  { month: 'Dec', year: 2025, CAD: 45000, USD: 62000 },
  { month: 'Jan', year: 2026, CAD: 93000, USD: 110000 },
  { month: 'Feb', year: 2026, CAD: 88000, USD: 105000 },
  { month: 'Mar', year: 2026, CAD: 85200, USD: 120600 },
]

async function main() {
  console.log('Seeding database...')

  // 1. Create suppliers
  const supplierMap = new Map<string, string>()
  for (const s of suppliers) {
    const created = await prisma.supplier.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    })
    supplierMap.set(s.name, created.id)
  }
  console.log(`  Created ${supplierMap.size} suppliers`)

  // 2. Create purchase orders
  for (const po of purchaseOrders) {
    const { supplier, createdAt, expectedDelivery, ...rest } = po
    await prisma.purchaseOrder.upsert({
      where: { poNumber: po.poNumber },
      update: {},
      create: {
        ...rest,
        supplierId: supplierMap.get(supplier)!,
        createdAt: new Date(createdAt),
        expectedDelivery: new Date(expectedDelivery),
      },
    })
  }
  console.log(`  Created ${purchaseOrders.length} purchase orders`)

  // 3. Create inventory items
  for (const item of inventoryItems) {
    const { supplier, ...rest } = item
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        ...rest,
        supplierId: supplierMap.get(supplier)!,
      },
    })
  }
  console.log(`  Created ${inventoryItems.length} inventory items`)

  // 4. Create monthly spend records
  for (const ms of monthlySpend) {
    await prisma.monthlySpend.upsert({
      where: { month_year: { month: ms.month, year: ms.year } },
      update: {},
      create: ms,
    })
  }
  console.log(`  Created ${monthlySpend.length} monthly spend records`)

  console.log('Seeding complete!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
