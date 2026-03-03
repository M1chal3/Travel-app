export interface Coordinates {
  lat: number
  lng: number
}

export interface Place {
  id: string
  name: string
  coordinates: Coordinates
  city: string
  country: string
  category?: 'transport' | 'food' | 'atm' | 'hospital' | 'other'
}