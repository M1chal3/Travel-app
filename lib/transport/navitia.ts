import axios from 'axios'
import { Coordinates } from '../../types/core/location'
import { RouteOption, Step } from '../../types/core/journey'

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

async function fetchOsrmRoute(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'foot' | 'bike' | 'car'
): Promise<{ steps: Step[], duration: number, distance: number } | null> {
  try {
    const profile = mode === 'foot' ? 'foot' : mode === 'bike' ? 'bike' : 'driving'
    
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
      {
        params: {
          overview: 'full',
          steps: true,
        },
      }
    )

    const data = response.data as OsrmResponse
    

    if (!data.routes || data.routes.length === 0) return null

    const route = data.routes[0]
    const leg = route.legs[0]
const distance = Math.round(leg.distance)

// OSRM public server only supports driving
// Calculate realistic duration based on mode
let totalDuration: number
if (mode === 'foot') {
  totalDuration = Math.round(distance / 83 * 60)
} else if (mode === 'bike') {
  totalDuration = Math.round(distance / 250 * 60)
} else {
  totalDuration = Math.round(leg.duration)
}

const steps: Step[] = leg.steps.map((s: OsrmStep, i: number) => ({
  id: String(i),
  type: mode === 'foot' ? 'walking' : mode === 'bike' ? 'walking' : 'taxi',
  instruction: s.maneuver?.type === 'arrive'
    ? 'You have arrived'
    : formatOsrmInstruction(s),
  detail: `${Math.round(s.distance)}m`,
  durationSeconds: mode === 'foot'
    ? Math.round(s.distance / 83 * 60)
    : mode === 'bike'
    ? Math.round(s.distance / 250 * 60)
    : Math.round(s.duration),
  distanceMeters: Math.round(s.distance),
} as Step))

return {
  steps,
  duration: totalDuration,
  distance,
}

  } catch (error) {
    console.error(`OSRM ${mode} error:`, error)
    return null
  }
}

export async function getRoutesFromNavitia(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteOption[] | null> {

  const walking = await fetchOsrmRoute(origin, destination, 'foot')

  if (!walking) return null

  // Calculate estimated taxi price — €1.5 base + €1.2 per km
  const distanceKm = walking.distance / 1000
  const taxiPrice = Math.round((1.5 + distanceKm * 1.2) * 10) / 10
  const taxiDuration = Math.round(walking.duration * 0.25) // taxi ~4x faster than walking

  const routes: RouteOption[] = [
    {
      type: 'easiest',
      steps: walking.steps,
      totalDurationSeconds: walking.duration,
      totalPriceEUR: 0,
      transferCount: 0,
      provider: 'navitia',
    },
    {
      type: 'fastest',
      steps: [
        {
          id: '1',
          type: 'taxi',
          instruction: 'Take a taxi or Uber',
          detail: `Estimated ${taxiDuration} min · door to door`,
          durationSeconds: taxiDuration * 60,
          distanceMeters: walking.distance,
        }
      ],
      totalDurationSeconds: taxiDuration * 60,
      totalPriceEUR: taxiPrice,
      transferCount: 0,
      provider: 'navitia',
    },
    {
  type: 'cheapest',
  steps: [
    {
      id: '1',
      type: 'walking',
      instruction: `Walk ${(walking.distance / 1000).toFixed(1)}km to your destination`,
      detail: `Free · ${Math.round(walking.duration / 60)} min on foot`,
      durationSeconds: walking.duration,
      distanceMeters: walking.distance,
    }
  ],
  totalDurationSeconds: walking.duration,
  totalPriceEUR: 0,
  transferCount: 0,
  provider: 'navitia',
},
  ]

  return routes
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