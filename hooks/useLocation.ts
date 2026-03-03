import { useState, useEffect } from 'react'
import { Coordinates } from '../types/core/location'

interface LocationState {
  coordinates: Coordinates | null
  loading: boolean
  error: string | null
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Browser doesn't support GPS
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: 'GPS not supported on this device',
      })
      return
    }

    // Ask user for location permission
    navigator.geolocation.getCurrentPosition(
      // Success — user allowed it
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
        })
      },
      // Failed — user denied or something went wrong
      (err) => {
        setState({
          coordinates: null,
          loading: false,
          error: 'Could not get your location — please allow GPS access',
        })
        console.error('GPS error:', err)
      }
    )
  }, [])

  return state
}