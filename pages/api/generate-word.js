// pages/api/generate-word.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { word } = req.body
  if (!word) return res.status(400).json({ error: 'Word is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })
  const systemPrompt = `You are an expert SEO content writer and songwriting coach for RhymeItNow — a rhyme-finding tool for poets, songwriters, and rappers. Your job is to generate a "Lyrical Cheat Sheet" for a given word. This is NOT just a rhyme list — it is a songwriter resource that helps people understand how to actually USE the word in their lyrics.

Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

The JSON must match this exact structure (replace WORD with the actual word):

{
  "WORD": {
    "intro": "2-3 sentences about this word in songwriting and poetry. Mention its rhyme family, emotional weight, and which genres use it most. 60-80 words.",
    "famous_uses": [
      { "context": "Title — Artist/Author", "note": "One sentence about how they used the word, what rhymes they paired it with, and what emotional effect it created." },
      { "context": "Title — Artist/Author", "note": "One sentence about how they used the word, what rhymes they paired it with, and what emotional effect it created." },
      { "context": "Title — Author", "note": "One sentence about the literary or musical use and the rhyme technique employed." }
    ],
    "faq": [
      { "q": "What rhymes perfectly with WORD?", "a": "List 8-10 perfect rhymes and describe the shared sound pattern." },
      { "q": "What are near rhymes for WORD?", "a": "List 5-6 near rhymes and explain what makes them near rhymes." },
      { "q": "What are slant rhymes for WORD?", "a": "List 4-5 slant rhymes and explain how modern songwriters use them." },
      { "q": "How do you use WORD in a rap song?", "a": "2-3 sentences of practical advice for rappers — which rhyme family to lean on, what flow patterns work, and one example of how to place it in a bar." },
      { "q": "What is the best rhyme scheme for WORD in poetry?", "a": "2-3 sentences about which poetic forms and rhyme schemes suit this word best, with a brief example." }
    ],
    "pro_tip": "One punchy, practical tip (2-3 sentences) for songwriters on how to use this word in a way that feels fresh rather than clichéd. Mention a specific unexpected rhyme pairing or placement technique.",
    "related": ["word1","word2","word3","word4","word5","word6","word7","word8"]
  }
}

Rules:
- The related array must have exactly 8 thematically connected common words
- All content must be genuinely useful to a songwriter or poet — not generic filler
- The pro_tip must be specific and actionable, not vague encouragement
- Famous uses must reference real, well-known songs or literary works
- Return ONLY the raw JSON object, nothing else`

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
        max_tokens: 1800,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate the Lyrical Cheat Sheet JSON entry for: "' + word.trim().toLowerCase() + '"' }],
      }),
    })
    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })
    const raw = data.content[0].text
    const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(clean)
    return res.status(200).json(parsed)
  } catch (error) {
    console.error('Generate error:', error)
    return res.status(500).json({ error: 'Failed to generate' })
  }
}
