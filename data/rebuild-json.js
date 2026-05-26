const fs = require('fs');
const content = fs.readFileSync('words-content.json', 'utf8');

const regex = /"([a-zA-Z][a-zA-Z-]*)"\s*:\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
const result = {};
let match;

while ((match = regex.exec(content)) !== null) {
  const key = match[1].toLowerCase();
  if (!result[key]) {
    try {
      const parsed = JSON.parse('{' + match[0] + '}');
      result[key] = parsed[match[1]];
    } catch(e) {}
  }
}

fs.writeFileSync('words-content-clean.json', JSON.stringify(result, null, 2));
console.log('Done. Keys found:', Object.keys(result).length);