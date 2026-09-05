# Analisis: Migrasi bekasikerja.id dari Next.js/Vercel ke WordPress

> Tanggal: 2026-09-03
> Status: USULAN — tunggu persetujuan user sebelum dieksekusi

---

## 1. KONDISI SAAT INI (As-Is)

| Aspek | Detail |
|---|---|
| **Stack** | Next.js 14.2.35 (App Router) + React 18 + Tailwind CSS 3.3 |
| **Backend/DB** | Supabase (Postgres 16 + Auth + Storage + REST/Realtime) |
| **Hosting** | Vercel (CI/CD `dev` → `main` via GitHub) |
| **Domain** | `bekasikerja.id` → `bekasikerja-id.vercel.app` |
| **Auth admin** | Supabase Auth (`signInWithPassword`) + RLS (`is_admin()` whitelist) |
| **Auth member** | Cosmetic (`localStorage`) — belum Supabase Auth |
| **Pembayaran** | Midtrans QRIS (sandbox), tabel `membership_orders`, `packages`, `memberships` |
| **PaaS build** | Build tetap hijau tanpa env (graceful fallback Supabase) |
| **Penting** | `.env.local` di-gitignore; anon key dari env; `.github/workflows/setup-supabase.yml` (manual) |

### Struktur konten (tabel `posts`)

| `type` | Fungsi | Konten |
|---|---|---|
| `job` | Lowongan Kerja | title, company, location, category, deadline, image_url, content |
| `news` | Lifestyle & Tips Karir | title, category, content, image_url |

### Halaman/rute penting

| Rute | Fungsi |
|---|---|
| `/` | Beranda (slider + grid loker/news) |
| `/lowongan` | Daftar lowongan |
| `/paket` | Paket keanggotaan (Gratis/Hemat/Sultan/Have) |
| `/checkout` | Pembayaran |
| `/loker/[id]` | Detail lowongan |
| `/admin` | Dashboard CRUD |
| `/nyosor/login` | Login admin |
| `/member/register\|login` | Auth member (cosmetic) |
| `/cv-builder` | Generator CV |
| `/psikotes` | Halaman psikotes |
| `/tests` | Hitung postingan |

### Komponen UI utama
- `SiteHeader`, `SiteFooter`, `SearchBar`, `CategoryChips`, `FeaturedSlider`
- `JobCard`, `NewsCard`, `SidebarItem`, `PackageCTA`, `PackageCard`, `Reveal`, `CookieConsent`
- `FormInput`, `FormSelect`, `TagInput`, `ImageUpload`
- Desain: palet BCA (`#005cab`), font Open Sans, pattern HeyLaw (header sticky, split content)

---

## 2. APA YANG HARUS DI-MIGRASI (Tujuan: "konsep sama")

### 2a. Model konten → Custom Post Type WordPress

| Next.js `posts.type` | WordPress CPT | Keterangan |
|---|---|---|
| `job` | `lowongan` (custom post type) | Fields: company (text), location (text), category (taxonomy), deadline (date), image (featured image), content (editor) |
| `news` | `artikel` (custom post type) | Fields: category (taxonomy), featured image, content |
| `site_settings` (baris 1) | `wp_options` (via Settings API) atau ACF Options Page | brand_name, logo_url, badge_text, hero_title, hero_subtitle |

### 2b. Taxonomi

| Konsep Next.js | WordPress |
|---|---|
| `categories` (Manufaktur, Admin, Engineering, Gudang, Logistik, Tips Karir, Psikotes) | Custom taxonomy `kategori` → dilampirkan ke `lowongan` & `artikel` |
| `tags` (free-form keyword) | WP native `post_tag` atau custom taxonomy `tag_loker` |

### 2c. Fitur yang harus dipertahankan

| Fitur | Approach WordPress |
|---|---|
| CRUD admin loker/artikel | Admin native WP + ACF (Advanced Custom Fields) untuk extra fields |
| Upload gambar | Media Library native WP (lebih dari cukup) |
| Branding situs | ACF Options Page (sama fungsi `site_settings`) |
| Search loker | Plugin (SearchWP / FacetWP) ATAU custom REST API endpoint |
| Auth admin | WP native roles/caps + custom login page (non-`wp-admin` agar UX tetap rapi) |
| Auth member | WP native `wp_users` + membership plugin |
| Paket keanggotaan (Gratis/Hemat/Sultan/Have) | WooCommerce Products (virtual) ATAU custom post type `paket` |
| Midtrans QRIS pembayaran | **WooCommerce + Midtrans Official Plugin** (rekomendasi utama) — ini bisa full menggantikan custom `checkout/` route dan `membership_orders` tabel |
| CV Builder | Page template (standalone) |
| Cookie consent | Plugin (CookieYes / Complianz) |
| Footer/Header | Theme (GenerateStack/GeneratePress premium punya brand editor) ATAU ACF theme options |

### 2d. Halaman yang DIHAPUS / digantikan

| Rute Next.js | Status WordPress |
|---|---|
| `/nyosor/*` (login admin bengkok) | **Dihapus** → login admin pakai WP native / custom template halus |
| `/tests/page.js` | **Dihapus** (hanya hitung postingan, tidak relevan produksi) |
| `/member/*` (cosmetic) | Diganti WP native users + membership |
| `app/api/*` (Next.js routes) | Diganti WP REST API + WooCommerce webhook |
| `.env.local`, `package.json`, `tailwind.config.js` | **Dihapus** |
| `.github/workflows/*` | Ganti jadi WP deploy workflow (beda) |

---

## 3. ARSITEKTUR TARGET (To-Be)

```
WordPress (Core)
├── Theme: GeneratePress (premium) ATAU custom theme
│   ├── page-home.php          → Beranda (slider + grid + search)
│   ├── archive-lowongan.php   → Daftar lowongan (filter kategori)
│   ├── single-lowongan.php    → Detail lowongan (=/loker/[id])
│   ├── archive-artikel.php    → Artikel lifestyle
│   ├── page-paket.php         → Paket membership (WooCommerce)
│   ├── page-checkout.php      → Midtrans checkout
│   ├── page-cv-builder.php    → CV generator
│   ├── page-psikotes.php      → Psikotes
│   ├── page-admin.php         → Dashboard admin khusus (custom template)
│   └── template-login-admin.php → Login admin custom (non wp-admin)
├── Plugins aktif
│   ├── ACF Pro (fields + options page)
│   ├── WooCommerce + Midtrans Official Plugin
│   ├── WP OAuth Server / JWT Auth (API-only jika dibutuhkan)
│   ├── CookieYes / Complianz
│   ├── Rank Math / Yoast SEO (pengganti sitemap.xml + robots.txt)
│   ├── WP Mail SMTP (jika email needed)
│   └── optional: FacetWP / SearchWP (filter pencarian)
├── Custom tables (via plugin/mu-plugin):
│   ├── memberships (user → paket)
│   └── membership_orders (Midtrans webhook)
└── Hosting: [pilih opsi — lihat §4]
```

---

## 4. REKOMENDASI HOSTING (3 Tier)

> Prinsip user: **SIMPLE & TIDAK OVER-ENGINEERED**. Hindari GPG vault, hindari multi-layer.

### Tier A — Budget (Rekomendasi Utama 🏆)

| | Niagahoster *Nama Domain* / Hostinger Indonesia |
|---|---|
| **Harga** | Rp 50.000–150.000/bulan (shared hosting paket bisnis) |
| **Server** | Indonesia (Jakarta) — latency rendah untuk audience Bekasi/Cikarang/Karawang |
| **PHP** | 8.1+ |
| **Database** | MySQL 8 / MariaDB 10.6 |
| **SSL** | Gratis (Let's Encrypt) |
| **CPanel** | Ya (udah familiar) |
| **One-click WP** | Ya |
| **Pro** | Murah, dukungan Indonesia (bahasa Indonesia), lokal |
| **Kontra** | Resource terbatas, scale ke atas terbatas |
| **Cocok untuk** | Produksi stabil dengan 1k–10k visitor/bulan |

**Rekomendasi:**
- **Niagahoster** — paket **Bisnis** (PHP 8.2, 5GB storage, SSL gratis, support Indonesia)
- **Hostinger** — paket **Business** (PHP 8.2, 100GB SSD, server SEA)
- **Dewaweb** — paket **Super Hosting Bisnis** (PHP 8.2, LiteSpeed)

### Tier B — Balance (Performa lebih baik)

| | **Cloudways** (DigitalOcean/Vultr Jakarta) |
|---|---|
| **Harga** | $14/bulan (DO Droplet 1GB RAM) → sekitar Rp 220rb |
| **Server** | DigitalOcean/Vultr/AWS Singapore/Jakarta |
| **Stack** | Nginx + PHP-FPM + MySQL, built-in cache (Redis/Varnish opsional) |
| **Pro** | Performa jauh lebih baik, scaling mudah, staging env |
| **Kontra** | Server managed tapi bukan managed-WP premium, setup awal sedikit manual |
| **Cocok** | Kalau traffic naik & butuh performa lebih |

### Tier C — Premium (Jika budget besar)

| | **Kinsta** / **WP Engine** |
|---|---|
| **Harga** | $35–$90+/bulan |
| **Pro** | Performa terbaik (Google Cloud/Lightsail), auto-scaling, staging, dukungan WP khusus |
| **Kontra** | Mahal, server di luar Indonesia (US/Eropa), overkill |
| **Kontra untuk user** | ❌ Tidak sesuai prinsip "simple & murah" |
| **Disarankan** | Tidak — kecuali ada klien yang bayar mahal |

### 🏆 Rekomendasi Final

> **Niagahoster paket Bisnis** atau **Hostinger Business** — murah, lokal, simple, cukup untuk konsep bekasikerja.id.
>
> Kalau nanti traffic membesar → migrasi ke Cloudways tanpa perlu ubah theme/plugin (hanya pindah server).

---

## 5. DOMAIN

- Domain `bekasikerja.id` — perlu DNS A-record ke IP hosting baru (atau nameserver kalau pindah registrar)
- Opsi 1: Tetap di registrar sekarang → ubah nameserver ke Niagahoster/Hostinger
- Opsi 2: Pindah registrar ke Niagahoster/Hostinger (lebih simpel, satu pintu)
- Pastikan SSL auto-enable (Let's Encrypt)
- **Vercel** → biarkan di-review saja; kalau mau cepet matikan agar tidak duplicate, atau jadi fallback

---

## 6. PERBANDINGAN BIAYA (Estimasi Tahunan)

| Komponen | Next.js + Supabase + Vercel (saat ini) | WordPress + Niagahoster |
|---|---|---|
| Hosting | Vercel Pro ($20/bulan) + Supabase Pro ($25/bulan) = **~$540/thn** | Niagahoster Bisnis **~Rp 1.8jt/thn** (~$110/thn) |
| Domain | Sudah punya | Perpanjangan ~Rp 150rb/thn (kalau perlu) |
| Developer | Akan di-maintain via agentic docs | Akan di-maintain via WP plugins |
| **Total** | ~$540/thn | **~$110–260/thn** (hemat 50–80%) |

> **Catatan:** Biaya Supabase Pro sebenarnya bisa diganti dengan Supabase gratis (1GB) atau Docker lokal, tapi kalau data produksi sudah banyak, Di-hosting WordPress tidak ada biaya Supabase.

---

## 7. RISIKO & EFFORT

| Risiko | Mitigasi |
|---|---|
| Kehilangan fitur custom Next.js (slider, search, package CTA) | GeneratePress + ACF + WooCommerce bisa replicasi; banyak plugin premium murah |
| Custom `loker/[id]` routing | WordPress: `single-lowongan.php` — fungsi sama |
| Midtrans payment flow custom → WooCommerce | **WooCommerce + Midtrans Official Plugin** → lebih simpel & maintenance- friendly |
| Data produksi di Supabase | Export `posts` → import via WP CLI/CSV atau custom migration script |
| Member auth belum native | WordPress native `wp_users` + WooCommerce memberships → lebih mature |
| Desain UI berubah | GeneratePress customizable; atau custom theme pakai Tailwind+ACF (tetap bisa) |
| SEO sitemap/robots | Rank Math / Yoast SEO (lebih baik dari manual) |

### Effort estimasi
- **Setup hosting + domain + WP core**: 1–2 jam
- **Install theme + plugins + basic pages**: 3–5 jam
- **Migrasi data posts (CSV)**: 1–2 jam
- **Custom template (home, lowongan list, lowongan detail, paket, admin dashboard)**: 6–12 jam
- **WooCommerce + Midtrans integration**: 3–5 jam
- **Member auth + packages**: 2–4 jam
- **Test + polish**: 3–5 jam
- **Total estimasi**: **20–35 jam** (3–5 hari kerja)

---

## 8. LANGKAH EKSEKUSI (USULAN)

1. ✅ **Analisis & approve** (tahap ini)
2. Pilih hosting (Niagahoster atau Hostinger) + beli domain (jika perlu)
3. Setup hosting: install WordPress, config SSL, config PHP/MySQL
4. Install theme (GeneratePress) + plugins (ACF Pro, WooCommerce, Midtrans, Rank Math, CookieYes)
5. Buat Custom Post Types & taxonomi (`lowongan`, `artikel`, `kategori`)
6. Buat ACF fields untuk `lowongan` (company, location, deadline, category) + Options Page (branding)
7. Buat custom page templates (home, lowongan list, detail, paket, checkout, cv-builder, psikotes)
8. Buat custom admin dashboard page template (non-wp-admin)
9. Setup WooCommerce + Midtrans plugin (paket keanggotaan)
10. Buat custom login page untuk admin
11. Import data `posts` dari Supabase ke WordPress
12. Redirect URL: setup 301 redirect dari `/loker/[id]` → `/lowongan/[slug]` (atau pertahankan path)
13. Test + verify build + SSL + mobile
14. Update DNS → arahkan `bekasikerja.id` ke hosting baru
15. Pantau 1–2 minggu, lalu matikan Vercel

---

## 9. KEPUTUSAN YANG BUTUH USER

Sebelum eksekusi, mohon keputusan user pada pertanyaan ini:

1. **Hosting mana yang dipilih?**
   - [ ] Niagahoster (paket Bisnis) — **rekomendasi**
   - [ ] Hostinger (paket Business)
   - [ ] Dewaweb (paket Super Hosting Bisnis)
   - [ ] Cloudways (Vultr/DO Jakarta)
   - [ ] Lainnya (sebutkan)

2. **Domain:**
   - [ ] Tetap `bekasikerja.id` (pindah DNS ke hosting baru)
   - [ ] Domain baru juga (sebutkan)

3. **Budget bulanan yang rela dikeluarkan?** (untuk menentukan tier)

4. **Waktu eksekusi:** kapan mau mulai? (bisa sambil Next.js tetap jalan — parallel migration)

5. **Apakah konten produksi (posts yang sudah ada) harus dipindahkan dari Supabase ke WordPress?** (jika ya, perlu export + import)

---

## 10. KESIMPULAN

Konsep bekasikerja.id **bisa** dipindahkan ke WordPress dengan baik dan justru lebih murah + lebih simpel. Kunci keberhasilan:
- Pakai **Custom Post Type + ACF** untuk replicasi `posts` + `site_settings`
- Pakai **WooCommerce + Midtrans Official Plugin** untuk membership + pembayaran (lebih维护-friendly daripada custom route)
- Pakai **GeneratePress theme** (ringan, SEO-friendly, customizable)
- Hosting **lokal Indonesia** (Niagahoster/Hostinger) — murah, latency rendah
- **Tidak over-engineered** — cukup paket Bisnis, bukan Kinsta/WP Engine premium

**Next step:** User jawab 5 pertanyaan di §9 → lanjut eksekusi.
