#!/usr/bin/env node
/* Reasons for every choice (2026-11-14): node tools/check-whys.js
   Exam Practice (Final Boss items in #fbxItems): c[0] is the right answer; "y" holds one reason for each of c[1], c[2], c[3].
   Every item needs a right-answer explanation (w) and three wrong-choice reasons that are not empty or copies of each other.
   The practice modes build their reasons at run time (question notes, the shared bank, then the misconception message);
   that coverage is checked in the browser, see QUALITY_ASSURANCE_REPORT.md. */
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/id="fbxItems">([\s\S]*?)<\/script>/);
if (!m) { console.log('FAIL: no #fbxItems block'); process.exit(1); }
const items = JSON.parse(m[1]).items;
let fails = 0; const bad = t => { fails++; if (fails < 25) console.log('FAIL', t); };
const T = h => String(h || '').replace(/<[^>]+>/g, '').trim();
for (const it of items) {
  if (T(it.w).length < 20) bad(it.id + ': no right-answer explanation');
  if (!Array.isArray(it.y) || it.y.length !== it.c.length - 1) { bad(it.id + ': needs ' + (it.c.length - 1) + ' wrong-choice reasons'); continue; }
  it.y.forEach((r, i) => { if (T(r).length < 20) bad(`${it.id}: reason for "${T(it.c[i + 1])}" is too short`); });
  if (new Set(it.y).size !== it.y.length) bad(it.id + ': two reasons are the same');
}
for (const need of ['S.picks', 'Why the other choices are wrong', 'function whyAllP(', 'function reasonFor(']) if (!html.includes(need)) bad('engine is missing ' + need);
console.log(`${items.length} Exam Practice items, ${items.reduce((a, it) => a + (it.y || []).length, 0)} wrong-choice reasons`);
console.log(fails ? fails + ' problem(s)' : 'all checks pass'); process.exit(fails ? 1 : 0);
