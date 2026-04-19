// pages/api/rhymes.js
// This runs on the SERVER — your Anthropic API key is never exposed to users

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { word } = req.body
  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Word is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: `You are a rhyme-finding engine. Return ONLY a valid raw JSON object — no markdown, no backticks, no preamble. The JSON must have exactly these keys:
- "perfect": array of 10-12 words that perfectly rhyme (identical vowel+consonant ending sound)
- "near": array of 10-12 words that nearly rhyme (very similar ending sounds)
- "slant": array of 10-12 words that slant rhyme (partial or loose sound match)
Return only the raw JSON object, nothing else.`,
        messages: [{ role: 'user', content: `Find rhymes for the word: "${word.trim()}"` }],
      }),
    })

    const data = await response.json()
    if (!data.content || !data.content[0]) {
      throw new Error('Invalid API response')
    }

    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Rhyme API error:', error)
    return res.status(500).json({ error: 'Failed to find rhymes' })
  }
}
