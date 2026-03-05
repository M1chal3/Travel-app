import { Step } from '../../types/core/journey'
import Axios from 'axios'

export async function humanizeSteps(steps: Step[]): Promise<Step[]> {
  
  const apiKey = process.env.GROQ_API_KEY
  

  if (!apiKey || apiKey === 'placeholder') {
    return steps
  }

  const prompt = `
Here are navigation steps as JSON:
${JSON.stringify(steps)}

Rewrite each "instruction" field to be:
- Warm and encouraging — like a friend helping them
- Add the distance or time if available from the step data
- Add reassuring phrases like "you're doing great", "almost there" on later steps
- Keep it short — max 10 words per instruction
- Keep all other fields exactly the same

Return ONLY a valid JSON array, nothing else.
`

  try {
    const response = await Axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
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
    return parsed

  } catch (err) {
  console.error('Humanize error full:', JSON.stringify(err, null, 2))
  return steps
}
}