const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve('src', 'components', 'YorubaHymnDetail.js');

function findAllBlocks(lines, num) {
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

function run() {
  const lines = fs.readFileSync(FILE_PATH, 'utf8').split(/\r?\n/);
  const range = [];
  for (let n = 402; n <= 589; n++) range.push(n);

  const blocksToInsert = [];
  const removals = [];
  for (const n of range) {
    const found = findAllBlocks(lines, n);
    if (!found.length) continue;
    const seg = lines.slice(found[0].start, found[0].end + 1);
    blocksToInsert.push({ num: n, seg });
    for (const b of found) removals.push({ num: n, start: b.start, end: b.end });
  }
  if (!blocksToInsert.length) return;

  removals.sort((a, b) => a.start - b.start);

  for (let i = removals.length - 1; i >= 0; i--) {
    const b = removals[i];
    lines.splice(b.start, b.end - b.start + 1);
  }

  const targetBlocks = findAllBlocks(lines, 590);
  const target = targetBlocks[0];
  if (!target) return;
  const insertIdx = target.start;

  const insertLines = [];
  for (const b of blocksToInsert.sort((a, b) => a.num - b.num)) {
    insertLines.push(...b.seg);
  }
  lines.splice(insertIdx, 0, ...insertLines);

  fs.writeFileSync(FILE_PATH, lines.join('\n'), 'utf8');
  console.log('Relocated YBH402–YBH589 before YBH590');
}

run();
