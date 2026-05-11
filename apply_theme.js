const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /#4a9eff/g, replacement: '#D4AF37' },
  { regex: /74,\s*158,\s*255/g, replacement: '212, 175, 55' },
  { regex: /#1a1a2e/g, replacement: '#111111' },
  { regex: /#16213e/g, replacement: '#0a0a0a' },
  { regex: /#0c0c0c/g, replacement: '#050505' },
  { regex: /#357abd/g, replacement: '#B8860B' },
  { regex: /#0f3460/g, replacement: '#1a1a1a' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
processDirectory('./public');
// Also process index.html in root
let indexContent = fs.readFileSync('./index.html', 'utf8');
let originalIndex = indexContent;
for (const { regex, replacement } of replacements) {
  indexContent = indexContent.replace(regex, replacement);
}
if (indexContent !== originalIndex) {
  fs.writeFileSync('./index.html', indexContent, 'utf8');
  console.log('Updated: ./index.html');
}

console.log('Theme applied successfully!');
