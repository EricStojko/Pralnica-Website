// fix_hr3.js — fixes remaining ?? in hr/services.html
const fs = require('fs');

const filePath = 'hr/services.html';
let html = fs.readFileSync(filePath, 'utf8');
const lines = html.split('\n');

// Print context around each ?? line for diagnosis
lines.forEach((l, i) => {
  if (l.includes('??')) {
    console.log(`Line ${i+1}: ...`);
    // print 3 lines before and after for context
    for (let j = Math.max(0, i-2); j <= Math.min(lines.length-1, i+3); j++) {
      console.log(`  ${j+1}: ${lines[j].trim().substring(0,120)}`);
    }
    console.log('');
  }
});

// Now apply fixes using line-level replacement
const fixed = lines.map((line, i) => {
  const lineNum = i + 1; // 1-indexed

  // Line 59: data-icon="??" before data-tip about washing (košare, rublja, perilica...)
  // Line 83: data-icon="??" before data-hint about deke/poplune (dryer)
  // We'll check the next few lines for context
  if (line.includes('data-icon="??"')) {
    // Look ahead 5 lines for context
    const context = lines.slice(i, Math.min(i + 10, lines.length)).join(' ').toLowerCase();
    const isDryer =
      context.includes('susilica') ||
      context.includes('sušilica') ||
      context.includes('sušenje') ||
      context.includes('sušiti') ||
      context.includes('deke') ||
      context.includes('poplune') ||
      context.includes('mokro rublje') ||
      context.includes('mini sušilica');
    const emoji = isDryer ? '☀️' : '🧺';
    return line.replace('data-icon="??"', `data-icon="${emoji}"`);
  }

  // Line 127: <li>?? <strong>Samo sušenje — decorative icon before a list item
  // This is a dryer feature item (Samo sušenje = drying only)
  if (line.includes('<li>??')) {
    // ☀️ for drying, 🧺 for washing
    const lowerLine = line.toLowerCase();
    const isDryer = lowerLine.includes('sušenje') || lowerLine.includes('susenje') || lowerLine.includes('samo su');
    const emoji = isDryer ? '☀️' : '🧺';
    return line.replace('<li>??', `<li>${emoji}`);
  }

  return line;
});

const newHtml = fixed.join('\n');
fs.writeFileSync(filePath, newHtml, 'utf8');
console.log('\nFixed remaining ?? in', filePath);

// Also check other hr files for any remaining ??
const allFiles = ['hr/index.html','hr/about.html','hr/contact.html','hr/how-it-works.html'];
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const remaining = (content.match(/\?\?/g) || []).length;
  console.log(f, '->', remaining > 0 ? `${remaining} remaining ??` : 'clean');
}
