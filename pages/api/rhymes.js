// pages/api/rhymes.js
// This runs on the SERVER — your Anthropic API key is never exposed to users

async function fetchWithRetry(apiKey, word, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
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
          system: `You are a strict phonetic rhyme-classification engine for poets and songwriters. Return ONLY a valid raw JSON object — no markdown, no backticks, no preamble.
The JSON must have exactly these three keys:
- "perfect": 10-12 words where (1) the vowel sound of the final stressed syllable is IDENTICAL and (2) every consonant sound AFTER that vowel is IDENTICAL. Example: pain → gain, rain, train. Wolf → NO perfect rhymes exist (gulf/engulf have a different vowel sound). Chimney → NO perfect rhymes exist (flimsy/whimsy have a different ending consonant). Warmth → NO perfect rhymes exist (swarm/storm are missing the final th sound). Else → NO perfect rhymes exist (bells/cells have a different vowel+consonant cluster). If fewer than 3 true perfect rhymes exist, return an empty array []. Proper nouns are NOT allowed.
- "near": 10-12 words where the vowel OR the consonant cluster is close but not identical. This is where wolf/gulf, chimney/flimsy, warmth/swarm, else/bells belong.
- "slant": 10-12 words with only a loose sonic connection — same ending consonant, similar vowel, or partial match only.
Critical rules:
- A word can only appear in ONE category
- PERFECT means phonetically identical from the stressed vowel onward — no exceptions
- If in doubt, it is NOT a perfect rhyme — downgrade it to near, never upgrade
- No proper nouns in perfect rhymes
- Common everyday words preferred over obscure ones
- Return only the raw JSON object, nothing else.`,
          messages: [{ role: 'user', content: `Find rhymes for the word: "${word.trim()}"` }],
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'API error')
      }

      if (!data.content || !data.content[0]) {
        throw new Error('Invalid API response')
      }

      return data

    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, delay * (i + 1)))
    }
  }
}

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
    const data = await fetchWithRetry(apiKey, word)
    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Rhyme API error:', error)
    return res.status(500).json({ error: 'Failed to find rhymes' })
  }
}
