# Lessons Learned — Analytics & UMP 2026

## Implemented

- `components/AnalyticsTracker.js` records one visitor session per path per UTC day through the `record_page_visit` RPC.
- `components/ArticleReaderCount.js` increments and displays article readers once per browser session.
- `/admin` has a `Statistik` tab with a 30-day visitor bar chart and cumulative registered-member count.
- `app/ump/[slug]/page.js` provides 38 prerendered province pages from `lib/ump-data.js`.
- The main UMP table links to each province article.

## Image generation

- `OPENAI_API_KEY` wajib tersedia di runtime cron untuk membuat featured image. Key hanya digunakan server-side dan tidak boleh masuk ke client atau Git.

## Required production step

Run `agentic/supabase-setup.sql` in the production Supabase SQL editor or through the existing setup workflow. The appended analytics section creates `page_visits`, `article_reads`, and the security-definer RPCs. It must be applied before the public tracker can write or the admin dashboard can read metrics.

## Data boundary

The article dataset compares UMP 2025 with UMP 2026. It does not claim that UMP equals each district's UMK. The province pages explicitly explain that UMK has separate kabupaten/kota decisions.

## Verification

- `npm run build` passes.
- Next.js prerenders 38 `/ump/<province>` paths.
- `git diff --check` passes.
- Existing ESLint warnings remain for legacy `<img>` usage and the pre-existing admin effect dependency warning; they do not fail the build.
