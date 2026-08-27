# AGENTS.md — BekasiKerja.id

Panduan untuk **agen manapun** (Claude Code, Hermes, Codex, dll.) yang bekerja di repo ini.

> Dokumentasi agentic lengkap ada di folder **[`agentic/`](./agentic/)**. Baca
> [`agentic/README.md`](./agentic/README.md) sebagai pintu masuk, lalu
> [`agentic/CLAUDE.md`](./agentic/CLAUDE.md) (konteks proyek),
> [`agentic/TASTE.md`](./agentic/TASTE.md) (desain UI), dan
> [`agentic/SKILL.md`](./agentic/SKILL.md) (runbook langkah-demi-langkah).

## Aturan emas

1. **Identitas commit** — author semua commit dengan:
   - Name: `𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟`
   - Email: `42990222+hernanda-git@users.noreply.github.com`
2. **Verifikasi** — `npm run build` wajib hijau sebelum laporkan selesai.
3. **Rahasia** — anon key Supabase dari env (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), jangan
   hardcode. `.env.local` sudah di-gitignore; jangan commit.
4. **Bahasa** — teks UI dalam Bahasa Indonesia profesional; istilah teknis tetap Inggris.
5. **Desain** — ikuti `agentic/TASTE.md`.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # isi anon key asli
npm run dev                        # http://localhost:3000
```
