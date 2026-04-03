import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: params.id },
    include: { supplier: true },
  })
  if (!po) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(po)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  if (body.expectedDelivery) body.expectedDelivery = new Date(body.expectedDelivery)
  const po = await prisma.purchaseOrder.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(po)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.purchaseOrder.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true })
}
