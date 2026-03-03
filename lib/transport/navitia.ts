import axios from 'axios'
import { Coordinates } from '../../types/core/location'
import { RouteOption } from '../../types/core/journey'

const BASE_URL = 'https://api.navitia.io/v1'

export async function getRoutesFromNavitia(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteOption[] | null> {
  try {
    const apiKey = process.env.NAVITIA_API_KEY

    if (!apiKey) {
      console.warn('No Navitia API key found')
      return null
    }

    const response = await axios.get(`${BASE_URL}/journeys`, {
      params: {
        from: `${origin.lng};${origin.lat}`,
        to: `${destination.lng};${destination.lat}`,
        count: 3,
      },
      headers: {
        Authorization: apiKey,
      },
    })

    const journeys = response.data.journeys

    if (!journeys || journeys.length === 0) {
      return null
    }

    // We will parse the response properly in the next file
    // For now return a placeholder so TypeScript is happy
    return []

  } catch (error) {
    console.error('Navitia error:', error)
    return null
  }
}