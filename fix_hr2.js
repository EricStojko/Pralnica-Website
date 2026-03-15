// fix_hr2.js — final pass: currency symbols, data-icon emojis, remaining diacritics
const fs = require('fs');

const files = [
  'hr/index.html',
  'hr/about.html',
  'hr/contact.html',
  'hr/how-it-works.html',
  'hr/services.html',
];

// ── 1. Currency symbol ────────────────────────────────────────────────────
// Prices appear as "~5.00 –" or "1.00 –" where – is a corrupted/wrong char
// Replace pattern: a price number followed by space + dash (–) → number + space + €
// Also covers bare " –" after a digit
function fixCurrency(html) {
  // Pattern: digit(s) optionally with decimals, then space and en-dash or hyphen at end
  // e.g. "~5.00 –"  =>  "~5.00 €"
  //      "1.00 –"   =>  "1.00 €"
  html = html.replace(/(\d+(?:\.\d+)?)\s*[–-](?=\s*<)/g, '$1 €');
  // Also handle cases where the dash is followed by a space before a tag
  html = html.replace(/(\d+(?:\.\d+)?)\s*–\s*(?=<)/g, '$1 €');
  // Handle "– €" double (in case some already have partial fix)
  html = html.replace(/–\s*€/g, '€');
  return html;
}

// ── 2. data-icon="??" — contextual emoji injection ───────────────────────
// Strategy: split HTML around each service card, detect washing vs. drying
// by looking for title keywords, then assign correct emoji.
// Washing machine keywords (Croatian): Perilica, 9 kg, 18 kg, rublje, košare
// Dryer keywords: Susilica, Sušilica, sušenje, sušilice
function fixDataIcons(html) {
  // Replace data-icon="??" based on the surrounding card context.
  // Each card is wrapped in an onclick div with data attributes.
  // We process card by card using a replace with a function.

  return html.replace(
    /(data-icon=")\?\?("[\s\S]{0,600}?data-tip="([^"]*)")/g,
    (match, open, rest, tip) => {
      const lowerRest = rest.toLowerCase();
      // Dryer detection keywords
      const isDryer =
        lowerRest.includes('susilica') ||
        lowerRest.includes('sušilica') ||
        lowerRest.includes('sušenje') ||
        lowerRest.includes('susilice') ||
        lowerRest.includes('sušilice') ||
        lowerRest.includes('sušiti') ||
        lowerRest.includes('mini sušilica');
      const emoji = isDryer ? '☀️' : '🧺';
      return `${open}${emoji}${rest}`;
    }
  );
}

// ── 3. Remaining diacritics ───────────────────────────────────────────────
// Ordered longest-first to avoid partial substitutions
const diacritics = [
  ['iznajmljivace', 'iznajmljivače'],
  ['sprjecava',     'sprječava'],
  ['ucinkovito',    'učinkovito'],
  ['peracicu',      'perilicu'],   // user specified: peracicu → perilicu
  ['kolicinu',      'količinu'],
  ['odjece',        'odjeće'],     // before odjecu
  ['odjecu',        'odjeću'],
  ['cekate',        'čekate'],
  ['kuce',          'kuće'],
];

function fixDiacritics(html) {
  for (const [from, to] of diacritics) {
    html = html.split(from).join(to);
  }
  return html;
}

// ── Process all files ─────────────────────────────────────────────────────
for (const relPath of files) {
  if (!fs.existsSync(relPath)) { console.warn('NOT FOUND:', relPath); continue; }

  let html = fs.readFileSync(relPath, 'utf8');

  html = fixCurrency(html);
  html = fixDataIcons(html);
  html = fixDiacritics(html);

  fs.writeFileSync(relPath, html, 'utf8');
  console.log('FIXED:', relPath);
}

console.log('\nAll done.');
