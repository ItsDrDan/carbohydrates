// Screen-reader label data check: node tools/check-a11y.js
// The labels use their own copy of the Haworth sugar table (A11Y_HW). This confirms it still matches the
// drawing engine's HW_SUG inside the FBX module, so a label can never describe a different ring than the one drawn.
const fs = require('fs'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const grab = name => { const i = s.indexOf('const ' + name + '='), j = s.indexOf('const ' + name + ' ='); const k = i >= 0 ? i : j; if (k < 0) throw new Error(name + ' not found'); const e = s.indexOf(';', s.indexOf('}', s.lastIndexOf(']]]', s.indexOf('}', k)) )); return s.slice(k, s.indexOf('};', k) + 2); };
const plain = x => JSON.stringify(x, (k, v) => typeof v === 'string' ? v.replace(/<[^>]+>/g, '') : v);
const HW = Function(grab('HW_SUG').replace('const HW_SUG=', 'return ').replace(/;$/, ''))();
const A = Function(grab('A11Y_HW').replace(/const A11Y_HW ?= ?/, 'return ').replace(/;$/, ''))();
let n = 0, fail = 0;
for (const k of new Set([...Object.keys(HW), ...Object.keys(A)])) { n++; if (plain(HW[k]) !== plain(A[k])) { fail++; console.log('MISMATCH', k, plain(HW[k]), plain(A[k])); } }
const labels = (s.match(/aria-label="(Fischer projection|Haworth projection)"/g) || []).length;
console.log(`${n} sugars compared: ${fail ? fail + ' MISMATCHED' : 'label data matches the drawing engine'}; fixed generic labels left in the engine source: ${labels} (replaced at runtime)`);
process.exit(fail ? 1 : 0);
