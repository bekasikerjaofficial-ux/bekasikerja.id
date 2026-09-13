-- =============================================
-- BEKASIKERJA.ID — Setup Psikotes & Member Tables
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tbmdojqnshyogunoisrn/sql/new
-- =============================================

-- 1. Tabel Soal Psikotes
CREATE TABLE IF NOT EXISTS psikotes_questions (
  id BIGSERIAL PRIMARY KEY,
  module_slug TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Hasil Tes
CREATE TABLE IF NOT EXISTS psikotes_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  module_slug TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  answers JSONB,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Profil Member
CREATE TABLE IF NOT EXISTS member_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  bio TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel CV Member
CREATE TABLE IF NOT EXISTS member_cvs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  template_slug TEXT DEFAULT 'minimal',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  summary TEXT,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Kategori & Tags
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- SEED SOAL (ORIGINAL — bukan copy dari sumber lain)
-- =============================================

-- Matematika Dasar (5 soal)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('math_basic', 'Hasil dari 15% dari 200 adalah...', '["20", "25", "30", "35"]', '30', 1),
  ('math_basic', 'Jika 3x + 7 = 22, maka x adalah...', '["3", "4", "5", "6"]', '5', 2),
  ('math_basic', 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Luasnya adalah...', '["80 cm²", "96 cm²", "100 cm²", "72 cm²"]', '96 cm²', 3),
  ('math_basic', 'Jika harga 5 barang adalah Rp 75.000, berapa harga 12 barang?', '["Rp 150.000", "Rp 180.000", "Rp 200.000", "Rp 225.000"]', 'Rp 180.000', 4),
  ('math_basic', 'Hasil dari 3/4 + 1/2 adalah...', '["1", "5/4", "4/6", "3/2"]', '5/4', 5);

-- Logika Dasar (5 soal)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('logic_basic', 'Pola deret: 2, 4, 8, 16, ... Berikutnya adalah...', '["24", "32", "18", "20"]', '32', 1),
  ('logic_basic', 'Pola deret: 1, 4, 9, 16, 25, ... Berikutnya adalah...', '["30", "36", "49", "64"]', '36', 2),
  ('logic_basic', 'Pola deret: A, C, E, G, ... Berikutnya adalah...', '["H", "I", "J", "K"]', 'I', 3),
  ('logic_basic', 'Jika hari ini hari Senin, maka 100 hari lagi adalah hari...', '["Senin", "Selasa", "Rabu", "Kamis"]', 'Rabu', 4),
  ('logic_basic', 'Semua A adalah B. Semua B adalah C. Kesimpulan yang benar adalah...', '["Semua A adalah C", "Semua C adalah A", "Tidak bisa disimpulkan", "Sebagian A bukan C"]', 'Semua A adalah C', 5);

-- Ketelitian (5 soal)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('ketelitian', 'Angka mana yang berbeda dari yang lain? 444, 464, 474, 484, 494', '["444", "464", "474", "484"]', '444', 1),
  ('ketelitian', 'Huruf mana yang berbeda dari yang lain? a, c, e, g, i, k, m, o', '["a", "o", "m", "e"]', 'o', 2),
  ('ketelitian', 'Perhatikan angka ini: 714737927374. Berapa jumlah angka 7?', '["3", "4", "5", "6"]', '4', 3),
  ('ketelitian', 'Kata mana yang berbeda? APPLY, APTLY, APRICOT, APPLE', '["APPLY", "APTLY", "APRICOT", "APPLE"]', 'APRICOT', 4),
  ('ketelitian', 'Jika A=1, B=2, C=3, maka CAB sama dengan...', '["312", "123", "213", "321"]', '312', 5);

-- English Test (5 soal)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('english_test', 'Choose the correct sentence:', '["He go to school", "He goes to school", "He going to school", "He gone to school"]', 'He goes to school', 1),
  ('english_test', 'The opposite of "happy" is...', '["sad", "angry", "tired", "busy"]', 'sad', 2),
  ('english_test', 'Please ... the door when you leave.', '["closing", "close", "closed", "closes"]', 'close', 3),
  ('english_test', 'She ... working here since 2020.', '["is", "was", "has been", "will be"]', 'has been', 4),
  ('english_test', 'What does "colleague" mean?', '["Teman keluarga", "Rekan kerja", "Tetangga", "Atasan"]', 'Rekan kerja', 5);

-- Case Study (5 soal)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('case_study', 'Perusahaan turun penjualan 30%. Langkah pertama yang harus dilakukan manajer adalah...', '["PHK karyawan", "Analisis penyebab", "Naikkan harga", "Tutup cabang"]', 'Analisis penyebab', 1),
  ('case_study', 'Dua anggota tim sedang berkonflik. Kamu sebagai pemimpin akan...', '["Memindah salah satu", "Mediasi terlebih dahulu", "Biarkan selesaikan sendiri", "Melapor ke atasan"]', 'Mediasi terlebih dahulu', 2),
  ('case_study', 'Klien meminta proyek selesai 1 minggu lebih cepat. Tim sudah overload. Tindakan terbaik:', '["Memaksa lembur", "Negosiasi deadline", "Menolak langsung", "Mencari vendor luar"]', 'Negosiasi deadline', 3),
  ('case_study', 'Anggaran perusahaan dipotong 20%. Langkah paling tepat adalah...', '["Memotong semua anggaran tim", "Memprioritaskan proyek penting", "Menunda semua proyek", "Meminta tambahan anggaran"]', 'Memprioritaskan proyek penting', 4),
  ('case_study', 'Karyawan terbaik mengundurkan diri karena ingin gaji lebih. Perusahaan tidak bisa menaikkan. Kamu...', '["Membiarkan pergi", "Menawarkan benefit lain", "Mencari pengganti baru", "Menunda pengumuman"]', 'Menawarkan benefit lain', 5);

-- Psikotes Umum (5 soal — subjektif, tidak ada jawaban benar/salah)
INSERT INTO psikotes_questions (module_slug, question_text, options, correct_answer, sort_order) VALUES
  ('psikotes', 'Saya lebih suka bekerja...', '["Sendirian dengan fokus tinggi", "Dalam tim yang ramai", "Bergantian sesuai kebutuhan", "Tergantung situasi dan mood"]', NULL, 1),
  ('psikotes', 'Kamu mendapat tugas sulit dengan deadline dekat. Kamu akan...', '["Panik dulu sebentar", "Langsung eksekusi tanpa rencana", "Membuat rencana terlebih dahulu", "Meminta bantuan kepada rekan"]', NULL, 2),
  ('psikotes', 'Rekan kerja melakukan kesalahan. Kamu akan...', '["Diam saja", "Langsung memberitahu di depan umum", "Melaporkan ke atasan", "Membantu memperbaiki terlebih dahulu"]', NULL, 3),
  ('psikotes', 'Yang paling penting dalam pekerjaan bagiku adalah...', '["Gaji tinggi", "Pengembangan diri", "Relasi dengan rekan", "Stabilitas kerja"]', NULL, 4),
  ('psikotes', 'Aku merasa paling puas ketika...', '["Target individu tercapai", "Diapresiasi oleh atasan", "Tugas selesai dengan baik", "Tim berhasil mencapai goal bersama"]', NULL, 5);

-- Kategori & Tags default
INSERT INTO categories (name, slug, description) VALUES
  ('Manufaktur', 'manufaktur', 'Lowongan kerja sektor manufaktur'),
  ('Admin', 'admin', 'Lowongan kerja administrasi'),
  ('Engineering', 'engineering', 'Lowongan kerja teknik & engineering'),
  ('Tips Karir', 'tips-karir', 'Artikel tips dan pengembangan karir')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (name, slug) VALUES
  ('Full Time', 'full-time'),
  ('Part Time', 'part-time'),
  ('Fresh Graduate', 'fresh-graduate'),
  ('Remote', 'remote')
ON CONFLICT (slug) DO NOTHING;
