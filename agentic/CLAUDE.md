# CLAUDE.md — BekasiKerja.id

Instruksi proyek untuk **Claude Code** (dan agen serupa). Baca ini sebelum mengubah kode.

## 1. Overview

Portal lowongan kerja Next.js 14 (App Router) yang menampilkan konten dari Supabase.
Satu tabel `posts` memuat dua tipe: `job` (Loker) dan `news` (Lifestyle/Tips).
Branding situs disimpan di `site_settings` baris `id = 1`.

## 2. Tech Stack

- **Next.js 14.1.0** — App Router, direktori `app/`.
- **React 18** + **Tailwind CSS 3.3** (utility-first).
- **Supabase JS 2.39** (`@supabase/supabase-js`).
- JavaScript (JSX), tidak ada TypeScript.
- Node 22 (lingkungan build saat ini).

## 3. Commands

```bash
npm install        # install dependencies
npm run dev        # dev server -> http://localhost:3000
npm run build      # production build (WAJIB lolos sebelum commit)
npm run start      # jalankan hasil build
npm run lint       # next lint
```

## 4. Directory Map

- `app/page.js` — Beranda. Fetch `site_settings` (id=1) + `posts` (order created_at desc).
  Slider = 3 postingan teratas; `jobs` = filter `type='job'` (6); `news` = `type='news'` (6).
- `app/admin/page.js` — Dashboard admin. CRUD `posts`, upload ke bucket `images`.
- `app/nyosor/*` — Alias login admin. Password: `adminkayaraya2026`. Set `localStorage.bk_admin_auth='true'`.
- `app/member/*` — Register/Login member. **Cosmetic** (`localStorage` only, belum Supabase Auth).
- `app/cv-builder/page.js` — Generator CV statis.
- `app/tests/page.js` — Hitung `posts` via `count: 'exact', head: true`.
- `lib/supabase.js` — Client Supabase, membaca env `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 5. Supabase Schema (harapan)

**posts**: `id` (int8 PK), `type` (text: 'job'|'news'), `title`, `company`, `location`,
`category`, `deadline`, `image_url`, `content`, `created_at` (timestamptz default now()).

**site_settings**: `id` (int8, baris 1), `brand_name`, `logo_url`, `badge_text`,
`hero_title`, `hero_subtitle`.

**storage**: bucket `images` harus **Public**.

## 6. Auth Model (PENTING)

- Admin: `localStorage.bk_admin_auth === 'true'`. BUKAN Supabase Auth. Prototyping only.
- Password admin: `adminkayaraya2026` (di `/nyosor` dan `/nyosor/login`).
- Member: `localStorage.isMemberLoggedIn` — cosmetic.
- Jangan anggap ini aman untuk produksi. Jika diminta hardened, migrasi ke Supabase Auth + RLS.

## 7. Conventions

- **UI text dalam Bahasa Indonesia** (profesional). Istilah teknis tetap Inggris
  (Next.js, Supabase, localStorage, dsb.).
- Palet brand: `blue-900` / `blue-600` (aksen), `slate-*` (base), `amber-*` (news),
  `emerald-*` (sukses), `rose-*` (bahaya). Lihat `TASTE.md`.
- Radius: `rounded-2xl` (card besar), `rounded-xl` (input/button). Shadow: `shadow-sm`/`shadow`.
- Heading extra-bold (`font-extrabold`), body text kecil (`text-xs`/`text-sm`).
- Halaman interaktif wajib `'use client'`. Data di-fetch di `useEffect`.

## 8. Secrets & Env

- Anon key dibaca dari env, BUKAN hardcode. `.env.local` sudah di-gitignore.
- Template: `.env.local.example`. Jangan commit `.env.local`.
- URL Supabase saat ini: `https://tbmdjqnshyogunoisrn.supabase.co`.

## 9. Commit Identity (WAJIB)

Semua commit di-author dengan identitas GitHub pemilik:

```
git -c user.name="𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟" \
    -c user.email="42990222+hernanda-git@users.noreply.github.com" \
    commit -m "…"
```

Atau set repo-local:

```bash
git config user.name "𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟"
git config user.email "42990222+hernanda-git@users.noreply.github.com"
```

## 10. Verification Gate

Sebelum laporkan selesai: `npm run build` harus hijau, tidak ada secret ter-commit,
dan perubahan UI mengikuti `TASTE.md`.
