const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve('src', 'components', 'YorubaHymnDetail.js');
const START = parseInt(process.argv[2] || '541', 10);
const END = parseInt(process.argv[3] || '660', 10);

function isEgbeLabel(s) {
  const t = String(s || '').toLowerCase();
  return t === 'egbe' || t === 'egbé' || t === 'ègbè';
}

function parseLyricsLines(lines) {
  const isRefrainLabel = (s) => {
    const t = String(s).trim();
    return t.startsWith("Egbe:") || t === "Egbe:" || t.startsWith("Egbé:") || t === "Egbé:" || t.startsWith("Ègbè:") || t === "Ègbè:";
  };
  const contentLines = [];
  for (const l of lines) {
    const m = String(l).trim().match(/^"([^"]*)"\s*,?\s*$/);
    if (!m) continue;
    contentLines.push(m[1]);
  }
  let refrainLines = [];
  let collectingRefrain = false;
  let stanzas = [];
  let currentStanza = [];
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i];
    if (isRefrainLabel(line)) {
      collectingRefrain = true;
      continue;
    }
    if (collectingRefrain) {
      if (line === "") {
        collectingRefrain = false;
        continue;
      }
      refrainLines.push(line);
      continue;
    }
    if (line === "") {
      if (currentStanza.length > 0) {
        stanzas.push(currentStanza);
        currentStanza = [];
      }
      continue;
    }
    currentStanza.push(line);
  }
  if (currentStanza.length > 0) {
    stanzas.push(currentStanza);
  }
  const verses = [];
  let n = 1;
  for (let si = 0; si < stanzas.length; si++) {
    verses.push({ number: n, musicSigns: [], lines: stanzas[si] });
    if (si === 0 && refrainLines.length > 0) {
      verses.push({ number: "Egbe", musicSigns: [], lines: refrainLines });
    }
    n++;
  }
  return verses;
}

function formatVerses(verses, indent) {
  const I = indent;
  const II = I + '  ';
  const III = II + '  ';
  const lines = [];
  lines.push(I + 'verses: [');
  for (let v = 0; v < verses.length; v++) {
    const verse = verses[v];
    lines.push(II + '{');
    const numVal = typeof verse.number === 'number' ? verse.number : `"${verse.number}"`;
    lines.push(III + `number: ${numVal},`);
    lines.push(III + 'musicSigns: [],');
    lines.push(III + 'lines: [');
    for (const line of verse.lines) {
      lines.push(III + '  ' + JSON.stringify(line) + ',');
    }
    // Remove trailing comma for last line entry
    if (verse.lines.length > 0) {
      lines[lines.length - 1] = lines[lines.length - 1].replace(/,(\s*)$/, '$1');
    }
    lines.push(III + ']');
    lines.push(II + '}' + (v < verses.length - 1 ? ',' : ''));
  }
  lines.push(I + '],');
  return lines;
}

function convertFile() {
  const raw = fs.readFileSync(FILE_PATH, 'utf8');
  const allLines = raw.split(/\r?\n/);

  let i = 0;
  while (i < allLines.length) {
    const line = allLines[i];
    const m = line.match(/^\s*"YBH(\d+)":\s*\{$/);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num >= START && num <= END) {
        // Track hymn block range using brace depth
        let j = i;
        let depth = 0;
        let startIdx = i;
        let endIdx = -1;
        while (j < allLines.length) {
          const l = allLines[j];
          // Count braces naively
          const openCount = (l.match(/\{/g) || []).length;
          const closeCount = (l.match(/\}/g) || []).length;
          depth += openCount - closeCount;
          if (depth === 0) {
            endIdx = j;
            break;
          }
          j++;
        }

        // First pass: convert legacy lyrics (if any)
        {
          let k = startIdx + 1;
          let lyricsStart = -1;
          let lyricsEnd = -1;
          while (k <= endIdx) {
            const l = allLines[k];
            if (l.match(/^\s*lyrics:\s*\[$/)) {
              lyricsStart = k;
              k++;
              while (k <= endIdx) {
                const l2 = allLines[k];
                if (l2.match(/^\s*\],\s*$/) || l2.match(/^\s*\]$/)) {
                  lyricsEnd = k;
                  break;
                }
                k++;
              }
              break;
            }
            k++;
          }
          if (lyricsStart !== -1 && lyricsEnd !== -1) {
            const indentMatch = allLines[lyricsStart].match(/^(\s*)lyrics:\s*\[$/);
            const indent = indentMatch ? indentMatch[1] : '          ';
            const lyricLines = allLines.slice(lyricsStart + 1, lyricsEnd);
            const verses = parseLyricsLines(lyricLines);
            const versesLines = formatVerses(verses, indent);
            allLines.splice(lyricsStart, (lyricsEnd - lyricsStart + 1), ...versesLines);
            // adjust endIdx for changed length
            const delta = versesLines.length - (lyricsEnd - lyricsStart + 1);
            endIdx += delta;
          }
        }

        // Second pass: redistribute hymn-level musicSigns into verse-level musicSigns
        {
          // Locate hymn-level musicSigns
          let msStart = -1;
          let msEnd = -1;
          let indent = '';
          let signs = [];
          for (let k = startIdx + 1; k <= endIdx; k++) {
            const l = allLines[k];
            if (l.match(/^\s*musicSigns:\s*\[$/)) {
              msStart = k;
              indent = (l.match(/^(\s*)musicSigns:/) || [,'          '])[1];
              k++;
              while (k <= endIdx) {
                const l2 = allLines[k];
                if (l2.match(/^\s*\],\s*$/) || l2.match(/^\s*\]$/)) {
                  msEnd = k;
                  break;
                }
                const tokens = l2.match(/"([^"]*)"/g) || [];
                for (const tkn of tokens) {
                  const val = tkn.replace(/"/g, '');
                  signs.push(val);
                }
                k++;
              }
              break;
            }
          }

          if (msStart !== -1 && msEnd !== -1 && signs.length > 0) {
            // Scope parsing strictly within verses: [ ... ]
            let versesStart = -1;
            let versesEnd = -1;
            for (let k = startIdx + 1; k <= endIdx; k++) {
              if (versesStart === -1 && allLines[k].match(/^\s*verses:\s*\[$/)) {
                versesStart = k;
                // Track bracket depth for [ ] to find the matching closing bracket
                let t = k;
                let bDepth = 0;
                while (t <= endIdx) {
                  const l = allLines[t];
                  // Count occurrences of [ and ] on the line
                  const opens = (l.match(/\[/g) || []).length;
                  const closes = (l.match(/\]/g) || []).length;
                  bDepth += opens - closes;
                  if (bDepth === 0) {
                    versesEnd = t;
                    break;
                  }
                  t++;
                }
                break;
              }
            }

            // Collect verse line counts (excluding Egbe) only within verses region
            const verseRanges = []; // {numIndex, number, lineCount}
            if (versesStart !== -1 && versesEnd !== -1) {
              for (let k = versesStart + 1; k <= versesEnd; k++) {
                const numLine = allLines[k];
                const numMatch = numLine.match(/^\s*number:\s*(\d+|"(.*?)")\s*,\s*$/);
                if (numMatch) {
                  const verseNumberRaw = numMatch[1];
                  const verseNumberStr = verseNumberRaw.startsWith('"') ? verseNumberRaw.replace(/"/g, '') : verseNumberRaw;
                  // Find lines block for this verse
                  let linesStart = -1;
                  let linesEnd = -1;
                  let t = k + 1;
                  while (t <= versesEnd) {
                    const l2 = allLines[t];
                    if (l2.match(/^\s*lines:\s*\[$/)) {
                      linesStart = t;
                      t++;
                      while (t <= versesEnd) {
                        const l3 = allLines[t];
                        if (l3.match(/^\s*\],\s*$/) || l3.match(/^\s*\]$/)) {
                          linesEnd = t;
                          break;
                        }
                        t++;
                      }
                      break;
                    }
                    t++;
                  }
                  if (linesStart !== -1 && linesEnd !== -1) {
                    const lc = allLines.slice(linesStart + 1, linesEnd).filter(s => s.match(/^\s*".*"\s*,?\s*$/)).length;
                    verseRanges.push({ numIndex: k, number: verseNumberStr, lineCount: lc });
                  }
                }
              }
            }

            // Compute distribution across non-Egbe verses
            const eligible = verseRanges.filter(v => !isEgbeLabel(v.number));
            const totalLines = eligible.reduce((acc, v) => acc + v.lineCount, 0);

            // Assign slices and replace verse-level musicSigns, padding/truncating to fit each stanza
            {
              let idx = 0;
              for (const v of eligible) {
                // Find the verse musicSigns line nearest after number, but before lines:
                let msLineIdx = -1;
                for (let t = v.numIndex + 1; t <= versesEnd; t++) {
                  const l = allLines[t];
                  if (l.match(/^\s*musicSigns:\s*\[\s*\]\s*,?\s*$/)) {
                    msLineIdx = t;
                    break;
                  }
                  if (l.match(/^\s*lines:\s*\[$/)) break;
                }
                if (msLineIdx !== -1) {
                  const verseIndent = (allLines[msLineIdx].match(/^(\s*)musicSigns:/) || [,'          '])[1];
                  let slice = signs.slice(idx, idx + v.lineCount);
                  idx += v.lineCount;
                  // Pad with 'x' if not enough signs
                  while (slice.length < v.lineCount) slice.push('x');
                  // Truncate if extra
                  if (slice.length > v.lineCount) slice = slice.slice(0, v.lineCount);
                  const arr = slice.map(s => `"${s}"`).join(', ');
                  allLines[msLineIdx] = `${verseIndent}musicSigns: [ ${arr} ],`;
                }
              }

              // Remove hymn-level musicSigns block regardless of count mismatches
              allLines.splice(msStart, (msEnd - msStart + 1));
              const delta = -(msEnd - msStart + 1);
              endIdx += delta;
            }
          }
        }
      }
    }
    i++;
  }

  fs.writeFileSync(FILE_PATH, allLines.join('\n'), 'utf8');
}

convertFile();
console.log(`Processed YBH${START}–YBH${END}: converted lyrics-to-verses where present and redistributed musicSigns to verse-level (removing global) when counts matched.`);
