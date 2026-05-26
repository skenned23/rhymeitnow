const fs = require('fs');
const data = JSON.parse(fs.readFileSync('words-content.json', 'utf8'));
const result = {};
for (const key of Object.keys(data)) {
  result[key.toLowerCase()] = data[key];
}
fs.writeFileSync('words-content.json', JSON.stringify(result, null, 2));
console.log('Done. Keys lowercased:', Object.keys(result).length);