export const STATIC_JOBS = [];

export function mergeJobs(databaseJobs = []) {
  const seen = new Set();
  return databaseJobs.filter((job) => {
    const id = String(job.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
