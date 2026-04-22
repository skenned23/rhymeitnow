// pages/api/find-a-word.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { query } = req.body
  if (!query) return res.status(400).json({ error: 'Query is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

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
        messages: [
          {
            role: 'user',
            content: `You are a master lexicographer and word finder. The user is looking for a specific word or concept. Give them the BEST word that fits.

User's description: "${query}"

Respond ONLY with a valid JSON object in this exact format, no markdown, no preamble:
{
  "word": "the word",
  "pronunciation": "phonetic pronunciation e.g. peh-TRI-kor",
  "part_of_speech": "noun / verb / adjective / etc",
  "origin": "Language of origin e.g. Greek, Latin, Japanese",
  "definition": "A clear, vivid definition in 1-2 sentences",
  "example": "A compelling example sentence using the word naturally",
  "why_it_fits": "A brief explanation of why this word perfectly captures what they described",
  "also_consider": ["alternative_word_1", "alternative_word_2", "alternative_word_3"]
}`
          }
        ],
      }),
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })
    const raw = data.content[0].text
    const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(clean)
    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Find a word error:', error)
    return res.status(500).json({ error: 'Failed to find word' })
  }
}
