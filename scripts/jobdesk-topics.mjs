/**
 * Job Desk topic bank for the zero-cost rotating publisher.
 *
 * Entries are deliberately terse: short factual phrases only. The publisher
 * (scripts/publish-jobdesk-rotating.mjs) expands them into article prose from
 * templates, so this file stays easy to extend without bloating.
 *
 * Rules for new entries:
 *   - role: a real job title common in the Bekasi/Cikarang/Karawang corridor.
 *   - city: MUST be exactly 'Bekasi', 'Cikarang', or 'Karawang'.
 *   - tugas / skill: exactly 6 short phrases each.
 *   - tips: exactly 4 short phrases.
 *   - bunch: 2-3 words naming the work area, used in the intro sentence.
 *
 * The publisher fails closed when the bank is empty or has a bad city.
 */
export const TOPICS = [
  {
    role: 'Teknisi Mesin',
    city: 'Cikarang',
    bunch: 'industri manufaktur',
    tugas: [
      'Memeriksa kondisi mesin sesuai jadwal preventif.',
      'Memperbaiki kerusakan mesin ringan sejak dini.',
      'Mengganti komponen yang rusak atau aus.',
      'Mencatat hasil pemeriksaan pada logbook mesin.',
      'Melaporkan kerusakan besar kepada teknisi senior.',
      'Memastikan mesin aman dioperasikan kembali.',
    ],
    skill: [
      'Memahami cara kerja mesin dan komponennya.',
      'Terbiasa memakai alat ukur dan alat bongkar-pasang.',
      'Konsisten menjalankan pemeriksaan preventif.',
      'Mampu membaca gambar teknik sederhana.',
      'Teliti mencatat kondisi dan tindakan perbaikan.',
      'Disiplin memakai alat pelindung diri.',
    ],
    tips: [
      'Sebutkan pengalaman teknisi atau maintenance.',
      'Tunjukkan pemahaman pemeriksaan mesin berkala.',
      'Jelaskan pengalaman memakai alat ukur.',
      'Sebutkan ketersediaan untuk sistem shift.',
    ],
  },
  {
    role: 'Staff QC Lab',
    city: 'Bekasi',
    bunch: 'laboratorium mutu',
    tugas: [
      'Melakukan pengujian sesuai prosedur laboratorium.',
      'Mencatat hasil uji dan membandingkannya dengan standar.',
      'Menyimpan sampel dan data uji secara rapi.',
      'Mengulang pengujian yang hasilnya tidak sesuai.',
      'Mengawasi kondisi alat ukur sebelum dipakai.',
      'Memberi tahu supervisor bila ada hasil di luar standar.',
    ],
    skill: [
      'Konsisten mengikuti prosedur pengujian.',
      'Teliti mencatat dan membaca hasil uji.',
      'Memahami dasar pengukuran dan alat ukur.',
      'Terbiasa menjaga kerapian data laboratorium.',
      'Berhati-hati saat mengoperasikan alat ukur.',
      'Mampu bekerja dengan standar mutu yang ketat.',
    ],
    tips: [
      'Sebutkan pengalaman QC, QA, atau laboran.',
      'Telaskan pengalaman mengikuti prosedur pengujian.',
      'Jelaskan pengalaman ketelitian pada data.',
      'Sebutkan ketersediaan untuk sistem shift.',
    ],
  },
  {
    role: 'Supervisor Produksi',
    city: 'Karawang',
    bunch: 'lining produksi',
    tugas: [
      'Mengatur target harian tim produksi.',
      'Memastikan prosedur kerja dijalankan sesuai standar.',
      'Menangani kendala yang muncul di lapangan.',
      'Mencatat capaian produksi setiap shift.',
      'Mengatur penempatan anggota tim di setiap mesin.',
      'Melaporkan hasil produksi kepada manajemen.',
    ],
    skill: [
      'Mampu memimpin tim kerja lapangan.',
      'Memahami alur proses produksi.',
      'Konsisten dalam menerapkan prosedur kerja.',
      'Mampu mengambil keputusan cepat di lapangan.',
      'Terbiasa bekerja dengan sistem shift.',
      'Mampu berkomunikasi dengan baik ke tim.',
    ],
    tips: [
      'Sebutkan pengalaman memimpin tim produksi.',
      'Tunjukkan pemahaman prosedur kerja dan target harian.',
      'Jelaskan pengalaman menangani kendala lapangan.',
      'Sebutkan ketersediaan untuk sistem shift.',
    ],
  },
  {
    role: 'Operator Forklift',
    city: 'Cikarang',
    bunch: 'area pergudangan',
    tugas: [
      'Mengangkut material sesuai jadwal pemindahan.',
      'Menyusun material di lokasi rak yang ditentukan.',
      'Memeriksa kondisi forklift sebelum digunakan.',
      'Mencatat setiap pemindahan barang pada formulir.',
      'Melaporkan kerusakan forklift kepada teknisi.',
      'Menjaga area manuver tetap aman dan bersih.',
    ],
    skill: [
      'Memiliki sertifikat handling forklift yang berlaku.',
      'Terbiasa mengoperasikan forklift tipe reach truck.',
      'Mampu menata material dengan rapi.',
      'Teliti mengikuti aturan keselamatan forklift.',
      'Memahami prosedur pemindahan barang di gudang.',
      'Mampu bekerja mengikuti sistem shift.',
    ],
    tips: [
      'Cantumkan sertifikat forklift yang masih berlaku.',
      'Sebutkan pengalaman mengoperasikan reach truck.',
      'Tunjukkan kepatuhan pada aturan keselamatan kerja.',
      'Sebutkan ketersediaan untuk sistem shift.',
    ],
  },
  {
    role: 'Pramuniaga',
    city: 'Bekasi',
    bunch: 'peritel',
    tugas: [
      'Melayani pelanggan dengan sikap yang ramah.',
      'Mencatat transaksi penjualan di kasir.',
      'Merapikan rak dan|display produk secara berkala.',
      'Menjawab pertanyaan pelanggan tentang produk.',
      'Menerima barang dan mencocokkan dengan faktur.',
      'Melaporkan selisih stok kepada atasan.',
    ],
    skill: [
      'Sabar dalamayanan pelanggan.',
      'Teliti saat memproses transaksi pembayaran.',
      'Mampu menjelaskan produk dengan baik.',
      'Terbiasa merapikan dan menata display produk.',
      'Mampu bekerja dengan ritme kerja cepat.',
      'Komunikatif danOriented ke pelanggan.',
    ],
    tips: [
      'Sebutkan pengalaman retail atau penjualan.',
      'Tunjukkan kemampuan communicasi dengan pelanggan.',
      'Jelaskan ketersediaan untuk kerja shift.',
      'Tuliskan ketersediaan mulai kapan bisa bekerja.',
    ],
  },
];
