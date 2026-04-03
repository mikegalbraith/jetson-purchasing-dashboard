import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dbToUi } from '@/lib/status'

export const dynamic = 'force-dynamic'

export async function GET() {
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

  const result = suppliers.map(({ _count, status, ...s }) => ({
    ...s,
    status: dbToUi(status),
    activePOs: _count.purchaseOrders,
  }))

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supplier = await prisma.supplier.create({ data: body })
  return NextResponse.json(supplier, { status: 201 })
}
