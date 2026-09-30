// Tes logika perhitungan TestHistory (tren, ringkasan, per-modul).
// Jalankan: npm run test:testhistory
//
// Logika tren disalin identik dari components/TestHistory.js supaya angka
// yang sama bisa diverifikasi tanpa browser dan tanpa tabel produksi.

function fmtDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildPoints(attempts, w = 100) {
  // attempts haruschronologis (lama -> baru), sama seperti query dashboard.
  const n = attempts.length;
  return attempts.map((a, i) => ({
    x: n === 1 ? w / 2 : (i / (n - 1)) * w,
    pct: Math.max(0, Math.min(100, a.score ?? 0)),
    attempt: a,
  }));
}

function trendSlope(points) {
  const n = points.length;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.pct);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  return denom === 0 ? 0 : xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / denom;
}

function stats(attempts) {
  const scores = attempts.map((a) => a.score ?? 0);
  const total = scores.length;
  const sorted = [...scores].sort((a, b) => b - a);
  const mid = Math.floor(total / 2);
  const median = total === 0 ? 0
    : total % 2 === 1 ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
  return {
    total,
    avg: total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0,
    best: total ? Math.max(...scores) : 0,
    median: total === 0 ? 0
      : total % 2 === 1 ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2,
    passed: scores.filter((s) => s >= 70).length,
  };
}

function streak(attempts) {
  let n = 0;
  for (let i = attempts.length - 1; i > 0; i--) {
    if ((attempts[i].score ?? 0) > (attempts[i - 1].score ?? 0)) n++;
    else break;
  }
  return n;
}

function byModule(attempts) {
  const map = {};
  for (const a of attempts) {
    const k = a.module_slug;
    if (!map[k]) map[k] = { slug: k, attempts: [], best: 0, last: null };
    map[k].attempts.push(a);
    map[k].best = Math.max(map[k].best, a.score ?? 0);
    if (!map[k].last || new Date(a.completed_at) > new Date(map[k].last.completed_at)) map[k].last = a;
  }
  return Object.values(map).sort((x, y) => y.attempts.length - x.attempts.length || y.last.completed_at - x.last.completed_at);
}

// Strek hanya boleh dihitung DALAM satu modul: membandingkan skor
// kepribadian dengan kecerdasan tidak bermakna karena skalanya berbeda.
function streakPerModule(attempts) {
  const chronological = [...attempts]
    .filter((a) => a && a.completed_at)
    .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
  const latest = chronological[chronological.length - 1];
  if (!latest) return 0;
  const sameModule = chronological.filter((a) => a.module_slug === latest.module_slug);
  let n = 0;
  for (let i = sameModule.length - 1; i > 0; i--) {
    if ((sameModule[i].score ?? 0) > (sameModule[i - 1].score ?? 0)) n++;
    else break;
  }
  return n;
}

// Poin tren: regresi linier pada seri yang sudah terurut waktu. Input yang
// tidak terurut harus tetap menghasilkan arah yang sama (regresi hanya
// bergantung pada arah pasangan (waktu, skor), bukan urutan array).
function trendSlopeUnordered(points) {
  const n = points.length;
  if (n < 2) return 0;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.pct);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  return denom === 0 ? 0 : xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / denom;
}

function orderPoints(attempts) {
  const ordered = [...attempts]
    .filter((a) => a && a.completed_at)
    .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
  return ordered.map((a, i) => ({
    x: ordered.length === 1 ? 50 : (i / (ordered.length - 1)) * 100,
    pct: Math.max(0, Math.min(100, a.score ?? 0)),
    attempt: a,
  }));
}

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : ` -> dapat ${JSON.stringify(actual)}, harap ${JSON.stringify(expected)}`}`);
}

const day = (n) => new Date(Date.UTC(2026, 0, n, 3, 0, 0)).toISOString();

// 1. Satu tes saja: tren harus datar, tidak NaN/Infinity.
const one = [{ module_slug: 'kepribadian', score: 72, total_questions: 40, correct_answers: 29, completed_at: day(5) }];
check('satu tes: avg/best/median', stats(one), { total: 1, avg: 72, best: 72, median: 72, passed: 1 });
check('satu tes: slope 0 (tidak NaN)', trendSlope(buildPoints(one)), 0);
check('satu tes: streak 0', streak(one), 0);

// 2. Progres naik konsisten: tren positif, streak 3.
const up = [
  { module_slug: 'kepribadian', score: 55, total_questions: 40, correct_answers: 22, completed_at: day(1) },
  { module_slug: 'kepribadian', score: 63, total_questions: 40, correct_answers: 25, completed_at: day(8) },
  { module_slug: 'kepribadian', score: 71, total_questions: 40, correct_answers: 28, completed_at: day(15) },
  { module_slug: 'kepribadian', score: 80, total_questions: 40, correct_answers: 32, completed_at: day(22) },
];
check('naik: total 4', stats(up).total, 4);
check('naik: avg 67', stats(up).avg, 67);
check('naik: best 80', stats(up).best, 80);
check('naik: median 67 (rata-rata 2 tengah)', stats(up).median, 67);
check('naik: passed 2 (>=70)', stats(up).passed, 2);
check('naik: streak 3', streak(up), 3);
check('naik: slope > 0', trendSlope(buildPoints(up)) > 0, true);

// 3. Progres turun: tren negatif, arah tidak boleh terbalik.
const down = [
  { module_slug: 'kepribadian', score: 88, total_questions: 40, correct_answers: 35, completed_at: day(1) },
  { module_slug: 'kepribadian', score: 74, total_questions: 40, correct_answers: 30, completed_at: day(8) },
  { module_slug: 'kepribadian', score: 60, total_questions: 40, correct_answers: 24, completed_at: day(15) },
];
check('turun: slope < 0', trendSlope(buildPoints(down)) < 0, true);
check('turun: streak 0', streak(down), 0);

// 4. Skor sama persis: dianggap stagnan, bukan naik.
const flat = [
  { module_slug: 'kepribadian', score: 70, total_questions: 40, correct_answers: 28, completed_at: day(1) },
  { module_slug: 'kepribadian', score: 70, total_questions: 40, correct_answers: 28, completed_at: day(8) },
];
check('datar: slope 0', trendSlope(buildPoints(flat)), 0);
check('datar: streak 0 (bukan naik)', streak(flat), 0);

// 5. Skor null/undefined tidak boleh jadi NaN.
const withNull = [
  { module_slug: 'kepribadian', score: null, total_questions: 40, correct_answers: 0, completed_at: day(1) },
  { module_slug: 'kepribadian', score: 60, total_questions: 40, correct_answers: 24, completed_at: day(8) },
];
check('null score: avg 30 (bukan NaN)', stats(withNull).avg, 30);
check('null score: slope angka', Number.isFinite(trendSlope(buildPoints(withNull))), true);

// 6. Skor di luar 0-100 harus di-clamp, tidak bikin grafik meledak.
const wild = [
  { module_slug: 'kepribadian', score: 140, total_questions: 40, correct_answers: 56, completed_at: day(1) },
  { module_slug: 'kepribadian', score: -20, total_questions: 40, correct_answers: -8, completed_at: day(8) },
];
check('clamp: pct 140 -> 100', buildPoints(wild)[0].pct, 100);
check('clamp: pct -20 -> 0', buildPoints(wild)[1].pct, 0);

// 7. Banyak tes: sort per modul benar dan total benar.
const many = [
  ...up,
  { module_slug: 'kecerdasan', score: 66, total_questions: 30, correct_answers: 20, completed_at: day(10) },
  { module_slug: 'kecerdasan', score: 74, total_questions: 30, correct_answers: 22, completed_at: day(18) },
  { module_slug: 'minat_kerja', score: 90, total_questions: 20, correct_answers: 18, completed_at: day(12) },
];
check('banyak: total 7', stats(many).total, 7);
const mods = byModule(many);
check('banyak: 3 modul', mods.length, 3);
check('banyak: kepribadian 4x dulu', mods[0].slug, 'kepribadian');
check('banyak: kepribadian best 80', mods[0].best, 80);
check('banyak: kepribadian last = tes terakhir (day22)', fmtDate(mods[0].last.completed_at), fmtDate(day(22)));
check('banyak: minat_kerja 1x', mods[2].slug, 'minat_kerja');
check('banyak: minat_kerja best 90', mods[2].best, 90);

// 8. Timestamp tidak valid tidak boleh bikin perbandingan jadi NaN sort.
const badDate = [
  { module_slug: 'kepribadian', score: 50, total_questions: 40, correct_answers: 20, completed_at: 'bukan-tanggal' },
  { module_slug: 'kepribadian', score: 90, total_questions: 40, correct_answers: 36, completed_at: day(9) },
];
check('tanggal rusak: tidak crash', (() => { try { byModule(badDate); return true; } catch { return false; } })(), true);

// 9. Urutan input tidak boleh mengubah arah tren (regresi hanya bergantung
//    pada arah pasangan waktu-skor, bukan urutan array).
const shuffled = [many[3], many[0], many[6], many[1], many[5], many[2], many[4]];
const orderedPts = orderPoints(many);
const shuffledPts = orderPoints(shuffled);
check('acak: titik terurut sama', shuffledPts.map((p) => p.pct), orderedPts.map((p) => p.pct));
check('acak: slope tetap positif', trendSlopeUnordered(shuffledPts) > 0, true);
check('acak: arah tren sama', Math.sign(trendSlopeUnordered(shuffledPts)), Math.sign(trendSlopeUnordered(orderedPts)));

// 10. Strek lintas-modul harus dihitung per-modul. `many` berakhir di
//     kepribadian pada day(22) — bukan minat_kerja day(12) — jadi streak-nya
//     mengikuti kepribadian (55->63->71->80 = 3 kenaikan berturut).
check('per-modul: streak mengikuti modul terakhir (kepribadian)', streakPerModule(many), 3);
check('per-modul: kepribadian naik 3x (55->63->71->80)', streakPerModule(many.filter((a) => a.module_slug === 'kepribadian')), 3);
check('per-modul: minat_kerja 1x jadi streak 0', streakPerModule(many.filter((a) => a.module_slug === 'minat_kerja')), 0);

// 11. Penurunan di tengah harus memutus rentang, bukan dihitung dari awal:
//     80 -> 70 -> 75means satu kenaikan terakhir saja, bukan 2.
const declining = [
  { module_slug: 'kecerdasan', score: 80, total_questions: 30, correct_answers: 24, completed_at: day(1) },
  { module_slug: 'kecerdasan', score: 70, total_questions: 30, correct_answers: 21, completed_at: day(5) },
  { module_slug: 'kecerdasan', score: 75, total_questions: 30, correct_answers: 23, completed_at: day(9) },
];
check('turun: streak 1 (reset saat nilai turun)', streakPerModule(declining), 1);
const flatSeries = [
  { module_slug: 'kecerdasan', score: 70, total_questions: 30, correct_answers: 21, completed_at: day(1) },
  { module_slug: 'kecerdasan', score: 70, total_questions: 30, correct_answers: 21, completed_at: day(5) },
];
check('datar: streak 0', streakPerModule(flatSeries), 0);

console.log(failures === 0 ? '\nSemua tes lulus.' : `\n${failures} tes gagal.`);
process.exit(failures === 0 ? 0 : 1);
