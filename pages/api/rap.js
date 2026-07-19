// pages/api/rap.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { line, style, bars, previousBars, mode } = req.body
  if (!line) return res.status(400).json({ error: 'Line is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })
  const styleGuides = {
    'trap': 'Trap: short punchy lines, internal rhymes, melodic cadence, hustle themes.',
    'boom-bap': 'Boom bap: complex multi-syllable rhymes, lyrical wordplay, classic hip-hop.',
    'melodic': 'Melodic rap: sing-songy flow, emotional hooks, focus on feeling.',
    'aggressive': 'Aggressive: fast delivery, intense imagery, punching rhymes, high energy.',
    'storytelling': 'Storytelling: vivid narrative, specific details, scene-setting.',
    'uk-drill': 'UK Drill: dark, sliding 808 basslines, 140 BPM, gritty London slang, menacing minor-key melodies, deadpan aggressive delivery.',
    'chicago-drill': 'Chicago Drill: haunting piano loops, 60-70 BPM (half-time feel), triplet flows, street-level violent imagery, cold detached tone.',
    'g-funk': 'G-funk: laid-back 90-100 BPM, whining synth leads, deep funk bassline, West Coast cruising vibe, smooth confident delivery.',
    'cloud-rap': 'Cloud rap: dreamy reverb-heavy production, melodic/autotuned delivery, hazy introspective lyrics, slow-to-mid tempo.',
    'mumble-rap': 'Mumble rap: melodic autotuned ad-libs, simple repetitive hooks, trap-influenced beat, mood over lyricism.',
    'grime': 'Grime: 140 BPM, aggressive electronic bassline, rapid-fire UK MC delivery, dark syncopated rhythm, East London slang.',
    'latin-trap': 'Latin trap: reggaeton-influenced trap beat, Spanish/Spanglish flow, dembow-adjacent rhythm, bilingual wordplay.',
    'afroswing': 'Afroswing: Afrobeats-influenced bounce, melodic UK-accented flow, warm percussive rhythm, romantic/street duality.',
    'chopped-screwed': 'Chopped and screwed: slowed-down tempo, deep pitched-down vocal feel, syrupy laid-back Houston delivery, hypnotic repetition.',
    'phonk': 'Phonk: distorted 808 cowbell, Memphis horrorcore-influenced sample chops, dark lo-fi texture, aggressive but hazy delivery.',
  }
  const barCount = parseInt(bars) || 2
  const selectedStyle = styleGuides[style] || styleGuides['trap']
  const previousContext = previousBars && previousBars.length > 0
    ? ' Previous bars: ' + previousBars.slice(-4).join(' / ')
    : ''

  const systemPrompt = mode === 'full-song'
    ? 'You are a rap lyricist. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have these exact keys: "analysis" (one sentence about the overall theme), "sections" (array of objects, each with "label" — one of "Verse 1", "Hook", "Verse 2", "Outro" — and "lines" — an array of bar strings for that section: 8-10 lines for each Verse, 4 lines for Hook, 4 lines for Outro), "rhyme_words" (array of 4-6 key rhyming words used). The Hook should be simple, repeatable, and catchy — distinct in rhythm from the verses. Style guide: ' + selectedStyle
    : 'You are a rap lyricist. Return ONLY a raw JSON object with no markdown, no backticks, no extra text. The JSON must have these exact keys: "analysis" (one sentence about the rhyme scheme of the input line), "generated_bars" (array of exactly ' + barCount + ' rap bar strings that flow from the input), "rhyme_words" (array of 4-6 key rhyming words used). Style guide: ' + selectedStyle + previousContext

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
        max_tokens: 1500,
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