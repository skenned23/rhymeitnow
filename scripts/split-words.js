// Runs before `next build` (npm "prebuild"). Splits data/words-content.json (the master file that
// /generator and /api/commit-words write to) into small files the server can read cheaply:
//   data/generated/word-index.json      -> ["word", ...]  (for getStaticPaths and the sitemap)
//   data/generated/words/<word>.json    -> { content, existingWords }  (one page's props)
// Why: /rhymes-for/[word] used to read and parse the whole 18 MB master file on every request,
// which burned through Vercel's Fluid Active CPU allowance when bots crawled the site.
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'data', 'words-content.json')
const outDir = path.join(root, 'data', 'generated')
const wordsDir = path.join(outDir, 'words')

const wordsContent = JSON.parse(fs.readFileSync(src, 'utf-8'))
const words = Object.keys(wordsContent)

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(wordsDir, { recursive: true })

for (const word of words) {
  const content = wordsContent[word]
  // Same rule as before: only rhyme/related words that have their own page become links.
  const candidateWords = [
    ...(content.perfect || []),
    ...(content.near || []),
    ...(content.slant || []),
    ...(content.related || []),
  ]
  const existingWords = candidateWords.filter(w => wordsContent[w])
  fs.writeFileSync(path.join(wordsDir, `${word}.json`), JSON.stringify({ content, existingWords }))
}

fs.writeFileSync(path.join(outDir, 'word-index.json'), JSON.stringify(words))
console.log(`split-words: wrote ${words.length} word files to data/generated/`)
