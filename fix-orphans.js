const fs = require('fs');
const raw = fs.readFileSync('data/words-content.json', 'utf8');
const lines = raw.split('\n');
const result = [];
let i = 0;
let removed = 0;

while (i < lines.length) {
  const line = lines[i].trim();
  const prevLine = result.length > 0 ? result[result.length-1].trim() : '';
  
  if (line.startsWith('"intro":') && (prevLine === ',' || prevLine === '')) {
    // Skip this orphan entry block until we hit the closing }
    let depth = 1;
    i++;
    while (i < lines.length && depth > 0) {
      const l = lines[i];
      for (const ch of l) {
        if (ch === '{') depth++;
        if (ch === '}') depth--;
      }
      i++;
    }
    // Remove trailing comma from previous line if present
    if (result.length > 0 && result[result.length-1].trim() === ',') {
      result.pop();
    }
    removed++;
  } else {
    result.push(lines[i]);
    i++;
  }
}

fs.writeFileSync('data/words-content.json', result.join('\n'));
console.log('Removed ' + removed + ' orphan entries');