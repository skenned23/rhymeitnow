// pages/api/poetry.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { line, style, tone, stanzas, previousLines, titleOnly } = req.body
  if (!line) return res.status(400).json({ error: 'Line is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  // Title generation mode
  if (titleOnly) {
    const titlePrompt = 'You are a poet. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have one key: "title" (a short, evocative poem title of 2-6 words that captures the essence of the verse provided). The title should feel literary, not generic.'
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 100,
          system: titlePrompt,
          messages: [{ role: 'user', content: 'Generate a title for this verse: "' + line.trim() + '"' }],
        }),
      })
      const data = await response.json()
      const raw = data.content?.[0]?.text || ''
      const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(clean)
      return res.status(200).json(parsed)
    } catch {
      return res.status(500).json({ error: 'Could not generate title' })
    }
  }

  const styleGuides = {
    'free-verse': 'Free verse: no strict rhyme scheme required, but use natural rhythm, line breaks for emphasis, and fresh unexpected imagery. Let the language breathe.',
    'sonnet': 'Sonnet: follow the ABAB CDCD EFEF GG rhyme scheme. Use iambic pentameter where possible. Build toward a volta (turn) and a closing couplet that resolves the tension.',
    'haiku': 'Haiku: 3 lines only — 5 syllables, 7 syllables, 5 syllables. Focus on a single sensory image from nature or everyday life. Capture a fleeting moment.',
    'ballad': 'Ballad: alternating 4-line stanzas with ABCB or ABAB rhyme. Tell a story with narrative momentum. Use simple, musical language with a refrain-like quality.',
    'spoken-word': 'Spoken word: conversational but elevated. Use repetition, anaphora, and rhythmic build. Write for the ear — it should sound powerful when read aloud. Bridge between poetry and performance.',
  }

  const toneGuides = {
    'dark': 'Tone: dark and melancholic. Use shadows, loss, weight, silence. Imagery should feel heavy and atmospheric.',
    'romantic': 'Tone: romantic and tender. Use warmth, longing, intimacy. Imagery should feel soft and emotionally vivid.',
    'spiritual': 'Tone: spiritual and transcendent. Use light, breath, the divine, the eternal. Imagery should feel expansive and sacred.',
    'nature': 'Tone: nature-inspired and grounded. Use seasons, elements, landscapes, animals. Imagery should be specific and sensory.',
    'reflective': 'Tone: reflective and introspective. Use memory, time, the self. Imagery should feel quiet and contemplative.',
  }

  const lineCount = (parseInt(stanzas) || 1) * 4
  const selectedStyle = styleGuides[style] || styleGuides['free-verse']
  const selectedTone = toneGuides[tone] || toneGuides['reflective']
  const previousContext = previousLines && previousLines.length > 0
    ? ' Previous lines: ' + previousLines.slice(-6).join(' / ')
    : ''

  const systemPrompt = 'You are a master poet and creative writing professor. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have these exact keys: "analysis" (one sentence about the craft elements of the input line — meter, imagery, or emotional tone), "generated_lines" (array of exactly ' + lineCount + ' poetry lines that flow naturally from the input line), "imagery_words" (array of 4-6 key imagery or rhyme words used in the generated lines). CRITICAL RULES: 1) Write using elevated, sensory, and evocative language suitable for serious poetry. Avoid rap slang, urban tropes, or beat-driven cadence. 2) Focus on metaphor, imagery, and meter — not rhyme for its own sake. 3) NEVER repeat the same word or phrase more than once across the generated lines. Every word choice must feel intentional. 4) Each line should feel like it earns its place — no filler lines. 5) The final line should land with weight — a closing image, a turn, or a quiet revelation. Style guide: ' + selectedStyle + ' ' + selectedTone + previousContext

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate ' + lineCount + ' lines of poetry continuing from this opening line: "' + line.trim() + '"' }],
      }),
    })
    const data = await response.json()
    if (data.error) {
      console.error('Anthropic error:', data.error)
      return res.status(500).json({ error: data.error.message || 'API error' })
    }
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Bad response:', JSON.stringify(data).slice(0, 200))
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
    return res.status(500).json({ error: 'Failed to generate verse' })
  }
}
