// pages/api/rap.js
// Server-side rap bar generator — API key never exposed to users

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { line, style, bars, previousBars } = req.body
  if (!line) return res.status(400).json({ error: 'Line is required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const styleGuides = {
    'trap': 'Trap style: Short punchy lines, lots of internal rhymes, melodic cadence, references to hustle and come-up. Keep it minimal and hard.',
    'boom-bap': 'Boom bap style: Complex multi-syllable rhymes, lyrical wordplay, classic hip-hop cadence, storytelling elements. Think Nas, Jay-Z, Kendrick.',
    'melodic': 'Melodic rap style: Sing-songy flow, emotional hooks, longer melodic lines, focus on feeling and vulnerability. Think Drake, Juice WRLD.',
    'aggressive': 'Aggressive style: Fast delivery, intense imagery, punching rhymes, energy and intensity in every bar. Think Eminem, Denzel Curry.',
    'storytelling': 'Storytelling style: Vivid narrative, specific details, scene-setting, character development in the bars. Think Slick Rick, Kendrick Lamar.',
  }

  const previousContext = previousBars && previousBars.length > 0
    ? `\nPrevious bars in this session:\n${previousBars.join('\n')}\n`
    : ''

  const system = `You are an expert rap lyricist and ghostwriter. You analyze rhyme schemes and cadence, then generate authentic rap bars. Return ONLY a valid raw JSON object — no markdown, no backticks, no explanation. The JSON must have exactly these keys:
- "analysis": one sentence analyzing the rhyme scheme and cadence of the input line (what end sound to match, what rhythm to follow)
- "generated_bars": array of exactly ${bars} strings, each being one rap bar that flows from the input line
- "rhyme_words": array of 4-6 key rhyming words used across the generated bars

Style guide: ${styleGuides[style] || styleGuides['trap']}

Rules for the generated bars:
- Match the end rhyme sound from the input line
- Maintain similar syllable count and cadence
- Use internal rhymes where natural
- Keep it authentic — no cheesy or forced rhymes
- Each bar should be 8-16 words
- Build on the theme/topic of the input line
${previousContext}
Return only the raw JSON object.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: `Generate ${bars} rap bars continuing from this line: "${line}"` }],
      }),
    })

    const data = await response.json()
    if (!data.content || !data.content[0]) throw new Error('Invalid API response')

    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Rap API error:', error)
    return res.status(500).json({ error: 'Failed to generate bars' })
  }
}
