# Employer Dashboard — UAT Checklist

## Prasyarat

- Jalankan `agentic/supabase-setup.sql`.
- Jalankan `agentic/employer-schema.sql`.
- Jalankan `agentic/employer-phase2-3.sql`.
- Jalankan `agentic/employer-phase4.sql`.
- Pastikan email admin masuk whitelist `admin_emails()`.
- Buat satu akun candidate dan satu akun employer.
- Pastikan `npm run build` hijau.

## UAT-01 — Employer onboarding

1. Buka `/employer/register`.
2. Daftar akun perusahaan.
3. Verifikasi email jika Supabase mengaktifkan email confirmation.
4. Login kembali di `/employer/login`.
5. Lengkapi `/employer/onboarding`.
6. Pastikan dashboard employer terbuka.

Expected:

- Role employer dibuat di `user_roles`.
- Company dibuat di `companies`.
- User menjadi owner di `company_members`.
- Tidak ada akses ke company lain.

## UAT-02 — Profil dan verifikasi

1. Ubah data di `/employer/profile`.
2. Klik `Ajukan Verifikasi`.
3. Login sebagai admin.
4. Buka `/admin/employer-companies`.
5. Approve perusahaan.

Expected:

- Status berubah `unverified → pending → verified`.
- Badge verified hanya muncul setelah admin approve.
- Employer menerima notifikasi verifikasi.
- Reject menyimpan review status dan catatan.

## UAT-03 — Job workflow

1. Buat lowongan melalui `/employer/jobs/new`.
2. Simpan sebagai draft.
3. Pastikan draft tidak muncul di `/lowongan`.
4. Ajukan review.
5. Approve sebagai admin melalui `/admin/employers`.
6. Buka `/lowongan` dan detail lowongan.

Expected:

- Draft tersimpan sebagai `draft`.
- Review tersimpan sebagai `pending_review`.
- Hanya `active` yang tampil publik.
- Employer lain tidak dapat mengedit lowongan tersebut.

## UAT-04 — Candidate application

1. Login sebagai candidate.
2. Buka lowongan employer aktif.
3. Kirim lamaran.
4. Login sebagai employer.
5. Buka `/employer/applicants`.
6. Ubah status kandidat beberapa tahap.

Expected:

- Candidate hanya dapat melamar satu kali per lowongan.
- Employer melihat hanya applicant milik perusahaannya.
- Status history tersimpan.
- Internal note tidak terlihat oleh candidate.

## UAT-05 — Privacy dan candidate search

1. Login sebagai candidate.
2. Buka `/member/profile-visibility`.
3. Aktifkan pencarian profil.
4. Aktifkan izin contact request.
5. Login sebagai employer.
6. Cari kandidat di `/employer/candidates`.
7. Kirim contact request.
8. Login sebagai candidate dan terima/tolak request melalui endpoint/UI candidate.

Expected:

- Candidate yang tidak opt-in tidak muncul.
- Contact request ditolak jika `contact_consent=false`.
- Akses search tercatat di `candidate_access_logs`.
- Data sensitif tidak dikembalikan pada hasil search.

## UAT-06 — Statistik

1. Buka detail lowongan employer beberapa kali.
2. Pastikan view session yang sama tidak menggandakan view.
3. Buka `/employer/statistics`.

Expected:

- Views dihitung berdasarkan job dan session.
- Applicant counts sesuai database.
- Shortlisted, interview, passed, dan rejected sesuai status.

## UAT-07 — Paket dan manual payment

1. Buka `/employer/packages`.
2. Pilih Gratis, Basic, Pro, atau Premium.
3. Pastikan subscription dan invoice dibuat.
4. Login admin dan review pembayaran secara manual.

Expected:

- Candidate packages tidak tercampur dengan employer packages.
- Invoice memiliki nomor unik.
- Subscription berbayar berstatus `pending`/`manual_review`.
- Paket Gratis dapat aktif tanpa payment gateway.

## Security acceptance

- Candidate tidak dapat membuka API employer.
- Employer A tidak dapat membaca Company B.
- Employer A tidak dapat membaca applicant Employer B.
- Draft employer tidak tampil publik.
- Internal notes tidak dikirim ke candidate.
- Candidate tanpa consent tidak muncul dalam search.
- Service-role key tidak masuk client bundle.
- Admin action tercatat di `admin_actions`.
