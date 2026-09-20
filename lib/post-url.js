export function slugifyTitle(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 110)
    .replace(/-+$/, '');
}

export function postPath(type, post) {
  const prefix = type === 'job' ? 'loker' : 'artikel';
  return `/${prefix}/${slugifyTitle(post?.title)}-${post?.id}`;
}

export function postIdFromParam(value) {
  const raw = String(value || '');
  if (/^\d+$/.test(raw)) return raw;
  const match = raw.match(/-(\d+)$/);
  return match?.[1] || raw;
}
