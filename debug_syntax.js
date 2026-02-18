const fs = require('fs');
const content = fs.readFileSync('c:/apps/my-baptist-hymnal/src/components/HausaHymnDetail.js', 'utf8');
const index = content.indexOf('"HBH13"');
console.log('Index of HBH13:', index);
if (index !== -1) {
  console.log('Context before HBH13:');
  console.log(content.substring(index - 50, index + 10));
} else {
  console.log('HBH13 not found');
}
