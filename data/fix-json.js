const fs = require('fs');
const content = fs.readFileSync('words-content.json', 'utf8');
const lines = content.split('\n');
const seen = new Set();
const result = [];
for (const line of lines) {
  const match = line.match(/^\s*"([^"]+)":\s*\{/);
  if (match) {
    const key = match[1].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
  }
  result.push(line);
}
fs.writeFileSync('words-content.json', result.join('\n'));
console.log('Done');