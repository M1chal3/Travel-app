import { Coordinates } from '../../types/core/location'
import { RouteOption } from '../../types/core/journey'
import { getRoutesFromNavitia } from './navitia'
import { getRoutesFromOpenRoute } from './openroute'
import { humanizeSteps } from '../ai/humanize-steps'


export async function getRoutes(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteOption[]> {

  // Try Navitia first
  const navitiaRoutes = await getRoutesFromNavitia(origin, destination)

 if (navitiaRoutes && navitiaRoutes.length > 0) {
  
  const humanized = await Promise.all(
    navitiaRoutes.map(async route => {
      
      return {
        ...route,
        steps: await humanizeSteps(route.steps)
      }
    })
  )
  return humanized
}

  // Navitia failed or returned nothing — try OpenRouteService
  const openRoutes = await getRoutesFromOpenRoute(origin, destination)

  if (openRoutes && openRoutes.length > 0) {
  console.log('Routes from OpenRouteService')
  const humanized = await Promise.all(
    openRoutes.map(async route => ({
      ...route,
      steps: await humanizeSteps(route.steps)
    }))
  )
  return humanized
}

  // Both failed — return placeholder so app still works
  console.warn('All transport providers failed — using placeholder')
  return getPlaceholderRoutes(origin, destination)
}

function getPlaceholderRoutes(
  origin: Coordinates,
  destination: Coordinates
): RouteOption[] {
  return [
    {
      type: 'easiest',
      steps: [
        {
          id: '1',
          type: 'walking',
          instruction: 'Walk to the nearest stop',
          detail: 'Follow the main road',
          durationSeconds: 300,
          distanceMeters: 400,
        },
        {
          id: '2',
          type: 'tram',
          instruction: 'Board Tram 18',
          detail: 'Direction city centre — any door',
          durationSeconds: 720,
          lineLabel: 'Tram 18',
          stopsCount: 4,
        },
        {
          id: '3',
          type: 'walking',
          instruction: 'Walk to your destination',
          detail: 'You are almost there',
          durationSeconds: 120,
          distanceMeters: 150,
        },
      ],
      totalDurationSeconds: 1140,
      totalPriceEUR: 2.40,
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
          detail: 'Door to door — no changes needed',
          durationSeconds: 420,
        },
      ],
      totalDurationSeconds: 420,
      totalPriceEUR: 14,
      transferCount: 0,
      provider: 'navitia',
    },
    {
      type: 'cheapest',
      steps: [
        {
          id: '1',
          type: 'walking',
          instruction: 'Walk to the metro station',
          detail: '8 minutes on foot',
          durationSeconds: 480,
          distanceMeters: 600,
        },
        {
          id: '2',
          type: 'metro',
          instruction: 'Take Metro Line 1',
          detail: 'Direction city centre — exit after 3 stops',
          durationSeconds: 540,
          lineLabel: 'Metro 1',
          stopsCount: 3,
        },
      ],
      totalDurationSeconds: 1020,
      totalPriceEUR: 2.40,
      transferCount: 1,
      provider: 'navitia',
    },
  ]
}