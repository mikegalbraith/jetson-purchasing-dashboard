import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dbToUi } from '@/lib/status'

export async function GET() {
  const items = await prisma.inventoryItem.findMany({
    include: { supplier: true },
    orderBy: { name: 'asc' },
  })

  const result = items.map(({ supplier, status, ...item }) => ({
    ...item,
    supplier: supplier.name,
    status: dbToUi(status),
  }))

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const item = await prisma.inventoryItem.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
