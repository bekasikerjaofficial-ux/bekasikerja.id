# 💼 BekasiKerja.id

> Portal Lowongan Kerja kawasan industri **Bekasi, Cikarang, & Karawang** — dibangun dengan **Next.js (App Router)**, **Supabase**, dan **Tailwind CSS**.

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Built with](https://img.shields.io/badge/built%20with-Hermes%20Agent-9b59b6)](https://nousresearch.com/hermes)

---

## 📑 Daftar Isi

- [Pendahuluan](#pendahuluan)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Direktori](#struktur-direktori)
- [Instalasi & Menjalankan Lokal](#instalasi--menjalankan-lokal)
- [Konfigurasi Supabase](#konfigurasi-supabase)
- [Model Autentikasi](#model-autentikasi)
- [Dokumentasi Agentic](#dokumentasi-agentic)
- [Roadmap & Known Issues](#roadmap--known-issues)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Author](#author)

---

## 🧭 Pendahuluan

**BekasiKerja.id** adalah portal informasi lowongan kerja yang menampilkan dua jenis
konten dari satu tabel Supabase:

| `type`  | Fungsi                                                          |
| ------- | -------------------------------------------------------------- |
| `job`   | Lowongan Kerja (Loker) — grid utama di beranda.                |
| `news`  | Lifestyle & Tips Karir — grid sekunder di beranda.             |

Konten dikelola melalui dashboard admin (`/admin`), branding situs dikelola melalui
`tables site_settings` (baris `id = 1`).

> ✅ **Keamanan:** autentikasi admin menggunakan **Supabase Auth**
> (`signInWithPassword`) + **Row Level Security (RLS)**. Tabel `posts` & `site_settings`
> dapat dibaca publik, namun hanya user admin (email di-whitelist via fungsi
> `is_admin()`) yang boleh menulis. Skema & RLS ada di
> [`agentic/supabase-setup.sql`](./agentic/supabase-setup.sql).

---

## ✨ Fitur Utama

- 🏠 **Beranda dinamis** — auto-slider headline + grid Loker & News dari Supabase.
- 🔐 **Admin dashboard** — CRUD postingan, upload gambar ke Supabase Storage (bucket `images`).
- 🎨 **Branding editor** — ubah logo, nama brand, badge, hero title & subtitle dari admin.
- 👤 **Member (scaffold)** — halaman `/member/register` & `/member/login` (masih cosmetic).
- 📄 **CV Builder** — halaman `/cv-builder` (template statis).
- 🧪 **Halaman testing** — `/tests` menampilkan jumlah postingan (`count` dari Supabase).

---

## 🛠 Tech Stack

| Layer        | Teknologi                                              |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 14.1.0 (App Router, `app/`)                   |
| UI           | React 18 + Tailwind CSS 3.3                            |
| Data         | Supabase JS 2.39 (`@supabase/supabase-js`)            |
| Bahasa       | JavaScript (JSX)                                       |
| Build        | `next build` / `next dev`                             |
| Styling      | Utility-first, brand: `blue-900` / `blue-600` / `slate` |

---

## 📂 Struktur Direktori

```text
bekasikerja.id/
├── app/
│   ├── layout.js              # Root layout (tidak lagi membungkus AppProvider)
│   ├── page.js               # Beranda (fetch Supabase: posts + site_settings)
│   ├── globals.css           # Tailwind base
│   ├── admin/page.js         # Dashboard admin (CRUD + upload gambar)
│   ├── cv-builder/page.js    # Generator CV (statis)
│   ├── member/
│   │   ├── login/page.js     # Login member (cosmetic / localStorage)
│   │   └── register/page.js  # Register member (cosmetic / localStorage)
│   ├── nyosor/               # Login admin (Supabase Auth) — /nyosor -> /nyosor/login
│   │   ├── page.js
│   │   ├── login/page.js
│   │   └── dashboard/page.js
│   └── tests/page.js         # Hitung postingan dari Supabase
├── lib/
│   └── supabase.js           # Client Supabase (env-based)
├── agentic/                  # 📚 Dokumentasi agentic (SKILL/CLAUDE/TASTE/AGENTS)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .env.local.example        # Template env (jangan commit .env.local)
└── .gitignore
```

---

## ⚙️ Instalasi & Menjalankan Lokal

```bash
# 1. Clone
git clone https://github.com/bekasikerjaofficial-ux/bekasikerja.id.git
cd bekasikerja.id

# 2. Install dependencies
npm install

# 3. Siapkan environment
cp .env.local.example .env.local
#    Edit .env.local, paste NEXT_PUBLIC_SUPABASE_ANON_KEY asli

# 4. Jalankan dev server
npm run dev          # http://localhost:3000

# Build produksi
npm run build
npm run start
```

<details>
<summary>📋 Isi <code>.env.local</code></summary>

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tbmdjqnshyogunoisrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_asli_disini
```

> `.env.local` sudah di-`gitignore`. Anon key bersifat publik (aman di client), tetapi
> tetap jangan commit file tersebut.

</details>

## 🚀 Deployment (Vercel)

Build selalu hijau meskipun env belum disetel (client Supabase tidak me-throw saat import).
Namun untuk data nyata, set env di **Vercel → Project → Settings → Environment Variables**:

| Key                              | Value                                  |
| -------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | `https://tbmdjqnshyogunoisrn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | anon key asli dari project Supabase    |

Tanpa keduanya, halaman tetap ter-build & ter-render, tapi konten Supabase kosong
(graceful fallback). Pastikan `agentic/supabase-setup.sql` sudah dijalankan dan RLS aktif.

---

## 🗄 Konfigurasi Supabase

1. Jalankan [`agentic/supabase-setup.sql`](./agentic/supabase-setup.sql) di Supabase SQL Editor
   (membuat tabel `posts`, `site_settings`, bucket `images` Public, dan **RLS**).
2. Buat user admin di **Authentication → Users** dengan email yang di-whitelist di
   fungsi `admin_emails()` (default: `admin@bekasikerja.id`).

<details>
<summary>📊 Tabel <code>posts</code></summary>

| Kolom         | Tipe      | Keterangan                              |
| ------------- | --------- | --------------------------------------- |
| `id`          | int8 (PK) | auto-increment                          |
| `type`        | text      | `'job'` atau `'news'`                   |
| `title`       | text      | judul postingan                         |
| `company`     | text      | nama PT (untuk `job`)                    |
| `location`    | text      | lokasi kawasan                          |
| `category`    | text      | kategori / label                        |
| `deadline`    | text      | batas melamar (string bebas)            |
| `image_url`   | text      | URL gambar (upload atau link)           |
| `content`     | text      | deskripsi / konten                      |
| `created_at`  | timestamptz | default `now()`                       |

</details>

<details>
<summary>⚙️ Tabel <code>site_settings</code> (baris <code>id = 1</code>)</summary>

| Kolom            | Tipe | Keterangan                  |
| ---------------- | ---- | --------------------------- |
| `id`             | int8 | `1` (tetap)                 |
| `brand_name`     | text | nama website                |
| `logo_url`       | text | URL logo                    |
| `badge_text`     | text | teks badge header           |
| `hero_title`     | text | judul hero banner           |
| `hero_subtitle`  | text | sub-judul hero banner       |

</details>

> **Storage:** buat bucket bernama `images`, set ke **Public** agar `getPublicUrl` berfungsi.

---

## 🔐 Model Autentikasi

| Akses            | Mekanisme                                                       | Status     |
| ---------------- | -------------------------------------------------------------- | ---------- |
| Admin (`/admin`) | **Supabase Auth** session (`supabase.auth.getUser`)            | ✅ Aman    |
| Login admin      | `signInWithPassword` di `/nyosor/login` (email + password)    | ✅ Aman    |
| Tulis data       | RLS: `is_admin()` — email di-whitelist di `admin_emails()`    | ✅ Aman    |
| Member           | `localStorage.isMemberLoggedIn` (cosmetic)                    | Scaffold   |

> Admin & tulis data sudah aman via Supabase Auth + RLS. Auth member masih cosmetic
> (`localStorage`) — belum Supabase Auth.

---

## 🤖 Dokumentasi Agentic

Seluruh konteks untuk pengembangan otomatis (fresh session) berada di folder **[`agentic/`](./agentic/)**:

| File                | Kegunaan                                                      |
| ------------------- | ------------------------------------------------------------ |
| [`SKILL.md`](./agentic/SKILL.md)     | Skill Hermes: cara kerja di repo ini (run/build/commit).     |
| [`CLAUDE.md`](./agentic/CLAUDE.md)   | Instruksi proyek untuk Claude Code.                          |
| [`AGENTS.md`](./agentic/AGENTS.md)   | Instruksi generik untuk agen manapun.                        |
| [`TASTE.md`](./agentic/TASTE.md)     | Panduan desain / UI (palet, tipografi, mikrokopi BI).        |
| [`supabase-setup.sql`](./agentic/supabase-setup.sql) | Skema DB + RLS + bucket storage.              |
| [`e2e-check.mjs`](./e2e-check.mjs) | E2E headless Playwright (guard auth + console errors). |
| [`README.md`](./agentic/README.md)   | Index dokumentasi agentic.                                   |

Root [`AGENTS.md`](./AGENTS.md) menunjuk ke folder ini agar agen di sesi baru langsung
membaca konteks yang tepat.

---

## 🛡 Audit & Verifikasi

Repo ini diaudit penuh dan di-hardening. Ringkasan untuk sesi baru:

| Cek                 | Status | Catatan                                                          |
| ------------------- | ------ | -------------------------------------------------------------- |
| `npm run build`     | ✅ Hijau | 12 route ter-compile (Next.js 14.2.35).                         |
| Dependency CVE      | ✅ Ditutup | `next@14.2.35` (CVE middleware auth-bypass kritis) + `postcss@8.5.23`. |
| Auth admin          | ✅ Aman | Supabase Auth + RLS (`is_admin()`), bukan lagi `localStorage`.  |
| Rahasia             | ✅ Aman | Anon key dari env; `.env.local` di-gitignore; tidak di-commit.  |
| Routing internal    | ✅ Aman | Semua `href`/`Link` valid; tidak ada 404 (regresi lama sudah fix). |
| E2E (headless)      | ✅ Lolos | `e2e-check.mjs` — lihat di bawah.                               |

### E2E (Playwright, headless Chromium)

`e2e-check.mjs` membuka setiap route, menangkap console error, dan menegaskan guard
auth:
- `/admin`, `/nyosor`, `/nyosor/dashboard` → redirect ke `/nyosor/login` bila belum login.
- Tidak ada console error level kode (gagal resolve jaringan ke Supabase dianggap
  lingkungan, bukan bug — butuh `.env.local` + koneksi nyata).

```bash
npm install -D playwright@1.47.2 && npx playwright install chromium
npm run build && npm run start &   # server di :3000
node e2e-check.mjs                  # EXIT 0 = PASS
```

> Environment tanpa egress network: Supabase fetch gagal (`ERR_NAME_NOT_RESOLVED`) namun
> halaman tetap render fallback (proof degradasi graceful).

---

## 🚀 Roadmap & Known Issues

- [x] **Auth admin aman** — Supabase Auth (`signInWithPassword`) + RLS (`is_admin()`).
- [x] **Dependency CVE** — `next` dinaikkan ke `14.2.35` (tutup CVE middleware auth bypass kritis); `postcss` ke `8.5.23`.
- [ ] Implementasikan auth member nyata (saat ini cosmetic).
- [ ] Tambahkan halaman detail postingan (`/loker/[id]`).
- [ ] SEO: `sitemap.xml`, `robots.txt`, Open Graph image.
- [ ] Rate-limit upload gambar & validasi tipe file di admin.

---

## 🤝 Kontribusi

1. Buat branch dari `main` (mis. `dev`).
2. Pastikan `npm run build` lolos sebelum commit.
3. Commit menggunakan identitas GitHub pemilik repo (lihat [Author](#author)).
4. Push & buka Pull Request.

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **MIT**. Lihat [`LICENSE`](./LICENSE).

---

## 👤 Author

Dibangun & dirawat menggunakan identitas GitHub:

- **Name:** `𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟`
- **GitHub:** [@hernanda-git](https://github.com/hernanda-git)
- **Email (no-reply):** `42990222+hernanda-git@users.noreply.github.com`

> Semua commit di repo ini sebaiknya diauthor dengan identitas di atas.
