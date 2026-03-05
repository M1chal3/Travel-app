import { NextRequest, NextResponse } from 'next/server'
import { getRoutes } from '../../../../lib/transport'
import { Coordinates } from '../../../../types/core/location'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination }: { origin: Coordinates, destination: Coordinates } = body

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'origin and destination are required' },
        { status: 400 }
      )
    }

    const routes = await getRoutes(origin, destination)

    return NextResponse.json(routes)

  } catch (error) {
    console.error('Routes search error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}