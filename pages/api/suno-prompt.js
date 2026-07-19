// pages/api/suno-prompt.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { lyrics, style, mood, vocals } = req.body
  if (!lyrics) return res.status(400).json({ error: 'Lyrics are required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const systemPrompt = 'You are a music producer writing Suno AI style prompts. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have exactly this key: "suno_prompt" (a single string, under 200 characters, describing genre, BPM, instrumentation, vocal delivery, and mood — written the way a Suno style prompt should be written: comma-separated descriptive tags, not a full sentence). Base it on the actual theme/content of the lyrics provided, not just the genre name generically.'

  const userMessage = `Style: ${style}\nMood: ${mood || 'any'}\nVocals: ${vocals || 'any'}\nLyrics:\n${lyrics}\n\nWrite a Suno style prompt for this specific song.`

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
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })
    const data = await response.json()
    if (data.error) {
      console.error('Anthropic error:', data.error)
      return res.status(500).json({ error: data.error.message || 'API error' })
    }
    if (!data.content || !data.content[0] || !data.content[0].text) {
      return res.status(500).json({ error: 'No content in response' })
    }
    const raw = data.content[0].text
    const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
    try {
      const parsed = JSON.parse(clean)
      return res.status(200).json(parsed)
    } catch {
      console.error('Parse fail:', clean.slice(0, 200))
      return res.status(500).json({ error: 'Could not parse response' })
    }
  } catch (error) {
    console.error('Fetch error:', error.message)
    return res.status(500).json({ error: 'Failed to generate Suno prompt' })
  }
}