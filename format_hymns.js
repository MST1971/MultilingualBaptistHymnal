const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/HausaHymnDetail.js');
const content = fs.readFileSync(filePath, 'utf8');

const regex = /"HBH(\d+)":\s*{[\s\S]*?title:\s*"(.*?)",[\s\S]*?tune:\s*"(.*?)",[\s\S]*?theme:\s*"(.*?)"/g;

let match;
const hymns = [];

while ((match = regex.exec(content)) !== null) {
  const num = parseInt(match[1]);
  if (num >= 229 && num <= 418) {
    // Escape single quotes in title/theme
    const title = match[2].replace(/'/g, "\\'");
    const tune = match[3].replace(/'/g, "\\'");
    const theme = match[4].replace(/'/g, "\\'");
    
    // console.log(`    { id: 'HBH${num}', number: ${num}, title: '${title}', tune: '${tune}', theme: '${theme}' },`);
    hymns.push(`    { id: 'HBH${num}', number: ${num}, title: '${title}', tune: '${tune}', theme: '${theme}' },`);
  }
}

fs.writeFileSync('new_hymns.txt', hymns.join('\n'));
