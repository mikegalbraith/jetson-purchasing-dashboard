import { NextResponse } from 'next/server'
import { sampleSuppliers } from '@/lib/sample-data'

export async function GET() {
  // Replace with real data source (NetSuite API, database, etc.)
  return NextResponse.json(sampleSuppliers)
}
