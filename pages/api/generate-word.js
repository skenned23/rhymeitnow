// pages/api/generate-word.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { word } = req.body
  if (!word) return res.status(400).json({ error: 'Word is required' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const systemPrompt = `You are an SEO content writer for a rhyme-finding website called RhymeItNow. Generate a JSON entry for the word provided. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

The JSON must match this exact structure (replace WORD with the actual word):
{
  "WORD": {
    "intro": "2-3 sentences about this word in songwriting and poetry. Mention its rhyme family and emotional weight. 60-80 words.",
    "famous_uses": [
      { "context": "Title — Artist/Author", "note": "One sentence about how they used the word and what rhymes they paired it with." },
      { "context": "Title — Artist/Author", "note": "One sentence about how they used the word and what rhymes they paired it with." },
      { "context": "Title — Author", "note": "One sentence about the literary or musical use." }
    ],
    "faq": [
      { "q": "What rhymes perfectly with WORD?", "a": "List 8-10 perfect rhymes and describe the shared sound." },
      { "q": "What are near rhymes for WORD?", "a": "List 5-6 near rhymes and explain what makes them near rhymes." },
      { "q": "What are slant rhymes for WORD?", "a": "List 4-5 slant rhymes and explain how they work in modern songwriting." }
    ],
    "related": ["word1","word2","word3","word4","word5","word6","word7","word8"]
  }
}

The related array should have 8 thematically connected common words. Return ONLY the JSON object, nothing else.`

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
        messages: [{ role: 'user', content: 'Generate the JSON entry for: "' + word.trim().toLowerCase() + '"' }],
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

