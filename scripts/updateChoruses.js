const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/choruses.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Find the end of the array
const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex === -1) {
  console.error('Could not find end of array');
  process.exit(1);
}

// Generate new entries
let newEntries = '';
for (let i = 53; i <= 182; i++) {
  newEntries += `  {
    id: ${i},
    title: "Chorus ${i}",
    content: "Content coming soon..."
  },\n`;
}

// Remove the last closing bracket and append new entries
const newContent = content.substring(0, lastBracketIndex) + ',\n' + newEntries + '];\n';

// Fix potential double commas if the last item already had a comma
// Actually, looking at the file, the last item (id 52) does NOT have a comma after the closing brace.
// So adding ',\n' is correct.

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully added choruses 53-182');
