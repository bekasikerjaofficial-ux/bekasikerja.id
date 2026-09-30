'use client';
import React, { useMemo } from 'react';
import { PSIKOTES_MODULES } from '../lib/packages';
import { TrendingUp, Award, Flame, BarChart3 } from 'lucide-react';

// Ambil judul modul yang rapi dari slug. Slug yang tidak dikenal tetap
// terbaca (mis. modul lama/typo) daripada hilang dari riwayat.
export function moduleTitle(slug) {
  return PSIKOTES_MODULES.find((m) => m.slug === slug)?.title
    || slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

// Satu titik pada sparkline. y dihitung dari nilai 0..100 supaya tinggi
// batang proporsional langsung terhadap skor, bukan terhadap max data.
function TrendChart({ attempts }) {
  const points = useMemo(() => {
    // Urut sendiri berdasarkan waktu, jangan(reverse()-kan input. Query
    // dashboard memberi urutan terbaru-dulu, tapi asumsi itu rapuh: kalau
    // urutan berubah, seluruh garis tren terbalik dan menampilkan arah
    // progres yang salah tanpa error.
    const ordered = [...attempts]
      .filter((a) => a && a.completed_at)
      .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
    return ordered.map((a, i) => ({
      x: ordered.length === 1 ? 50 : (i / (ordered.length - 1)) * 100,
      pct: Math.max(0, Math.min(100, a.score ?? 0)),
      attempt: a,
    }));
  }, [attempts]);

  if (!points.length) return null;

  const w = 100;
  const h = 100;
  const y = (pct) => h - (pct / 100) * h;

  // Garis tren: regresi linier Least Squares, supaya "progres" punya arah
  // yang jujur dan bukan sekadar noise. Menebak arah naik-turun dari dua
  // tes terakhir menyesatkan, jadi kita gambar garis regresinya.
  const n = points.length;
  const ys = points.map((p) => p.pct);
  const xs = ys.map((_, i) => i);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const denom = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  const slope = denom === 0 ? 0 : xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / denom;
  const trendTotal = slope * (n - 1);

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: 160, display: 'block', overflow: 'visible' }}
        role="img"
        aria-label={`Tren nilai dari ${points.length} kali tes`}
      >
        {/* garis bantu 0/50/100 */}
        {[0, 50, 100].map((g) => (
          <line key={g} x1="0" y1={y(g)} x2={w} y2={y(g)}
            stroke="var(--gray-200)" strokeWidth="0.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        ))}
        {/* garis tren */}
        <line
          x1={points[0].x} y1={y(points[0].pct - slope * (0 - (n - 1) / 2))}
          x2={points[n - 1].x} y2={y(points[n - 1].pct + slope * ((n - 1) - (n - 1) / 2))}
          stroke="var(--hl-teal)" strokeWidth="1.5" strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke" opacity="0.55"
        />
        {/* garis data + titik */}
        <polyline
          points={points.map((p) => `${p.x},${y(p.pct)}`).join(' ')}
          fill="none" stroke="var(--hl-blue)" strokeWidth="2"
          strokeLinejoin="round" vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={y(p.pct)} r="2.5" fill={p.pct >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)'}
            stroke="#fff" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <title>{`${fmtDate(p.attempt.completed_at)} — skor ${p.attempt.score}`}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-500)', marginTop: 6 }}>
        <span>{fmtDate(points[0].attempt.completed_at)}</span>
        <span>{fmtDate(points[n - 1].attempt.completed_at)}</span>
      </div>
      {n > 1 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
          fontSize: 12, fontWeight: 700,
          color: Math.abs(trendTotal) < 3 ? 'var(--gray-500)' : trendTotal > 0 ? 'var(--hl-teal)' : 'var(--hl-red)',
          background: Math.abs(trendTotal) < 3 ? 'var(--gray-100)' : trendTotal > 0 ? '#e8f7ee' : '#fff0f0',
          padding: '6px 10px', borderRadius: 8,
        }}>
          <TrendingUp size={14} style={trendTotal < 0 && Math.abs(trendTotal) >= 3 ? { transform: 'rotate(180deg)' } : undefined} />
          {Math.abs(trendTotal) < 3
            ? 'Nilai stagnan sejak tes terakhir'
            : `${trendTotal > 0 ? 'Naik' : 'Turun'} ±${Math.abs(Math.round(trendTotal))} poin dari tes pertama`}
        </div>
      )}
    </div>
  );
}

// Ringkasan per modul: berapa kali dikerjakan + nilai terbaik + terakhir.
// Menjawab "sudah berapa kali tes, berapa nilainya" per jenis tes.
function ModuleBreakdown({ attempts }) {
  const byModule = useMemo(() => {
    const map = {};
    for (const a of attempts) {
      const k = a.module_slug;
      if (!map[k]) map[k] = { slug: k, title: moduleTitle(k), attempts: [], best: 0, last: null };
      map[k].attempts.push(a);
      map[k].best = Math.max(map[k].best, a.score ?? 0);
      if (!map[k].last || new Date(a.completed_at) > new Date(map[k].last.completed_at)) map[k].last = a;
    }
    return Object.values(map).sort((a, b) => b.attempts.length - a.attempts.length || b.last.completed_at - a.last.completed_at);
  }, [attempts]);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {byModule.map((m) => (
        <div key={m.slug} style={{
          border: '1px solid var(--gray-200)', borderRadius: 10, padding: '12px 14px',
          background: 'var(--gray-50, #f8fafc)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title}</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--gray-500)', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <BarChart3 size={12} /> {m.attempts.length}× dikerjakan
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Award size={12} /> terbaik {m.best}
              </span>
            </div>
          </div>
          {/* batang progres: tinggi = skor terbaik modul ini */}
          <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.max(0, Math.min(100, m.best))}%`, height: '100%',
              background: m.best >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)',
              borderRadius: 3, transition: 'width .4s ease',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 6 }}>
            Terakhir: {fmtDate(m.last.completed_at)} &middot; nilai {m.last.score}
          </div>
        </div>
      ))}
    </div>
  );
}

// Panel utama untuk tab "Hasil Tes": kartu ringkasan + tren + per modul +
// daftar attempt lengkap (tidak dipotong limit).
export default function TestHistory({ attempts }) {
  const stats = useMemo(() => {
    const scores = attempts.map((a) => a.score ?? 0);
    const total = scores.length;
    const avg = total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const best = total ? Math.max(...scores) : 0;
    const sorted = [...scores].sort((a, b) => b - a);
    // Median untuk jumlah genap adalah rata-rata dua nilai tengah. Mengambil
    // satu elemen saja (sorted[n/2]) selalu meleset saat jumlah tes genap.
    const mid = Math.floor(total / 2);
    const median = total === 0 ? 0
      : total % 2 === 1 ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
    return { total, avg, best, median, passed: scores.filter((s) => s >= 70).length };
  }, [attempts]);

  // Berapa kali nilai naik beruntun. Dihitung DALAM satu modul: membandingkan
  // skor kepribadian dengan skor kecerdasan tidak bermakna karena keduanya
  // skala dan tingkat kesukaran berbeda, jadi streak lintas-modul selalu
  // menyesatkan.
  const streak = useMemo(() => {
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
  }, [attempts]);

  if (stats.total === 0) return null;

  const card = (icon, label, value, sub, color) => (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {icon}
        <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--gray-900)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Ringkasan angka */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {card(<Flame size={16} color="var(--hl-blue)" />, 'Total Tes', stats.total, `${stats.passed}× nilai ≥ 70`)}
        {card(<BarChart3 size={16} color="var(--hl-teal)" />, 'Rata-rata', stats.avg, `median ${stats.median}`)}
        {card(<Award size={16} color="var(--hl-gold)" />, 'Tertinggi', stats.best, 'skor personal terbaik')}
        {card(
          <TrendingUp size={16} color={streak > 0 ? 'var(--hl-teal)' : 'var(--gray-400)'} />,
          'Progres Terakhir', streak > 0 ? `${streak}× naik` : '—',
          streak > 0 ? 'nilai naik beruntun' : 'belum ada kenaikan'
        )}
      </div>

      {/* Tren nilai */}
      <div className="panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Tren Nilai</h3>
        <p className="text-muted" style={{ fontSize: 12, margin: '4px 0 16px' }}>
          {stats.total === 1
            ? 'Satu tes tercatat. Kerjakan tes lagi untuk melihat tren.'
            : `Nilai dari ${stats.total} tes terakhir Anda.`}
        </p>
        <TrendChart attempts={attempts} />
      </div>

      {/* Per modul */}
      <div className="panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Progres per Jenis Tes</h3>
        <p className="text-muted" style={{ fontSize: 12, margin: '0 0 14px' }}>
          Berapa kali tiap tes sudah dikerjakan dan nilai terbaiknya.
        </p>
        <ModuleBreakdown attempts={attempts} />
      </div>
    </div>
  );
}

export { fmtDate, TrendChart, ModuleBreakdown };
