# 🤖 Dokumentasi Agentic — BekasiKerja.id

Folder ini berisi seluruh konteks yang dibutuhkan agen (Claude Code, Hermes, atau agen
mana pun) untuk bekerja di repo **BekasiKerja.id** pada **sesi yang benar-benar baru**,
tanpa harus menebak struktur, konvensi, atau identitas commit.

## 📚 Daftar File

| File                                             | Untuk siapa            | Isi singkat                                                              |
| ------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------ |
| [`SKILL.md`](./SKILL.md)                         | Hermes Agent           | Skill operasional: clone → install → env → run → build → commit.         |
| [`CLAUDE.md`](./CLAUDE.md)                       | Claude Code            | Instruksi proyek: stack, struktur, schema Supabase, auth, konvensi.      |
| [`AGENTS.md`](./AGENTS.md)                       | Agen generik           | Versi alat-agnostik dari CLAUDE.md + aturan commit identity.             |
| [`TASTE.md`](./TASTE.md)                         | Semua agen (UI)        | Panduan desain: palet warna, tipografi, radius, mikrokopi Bahasa Indonesia. |

Root [`/AGENTS.md`](./AGENTS.md) merujuk ke folder ini agar agen di sesi baru langsung
membaca dokumen yang tepat.

## 🧭 Cara pakai (untuk agen)

1. Baca `AGENTS.md` (root) → diarahkan ke sini.
2. Baca `CLAUDE.md` untuk pemahaman proyek.
3. Ikuti `TASTE.md` saat mengubah tampilan.
4. Gunakan `SKILL.md` sebagai runbook langkah-demi-langkah.
5. Setiap perubahan di-commit dengan identitas GitHub pemilik:
   - **Name:** `𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟`
   - **Email:** `42990222+hernanda-git@users.noreply.github.com`

## ✅ Prasyarat verifikasi

Sebelum melaporkan "selesai", agen wajib:

- [ ] `npm install` sukses.
- [ ] `npm run build` lolos (semua route ter-compile).
- [ ] Tidak ada rahasia (anon key) yang ke-commit; `.env.local` tetap ter-`gitignore`.
- [ ] Perubahan UI mengikuti `TASTE.md`.
- [ ] Commit diauthor dengan identitas di atas.
