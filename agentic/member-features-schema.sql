-- ============================================================
-- BekasiKerja.id — Schema Additions for Member Features
-- CV Builder, Psikotes Engine, Member Dashboard
-- ============================================================

-- 1) CV TEMPLATES
create table if not exists public.cv_templates (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2) MEMBER CVs
create table if not exists public.member_cvs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_slug text not null default 'minimal',
  full_name text,
  email text,
  phone text,
  address text,
  summary text,
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  languages jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) PSIKOTES QUESTIONS
create table if not exists public.psikotes_questions (
  id bigint generated always as identity primary key,
  module_slug text not null,
  question_text text not null,
  question_type text not null default 'multiple_choice',
  options jsonb default '[]'::jsonb,
  correct_answer text,
  explanation text,
  difficulty text not null default 'medium',
  time_limit_seconds integer default 60,
  sort_order integer default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4) PSIKOTES RESULTS
create table if not exists public.psikotes_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  module_slug text not null,
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  time_spent_seconds integer,
  answers jsonb default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

-- 5) MEMBER PROFILES
create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  birth_date date,
  avatar_url text,
  bio text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- CV Templates: public read
alter table public.cv_templates enable row level security;
drop policy if exists "cv_templates_public_read" on public.cv_templates;
create policy "cv_templates_public_read" on public.cv_templates for select using (true);

-- Member CVs: owner CRUD
alter table public.member_cvs enable row level security;
drop policy if exists "member_cvs_owner_all" on public.member_cvs;
create policy "member_cvs_owner_all" on public.member_cvs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Psikotes Questions: public read
alter table public.psikotes_questions enable row level security;
drop policy if exists "psikotes_questions_public_read" on public.psikotes_questions;
create policy "psikotes_questions_public_read" on public.psikotes_questions for select using (true);

-- Psikotes Results: owner CRUD
alter table public.psikotes_results enable row level security;
drop policy if exists "psikotes_results_owner_all" on public.psikotes_results;
create policy "psikotes_results_owner_all" on public.psikotes_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Member Profiles: owner CRUD
alter table public.member_profiles enable row level security;
drop policy if exists "member_profiles_owner_all" on public.member_profiles;
create policy "member_profiles_owner_all" on public.member_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- CV Templates
insert into public.cv_templates (slug, name, description, sort_order) values
  ('minimal', 'Minimal', 'Desain bersih dan profesional, ATS-friendly', 1),
  ('modern', 'Modern', 'Tampilan kontemporer dengan aksen warna', 2),
  ('professional', 'Professional', 'Format klasik untuk perusahaan korporat', 3)
on conflict (slug) do nothing;

-- Psikotes Questions: Matematika Dasar
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('math_basic', 'Hasil dari 15 + 27 - 8 = ...', 'multiple_choice', '["32", "34", "36", "38"]', '34', 'easy', 45, 1),
  ('math_basic', 'Jika 3x + 7 = 22, maka x = ...', 'multiple_choice', '["3", "4", "5", "6"]', '5', 'easy', 60, 2),
  ('math_basic', '15% dari 200 adalah ...', 'multiple_choice', '["25", "30", "35", "40"]', '30', 'easy', 45, 3),
  ('math_basic', 'Hasil dari 144 : 12 + 5 = ...', 'multiple_choice', '["15", "16", "17", "18"]', '17', 'easy', 45, 4),
  ('math_basic', 'Sebuah pabrik memproduksi 240 barang dalam 8 jam. Berapa barang per jam?', 'multiple_choice', '["25", "28", "30", "32"]', '30', 'medium', 60, 5),
  ('math_basic', 'Jika harga 12 buah Rp 18.000, berapa harga 20 buah?', 'multiple_choice', 'Rp 28.000, Rp 30.000, Rp 32.000, Rp 35.000', 'Rp 30.000', 'medium', 60, 6),
  ('math_basic', 'Hasil dari 2³ + 3² = ...', 'multiple_choice', '["15", "16", "17", "18"]', '17', 'medium', 45, 7),
  ('math_basic', 'Seorang pekerja mendapat gaji Rp 3.500.000 per bulan. 25% untuk makanan, 35% untuk sewa, sisanya ditabung. Berapa tabungan?', 'multiple_choice', 'Rp 1.200.000, Rp 1.300.000, Rp 1.400.000, Rp 1.500.000', 'Rp 1.400.000', 'hard', 90, 8),
  ('math_basic', 'Jarak kota A ke B 180 km. Mobil berangkat pukul 08.00 dengan kecepatan 60 km/jam. Pukul berapa sampai?', 'multiple_choice', '["10.00", "10.30", "11.00", "11.30"]', '11.00', 'medium', 60, 9),
  ('math_basic', 'Hasil dari 1/2 + 1/3 + 1/6 = ...', 'multiple_choice', '["1", "2/3", "5/6", "3/4"]', '1', 'medium', 60, 10)
on conflict do nothing;

-- Psikotes Questions: Logika Dasar
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('logic_basic', 'Lanjutkan deret: 2, 4, 8, 16, ...', 'multiple_choice', '["24", "28", "30", "32"]', '32', 'easy', 45, 1),
  ('logic_basic', 'Lanjutkan deret: 1, 1, 2, 3, 5, 8, ...', 'multiple_choice', '["10", "11", "12", "13"]', '13', 'easy', 45, 2),
  ('logic_basic', 'Jika semua A adalah B, dan semua B adalah C, maka...', 'multiple_choice', '["Semua A adalah C", "Semua C adalah A", "Beberapa A bukan C", "Tidak ada hubungan"]', 'Semua A adalah C', 'easy', 60, 3),
  ('logic_basic', 'Lanjutkan deret: 3, 6, 12, 24, ...', 'multiple_choice', '["36", "42", "48", "54"]', '48', 'easy', 45, 4),
  ('logic_basic', 'Mana yang berbeda: Apel, Pisang, Wortel, Mangga', 'multiple_choice', '["Apel", "Pisang", "Wortel", "Mangga"]', 'Wortel', 'easy', 30, 5),
  ('logic_basic', 'Jika kemarin adalah hari Senin, maka 3 hari lagi adalah hari...', 'multiple_choice', '["Rabu", "Kamis", "Jumat", "Sabtu"]', 'Kamis', 'easy', 30, 6),
  ('logic_basic', 'Lanjutkan deret: 1, 4, 9, 16, 25, ...', 'multiple_choice', '["30", "35", "36", "49"]', '36', 'medium', 45, 7),
  ('logic_basic', 'Jika A = 1, B = 2, C = 3, maka CAB = ...', 'multiple_choice', '["312", "321", "123", "132"]', '312', 'medium', 45, 8),
  ('logic_basic', 'Lanjutkan deret: 2, 6, 14, 30, ...', 'multiple_choice', ['54', '58', '62', '66'], '62', 'hard', 60, 9),
  ('logic_basic', 'Jika 5 orang dapat menyelesaikan pekerjaan dalam 10 hari, berapa hari jika 10 orang?', 'multiple_choice', '["3", "4", "5", "6"]', '5', 'medium', 60, 10)
on conflict do nothing;

-- Psikotes Questions: Ketelitian
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('ketelitian', 'Mana yang sama: 123456789 vs 123456789', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 1),
  ('ketelitian', 'Mana yang sama: ABCDEFGHIJ vs ABCDEFGHIJ', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 2),
  ('ketelitian', 'Mana yang sama: 9876543210 vs 9876543210', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 3),
  ('ketelitian', 'Mana yang sama: 123456789 vs 123456788', 'multiple_choice', '["Sama", "Beda"]', 'Beda', 'easy', 20, 4),
  ('ketelitian', 'Mana yang sama: KJHGTRFD vs KJHGTRFD', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 5),
  ('ketelitian', 'Mana yang sama: 5823471906 vs 5823471906', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 6),
  ('ketelitian', 'Mana yang sama: PLMOKNIJBUH vs PLMOKNIJBUH', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 7),
  ('ketelitian', 'Mana yang sama: 1357924680 vs 1357924681', 'multiple_choice', '["Sama", "Beda"]', 'Beda', 'medium', 20, 8),
  ('ketelitian', 'Mana yang sama: QWERTYUIOP vs QWERTYUJOP', 'multiple_choice', '["Sama", "Beda"]', 'Beda', 'medium', 20, 9),
  ('ketelitian', 'Mana yang sama: 2468013579 vs 2468013579', 'multiple_choice', '["Sama", "Beda"]', 'Sama', 'easy', 20, 10)
on conflict do nothing;

-- Psikotes Questions: Psikotes Umum
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('psikotes', 'Saya lebih suka bekerja dalam tim daripada sendiri.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 1),
  ('psikotes', 'Saya merasa nyaman dengan deadline yang ketat.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 2),
  ('psikotes', 'Saya lebih suka rutinitas daripada perubahan.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 3),
  ('psikotes', 'Saya senang mempelajari hal-hal baru.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 4),
  ('psikotes', 'Saya lebih suka memimpin daripada mengikuti.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 5),
  ('psikotes', 'Saya tetap tenang dalam situasi tekanan.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 6),
  ('psikotes', 'Saya lebih suka pekerjaan detail dan teliti.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 7),
  ('psikotes', 'Saya mudah beradaptasi dengan lingkungan baru.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 8),
  ('psikotes', 'Saya lebih suka instruksi yang jelas daripada kebebasan.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 9),
  ('psikotes', 'Saya merasa puas ketika membantu rekan kerja.', 'multiple_choice', '["Sangat Setuju", "Setuju", "Netral", "Tidak Setuju", "Sangat Tidak Setuju"]', NULL, 'easy', 30, 10)
on conflict do nothing;

-- Psikotes Questions: English Test
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('english_test', 'She ... to work every day.', 'multiple_choice', '["go", "goes", "going", "gone"]', 'goes', 'easy', 30, 1),
  ('english_test', 'The report ... written by the manager yesterday.', 'multiple_choice', '["is", "was", "were", "are"]', 'was', 'medium', 45, 2),
  ('english_test', 'I have been working here ... 2019.', 'multiple_choice', '["for", "since", "from", "during"]', 'since', 'medium', 30, 3),
  ('english_test', 'If I ... you, I would accept the offer.', 'multiple_choice', '["am", "was", "were", "be"]', 'were', 'hard', 45, 4),
  ('english_test', 'The meeting has been postponed ... next week.', 'multiple_choice', '["to", "for", "until", "by"]', 'until', 'medium', 30, 5),
  ('english_test', 'Please ... the documents before the deadline.', 'multiple_choice', '["submit", "submits", "submitting", "submitted"]', 'submit', 'easy', 30, 6),
  ('english_test', 'He is responsible ... the project.', 'multiple_choice', '["for", "to", "with", "at"]', 'for', 'medium', 30, 7),
  ('english_test', 'The company ... its production by 20%.', 'multiple_choice', '["increase", "increases", "increased", "increasing"]', 'increased', 'medium', 30, 8),
  ('english_test', 'We need to ... the schedule.', 'multiple_choice', '["final", "finalize", "finally", "finality"]', 'finalize', 'medium', 30, 9),
  ('english_test', 'The manager asked me ... late.', 'multiple_choice', '["don''t be", "not to be", "to not be", "not being"]', 'not to be', 'hard', 45, 10)
on conflict do nothing;

-- Psikotes Questions: Case Study
insert into public.psikotes_questions (module_slug, question_text, question_type, options, correct_answer, difficulty, time_limit_seconds, sort_order) values
  ('case_study', 'Sebuah pabrik mengalami penurunan produktivitas 20%. Langkah pertama yang sebaiknya dilakukan adalah...', 'multiple_choice', '["Memecat karyawan", "Menganalisis penyebab", "Menambah mesin", "Menaikkan target"]', 'Menganalisis penyebab', 'medium', 90, 1),
  ('case_study', 'Jika Anda menjadi supervisor dan ada konflik antar karyawan, tindakan terbaik adalah...', 'multiple_choice', '["Membiarkan", "Memarahi keduanya", "Mendengarkan kedua pihak dan mediasi", "Melapor ke atasan"]', 'Mendengarkan kedua pihak dan mediasi', 'medium', 90, 2),
  ('case_study', 'Sebuah perusahaan ingin mengurangi biaya operasional tanpa mengurangi kualitas. Pendekatan terbaik adalah...', 'multiple_choice', '["Memotong gaji", "Efisiensi proses", "Mengurangi bahan baku", "Memecat karyawan"]', 'Efisiensi proses', 'medium', 90, 3),
  ('case_study', 'Ketika mendapat complain dari langganan, langkah pertama adalah...', 'multiple_choice', '["Mengabaikan", "Meminta maaf dan mendengarkan", "Menolak tanggung jawab", "Mengalihkan ke lain"]', 'Meminta maaf dan mendengarkan', 'easy', 60, 4),
  ('case_study', 'Tim Anda tidak mencapai target bulan ini. Sebagai leader, Anda akan...', 'multiple_choice', '["Menyalahkan tim", "Menganalisis penyebab dan membuat perbaikan", "Meminta tim bekerja lebih keras", "Mengganti anggota tim"]', 'Menganalisis penyebab dan membuat perbaikan', 'medium', 90, 5),
  ('case_study', 'Jika ada perubahan kebijakan mendadak dari manajemen, tindakan Anda sebagai supervisor adalah...', 'multiple_choice', '["Menolak perubahan", "Sosialisasikan ke tim dan beri pemahaman", "Membiarkan tim bingung", "Hanya ikuti tanpa bertanya"]', 'Sosialisasikan ke tim dan beri pemahaman', 'medium', 90, 6),
  ('case_study', 'Produksi terhambat karena mesin rusak. Prioritas tindakan adalah...', 'multiple_choice', '["Tunggu perbaikan", "Aktifkan mesin cadangan dan lapor maintenance", "Hentikan semua produksi", "Biarkan karyawan istirahat"]', 'Aktifkan mesin cadangan dan lapor maintenance', 'medium', 90, 7),
  ('case_study', 'Karyawan baru kurang kompeten. Tindakan terbaik...', 'multiple_choice', '["PHK", "Training dan mentoring", "Pindah ke divisi lain", "Biarkan belajar sendiri"]', 'Training dan mentoring', 'easy', 60, 8),
  ('case_study', 'Target produksi meningkat 50% dengan sumber daya sama. Strategi terbaik...', 'multiple_choice', '["Lembur terus-menerus", "Optimasi proses dan eliminasi pemborosan", "Menolak target", "Tambah karyawan baru"]', 'Optimasi proses dan eliminasi pemborosan', 'hard', 120, 9),
  ('case_study', 'Ada laporan safety violation di lantai pabrik. Tindakan segera...', 'multiple_choice', '["Abaikan", "Hentikan aktivitas dan investigasi", "Tulis laporannya saja", "Marahi pelapor"]', 'Hentikan aktivitas dan investigasi', 'medium', 60, 10)
on conflict do nothing;
