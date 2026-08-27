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

> ⚠️ **Catatan keamanan:** autentikasi admin saat ini menggunakan `localStorage`
> (`bk_admin_auth`) — bukan Supabase Auth. Ini cocok untuk prototyping, tetapi **belum
> aman untuk produksi**. Lihat [Known Issues](#roadmap--known-issues).

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
│   ├── nyosor/               # Alias login admin (password adminkayaraya2026)
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

---

## 🗄 Konfigurasi Supabase

Buat tabel berikut di project Supabase kamu:

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

| Akses            | Mekanisme                                            | Status     |
| ---------------- | ---------------------------------------------------- | ---------- |
| Admin (`/admin`) | `localStorage.bk_admin_auth === 'true'`              | Prototype  |
| Login admin      | password `adminkayaraya2026` di `/nyosor` atau `/nyosor/login` | Prototype  |
| Member           | `localStorage.isMemberLoggedIn` (cosmetic)           | Scaffold   |

⚠️ Semua auth di atas **belum** menggunakan Supabase Auth / RLS. Jangan gunakan untuk
data sensitif sebelum diubah ke Supabase Auth.

---

## 🤖 Dokumentasi Agentic

Seluruh konteks untuk pengembangan otomatis (fresh session) berada di folder **[`agentic/`](./agentic/)**:

| File                | Kegunaan                                                      |
| ------------------- | ------------------------------------------------------------ |
| [`SKILL.md`](./agentic/SKILL.md)     | Skill Hermes: cara kerja di repo ini (run/build/commit).     |
| [`CLAUDE.md`](./agentic/CLAUDE.md)   | Instruksi proyek untuk Claude Code.                          |
| [`AGENTS.md`](./agentic/AGENTS.md)   | Instruksi generik untuk agen manapun.                        |
| [`TASTE.md`](./agentic/TASTE.md)     | Panduan desain / UI (palet, tipografi, mikrokopi BI).        |
| [`README.md`](./agentic/README.md)   | Index dokumentasi agentic.                                   |

Root [`AGENTS.md`](./AGENTS.md) menunjuk ke folder ini agar agen di sesi baru langsung
membaca konteks yang tepat.

---

## 🚀 Roadmap & Known Issues

- [ ] Pindahkan auth admin ke **Supabase Auth** + RLS (keamanan produksi).
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
