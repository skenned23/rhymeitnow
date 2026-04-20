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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `You are a precise rhyme-classification engine for poets and songwriters. Return ONLY a valid raw JSON object — no markdown, no backticks, no preamble.

The JSON must have exactly these three keys:

- "perfect": 10-12 words that share the IDENTICAL vowel sound AND ending consonant sound as the input word. Example: pain → gain, rain, train, chain, plain, brain. These must sound exactly the same from the stressed vowel onward. Proper nouns are NOT allowed in perfect rhymes.

- "near": 10-12 words that share a VERY SIMILAR but not identical ending sound. The vowel or consonant is slightly different. Example: pain → pen, pine, pone, pawn. Do NOT include words that are already perfect rhymes — near rhymes must be genuinely imperfect.

- "slant": 10-12 words that share only a LOOSE sonic connection — same consonant ending, similar vowel, or partial match only. Example: pain → plan, ran, fan, tan, sun. These are clearly imperfect rhymes used for texture in modern songwriting.

Critical rules:
- A word can only appear in ONE category
- Perfect rhymes must be genuinely identical in sound — when in doubt, move to near
- No proper nouns in perfect rhymes
- Common everyday words preferred over obscure ones
- Return only the raw JSON object, nothing else.`,
        messages: [{ role: 'user', content: `Find rhymes for the word: "${word.trim()}"` }],
      }),
    })
    const data = await response.json()
    if (data.error) {
      console.error('Anthropic error:', data.error)
      return res.status(500).json({ error: data.error.message || 'API error' })
    }
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
