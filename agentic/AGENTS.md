# AGENTS.md (agentic) — BekasiKerja.id

Versi alat-agnostik dari instruksi proyek. Untuk detail lihat [`CLAUDE.md`](./CLAUDE.md).

## Tujuan

Portal lowongan kerja Next.js 14 (App Router) + Supabase + Tailwind. Satu tabel `posts`
(`type: 'job' | 'news'`), branding di `site_settings` (id=1).

## Perintah

```bash
npm install && npm run build   # verifikasi wajib sebelum commit
npm run dev                    # lokal :3000
```

## Aturan wajib (untuk agen)

- **Commit identity:** `𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟` <`42990222+hernanda-git@users.noreply.github.com`>.
- **Build gate:** jangan laporkan selesai jika `npm run build` merah.
- **Secrets:** anon key dari env, `.env.local` di-gitignore, jangan commit.
- **Bahasa UI:** Bahasa Indonesia profesional; istilah teknis Inggris.
- **Desain:** ikuti `TASTE.md`.
- **Auth:** admin = **Supabase Auth** (`signInWithPassword`, guard `getUser`) + RLS
  (`is_admin()`, email whitelist). Bukan lagi `localStorage`. Member masih cosmetic.
  Skema + RLS: `agentic/supabase-setup.sql`.

## Map cepat

- `app/page.js` beranda (fetch posts + site_settings)
- `app/admin/page.js` dashboard CRUD + upload bucket `images`
- `app/nyosor/*` login admin (alias)
- `app/member/*` auth member cosmetic
- `lib/supabase.js` client env-based

## Verification checklist

- [ ] `npm run build` hijau.
- [ ] Tidak ada secret ter-commit.
- [ ] UI mengikuti `TASTE.md`.
- [ ] Commit diauthor dengan identitas pemilik.
