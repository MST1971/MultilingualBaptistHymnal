const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve('src', 'components', 'YorubaHymnDetail.js');

function findAllHymnBlocks(lines, num) {
  const startRe = new RegExp('^\\s*"YBH' + num + '":\\s*\\{$');
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!startRe.test(lines[i])) continue;
    const start = i;
    let depth = 0;
    let end = -1;
    for (let j = start; j < lines.length; j++) {
      const l = lines[j];
      const opens = (l.match(/\{/g) || []).length;
      const closes = (l.match(/\}/g) || []).length;
      depth += opens;
      depth -= closes;
      if (depth === 0) { end = j; break; }
    }
    if (end >= 0) {
      blocks.push({ start, end });
      i = end;
    }
  }
  return blocks;
}

function processRange() {
  const lines = fs.readFileSync(FILE_PATH, 'utf8').split(/\r?\n/);
  let edits = 0;

  const range = [];
  for (let n = 405; n <= 606; n++) range.push(n);

  for (const num of range) {
    const blocks = findAllHymnBlocks(lines, num);
    for (const { start, end } of blocks) {
      let versesStart = -1, versesEnd = -1;
      for (let i = start + 1; i <= end; i++) {
        const l = lines[i];
        if (versesStart === -1 && /^\s*verses:\s*\[$/.test(l)) versesStart = i;
        if (versesStart !== -1 && (/^\s*\],\s*$/.test(l) || /^\s*\]$/.test(l))) {
          // the first closing ] after versesStart with trailing comma likely ends verses
          // ensure we mark versesEnd when we reach the bracket that closes the verses array
          // track bracket depth inside verses
          // quick approach: find the matching ] for the verses array start
        }
      }
      if (versesStart === -1) continue;
      // Compute versesEnd as the matching bracket for versesStart
      let bDepth = 0;
      for (let i = versesStart; i <= end; i++) {
        const l = lines[i];
        bDepth += (l.match(/\[/g) || []).length;
        bDepth -= (l.match(/\]/g) || []).length;
        if (bDepth === 0) { versesEnd = i; break; }
      }
      if (versesEnd === -1) continue;

      // Iterate verse blocks inside verses
      for (let i = versesStart + 1; i < versesEnd; i++) {
        // Locate 'number:' line to anchor a verse
        if (!/^\s*number:\s*(\d+|"(.*?)")\s*,\s*$/.test(lines[i])) continue;
        const verseNumLineIdx = i;
        // Find musicSigns line between number and lines:
        let msStart = -1, msEnd = -1, msIndent = '          ';
        for (let j = verseNumLineIdx + 1; j <= versesEnd; j++) {
          const l = lines[j];
          if (/^\s*lines:\s*\[$/.test(l)) break;
          if (/^\s*musicSigns:\s*\[\s*\]\s*,?\s*$/.test(l)) {
            msStart = j; msEnd = j;
            msIndent = (l.match(/^(\s*)musicSigns:/) || [,'          '])[1];
            break;
          }
          if (/^\s*musicSigns:\s*\[$/.test(l)) {
            msStart = j;
            msIndent = (l.match(/^(\s*)musicSigns:/) || [,'          '])[1];
            let k = j + 1;
            let d = 1;
            while (k <= versesEnd) {
              const lk = lines[k];
              d += (lk.match(/\[/g) || []).length;
              d -= (lk.match(/\]/g) || []).length;
              if (d === 0) { msEnd = k; break; }
              k++;
            }
            break;
          }
        }
        // Find lines block and count strings
        let linesStart = -1, linesEnd = -1;
        for (let j = verseNumLineIdx + 1; j <= versesEnd; j++) {
          const l = lines[j];
          if (/^\s*lines:\s*\[$/.test(l)) {
            linesStart = j;
            let k = j + 1;
            let d = 1;
            while (k <= versesEnd) {
              const lk = lines[k];
              d += (lk.match(/\[/g) || []).length;
              d -= (lk.match(/\]/g) || []).length;
              if (d === 0) { linesEnd = k; break; }
              k++;
            }
            break;
          }
        }
        if (linesStart === -1 || linesEnd === -1) continue;
        const lineCount = lines.slice(linesStart + 1, linesEnd)
          .filter(s => /^\s*".*"\s*,?\s*$/.test(s)).length;
        if (lineCount <= 0) continue;

        const built = Array.from({ length: lineCount }, () => '"x"').join(', ');
        const newLine = `${msIndent}musicSigns: [ ${built} ],`;

        if (msStart !== -1 && msEnd !== -1) {
          // Check if array currently empty
          const contentSlice = lines.slice(msStart, msEnd + 1).join('\n');
          const hasQuoted = /"[^"]*"/.test(contentSlice);
          if (!hasQuoted) {
            // Replace entire block with single-line array
            lines.splice(msStart, msEnd - msStart + 1, newLine);
            edits++;
          }
        } else {
          // Insert a new musicSigns line after number line and before lines:
          lines.splice(verseNumLineIdx + 1, 0, newLine);
          edits++;
        }
      }
    }
  }

  fs.writeFileSync(FILE_PATH, lines.join('\n'), 'utf8');
  console.log(`Filled 'x' for empty musicSigns in YBH405–606. Edits: ${edits}`);
}

processRange();
