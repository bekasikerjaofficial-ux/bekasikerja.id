export function getSafeInternalPath(value, fallback = '/') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback;
  if (value.includes('\\') || /[\u0000-\u001F\u007F]/.test(value)) return fallback;
  return value;
}
