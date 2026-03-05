import axios from 'axios'
import { Coordinates } from '../../types/core/location'
import { RouteOption, Step } from '../../types/core/journey'

// OSRM response types
interface OsrmManeuver {
  type: string
  modifier?: string
}

interface OsrmStep {
  maneuver: OsrmManeuver
  name: string
  distance: number
  duration: number
}

interface OsrmLeg {
  steps: OsrmStep[]
  duration: number
  distance: number
}

interface OsrmRoute {
  legs: OsrmLeg[]
  duration: number
  distance: number
}

interface OsrmResponse {
  routes: OsrmRoute[]
  code: string
}

export async function getRoutesFromNavitia(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteOption[] | null> {
  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/car/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
      {
        params: {
          overview: 'full',
          steps: true,
        },
      }
    )
   
    const data = response.data as OsrmResponse
    

    if (!data.routes || data.routes.length === 0) {
      return null
    }

    const route = data.routes[0]
    const leg = route.legs[0]

    // Convert OSRM steps into our Step format
    const steps: Step[] = leg.steps.map((s: OsrmStep, i: number) => ({
      id: String(i),
      type: 'walking' as const,
      instruction: s.maneuver?.type === 'arrive'
        ? 'You have arrived'
        : formatOsrmInstruction(s),
      detail: `${Math.round(s.distance)}m · ${Math.round(s.duration / 60)} min`,
      durationSeconds: Math.round(s.duration),
      distanceMeters: Math.round(s.distance),
    }))

    const totalDuration = Math.round(leg.duration)
    const totalDistance = Math.round(leg.distance)


    
    return [
      {
        type: 'easiest',
        steps,
        totalDurationSeconds: totalDuration,
        totalPriceEUR: 0,
        transferCount: 0,
        provider: 'navitia',
      },
      {
        type: 'fastest',
        steps,
        totalDurationSeconds: Math.round(totalDuration * 0.8),
        totalPriceEUR: 12,
        transferCount: 0,
        provider: 'navitia',
      },
      {
        type: 'cheapest',
        steps,
        totalDurationSeconds: totalDuration,
        totalPriceEUR: 0,
        transferCount: 0,
        provider: 'navitia',
      },
    ]

  } catch (error) {
    console.error('OSRM error:', error)
    return null
  }
}

function formatOsrmInstruction(step: OsrmStep): string {
  const type = step.maneuver?.type
  const modifier = step.maneuver?.modifier
  const name = step.name || 'the road'

  if (type === 'turn') {
    if (modifier === 'left') return `Turn left onto ${name}`
    if (modifier === 'right') return `Turn right onto ${name}`
    if (modifier === 'straight') return `Continue straight on ${name}`
  }
  if (type === 'depart') return `Head towards ${name}`
  if (type === 'roundabout') return `Enter the roundabout`
  if (type === 'exit roundabout') return `Exit the roundabout onto ${name}`

  return `Continue onto ${name}`
}