const fs = require('fs');
const path = 'c:/apps/my-baptist-hymnal/src/data/hymns.js';
let content = fs.readFileSync(path, 'utf8');

// Find the start of the object
const startMarker = 'export const hymns = {';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find start of hymns object');
  process.exit(1);
}

const objectStart = startIndex + startMarker.length;
// Find the end of the object (last closing brace before end of file?)
// Better: parse blocks until we hit the end brace of the main object.

let i = objectStart;
const blocks = [];
let buffer = '';

// Helper to find next key
function findNextKey(idx) {
  const regex = /"(\d+)":\s*\{/g;
  regex.lastIndex = idx;
  const match = regex.exec(content);
  return match;
}

let match = findNextKey(i);
while (match) {
  const key = parseInt(match[1]);
  const start = match.index;
  
  // Find end of this block
  let nesting = 0;
  let inString = false;
  let end = -1;
  
  for (let j = start; j < content.length; j++) {
    const char = content[j];
    
    if (char === '"' && content[j-1] !== '\\') {
      inString = !inString;
    }
    
    if (!inString) {
      if (char === '{') nesting++;
      if (char === '}') {
        nesting--;
        if (nesting === 0) {
          end = j + 1;
          // Check for trailing comma
          if (content[end] === ',') end++;
          break;
        }
      }
    }
  }
  
  if (end !== -1) {
    let blockContent = content.substring(start, end);
    // Ensure comma at end for all blocks (we'll fix last one later)
    if (!blockContent.trim().endsWith(',')) blockContent += ',';
    
    blocks.push({
      key: key,
      content: blockContent
    });
    
    i = end;
    match = findNextKey(i);
  } else {
    console.error(`Could not find end of block for key ${key}`);
    break;
  }
}

// Sort blocks
blocks.sort((a, b) => a.key - b.key);

// Deduplicate (keep last occurrence)
const uniqueBlocks = [];
const seen = new Set();
// Iterate backwards to keep last
for (let i = blocks.length - 1; i >= 0; i--) {
  if (!seen.has(blocks[i].key)) {
    seen.add(blocks[i].key);
    uniqueBlocks.unshift(blocks[i]);
  } else {
    console.log(`Removing duplicate hymn ${blocks[i].key}`);
  }
}

// Reconstruct file
let newContent = content.substring(0, objectStart) + '\n';
uniqueBlocks.forEach(block => {
  newContent += block.content + '\n';
});
newContent += '};\n'; // End of object

// Write back
fs.writeFileSync(path, newContent);
console.log(`Sorted and deduplicated ${uniqueBlocks.length} hymns.`);
console.log(`Range: ${uniqueBlocks[0].key} to ${uniqueBlocks[uniqueBlocks.length-1].key}`);

// Check for gaps
for (let k = 0; k < uniqueBlocks.length - 1; k++) {
  if (uniqueBlocks[k+1].key !== uniqueBlocks[k].key + 1) {
    console.log(`Gap: ${uniqueBlocks[k].key} -> ${uniqueBlocks[k+1].key}`);
  }
}
