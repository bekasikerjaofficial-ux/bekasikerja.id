# TASTE.md — Design System BekasiKerja.id

Standar visual BekasiKerja.id. **Rombak 2026-08-28:** seluruh UI diport ke
design system dari `github.com/hernanda-git/heylaw-design-system` — **layout &
modul mengikuti HeyLaw (heylaw.id)**, dengan **brand token BCA (biru #005cab)**.
Berlaku untuk semua perubahan tampilan di `app/`.

## 🎨 Sumber Design System
- Repo: `hernanda-git/heylaw-design-system` (token `tokens.json` v3.0, BCA skin)
- Layout & modul: ekstraksi `heylaw.id` (promo strip, header+search, category
  icon bar, hero gradient, split content, sidebar, footer, cookie consent)
- Implementasi lokal: `app/globals.css` (CSS vars + komponen) + `tailwind.config.js`
  (extend colors/font/radius) + `components/` (SiteHeader, SiteFooter, Cards,
  SearchBar, CookieConsent)

## 🎨 Palet Warna (token BCA)
| Peran | Token CSS | Tailwind | Hex |
|-------|-----------|----------|-----|
| Aksen utama (brand BCA) | `--hl-blue` | `brand-blue` | `#005cab` |
| Aksen hover | `--hl-blue-dark` | `brand-blue-dark` | `#004a89` |
| Aksen light | `--hl-blue-light` | `brand-blue-light` | `#00b6f1` |
| Gradien hero | `--hl-blue-grad` | — | `linear-gradient(135deg,#005cab,#004a89)` |
| News / gold | `--hl-gold` | `brand-gold` | `#f49c31` |
| Bahaya | `--hl-red` | `brand-red` | `#f80000` |
| Surface / base | `--gray-100` | `bca-100` | `#f8f9fa` |
| Text | `--gray-700/900` | `bca-700/900` | `#495057 / #212529` |
| Muted | `--gray-500/600` | `bca-500/600` | `#adb5bd / #6c757d` |
| Border | `--gray-200` | `bca-200` | `#e9ecef` |
| Footer dark | `--gray-900` | `bca-900` | `#212529` |

> Pakai token di atas. Jangan introduce warna di luar palet (kecuali gold news
> & red danger yang sudah terdaftar).

## 🔤 Tipografi
- **Font:** `Open Sans` (BCA skin) untuk SEMUA teks — body & display. Dimuat di
  `globals.css` via Google Fonts, dan di-set sebagai `font-sans`/`font-display`
  di Tailwind. Jangan ganti ke font lain tanpa alasan.
- Heading: helper `.h-display` (800) / `.h-section` (700). Logo: `.logo` (800).
- Body: `.text-body`; meta/caption: `.text-muted` (12–13px).
- Weight: bold (600/700) label & judul, extra (800) impact.

## 📐 Bentuk & Elevasi
- Radius: card `12px` (`--r-lg`); panel/input/button `8px` (`--r-md`);
  pill/badge `9999px` (`--r-pill`).
- Shadow: card `var(--shadow-card)`; hover `var(--shadow-card-hover)`.
- Border: `1px solid var(--gray-200)` konsisten.
- Hover card: `translateY(-3px)` + shadow-hover (lihat `.card`).

## 🧩 Pola Layout (HeyLaw)
- **Promo strip** atas (`.promo-strip`) — link CTAsingkat.
- **Header sticky** `.header` (logo + nav + search pill + Daftar/Login).
  Gunakan `components/SiteHeader.js` (jangan hardcode header tiap halaman).
- **Category icon bar** `.cat-bar` (opsional, di beranda).
- **Hero** `.hero` gradient biru, grid 2 kolom (text + ilustrasi), badge +
  h1 + stats.
- **Search card** `.search-card` (filter bar BCA-style) — pakai `SearchBar`.
- **Split content** `.split` (main + sidebar 340px), collapse di &lt;1024px.
- **Card grid** `.card-grid` (3 kolom desktop, 2 tablet, 1 mobile).
- **Footer** `.footer` navy 3-kolom — pakai `SiteFooter.js`.
- **Cookie consent** `.cookie` floating — `CookieConsent.js`.
- Container: `.container` max 1280px. Section padding: `.section` (64px).

## ✍️ Mikrokopi (Bahasa Indonesia)
- Judul section: "💼 Lowongan Kerja Terbaru", "📰 Lifestyle & Tips Karir".
- Tombol: "Daftar Member Gratis", "Login Member", "Publish Postingan",
  "Simpan Pengaturan Situs".
- Sukses: "🎉 Berhasil Mendaftar! Mengalihkan ke Halaman Utama…".
- Error: "Login gagal: …", "Gagal upload file…".
- Istilah teknis tetap Inggris: Next.js, Supabase, bucket, URL.

## 🖼 Iconografi
- **Library:** `lucide-react` (stroke-based 24px, tree-shakeable, MIT). Import per-icon:
  `import { Search, Briefcase, MapPin, Newspaper } from 'lucide-react'`.
- **Penggunaan:** semua ikon pakai `size={16|18|20|22}` + `color="var(--hl-blue)"`
  (atau `var(--gray-500)` untuk dekoratif). Hindari warna selain token.
- **Jangan pakai emoji** (💼 📍 📰 dll) di UI — render beda tiap OS, rusak brand
  consistency. Emoji hanya boleh di string `alert()` (JS, bukan render DOM).
- Ikon yang sudah dipakai: `Briefcase` (brand/logo), `Search` (search), `MapPin`
  (lokasi), `CalendarClock` (deadline), `Newspaper` (artikel), `Factory`/`Wrench`/
  `Package`/`Truck`/`BookOpen`/`Brain` (cat bar), `Settings`/`Plus`/`ClipboardList`/
  `Image`/`Save`/`Trash2` (admin), `CheckCircle2` (sukses), `LogOut` (logout).

## 🚫 Jangan
- Jangan pakai warna di luar palet token di atas.
- Jangan ubah font ke selain Open Sans tanpa penjelasan.
- Jangan hardcode header/footer tiap halaman — pakai komponen `SiteHeader`/
  `SiteFooter` biar konsisten.
- Jangan perkecil radius drastis (tetap 8–16px).
- Jangan hapus `scroll-mt-20` pada section yang di-link dari nav (#lowongan, #lifestyle).
