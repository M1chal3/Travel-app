import { NextRequest, NextResponse } from 'next/server'
import { understandIntent } from '../../../lib/ai/understand-intent'
import { IntentRequest } from '../../../types/api/ai'

export async function POST(request: NextRequest) {
  try {
    const body: IntentRequest = await request.json()

    if (!body.userInput || !body.userLocation) {
      return NextResponse.json(
        { error: 'userInput and userLocation are required' },
        { status: 400 }
      )
    }

    const result = await understandIntent(body)

    return NextResponse.json(result)

  } catch (error) {
    console.error('AI understand error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}