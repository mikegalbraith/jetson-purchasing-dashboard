import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const pos = await prisma.purchaseOrder.findMany({
    include: { supplier: true },
    orderBy: { createdAt: 'desc' },
  })

  const result = pos.map(({ supplier, createdAt, expectedDelivery, ...po }) => ({
    ...po,
    supplier: supplier.name,
    createdAt: createdAt.toISOString().split('T')[0],
    expectedDelivery: expectedDelivery.toISOString().split('T')[0],
  }))

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { supplierId, expectedDelivery, ...rest } = body
  const po = await prisma.purchaseOrder.create({
    data: {
      ...rest,
      supplierId,
      expectedDelivery: new Date(expectedDelivery),
    },
  })
  return NextResponse.json(po, { status: 201 })
}
