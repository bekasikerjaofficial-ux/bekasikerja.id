---
name: bekasikerja-dev
description: Use when working on the BekasiKerja.id Next.js + Supabase portal repo — clone, install, configure env, run, build, and commit with the owner's GitHub identity. Covers the agentic docs layout under agentic/.
---

# SKILL: BekasiKerja.id Development (Agentic)

Operasional untuk agen yang mengembangkan repo **BekasiKerja.id** pada sesi baru.

## Trigger

Gunakan skill ini saat diminta: clone/setup, jalankan, build, perbaiki bug, atau
tambah fitur pada repo `bekasikerja.id` (Next.js 14 + Supabase + Tailwind).

## Hard rules

1. **Commit identity** (selalu):
   ```
   git -c user.name="𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟" \
       -c user.email="42990222+hernanda-git@users.noreply.github.com" commit -m "..."
   ```
2. **Build gate**: laporkan selesai hanya jika `npm run build` hijau.
3. **Secrets**: anon key = env. `.env.local` di-gitignore. Jangan pernah commit.
4. **Bahasa UI**: Bahasa Indonesia profesional; istilah teknis Inggris.
5. **Desain**: patuhi `agentic/TASTE.md`.

## Runbook

### 1. Clone (jika belum ada)
```bash
git clone https://github.com/bekasikerjaofficial-ux/bekasikerja.id.git
cd bekasikerja.id
```

### 2. Branch
```bash
git checkout -b dev        # atau nama fitur dari main
```

### 3. Install
```bash
npm install
```

### 4. Env
```bash
cp .env.local.example .env.local
# edit .env.local -> NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key asli>
```
> URL sudah terisi template: `https://tbmdjqnshyogunoisrn.supabase.co`

### 5. Run / Build / Verify
```bash
npm run dev            # http://localhost:3000
npm run build          # WAJIB hijau
npm run start          # produksi lokal
```

### 6. Schema (bila perlu buat di Supabase)
- `posts`: id int8 PK, type text('job'|'news'), title, company, location, category,
  deadline, image_url, content, created_at timestamptz default now().
- `site_settings`: id int8 (baris 1), brand_name, logo_url, badge_text, hero_title,
  hero_subtitle.
- Storage bucket `images` → Public.

### 7. Commit
```bash
git add -A
git -c user.name="𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟" \
    -c user.email="42990222+hernanda-git@users.noreply.github.com" \
    commit -m "feat: …"
git push -u origin <branch>
```

## Doc layout (folder `agentic/`)

- `SKILL.md` (ini) — runbook operasional.
- `CLAUDE.md` — konteks proyek untuk Claude Code.
- `AGENTS.md` — instruksi alat-agnostik.
- `TASTE.md` — panduan desain UI.
- `README.md` — index dokumentasi agentic.

Root `AGENTS.md` merujuk ke folder ini.

## Pitfalls

- `app/tests/page.js` ada di `app/tests/`, jadi import Supabase = `../../lib/supabase`.
- `/admin` hanya membaca `bk_admin_auth`; pastikan login admin menulis key yang sama.
- Jangan hardcode anon key (regresi lama: `'eyJhbG...sInR...'` placeholder mati).
- Build butuh `node_modules`; jalankan `npm install` dulu di environment fresh.
