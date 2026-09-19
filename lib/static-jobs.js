export const STATIC_JOBS = [
  {
    id: 'sam-putra-inti-people-culture-head',
    title: 'People and Culture Head',
    company: 'PT. Sam Putra Inti',
    location: 'Bekasi, Jawa Barat',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    content: 'Lowongan People and Culture Head di PT. Sam Putra Inti. Gaji Rp8-10jt/bulan, Full Time. Kirim lamaran sekarang!',
  },
];

export function mergeJobs(databaseJobs = []) {
  const seen = new Set();
  return [...STATIC_JOBS, ...databaseJobs].filter((job) => {
    const id = String(job.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
