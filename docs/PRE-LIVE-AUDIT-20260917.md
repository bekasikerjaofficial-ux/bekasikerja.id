# Pre-Live Audit BekasiKerja.id — 17 September 2026

## Status

Audit ini membedakan `terbukti live`, `diperbaiki di source`, dan `belum dapat diuji`.
Build/CI hijau tidak dianggap sebagai bukti bahwa operasi production berhasil.

## Terbukti di production

- Domain dilayani Vercel.
- Sitemap berisi 47 URL; seluruh URL sitemap mengembalikan HTTP 200.
- Route tidak dikenal mengembalikan HTTP 404.
- Supabase public read berjalan setelah policy `posts_public_read` diperbaiki.
- `/tests` membaca 5 lowongan.
- Beranda menampilkan 3 lowongan dan 2 berita lama.
- API production lama masih mengembalikan error service-role/schema untuk sebagian endpoint.

## Temuan dan status

| Temuan | Status |
|---|---|
| URL Project/API hanya berbeda suffix `/rest/v1/` | Bukan masalah; client sudah menormalkan keduanya |
| Policy public read `posts` | Diperbaiki di Supabase; beranda sudah membaca data |
| Reset PKCE hanya membaca hash token | Diperbaiki di source; mendukung `?code=` dan `#access_token=` |
| Reset PKCE double exchange setelah auto-detect | Diperbaiki di source; cek session sebelum exchange |
| Verifikasi email tidak mendukung PKCE code | Diperbaiki di source |
| Open redirect melalui `//host` | Diperbaiki di source dengan `getSafeInternalPath` |
| Admin API mutation tanpa verifikasi admin | Diperbaiki di source dengan `requireAdmin`; wajib redeploy dan uji live |
| Legacy admin `setSubmitting` undefined | Diperbaiki di source |
| Guard admin tidak konsisten | Disamakan ke RPC `is_admin()` di source |
| Checkout tidak meneruskan bearer token | Diperbaiki di client dan API source |
| Checkout status membocorkan status berdasarkan order ID | Diperbaiki di source dengan bearer token + user ownership |
| Payment webhook menerima payload tanpa signature | Diperbaiki fail-closed di source |
| Tabel `categories`, `tags`, `post_tags` belum ada di production | Belum diperbaiki; perlu migration Supabase |
| Publisher write production | Belum terbukti; `SUPABASE_SERVICE_ROLE_KEY` belum tersedia |
| Tujuh posting contoh | Belum dihapus; workflow meminta 7 ID eksplisit dan service-role key |

## Publisher final

- UMP 2026: 38 provinsi, satu provinsi per invocation, tiga invocation per hari.
- Jadwal: 06:30, 11:30, 16:00 WIB.
- Mulai: 17 September 2026.
- Konten: UMP 2025, UMP 2026, nominal kenaikan rupiah, persentase kenaikan.
- UMP 2027: tiga invocation per hari mulai 1 Oktober 2026.
- Estimasi: 7,5% sampai 9,5% dari UMP 2026, diberi label belum resmi.
- Duplicate check ada di script, tetapi database belum memiliki unique idempotency constraint.
- Hermes publisher lama sudah dijeda.
- GitHub Actions workflow sudah tersedia, tetapi belum dapat berjalan tanpa secrets.

## Pengujian yang dijalankan

- `npm run build`: lulus.
- `git diff --check`: lulus.
- Route matrix production: lulus untuk route utama, sitemap, robots, dan 404.
- Publisher pre-start gate: lulus tanpa akses database.
- Uji API mutation tanpa login: deployment live masih menunjukkan kode/config lama; harus diulang setelah deployment terbaru aktif.
- CI GitHub: lulus pada perubahan sebelumnya; setiap perubahan berikutnya wajib menunggu CI baru.

## Blocker sebelum live penuh

1. Redeploy Vercel dari commit audit terbaru.
2. Verifikasi API mutation tanpa login harus menghasilkan 401/403.
3. Jalankan migration schema `categories`, `tags`, dan `post_tags` di Supabase production.
4. Tambahkan GitHub Actions secrets `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`.
5. Masukkan tujuh ID posting contoh ke workflow cleanup; workflow akan membaca kembali dan menghapus hanya ID tersebut.
6. Jalankan publisher UMP 2026 manual satu kali dan baca kembali row hasil insert.
7. Verifikasi judul, isi, kategori, row ID, dan URL artikel dari hasil insert.
8. Ulangi untuk jadwal 2027 menggunakan start date 1 Oktober.
9. Konfigurasi redirect URL production di Supabase Auth dan uji link email nyata.
10. Konfigurasi Custom SMTP sebelum mengandalkan reset password production.

## Kesimpulan

Website read-only dan tampilan posting lama sudah terbukti berjalan. Website belum boleh disebut
fully live untuk operasi admin, payment, cleanup, dan publisher sampai blocker di atas diuji
langsung di production.
