import { IntentRequest, IntentResponse } from '../../../wayfar/types/api/ai'

export async function understandIntent(
  request: IntentRequest
): Promise<IntentResponse> {

  // TEMPORARY — replace this with real Claude API call
  // when you have an Anthropic API key
  console.log('User said:', request.userInput)

  // For now we return a fake response so the app still works
  return {
    destinationQuery: request.userInput,
    destinationCoords: {
      lat: request.userLocation.lat + 0.01,
      lng: request.userLocation.lng + 0.01,
    },
    confidence: 'high',
    clarificationNeeded: false,
    detectedLanguage: request.userLanguage ?? 'en',
  }
}