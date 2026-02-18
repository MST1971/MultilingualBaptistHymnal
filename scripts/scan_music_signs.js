const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve('src', 'components', 'YorubaHymnDetail.js');

function scan(filterNum) {
  const lines = fs.readFileSync(FILE_PATH, 'utf8').split(/\r?\n/);
  const res = {
    needsRedistribution: [], // global non-empty, all verse musicSigns empty
    globalWithVerseSigns: [], // global non-empty, some verse musicSigns non-empty
    emptyGlobal: [] // global exists but empty
  };

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*"YBH(\d+)":\s*\{$/);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    if (filterNum && num !== filterNum) continue;
    let j = i + 1;
    let depth = 1;
    let seenVerses = false;
    let globalStart = -1;
    let globalCount = 0;
    let verseNonEmpty = 0;
    let verseSeen = 0;

    while (j < lines.length && depth > 0) {
      const l = lines[j];
      // brace tracking to stay within hymn block
      if (l.includes('{')) depth++;
      if (l.includes('}')) depth--;

      if (!seenVerses && /^\s*verses:\s*\[$/.test(l)) {
        seenVerses = true;
      }

      if (!seenVerses && globalStart < 0 && /^\s*musicSigns:\s*\[$/.test(l)) {
        globalStart = j;
        // read global block
        let k = j + 1;
        while (k < lines.length) {
          const l2 = lines[k];
          if (/^\s*\],\s*$/.test(l2) || /^\s*\]\s*$/.test(l2)) {
            break;
          }
          const tokens = l2.match(/"([^"]*)"/g) || [];
          for (const tkn of tokens) {
            const val = tkn.replace(/"/g, '');
            if (val !== '') globalCount++;
          }
          k++;
        }
        j = k;
        continue;
      }

      if (seenVerses) {
        if (/^\s*musicSigns:\s*\[/.test(l)) {
          verseSeen++;
          if (!/^\s*musicSigns:\s*\[\s*\],?\s*$/.test(l)) {
            verseNonEmpty++;
          }
        }
      }
      j++;
    }

    if (globalStart >= 0) {
      if (globalCount === 0) {
        res.emptyGlobal.push(num);
      } else if (verseNonEmpty === 0 && verseSeen > 0) {
        res.needsRedistribution.push(num);
      } else {
        res.globalWithVerseSigns.push(num);
      }
      if (filterNum) {
        console.log(JSON.stringify({num, globalCount, verseNonEmpty, verseSeen}, null, 2));
      }
    }
  }

  console.log(JSON.stringify(res, null, 2));
}

const arg = process.argv[2] ? parseInt(process.argv[2], 10) : undefined;
scan(arg);
