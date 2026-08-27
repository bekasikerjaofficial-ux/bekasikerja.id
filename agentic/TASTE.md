# TASTE.md — Panduan Desain UI BekasiKerja.id

Standar visual agar agen menghasilkan UI yang konsisten dengan brand, tanpa harus
menebak. Berlaku untuk semua perubahan tampilan di `app/`.

## 🎨 Palet Warna (Tailwind)

| Peran            | Kelas Tailwind            | Hex (referensi)     | Pemakaian                              |
| ---------------- | ------------------------- | ------------------- | -------------------------------------- |
| Aksen utama      | `blue-900`                | `#1e3a8a`           | Header, tombol primer gelap, brand.    |
| Aksenaksi        | `blue-600`                | `#2563eb`           | CTA, link aktif, badge, slider dot.    |
| Aksen hover      | `blue-700` / `blue-800`   | —                   | Hover tombol biru.                      |
| Base / surface   | `slate-50` / `slate-100`  | `#f8fafc` / `#f1f5f9` | Background halaman, card.             |
| Text             | `slate-800` / `slate-900` | —                   | Teks body / heading.                   |
| Muted            | `slate-500` / `slate-600` | —                   | Caption, meta.                         |
| Border           | `slate-200`               | `#e2e8f0`           | Garis pemisah card/input.              |
| News / amber     | `amber-100` bg / `amber-800` text | —           | Label kategori news.                    |
| Sukses           | `emerald-100` / `emerald-800` | —              | Notifikasi berhasil.                    |
| Bahaya           | `rose-100` / `rose-600/700` | —                | Hapus, error, logout.                   |

> Latar hero banner & login admin gelap: `slate-900` / `slate-800` dengan teks `white` /
> `slate-100` dan aksen `blue-500`/`blue-600`.

## 🔤 Tipografi

- **Font:** `font-sans` (Tailwind default stack). Heading boleh `tracking-tight`.
- **Heading:** `font-extrabold` (`font-black` untuk logo mark "BK").
- **Body:** `text-xs` / `text-sm`. Meta & caption: `text-[10px]`/`text-[11px]`.
- **Weight:** bold untuk label (`font-bold`), extrabold untuk judul (`font-extrabold`).
- **Warna teks heading:** `text-slate-900`; sub: `text-slate-500`/`text-slate-600`.

## 📐 Bentuk & Elevasi

- **Radius:** card besar `rounded-2xl`; input & tombol `rounded-xl`; pill/badge `rounded-full`.
- **Shadow:** `shadow-sm` (card) / `shadow` (hover) / `shadow-xl` (hero slider).
- **Border:** `border border-slate-200` konsisten di card & input.
- **Hover:** `hover:border-blue-300` (card), `hover:bg-blue-700` (tombol biru),
  `transition` singkat.

## 🧩 Pola Layout

- Container: `max-w-6xl` (header) / `max-w-5xl` (konten) / `max-w-3xl` (form).
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`.
- Header sticky: `sticky top-0 z-50 bg-white border-b`.
- Spacing section: `py-12 space-y-12` di `<main>`.
- Scroll anchor: `scroll-mt-20` pada section ber-id.

## ✍️ Mikrokopi (Bahasa Indonesia)

- Judul section: "💼 Lowongan Kerja Terbaru", "📰 Lifestyle & Tips Karir".
- Tombol: "Daftar Akun Gratis", "Masuk", "Publish Postingan", "Simpan Pengaturan Situs".
- Sukses: "🎉 Berhasil Mendaftar! Mengalihkan ke Halaman Utama…".
- Error: "Password akses admin tidak valid!", "Gagal upload file…".
- Istilah teknis tetap Inggris: Next.js, Supabase, localStorage, bucket, URL.

## 🖼 Aset & Gambar

- Placeholder Unsplash untuk job/news bila `image_url` kosong.
- Upload logo PT ke Supabase Storage bucket `images` (Public), pakai `getPublicUrl`.
- Ikon: emoji ringan (💼 📰 📍 🎉) — hindari dependensi icon library ekstra.

## 🚫 Jangan

- Jangan pakai warna di luar palet di atas tanpa alasan.
- Jangan ubah `font-sans` ke font custom tanpa dijelaskan.
- Jangan hapus `scroll-mt-20` pada section yang di-link dari nav.
- Jangan perkecil radius secara drastis (tetap `rounded-2xl`/`rounded-xl`).
