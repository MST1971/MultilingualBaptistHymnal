const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/HausaHymnDetail.js');
const content = fs.readFileSync(filePath, 'utf8');

// Regex to match hymn entries
// Pattern: "HBH(\d+)":\s*{[\s\S]*?title:\s*"(.*?)",[\s\S]*?tune:\s*"(.*?)",[\s\S]*?theme:\s*"(.*?)",
const regex = /"HBH(\d+)":\s*{[\s\S]*?title:\s*"(.*?)",[\s\S]*?tune:\s*"(.*?)",[\s\S]*?theme:\s*"(.*?)"/g;

  while ((match = regex.exec(content)) !== null) {
    const num = parseInt(match[1]);
    if (num >= 500) {
      hymns.push({
        id: `HBH${num}`,
        number: num,
        title: match[2],
        tune: match[3],
        theme: match[4]
      });
    }
  }

console.log(JSON.stringify(hymns, null, 2));
