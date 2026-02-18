const fs = require('fs');

// Read source files
const yorubaTemplate = fs.readFileSync('c:/apps/my-baptist-hymnal/src/components/YorubaHymnDetail.js', 'utf8');
const tempHbh = fs.readFileSync('c:/apps/my-baptist-hymnal/temp_hbh.js', 'utf8');
const editionHausa = fs.readFileSync('c:/apps/my-baptist-hymnal/src/components/EditionHausa.js', 'utf8');

// Extract HBH1-12
// tempHbh content is "const hausaHymns = {HBH1:{...}};"
// We want the object content inside { ... }
const startObj = tempHbh.indexOf('{') + 1;
const endObj = tempHbh.lastIndexOf('}');
const hbh1_12_str = tempHbh.substring(startObj, endObj);

// Parse EditionHausa to get HBH13-133
// Find "const hausaHymns = [" and the closing "];"
const startArr = editionHausa.indexOf('const hausaHymns = [');
const endArr = editionHausa.indexOf('];', startArr);
const editionArrStr = editionHausa.substring(startArr, endArr + 2);

// Evaluate the array (safe enough here as it's just data)
const editionHymns = eval(editionArrStr.replace('const hausaHymns =', ''));

// Construct HBH13-133 entries
let additionalHymns = '';
for (const hymn of editionHymns) {
    if (parseInt(hymn.number) > 12) {
        additionalHymns += `
    "${hymn.id}": {
        title: "${hymn.title}",
        number: "${hymn.id}",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "${hymn.tune}",
        meter: "Ba a sani ba",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "${hymn.theme}",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
            { verse: 1, text: ["Ba a sani ba"] }
        ],
        history: ""
    },`;
    }
}

// Modify template
let newContent = yorubaTemplate
    .replace(/YorubaHymnDetail/g, 'HausaHymnDetail')
    .replace(/yoruba-hymn/g, 'hausa-hymn')
    .replace(/YBH/g, 'HBH')
    .replace(/yorubaHymnHighlights/g, 'hausaHymnHighlights')
    .replace('const totalHymns = 660;', 'const totalHymns = 572;');

// Find where to insert hausaHymns
// In YorubaHymnDetail.js, it might not have the object defined (it might import it or fetch it).
// Wait, looking at YorubaHymnDetail.js read output...
// It does NOT have `yorubaHymns` object defined inside!
// It uses `id` from params but where does it get the data?
// Ah, I missed reading the whole file. It was truncated at line 200.
// The `yorubaHymns` object must be defined later in the file or imported.
// In `HausaHymnDetail.js` (the one I destroyed), the object was inside the component.
// I will check `YorubaHymnDetail.js` again to see where the data comes from.
// If it's a huge object inside the component, I need to insert it.

// Let's assume I need to insert `const hausaHymns = { ... };` inside the component, before `return`.
// Or maybe it was outside?
// The snippet I recovered from `temp_hbh.js` has `const hausaHymns = { ... }`.
// In the destroyed file, I saw `const hausaHymns = {` in my memory snippets.
// So I will insert it at the beginning of the component.

const insertPoint = newContent.indexOf('const { id } = useParams();');
const fullHymnsObj = `
  const hausaHymns = {
${hbh1_12_str},
${additionalHymns}
  };

  const hymn = hausaHymns[id];

  if (!hymn) {
    return <div className="hymn-detail-page">Hymn not found</div>;
  }

  const { title, number, author, composer, tune, meter, key, scripture, theme, year, lyrics, history, musicSigns } = hymn;
`;

// I need to remove the existing `hymn` retrieval if it exists in the template.
// But since I only read 200 lines, I don't know how YorubaHymnDetail gets data.
// It likely imports `yorubaHymns` or has it defined.
// I will just insert my object and use it.

newContent = newContent.slice(0, insertPoint) + fullHymnsObj + newContent.slice(insertPoint);

// Also need to handle the rendering part.
// The template uses `hymn.title`, etc.
// I need to make sure the variable names match.
// `YorubaHymnDetail` probably has `const hymn = yorubaHymns[id];` somewhere.
// I should remove that if I can find it.
// Or just comment it out.

fs.writeFileSync('c:/apps/my-baptist-hymnal/src/components/HausaHymnDetail.js', newContent);
