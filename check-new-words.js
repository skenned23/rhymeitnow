const fs = require('fs');

// Load existing words
const existing = require('./data/words-content.json');
const existingSet = new Set(Object.keys(existing).map(w => w.toLowerCase().trim()));

// Load your candidate list — one word per line in candidates.txt
const candidates = fs.readFileSync('./candidates.txt', 'utf8')
  .split('\n')
  .map(w => w.toLowerCase().trim())
  .filter(w => w.length > 0);

const newWords = candidates.filter(w => !existingSet.has(w));
const dupes = candidates.filter(w => existingSet.has(w));

console.log(`\n✅ NEW words (${newWords.length}):`);
newWords.forEach(w => console.log(w));

console.log(`\n❌ ALREADY EXISTS (${dupes.length}):`);
dupes.forEach(w => console.log(w));

// Write clean list to new-words-clean.txt
fs.writeFileSync('./new-words-clean.txt', newWords.join('\n'));
console.log(`\n📄 Clean list saved to new-words-clean.txt`);