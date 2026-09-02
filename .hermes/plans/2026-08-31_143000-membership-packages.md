# BekasiKerja.id — Membership & Psikotes Packages Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.
> Scaffold portion is already executed (see "Scaffold status" at bottom). This plan
> documents the full model + remaining build tasks.

**Goal:** Add a tiered membership + psikotes-package product layer on top of the existing
job-board (bekasikerja.id), per the concept doc `website bekasikerja.docx`, so members can
pick Gratis / Hemat / Sultan / Have packages and unlock psikotes test modules accordingly.

**Architecture:** Extend the existing Next.js 14 App Router + Supabase stack. New `packages`
table (admin-managed, no seed) defines the 4 tiers + their feature lists; a `memberships`
table records each member's entitlement (user ↔ package). A `has_package()` SQL helper drives
gating. Psikotes modules are gated server/client-side by the member's highest active package.
Payment is DEFERRED (manual/admin fulfillment for now; Midtrans/Xendit webhook later).

**Tech Stack:** Next.js 14 (App Router, JS), React 18, Tailwind 3.3, `@supabase/supabase-js` 2.39,
lucide-react icons. Design tokens per `agentic/TASTE.md` (BCA blue #005cab, Open Sans, no emoji in UI).

---

## 0. Concept doc ↔ model mapping (source of truth)

From `website bekasikerja.docx`:
- Member **Gratis**: lihat lowongan + bikin CV gratis.
- Member **Hemat** (25rb): CV gratis + Matematika Dasar + Tes Logika Dasar (Deret angka, Pola gambar).
- Member **Sultan** (3500): Hemat + Ketelitian + Psikotes.
- Member **Have**: Sultan + tes lainnya (English test, Case study, dll).

Homepage structure: "4 Slider + Grid Loker + 4 Paket CTA Psikotes".

### OPEN QUESTION — price inconsistency (must confirm with user)
Concept price `Sultan : 3500` is LOWER than `Hemat : 25rb (25.000)`. Almost certainly a typo
(missing "rb" → 350.000, or meant 3.500rb). Scaffold stores prices as editable DB fields
(defaults: Gratis 0, Hemat 25000, Sultan 350000, Have 750000) — **confirm real prices before launch.**
`Have` price/period unspecified — treat as configurable; default 750000/bulan.

### Psikotes module → package gate
| Module | slug | Hemat | Sultan | Have |
|---|---|---|---|---|
| Matematika Dasar | `math_basic` | ✓ | ✓ | ✓ |
| Tes Logika Dasar (Deret/Pola) | `logic_basic` | ✓ | ✓ | ✓ |
| Ketelitian | `ketelitian` | ✗ | ✓ | ✓ |
| Psikotes Umum | `psikotes` | ✗ | ✓ | ✓ |
| English Test | `english_test` | ✗ | ✗ | ✓ |
| Case Study | `case_study` | ✗ | ✗ | ✓ |
Gratis = no psikotes modules (loker + CV only).

---

## 1. Supabase schema (append to `agentic/supabase-setup.sql`)

Idempotent, RLS + admin-fn only, **NO seed INSERTs** (per project rule: data via /admin).

```sql
-- 4) TABEL packages (konfigurasi paket, dikelola admin)
create table if not exists public.packages (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  price       integer not null default 0,        -- 0 = gratis
  period      text not null default 'bulan',
  tagline     text,
  description text,
  features    jsonb not null default '[]'::jsonb, -- [{text, included}]
  popular     boolean not null default false,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 5) TABEL memberships (entitlement member -> paket)
create table if not exists public.memberships (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  bigint not null references public.packages(id) on delete cascade,
  status      text not null default 'active' check (status in ('active','expired','cancelled')),
  started_at  timestamptz not null default now(),
  expires_at  timestamptz,
  unique (user_id, package_id)
);

-- helper: apakah user punya package aktif by slug?
create or replace function public.has_package(p_user uuid, p_slug text)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.memberships m
    join public.packages p on p.id = m.package_id
    where m.user_id = p_user and p.slug = p_slug and m.status = 'active'
      and (m.expires_at is null or m.expires_at > now())
  );
$$;

-- RLS: packages publik baca, admin tulis
alter table public.packages enable row level security;
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read" on public.packages for select using (true);
drop policy if exists "packages_admin_write" on public.packages;
create policy "packages_admin_write" on public.packages
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS: memberships — user baca miliknya, admin tulis semua
alter table public.memberships enable row level security;
drop policy if exists "memberships_owner_read" on public.memberships;
create policy "memberships_owner_read" on public.memberships
  for select using (auth.uid() = user_id);
drop policy if exists "memberships_admin_write" on public.memberships;
create policy "memberships_admin_write" on public.memberships
  for all using (public.is_admin()) with check (public.is_admin());
```

Files: Modify `agentic/supabase-setup.sql` (append sections 4–5).

---

## 2. UI components

### Task A: `components/PackageCard.js`
Presentational card. Props: `pkg` ({name, price, period, tagline, features[], popular, slug}).
Renders: name, price (Rp formatted; "Gratis" if 0), period, tagline, feature list with
CheckCircle2 / X icons by `included`, CTA button linking to `/paket?p=slug` or `/member/register`.
Follow TASTE.md: tokens only, `brand-blue`, rounded-lg, lucide icons, no emoji.

### Task B: `components/PackageCTA.js`
Homepage section ("4 Paket CTA Psikotes"): heading + `.package-grid` of 4 `PackageCard`.
`'use client'`, fetches `packages` (order sort_order) via supabase; shows skeleton/empty state
if unconfigured. Falls back to static 4-tier config constant if `packages` empty (so homepage
always renders the CTA even before admin enters data).

---

## 3. Routes

### Task C: `app/paket/page.js`
Full packages page: hero strip + `PackageCTA` grid + FAQ ringkas (apa bedanya tiap paket).
`'use client'`, fetch packages from DB. Used as nav target "Paket".

### Task D: `app/psikotes/page.js`
Test catalog gated by tier. `'use client'`: get `supabase.auth.getUser()`; if member, read
`memberships` to compute highest tier; render module grid (math_basic, logic_basic, ketelitian,
psikotes, english_test, case_study) with lock/unlock state per gate table above. Locked modules
show "Pilih Paket Sultan/Have" CTA. Anonymous → prompt login/register. (Test *engine* is later phase.)

### Task E: `app/admin/paket/page.js`
Package CRUD mirroring `app/admin/page.js` (posts): list packages, add/edit (name, slug, price,
period, tagline, description, features JSON textarea, popular, sort_order, active), delete.
Admin guard `getUser()` + `is_admin()` client check. Uploads none.

---

## 4. Integration

### Task F: `components/SiteHeader.js` — add "Paket" nav link
Add `<a href="/paket">Paket</a>` between Lowongan & Lifestyle.

### Task G: `app/page.js` — insert `<PackageCTA />`
Place after FeaturedSlider, before split content (matches "4 Slider + Grid Loker + 4 Paket CTA").

### Task H: `app/globals.css` — package styles
Add `.package-grid` (responsive 4→2→1), `.pkg-card`, `.pkg-card.popular`, `.pkg-price`,
`.pkg-feature`, `.pkg-cta`. Use tokens (--hl-blue, --hl-blue-grad, --gray-*).

---

## 5. Verification (build gate)
- `npm install` (deps present; offline-safe).
- `npm run build` MUST be green (Next prerender; supabase client no-ops if env absent).
- Manual: `npm run dev` → `/paket` shows 4 cards; `/psikotes` shows gated modules;
  `/admin/paket` CRUD works with admin session.
- No secret committed; UI follows TASTE.md (no emoji, BCA tokens).
- Commit with identity `𝕧𝕒𝕝𝕒𝕣𝕚𝕠𝕟` <42990222+hernanda-git@users.noreply.github.com>.

---

## 6. Risks / tradeoffs / deferred
- **Payment**: no gateway yet — `memberships` populated manually by admin (or later webhook).
  "Beli" buttons are placeholders linking to register/admin for now.
- **Prices**: Sultan 3500 vs Hemat 25rb inconsistency — DB-editable, confirm before launch.
- **Test engine**: only catalog + gating scaffolded; actual Kraepelin/TIU question banks = later.
- **Member auth**: real Supabase Auth already wired in `/member/*` (not localStorage) — good.
- **Seed rule**: packages NOT seeded (admin-entered), per project convention.

---

## Scaffold status (executed 2026-08-31)
DONE: Task A (PackageCard), B (PackageCTA), C (app/paket), D (app/psikotes), E (admin/paket),
F (header nav), G (homepage section), H (globals.css), schema append. `npm run build` verified green.

### Payment (Midtrans QRIS, auto-activation) — DONE 2026-08-31
- Provider: **Midtrans QRIS** (`lib/midtrans.js`, server-only).
- `app/api/checkout/route.js` — buat charge QRIS, simpan `membership_orders` (pending).
- `app/api/payment-webhook/route.js` — terima notif Midtrans; bila settlement/capture →
  `upsert` `memberships` (active, expires +3 bulan) otomatis. Signature diverifkasi.
- `app/api/checkout/status/route.js` — poll fallback (client cek tiap 4s).
- `app/checkout/page.js` — scan QRIS, auto-aktif setelah transfer.
- `membership_orders` table + RLS ditambah ke `agentic/supabase-setup.sql`.
- `.env.local.example` — `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`,
  `MIDTRANS_IS_PRODUCTION`, `SUPABASE_SERVICE_ROLE_KEY`.

### KONFIRMASI HARGA (owner) — 2026-08-31
Gratis 0, **Hemat 25.000**, **Sultan 35.000**, **Have 50.000** — **per 3 bulan**.

REMAINING: apply SQL ke Supabase, isi env (Midtrans sandbox keys), input paket via /admin/paket,
test end-to-end dengan sandbox, psikotes question banks (engine soal).
