import Axios from 'axios'
import { IntentRequest, IntentResponse } from '../../types/api/ai'
import { geocode } from '../location/geocoding'

export async function understandIntent(
  request: IntentRequest
): Promise<IntentResponse> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey === 'placeholder') {
    console.warn('No Groq API key — using placeholder')
    return {
      destinationQuery: request.userInput,
      destinationCoords: {
        lat: request.userLocation.lat + 0.01,
        lng: request.userLocation.lng + 0.01,
      },
      confidence: 'low',
      clarificationNeeded: false,
      detectedLanguage: request.userLanguage ?? 'en',
    }
  }

  const prompt = `
You are a travel assistant. The user wants to go somewhere.
Their message: "${request.userInput}"
Their current coordinates: lat ${request.userLocation.lat}, lng ${request.userLocation.lng}

Respond with ONLY valid JSON, nothing else:
{
  "destinationQuery": "name of the place they want to go",
  "destinationCoords": { "lat": 0.0, "lng": 0.0 },
  "confidence": "high",
  "clarificationNeeded": false,
  "clarificationQuestion": null,
  "detectedLanguage": "en"
}

Rules:
- destinationCoords must be real coordinates of that place
- confidence is "high", "medium", or "low"
- detectedLanguage is the language the user wrote in
- if you are not sure what place they mean, set clarificationNeeded to true
`

  try {
    
     

    const response = await Axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const raw = response.data.choices[0].message.content
    const parsed = JSON.parse(raw)

 const realCoords = await geocode(parsed.destinationQuery)
 console.log('Nominatim coords:', realCoords)
console.log('Destination query:', parsed.destinationQuery)

return {
  destinationQuery: parsed.destinationQuery,
  destinationCoords: realCoords ?? parsed.destinationCoords,
  confidence: parsed.confidence ?? 'high',
  clarificationNeeded: parsed.clarificationNeeded ?? false,
  clarificationQuestion: parsed.clarificationQuestion ?? undefined,
  detectedLanguage: parsed.detectedLanguage ?? 'en',
}

  } catch (err) {
    console.error('Groq error:', err)
    return {
      destinationQuery: request.userInput,
      destinationCoords: {
        lat: request.userLocation.lat + 0.01,
        lng: request.userLocation.lng + 0.01,
      },
      confidence: 'low',
      clarificationNeeded: false,
      detectedLanguage: request.userLanguage ?? 'en',
    }
  }
}