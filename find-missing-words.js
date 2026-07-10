// find-missing-words.js
//
// Scans data/words-content.json, collects every word referenced in
// perfect / near / slant / related across ALL entries, and reports
// which of those referenced words do NOT have their own page yet.
//
// Matching is case-insensitive — a rhyme list entry like "Americana"
// correctly counts as existing if the page key is "americana", since
// capitalization differences shouldn't cause false "missing" reports.
//
// Results are sorted by frequency — words referenced most often across
// your site are the best candidates for your next batch, since they're
// already proven to have real rhyme relationships to existing content.
//
// Usage:
//   node find-missing-words.js
//   node find-missing-words.js --limit 100   (only show top 100)
//   node find-missing-words.js --csv         (also write missing-words.csv)

const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'data', 'words-content.json')
const raw = fs.readFileSync(filePath, 'utf-8')
const wordsContent = JSON.parse(raw)

// Set of existing page keys, lowercased, for case-insensitive lookups
const existingWordsLower = new Set(Object.keys(wordsContent).map(w => w.toLowerCase()))

const frequency = new Map()

for (const word of Object.keys(wordsContent)) {
  const content = wordsContent[word]
  const candidates = [
    ...(content.perfect || []),
    ...(content.near || []),
    ...(content.slant || []),
    ...(content.related || []),
  ]

  for (const w of candidates) {
    if (!existingWordsLower.has(w.toLowerCase())) {
      // Track under the lowercase form so "Americana" and "americana"
      // (if both appear somewhere as missing) get counted as the same word
      const key = w.toLowerCase()
      frequency.set(key, (frequency.get(key) || 0) + 1)
    }
  }
}

// Sort missing words by how often they're referenced, descending
const sorted = [...frequency.entries()].sort((a, b) => b[1] - a[1])

// Parse CLI args
const args = process.argv.slice(2)
const limitFlagIndex = args.indexOf('--limit')
const limit = limitFlagIndex !== -1 ? parseInt(args[limitFlagIndex + 1], 10) : sorted.length
const writeCsv = args.includes('--csv')

console.log(`\nTotal existing word pages: ${existingWordsLower.size}`)
console.log(`Total distinct missing words referenced: ${sorted.length}\n`)
console.log(`Top ${Math.min(limit, sorted.length)} missing words (word — times referenced):\n`)

sorted.slice(0, limit).forEach(([word, count], i) => {
  console.log(`${(i + 1).toString().padStart(4)}. ${word.padEnd(20)} ${count}`)
})

if (writeCsv) {
  const csvPath = path.join(process.cwd(), 'missing-words.csv')
  const csvContent = 'word,times_referenced\n' + sorted.map(([w, c]) => `${w},${c}`).join('\n')
  fs.writeFileSync(csvPath, csvContent, 'utf-8')
  console.log(`\nFull list written to ${csvPath}`)
}