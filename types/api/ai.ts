import { Coordinates } from '../core/location'

export interface IntentRequest {
  userInput: string
  userLocation: Coordinates
  userLanguage?: string
  budgetEUR?: number
}

export interface IntentResponse {
  destinationQuery: string
  destinationCoords: Coordinates
  confidence: 'high' | 'medium' | 'low'
  clarificationNeeded: boolean
  clarificationQuestion?: string
  detectedLanguage: string
}

