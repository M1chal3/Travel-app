import axios from 'axios'
import { Coordinates } from '../../types/core/location'
import { RouteOption } from '../../types/core/journey'

const BASE_URL = 'https://api.openrouteservice.org/v2'

export async function getRoutesFromOpenRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteOption[] | null> {
  try {
    const apiKey = process.env.OPENROUTE_API_KEY

    if (!apiKey || apiKey === 'placeholder') {
      console.warn('No OpenRouteService API key found')
      return null
    }

    const response = await axios.get(
      `${BASE_URL}/directions/driving-car`,
      {
        params: {
          start: `${origin.lng},${origin.lat}`,
          end: `${destination.lng},${destination.lat}`,
        },
        headers: {
          Authorization: apiKey,
        },
      }
    )

    if (!response.data) {
      return null
    }

    // Parsed properly in next step
    return []

  } catch (error) {
    console.error('OpenRouteService error:', error)
    return null
  }
}