// Konfigurasi default 4-tier paket + gate modul psikotes.
// Di produksi, tabel DB public.packages adalah sumber data utama (diisi via /admin/paket).
// Konstanta ini dipakai sebagai fallback agar CTA homepage tetap render walau
// admin belum mengisi data paket.
//
// HARGA (dikonfirmasi owner 2026-08-31): Gratis 0, Hemat 25rb, Sultan 35rb, Have 50rb.
// Semua PER 3 BULAN kecuali Gratis (selamanya). Tabel DB public.packages = sumber utama di produksi.

export const DEFAULT_PACKAGES = [
  {
    slug: 'gratis',
    name: 'Gratis',
    price: 0,
    period: 'selamanya',
    tagline: 'Mulai sekarang, tanpa biaya',
    description: 'Lihat lowongan kerja & buat CV gratis.',
    popular: false,
    sort_order: 0,
    features: [
      { text: 'Akses lowongan kerja terverifikasi', included: true },
      { text: 'Pembuat CV gratis', included: true },
      { text: 'Tes Matematika Dasar', included: false },
      { text: 'Tes Logika Dasar', included: false },
      { text: 'Tes Ketelitian & Psikotes', included: false },
      { text: 'English Test & Case Study', included: false },
    ],
  },
  {
    slug: 'hemat',
    name: 'Hemat',
    price: 25000,
    period: '3 bulan',
    tagline: 'Persiapan dasar tes masuk kerja',
    description: 'CV gratis + Matematika Dasar + Tes Logika Dasar.',
    popular: false,
    sort_order: 1,
    features: [
      { text: 'Akses lowongan kerja terverifikasi', included: true },
      { text: 'Pembuat CV gratis', included: true },
      { text: 'Tes Matematika Dasar', included: true },
      { text: 'Tes Logika Dasar (Deret & Pola gambar)', included: true },
      { text: 'Tes Ketelitian & Psikotes', included: false },
      { text: 'English Test & Case Study', included: false },
    ],
  },
  {
    slug: 'sultan',
    name: 'Sultan',
    price: 35000,
    period: '3 bulan',
    tagline: 'Paket paling laku untuk psikotes lengkap',
    description: 'Paket Hemat + Ketelitian + Psikotes Umum.',
    popular: true,
    sort_order: 2,
    features: [
      { text: 'Akses lowongan kerja terverifikasi', included: true },
      { text: 'Pembuat CV gratis', included: true },
      { text: 'Tes Matematika Dasar', included: true },
      { text: 'Tes Logika Dasar (Deret & Pola gambar)', included: true },
      { text: 'Tes Ketelitian', included: true },
      { text: 'Psikotes Umum', included: true },
      { text: 'English Test & Case Study', included: false },
    ],
  },
  {
    slug: 'have',
    name: 'Have',
    price: 50000,
    period: '3 bulan',
    tagline: 'Semua tes, tanpa batas',
    description: 'Paket Sultan + English Test, Case Study, dll.',
    popular: false,
    sort_order: 3,
    features: [
      { text: 'Akses lowongan kerja terverifikasi', included: true },
      { text: 'Pembuat CV gratis', included: true },
      { text: 'Tes Matematika Dasar', included: true },
      { text: 'Tes Logika Dasar (Deret & Pola gambar)', included: true },
      { text: 'Tes Ketelitian', included: true },
      { text: 'Psikotes Umum', included: true },
      { text: 'English Test', included: true },
      { text: 'Case Study', included: true },
    ],
  },
];

// Katalog modul psikotes, digate berdasarkan tier terendah yang membukanya.
// `minTier` = slug paket terendah yang meng-unlock modul ini.
export const PSIKOTES_MODULES = [
  { slug: 'math_basic', title: 'Matematika Dasar', desc: 'Soal hitungan dasar untuk tes masuk kerja.', minTier: 'hemat' },
  { slug: 'logic_basic', title: 'Tes Logika Dasar', desc: 'Deret angka & pola gambar.', minTier: 'hemat' },
  { slug: 'ketelitian', title: 'Tes Ketelitian', desc: 'Kecepatan & ketelitian melihat detail.', minTier: 'sultan' },
  { slug: 'psikotes', title: 'Psikotes Umum', desc: 'Kepribadian & preferensi kerja.', minTier: 'sultan' },
  { slug: 'english_test', title: 'English Test', desc: 'Tes bahasa Inggris kerja.', minTier: 'have' },
  { slug: 'case_study', title: 'Case Study', desc: 'Studi kasus & problem solving.', minTier: 'have' },
];

// Urutan tier untuk membandingkan "apakah tier ini sudah unlocked?".
export const TIER_ORDER = ['gratis', 'hemat', 'sultan', 'have'];

export function tierIndex(slug) {
  const i = TIER_ORDER.indexOf(slug);
  return i < 0 ? 0 : i;
}
