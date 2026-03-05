import axios from 'axios'
import { Coordinates } from '../../types/core/location'

export async function geocode(query: string): Promise<Coordinates | null> {
  const cleaned = query
    .replace(/^(find me|take me to|I want to go to|najdi mi|naviguj me do)/i, '')
    .replace(/\b(OC|nákupní centrum|shopping center|shopping mall)\b/gi, '')
    .trim()

  console.log('Geocoding cleaned query:', cleaned)

  try {
    const response = await axios.get(
      'https://photon.komoot.io/api/',
      {
        params: {
          q: cleaned,
          limit: 1,
        },
        headers: {
          'User-Agent': 'WayfarApp/1.0',
        },
      }
    )

    const features = response.data?.features

    if (!features || features.length === 0) {
      console.log('Photon returned nothing for:', cleaned)
      return null
    }

    const [lng, lat] = features[0].geometry.coordinates

    

    return { lat, lng }

  } catch (err) {
    console.error('Geocoding failed:', err)
    return null
  }
}