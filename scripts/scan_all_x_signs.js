const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve('src', 'components', 'YorubaHymnDetail.js');

function scanAllX() {
  const lines = fs.readFileSync(FILE_PATH, 'utf8').split(/\r?\n/);
  const hymnsAllX = [];

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*"YBH(\d+)":\s*\{$/);
    if (!m) continue;
    const num = parseInt(m[1], 10);

    let j = i + 1;
    let depth = 1;
    let inVerses = false;
    let sawVerseSigns = false;
    let anyNonX = false;

    while (j < lines.length && depth > 0) {
      const l = lines[j];
      if (l.includes('{')) depth++;
      if (l.includes('}')) depth--;

      if (!inVerses && /^\s*verses:\s*\[$/.test(l)) {
        inVerses = true;
      }

      if (inVerses && /^\s*musicSigns:\s*\[/.test(l)) {
        sawVerseSigns = true;
        // Read the musicSigns array until its closing bracket
        let k = j;
        let bDepth = 0;
        do {
          const lk = lines[k];
          bDepth += (lk.match(/\[/g) || []).length;
          bDepth -= (lk.match(/\]/g) || []).length;
          const tokens = lk.match(/"([^"]*)"/g) || [];
          for (const tkn of tokens) {
            const val = tkn.replace(/"/g, '');
            if (val !== 'x') {
              anyNonX = true;
            }
          }
          k++;
        } while (k < lines.length && bDepth > 0);
        j = k;
        continue;
      }

      j++;
    }

    if (inVerses && sawVerseSigns && !anyNonX) {
      hymnsAllX.push(num);
    }
  }

  // group into ranges for readability
  hymnsAllX.sort((a, b) => a - b);
  const ranges = [];
  let s = null, e = null;
  for (const n of hymnsAllX) {
    if (s === null) { s = e = n; }
    else if (n === e + 1) { e = n; }
    else { ranges.push([s, e]); s = e = n; }
  }
  if (s !== null) ranges.push([s, e]);
  const fmt = ([a, b]) => a === b ? String(a) : `${a}-${b}`;
  console.log(JSON.stringify({ count: hymnsAllX.length, hymns: hymnsAllX, ranges: ranges.map(fmt) }, null, 2));
}

scanAllX();
