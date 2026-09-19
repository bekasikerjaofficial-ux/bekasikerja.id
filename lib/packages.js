// Konfigurasi default 4-tier paket + gate modul psikotes.
// Di produksi, tabel DB public.packages adalah sumber data utama (diisi via /admin/paket).
// Konstanta ini dipakai sebagai fallback agar CTA homepage tetap render walau
// admin belum mengisi data paket.
//
// HARGA paket berlangganan terbaru:
// Gratis: Rp0 selamanya; Basic: Rp25.000/6 bulan;
// Pro: Rp50.000/6 bulan; Premium: Rp100.000/12 bulan.
// Tabel DB public.packages tetap menjadi sumber data utama di produksi.

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
    name: 'Basic',
    price: 25000,
    period: '6 bulan',
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
    name: 'Pro',
    price: 50000,
    period: '6 bulan',
    tagline: 'Paket paling laku untuk psikotes lengkap',
    description: 'Paket Basic + Ketelitian + Psikotes Umum.',
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
    name: 'Premium',
    price: 100000,
    period: '12 bulan',
    tagline: 'Semua tes, tanpa batas',
    description: 'Paket Pro + English Test, Case Study, dll.',
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

// Legacy slugs remain valid so existing memberships and checkout links keep working.
export const PACKAGE_DISPLAY_NAMES = {
  gratis: 'Gratis',
  hemat: 'Basic',
  sultan: 'Pro',
  have: 'Premium',
};

export function packageDisplayName(pkgOrSlug) {
  const slug = typeof pkgOrSlug === 'string' ? pkgOrSlug : pkgOrSlug?.slug;
  return PACKAGE_DISPLAY_NAMES[slug] || (typeof pkgOrSlug === 'object' ? pkgOrSlug?.name : slug) || 'Gratis';
}

export function tierIndex(slug) {
  const i = TIER_ORDER.indexOf(slug);
  return i < 0 ? 0 : i;
}
