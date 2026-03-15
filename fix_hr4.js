// fix_hr4.js — fixes all remaining broken ?? emojis in about, contact, how-it-works
const fs = require('fs');

function fixByLine(filePath, lineFixMap) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const [lineNum, from, to] of lineFixMap) {
    const idx = lineNum - 1;
    if (lines[idx] !== undefined) {
      lines[idx] = lines[idx].split(from).join(to);
    }
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('FIXED:', filePath);
}

// ── hr/about.html ──────────────────────────────────────────────────────────
// Line 76: first hybrid-icon = 🤝 (handshake — "we help" / hybrid service)
// Line 107: second hybrid-icon = 📍 (location — the premises/place)
// (confirmed from SL about.html: 🤝 then 📍)
fixByLine('hr/about.html', [
  [76,  '<div class="hybrid-icon">??</div>', '<div class="hybrid-icon">🤝</div>'],
  [107, '<div class="hybrid-icon">??</div>', '<div class="hybrid-icon">📍</div>'],
]);

// ── hr/contact.html ────────────────────────────────────────────────────────
// Lines 60, 70, 80: contact info icons = 📍, 📞, 🕒
// Line 91: parking heading emoji — SL uses 🅿️ confirmed
fixByLine('hr/contact.html', [
  [60,  '<div style="font-size: 1.5rem;">??</div>', '<div style="font-size: 1.5rem;">📍</div>'],
  [70,  '<div style="font-size: 1.5rem;">??</div>', '<div style="font-size: 1.5rem;">📞</div>'],
  [80,  '<div style="font-size: 1.5rem;">??</div>', '<div style="font-size: 1.5rem;">🕒</div>'],
  // Line 91 has "??? ?? ?" — check what it looks like in full
  [91,  '???', '🅿️'],
]);

// ── hr/how-it-works.html ───────────────────────────────────────────────────
// Line 59: <span>??</span> AUTOMAT ZA MIIJENJANJE NOVCA — token/coin machine icon 🪙
fixByLine('hr/how-it-works.html', [
  [59, '<span>??</span>', '<span>🪙</span>'],
]);

// ── Verify all HR files are now clean ─────────────────────────────────────
const allFiles = [
  'hr/index.html', 'hr/about.html', 'hr/contact.html',
  'hr/how-it-works.html', 'hr/services.html'
];
console.log('\n── Remaining ?? check ──');
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const count = (content.match(/\?\?/g) || []).length;
  console.log((count === 0 ? '✓ CLEAN' : `✗ ${count} remaining`), f);
}
