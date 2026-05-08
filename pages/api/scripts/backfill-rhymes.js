// scripts/backfill-rhymes.js
const fs = require('fs')
const path = require('path')

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const WORDS_FILE = path.join(__dirname, '../../../data/words-content.json')
const DELAY_MS = 1000
const BATCH_SIZE = 50

async function getRhymes(word) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: `You are a rhyme-finding engine. Return ONLY a valid raw JSON object — no markdown, no backticks, no preamble. The JSON must have exactly these keys:
- "perfect": array of 10-12 words that perfectly rhyme
- "near": array of 10-12 words that nearly rhyme
- "slant": array of 10-12 words that slant rhyme
Return only the raw JSON object, nothing else.`,
      messages: [{ role: 'user', content: `Find rhymes for the word: "${word.trim()}"` }],
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error.message || 'API error')
  const raw = data.content[0].text
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY not set')
    process.exit(1)
  }

  const raw = fs.readFileSync(WORDS_FILE, 'utf-8')
  const wordsContent = JSON.parse(raw)
  const allWords = Object.keys(wordsContent)
  const missing = allWords.filter(w => !wordsContent[w].perfect || wordsContent[w].perfect.length === 0)
  
  console.log(`Total words: ${allWords.length}`)
  console.log(`Words missing rhyme arrays: ${missing.length}`)
  console.log(`Estimated time: ~${Math.ceil(missing.length / 60)} minutes\n`)

  let processed = 0
  let errors = 0

  for (const word of missing) {
    try {
      process.stdout.write(`Processing: ${word}...`)
      const rhymes = await getRhymes(word)
      wordsContent[word].perfect = rhymes.perfect || []
      wordsContent[word].near = rhymes.near || []
      wordsContent[word].slant = rhymes.slant || []
      console.log(` ✓ (${rhymes.perfect?.length || 0} perfect, ${rhymes.near?.length || 0} near, ${rhymes.slant?.length || 0} slant)`)
      processed++

      if (processed % BATCH_SIZE === 0) {
        fs.writeFileSync(WORDS_FILE, JSON.stringify(wordsContent, null, 2))
        console.log(`\n--- Progress saved: ${processed}/${missing.length} words done ---\n`)
      }

      await sleep(DELAY_MS)
    } catch (err) {
      console.log(` ✗ ERROR: ${err.message}`)
      errors++
      await sleep(DELAY_MS)
    }
  }

  fs.writeFileSync(WORDS_FILE, JSON.stringify(wordsContent, null, 2))
  console.log(`\n✅ Done! Processed: ${processed}, Errors: ${errors}`)
  console.log('Now commit and push words-content.json to GitHub.')
}

main()