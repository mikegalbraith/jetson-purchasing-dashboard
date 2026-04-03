import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const spend = await prisma.monthlySpend.findMany({
    orderBy: [{ year: 'asc' }, { month: 'asc' }],
  })

  const result = spend.map(({ id, year, ...s }) => s)
  return NextResponse.json(result)
}
