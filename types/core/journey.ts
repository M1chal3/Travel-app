import { Coordinates } from './location'


//types of transport that can poeple use 
export type TransportMode =
  | 'walking'
  | 'tram'
  | 'metro'
  | 'bus'
  | 'train'
  | 'taxi'
  | 'ferry'

export interface Step {
  id: string
  type: TransportMode
  instruction: string
  detail: string
  durationSeconds: number
  distanceMeters?: number // optinal, not all steps may have distance information, using ? to indicate that
  lineLabel?: string
  direction?: string
  stopName?: string
  stopsCount?: number
  arrivalTimeISO?: string
}

export type RouteType = 'easiest' | 'cheapest' | 'fastest'

export interface RouteOption {
  type: RouteType
  steps: Step[]
  totalDurationSeconds: number
  totalPriceEUR: number
  transferCount: number
  provider: 'navitia' | 'rome2rio' | 'google'
}

export interface Journey {
  id: string
  userId?: string
  origin: Coordinates
  destination: Coordinates
  destinationName: string
  chosenRoute: RouteType
  routes: RouteOption[]
  startedAt: string
  completedAt?: string
  currentStepIndex: number
  status: 'planning' | 'active' | 'completed' | 'abandoned'
}