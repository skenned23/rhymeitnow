// pages/api/rap.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { line, style, bars, previousBars } = req.body
  if (!line) return res.status(400).json({ error: 'Line is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })
  const styleGuides = {
    'trap': 'Trap: short punchy lines, internal rhymes, melodic cadence, hustle themes.',
    'boom-bap': 'Boom bap: complex multi-syllable rhymes, lyrical wordplay, classic hip-hop.',
    'melodic': 'Melodic rap: sing-songy flow, emotional hooks, focus on feeling.',
    'aggressive': 'Aggressive: fast delivery, intense imagery, punching rhymes, high energy.',
    'storytelling': 'Storytelling: vivid narrative, specific details, scene-setting.',
  }
  const barCount = parseInt(bars) || 2
  const selectedStyle = styleGuides[style] || styleGuides['trap']
  const previousContext = previousBars && previousBars.length > 0
    ? ' Previous bars: ' + previousBars.slice(-4).join(' / ')
    : ''
 const systemPrompt = 'You are a rap lyricist. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have these exact keys: "analysis" (one sentence about the rhyme scheme of the input line), "generated_bars" (array of exactly ' + barCount + ' rap bar strings that flow from the input), "rhyme_words" (array of 4-6 key rhyming words used). IMPORTANT RULES: 1) NEVER repeat the same word or phrase more than once across all bars — if a word appears in bar 1, do not use it again in bars 2-8. 2) Keep each bar to a similar length — no bar should be more than 50% longer than the shortest bar. Aim for consistent syllable count so the verse can actually be rapped. 3) The FINAL bar only should callback to the core theme or keyword of the input line — do not callback in any other bar. Use internal rhymes within bars, not just end rhymes. Style guide: ' + selectedStyle + previousContext
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
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate ' + barCount + ' rap bars continuing from this line: "' + line.trim() + '"' }],
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
    return res.status(500).json({ error: 'Failed to generate bars' })
  }
}
