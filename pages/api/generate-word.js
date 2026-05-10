// pages/api/generate-word.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { word } = req.body
  if (!word) return res.status(400).json({ error: 'No word provided' })

  const systemPrompt = `You are a rhyme content expert generating structured JSON for an SEO rhyming dictionary site called RhymeItNow.

For each word, generate a JSON object with this exact structure (no markdown, no explanation, just valid JSON starting with a comma and the key):

,
  "WORD": {
    "intro": "2-3 sentence intro about the word's use in songwriting/poetry. Mention the rhyme family, genres it appears in, and emotional weight.",
    "perfect": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
    "near": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
    "slant": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
    "famous_uses": [
      { "context": "Song title — Artist", "note": "How this artist used the word and what rhyme technique they employed." },
      { "context": "Song title — Artist", "note": "..." },
      { "context": "Song title — Artist", "note": "..." }
    ],
    "faq": [
      { "q": "What rhymes perfectly with WORD?", "a": "List 10-15 perfect rhymes with brief explanation of their use." },
      { "q": "What are near rhymes for WORD?", "a": "List 8-10 near rhymes with explanation." },
      { "q": "What are slant rhymes for WORD?", "a": "List 6-8 slant rhymes with explanation." },
      { "q": "How do you use WORD in a rap song?", "a": "Practical advice for rappers using this word." },
      { "q": "What is the best rhyme scheme for WORD in poetry?", "a": "Advice on rhyme schemes that work well with this word." }
    ],
    "pro_tip": "One paragraph of advanced, specific advice for songwriters or poets using this word. Include an example lyric snippet.",
    "related": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
    "seo_benefit": "4-6 word benefit phrase describing this word's best use — e.g. 'for Ballads & Heartbreak Songs' or 'for Rap & Intense Verse' or 'for Country & Folk Lyrics'"
  }

IMPORTANT: Output ONLY valid JSON in this exact format. No extra text. Start with a comma. Replace WORD with the actual word throughout. For perfect/near/slant arrays, provide real rhyming words only — no placeholders.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Generate the JSON entry for the word: ${word}` }],
      }),
    })

    const data = await response.json()
    const content = data.content?.[0]?.text || ''
    res.status(200).json({ content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}